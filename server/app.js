const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const port = 1235;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/books');
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
    console.log("Connection Succeeded");
});

require('./config/routes')(app);

app.listen(port, () => `Server running on ${port}`);