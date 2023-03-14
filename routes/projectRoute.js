const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  editProject,
  deleteProject,
  addDeveloperToProject,
  removeDeveloperFromProject,
  addTicketToProject,
  removeTicketFromProject
} = require('../controllers/projectController');
const requireAuth = require('../middleware/requireAuth')

// check if user is logged in
router.use(requireAuth)

// Get all projects
router.get('/', getProjects);

// Get a single project
router.get('/:id', getProject);

// Post a new project
router.post('/', createProject);

// Edit a project
router.patch('/:id', editProject)

// Delete a project
router.delete('/:id', deleteProject);

// Add dev to a project
router.patch('/addDeveloper/:projectId', addDeveloperToProject);

// Remove Dev and dev's tickets from project
router.patch('/removeDeveloper/:projectId', removeDeveloperFromProject)

// Add a ticket to a project and user
router.patch('/addTicket/:projectId', addTicketToProject);

// Remove a ticket from a project and user 
router.patch('/deleteTicket/:projectId', removeTicketFromProject);

module.exports = router;