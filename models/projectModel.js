const mongoose = require('mongoose')

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
    devs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }], 
    tickets: [{
        type: Schema.Types.ObjectId,
        ref: 'Ticket'
    }]
}, {timestamps: true})

module.exports = mongoose.model('Project', projectSchema)