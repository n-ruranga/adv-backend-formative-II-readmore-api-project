const express = require('express');
const {
  createBook,
  getAllBooks,
  getBookById,
} = require('../controllers/booksController');

const router = express.Router();

router.post('/', createBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);

module.exports = router;
