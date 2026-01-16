import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Health check - Environment:', {
      hasDbUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV,
      dbUrlLength: process.env.DATABASE_URL?.length
    });

    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      environment: process.env.NODE_ENV || 'development',
      hasDbUrl: !!process.env.DATABASE_URL
    });
  } catch (error: any) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error.message,
        hasDbUrl: !!process.env.DATABASE_URL
      },
      { status: 500 }
    );
  }
}
