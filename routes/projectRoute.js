const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  deleteProject,
  updateProject,
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

// Delete a project
router.delete('/:id', deleteProject);

// Update a project
router.patch('/:id', updateProject);

// Add a ticket to a project
router.post('/addTicket/:projectId', addTicketToProject);

// Remove a ticket from a project
router.delete('/deleteTicket/:projectId', removeTicketFromProject);

module.exports = router;