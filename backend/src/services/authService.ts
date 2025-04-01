import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const registerUser = async (email: string, password: string) => {
 const existingUser = await prisma.user.findUnique({ where: { email } });
 if (existingUser) {
 throw new Error('Email already in use');
 }

 const hashedPassword = await bcrypt.hash(password, 10);
 return prisma.user.create({
 data: {
 email,
 password: hashedPassword,
 },
 });
};

export const loginUser = async (email: string, password: string) => {
 const user = await prisma.user.findUnique({ where: { email } });
 if (!user) {
 throw new Error('User not found');
 }

 const isPasswordValid = await bcrypt.compare(password, user.password);
 if (!isPasswordValid) {
 throw new Error('Invalid password');
 }

 const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
 return { token, user: { id: user.id, email: user.email } }; // Şifreyi döndürme
};

export const getUserByEmail = async (email: string) => {
 return prisma.user.findUnique({ where: { email } });
};

export const getUserById = async (id: number) => {
 return prisma.user.findUnique({ where: { id } });
};