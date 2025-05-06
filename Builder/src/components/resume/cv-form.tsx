import { ParsedResume } from '@/utils/resume-parser';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Plus, Trash2, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const cvFormSchema = z.object({
  profileImage: z.string().optional(),
  fullName: z.string().min(2, 'Full name is required'),
  title: z.string().min(2, 'Title is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  summary: z.string().min(10, 'Summary is required'),
  socialLinks: z.array(
    z.object({
      platform: z.string(),
      url: z.string().url('Invalid URL'),
    })
  ),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      description: z.string(),
    })
  ),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      description: z.string().optional(),
    })
  ),
  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
    })
  ),
});

interface CVFormProps {
  initialData?: ParsedResume | null;
}

export function CVForm({ initialData }: CVFormProps) {
  const form = useForm<z.infer<typeof cvFormSchema>>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
      profileImage: '',
      fullName: initialData?.fullName || '',
      title: initialData?.title || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      summary: initialData?.summary || '',
      socialLinks: [],
      skills: initialData?.skills || [],
      experience: initialData?.experience || [],
      education: initialData?.education || [],
      projects: [],
    },
  });

  function onSubmit(values: z.infer<typeof cvFormSchema>) {
    console.log(values);
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Create Your CV</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fill in your information to create a professional CV website.
          </p>
        </motion.div>

        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Profile Image */}
              <FormField
                control={form.control}
                name="profileImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                          {field.value ? (
                            <img src={field.value} alt="Profile" />
                          ) : (
                            <Upload className="h-10 w-10" />
                          )}
                        </Avatar>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                field.onChange(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Professional Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Summary */}
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write a brief summary about yourself"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Social Links */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Social Links</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentLinks = form.getValues('socialLinks');
                      form.setValue('socialLinks', [...currentLinks, { platform: '', url: '' }]);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Social Link
                  </Button>
                </div>

                {form.watch('socialLinks').map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name={`socialLinks.${index}.platform`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Platform" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`socialLinks.${index}.url`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="URL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const currentLinks = form.getValues('socialLinks');
                        form.setValue(
                          'socialLinks',
                          currentLinks.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
