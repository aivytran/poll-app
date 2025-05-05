import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Create a singleton instance of PrismaClient to avoid too many connections
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Prevent multiple instances during hot reloading in development
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export async function middleware(request: NextRequest) {
  const userId = request.cookies.get('user_id')?.value;

  if (!userId) {
    // Create a guest user directly with Prisma
    const guestUser = await prisma.user.create({
      data: {
        isAuthenticated: false,
      },
    });

    const response = NextResponse.next();
    response.cookies.set('user_id', guestUser.id, {
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
