'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    multiple: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    try {
      setIsUploading(true)
      // TODO: Implement file upload logic
      console.log('Uploading file:', file.name)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-xl transition-all cursor-pointer
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-secondary/50'
          }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L12 4m4 4v12" />
            </svg>
          </div>
          {file ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">{file.name}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setFile(null)
                }}
                className="text-sm text-destructive hover:text-destructive/80"
              >
                Remove file
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-base font-medium">
                {isDragActive ? 'Drop your CV here' : 'Drag & drop your CV here'}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse (PDF, DOC, DOCX)
              </p>
            </div>
          )}
        </div>
      </div>
      <button
        type="submit"
        disabled={!file || isUploading}
        className={`mt-4 w-full py-3 rounded-xl font-medium transition-all
          ${file && !isUploading
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
      >
        {isUploading ? 'Uploading...' : 'Transform CV'}
      </button>
    </form>
  )
} 