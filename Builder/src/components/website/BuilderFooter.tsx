import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, Eye, Save, Share2 } from 'lucide-react';

export function BuilderFooter() {
  return (
    <footer className="border-t bg-background px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Draft</Badge>
            <span className="text-sm text-muted-foreground">Last saved 2 minutes ago</span>
          </div>
          <div className="w-48">
            <Progress value={75} className="h-2" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </footer>
  );
}
