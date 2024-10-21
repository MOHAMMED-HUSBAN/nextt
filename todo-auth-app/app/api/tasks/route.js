import { NextResponse } from 'next/server';
import { connectDB } from '../../lib/mongodb';
import Task from '../../models/Task';
import { getUser } from '../../lib/auth';

export async function GET(request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const tasks = await Task.find({ userId: user.userId });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title } = await request.json();
    await connectDB();

    const task = await Task.create({
      userId: user.userId,
      title,
      completed: false,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating task' },
      { status: 500 }
    );
  }
}