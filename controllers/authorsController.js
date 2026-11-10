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

async function getAuthorById(req, res) {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.status(200).json(author);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.status(500).json({ message: 'Failed to fetch author' });
  }
}

async function updateAuthor(req, res) {
  try {
    const { name, country, bio } = req.body;
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      { name, country, bio },
      { new: true, runValidators: true }
    );

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.status(200).json(author);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Author not found' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to update author' });
  }
}

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
};
