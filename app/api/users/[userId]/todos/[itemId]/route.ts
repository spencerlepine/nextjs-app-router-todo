import { NextRequest, NextResponse } from 'next/server'; // v14.x.x
import { todoItemDb } from '@/lib/db';

// Next.js v14 App Router
// PUT /users/:userId/todos/:itemId
// app/api/users/[userId]/todos/[itemId]/route.ts
export const PUT = async (req: NextRequest, { params }: { params: { userId: string, itemId: string } }) => {
  try {
    const { userId, itemId } = params;
    const todoItem = await req.json(); // request body
		
		if (!todoItem || typeof todoItem !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Handle your business logic here (e.g., update the database)
    await todoItemDb.updateOne(userId, itemId, todoItem);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

// Next.js v14 App Router
// DELETE /users/:userId/todos/:itemId
// app/api/users/[userId]/todos/[itemId]/route.ts
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { userId: string; itemId: string } }
) => {
  try {
    const { userId, itemId } = params;

    await todoItemDb.deleteOne(userId, itemId);

    return NextResponse.json({ message: 'Todo item deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};