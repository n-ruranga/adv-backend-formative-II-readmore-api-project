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

module.exports = {
  createAuthor,
};
