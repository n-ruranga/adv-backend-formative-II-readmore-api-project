const Book = require('../models/Book');
const Author = require('../models/Author');

async function createBook(req, res) {
  try {
    const { title, genre, price, publishedYear, author } = req.body;

    const existingAuthor = await Author.findById(author);
    if (!existingAuthor) {
      return res.status(400).json({
        message: 'Cannot create book: author does not exist',
      });
    }

    if (typeof title === 'string') {
      const escapedTitle = title.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const duplicateTitle = await Book.findOne({
        author,
        title: { $regex: new RegExp(`^${escapedTitle}$`, 'i') },
      });
      if (duplicateTitle) {
        return res.status(409).json({
          message: 'This author already has a book with that title',
        });
      }
    }

    const book = await Book.create({ title, genre, price, publishedYear, author });
    res.status(201).json(book);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Cannot create book: author does not exist',
      });
    }
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
