const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    content: {
      type: String,
      required: true
    },
    excerpt: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: 'General'
    },
    author: {
      type: String,
      default: 'Kognivex'
    },
    featuredImage: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
