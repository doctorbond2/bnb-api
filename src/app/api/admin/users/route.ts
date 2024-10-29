import { handler_GetAllUsers } from '@/utils/handlers/User/get';

export async function GET() {
  return await handler_GetAllUsers();
}
