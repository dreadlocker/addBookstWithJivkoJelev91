var Book = require("../models/books");

module.exports = app => {
    app.post('/upload', (req, res) => {
        const {
            titleInputValue,
            authorInputValue,
            ISBNInputValue,
            categoryValue
        } = req.body;

        var newBook = new Book({
            titleInputValue: titleInputValue,
            authorInputValue: authorInputValue,
            ISBNInputValue: ISBNInputValue,
            categoryValue: categoryValue
        }).save((err) => {
            if (err) return console.log(err);
            res.send({
                success: true,
                message: 'Book saved successfully!'
            })
        })
    });

    app.get('/upload', (req, res) => {
        Book.find({}, (error, books) => {
            if (error) {
                return console.error(error);
            }
            res.send({
                books: books
            })
        }).sort({
            _id: -1
        })
    });

    app.delete('/delete', (req, res) => {
        Book.remove({}, (err, books) => {
            res.send({
                success: true,
                message: 'Books are delete',
                books: books
            });
        })
    });

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};