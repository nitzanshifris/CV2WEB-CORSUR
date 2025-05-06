import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useResume } from '@/hooks/useResume';
import { useTemplate } from '@/hooks/useTemplate';
import { Code, Eye, Settings } from 'lucide-react';
import { useState } from 'react';

export function BuilderContent() {
  const [activeTab, setActiveTab] = useState('preview');
  const { resume, isLoading: isResumeLoading } = useResume();
  const { preview, isLoading: isPreviewLoading } = useTemplate();

  return (
    <div className="h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <TabsList>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Code
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Save Draft
            </Button>
            <Button size="sm">Publish</Button>
          </div>
        </div>

        <TabsContent value="preview" className="h-[calc(100%-3rem)]">
          <div className="grid h-full grid-cols-2 gap-4 p-4">
            <Card className="p-4">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Enter resume title" />
                  </div>
                  <div>
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                      id="summary"
                      placeholder="Enter your professional summary"
                      className="min-h-[100px]"
                    />
                  </div>
                  <Separator />
                  <div>
                    <Label>Contact Information</Label>
                    <div className="mt-2 grid gap-2">
                      <Input placeholder="Email" />
                      <Input placeholder="Phone" />
                      <Input placeholder="Location" />
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </Card>

            <Card className="p-4">
              <ScrollArea className="h-full">
                {isPreviewLoading ? (
                  <div className="flex h-full items-center justify-center">Loading preview...</div>
                ) : (
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: preview }}
                  />
                )}
              </ScrollArea>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="code" className="h-[calc(100%-3rem)]">
          <Card className="m-4 h-[calc(100%-2rem)]">
            <ScrollArea className="h-full p-4">
              <pre className="text-sm">{isPreviewLoading ? 'Loading...' : preview}</pre>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="h-[calc(100%-3rem)]">
          <Card className="m-4 h-[calc(100%-2rem)]">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                <div>
                  <Label>SEO Settings</Label>
                  <div className="mt-2 space-y-2">
                    <Input placeholder="Meta Title" />
                    <Textarea placeholder="Meta Description" />
                    <Input placeholder="Keywords" />
                  </div>
                </div>
                <Separator />
                <div>
                  <Label>Social Media</Label>
                  <div className="mt-2 space-y-2">
                    <Input placeholder="LinkedIn URL" />
                    <Input placeholder="GitHub URL" />
                    <Input placeholder="Twitter URL" />
                  </div>
                </div>
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
