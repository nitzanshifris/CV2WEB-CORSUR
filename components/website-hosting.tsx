import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Copy, Globe, Link, Share2, Server } from "lucide-react";
import { toast } from "sonner";

const hostingFeatures = [
  {
    name: "Free Subdomain",
    description: "Get a unique subdomain for your CV website",
    icon: Globe,
    features: [
      "Instant availability",
      "SSL security",
      "No configuration needed",
      "Easy to remember",
    ],
  },
  {
    name: "Automatic Hosting",
    description: "Your website is hosted and maintained automatically",
    icon: Server,
    features: [
      "99.9% uptime",
      "Global CDN",
      "Automatic backups",
      "Zero maintenance",
    ],
  },
  {
    name: "Easy Sharing",
    description: "Share your CV with recruiters in seconds",
    icon: Share2,
    features: [
      "One-click sharing",
      "Mobile-friendly",
      "Print support",
      "Analytics dashboard",
    ],
  },
];

export function WebsiteHosting() {
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
          <h2 className="text-3xl font-bold mb-4">Website Hosting & Sharing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your CV website is automatically hosted and ready to share. No server management required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {hostingFeatures.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.name}</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">{feature.description}</p>
                  
                  <ul className="space-y-2">
                    {feature.features.map((item) => (
                      <li key={item} className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                        {item}
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
            <Link className="w-5 h-5 text-muted-foreground" />
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