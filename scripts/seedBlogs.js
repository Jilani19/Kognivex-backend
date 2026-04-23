require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const generateSlug = require('../utils/generateSlug');

const samples = [
  {
    title: 'Designing Scalable MERN Architecture for Growth',
    excerpt:
      'A practical blueprint for scaling MERN apps: boundaries, data modeling, and deployment patterns that prevent rewrites.',
    category: 'Engineering',
    author: 'Kognivex Team',
    status: 'published',
    image:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=70',
    content:
      'Scaling MERN is less about adding servers and more about making the system easy to evolve. Start with clear module boundaries, predictable API contracts, and a data model that supports change. Add validation, consistent error responses, and logging early—these are the foundations of velocity. Finally, set up repeatable deployments and monitoring so growth does not become chaos.'
  },
  {
    title: 'Admin Dashboards that Don’t Break Under Real Data',
    excerpt:
      'How to build admin CRUD screens that remain usable with thousands of records: paging, filtering, and safe actions.',
    category: 'Product',
    author: 'Kognivex Team',
    status: 'published',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=70',
    content:
      'Admin UX must handle real-world scale. Use consistent loading/empty/error states, stable table layouts, and guardrails for destructive actions. On the backend, validate inputs and keep responses consistent. On the frontend, centralize API handling and bubble up human-readable errors. This prevents “mystery failures” that waste time.'
  },
  {
    title: 'Why Your API Errors Should Be Boring',
    excerpt:
      'Consistent API responses reduce bugs, speed up debugging, and improve reliability across frontend and admin panels.',
    category: 'Backend',
    author: 'Kognivex Team',
    status: 'published',
    image:
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=70',
    content:
      'Boring errors are good. Return `{ success, data, message }` consistently and never hide failures behind vague client-side messages. Use HTTP status codes correctly, validate request bodies, and log traceable errors. When you do this, the frontend can display meaningful feedback, and developers can fix issues quickly.'
  },
  {
    title: 'Performance Wins: The Fastest Improvements for React Apps',
    excerpt:
      'A high-impact checklist: reduce bundle size, avoid rerenders, optimize images, and measure what matters.',
    category: 'Web Development',
    author: 'Kognivex Team',
    status: 'published',
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=70',
    content:
      'Start with measurement. Then tackle the biggest wins: image optimization, code splitting, memoizing expensive components, and removing unnecessary re-renders. Keep API calls cached where appropriate and watch Core Web Vitals. Performance is a product feature—and it compounds.'
  },
  {
    title: 'Security Basics for Startup Web Apps',
    excerpt:
      'The essentials: auth, validation, rate limits, safe uploads, and least-privilege defaults—without slowing down delivery.',
    category: 'Security',
    author: 'Kognivex Team',
    status: 'published',
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=70',
    content:
      'Secure defaults keep teams fast. Validate inputs, use strong JWT secrets, enforce rate limits, store passwords with bcrypt, and sanitize uploads. Add CORS rules intentionally and avoid exposing admin-only data. Small improvements early prevent major incidents later.'
  }
];

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('Missing MONGO_URI in environment.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const ops = samples.map(async (s) => {
    const slug = generateSlug(s.title);
    const update = {
      ...s,
      slug,
      featuredImage: s.image
    };
    return Blog.updateOne({ slug }, { $set: update }, { upsert: true });
  });

  await Promise.all(ops);
  console.log(`Seeded/updated ${samples.length} blogs.`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

