const express = require('express');
const router = express.Router();
const {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket
} = require('../controllers/ticketController');

// get all tickets
router.get('/', getTickets);

// get a single ticket
router.get('/:id', getTicket);

// post a new ticket
router.post('/', createTicket);

// update a ticket
router.patch('/:id', updateTicket);

// delete a ticket
router.delete('/:id', deleteTicket);

module.exports = router;