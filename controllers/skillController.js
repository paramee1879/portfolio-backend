// controllers/skillController.js
import Skill from '../models/skill.js';

// @route   GET /api/skills
// @desc    Get all skills
export const getAllSkills = async (req, res, next) => {
  try {
    const { category } = req.query;
    let filter = {};

    if (category) filter.category = category;

    const skills = await Skill.find(filter)
      .populate('author', 'name')
      .sort('order');
    
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/skills/:id
// @desc    Get single skill
export const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('author', 'name email');
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/skills
// @desc    Create skill
export const createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create({
      ...req.body,
      author: req.user._id
    });
    
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/skills/:id
// @desc    Update skill
export const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    if (skill.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedSkill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/skills/:id
// @desc    Delete skill
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    if (skill.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await skill.deleteOne();
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};