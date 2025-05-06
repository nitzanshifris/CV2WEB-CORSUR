import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserNav } from '@/components/ui/user-nav';
import { Menu, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function BuilderHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">CV2Web Builder</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
          <div className="w-full max-w-lg lg:max-w-xs">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search templates..." className="pl-8" />
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/templates">Browse Templates</Link>
          </Button>
          <Button asChild>
            <Link href="/new">Create New</Link>
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
