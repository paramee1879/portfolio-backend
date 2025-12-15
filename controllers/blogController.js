
import Blog from '../models/Blog.js';

// @route   GET /api/blogs
// @desc    Get all blogs (PUBLIC - only published)
export const getAllBlogs = async (req, res, next) => {
  try {
    const { category, tag, featured, user } = req.query;
    let filter = { published: true }; // Only show published blogs publicly

    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (featured) filter.featured = featured === 'true';
    if (user) filter.user = user; // Filter by specific user ID

    const blogs = await Blog.find(filter)
      .populate('user', 'name email avatar')
      .sort('-createdAt');
    
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/blogs/my
// @desc    Get MY blogs (including drafts) (PROTECTED)
export const getMyBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ user: req.user._id })
      .populate('user', 'name email avatar')
      .sort('-createdAt');
    
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/blogs/slug/:slug
// @desc    Get single blog by slug (PUBLIC)
export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug,
      published: true 
    })
      .populate('user', 'name email avatar bio')
      .populate('comments.user', 'name avatar');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Increment views
    blog.views += 1;
    await blog.save();
    
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/blogs/:id
// @desc    Get single blog by ID (PUBLIC if published)
export const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('user', 'name email avatar');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/blogs
// @desc    Create blog (PROTECTED)
export const createBlog = async (req, res, next) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      user: req.user._id
    });
    
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/blogs/:id
// @desc    Update blog (PROTECTED - owner only)
export const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if blog belongs to user
    if (blog.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email avatar');
    
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/blogs/:id
// @desc    Delete blog (PROTECTED - owner only)
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if blog belongs to user
    if (blog.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }
    
    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/blogs/:id/comments
// @desc    Add comment to blog (PUBLIC)
export const addComment = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    const comment = {
      user: req.user ? req.user._id : null,
      name: req.body.name,
      email: req.body.email,
      content: req.body.content
    };
    
    blog.comments.push(comment);
    await blog.save();
    
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};