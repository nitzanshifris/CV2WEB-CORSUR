import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Upload, FileText, FileInput, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { parsePDF, parseDOCX, ParsedResume } from "@/utils/resume-parser";

const supportedFormats = [
  {
    name: "PDF",
    icon: FileText,
    description: "Upload your resume in PDF format",
    parser: parsePDF,
  },
  {
    name: "DOCX",
    icon: FileInput,
    description: "Upload your resume in Word format",
    parser: parseDOCX,
  },
  {
    name: "Manual Entry",
    icon: FileSpreadsheet,
    description: "Enter your information manually",
  },
];

interface ResumeUploadProps {
  onResumeParsed: (resume: ParsedResume) => void;
}

export function ResumeUpload({ onResumeParsed }: ResumeUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, format: typeof supportedFormats[0]) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      await handleFileUpload(file, format);
    }
  };

  const handleFileUpload = async (file: File, format: typeof supportedFormats[0]) => {
    if (!format.parser) return;

    setIsParsing(true);
    setParsingProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setParsingProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const parsedResume = await format.parser(file);
      
      clearInterval(progressInterval);
      setParsingProgress(100);
      
      onResumeParsed(parsedResume);
      toast.success("Resume parsed successfully!");
    } catch (error) {
      console.error("Error parsing resume:", error);
      toast.error("Failed to parse resume. Please try again or enter information manually.");
    } finally {
      setIsParsing(false);
      setParsingProgress(0);
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Upload Your Resume</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your existing resume or enter your information manually. We'll automatically transform it into a professional website.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {supportedFormats.map((format, index) => (
            <motion.div
              key={format.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <format.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{format.name}</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">{format.description}</p>
                  
                  {format.name !== "Manual Entry" ? (
                    <div className="flex flex-col gap-4">
                      <Input
                        type="file"
                        accept={format.name === "PDF" ? ".pdf" : ".docx"}
                        onChange={(e) => handleFileChange(e, format)}
                        className="cursor-pointer"
                        disabled={isParsing}
                      />
                      {selectedFile && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="w-4 h-4" />
                          <span>{selectedFile.name}</span>
                        </div>
                      )}
                      {isParsing && (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Parsing resume...</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${parsingProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        toast.info("Redirecting to manual entry form...");
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Enter Information Manually
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 