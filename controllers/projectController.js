const Project = require('../models/Project');
const generateSlug = require('../utils/generateSlug');

const parseTech = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

exports.createProject = async (req, res, next) => {
  try {
    const { title, description, technologies, liveUrl, githubUrl, status } = req.body;
    const images = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];
    const slug = generateSlug(title);
    const project = await Project.create({
      title,
      slug,
      description,
      technologies: parseTech(technologies),
      images,
      liveUrl,
      githubUrl,
      status: status || 'draft'
    });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

exports.getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, status: 'published' });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const { title, description, technologies, liveUrl, githubUrl, status } = req.body;
    if (title) {
      project.title = title;
      project.slug = generateSlug(title);
    }
    if (description) project.description = description;
    if (technologies) project.technologies = parseTech(technologies);
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (githubUrl !== undefined) project.githubUrl = githubUrl;
    if (status) project.status = status;
    if (req.files && req.files.length) {
      project.images = req.files.map((file) => `/uploads/${file.filename}`);
    }
    await project.save();
    res.json(project);
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};
