import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(request) {
  try {
    await connectDB();
    
    const { userId, name, preferences } = await request.json();
    
    if (!userId || !name?.trim()) {
      return NextResponse.json(
        { message: 'User ID and name are required' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData = { 
      name: name.trim(),
      updatedAt: new Date()
    };

    // Add preferences if provided
    if (preferences) {
      updateData.preferences = preferences;
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// Support PATCH method as well
export async function PATCH(request) {
  try {
    await connectDB();
    
    const { userId, name, preferences } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData = { 
      updatedAt: new Date()
    };

    // Add name if provided
    if (name?.trim()) {
      updateData.name = name.trim();
    }

    // Add preferences if provided
    if (preferences) {
      updateData.preferences = preferences;
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}