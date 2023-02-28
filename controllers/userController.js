const User = require('../models/userModel');
const mongoose = require('mongoose');

// get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort({createdAt: -1});

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

// get a single user
const getUser = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such user'});
    }

    const user = await User.findById(id);

    if(!user) {
        return res.status(404).json({error: 'No such user'});
    }

    res.status(200).json(user);
}

// create a new user
const createUser = async (req, res) => {
    let {username, email, password, role, image} = req.body;

    // add doc to db
    try {
        const user = await User.create({username, email, password, role, image});
        res.status(200).json(user);
    } catch(error) {
        res.status(400).json({error: error.message});
    }
}

// delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such user'});
    }

    const user = await User.findOneAndDelete({_id: id});

    if(!user) {
        return res.status(400).json({error: 'No such user'});
    }

    res.status(200).json(user);
}

// update a user
const updateUser = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such user'});
    }

    const user = await User.findOneAndUpdate({_id: id}, {
        ...req.body
    });

    if(!user) {
        return res.status(400).json({error: 'No such user'});
    }

    res.status(200).json(user);
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
}