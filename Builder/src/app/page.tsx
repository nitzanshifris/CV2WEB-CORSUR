import { BuilderContent } from '@/components/website/BuilderContent';
import { BuilderFooter } from '@/components/website/BuilderFooter';
import { BuilderHeader } from '@/components/website/BuilderHeader';
import { BuilderSidebar } from '@/components/website/BuilderSidebar';
import { Suspense } from 'react';

export default function BuilderPage() {
  return (
    <div className="flex h-screen">
      <Suspense fallback={<div>Loading sidebar...</div>}>
        <BuilderSidebar />
      </Suspense>

      <div className="flex flex-col flex-1">
        <Suspense fallback={<div>Loading header...</div>}>
          <BuilderHeader />
        </Suspense>

        <main className="flex-1 overflow-auto p-6">
          <Suspense fallback={<div>Loading content...</div>}>
            <BuilderContent />
          </Suspense>
        </main>

        <Suspense fallback={<div>Loading footer...</div>}>
          <BuilderFooter />
        </Suspense>
      </div>
    </div>
  );
}
