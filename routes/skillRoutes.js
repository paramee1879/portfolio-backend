// routes/skillRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill
} from '../controllers/skillController.js';

const router = express.Router();

router.route('/')
  .get(getAllSkills)
  .post(protect, createSkill);

router.route('/:id')
  .get(getSkillById)
  .put(protect, updateSkill)
  .delete(protect, deleteSkill);

export default router;