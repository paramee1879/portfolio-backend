// controllers/projectController.js
import Project from '../models/Project.js';

// @route   GET /api/projects
// @desc    Get all projects (PUBLIC - no auth required)
export const getAllProjects = async (req, res, next) => {
  try {
    const { category, status, featured, user } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (featured) filter.featured = featured === 'true';
    if (user) filter.user = user; // Filter by specific user ID

    const projects = await Project.find(filter)
      .populate('user', 'name email avatar')
      .sort('-createdAt');
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/projects/my
// @desc    Get MY projects only (PROTECTED)
export const getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ user: req.user._id })
      .populate('user', 'name email avatar')
      .sort('-createdAt');
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/projects/:id
// @desc    Get single project (PUBLIC)
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('user', 'name email avatar');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/projects
// @desc    Create project (PROTECTED)
export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create({
      ...req.body,
      user: req.user._id
    });
    
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/projects/:id
// @desc    Update project (PROTECTED - owner only)
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if project belongs to user
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email avatar');
    
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/projects/:id
// @desc    Delete project (PROTECTED - owner only)
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if project belongs to user
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }
    
    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
