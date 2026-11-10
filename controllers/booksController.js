const Book = require('../models/Book');

async function createBook(req, res) {
  try {
    const { title, genre, price, publishedYear, author } = req.body;
    const book = await Book.create({ title, genre, price, publishedYear, author });
    res.status(201).json(book);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to create book' });
  }
}

async function getAllBooks(req, res) {
  try {
    const books = await Book.find().populate('author');
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books' });
  }
}

module.exports = {
  createBook,
  getAllBooks,
};
