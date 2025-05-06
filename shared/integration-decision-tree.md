/_ CV2WEB Integration Decision Tree Purpose: Visual troubleshooting guide for
integration failures between UI, Builder, and Services. Helps teams quickly
identify, diagnose, and resolve integration issues. Owner: Project Lead Last
Updated: 2024-06-09 Update Process: Update this file when integration points,
error codes, or troubleshooting steps change. All changes must be approved by
the Project Lead. Reference related docs in shared/ and .notes/. Usage: This
file is a React component. To view, render it in the app or Storybook. For a
static summary, see integration_points.md or README. _/

import React from 'react';

const DecisionTree = () => { const flowchartStyle = { fontFamily: 'system-ui,
sans-serif', maxWidth: '100%', };

const nodeStyle = { border: '2px solid #4338ca', borderRadius: '8px', padding:
'12px', margin: '8px', backgroundColor: '#eef2ff', maxWidth: '250px', };

const decisionNodeStyle = { ...nodeStyle, borderColor: '#0369a1',
backgroundColor: '#e0f2fe', };

const errorNodeStyle = { ...nodeStyle, borderColor: '#b91c1c', backgroundColor:
'#fee2e2', };

const actionNodeStyle = { ...nodeStyle, borderColor: '#15803d', backgroundColor:
'#dcfce7', };

const connectorStyle = { width: '2px', backgroundColor: '#9ca3af', margin: '0
auto', height: '24px', };

const branchConnectorStyle = { display: 'flex', justifyContent: 'center',
position: 'relative', };

const branchLineStyle = { position: 'absolute', top: '0', height: '24px', width:
'80%', borderBottom: '2px solid #9ca3af', borderLeft: '2px solid #9ca3af',
borderRight: '2px solid #9ca3af', borderTop: 'none', borderRadius: '0 0 8px
8px', };

const labelStyle = { display: 'inline-block', fontSize: '12px', padding: '4px
8px', backgroundColor: '#f3f4f6', borderRadius: '4px', margin: '0 4px', };

return ( <div className="p-4 bg-white rounded-lg shadow">

<h2 className="text-xl font-bold mb-6 text-center">CV2WEB Integration Failure
Decision Tree</h2>

      <div style={flowchartStyle}>
        {/* Starting point */}
        <div className="flex justify-center">
          <div style={decisionNodeStyle}>
            <div className="font-bold">Integration Issue Detected</div>
            <div className="text-sm mt-2">Which integration point is failing?</div>
          </div>
        </div>

        <div style={connectorStyle}></div>

        {/* Main decision branches */}
        <div style={branchConnectorStyle}>
          <div style={branchLineStyle}></div>
          <div className="flex justify-between w-full px-8">
            <div className="text-center">
              <div style={labelStyle}>UI → Builder</div>
              <div style={connectorStyle}></div>
              <div style={decisionNodeStyle}>
                <div className="font-bold">Resume Parsing or Preview</div>
                <div className="text-sm mt-2">What specific error occurred?</div>
              </div>

              <div style={connectorStyle}></div>
              <div className="flex justify-between">
                <div className="text-center">
                  <div style={labelStyle}>File Format</div>
                  <div style={connectorStyle}></div>
                  <div style={errorNodeStyle}>
                    <div className="font-bold">PARSE_INVALID_FORMAT</div>
                    <div className="text-sm mt-2">Unsupported file format</div>
                  </div>
                  <div style={connectorStyle}></div>
                  <div style={actionNodeStyle}>
                    <div className="font-bold">Action:</div>
                    <div className="text-sm mt-2">
                      1. Check file extension<br />
                      2. Validate MIME type<br />
                      3. Try file conversion
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div style={labelStyle}>Empty Data</div>
                  <div style={connectorStyle}></div>
                  <div style={errorNodeStyle}>
                    <div className="font-bold">PARSE_EMPTY_RESULT</div>
                    <div className="text-sm mt-2">No data extracted</div>
                  </div>
                  <div style={connectorStyle}></div>
                  <div style={actionNodeStyle}>
                    <div className="font-bold">Action:</div>
                    <div className="text-sm mt-2">
                      1. Check file content<br />
                      2. Try alternative parser<br />
                      3. Suggest AI interview
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div style={labelStyle}>UI → Services</div>
              <div style={connectorStyle}></div>
              <div style={decisionNodeStyle}>
                <div className="font-bold">Auth or Payment</div>
                <div className="text-sm mt-2">What specific error occurred?</div>
              </div>

              <div style={connectorStyle}></div>
              <div className="flex justify-between">
                <div className="text-center">
                  <div style={labelStyle}>Auth Error</div>
                  <div style={connectorStyle}></div>
                  <div style={errorNodeStyle}>
                    <div className="font-bold">AUTH_INVALID_TOKEN</div>
                    <div className="text-sm mt-2">Invalid or expired token</div>
                  </div>
                  <div style={connectorStyle}></div>
                  <div style={actionNodeStyle}>
                    <div className="font-bold">Action:</div>
                    <div className="text-sm mt-2">
                      1. Clear local storage<br />
                      2. Redirect to login<br />
                      3. Check time synchronization
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div style={labelStyle}>Payment Error</div>
                  <div style={connectorStyle}></div>
                  <div style={errorNodeStyle}>
                    <div className="font-bold">PAY_PROCESSING_FAILED</div>
                    <div className="text-sm mt-2">Payment processing failed</div>
                  </div>
                  <div style={connectorStyle}></div>
                  <div style={actionNodeStyle}>
                    <div className="font-bold">Action:</div>
                    <div className="text-sm mt-2">
                      1. Check Stripe logs<br />
                      2. Verify webhook receipt<br />
                      3. Create manual order
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div style={labelStyle}>Services → Builder</div>
              <div style={connectorStyle}></div>
              <div style={decisionNodeStyle}>
                <div className="font-bold">Deployment or Domain</div>
                <div className="text-sm mt-2">What specific error occurred?</div>
              </div>

              <div style={connectorStyle}></div>
              <div className="flex justify-between">
                <div className="text-center">
                  <div style={labelStyle}>Deployment Error</div>
                  <div style={connectorStyle}></div>
                  <div style={errorNodeStyle}>
                    <div className="font-bold">DEPLOY_BUILD_FAILED</div>
                    <div className="text-sm mt-2">Website build failed</div>
                  </div>
                  <div style={connectorStyle}></div>
                  <div style={actionNodeStyle}>
                    <div className="font-bold">Action:</div>
                    <div className="text-sm mt-2">
                      1. Check build logs<br />
                      2. Validate template HTML<br />
                      3. Try manual deployment
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div style={labelStyle}>Domain Error</div>
                  <div style={connectorStyle}></div>
                  <div style={errorNodeStyle}>
                    <div className="font-bold">DOMAIN_UNAVAILABLE</div>
                    <div className="text-sm mt-2">Domain unavailable</div>
                  </div>
                  <div style={connectorStyle}></div>
                  <div style={actionNodeStyle}>
                    <div className="font-bold">Action:</div>
                    <div className="text-sm mt-2">
                      1. Verify domain status<br />
                      2. Check registrar API<br />
                      3. Suggest alternatives
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded border border-gray-200">
        <h3 className="font-bold text-lg mb-2">General Integration Troubleshooting Steps</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Identify which component is reporting the error (error code prefix)</li>
          <li>Check logs for detailed error information</li>
          <li>Verify environment variables and API keys</li>
          <li>Confirm network connectivity between services</li>
          <li>Validate input data format against API contract</li>
          <li>Test with minimal example in isolation</li>
          <li>Check for recent changes that may have affected integration</li>
          <li>Contact team responsible for the failing component</li>
        </ol>
      </div>
    </div>

); };

export default DecisionTree;
