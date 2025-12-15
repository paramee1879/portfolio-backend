// controllers/projectController.js
import Project from '../models/Project.js';

// @route   GET /api/projects
// @desc    Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const { category, status, featured } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (featured) filter.featured = featured === 'true';

    const projects = await Project.find(filter)
      .populate('author', 'name email')
      .sort('-createdAt');
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/projects/:id
// @desc    Get single project
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('author', 'name email avatar');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/projects
// @desc    Create project
export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      author: req.user._id
    });
    
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/projects/:id
// @desc    Update project
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/projects/:id
// @desc    Delete project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};