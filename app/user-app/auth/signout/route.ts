import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Database } from '@/lib/supabase'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies })
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/auth', request.url), {
    status: 302,
  })
} 