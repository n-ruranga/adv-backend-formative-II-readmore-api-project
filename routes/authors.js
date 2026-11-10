const express = require('express');
const { createAuthor, getAllAuthors } = require('../controllers/authorsController');

const router = express.Router();

router.post('/', createAuthor);
router.get('/', getAllAuthors);

module.exports = router;
