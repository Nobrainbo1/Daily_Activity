import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();
    
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Find user by username
    const user = await User.findOne({ username }).select('+password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Simple password comparison (in production, you should hash passwords)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Return user data without password
    const userData = {
      _id: user._id,
      name: user.name,
      username: user.username,
      streak: user.streak,
      badges: user.badges,
      role: user.role
    };
    
    return NextResponse.json({
      message: 'Login successful',
      user: userData
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}