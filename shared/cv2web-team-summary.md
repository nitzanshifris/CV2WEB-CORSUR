/_ CV2WEB Team Summary Purpose: Summarizes team structure, responsibilities,
tech stack, and integration points for all CV2Web teams. Intended for
onboarding, planning, and cross-team alignment. Owner: Project Lead Last
Updated: 2024-06-09 Update Process: Update this file when team structure,
responsibilities, or integration points change. All changes must be approved by
the Project Lead. Reference related docs in shared/ and .notes/. Usage: This
file is a React component. To view, render it in the app or Storybook. For a
static summary, see the README or project_overview.md. _/

import React from 'react';

const TeamSummary = () => { return (

<div className="p-6 bg-white rounded-lg shadow">
<h2 className="text-2xl font-bold mb-6 text-center">CV2WEB Team Structure &
Responsibilities</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* UI Team */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-emerald-500 text-white p-4">
            <h3 className="text-xl font-bold">UI Team (CV2WEB13)</h3>
            <p className="mt-1 text-sm">User Interface and Experience</p>
          </div>

          <div className="p-4">
            <h4 className="font-bold mb-2 text-emerald-700">Core Responsibilities</h4>
            <ul className="space-y-1 text-sm mb-4">
              <li>• Complete user experience from landing to checkout</li>
              <li>• Frontend interfaces and interactions</li>
              <li>• User journey and conversion optimization</li>
              <li>• Accessibility and responsive design</li>
            </ul>

            <h4 className="font-bold mb-2 text-emerald-700">Key Deliverables</h4>
            <ul className="space-y-1 text-sm mb-4">
              <li>• Multi-format file uploader</li>
              <li>• AI interview chat interface</li>
              <li>• Dynamic preview system</li>
              <li>• Authentication system (Supabase)</li>
              <li>• Dashboard & project management</li>
              <li>• Checkout experience</li>
              <li>• Marketing components</li>
            </ul>

            <h4 className="font-bold mb-2 text-emerald-700">Tech Stack</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">Next.js 15</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">React 19</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">TypeScript</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">Tailwind CSS</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">shadcn/ui</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">Framer Motion</span>
            </div>

            <h4 className="font-bold mb-2 text-emerald-700">Integration Points</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center">
                <span className="w-4 h-4 inline-flex items-center justify-center bg-blue-500 text-white rounded-full text-xs mr-2">→</span>
                <span><b>To Builder:</b> Resume files, template selection</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 inline-flex items-center justify-center bg-blue-500 text-white rounded-full text-xs mr-2">←</span>
                <span><b>From Builder:</b> Parsed data, HTML preview</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 inline-flex items-center justify-center bg-amber-500 text-white rounded-full text-xs mr-2">→</span>
                <span><b>To Services:</b> Auth requests, payment processing</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 inline-flex items-center justify-center bg-amber-500 text-white rounded-full text-xs mr-2">←</span>
                <span><b>From Services:</b> Auth tokens, file storage URLs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Builder Team */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-blue-500 text-white p-4">
            <h3 className="text-xl font-bold">Builder Team (CV2WEB-CURSOR)</h3>
            <p className="mt-1 text-sm">Conversion Engine & Deployment</p>
          </div>

          <div className="p-4">
            <h4 className="font-bold mb-2 text-blue-700">Core Responsibilities</h4>
            <ul className="space-y-1 text-sm mb-4">
              <li>• Resume-to-website conversion engine</li>
              <li>• Template rendering and customization</li>
              <li>• Website generation and deployment</li>
              <li>• Domain configuration and DNS</li>
            </ul>

            <h4 className="font-bold mb-2 text-blue-700">Key Deliverables</h4>
            <ul className="space-y-1 text-sm mb-4">
              <li>• Universal resume parser (multiple formats)</li>
              <li>• Template engine with profession-specific designs</li>
              <li>• Preview generator with real-time HTML rendering</li>
              <li>• Deployment engine with Vercel integration</li>
              <li>• Domain management with suggestions</li>
            </ul>

            <h4 className="font-bold mb-2 text-blue-700">Tech Stack</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">Node.js 20</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">pdf-parse</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">mammoth</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">Tesseract.js</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">Handlebars</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">Web Workers</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">Vercel API</span>
            </div>

            <h4 className="font-bold mb-2 text-blue-700">Integration Points</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center">
                <span className="w-4 h-4 inline-flex items-center justify-center bg-emerald-500 text-white rounded-full text-xs mr-2">←</span>
                <span><b>From UI:</b> Resume files, customization options</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 inline-flex items-center justify-center bg-emerald-500 text-white rounded-full text-xs mr-2">→</span>
                <span><b>To UI:</b> Parsed resume data, HTML preview</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 inline-flex items-center justify-center bg-amber-500 text-white rounded-full text-xs mr-2">←</span>
                <span><b>From Services:</b> Auth tokens, deployment triggers</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 inline-flex items-center justify-center bg-amber-500 text-white rounded-full text-xs mr-2">→</span>
                <span><b>To Services:</b> Deployment status, website data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Services Team */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-amber-500 text-white p-4">
            <h3 className="text-xl font-bold">Services Team (CV2WEBMAIN)</h3>
            <p className="mt-1 text-sm">Core Infrastructure & Business Logic</p>
          </div>

          <div className="p-4">
            <h4 className="font-bold mb-2 text-amber-700">Core Responsibilities</h4>
            <ul className="space-y-1 text-sm mb-4">
              <li>• Database architecture and management</li>
              <li>• Authentication and security</li>
              <li>• Payment processing and subscriptions</li>
              <li>• File storage and management</li>
              <li>• API endpoints and service integrations</li>
            </ul>

            <h4 className="font-bold mb-2 text-amber-700">Key Deliverables</h4>
            <ul className="space-y-1 text-sm mb-4">
              <li>• Supabase implementation with database schema</li>
              <li>• Payment processing with Stripe</li>
              <li>• Domain services integration</li>
              <li>• File management system</li>
              <li>• API layer for service integrations</li>
            </ul>

            <h4 className="font-bold mb-2 text-amber-700">Tech Stack</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">Supabase</span>
              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">PostgreSQL</span>
              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">Stripe API</span>
              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">Domain API</span>
              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">Node.js</span>
              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">TypeScript</span>
            </div>

            <h4 className="font-bold mb-2 text-amber-700">Integration Points</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center">
                <span className="w-4 h-4 inline-flex items-center justify-center bg-emerald-500 text-white rounded-full text-xs mr-2">←</span>
                <span><b>From UI:</b> Auth requests, payment processing</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 inline-flex items-center justify-center bg-emerald-500 text-white rounded-full text-xs mr-2">→</span>
                <span><b>To UI:</b> Auth tokens, storage URLs, payment status</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 inline-flex items-center justify-center bg-blue-500 text-white rounded-full text-xs mr-2">←</span>
                <span><b>From Builder:</b> Deployment status, website metadata</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 inline-flex items-center justify-center bg-blue-500 text-white rounded-full text-xs mr-2">→</span>
                <span><b>To Builder:</b> Auth tokens, deployment triggers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <h3 className="font-bold text-emerald-800 mb-2">UI Team Focus</h3>
          <ul className="text-sm space-y-2">
            <li><b>Speed Priority:</b> File uploader, template preview</li>
            <li><b>Quality Priority:</b> User journey, checkout flow</li>
            <li><b>Edge Cases:</b> Handle invalid files, payment failures</li>
            <li><b>48hr Goal:</b> Complete user journey from upload to purchase</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-2">Builder Team Focus</h3>
          <ul className="text-sm space-y-2">
            <li><b>Speed Priority:</b> Resume parsing, basic templates</li>
            <li><b>Quality Priority:</b> Data extraction accuracy, deployment</li>
            <li><b>Edge Cases:</b> Unusual resume formats, deployment errors</li>
            <li><b>48hr Goal:</b> Reliable parsing and website generation</li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-bold text-amber-800 mb-2">Services Team Focus</h3>
          <ul className="text-sm space-y-2">
            <li><b>Speed Priority:</b> Authentication, storage setup</li>
            <li><b>Quality Priority:</b> Payment processing, security</li>
            <li><b>Edge Cases:</b> Payment webhooks, authentication edge cases</li>
            <li><b>48hr Goal:</b> Secure, reliable infrastructure for all services</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 p-4 bg-violet-50 border border-violet-200 rounded-lg">
        <h3 className="font-bold text-violet-800 mb-2 text-center">Common Requirements Across All Teams</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-semibold text-violet-700">Documentation</p>
            <ul className="ml-4 list-disc text-xs mt-1 space-y-1">
              <li>Maintain `.notes` directory</li>
              <li>Document APIs and integration points</li>
              <li>Use proper commit messages</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-violet-700">Development Process</p>
            <ul className="ml-4 list-disc text-xs mt-1 space-y-1">
              <li>Follow MECE task breakdown</li>
              <li>Use appropriate work mode (Fast/Thorough)</li>
              <li>Create V0 demos for key features</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-violet-700">Quality & Security</p>
            <ul className="ml-4 list-disc text-xs mt-1 space-y-1">
              <li>Implement comprehensive error handling</li>
              <li>Maintain type safety</li>
              <li>Follow security best practices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

); };

export default TeamSummary;
