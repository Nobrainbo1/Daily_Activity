import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const connection = await connectDB();
    
    // Test actual database connectivity with null safety guards
    const dbName = mongoose.connection?.db?.databaseName || 'unknown';
    const readyState = mongoose.connection?.readyState || 0;
    const host = mongoose.connection?.host || 'unknown';
    
    return Response.json({
      success: true,
      message: 'Database connected successfully',
      database: {
        name: dbName,
        host: host,
        readyState: readyState,
        status: readyState === 1 ? 'Connected' : 'Not Connected'
      },
      timestamp: new Date().toISOString(),
      status: 'healthy'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return Response.json(
      {
        success: false,
        message: 'Database connection failed',
        error: {
          message: error.message,
          type: error.name || 'Unknown Error'
        },
        timestamp: new Date().toISOString(),
        status: 'unhealthy'
      },
      { status: 500 }
    );
  }
}