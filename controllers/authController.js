const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '12h'
  });

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const payloadUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      };
      return res.status(200).json({
        success: true,
        token: generateToken(user._id),
        user: payloadUser
      });
    }
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (error) {
    next(error);
  }
};
