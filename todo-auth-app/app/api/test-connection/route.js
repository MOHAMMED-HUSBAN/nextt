// app/api/test-connection/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    await connectDB();
    
    return NextResponse.json({
      message: 'MongoDB connected successfully',
      mongodbUri: process.env.MONGODB_URI?.split('@')[1] // Show only the cluster part for security
    });
  } catch (error) {
    console.error('Connection test failed:', error);
    return NextResponse.json({
      error: 'Connection failed',
      details: error.message
    }, { status: 500 });
  }
}