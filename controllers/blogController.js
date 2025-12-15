// ==========================================
// controllers/blogController.js
// ==========================================

export const getAllBlogs = async (req, res, next) => {
  try {
    const { category, tag, published, featured } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (published) filter.published = published === 'true';
    if (featured) filter.featured = featured === 'true';

    const blogs = await Blog.find(filter)
      .populate('author', 'name email avatar')
      .sort('-createdAt');
    
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('author', 'name email avatar bio')
      .populate('comments.user', 'name avatar');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    blog.views += 1;
    await blog.save();
    
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email avatar');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBlog = async (req, res, next) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      author: req.user._id
    });
    
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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