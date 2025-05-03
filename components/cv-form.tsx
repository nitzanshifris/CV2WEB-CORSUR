import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "./ui/card";
import { motion } from "framer-motion";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Plus, Trash2, Upload } from "lucide-react";
import { ParsedResume } from "@/utils/resume-parser";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

const cvFormSchema = z.object({
  profileImage: z.string().optional(),
  fullName: z.string().min(2, "Full name is required"),
  title: z.string().min(2, "Title is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  summary: z.string().min(10, "Summary is required"),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string().url("Invalid URL"),
  })),
  skills: z.array(z.string()),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    description: z.string(),
  })),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    description: z.string().optional(),
  })),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
  })),
});

interface CVFormProps {
  initialData?: ParsedResume | null;
}

export function CVForm({ initialData }: CVFormProps) {
  const form = useForm<z.infer<typeof cvFormSchema>>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
      profileImage: "",
      fullName: initialData?.fullName || "",
      title: initialData?.title || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      summary: initialData?.summary || "",
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
                      const currentLinks = form.getValues("socialLinks");
                      form.setValue("socialLinks", [
                        ...currentLinks,
                        { platform: "", url: "" },
                      ]);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Social Link
                  </Button>
                </div>

                {form.watch("socialLinks").map((_, index) => (
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
                        const currentLinks = form.getValues("socialLinks");
                        form.setValue(
                          "socialLinks",
                          currentLinks.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Skills</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentSkills = form.getValues("skills");
                      form.setValue("skills", [...currentSkills, ""]);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                </div>

                {form.watch("skills").map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name={`skills.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Skill" {...field} />
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
                        const currentSkills = form.getValues("skills");
                        form.setValue(
                          "skills",
                          currentSkills.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Experience */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Experience</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentExperience = form.getValues("experience");
                      form.setValue("experience", [
                        ...currentExperience,
                        {
                          title: "",
                          company: "",
                          startDate: "",
                          endDate: "",
                          description: "",
                        },
                      ]);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </div>

                {form.watch("experience").map((_, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Experience {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const currentExperience = form.getValues("experience");
                          form.setValue(
                            "experience",
                            currentExperience.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`experience.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Job Title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`experience.${index}.company`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input placeholder="Company Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`experience.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`experience.${index}.endDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`experience.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your role and achievements"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Education</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentEducation = form.getValues("education");
                      form.setValue("education", [
                        ...currentEducation,
                        {
                          degree: "",
                          institution: "",
                          startDate: "",
                          endDate: "",
                          description: "",
                        },
                      ]);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </div>

                {form.watch("education").map((_, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Education {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const currentEducation = form.getValues("education");
                          form.setValue(
                            "education",
                            currentEducation.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`education.${index}.degree`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Degree</FormLabel>
                            <FormControl>
                              <Input placeholder="Degree" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`education.${index}.institution`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution</FormLabel>
                            <FormControl>
                              <Input placeholder="Institution Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`education.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`education.${index}.endDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`education.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your education"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Projects</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentProjects = form.getValues("projects");
                      form.setValue("projects", [
                        ...currentProjects,
                        {
                          name: "",
                          description: "",
                          technologies: [],
                        },
                      ]);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </div>

                {form.watch("projects").map((_, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Project {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const currentProjects = form.getValues("projects");
                          form.setValue(
                            "projects",
                            currentProjects.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name={`projects.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Project Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`projects.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your project"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Technologies</h5>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentTechnologies =
                              form.getValues(`projects.${index}.technologies`);
                            form.setValue(`projects.${index}.technologies`, [
                              ...currentTechnologies,
                              "",
                            ]);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Technology
                        </Button>
                      </div>

                      {form
                        .watch(`projects.${index}.technologies`)
                        .map((_, techIndex) => (
                          <div key={techIndex} className="flex items-center gap-4">
                            <FormField
                              control={form.control}
                              name={`projects.${index}.technologies.${techIndex}`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input placeholder="Technology" {...field} />
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
                                const currentTechnologies = form.getValues(
                                  `projects.${index}.technologies`
                                );
                                form.setValue(
                                  `projects.${index}.technologies`,
                                  currentTechnologies.filter(
                                    (_, i) => i !== techIndex
                                  )
                                );
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full">
                Create CV Website
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
} 