import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { parseDOCX, ParsedResume, parsePDF } from '@/utils/resume-parser';
import { motion } from 'framer-motion';
import { FileText, PenTool } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ResumeUploadProps {
  onResumeParsed: (data: ParsedResume) => void;
}

const supportedFormats = [
  {
    name: 'PDF',
    icon: FileText,
    accept: '.pdf',
    parser: parsePDF,
  },
  {
    name: 'DOCX',
    icon: FileText,
    accept: '.docx',
    parser: parseDOCX,
  },
  {
    name: 'Manual Entry',
    icon: PenTool,
    accept: '',
    parser: null,
  },
];

export function ResumeUpload({ onResumeParsed }: ResumeUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);

  const handleFileChange = async (
    format: (typeof supportedFormats)[number],
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsParsing(true);
    setParsingProgress(0);

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setParsingProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Parse the file
      const parsedData = await format.parser?.(file);

      clearInterval(interval);
      setParsingProgress(100);

      if (parsedData) {
        onResumeParsed(parsedData);
        toast.success('Resume parsed successfully!');
      }
    } catch (error) {
      console.error('Error parsing file:', error);
      toast.error('Failed to parse resume. Please try again or use manual entry.');
    } finally {
      setIsParsing(false);
      setParsingProgress(0);
    }
  };

  const handleManualEntry = () => {
    onResumeParsed({
      fullName: '',
      title: '',
      email: '',
      phone: '',
      summary: '',
      skills: [],
      experience: [],
      education: [],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-6"
    >
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
        <p className="text-gray-600 mb-6">
          Upload your existing resume or start from scratch. We'll help you transform it into a
          beautiful website.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {supportedFormats.map(format => (
            <motion.div
              key={format.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <Card className="p-6 flex flex-col items-center justify-center text-center cursor-pointer">
                <format.icon className="w-12 h-12 mb-4" />
                <h3 className="font-semibold mb-2">{format.name}</h3>
                {format.parser ? (
                  <label className="cursor-pointer">
                    <Input
                      type="file"
                      accept={format.accept}
                      className="hidden"
                      onChange={e => handleFileChange(format, e)}
                      disabled={isParsing}
                    />
                    <Button variant="outline" className="w-full" disabled={isParsing}>
                      {isParsing ? 'Parsing...' : 'Choose File'}
                    </Button>
                  </label>
                ) : (
                  <Button variant="outline" className="w-full" onClick={handleManualEntry}>
                    Start Fresh
                  </Button>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {isParsing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: '0%' }}
                animate={{ width: `${parsingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Parsing your resume... {parsingProgress}%
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
