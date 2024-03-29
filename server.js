require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const projectRoute = require('./routes/projectRoute')
const ticketRoute = require('./routes/ticketRoute')
const userRoute = require('./routes/userRoute')

// express app
const app = express()

// cors
app.use(cors())

// middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/project', projectRoute)
app.use('/ticket', ticketRoute)
app.use('/user', userRoute)

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //  listen for requests
        app.listen(process.env.PORT, () => {
            console.log('Connected to MongoDB and listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })