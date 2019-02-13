window.onload = function () {
  //#region GLOBAL VARIABLES
  const titleInput = document.getElementById('title');
  const authorInput = document.getElementById('author');
  const ISBNInput = document.getElementById('ISBN');
  const category = document.getElementById('category');
  let categoryValue;
  let bookID = 1;
  let booksArray;

  //#region get All Books Arr
  async function getBooksArr() {
    await axios.get('http://10.10.0.227:1234/upload')
      .then((response) => booksArray = response.data.books)
      .catch((error) => console.log(error));
  };
  getBooksArr();

  //#endregion

  //#endregion

  //#region mandatoryStars EventListener
  const mandatoryStars = document.getElementsByClassName('mandatory');
  for (let i = 0; i < mandatoryStars.length; i++) {
    mandatoryStars[i].addEventListener('click', showPopUp);
    mandatoryStars[i].addEventListener('mouseover', showPopUp);
  }

  function showPopUp() {
    const mandatoryPopUp = document.getElementsByClassName('popUpCSS');
    this.nextElementSibling.style.display = 'block';
    setTimeout(() => {
      this.nextElementSibling.style.display = 'none';
    }, 1500);
  }
  //#endregion

  //#region createBook
  function createBook(book) {
    axios.post('http://10.10.0.227:1234/upload', book)
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }
  //#endregion

  //#region Add Book Btn
  const addBtn = document.getElementById('add');
  addBtn.addEventListener('click', addBook);

  async function addBook(e) {
    e.preventDefault();
    const titleBool = Validate.title(titleInput.value.trim());
    if (titleBool === false) return;
    const authorBool = Validate.author(authorInput.value.trim());
    if (authorBool === false) return;
    const ISBNBool = (ISBNInput.value === undefined) ? Validate.ISBNlength(ISBNInput.value) : Validate.ISBNlength(ISBNInput.value.trim());
    if (ISBNBool === false) return;
    categoryValue = category.value; // save value if input field is NOT empty
    const categoryBool = Validate.category(category.value.trim());
    if (categoryBool === false) return;

    const book = {
      titleInputValue: titleInput.value.trim(),
      authorInputValue: authorInput.value.trim(),
      ISBNInputValue: Number(ISBNInput.value.trim()),
      categoryValue: categoryValue.trim(),
    };
    Validate.uniqueBookParams(book);
    await getBooksArr();
    await showAllBooks();
  }
  //#endregion

  //#region Show All Books Btn
  const showAllBooksBtn = document.getElementById('showAllBooks');
  showAllBooksBtn.addEventListener('click', showAllBooks);

  const booksContainer = document.getElementById('booksContainer');

  async function showAllBooks(str = '') {
    event.preventDefault();

    await getBooksArr();

    let booksArrCopy = booksArray.slice();
    if (booksArrCopy.length === 0) return booksContainer.innerHTML = 'Sorry, no books found!';

    if (str === 'byCategories') booksArrCopy = booksArrCopy.sort((a, b) => a.categoryValue > b.categoryValue);
    if (str === 'byAuthor') booksArrCopy = booksArrCopy.sort((a, b) => a.authorInputValue > b.authorInputValue);

    let HTMLstr = '';
    booksArrCopy.forEach(obj => {
      HTMLstr += `<div>Title: ${obj.titleInputValue}, Author: ${obj.authorInputValue}, ISBN: ${obj.ISBNInputValue}, Category: ${obj.categoryValue}</div>`;
    });
    booksContainer.innerHTML = HTMLstr;

    // prepare all books in container to be clicked
    const allBooksInContainerArr = booksContainer.children;
    for (let i = 0; i < allBooksInContainerArr.length; i++) {
      allBooksInContainerArr[i].addEventListener('click', (e) => e.target.classList.toggle('clicked'));
    }
  }
  //#endregion

  //#region Sort By Categories Btn
  const sortByCategories = document.getElementById('sortByCategories');
  sortByCategories.addEventListener('click', () => showAllBooks('byCategories'));
  //#endregion

  //#region Sort By Author Btn
  const sortByAuthor = document.getElementById('sortByAuthor');
  sortByAuthor.addEventListener('click', () => showAllBooks('byAuthor'));
  //#endregion

  //#region show All Categories Btn
  const showAllCategories = document.getElementById('showAllCategories');
  showAllCategories.addEventListener('click', showAllCategoriesFunc);

  function showAllCategoriesFunc(e) {
    e.preventDefault();

    if (booksArray.length === 0) return booksContainer.innerHTML = 'Sorry, no books found!';

    let categoryArr = [];
    booksArray.forEach(obj => {
      if (!categoryArr.includes(obj.categoryValue)) {
        categoryArr.push(obj.categoryValue);
      }
    });
    const resultStr = categoryArr.sort().join(', ');
    booksContainer.innerHTML = `All book categories: ${resultStr}`;
  }
  //#endregion

  //#region Delete Btn
  const deleteBtn = document.getElementById('delete');
  deleteBtn.addEventListener('click', deleteSelected);

  function deleteSelected(e) {
    e.preventDefault();

    const itemsToDeleteArr = Array.from(document.getElementsByClassName('clicked'));
    itemsToDeleteArr.forEach(div => div.remove());
  }

  //#endregion

  //#region Delete All Btn
  const deleteAll = document.getElementById('deleteAll');
  deleteAll.addEventListener('click', deleteAllBooks);

  async function deleteAllBooks(e) {
    e.preventDefault();

    await axios.delete('http://10.10.0.227:1234/delete', booksArray)
      .then((response) => {
        booksArray = response.data.books;
      })
      .catch((error) => console.log(error));

    await showAllBooks();
  }
  //#endregion

  //#region Validate user inputs
  const Validate = {
    title(str) {
      if (str.length < 2 || str.length > 100) {
        alert(`Length of 'Title' must be between 2 and 100 characters`);
        return false;
      } else {
        return true;
      }
    },
    author(str) {
      if (str === '') {
        alert(`'Author' must have at least 1 characters`);
        return false;
      } else {
        return true;
      }
    },
    ISBNlength(num) {
      if ((isNaN(num) || num === 0) || (num.toString().length !== 10 && num.toString().length !== 13)) {
        alert(`'ISBN' must be a number, 10 or 13 digits`);
        return false;
      } else {
        return true;
      }
    },
    category(str) {
      if (str.length === 0) categoryValue = 'uncategorised';
      if (str.length > 100) {
        alert(`'Category' must be less than 100 characters`);
        return false;
      } else {
        return true;
      }
    },
    async uniqueBookParams(book) {
      for (let i = 0; i < booksArray.length; i++) { // show alert and clear the correct input field
        if (booksArray[i].titleInputValue === book.titleInputValue) {
          alert('Such Title already exists');
          titleInput.value = '';
          titleInput.style.backgroundColor = '#ff4b4b';
          titleInput.focus();
          return;
        } else {
          titleInput.style.backgroundColor = '#17181C';
        };
        if (booksArray[i].authorInputValue === book.authorInputValue) {
          alert('Such Author already exists');
          authorInput.value = '';
          authorInput.style.backgroundColor = '#ff4b4b';
          authorInput.focus();
          return;
        } else {
          authorInput.style.backgroundColor = '#17181C';
        };
        if (Number(booksArray[i].ISBNInputValue) === book.ISBNInputValue) {
          alert('Such ISBN already exists');
          ISBNInput.value = '';
          ISBNInput.style.backgroundColor = '#ff4b4b';
          ISBNInput.focus();
          return;
        } else {
          ISBNInput.style.backgroundColor = '#17181C';
        };
      }

      book.id = bookID++;

      await createBook(book);

      titleInput.value = '';
      authorInput.value = '';
      ISBNInput.value = '';
      category.value = '';
    }
  }
  //#endregion
}