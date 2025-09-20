import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(request) {
  try {
    await connectDB();
    
    const { userId, name, username, password } = await request.json();

    if (!userId || !name || !username) {
      return NextResponse.json(
        { message: 'User ID, name, and username are required' },
        { status: 400 }
      );
    }

    // Check if username is already taken by another user
    const existingUser = await User.findOne({ 
      username, 
      _id: { $ne: userId } 
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Username is already taken' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData = {
      name,
      username
    };

    // Only update password if provided
    if (password) {
      updateData.password = password;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password: _, ...userResponse } = updatedUser.toObject();

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Profile update error:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { message: 'Validation error: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}