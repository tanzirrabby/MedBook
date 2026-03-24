import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const sign = (user) =>
  jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already exists' });

  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
  return res.status(201).json({ token: sign(user), user: { id: user._id, name, email } });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  return res.json({
    token: sign(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};
