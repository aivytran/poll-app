import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const userId = request.cookies.get('user_id')?.value;

  if (!userId) {
    // Create user via API route instead of directly using Prisma
    const response = await fetch(`${request.nextUrl.origin}/api/users/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to create user');
      return NextResponse.next();
    }

    const { id } = await response.json();

    const nextResponse = NextResponse.next();
    nextResponse.cookies.set('user_id', id, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return nextResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
