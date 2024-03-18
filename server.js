const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 8000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

let Home = require('./pages/home');
let Books = require('./pages/books');
let BooksStatus = require('./pages/books_status');
let Authors = require('./pages/authors');
let BookDetails = require('./pages/book_details');
let CreateBook = require('./pages/create_book');


const mongoose = require('mongoose');
const mongoDB = "mongodb://127.0.0.1:27017/my_library_db";
// mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', function() {
  console.log('Connected to database');
});
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());

let BookInstance = require('./models/bookinstance');
let Book = require('./models/book');

app.get('/home', (_, res) => {
  Home.show_home(res);
})

app.get('/available', (_, res) => {
  BookInstance.find({status: 'Available'})
    .populate('book')
    .then(bookInstances => {
      const availableBooks = bookInstances.map(bi => ({
        title: bi.book.title,
        status: bi.status
      }));
      res.send(availableBooks);
    })
    .catch(err => res.status(500).send('Error retrieving available books: ' + err));
})

app.get('/books', (_, res) => {
  Books.show_books()
    .then((data) => res.send(data))
    .catch((_) => res.send('No books found'));
})

let Author = require('./models/author');

app.get('/authors', (_, res) => {
  Author.find({})
    .then(authors => {
      const authorsList = authors.map(author => ({
        name: author.name, // Utilizing the virtual property for author's full name
        lifespan: author.lifespan // Utilizing the virtual property for author's lifespan
      }));
      res.send(authorsList);
    })
    .catch(err => res.status(500).send('Error retrieving authors: ' + err));
});

app.get('/book_dtls', (req, res) => {
  BookDetails.show_book_dtls(res, req.query.id);
})

app.post('/newbook', (req, res) => {
    const familyName = req.body.familyName;
    const firstName = req.body.firstName;
    const genreName = req.body.genreName;
    const bookTitle = req.body.bookTitle;
    if(familyName && firstName && genreName && bookTitle) {
        CreateBook.new_book(res, familyName, firstName, genreName, bookTitle).catch(err => {
                res.send('Failed to create new book ' + err);
              });
    }
    else {
        res.send('Invalid Inputs');
    }

})
