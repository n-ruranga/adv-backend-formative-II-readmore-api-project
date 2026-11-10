const express = require('express');
const {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
} = require('../controllers/authorsController');

const router = express.Router();

router.post('/', createAuthor);
router.get('/', getAllAuthors);
router.get('/:id', getAuthorById);
router.put('/:id', updateAuthor);

module.exports = router;
