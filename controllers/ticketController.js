const Ticket = require('../models/ticketModel')
const mongoose = require('mongoose')

// get all tickets
const getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({}).sort({createdAt: -1})
        res.status(200).json(tickets)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

// get one ticket
const getTicket = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such ticket'})
    }
    try {
        const ticket = await Ticket.findById(id)
        if (!ticket) {
        return res.status(404).json({error: 'No such ticket'})
        }
        res.status(200).json(ticket)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

// post ticket
const createTicket = async (req, res) => {
    const ticket = new Ticket(req.body)
    try {
        await ticket.save()
        res.status(201).json(ticket)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

// update ticket
const updateTicket = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such ticket'})
    }
    try {
        const ticket = await Ticket.findByIdAndUpdate(id, req.body, { new: true })
        if (!ticket) {
        return res.status(404).json({error: 'No such ticket'})
        }
        res.status(200).json(ticket)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

// delete ticket
const deleteTicket = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such ticket'})
    }
    try {
        const ticket = await Ticket.findByIdAndDelete(id)
        if (!ticket) {
        return res.status(404).json({error: 'No such ticket'})
        }
        res.status(200).json(ticket)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    getTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket
}