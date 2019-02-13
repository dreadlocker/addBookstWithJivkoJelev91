var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BookSchema = new Schema({
  titleInputValue: { type: String, required: true },
  authorInputValue: { type: String, required: true },
  ISBNInputValue: { type: String, required: true },
  categoryValue: String,
});

var Book = mongoose.model("Book", BookSchema);
module.exports = Book;