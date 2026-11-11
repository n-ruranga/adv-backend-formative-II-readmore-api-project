const Book = require('../models/Book');
const Author = require('../models/Author');

function getBookBusinessRuleError(price, publishedYear) {
  const currentYear = new Date().getFullYear();

  if (price !== undefined && price !== null && Number(price) <= 0) {
    return 'Price must be greater than zero';
  }

  if (publishedYear !== undefined && publishedYear !== null) {
    const year = Number(publishedYear);
    if (year < 1450) {
      return 'Published year cannot be before 1450';
    }
    if (year > currentYear) {
      return 'Published year cannot be in the future';
    }
  }

  return null;
}

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

    const businessRuleError = getBookBusinessRuleError(price, publishedYear);
    if (businessRuleError) {
      return res.status(422).json({ message: businessRuleError });
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
    const { genre, minPrice, maxPrice, author, search, sort, order, page, limit } =
      req.query;
    const filter = {};

    if (genre) {
      filter.genre = genre;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    if (author) {
      filter.author = author;
    }

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.title = { $regex: escapedSearch, $options: 'i' };
    }

    let query = Book.find(filter).populate('author');

    const allowedSortFields = ['price', 'title', 'publishedYear'];
    if (sort && allowedSortFields.includes(sort)) {
      const sortOrder = order === 'desc' ? -1 : 1;
      query = query.sort({ [sort]: sortOrder });
    }

    const total = await Book.countDocuments(filter);
    const usePagination = page !== undefined || limit !== undefined;

    if (usePagination) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      const skip = (pageNum - 1) * limitNum;

      const results = await query.skip(skip).limit(limitNum);
      return res.status(200).json({
        page: pageNum,
        limit: limitNum,
        total,
        results,
      });
    }

    const books = await query;
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

    const businessRuleError = getBookBusinessRuleError(price, publishedYear);
    if (businessRuleError) {
      return res.status(422).json({ message: businessRuleError });
    }

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
