require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./config/db');
const swaggerSpec = require('./utils/swagger');

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const projectRoutes = require('./routes/projectRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const { errorHandler } = require('./middleware/errorHandler');

// ✅ connect DB once
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔥 ADD THIS (CORS CONFIG SEPARATE)
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://kognivex.in',
    'https://www.kognivex.in'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middlewares
app.use(helmet());

// 🔥 ADD THIS (preflight fix - VERY IMPORTANT)
app.options('*', cors(corsOptions));

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Kognivex MERN API Server',
    status: 'Running',
    frontend: 'https://kognivex.in',
    apiDocs: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      blogs: '/api/blogs',
      projects: '/api/projects'
    }
  });
});

// Error handler
app.use(errorHandler);

// ✅ EXPORT FOR VERCEL
module.exports = app;

// ✅ Run locally (node server.js)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
