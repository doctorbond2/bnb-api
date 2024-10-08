import { NextRequest, NextResponse } from 'next/server';
import ResponseError from '@/models/classes/responseError';
import PrismaKit from '@/models/classes/prisma';
import { Property } from '@/models/types/Property';

export async function handler_UpdateProperty(
  req: NextRequest
): Promise<Response> {}
