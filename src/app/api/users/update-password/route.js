import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

export async function PUT(request) {
  try {
    await connectDB();
    
    const { userId, currentPassword, newPassword } = await request.json();
    
    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Simple password comparison (same as login - in production, use bcrypt)
    if (user.password !== currentPassword) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Update the password (simple text for now - in production, hash it)
    await User.findByIdAndUpdate(userId, {
      password: newPassword,
      updatedAt: new Date()
    });

    return NextResponse.json({
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}