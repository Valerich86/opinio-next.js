import { verifySession } from '@/src/lib/auth';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  const user = await verifySession();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Неавторизован' }), { status: 401 });
  }

  return new Response(JSON.stringify(user), { status: 200 });
}