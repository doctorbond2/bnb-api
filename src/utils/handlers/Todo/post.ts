import { NextResponse, NextRequest } from 'next/server';
import { Todo } from '@/models/types/Todo';
import prisma from '@/lib/prisma';
import ResponseError from '@/models/classes/responseError';
export async function CreateTodo(req: NextRequest) {
  try {
    const body: Todo = await req.json();
    if (!body.name) {
      return ResponseError.default.badRequest();
    }
    body.completed = false;
    await prisma.todo.create({ data: body });
    return NextResponse.json(body, { status: 201 });
  } catch (error) {
    console.error(error);
    return ResponseError.default.internalServerError();
  }
}
