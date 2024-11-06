import { NextRequest, NextResponse } from 'next/server';
import PrismaSearch from '@/models/classes/prismaSearch';
// interface SearchUserResponse {
//   id: true;
//   firstName: true;
//   lastName: true;
//   email: true;
//   admin: true;
//   username: true;
// }
// interface SearchPropertyResponse {
//   id: true;
//   name: true;
//   address: true;
//   city: true;
//   country: true;
//   images: true;
// }
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
    const searchResults =
      (await PrismaSearch.searchUsersAndProperties(searchQuery)) || [];
    console.log('search: ', searchResults);
    return NextResponse.json({ data: searchResults, status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(err);
  }
}
