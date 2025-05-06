import { PersonalInfo } from '@/services/templates/types';
import { ChangeEvent } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface PersonalInfoEditorProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  className?: string;
}

export function PersonalInfoEditor({ data, onChange, className }: PersonalInfoEditorProps) {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleLinksChange = (field: keyof PersonalInfo['links'], value: string) => {
    onChange({
      ...data,
      links: {
        ...data.links,
        [field]: value,
      },
    });
  };

  return (
    <Card className={`p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
            placeholder="john@example.com"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={data.location}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange('location', e.target.value)
            }
            placeholder="City, Country"
          />
        </div>

        <div>
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            value={data.summary}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              handleChange('summary', e.target.value)
            }
            placeholder="A brief summary of your professional background and career goals..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Professional Links</Label>
          <div className="space-y-2">
            <Input
              value={data.links.linkedin || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleLinksChange('linkedin', e.target.value)
              }
              placeholder="LinkedIn URL"
            />
            <Input
              value={data.links.github || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleLinksChange('github', e.target.value)
              }
              placeholder="GitHub URL"
            />
            <Input
              value={data.links.portfolio || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleLinksChange('portfolio', e.target.value)
              }
              placeholder="Portfolio URL"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
