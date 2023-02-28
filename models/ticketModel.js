const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    createdBy: {
        type: String,
        required: true
    },
    dev: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    }, 
    type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    dateResolved: {
        type: Date,
        required: false
    }
})

module.exports = mongoose.model('Ticket', ticketSchema)