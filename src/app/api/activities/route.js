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

export async function POST(request) {
  try {
    console.log('POST /api/activities called');
    await connectDB();
    
    const body = await request.json();
    console.log('Creating activity:', body.title);
    
    // Validate required fields
    if (!body.title || !body.description || !body.steps || body.steps.length === 0) {
      return NextResponse.json(
        { error: 'Title, description, and at least one step are required' },
        { status: 400 }
      );
    }
    
    // Validate steps
    for (let i = 0; i < body.steps.length; i++) {
      const step = body.steps[i];
      if (!step.title || !step.description || !step.tips || step.tips.length === 0) {
        return NextResponse.json(
          { error: `Step ${i + 1} is missing required fields (title, description, or tips)` },
          { status: 400 }
        );
      }
    }
    
    // Create new activity
    const newActivity = new Activity({
      title: body.title,
      category: body.category || 'Mindfulness',
      difficulty: body.difficulty || 'Easy',
      estimatedTime: body.estimatedTime || 10,
      description: body.description,
      steps: body.steps,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await newActivity.save();
    console.log('Activity created successfully:', newActivity._id);
    
    return NextResponse.json({
      message: 'Activity created successfully',
      activity: newActivity
    }, { status: 201 });
    
  } catch (error) {
    console.error('Create activity error:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    console.log('PUT /api/activities called');
    await connectDB();
    
    const body = await request.json();
    const { activityId, updates } = body;
    
    if (!activityId) {
      return NextResponse.json(
        { error: 'Activity ID is required' },
        { status: 400 }
      );
    }
    
    console.log('Updating activity:', activityId);
    
    // Update the activity
    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      {
        ...updates,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedActivity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      );
    }
    
    console.log('Activity updated successfully:', updatedActivity._id);
    
    return NextResponse.json({
      message: 'Activity updated successfully',
      activity: updatedActivity
    });
    
  } catch (error) {
    console.error('Update activity error:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
}