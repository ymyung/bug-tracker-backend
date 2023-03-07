const Project = require('../models/projectModel')
const User = require('../models/userModel')
const Ticket = require('../models/ticketModel')
const mongoose = require('mongoose')

// get all workouts
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({}).sort({createdAt: -1})
        .populate({
            path: 'devs',
            select: 'username email role image'
        })
        .populate({
            path: 'tickets',
            select: 'title description createdBy dev dateCreated dueDate type priority status dateResolved'
        })

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
    .populate({
        path: 'devs',
        select: 'username email role image'
    })
    .populate({
        path: 'tickets',
        select: 'title description createdBy dev dateCreated dueDate type priority status dateResolved'
    })

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
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid project ID" });
    }
  
    try {
        const project = await Project.findOneAndDelete({ _id: id });
  
    if (!project) {
        return res.status(404).json({ error: "No such project exists" });
    }
  
    return res.status(200).json({
        message: `Project ${project.title} has been deleted.`,
    });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// add developers to a project
const addDeveloperToProject = async (req, res) => {
    const { id } = req.params
    const { _id } = req.body

    if(!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json({error: 'No such project'})
    }

    try {
        const user = await User.findById(_id)
        if (!user) {
            res.status(400).json('User does not exist')
        }

        const project = await Project.findOneAndUpdate({_id: id}, {
            $addToSet: {
                devs: user._id
            }
        }, { new: true })

        res.status(200).json(project)
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json('User already exists in the project');
        }
        res.status(400).json({ error: error.message });
    }
}

// Add a ticket to a project
const addTicketToProject = async (req, res) => {
    const { projectId } = req.params;
    const { _id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json({ error: 'Invalid project or ticket ID' });
    }
    try {
        const ticket =  await Ticket.findById(_id)
        if (!ticket) {
            res.status(400).json('Ticket does not exist')
        }

        const project = await Project.findByIdAndUpdate({_id: projectId}, {
            $addToSet: {
                tickets: ticket._id
            }
        }, { new: true });

        res.status(200).json(project);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json('Ticket already exists in the project');
        }
        res.status(400).json({ error: error.message });
    }
};
  
// Remove a ticket from a project
const removeTicketFromProject = async (req, res) => {
    const { projectId } = req.params;
    const { _id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json({ error: 'Invalid project or ticket ID' });
    }

    try {
        const ticket = Ticket.findById(_id)
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        const project = await Project.findByIdAndUpdate(projectId, {
            $pull: {
                tickets: ticket._id
            }
        }, { new: true });
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
    addDeveloperToProject,
    addTicketToProject,
    removeTicketFromProject
}