const Project = require('../models/projectModel')
const User = require('../models/userModel')
const Ticket = require('../models/ticketModel')
const mongoose = require('mongoose')

// get all projects
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({}).sort({createdAt: 1})
        .populate({
            path: 'devs',
            select: 'username email role image'
        })
        .populate({
            path: 'tickets',
            select: 'title description createdBy dev dateCreated dueDate type priority status dateResolved',
            populate: {
                path: 'dev',
                select: 'username email role'
            }
        })

        res.status(200).json(projects)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

// get a single project
const getProject = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such project'})
    }

    const project = await Project.findById(id)
    .populate({
        path: 'devs',
        select: 'username email role image tickets'
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

// create a new project
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

// edit a existing project
const editProject = async (req, res) => {
    const { id } = req.params
    const { title, description } = req.body

    try {
        const response = await Project.findByIdAndUpdate(id, {
            title: title,
            description: description
        }, { new: true })

        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({error: error})
    }
}

// delete a project
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
    const { projectId } = req.params
    const { _id } = req.body

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json({error: 'No such project'})
    }

    try {
        const user = await User.findById(_id)
        if (!user) {
            res.status(400).json('User does not exist')
        }

        const project = await Project.findOneAndUpdate({_id: projectId}, {
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

// Remove developer from a project
const removeDeveloperFromProject = async (req, res) => {
    const { projectId } = req.params
    const { _id } = req.body

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json({error: 'No such project'})
    }

    try {
        // find the user
        const user = await User.findById(_id)
        if (!user) {
            res.status(400).json('User does not exist')
        }

        // find the project and remove the user
        const project = await Project.findOneAndUpdate({_id: projectId}, {
            $pull: {
                devs: user._id
            }
        })

        // remove tickets associated with the removed user from this project
        const ticketsToRemove = await Ticket.find({ _id: { $in: project.tickets }, dev: user._id }).select('_id')
        console.log(ticketsToRemove)
        await Project.findByIdAndUpdate({ _id: projectId }, { $pull: { tickets: { $in: ticketsToRemove } } });

        // delete all tickets associated with the removed user and this project
        await Ticket.deleteMany({ _id: { $in: project.tickets }, dev: user._id })

        res.status(200).json('User removed successfully')
    } catch (error) {
        res.status(400).json({error})
    }
}

// Add ticket to project and user
const addTicketToProject = async (req, res) => {
    const { projectId } = req.params
    const { _id, userId } = req.body

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(_id) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ error: 'Invalid project, ticket ID or user ID' });
    }
    try {
        const ticket =  await Ticket.findById(_id)
        if (!ticket) {
            res.status(400).json('Ticket does not exist')
        }

        const user = await User.findById(userId)
        if (!user) {
            res.status(400).json('User does not exist')
        }

        const response = await Project.findByIdAndUpdate({_id: projectId}, {
            $addToSet: {
                tickets: ticket._id
            }
        }, { new: true });

        const response2 = await User.findOneAndUpdate({_id: userId}, {
            $addToSet: {
                tickets: ticket._id
            }
        }, { new: true })

        res.status(200).json(response2)
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
    const { _id, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(_id) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ error: 'Invalid project, ticket ID or user ID' });
    }

    try {
        const ticket = await Ticket.findById(_id)
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        const user = await User.findById(userId)
        if (!user) {
            res.status(400).json('User does not exist')
        }

        const response = await Project.findByIdAndUpdate({_id: projectId}, {
            $pull: {
                tickets: ticket._id
            }
        }, { new: true });

        const response2 = await User.findByIdAndUpdate({_id: userId}, {
            $pull: {
                tickets: ticket._id
            }
        }, { new: true })

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getProjects,
    getProject,
    createProject,
    editProject,
    deleteProject,
    addDeveloperToProject,
    removeDeveloperFromProject,
    addTicketToProject,
    removeTicketFromProject
}