// models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  user: {  // ✅ Changed from 'author' to 'user'
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  longDescription: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  technologies: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    enum: ['web', 'mobile', 'desktop', 'other'],
    default: 'web'
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'planned'],
    default: 'completed'
  },
  featured: {
    type: Boolean,
    default: false
  },
  links: {
    live: String,
    github: String,
    demo: String
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  client: {
    type: String
  },
  role: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Project', projectSchema);