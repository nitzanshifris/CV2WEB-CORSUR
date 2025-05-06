import { Education } from '@/services/templates/types';
import { ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface EducationEditorProps {
  education: Education[];
  onChange: (education: Education[]) => void;
  className?: string;
}

export function EducationEditor({ education, onChange, className }: EducationEditorProps) {
  const handleChange = (index: number, field: keyof Education, value: string) => {
    const newEducation = [...education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value,
    };
    onChange(newEducation);
  };

  const addEducation = () => {
    onChange([
      ...education,
      {
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        description: '',
      },
    ]);
  };

  const removeEducation = (index: number) => {
    const newEducation = education.filter((_, i) => i !== index);
    onChange(newEducation);
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Education</h2>
        <Button onClick={addEducation}>Add Education</Button>
      </div>

      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium">Education {index + 1}</h3>
              <Button variant="destructive" size="sm" onClick={() => removeEducation(index)}>
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`institution-${index}`}>Institution</Label>
                <Input
                  id={`institution-${index}`}
                  value={edu.institution}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange(index, 'institution', e.target.value)
                  }
                  placeholder="University or School Name"
                />
              </div>

              <div>
                <Label htmlFor={`degree-${index}`}>Degree</Label>
                <Input
                  id={`degree-${index}`}
                  value={edu.degree}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange(index, 'degree', e.target.value)
                  }
                  placeholder="Bachelor's, Master's, etc."
                />
              </div>

              <div>
                <Label htmlFor={`field-${index}`}>Field of Study</Label>
                <Input
                  id={`field-${index}`}
                  value={edu.field}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange(index, 'field', e.target.value)
                  }
                  placeholder="Computer Science, Business, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                  <Input
                    id={`startDate-${index}`}
                    value={edu.startDate}
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
                    value={edu.endDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, 'endDate', e.target.value)
                    }
                    placeholder="MM/YYYY or Present"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor={`description-${index}`}>Description</Label>
              <Textarea
                id={`description-${index}`}
                value={edu.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  handleChange(index, 'description', e.target.value)
                }
                placeholder="Describe your academic achievements, relevant coursework, etc..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
