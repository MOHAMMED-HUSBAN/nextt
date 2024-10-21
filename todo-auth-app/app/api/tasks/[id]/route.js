import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Task from '../../../models/Task';
import { getUser } from '../../../lib/auth';

export async function PUT(request, { params }) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, completed } = await request.json();
    await connectDB();

    const task = await Task.findOneAndUpdate(
      { _id: params.id, userId: user.userId },
      { title, completed },
      { new: true }
    );

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating task' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const task = await Task.findOneAndDelete({
      _id: params.id,
      userId: user.userId,
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Task deleted successfully' }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting task' },
      { status: 500 }
    );
  }
}