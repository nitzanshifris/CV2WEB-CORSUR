<!--
CV2WEB-CURSOR Builder Team – Integration Points
Purpose: Documents all API and integration points between the Builder team and other teams (UI, Services), including formats, endpoints, and code samples.
Owner: Builder Team Lead
Last Updated: 2024-06-09
Update Process: Update this file when integration points, API contracts, or formats change. All changes must be approved by the Builder Team Lead. Reference related docs: project_overview.md, directory_structure.md, task_list.md, shared/integration-decision-tree.md
-->

# CV2WEB-CURSOR (Builder Team): נקודות אינטגרציה

מסמך זה מגדיר את כל נקודות האינטגרציה בין צוות ה-Builder לבין צוותי UI ו-Services, כולל פורמטי בקשה/תגובה ודוגמאות קוד.

## 1. אינטגרציה עם צוות UI (CV2WEB13)

### 1.1 קבלת קורות חיים לניתוח

**נקודת קצה**: `POST /api/parse`

**תיאור**: קבלת קובץ קורות חיים מה-UI, ניתוחו, וחילוץ נתונים מובנים.

**בקשה** (מגיעה מה-UI):

```typescript
// FormData הכוללת:
{
  file: File, // קובץ קורות חיים (PDF, DOCX, PNG, JPEG, HTML)
  options?: {
    format: "auto" | "pdf" | "docx" | "image" | "html" // אופציונלי
  }
}
```

**תגובה** (חוזרת ל-UI):

```typescript
{
  success: boolean,
  data: ResumeData, // מבנה נתונים מובנה של קורות חיים
  confidence: {
    overall: number, // ציון כללי בין 0 ל-1
    fields: {
      fullName: number,
      title: number,
      // שאר השדות עם ציוני ביטחון
    }
  }
}
```

**יישום בצד Builder**:

```typescript
// api/parse/index.ts
import { Request, Response } from 'express';
import multer from 'multer';
import { detectFormat } from '../../src/parsers/utils/format-detection';
import { parseResume } from '../../src/parsers';
import { logger } from '../../utils/logger';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export default async function handleParse(req: Request, res: Response) {
  try {
    // השתמש ב-multer לטיפול בהעלאת קבצים
    upload.single('file')(req, res, async err => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'PARSE_UPLOAD_ERROR',
            message: err.message,
          },
        });
      }

      const file = req.file;
      if (!file) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'PARSE_NO_FILE',
            message: 'No file uploaded',
          },
        });
      }

      // בחר את הפורמט המתאים
      const requestedFormat = req.body.options?.format || 'auto';
      const format =
        requestedFormat === 'auto'
          ? detectFormat(file.originalname, file.mimetype, file.buffer)
          : requestedFormat;

      // נתח את קורות החיים
      try {
        const { data, confidence } = await parseResume(file.buffer, format, {
          filename: file.originalname,
          mimeType: file.mimetype,
        });

        return res.status(200).json({
          success: true,
          data,
          confidence,
        });
      } catch (parseError) {
        logger.error('Parse error:', parseError);
        return res.status(400).json({
          success: false,
          error: {
            code: 'PARSE_FAILED',
            message: parseError.message || 'Failed to parse resume',
            details: parseError.details,
          },
        });
      }
    });
  } catch (error) {
    logger.error('Unexpected error in parse handler:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'PARSE_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  }
}
```

### 1.2 אספקת תצוגה מקדימה של אתר

**נקודת קצה**: `POST /api/preview`

**תיאור**: קבלת נתוני קורות חיים ובחירת תבנית לצורך יצירת HTML ו-CSS לתצוגה מקדימה.

**בקשה** (מגיעה מה-UI):

```typescript
{
  resumeData: ResumeData, // נתוני קורות חיים מנותחים
  templateId: string,     // מזהה תבנית נבחרת
  customization?: {       // אפשרויות התאמה אישית (אופציונלי)
    colors?: {
      primary: string,    // צבע ראשי (קוד HEX)
      secondary: string,  // צבע משני (קוד HEX)
      accent: string,     // צבע הדגשה (קוד HEX)
      text: string,       // צבע טקסט (קוד HEX)
      background: string  // צבע רקע (קוד HEX)
    },
    layout?: {
      // אפשרויות פריסה
      sidebar: "left" | "right" | "none",
      header: "large" | "medium" | "small",
      // אפשרויות נוספות
    }
  }
}
```

**תגובה** (חוזרת ל-UI):

```typescript
{
  success: boolean,
  html: string,   // קוד HTML לתצוגה מקדימה
  css: string,    // קוד CSS לתצוגה מקדימה
  metadata?: {    // מטא-נתונים נוספים
    templateId: string,
    generatedAt: string
  }
}
```

**יישום בצד Builder**:

```typescript
// api/preview/index.ts
import { Request, Response } from 'express';
import { getTemplate } from '../../src/templates';
import { renderHTML, generateCSS } from '../../src/renderer';
import { validateResumeData } from '../../utils/validation';
import { logger } from '../../utils/logger';

export default async function handlePreview(req: Request, res: Response) {
  try {
    const { resumeData, templateId, customization } = req.body;

    // אימות הנתונים
    if (!resumeData) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'PREVIEW_NO_DATA',
          message: 'Resume data is required',
        },
      });
    }

    if (!templateId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'PREVIEW_NO_TEMPLATE',
          message: 'Template ID is required',
        },
      });
    }

    // אימות סכמת נתוני קורות החיים
    const validationResult = validateResumeData(resumeData);
    if (!validationResult.valid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'PREVIEW_INVALID_DATA',
          message: 'Invalid resume data format',
          details: validationResult.errors,
        },
      });
    }

    // קבלת התבנית הנבחרת
    const template = getTemplate(templateId);
    if (!template) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PREVIEW_TEMPLATE_NOT_FOUND',
          message: `Template '${templateId}' not found`,
        },
      });
    }

    // רנדור HTML
    const html = await renderHTML(resumeData, template, customization);

    // יצירת CSS
    const css = generateCSS(template, customization);

    // החזרת התוצאה
    return res.status(200).json({
      success: true,
      html,
      css,
      metadata: {
        templateId,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Error generating preview:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'PREVIEW_SERVER_ERROR',
        message: 'An unexpected error occurred while generating preview',
      },
    });
  }
}
```

### 1.3 פריסת אתר לאחר תשלום

**נקודת קצה**: `POST /api/deploy`

**תיאור**: קבלת בקשה לפריסת אתר לאחר תשלום מוצלח.

**בקשה** (מגיעה מה-UI):

```typescript
{
  websiteId: string,     // מזהה האתר
  userId: string,        // מזהה המשתמש
  template: {
    html: string,        // קוד HTML הסופי
    css: string          // קוד CSS הסופי
  },
  domain: string | null, // דומיין (או null אם אין)
  metadata: {
    title: string,       // כותרת האתר
    description: string, // תיאור האתר
    // מטא-נתונים נוספים
  }
}
```

**תגובה** (חוזרת ל-UI):

```typescript
{
  success: boolean,
  deploymentId: string,  // מזהה פריסה
  url: string,           // כתובת URL של האתר
  status: "queued" | "in_progress" | "complete" | "failed"
}
```

**יישום בצד Builder**:

```typescript
// api/deploy/index.ts
import { Request, Response } from 'express';
import { deployWebsite } from '../../src/deployment';
import { authenticateRequest } from '../../middleware/auth';
import { validateDeploymentData } from '../../utils/validation';
import { logger } from '../../utils/logger';

export default async function handleDeploy(req: Request, res: Response) {
  try {
    // אימות הבקשה והמשתמש
    const authResult = await authenticateRequest(req);
    if (!authResult.authenticated) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'DEPLOY_UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }

    const { websiteId, userId, template, domain, metadata } = req.body;

    // אימות נתונים
    if (!websiteId || !userId || !template) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DEPLOY_INVALID_REQUEST',
          message: 'Missing required fields',
        },
      });
    }

    // ודא שהמשתמש בבקשה תואם למשתמש המאומת
    if (userId !== authResult.userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'DEPLOY_FORBIDDEN',
          message: 'Not authorized to deploy this website',
        },
      });
    }

    // אימות נתוני הדפלוי
    const validationResult = validateDeploymentData(template, metadata);
    if (!validationResult.valid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DEPLOY_INVALID_DATA',
          message: 'Invalid deployment data',
          details: validationResult.errors,
        },
      });
    }

    // פריסת האתר
    const deployment = await deployWebsite({
      websiteId,
      userId,
      html: template.html,
      css: template.css,
      domain,
      metadata,
    });

    // החזרת תוצאת הפריסה
    return res.status(200).json({
      success: true,
      deploymentId: deployment.id,
      url: deployment.url,
      status: deployment.status,
    });
  } catch (error) {
    logger.error('Error deploying website:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'DEPLOY_SERVER_ERROR',
        message: error.message || 'An unexpected error occurred during deployment',
      },
    });
  }
}
```

## 2. אינטגרציה עם צוות Services (CV2WEBMAIN)

### 2.1 אימות בקשות וטוקנים

**תיאור**: השתמש באימות מבוסס JWT דרך Services לאימות בקשות מה-UI.

**אימות בקשה**:

```typescript
// middleware/auth.ts
import { Request } from 'express';
import { verifyToken } from '../src/services/supabase/auth';
import { logger } from '../utils/logger';

export async function authenticateRequest(req: Request): Promise<{
  authenticated: boolean;
  userId?: string;
  error?: string;
}> {
  try {
    // קבלת טוקן מה-header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authenticated: false, error: 'No token provided' };
    }

    const token = authHeader.substring(7); // הסרת 'Bearer ' מה-token

    // אימות הטוקן מול Services
    const result = await verifyToken(token);
    if (!result.valid) {
      return { authenticated: false, error: result.error };
    }

    return {
      authenticated: true,
      userId: result.userId,
    };
  } catch (error) {
    logger.error('Token verification error:', error);
    return { authenticated: false, error: 'Token verification failed' };
  }
}
```

**פונקציית אימות טוקן**:

```typescript
// src/services/supabase/auth.ts
interface TokenVerificationResult {
  valid: boolean;
  userId?: string;
  error?: string;
}

export async function verifyToken(token: string): Promise<TokenVerificationResult> {
  try {
    // שליחת בקשה לשירות האימות
    const response = await fetch(`${process.env.AUTH_SERVICE_URL}/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        valid: false,
        error: data.error || 'Token verification failed',
      };
    }

    return {
      valid: true,
      userId: data.userId,
    };
  } catch (error) {
    return {
      valid: false,
      error: 'Token verification service unavailable',
    };
  }
}
```

### 2.2 שמירת מטא-נתוני אתר במסד נתונים

**תיאור**: שמירת מטא-נתוני אתר במסד הנתונים דרך Services API.

**פונקצייה לשמירת מטא-נתונים**:

```typescript
// src/services/website/metadata.ts
interface WebsiteMetadata {
  websiteId: string;
  userId: string;
  templateId: string;
  status: string;
  deploymentUrl?: string;
  domain?: string;
  title?: string;
  description?: string;
  additionalMetadata?: any;
}

export async function saveWebsiteMetadata(metadata: WebsiteMetadata): Promise<boolean> {
  try {
    // שליחת בקשה לשרת Services לשמירת מטא-נתונים
    const response = await fetch(`${process.env.SERVICES_API_URL}/websites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SERVICES_API_KEY}`,
      },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to save metadata: ${error.message}`);
    }

    return true;
  } catch (error) {
    logger.error('Error saving website metadata:', error);
    return false;
  }
}
```

### 2.3 הגדרת דומיין לאתר

**תיאור**: הגדרת דומיין עבור אתר שנפרס.

**פונקציית הגדרת דומיין**:

```typescript
// src/services/domains/configurator.ts
interface DomainConfigResult {
  success: boolean;
  error?: string;
  dnsRecords?: Array<{
    type: string;
    name: string;
    value: string;
  }>;
}

export async function configureDomain(
  domain: string,
  deploymentUrl: string,
  websiteId: string
): Promise<DomainConfigResult> {
  try {
    // שליחת בקשה לשירות Services להגדרת הדומיין
    const response = await fetch(`${process.env.SERVICES_API_URL}/domains/configure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SERVICES_API_KEY}`,
      },
      body: JSON.stringify({
        domain,
        deploymentUrl,
        websiteId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Domain configuration failed',
      };
    }

    return {
      success: true,
      dnsRecords: data.dnsRecords,
    };
  } catch (error) {
    logger.error('Error configuring domain:', error);
    return {
      success: false,
      error: 'Domain configuration service unavailable',
    };
  }
}
```

### 2.4 עדכון סטטוס פריסה

**תיאור**: עדכון Services על סטטוס פריסה.

**פונקציית עדכון סטטוס**:

```typescript
// src/deployment/status-tracker.ts
export enum DeploymentStatus {
  QUEUED = 'queued',
  IN_PROGRESS = 'in_progress',
  COMPLETE = 'complete',
  FAILED = 'failed',
}

interface DeploymentStatusUpdate {
  deploymentId: string;
  websiteId: string;
  userId: string;
  status: DeploymentStatus;
  url?: string;
  error?: string;
}

export async function updateDeploymentStatus(update: DeploymentStatusUpdate): Promise<boolean> {
  try {
    // שליחת עדכון סטטוס לשירות Services
    const response = await fetch(`${process.env.SERVICES_API_URL}/deployments/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SERVICES_API_KEY}`,
      },
      body: JSON.stringify(update),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to update status: ${error.message}`);
    }

    return true;
  } catch (error) {
    logger.error('Error updating deployment status:', error);
    return false;
  }
}
```

## 3. פורמט שגיאות אחיד

כל שגיאה מה-API מוחזרת בפורמט אחיד:

```typescript
{
  success: false,
  error: {
    code: string,       // קוד שגיאה (e.g., "PARSE_INVALID_FORMAT")
    message: string,    // הודעת שגיאה ידידותית למשתמש
    details?: any       // פרטי שגיאה נוספים (אופציונלי)
  },
  meta?: {
    requestId?: string  // מזהה בקשה לצורך דיבוג
  }
}
```

**דוגמת יישום**:

```typescript
// utils/error.ts
export enum ErrorCode {
  // שגיאות ניתוח
  PARSE_INVALID_FORMAT = 'PARSE_INVALID_FORMAT',
  PARSE_EMPTY_RESULT = 'PARSE_EMPTY_RESULT',
  PARSE_UPLOAD_ERROR = 'PARSE_UPLOAD_ERROR',
  PARSE_NO_FILE = 'PARSE_NO_FILE',
  PARSE_SERVER_ERROR = 'PARSE_SERVER_ERROR',

  // שגיאות תצוגה מקדימה
  PREVIEW_NO_DATA = 'PREVIEW_NO_DATA',
  PREVIEW_NO_TEMPLATE = 'PREVIEW_NO_TEMPLATE',
  PREVIEW_INVALID_DATA = 'PREVIEW_INVALID_DATA',
  PREVIEW_TEMPLATE_NOT_FOUND = 'PREVIEW_TEMPLATE_NOT_FOUND',
  PREVIEW_SERVER_ERROR = 'PREVIEW_SERVER_ERROR',

  // שגיאות פריסה
  DEPLOY_UNAUTHORIZED = 'DEPLOY_UNAUTHORIZED',
  DEPLOY_INVALID_REQUEST = 'DEPLOY_INVALID_REQUEST',
  DEPLOY_FORBIDDEN = 'DEPLOY_FORBIDDEN',
  DEPLOY_INVALID_DATA = 'DEPLOY_INVALID_DATA',
  DEPLOY_SERVER_ERROR = 'DEPLOY_SERVER_ERROR',

  // שגיאות דומיין
  DOMAIN_NOT_AVAILABLE = 'DOMAIN_NOT_AVAILABLE',
  DOMAIN_CONFIGURATION_FAILED = 'DOMAIN_CONFIGURATION_FAILED',

  // שגיאות כלליות
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
}

export function createErrorResponse(
  code: ErrorCode | string,
  message: string,
  details?: any,
  requestId?: string
) {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
    ...(requestId && { meta: { requestId } }),
  };
}
```

## 4. עדכוני סטטוס פריסה

### 4.1 WebSocket / SSE לעדכון סטטוס

**תיאור**: אספקת עדכוני סטטוס פריסה ב-real-time באמצעות WebSocket או Server-Sent Events.

**יישום SSE:**

```typescript
// api/deployments/[id]/status.ts
import { Request, Response } from 'express';
import { getDeploymentById } from '../../../src/deployment/deploy-manager';
import { subscribeToDeploymentUpdates } from '../../../src/deployment/status-tracker';
import { logger } from '../../../utils/logger';

export default async function deploymentStatusStream(req: Request, res: Response) {
  const deploymentId = req.params.id;

  if (!deploymentId) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'DEPLOY_INVALID_ID',
        message: 'Deployment ID is required',
      },
    });
  }

  // בדוק שהפריסה קיימת
  const deployment = await getDeploymentById(deploymentId);
  if (!deployment) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'DEPLOY_NOT_FOUND',
        message: 'Deployment not found',
      },
    });
  }

  // הגדר headers לשימוש ב-SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  // שלח את הסטטוס הנוכחי
  const initialData = JSON.stringify({
    status: deployment.status,
    progress: deployment.progress || 0,
    url: deployment.url,
    error: deployment.error,
  });

  res.write(`data: ${initialData}\n\n`);

  // רשום מאזין לעדכוני סטטוס
  const unsubscribe = subscribeToDeploymentUpdates(deploymentId, update => {
    try {
      const data = JSON.stringify(update);
      res.write(`data: ${data}\n\n`);

      // סגור את החיבור אם הפריסה הסתיימה
      if (update.status === 'complete' || update.status === 'failed') {
        unsubscribe();
        res.end();
      }
    } catch (error) {
      logger.error('Error sending SSE update:', error);
      unsubscribe();
      res.end();
    }
  });

  // טיפול בסגירת החיבור
  req.on('close', () => {
    unsubscribe();
  });
}
```

### 4.2 Webhook התראות פריסה

**נקודת קצה**: `POST /api/webhooks/vercel`

**תיאור**: קבלת התראות מ-Vercel על סטטוס פריסה, עדכון Services API.

**יישום Webhook:**

```typescript
// api/webhooks/vercel/index.ts
import { Request, Response } from 'express';
import { verifyVercelSignature } from '../../../utils/security';
import { updateDeploymentStatus, DeploymentStatus } from '../../../src/deployment/status-tracker';
import { getDeploymentByVercelId } from '../../../src/deployment/deploy-manager';
import { logger } from '../../../utils/logger';

export default async function handleVercelWebhook(req: Request, res: Response) {
  try {
    // אימות חתימת הבקשה מ-Vercel
    const signature = req.headers['x-vercel-signature'] as string;
    if (!verifyVercelSignature(req.body, signature)) {
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    const { type, payload } = req.body;

    // מיפוי סטטוס Vercel לסטטוס מערכת
    let status: DeploymentStatus;
    switch (type) {
      case 'deployment-created':
        status = DeploymentStatus.IN_PROGRESS;
        break;
      case 'deployment-succeeded':
        status = DeploymentStatus.COMPLETE;
        break;
      case 'deployment-error':
        status = DeploymentStatus.FAILED;
        break;
      default:
        // התעלם מאירועים לא רלוונטיים
        return res.status(200).json({ success: true });
    }

    // קבל את פרטי הפריסה לפי מזהה Vercel
    const deployment = await getDeploymentByVercelId(payload.deploymentId);
    if (!deployment) {
      logger.warn(`Received webhook for unknown Vercel deployment: ${payload.deploymentId}`);
      return res.status(200).json({ success: true });
    }

    // עדכן את סטטוס הפריסה
    await updateDeploymentStatus({
      deploymentId: deployment.id,
      websiteId: deployment.websiteId,
      userId: deployment.userId,
      status,
      url: payload.url,
      error: payload.error?.message,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Error processing Vercel webhook:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
```

## 5. גישה למשאבים מאובטחים

### 5.1 גישה לקבצים באחסון

**תיאור**: גישה לקבצים מאובטחים דרך שירות תיווך.

**נקודת קצה**: `GET /api/storage/access/:fileId`

**פונקציית שירות לגישה לקבצים**:

```typescript
// src/services/storage/access.ts
interface FileAccessResult {
  url: string;
  contentType: string;
  filename: string;
  expiresAt: number;
  error?: string;
}

export async function getSecureFileUrl(fileId: string): Promise<FileAccessResult> {
  try {
    // בקשה לשירות אחסון דרך Services
    const response = await fetch(`${process.env.SERVICES_API_URL}/storage/access/${fileId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.SERVICES_API_KEY}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get file access: ${error.message}`);
    }

    return await response.json();
  } catch (error) {
    logger.error('Error getting secure file URL:', error);
    return {
      url: '',
      contentType: '',
      filename: '',
      expiresAt: 0,
      error: 'Failed to access file',
    };
  }
}
```

## 6. התאמות נוספות

### 6.1 מדיניות Retry

**תיאור**: יישום מנגנון Retry לשרידות מול שירותי API חיצוניים.

```typescript
// utils/retry.ts
interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoff: 'linear' | 'exponential';
  shouldRetry?: (error: any) => boolean;
}

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  const { maxRetries, initialDelay, maxDelay, backoff, shouldRetry } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // בדוק אם צריך לנסות שוב
      if (shouldRetry && !shouldRetry(error)) {
        throw error;
      }

      if (attempt >= maxRetries) {
        break;
      }

      // חשב עיכוב
      let delay = initialDelay;
      if (backoff === 'exponential') {
        delay = initialDelay * Math.pow(2, attempt);
      } else {
        // linear
        delay = initialDelay * (attempt + 1);
      }

      delay = Math.min(delay, maxDelay);

      // המתן לפני הניסיון הבא
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
```

### 6.2 Circuit Breaker לשירותים חיצוניים

**תיאור**: יישום מנגנון Circuit Breaker למניעת קריאות סרק לשירותים לא זמינים.

```typescript
// utils/circuit-breaker.ts
enum CircuitState {
  CLOSED, // מצב רגיל, מאפשר קריאות
  OPEN, // מצב כשל, לא מאפשר קריאות
  HALF_OPEN, // מצב ביניים, מאפשר קריאת בדיקה
}

interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeout: number;
  fallback?: (error: any) => any;
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures = 0;
  private lastFailureTime = 0;
  private readonly options: CircuitBreakerOptions;

  constructor(options: CircuitBreakerOptions) {
    this.options = options;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      // בדוק אם הגיע הזמן לנסות שוב
      const now = Date.now();
      if (now - this.lastFailureTime >= this.options.resetTimeout) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        if (this.options.fallback) {
          return this.options.fallback(new Error('Circuit is OPEN'));
        }
        throw new Error('Circuit is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      if (this.options.fallback) {
        return this.options.fallback(error);
      }
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = CircuitState.CLOSED;
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.state === CircuitState.HALF_OPEN || this.failures >= this.options.failureThreshold) {
      this.state = CircuitState.OPEN;
    }
  }
}
```

## 7. בדיקות אינטגרציה

### 7.1 בדיקת אינטגרציה עם UI

**תיאור**: בדיקת אינטגרציה מלאה עם צוות ה-UI.

**בדיקת תהליך ניתוח ותצוגה מקדימה**:

```typescript
// tests/integration/ui-integration.test.ts
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import app from '../../app';
import { createMockAuthToken } from '../utils/auth-helpers';

describe('UI Integration', () => {
  describe('Resume Parsing', () => {
    it('should parse PDF resume and return structured data', async () => {
      const pdfPath = path.join(__dirname, '../fixtures/resumes/sample.pdf');
      const response = await request(app)
        .post('/api/parse')
        .attach('file', pdfPath)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.confidence).toBeDefined();
    });
  });
});
```

## Revision History

| Date       | Author            | Summary                                                                                                  |
| ---------- | ----------------- | -------------------------------------------------------------------------------------------------------- |
| 2024-06-09 | Builder Team Lead | Added documentation header and performed full content review for completeness, quality, and consistency. |
