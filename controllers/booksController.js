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

module.exports = {
  createBook,
};
