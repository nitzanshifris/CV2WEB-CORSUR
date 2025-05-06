import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const templates = [
  {
    name: 'Minimal Portfolio',
    description: 'Clean and minimalist design with focus on content',
    image: '/templates/minimal.jpg',
    features: [
      'Clean and modern design',
      'Grid project showcase',
      'Subtle animations',
      'Full mobile support',
    ],
    github: 'https://github.com/example/minimal-portfolio',
    demo: 'https://minimal-portfolio.vercel.app',
  },
  {
    name: 'Creative Showcase',
    description: 'Dynamic website with advanced animations',
    image: '/templates/creative.jpg',
    features: [
      'GSAP animations',
      'Interactive project gallery',
      'Visual effects',
      'Dynamic skills display',
    ],
    github: 'https://github.com/example/creative-showcase',
    demo: 'https://creative-showcase.vercel.app',
  },
  {
    name: 'Professional Resume',
    description: 'Professional and formal resume website',
    image: '/templates/professional.jpg',
    features: [
      'Traditional layout',
      'Print-friendly resume view',
      'Timeline view',
      'Multi-language support',
    ],
    github: 'https://github.com/example/professional-resume',
    demo: 'https://professional-resume.vercel.app',
  },
  {
    name: 'Interactive CV',
    description: 'Interactive website with dynamic elements',
    image: '/templates/interactive.jpg',
    features: [
      'Mouse interactions',
      '3D effects',
      'Interactive skills display',
      'Advanced animations',
    ],
    github: 'https://github.com/example/interactive-cv',
    demo: 'https://interactive-cv.vercel.app',
  },
];

export function CVTemplates() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">CV Website Templates</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from a variety of modern and customizable templates to build your resume website
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template, index) => (
            <motion.div
              key={template.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                  <p className="text-muted-foreground mb-4">{template.description}</p>

                  <ul className="space-y-2 mb-6">
                    {template.features.map(feature => (
                      <li key={feature} className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <a href={template.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        Source Code
                      </a>
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                      <a href={template.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Demo
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
