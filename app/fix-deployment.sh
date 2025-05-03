#!/bin/bash

# 1. Remove duplicate configuration files
rm -f tailwind.config.js
rm -f next.config.js
rm -f tsconfig.json
rm -f vercel.json
rm -f docker-compose.yml

# 2. Create project structure
mkdir -p projects/cv2web
mkdir -p projects/main-app
mkdir -p projects/joshwcomeau-clone
mkdir -p projects/python-legacy
mkdir -p config/next
mkdir -p config/typescript
mkdir -p config/docker
mkdir -p config/vercel
mkdir -p config/supabase
mkdir -p system/public
mkdir -p system/uploads
mkdir -p system/logs
mkdir -p system/temp

# 3. Move configuration files
mv next.config.js config/next/
mv tailwind.config.js config/next/
mv tsconfig.json config/next/
mv vercel.json config/next/
mv docker-compose.yml config/docker/

# 4. Copy project files
cp -r src projects/cv2web/
cp -r public projects/cv2web/
cp -r supabase projects/cv2web/
cp package.json projects/cv2web/
cp package-lock.json projects/cv2web/
cp .gitignore projects/cv2web/
cp .env projects/cv2web/
cp README.md projects/cv2web/

# 5. Update package.json
cat > projects/cv2web/package.json << 'EOL'
{
  "name": "cv2web",
  "version": "1.0.0",
  "description": "CV to Website Generator - Convert your CV into a beautiful website",
  "main": "src/index.ts",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "format": "prettier --write .",
    "prepare": "husky install"
  },
  "dependencies": {
    "@prisma/client": "^6.7.0",
    "@radix-ui/react-dialog": "^1.1.11",
    "@radix-ui/react-label": "^2.1.4",
    "@radix-ui/react-slot": "^1.2.0",
    "@supabase/auth-helpers-nextjs": "^0.9.0",
    "@supabase/supabase-js": "^2.39.7",
    "@types/node": "^20.11.24",
    "@types/react": "^18.2.61",
    "@types/react-dom": "^18.2.19",
    "autoprefixer": "^10.4.17",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "critters": "^0.0.23",
    "framer-motion": "^11.18.2",
    "lucide-react": "^0.503.0",
    "next": "14.1.0",
    "openai": "^4.96.2",
    "postcss": "^8.4.35",
    "prisma": "^6.7.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-dropzone": "^14.3.8",
    "tailwind-merge": "^2.6.0",
    "tailwindcss": "^3.4.1",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "^5.3.3"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^14.2.1",
    "@types/jest": "^29.5.12",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.1.0",
    "husky": "^9.0.11",
    "jest": "^29.7.0",
    "prettier": "^3.2.5"
  },
  "author": "Your Name",
  "license": "MIT"
}
EOL

# 6. Create vercel.json
cat > config/next/vercel.json << 'EOL'
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["fra1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@next_public_supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@next_public_supabase_anon_key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_role_key",
    "NEXT_PUBLIC_API_URL": "@next_public_api_url",
    "NEXT_PUBLIC_SITE_URL": "@next_public_site_url",
    "JWT_SECRET": "@jwt_secret",
    "SESSION_SECRET": "@session_secret"
  },
  "routes": [
    {
      "src": "/api/health",
      "dest": "/api/health"
    },
    {
      "src": "/debug",
      "dest": "/debug"
    }
  ]
}
EOL

# 7. Create health check API
mkdir -p projects/cv2web/src/app/api/health
cat > projects/cv2web/src/app/api/health/route.ts << 'EOL'
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const startTime = Date.now();
  let supabaseStatus = 'unknown';
  
  // Check Supabase connection
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      const { data, error } = await supabase.from('health_checks').select('count').single();
      supabaseStatus = error ? 'error' : 'connected';
    } catch (error) {
      supabaseStatus = 'error';
    }
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    supabase: {
      status: supabaseStatus,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'missing',
    },
    config: {
      apiUrl: process.env.NEXT_PUBLIC_API_URL ? 'configured' : 'missing',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ? 'configured' : 'missing',
    },
    performance: {
      responseTime: Date.now() - startTime,
    },
  });
}
EOL

# 8. Create debug page
mkdir -p projects/cv2web/src/app/debug
cat > projects/cv2web/src/app/debug/page.tsx << 'EOL'
'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [healthCheck, setHealthCheck] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then(setHealthCheck)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Environment</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify({
            NODE_ENV: process.env.NODE_ENV,
            NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
            NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
            hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          }, null, 2)}
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Health Check</h2>
        {error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : healthCheck ? (
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(healthCheck, null, 2)}
          </pre>
        ) : (
          <div>Loading...</div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Browser Information</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify({
            userAgent: window.navigator.userAgent,
            language: window.navigator.language,
            platform: window.navigator.platform,
            vendor: window.navigator.vendor,
          }, null, 2)}
        </pre>
      </section>
    </div>
  );
}
EOL

# 9. Create middleware
cat > projects/cv2web/src/middleware.ts << 'EOL'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if needed
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/debug', '/api/health'];
  const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  if (!session && !isPublicRoute) {
    // Redirect to login if accessing protected route without session
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
EOL

# 10. Make script executable
chmod +x fix-deployment.sh

echo "Deployment fix script created. Run './fix-deployment.sh' to fix deployment issues." 