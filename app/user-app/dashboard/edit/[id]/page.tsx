import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import EditSiteForm from '@/components/EditSiteForm'

interface EditSitePageProps {
  params: {
    id: string
  }
}

export default async function EditSitePage({ params }: EditSitePageProps) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-center">
            <EditSiteForm siteId={params.id} />
          </div>
        </div>
      </div>
    </div>
  )
} 