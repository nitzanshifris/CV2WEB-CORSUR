import { CVData } from '@/services/templates/types';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';

interface ResumePreviewProps {
  data: CVData;
  className?: string;
}

export function ResumePreview({ data, className }: ResumePreviewProps) {
  const { personalInfo, skills, experience, education } = data;

  return (
    <Card className={`p-6 ${className}`}>
      <ScrollArea className="h-[800px] pr-4">
        {/* Header Section */}
        <div className="flex items-start gap-4 mb-6">
          <Avatar className="h-20 w-20">
            <div className="h-full w-full bg-primary/10 flex items-center justify-center text-2xl font-bold">
              {personalInfo.name
                .split(' ')
                .map(n => n[0])
                .join('')}
            </div>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{personalInfo.name}</h1>
            <p className="text-muted-foreground mb-2">{personalInfo.summary}</p>
            <div className="flex flex-wrap gap-2">
              {personalInfo.links.linkedin && <Badge variant="secondary">LinkedIn</Badge>}
              {personalInfo.links.github && <Badge variant="secondary">GitHub</Badge>}
              {personalInfo.links.portfolio && <Badge variant="secondary">Portfolio</Badge>}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{personalInfo.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p>{personalInfo.phone}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p>{personalInfo.location}</p>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="outline">
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-primary/20 pl-4">
                <h3 className="font-medium">{exp.position}</h3>
                <p className="text-muted-foreground">{exp.company}</p>
                <p className="text-sm text-muted-foreground mb-2">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </p>
                <p className="text-sm mb-2">{exp.description}</p>
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Education</h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="border-l-2 border-primary/20 pl-4">
                <h3 className="font-medium">{edu.degree}</h3>
                <p className="text-muted-foreground">{edu.institution}</p>
                <p className="text-sm text-muted-foreground mb-2">
                  {edu.startDate} - {edu.endDate || 'Present'}
                </p>
                <p className="text-sm">{edu.description}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
}
