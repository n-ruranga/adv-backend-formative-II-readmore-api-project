const Author = require('../models/Author');

async function createAuthor(req, res) {
  try {
    const { name, country, bio } = req.body;
    const author = await Author.create({ name, country, bio });
    res.status(201).json(author);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to create author' });
  }
}

async function getAllAuthors(req, res) {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch authors' });
  }
}

module.exports = {
  createAuthor,
  getAllAuthors,
};
