const Blog = require('../models/Blog');
const generateSlug = require('../utils/generateSlug');

// CREATE BLOG
exports.createBlog = async (req, res, next) => {
  try {
    const { title, content, excerpt, status, category, author } = req.body;

    const featuredImage = req.file ? `/uploads/${req.file.filename}` : '';
    const slug = generateSlug(title);

    const blog = await Blog.create({
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      image: featuredImage,
      category: category || 'General',
      author: author || 'Kognivex',
      status: status || 'draft'
    });

    res.status(201).json(blog); // ✅ FIX
  } catch (error) {
    console.error('❌ createBlog error:', error);
    res.status(500).json({ message: 'Failed to create blog' });
  }
};

// GET BLOGS (PUBLIC)
exports.getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });

    res.status(200).json(blogs); // ✅ FIX (IMPORTANT)
  } catch (error) {
    console.error('❌ getBlogs error:', error);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
};

// GET ALL BLOGS (ADMIN)
exports.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });

    res.status(200).json(blogs); // ✅ FIX
  } catch (error) {
    console.error('❌ getAllBlogs error:', error);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
};

// GET BLOG BY SLUG (PUBLIC)
exports.getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      status: 'published'
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(blog); // ✅ FIX
  } catch (error) {
    console.error('❌ getBlogBySlug error:', error);
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
};

// GET BLOG BY SLUG (ADMIN)
exports.getBlogBySlugAdmin = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(blog); // ✅ FIX
  } catch (error) {
    console.error('❌ getBlogBySlugAdmin error:', error);
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
};

// UPDATE BLOG
exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const { title, content, excerpt, status, category, author } = req.body;

    if (title) {
      blog.title = title;
      blog.slug = generateSlug(title);
    }

    if (content) blog.content = content;
    if (excerpt) blog.excerpt = excerpt;
    if (status) blog.status = status;
    if (category) blog.category = category;
    if (author) blog.author = author;

    if (req.file) {
      blog.featuredImage = `/uploads/${req.file.filename}`;
      blog.image = blog.featuredImage;
    }

    await blog.save();

    res.status(200).json(blog); // ✅ FIX
  } catch (error) {
    console.error('❌ updateBlog error:', error);
    res.status(500).json({ message: 'Failed to update blog' });
  }
};

// DELETE BLOG
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await blog.deleteOne();

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('❌ deleteBlog error:', error);
    res.status(500).json({ message: 'Failed to delete blog' });
  }
};
