const Project = require('../models/projectModel')
const mongoose = require('mongoose')

// get all workouts
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({}).sort({createdAt: -1})

        res.status(200).json(projects)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

// get a single workout
const getProject = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such project'})
    }

    const project = await Project.findById(id)

    if(!project) {
        return res.status(404).json({error: 'No such project'})
    }

    res.status(200).json(project)
}

// create a new workout
const createProject = async (req, res) => {
    let {title, description, devs, tickets} = req.body

    // add doc to db
    try {
        const project = await Project.create({title, description, devs, tickets})
        res.status(200).json(project)
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

// delete a workout
const deleteProject = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such project'})
    }

    const project = await Project.findOneAndDelete({_id: id})

    if(!project) {
        return res.status(400).json({error: 'No such project'})
    }

    res.status(200).json(project)
}

// update a workout
const updateProject = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such project'})
    }

    const project = await Project.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if(!project) {
        return res.status(400).json({error: 'No such workout'})
    }

    res.status(200).json(project)
}

// Add a ticket to a project
const addTicketToProject = async (req, res) => {
    const { projectId } = req.params;
    const { ticketId } = req.body;
    const ticketIdObject = mongoose.Types.ObjectId(ticketId);

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(ticketId)) {
        return res.status(404).json({ error: 'Invalid project or ticket ID' });
    }
    try {
        const project = await Project.findByIdAndUpdate(projectId, { $push: { tickets: ticketIdObject } }, { new: true });
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
  
// Remove a ticket from a project
const removeTicketFromProject = async (req, res) => {
    const { projectId } = req.params;
    const { ticketId } = req.body;
    const ticketIdObject = mongoose.Types.ObjectId(ticketId);

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(ticketIdObject)) {
        return res.status(404).json({ error: 'Invalid project or ticket ID' });
    }
    try {
        const project = await Project.findByIdAndUpdate(projectId, { $pull: { tickets: ticketIdObject } }, { new: true });
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject,
    addTicketToProject,
    removeTicketFromProject
}