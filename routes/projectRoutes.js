const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProjectBySlug, updateProject, deleteProject } = require('../controllers/projectController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);
router.post('/', authMiddleware, roleMiddleware('admin'), upload.array('images', 5), createProject);
router.put('/:id', authMiddleware, roleMiddleware('admin'), upload.array('images', 5), updateProject);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteProject);

module.exports = router;
