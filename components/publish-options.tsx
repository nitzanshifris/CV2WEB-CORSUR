import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Copy, Globe, Link, Share2 } from "lucide-react";
import { toast } from "sonner";

const publishOptions = [
  {
    name: "Free Subdomain",
    description: "Get a unique subdomain (e.g., username.cv2website.com)",
    icon: Globe,
    features: [
      "Unique URL",
      "Instant availability",
      "No cost",
      "SSL support",
    ],
  },
  {
    name: "Easy Sharing",
    description: "Share your resume with employers easily",
    icon: Share2,
    features: [
      "Shareable link",
      "Mobile-responsive",
      "Print support",
      "Basic analytics",
    ],
  },
  {
    name: "Simple Management",
    description: "Update your content anytime without technical knowledge",
    icon: Link,
    features: [
      "Real-time editing",
      "Auto-save",
      "Version history",
      "Automatic backup",
    ],
  },
];

export function PublishOptions() {
  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://username.cv2website.com");
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="py-12 bg-muted">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Publish & Share</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Publish your resume website and get a unique URL to share with employers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {publishOptions.map((option, index) => (
            <motion.div
              key={option.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <option.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{option.name}</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">{option.description}</p>
                  
                  <ul className="space-y-2">
                    {option.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
            <span className="text-muted-foreground">https://username.cv2website.com</span>
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 