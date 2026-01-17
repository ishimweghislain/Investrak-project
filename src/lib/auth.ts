import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthUser {
    id: string;
    username: string;
    email: string;
    role: 'ADMIN' | 'INVESTOR';
    company?: string;
}

export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return null;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
        return decoded;
    } catch (error) {
        return null;
    }
}
