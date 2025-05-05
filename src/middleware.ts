import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const userId = request.cookies.get('user_id')?.value;

  if (!userId) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/guest`);
    const data = await res.json();

    const response = NextResponse.next();
    response.cookies.set('user_id', data.userId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
