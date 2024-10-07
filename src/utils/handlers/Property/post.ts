import { NextRequest, NextResponse } from 'next/server';
import ResponseError from '@/models/classes/responseError';
import { validateNewProperty as validateIncomingData } from '@/utils/helpers/property';
export async function handler_createNewProperty(
  req: NextRequest
): Promise<Response> {}
