import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();
    
    const { name, username, password } = await request.json();
    
    if (!name || !username || !password) {
      return NextResponse.json(
        { error: 'Name, username, and password are required' },
        { status: 400 }
      );
    }
    
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }
    
    // Create new user
    const newUser = new User({
      name,
      username,
      password, // In production, hash this password
      preferences: {
        skillGoals: [],
        difficultyPreference: 'Medium',
        availableTime: 30
      },
      streak: {
        current: 0,
        longest: 0,
        lastActivityDate: null
      },
      badges: []
    });
    
    await newUser.save();
    
    // Return user data without password
    const userData = {
      _id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      streak: newUser.streak,
      badges: newUser.badges
    };
    
    return NextResponse.json({
      message: 'Account created successfully',
      user: userData
    }, { status: 201 });
    
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}