const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// get all users
router.get('/', getUsers);

// get a single user
router.get('/:id', getUser);

// post a new user
router.post('/', createUser);

// update a user
router.patch('/:id', updateUser);

// delete a user
router.delete('/:id', deleteUser);

module.exports = router;
