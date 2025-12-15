// models/Skill.js
import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['frontend', 'backend', 'database', 'devops', 'tools', 'other']
  },
  proficiency: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  icon: {
    type: String
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  yearsOfExperience: {
    type: Number,
    min: 0
  },
  description: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Skill', skillSchema);