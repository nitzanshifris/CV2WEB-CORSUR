/_ CV2WEB Project Flowchart Purpose: Visualizes the end-to-end MVP flow, team
responsibilities, and integration points for the CV2Web project. Intended for
onboarding, planning, and troubleshooting. Owner: Project Lead Last Updated:
2024-06-09 Update Process: Update this file when the project flow or team
responsibilities change. All changes must be approved by the Project Lead.
Reference related docs in shared/ and .notes/. Usage: This file is a React
component. To view, render it in the app or Storybook. For a static summary, see
the README or team-summary. _/

import React from 'react';

const ProjectFlowchart = () => { const boxStyle = { padding: '12px',
borderRadius: '8px', margin: '8px', textAlign: 'center', width: '220px', };

const teamBoxStyle = { padding: '4px 12px', borderRadius: '4px', margin: '4px',
fontWeight: 'bold', fontSize: '12px', };

const connectorStyle = { width: '2px', backgroundColor: '#9ca3af', margin: '0
auto', height: '20px', };

const horizontalConnectorStyle = { height: '2px', backgroundColor: '#9ca3af',
width: '20px', };

const arrowStyle = { width: 0, height: 0, borderLeft: '8px solid transparent',
borderRight: '8px solid transparent', borderTop: '8px solid #9ca3af', margin: '0
auto', };

return ( <div className="p-6 bg-white rounded-lg shadow">

<h2 className="text-2xl font-bold mb-8 text-center">CV2WEB Project Flow (48-Hour
MVP)</h2>

      <div className="flex flex-col items-center">
        {/* Start point */}
        <div style={{...boxStyle, backgroundColor: '#f0fdf4', border: '2px solid #16a34a'}}>
          <div className="font-bold">User Uploads Resume</div>
          <div className="text-xs mt-1">PDF, DOCX, Image, HTML</div>
          <div style={{...teamBoxStyle, backgroundColor: '#dcfce7', color: '#15803d'}}>UI TEAM</div>
        </div>

        <div style={connectorStyle}></div>
        <div style={arrowStyle}></div>

        {/* Resume parsing */}
        <div style={{...boxStyle, backgroundColor: '#eff6ff', border: '2px solid #2563eb'}}>
          <div className="font-bold">Resume Parsed</div>
          <div className="text-xs mt-1">Data extraction & structuring</div>
          <div style={{...teamBoxStyle, backgroundColor: '#dbeafe', color: '#1d4ed8'}}>BUILDER TEAM</div>
        </div>

        <div style={connectorStyle}></div>
        <div style={arrowStyle}></div>

        {/* Template selection */}
        <div style={{...boxStyle, backgroundColor: '#f0fdf4', border: '2px solid #16a34a'}}>
          <div className="font-bold">Template Selection</div>
          <div className="text-xs mt-1">User selects design template</div>
          <div style={{...teamBoxStyle, backgroundColor: '#dcfce7', color: '#15803d'}}>UI TEAM</div>
        </div>

        <div style={connectorStyle}></div>
        <div style={arrowStyle}></div>

        {/* Preview generation */}
        <div style={{...boxStyle, backgroundColor: '#eff6ff', border: '2px solid #2563eb'}}>
          <div className="font-bold">Preview Generated</div>
          <div className="text-xs mt-1">HTML/CSS website rendered</div>
          <div style={{...teamBoxStyle, backgroundColor: '#dbeafe', color: '#1d4ed8'}}>BUILDER TEAM</div>
        </div>

        <div style={connectorStyle}></div>
        <div style={arrowStyle}></div>

        {/* Customization */}
        <div style={{...boxStyle, backgroundColor: '#f0fdf4', border: '2px solid #16a34a'}}>
          <div className="font-bold">Website Customization</div>
          <div className="text-xs mt-1">Colors, layout adjustments</div>
          <div style={{...teamBoxStyle, backgroundColor: '#dcfce7', color: '#15803d'}}>UI TEAM</div>
        </div>

        <div style={connectorStyle}></div>
        <div style={arrowStyle}></div>

        {/* Checkout */}
        <div style={{...boxStyle, backgroundColor: '#f0fdf4', border: '2px solid #16a34a'}}>
          <div className="font-bold">Checkout Process</div>
          <div className="text-xs mt-1">Payment via Stripe ($14.99+)</div>
          <div className="flex justify-center mt-1">
            <div style={{...teamBoxStyle, backgroundColor: '#dcfce7', color: '#15803d'}}>UI TEAM</div>
            <div style={{...teamBoxStyle, backgroundColor: '#fef3c7', color: '#b45309'}}>SERVICES TEAM</div>
          </div>
        </div>

        <div style={connectorStyle}></div>
        <div style={arrowStyle}></div>

        {/* Domain selection */}
        <div className="flex items-center">
          <div style={{...boxStyle, backgroundColor: '#fff7ed', border: '2px solid #ea580c'}}>
            <div className="font-bold">Domain Selection</div>
            <div className="text-xs mt-1">Optional domain registration</div>
            <div style={{...teamBoxStyle, backgroundColor: '#fef3c7', color: '#b45309'}}>SERVICES TEAM</div>
          </div>

          <div style={horizontalConnectorStyle}></div>

          <div style={{...boxStyle, backgroundColor: '#fff7ed', border: '2px solid #ea580c'}}>
            <div className="font-bold">Payment Processing</div>
            <div className="text-xs mt-1">Stripe webhook handling</div>
            <div style={{...teamBoxStyle, backgroundColor: '#fef3c7', color: '#b45309'}}>SERVICES TEAM</div>
          </div>
        </div>

        <div style={connectorStyle}></div>
        <div style={arrowStyle}></div>

        {/* Deployment */}
        <div style={{...boxStyle, backgroundColor: '#eff6ff', border: '2px solid #2563eb'}}>
          <div className="font-bold">Website Deployment</div>
          <div className="text-xs mt-1">Vercel API integration</div>
          <div style={{...teamBoxStyle, backgroundColor: '#dbeafe', color: '#1d4ed8'}}>BUILDER TEAM</div>
        </div>

        <div style={connectorStyle}></div>
        <div style={arrowStyle}></div>

        {/* Dashboard */}
        <div style={{...boxStyle, backgroundColor: '#f0fdf4', border: '2px solid #16a34a'}}>
          <div className="font-bold">Dashboard Access</div>
          <div className="text-xs mt-1">Website management & stats</div>
          <div style={{...teamBoxStyle, backgroundColor: '#dcfce7', color: '#15803d'}}>UI TEAM</div>
        </div>

        <div style={connectorStyle}></div>
        <div style={arrowStyle}></div>

        {/* Revisions */}
        <div className="flex items-center">
          <div style={{...boxStyle, backgroundColor: '#fff7ed', border: '2px solid #ea580c'}}>
            <div className="font-bold">Revision Requests</div>
            <div className="text-xs mt-1">2 free, $4 after</div>
            <div style={{...teamBoxStyle, backgroundColor: '#fef3c7', color: '#b45309'}}>SERVICES TEAM</div>
          </div>

          <div style={horizontalConnectorStyle}></div>

          <div style={{...boxStyle, backgroundColor: '#eff6ff', border: '2px solid #2563eb'}}>
            <div className="font-bold">Site Updates</div>
            <div className="text-xs mt-1">Content & template changes</div>
            <div style={{...teamBoxStyle, backgroundColor: '#dbeafe', color: '#1d4ed8'}}>BUILDER TEAM</div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded border border-gray-200">
          <h3 className="font-bold text-center" style={{color: '#15803d'}}>UI Team (CV2WEB13)</h3>
          <ul className="text-sm mt-2 space-y-1">
            <li>• File upload component</li>
            <li>• Preview iframe</li>
            <li>• Template customization</li>
            <li>• Checkout UI</li>
            <li>• Dashboard & management</li>
            <li>• AI interview alternative</li>
          </ul>
        </div>

        <div className="p-4 bg-gray-50 rounded border border-gray-200">
          <h3 className="font-bold text-center" style={{color: '#1d4ed8'}}>Builder Team (CV2WEB-CURSOR)</h3>
          <ul className="text-sm mt-2 space-y-1">
            <li>• Resume parsing</li>
            <li>• Data extraction</li>
            <li>• Template rendering</li>
            <li>• HTML/CSS generation</li>
            <li>• Website deployment</li>
            <li>• Domain configuration</li>
          </ul>
        </div>

        <div className="p-4 bg-gray-50 rounded border border-gray-200">
          <h3 className="font-bold text-center" style={{color: '#b45309'}}>Services Team (CV2WEBMAIN)</h3>
          <ul className="text-sm mt-2 space-y-1">
            <li>• Authentication (Supabase)</li>
            <li>• Payments (Stripe)</li>
            <li>• File storage</li>
            <li>• Database management</li>
            <li>• Domain registration</li>
            <li>• API endpoints</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 p-4 bg-indigo-50 rounded border border-indigo-200">
        <h3 className="font-bold text-center text-indigo-800 mb-2">Critical Path Timeline (48 Hours)</h3>
        <div className="flex justify-between">
          <div className="text-center">
            <div className="font-semibold text-indigo-700">Hours 0-8</div>
            <div className="text-xs">Core setup & parsing</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-indigo-700">Hours 8-16</div>
            <div className="text-xs">Template & preview</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-indigo-700">Hours 16-24</div>
            <div className="text-xs">Payment & deployment</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-indigo-700">Hours 24-36</div>
            <div className="text-xs">Dashboard & domains</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-indigo-700">Hours 36-48</div>
            <div className="text-xs">Testing & hot fixes</div>
          </div>
        </div>
      </div>
    </div>

); };

export default ProjectFlowchart;
