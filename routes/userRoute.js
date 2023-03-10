const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  getUserEmail,
  signupUser,
  changePassword,
  loginUser,
  updateUser,
  addTicketUser,
  deleteUser
} = require('../controllers/userController');

// get all users
router.get('/', getUsers);

// get a single user
router.get('/:id', getUser);

// get a single user with email
router.get('/email/:email', getUserEmail)

// post/sign up a new user
router.post('/signup', signupUser);

// change user password
router.patch('/changePassword/:_id', changePassword)

// login a user
router.post('/login', loginUser);

// update a user
router.patch('/:id', updateUser);

// delete a user
router.delete('/:id', deleteUser);

module.exports = router;
