const express = require('express');
const router = express.Router();
const {
  createBlog,
  getBlogs,
  getAllBlogs,
  getBlogBySlug,
  getBlogBySlugAdmin,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     tags:
 *       - Blog
 *     summary: Get published blog posts.
 *     responses:
 *       200:
 *         description: Blog list returned.
 */
router.get('/', getBlogs);

router.get('/admin', authMiddleware, roleMiddleware('admin'), getAllBlogs);
router.get('/admin/:slug', authMiddleware, roleMiddleware('admin'), getBlogBySlugAdmin);

router.get('/:slug', getBlogBySlug);
router.post('/', authMiddleware, roleMiddleware('admin'), upload.single('featuredImage'), createBlog);
router.put('/:id', authMiddleware, roleMiddleware('admin'), upload.single('featuredImage'), updateBlog);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteBlog);

module.exports = router;
