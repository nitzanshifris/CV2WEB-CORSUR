import { Experience } from '@/services/templates/types';
import { ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface ExperienceEditorProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
  className?: string;
}

export function ExperienceEditor({ experiences, onChange, className }: ExperienceEditorProps) {
  const handleChange = (index: number, field: keyof Experience, value: string) => {
    const newExperiences = [...experiences];
    newExperiences[index] = {
      ...newExperiences[index],
      [field]: value,
    };
    onChange(newExperiences);
  };

  const handleAchievementChange = (index: number, achievementIndex: number, value: string) => {
    const newExperiences = [...experiences];
    newExperiences[index].achievements[achievementIndex] = value;
    onChange(newExperiences);
  };

  const addExperience = () => {
    onChange([
      ...experiences,
      {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        achievements: [''],
      },
    ]);
  };

  const removeExperience = (index: number) => {
    const newExperiences = experiences.filter((_, i) => i !== index);
    onChange(newExperiences);
  };

  const addAchievement = (index: number) => {
    const newExperiences = [...experiences];
    newExperiences[index].achievements.push('');
    onChange(newExperiences);
  };

  const removeAchievement = (experienceIndex: number, achievementIndex: number) => {
    const newExperiences = [...experiences];
    newExperiences[experienceIndex].achievements = newExperiences[
      experienceIndex
    ].achievements.filter((_, i) => i !== achievementIndex);
    onChange(newExperiences);
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Work Experience</h2>
        <Button onClick={addExperience}>Add Experience</Button>
      </div>

      <div className="space-y-6">
        {experiences.map((experience, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium">Experience {index + 1}</h3>
              <Button variant="destructive" size="sm" onClick={() => removeExperience(index)}>
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`company-${index}`}>Company</Label>
                <Input
                  id={`company-${index}`}
                  value={experience.company}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange(index, 'company', e.target.value)
                  }
                  placeholder="Company Name"
                />
              </div>

              <div>
                <Label htmlFor={`position-${index}`}>Position</Label>
                <Input
                  id={`position-${index}`}
                  value={experience.position}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange(index, 'position', e.target.value)
                  }
                  placeholder="Job Title"
                />
              </div>

              <div>
                <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                <Input
                  id={`startDate-${index}`}
                  value={experience.startDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange(index, 'startDate', e.target.value)
                  }
                  placeholder="MM/YYYY"
                />
              </div>

              <div>
                <Label htmlFor={`endDate-${index}`}>End Date</Label>
                <Input
                  id={`endDate-${index}`}
                  value={experience.endDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange(index, 'endDate', e.target.value)
                  }
                  placeholder="MM/YYYY or Present"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`description-${index}`}>Description</Label>
              <Textarea
                id={`description-${index}`}
                value={experience.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  handleChange(index, 'description', e.target.value)
                }
                placeholder="Describe your responsibilities and achievements..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Achievements</Label>
                <Button variant="outline" size="sm" onClick={() => addAchievement(index)}>
                  Add Achievement
                </Button>
              </div>

              {experience.achievements.map((achievement, achievementIndex) => (
                <div key={achievementIndex} className="flex gap-2">
                  <Input
                    value={achievement}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleAchievementChange(index, achievementIndex, e.target.value)
                    }
                    placeholder="Enter an achievement"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeAchievement(index, achievementIndex)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
