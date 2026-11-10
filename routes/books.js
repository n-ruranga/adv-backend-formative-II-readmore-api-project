const express = require('express');
const {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
} = require('../controllers/booksController');

const router = express.Router();

router.post('/', createBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.put('/:id', updateBook);

module.exports = router;
