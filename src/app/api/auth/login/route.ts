import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Temporary hardcoded user until we fix Prisma
const demoUser = {
  id: '1',
  username: 'admin',
  email: 'admin@investrak.com',
  password: '$2b$10$3szNcoCa6hKGCyfxgHmTx.ONJMZEW0hv9qJyu4eBKXYDN3SVDIW4e', // bcrypt hash for 'admin123'
  firstName: 'Admin',
  lastName: 'User',
  role: 'ADMIN'
};

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find user (temporary hardcoded)
    if (username === demoUser.username) {
      // Verify password
      const isValidPassword = await bcrypt.compare(password, demoUser.password);
      
      if (!isValidPassword) {
        return NextResponse.json(
          { message: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: demoUser.id,
          username: demoUser.username, 
          email: demoUser.email,
          role: demoUser.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return NextResponse.json({
        message: 'Login successful',
        token,
        user: {
          id: demoUser.id,
          username: demoUser.username,
          email: demoUser.email,
          firstName: demoUser.firstName,
          lastName: demoUser.lastName,
          role: demoUser.role
        }
      });
    }

    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
