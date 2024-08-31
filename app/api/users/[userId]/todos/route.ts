import { NextRequest, NextResponse } from 'next/server'; // v14.x.x
import { todoItemDb } from '@/lib/db';

type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
};

// Next.js v14 App Router
// GET /users/:userId/todos
// app/api/users/[userId]/todos/route.ts
export const GET = async (
  req: NextRequest,
  { params, query }: { params: { userId: string }, query: {} }
) => {
	try {
	  const { userId } = params;
	  // const { limit, page } = query; // optional

	  // Query the database
	  const todoItems: TodoItem[] = await todoItemDb.getAll(userId);

    return NextResponse.json({ todoItems: todoItems }, { status: 200 });
	} catch (error) {
		console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
};

// Next.js v14 App Router
// POST /users/:userId/todos
// app/api/users/[userId]/todos/route.ts
export const POST = async (
  req: NextRequest,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = params;
    const { title } = await req.json(); // request body

		if (!title) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Handle your business logic here (e.g., update the database)
    const newTodoItem = await todoItemDb.createOne(userId, title);

    return NextResponse.json(newTodoItem, { status: 201 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};