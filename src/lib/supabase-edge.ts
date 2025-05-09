import { createClient } from '@supabase/supabase-js';

/**
 * EDGE RUNTIME SUPABASE CLIENT
 *
 * We create this special Supabase client specifically for use in Edge environments like middleware.
 *
 * WHY THIS EXISTS:
 * 1. Prisma Client cannot run in Edge runtime (Vercel Edge, Cloudflare Workers, etc.)
 * 2. We need middleware to create users before they can access the app
 * 3. Middleware can't call internal API routes (creates circular dependencies)
 *
 * This is a rare exception to our usual pattern of using Prisma for all database access.
 * We only use this direct Supabase access for the specific case of user creation in middleware.
 * All other database operations should continue using Prisma as normal.
 */

// Ensure environment variables are set
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables for Edge runtime');
}

// Use the service role key for middleware operations
// Note: Service role bypasses RLS and should be used carefully
export const supabaseEdge = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false, // No session persistence needed for middleware
    },
  }
);
