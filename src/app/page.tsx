"use client";

import { useState } from "react";
import { CVForm } from "@/components/cv-form";
import { CVTemplates } from "@/components/cv-templates";
import { PublishOptions } from "@/components/publish-options";
import { WebsiteHosting } from "@/components/website-hosting";
import { ResumeUpload } from "@/components/resume-upload";
import { ParsedResume } from "@/utils/resume-parser";

export default function Home() {
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);

  const handleResumeParsed = (data: ParsedResume) => {
    setParsedResume(data);
  };

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        Create Your Professional CV Website
      </h1>
      <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Transform your resume into a stunning website. Upload your existing resume or start from scratch.
      </p>

      <ResumeUpload onResumeParsed={handleResumeParsed} />
      
      {parsedResume && (
        <CVForm
          initialData={{
            fullName: parsedResume.fullName,
            title: parsedResume.title,
            email: parsedResume.email,
            phone: parsedResume.phone,
            summary: parsedResume.summary,
            skills: parsedResume.skills,
            experience: parsedResume.experience,
            education: parsedResume.education,
          }}
        />
      )}

      <CVTemplates />
      <PublishOptions />
      <WebsiteHosting />
    </main>
  );
} 