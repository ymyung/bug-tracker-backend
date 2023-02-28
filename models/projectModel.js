const mongoose = require('mongoose')
const ticketSchema = require('./ticketModel').schema

const Schema = mongoose.Schema

const projectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    devs: {
        type: Array,
        required: false
    }, 
    tickets: [{
        type: Schema.Types.ObjectId,
        ref: 'Ticket'
      }]
}, {timestamps: true})

module.exports = mongoose.model('Project', projectSchema)