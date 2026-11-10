const express = require('express');
const {
  createAuthor,
  getAllAuthors,
  getAuthorById,
} = require('../controllers/authorsController');

const router = express.Router();

router.post('/', createAuthor);
router.get('/', getAllAuthors);
router.get('/:id', getAuthorById);

module.exports = router;
