// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

export const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => { 
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      res.sendStatus(401);
      return;
    }
  
    jwt.verify(token, JWT_SECRET, (err, user: any) => {
      if (err) {
        res.sendStatus(403);
        return;
      }
      req.user = user;
      next();
    });
  };
  
