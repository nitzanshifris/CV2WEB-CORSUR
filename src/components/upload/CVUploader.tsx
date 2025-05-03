"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import FileService, { FileUploadOptions } from "@/services/file-service";
import { extractCVData } from "@/services/cv-parsing-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUpCircle, File, X, FileText, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database.types";

interface CVUploaderProps {
  onSuccess?: (cvData: any, cvId: string) => void;
  redirectOnSuccess?: boolean;
  className?: string;
  maxSize?: number;
  allowedTypes?: string[];
}

type UploadStatus = "idle" | "uploading" | "processing" | "success" | "error";

export function CVUploader({ 
  onSuccess, 
  redirectOnSuccess = true, 
  className,
  maxSize = 5 * 1024 * 1024, // 5MB default
  allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ]
}: CVUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const validateFile = useCallback((selectedFile: File): boolean => {
    if (!allowedTypes.includes(selectedFile.type)) {
      setErrorMessage("Invalid file format. Please upload a PDF or Word document.");
      setStatus("error");
      return false;
    }

    if (selectedFile.size > maxSize) {
      setErrorMessage(`File too large. Maximum size: ${maxSize / 1024 / 1024}MB`);
      setStatus("error");
      return false;
    }

    return true;
  }, [allowedTypes, maxSize]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      setErrorMessage(null);
      setStatus("idle");
    }
  }, [validateFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    if (validateFile(droppedFile)) {
      setFile(droppedFile);
      setErrorMessage(null);
      setStatus("idle");
    }
  }, [validateFile]);

  const handleUpload = useCallback(async () => {
    if (!file || !user) return;
    
    try {
      setIsUploading(true);
      setStatus("uploading");
      setUploadProgress(10);

      const uploadOptions: FileUploadOptions = {
        maxSize,
        allowedTypes,
        onProgress: (progress) => {
          setUploadProgress(progress);
        }
      };

      // Upload file
      const { url, error: uploadError } = await FileService.uploadFile(file, uploadOptions);
      if (uploadError || !url) {
        throw new Error(uploadError || "Failed to upload file");
      }
      
      setUploadProgress(40);
      setStatus("processing");

      // Extract CV data
      const cvData = await extractCVData(url);
      
      setUploadProgress(70);

      // Save to database
      const { data, error: dbError } = await supabase
        .from("cvs")
        .insert({
          user_id: user.id,
          file_url: url,
          data: cvData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) throw dbError;
      
      // Update user profile
      await supabase
        .from("profiles")
        .update({ 
          cv_file_url: url,
          cv_data: cvData
        })
        .eq("id", user.id);

      setUploadProgress(100);
      setStatus("success");

      toast({
        title: "CV uploaded successfully",
        description: "Your CV has been processed and is ready for use.",
      });

      if (onSuccess && data) {
        onSuccess(cvData, data.id);
      }

      if (redirectOnSuccess && data) {
        router.push(`/preview?cvId=${data.id}&tempId=designer`);
      }
    } catch (error: any) {
      console.error("Error uploading CV:", error);
      setStatus("error");
      setErrorMessage(error.message || "Failed to upload and process CV");
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload and process your CV",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [file, user, maxSize, allowedTypes, onSuccess, redirectOnSuccess, router, supabase, toast]);

  const resetUpload = useCallback(() => {
    setFile(null);
    setStatus("idle");
    setUploadProgress(0);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Upload Your CV</CardTitle>
        <CardDescription>
          Upload your CV to get started with your website generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "idle" && !file && (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <ArrowUpCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Drag and drop your CV here
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse files
            </p>
            <p className="text-xs text-gray-400">
              Supports PDF and Word documents up to {maxSize / 1024 / 1024}MB
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept={allowedTypes.join(",")}
            />
          </div>
        )}

        {file && status === "idle" && (
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button 
              onClick={resetUpload} 
              className="text-gray-400 hover:text-gray-500"
              aria-label="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {(status === "uploading" || status === "processing") && (
          <div>
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-medium text-gray-700">
                {status === "uploading" ? "Uploading..." : "Processing CV..."}
              </span>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
            <div className="mt-2 flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span className="text-sm text-gray-500">
                {status === "uploading" ? "Uploading your file..." : "Processing your CV..."}
              </span>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
            <div>
              <p className="font-medium text-green-800">CV uploaded successfully!</p>
              <p className="text-sm text-green-600">
                Your CV has been processed and is ready for use.
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center p-4 bg-red-50 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
            <div>
              <p className="font-medium text-red-800">Upload failed</p>
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        {(status === "idle" && file) && (
          <>
            <Button variant="outline" onClick={resetUpload}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload & Process"
              )}
            </Button>
          </>
        )}
        
        {status === "success" && (
          <Button onClick={resetUpload} className="ml-auto">
            Upload Another CV
          </Button>
        )}
        
        {status === "error" && (
          <Button onClick={resetUpload} variant="outline" className="ml-auto">
            Try Again
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 