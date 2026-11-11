const Author = require('../models/Author');
const Book = require('../models/Book');

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

async function deleteAuthor(req, res) {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    // Policy A: block delete while the author still has books (avoids orphans)
    const bookCount = await Book.countDocuments({ author: req.params.id });
    if (bookCount > 0) {
      return res.status(409).json({
        message: `Cannot delete author while they still have ${bookCount} book(s). Remove or reassign the books first.`,
      });
    }

    await Author.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Author deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.status(500).json({ message: 'Failed to delete author' });
  }
}

async function getAuthorBooks(req, res) {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const books = await Book.find({ author: req.params.id }).populate('author');
    res.status(200).json(books);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.status(500).json({ message: 'Failed to fetch author books' });
  }
}

async function getAuthorStats(req, res) {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const books = await Book.find({ author: req.params.id });

    if (books.length === 0) {
      return res.status(200).json({
        author: author.name,
        bookCount: 0,
        averagePrice: 0,
        cheapestBook: null,
        mostExpensiveBook: null,
      });
    }

    const totalPrice = books.reduce((sum, book) => sum + book.price, 0);
    const averagePrice = Number((totalPrice / books.length).toFixed(2));

    let cheapest = books[0];
    let mostExpensive = books[0];

    for (const book of books) {
      if (book.price < cheapest.price) {
        cheapest = book;
      }
      if (book.price > mostExpensive.price) {
        mostExpensive = book;
      }
    }

    res.status(200).json({
      author: author.name,
      bookCount: books.length,
      averagePrice,
      cheapestBook: cheapest.title,
      mostExpensiveBook: mostExpensive.title,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.status(500).json({ message: 'Failed to fetch author stats' });
  }
}

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
  getAuthorBooks,
  getAuthorStats,
};
