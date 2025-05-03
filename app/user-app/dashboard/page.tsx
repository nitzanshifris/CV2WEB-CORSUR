import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Database } from '@/lib/supabase'

export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth')
  }

  const { data: sites } = await supabase
    .from('sites')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Sites</h1>
            <Link href="/dashboard/create">
              <Button>Create New Site</Button>
            </Link>
          </div>
          
          {sites?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">You don't have any sites yet.</p>
              <Link href="/dashboard/create">
                <Button className="mt-4">Create Your First Site</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sites?.map((site) => (
                <div key={site.id} className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-2">{site.domain}</h2>
                  <p className="text-gray-500 mb-4">Theme: {site.theme}</p>
                  <div className="flex space-x-2">
                    <Link href={`/dashboard/edit/${site.id}`}>
                      <Button variant="outline">Edit</Button>
                    </Link>
                    <Link href={`https://${site.domain}.cv-website.com`} target="_blank">
                      <Button variant="outline">View Site</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8">
            <form action="/auth/signout" method="post">
              <Button variant="outline" type="submit">Sign Out</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 