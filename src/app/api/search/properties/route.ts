import { NextRequest, NextResponse } from 'next/server';
import PrismaSearch from '@/models/classes/prismaSearch';
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get('searchQuery');

  if (!searchQuery) {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    );
  }
  try {
    const properties = await PrismaSearch.getPropertyList(searchQuery);

    return NextResponse.json({ data: properties, status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(err);
  }
}
