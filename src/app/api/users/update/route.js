import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

export async function PUT(request) {
  try {
    await connectDB();
    
    const { userId, name } = await request.json();
    
    if (!userId || !name?.trim()) {
      return NextResponse.json(
        { message: 'User ID and name are required' },
        { status: 400 }
      );
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        name: name.trim(),
        updatedAt: new Date()
      },
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