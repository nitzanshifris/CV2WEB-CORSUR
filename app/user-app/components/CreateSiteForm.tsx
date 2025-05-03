'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { Database } from '@/lib/supabase'

export default function CreateSiteForm() {
  const [domain, setDomain] = useState('')
  const [theme, setTheme] = useState('default')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('sites')
        .insert({
          user_id: session.user.id,
          domain,
          theme,
          content: {
            title: 'My CV Website',
            description: 'A professional CV website',
            sections: []
          }
        })

      if (error) throw error
      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create New Site</CardTitle>
        <CardDescription>
          Create a new CV website with your own domain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              type="text"
              placeholder="my-cv-website"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
              disabled={loading}
            />
            <p className="text-sm text-gray-500">
              Your site will be available at: {domain}.cv-website.com
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              disabled={loading}
            >
              <option value="default">Default</option>
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
            </select>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Site'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 