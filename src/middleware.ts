import { supabaseEdge } from '@/lib/supabase-edge';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Next.js Middleware
 *
 * This middleware runs in the Edge runtime and is responsible for
 * creating user accounts for new visitors before they can access the app.
 *
 * IMPORTANT IMPLEMENTATION NOTES:
 * - We use Supabase directly here instead of Prisma because Prisma doesn't work in Edge runtime
 * - This is an exception to our usual pattern - most app code should continue using Prisma
 * - We can't call our own API routes from middleware (would create circular dependencies)
 */
export async function middleware(request: NextRequest) {
  const userId = request.cookies.get('user_id')?.value;

  if (!userId) {
    try {
      // Create a guest user directly with Supabase
      // NOTE: This operation bypasses Prisma for the specific Edge runtime constraint
      const { data, error } = await supabaseEdge
        .from('users')
        .insert({ isAuthenticated: false })
        .select()
        .single();

      if (error || !data) {
        console.error('Error creating user in middleware:', error);
        return NextResponse.next();
      }

      const response = NextResponse.next();
      response.cookies.set('user_id', data.id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
    } catch (error) {
      console.error('Unexpected error in middleware:', error);
      // Continue the request even if user creation fails
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
