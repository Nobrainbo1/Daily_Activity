import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import UserActivity from '@/models/UserActivity';
import User from '@/models/User';
import Activity from '@/models/Activity';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const activityId = searchParams.get('activityId');
    const stats = searchParams.get('stats');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // If no specific activity ID, return all user activities
    if (!activityId && !stats) {
      console.log('Fetching user activities for userId:', userId);
      
      const userActivities = await UserActivity.find({ userId })
        .populate('activityId')
        .sort({ createdAt: -1 });

      console.log('Found user activities:', userActivities.length);

      // Transform the data to have activity data at the root level
      const transformedActivities = userActivities.map(ua => {
        console.log('Processing user activity:', ua._id, 'status:', ua.status);
        return {
          _id: ua._id,
          userId: ua.userId,
          activity: ua.activityId,
          status: ua.status,
          scheduledTime: ua.scheduledTime,
          notes: ua.notes,
          completedAt: ua.completedAt,
          createdAt: ua.createdAt
        };
      });

      return NextResponse.json({
        userActivities: transformedActivities
      });
    }

    // If requesting stats
    if (stats === 'true') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get completed activities today
      const completedToday = await UserActivity.countDocuments({
        userId,
        status: 'completed',
        completedAt: { $gte: today, $lt: tomorrow }
      });

      // Get total completed activities
      const totalCompleted = await UserActivity.countDocuments({
        userId,
        status: 'completed'
      });

      // Calculate current streak
      let currentStreak = 0;
      const user = await User.findById(userId);
      if (user && user.streak) {
        currentStreak = user.streak.current || 0;
      }

      // Get badges
      const badges = user ? user.badges || [] : [];

      return NextResponse.json({
        stats: {
          completedToday,
          currentStreak,
          totalCompleted,
          badges
        }
      });
    }

    // If requesting specific user activity
    if (activityId) {
      const userActivity = await UserActivity.findOne({
        userId,
        activityId
      }).populate('activityId');

      return NextResponse.json({ userActivity });
    }

    // Get all user activities
    const userActivities = await UserActivity.find({ userId })
      .populate('activityId')
      .sort({ createdAt: -1 });

    return NextResponse.json({ userActivities });
  } catch (error) {
    console.error('GET /api/user-activities error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    console.log('POST /api/user-activities body:', body);
    
    const { userId, activityId, status } = body;

    if (!userId || !activityId) {
      console.log('Missing required fields:', { userId, activityId });
      return NextResponse.json(
        { error: 'User ID and Activity ID are required' },
        { status: 400 }
      );
    }

    // Check if user activity already exists
    const existingUserActivity = await UserActivity.findOne({ userId, activityId });
    console.log('Existing user activity:', existingUserActivity);
    
    if (existingUserActivity) {
      return NextResponse.json(
        { message: 'Activity already in your list' },
        { status: 400 }
      );
    }

    // Create new user activity
    console.log('Creating new user activity...');
    const userActivity = new UserActivity({
      userId,
      activityId,
      status: status || 'added',
      createdAt: new Date()
    });
      
    await userActivity.save();
    console.log('User activity saved:', userActivity._id);
    
    // Populate the activity details
    await userActivity.populate('activityId');
    console.log('User activity populated');
    
    return NextResponse.json({ 
      message: 'Activity added to your list',
      userActivity 
    });
  } catch (error) {
    console.error('POST /api/user-activities error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    
    const { userActivityId, status } = await request.json();

    if (!userActivityId || !status) {
      return NextResponse.json(
        { error: 'User Activity ID and status are required' },
        { status: 400 }
      );
    }

    const userActivity = await UserActivity.findById(userActivityId);
    if (!userActivity) {
      return NextResponse.json(
        { error: 'User activity not found' },
        { status: 404 }
      );
    }

    userActivity.status = status;
    if (status === 'completed') {
      userActivity.completedAt = new Date();
    }
    
    await userActivity.save();
    
    return NextResponse.json({ 
      message: `Activity ${status}`,
      userActivity 
    });
  } catch (error) {
    console.error('PUT /api/user-activities error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    
    const { userActivityId } = await request.json();

    if (!userActivityId) {
      return NextResponse.json(
        { error: 'User Activity ID is required' },
        { status: 400 }
      );
    }

    await UserActivity.findByIdAndDelete(userActivityId);
    
    return NextResponse.json({ message: 'Activity removed from your list' });
  } catch (error) {
    console.error('DELETE /api/user-activities error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to update user streak and badges
async function updateUserStreak(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if user has completed activities today
    const completedToday = await UserActivity.countDocuments({
      userId,
      status: 'completed',
      completedAt: { $gte: today }
    });

    if (completedToday > 0) {
      // Update streak
      const lastActivityDate = user.streak?.lastActivityDate;
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (!lastActivityDate || 
          new Date(lastActivityDate).toDateString() === yesterday.toDateString()) {
        // Continue or start streak
        user.streak = user.streak || {};
        user.streak.current = (user.streak.current || 0) + 1;
        user.streak.longest = Math.max(user.streak.longest || 0, user.streak.current);
        user.streak.lastActivityDate = today;
      } else if (new Date(lastActivityDate).toDateString() !== today.toDateString()) {
        // Reset streak if not consecutive
        user.streak.current = 1;
        user.streak.lastActivityDate = today;
      }

      // Award badges
      user.badges = user.badges || [];
      
      if (user.streak.current === 1 && !user.badges.includes('First Step')) {
        user.badges.push('First Step');
      }
      if (user.streak.current >= 7 && !user.badges.includes('Week Warrior')) {
        user.badges.push('Week Warrior');
      }
      if (user.streak.current >= 30 && !user.badges.includes('Streak Master')) {
        user.badges.push('Streak Master');
      }
      
      // Check total completed activities for other badges
      const totalCompleted = await UserActivity.countDocuments({
        userId,
        status: 'completed'
      });
      
      if (totalCompleted >= 50 && !user.badges.includes('Dedication')) {
        user.badges.push('Dedication');
      }
      if (totalCompleted >= 10 && !user.badges.includes('Explorer')) {
        user.badges.push('Explorer');
      }

      await user.save();
    }
  } catch (error) {
    console.error('Error updating user streak:', error);
  }
}