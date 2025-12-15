// routes/contactRoutes.js
import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
} from '../controllers/contactController.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getAllContacts)
  .post(createContact);

router.route('/:id')
  .get(protect, admin, getContactById)
  .put(protect, admin, updateContact)
  .delete(protect, admin, deleteContact);

export default router;