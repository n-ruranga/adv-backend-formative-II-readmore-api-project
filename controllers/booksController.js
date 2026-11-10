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

async function getBookById(req, res) {
  try {
    const book = await Book.findById(req.params.id).populate('author');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(500).json({ message: 'Failed to fetch book' });
  }
}

async function updateBook(req, res) {
  try {
    const { title, genre, price, publishedYear, author } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, genre, price, publishedYear, author },
      { new: true, runValidators: true }
    ).populate('author');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to update book' });
  }
}

async function deleteBook(req, res) {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(500).json({ message: 'Failed to delete book' });
  }
}

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};
