const express = require('express');
const { createBook } = require('../controllers/booksController');

const router = express.Router();

router.post('/', createBook);

module.exports = router;
