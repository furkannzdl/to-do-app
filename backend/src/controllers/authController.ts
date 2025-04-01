
import { Request, Response } from 'express';
import * as authService from '../services/authService';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Valid email is required' });
    return;
  }
  if(!email.includes('@')){
    res.status(400).json({ error: 'Must include @ extension' });
    return;
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters long' });
    return;
  }
  try {
    const { email, password } = req.body;
    const user = await authService.registerUser(email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {

  const { email, password } = req.body;

    // Simple validation
    if (!email || typeof email !== 'string') {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    if (!password || typeof password !== 'string') {
      res.status(400).json({ error: 'Password is required' });
      return;
    }

  try {
    const { email, password } = req.body;
    const { token, user } = await authService.loginUser(email, password);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};

export const verifyToken = async (req: Request, res: Response): Promise<void> => {

  
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { id: number };
      const user = await authService.getUserById(decoded.id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ user: { id: user.id, email: user.email } });
    } catch (error) {
      res.status(403).json({ error: 'Invalid token' });
    }
  };
  