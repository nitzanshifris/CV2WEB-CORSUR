'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload } from 'lucide-react'
import { Database } from '@/lib/supabase'

interface ImageUploadProps {
  siteId: string
  onUpload: (url: string) => void
}

export default function ImageUpload({ siteId, onUpload }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient<Database>()

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      setError(null)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${siteId}/${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath)

      onUpload(publicUrl)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Upload Image</CardTitle>
        <CardDescription>
          Upload an image for your site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {uploading ? (
                  <Loader2 className="w-8 h-8 mb-3 text-gray-400 animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                )}
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 5MB)</p>
              </div>
              <input
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 