import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Activity from '@/models/Activity';

export async function GET() {
  try {
    console.log('GET /api/activities called');
    await connectDB();
    
    // First try to get all activities without the isActive filter
    const activities = await Activity.find({})
      .sort({ createdAt: -1 });
    
    console.log('Found activities:', activities.length);
    
    return NextResponse.json({ 
      activities,
      total: activities.length 
    });
    
  } catch (error) {
    console.error('Get activities error:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
}