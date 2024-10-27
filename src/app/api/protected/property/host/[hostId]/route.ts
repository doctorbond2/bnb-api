import { NextResponse } from 'next/server';

export const OPTIONS = async () => {
  return new NextResponse('', { status: 200 });
};
