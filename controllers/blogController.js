const Blog = require('../models/Blog');
const generateSlug = require('../utils/generateSlug');

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
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

exports.getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (error) {
    next(error);
  }
};

exports.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (error) {
    next(error);
  }
};

exports.getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

exports.getBlogBySlugAdmin = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
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
    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    await blog.deleteOne();
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    next(error);
  }
};
