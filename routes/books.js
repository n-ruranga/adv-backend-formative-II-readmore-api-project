const express = require('express');
const { createBook, getAllBooks } = require('../controllers/booksController');

const router = express.Router();

router.post('/', createBook);
router.get('/', getAllBooks);

module.exports = router;
