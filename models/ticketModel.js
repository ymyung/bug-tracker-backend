const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ticketSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, 
    dev: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
    priority: {
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