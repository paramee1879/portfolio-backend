// routes/blogRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  addComment
} from '../controllers/blogController.js';

const router = express.Router();

router.route('/')
  .get(getAllBlogs)
  .post(protect, createBlog);

router.get('/id/:id', getBlogById);
router.get('/:slug', getBlogBySlug);

router.route('/:id')
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

router.post('/:id/comments', addComment);

export default router;