import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Download, FileText, Globe, Home, Layout, Palette, Settings, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Overview',
    href: '/builder',
    icon: Home,
  },
  {
    title: 'Resume',
    href: '/builder/resume',
    icon: FileText,
  },
  {
    title: 'Template',
    href: '/builder/template',
    icon: Layout,
  },
  {
    title: 'Customize',
    href: '/builder/customize',
    icon: Palette,
  },
  {
    title: 'Domain',
    href: '/builder/domain',
    icon: Globe,
  },
  {
    title: 'Settings',
    href: '/builder/settings',
    icon: Settings,
  },
];

export function BuilderSidebar() {
  const [activeItem, setActiveItem] = useState('/builder');

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {sidebarItems.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setActiveItem(item.href)}>
              <Button
                variant={activeItem === item.href ? 'secondary' : 'ghost'}
                className={cn('w-full justify-start gap-2', activeItem === item.href && 'bg-muted')}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
