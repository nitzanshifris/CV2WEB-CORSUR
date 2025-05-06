<!--
CV2WEB13 UI Team – Integration Points
Purpose: Documents all API and integration points between the UI team and other teams (Builder, Services), including formats, endpoints, and code samples.
Owner: UI Team Lead
Last Updated: 2024-06-09
Update Process: Update this file when integration points, API contracts, or formats change. All changes must be approved by the UI Team Lead. Reference related docs: project_overview.md, directory_structure.md, task_list.md, shared/integration-decision-tree.md
-->

# CV2WEB13 (UI Team): נקודות אינטגרציה

מסמך זה מגדיר את כל נקודות האינטגרציה בין צוות ה-UI לבין צוותי Builder ו-Services, כולל פורמטי בקשה/תגובה ודוגמאות קוד.

## 1. אינטגרציה עם צוות Builder (CV2WEB-CURSOR)

### 1.1 שליחת קורות חיים לניתוח

**נקודת קצה**: `POST /api/parse`

**תיאור**: שליחת קובץ קורות חיים לניתוח וקבלת נתונים מובנים.

**בקשה**:

```typescript
// FormData הכוללת:
{
  file: File, // קובץ קורות חיים (PDF, DOCX, PNG, JPEG, HTML)
  options?: {
    format: "auto" | "pdf" | "docx" | "image" | "html" // אופציונלי
  }
}
```

**תגובה**:

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

**דוגמת קוד**:

```typescript
// lib/api/resume.ts
export async function parseResume(file: File): Promise<ParseResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/parse', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to parse resume');
    }

    return await response.json();
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
}
```

### 1.2 בקשת תצוגה מקדימה של אתר

**נקודת קצה**: `POST /api/preview`

**תיאור**: שליחת נתוני קורות חיים ובחירת תבנית לקבלת HTML ו-CSS לתצוגה מקדימה.

**בקשה**:

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

**תגובה**:

```typescript
{
  success: boolean,
  html: string,   // קוד HTML לתצוגה מקדימה
  css: string,    // קוד CSS לתצוגה מקדימה
  metadata?: {    // מטא-נתונים נוספים
    templateId: string,
    generatedAt: string,
    // שדות נוספים
  }
}
```

**דוגמת קוד**:

```typescript
// lib/api/preview.ts
export async function generatePreview(
  resumeData: ResumeData,
  templateId: string,
  customization?: CustomizationOptions
): Promise<PreviewResult> {
  try {
    const response = await fetch('/api/preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeData,
        templateId,
        customization,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate preview');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating preview:', error);
    throw error;
  }
}
```

### 1.3 בקשת פריסת אתר

**נקודת קצה**: `POST /api/deploy`

**תיאור**: לאחר תשלום מוצלח, בקשה לפריסת אתר לדומיין.

**בקשה**:

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

**תגובה**:

```typescript
{
  success: boolean,
  deploymentId: string,  // מזהה פריסה
  url: string,           // כתובת URL של האתר
  status: "queued" | "in_progress" | "complete" | "failed"
}
```

**דוגמת קוד**:

```typescript
// lib/api/deploy.ts
export async function deployWebsite(
  websiteId: string,
  userId: string,
  template: { html: string; css: string },
  domain: string | null,
  metadata: WebsiteMetadata
): Promise<DeploymentResult> {
  try {
    const response = await fetch('/api/deploy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await getToken()}`, // פונקציית עזר לקבלת טוקן
      },
      body: JSON.stringify({
        websiteId,
        userId,
        template,
        domain,
        metadata,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to deploy website');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deploying website:', error);
    throw error;
  }
}
```

## 2. אינטגרציה עם צוות Services (CV2WEBMAIN)

### 2.1 אימות משתמש

**נקודת קצה**: `/api/auth/*`

**תיאור**: ניהול אימות משתמשים באמצעות Supabase.

#### 2.1.1 רישום משתמש

**נקודת קצה**: `POST /api/auth/register`

**בקשה**:

```typescript
{
  email: string,       // אימייל
  password: string,    // סיסמה
  fullName?: string    // שם מלא (אופציונלי)
}
```

**תגובה**:

```typescript
{
  success: boolean,
  data: {
    user: {
      id: string,
      email: string,
      // פרטי משתמש נוספים
    },
    session: {
      // פרטי session
    }
  }
}
```

#### 2.1.2 התחברות משתמש

**נקודת קצה**: `POST /api/auth/login`

**בקשה**:

```typescript
{
  email: string,      // אימייל
  password: string    // סיסמה
}
```

**תגובה**:

```typescript
{
  success: boolean,
  data: {
    user: {
      id: string,
      email: string,
      // פרטי משתמש נוספים
    },
    session: {
      // פרטי session
    }
  }
}
```

**דוגמת קוד**:

```typescript
// lib/supabase/auth.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
}
```

### 2.2 עיבוד תשלומים

**נקודת קצה**: `POST /api/payments/create-checkout`

**תיאור**: יצירת session Stripe לתשלום.

**בקשה**:

```typescript
{
  websiteId: string,           // מזהה האתר
  includeDomain: boolean,      // האם כולל דומיין
  domainName?: string,         // שם דומיין (אם כלול)
  additionalOptions?: {        // אפשרויות נוספות
    addons: string[],          // תוספות
    // אפשרויות נוספות
  }
}
```

**תגובה**:

```typescript
{
  success: boolean,
  data: {
    checkoutUrl: string,      // URL לדף התשלום של Stripe
    sessionId: string         // מזהה Session של Stripe
  }
}
```

**דוגמת קוד**:

```typescript
// lib/api/payments.ts
export async function createCheckoutSession(
  websiteId: string,
  includeDomain: boolean,
  domainName?: string,
  additionalOptions?: any
): Promise<CheckoutResult> {
  try {
    const response = await fetch('/api/payments/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await getToken()}`, // פונקציית עזר לקבלת טוקן
      },
      body: JSON.stringify({
        websiteId,
        includeDomain,
        domainName,
        additionalOptions,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create checkout session');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}
```

### 2.3 בדיקת זמינות דומיין

**נקודת קצה**: `GET /api/domains/check`

**תיאור**: בדיקת זמינות דומיין והצעת חלופות.

**פרמטרי שאילתה**:

```
domain: string    // שם הדומיין לבדיקה
```

**תגובה**:

```typescript
{
  success: boolean,
  data: {
    domain: string,      // הדומיין שנבדק
    available: boolean,  // האם זמין
    suggestions: string[], // הצעות חלופיות (אם לא זמין)
    price: number        // מחיר (בסנטים)
  }
}
```

**דוגמת קוד**:

```typescript
// lib/api/domains.ts
export async function checkDomainAvailability(domain: string): Promise<DomainCheckResult> {
  try {
    const response = await fetch(`/api/domains/check?domain=${encodeURIComponent(domain)}`, {
      headers: {
        Authorization: `Bearer ${await getToken()}`, // פונקציית עזר לקבלת טוקן
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to check domain availability');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking domain availability:', error);
    throw error;
  }
}
```

### 2.4 ניהול קבצים

**נקודת קצה**: `POST /api/storage/upload`

**תיאור**: העלאת קבצים לאחסון.

**בקשה**:

```typescript
// FormData הכוללת:
{
  file: File,            // הקובץ להעלאה
  path?: string,         // נתיב יעד (אופציונלי)
  contentType?: string,  // סוג תוכן (אופציונלי)
}
```

**תגובה**:

```typescript
{
  success: boolean,
  data: {
    path: string,      // נתיב מלא לקובץ
    url: string,       // URL לגישה לקובץ
    fileId: string,    // מזהה קובץ
    size: number       // גודל בבתים
  }
}
```

**דוגמת קוד**:

```typescript
// lib/api/storage.ts
export async function uploadFile(
  file: File,
  path?: string,
  contentType?: string
): Promise<UploadResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    if (path) {
      formData.append('path', path);
    }

    if (contentType) {
      formData.append('contentType', contentType);
    }

    const response = await fetch('/api/storage/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${await getToken()}`, // פונקציית עזר לקבלת טוקן
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to upload file');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}
```

## 3. פורמט שגיאות אחיד

כל שגיאה מה-API מוחזרת בפורמט אחיד:

```typescript
{
  success: false,
  error: {
    code: string,        // קוד שגיאה (e.g., "PARSE_INVALID_FORMAT")
    message: string,     // הודעת שגיאה ידידותית למשתמש
    details?: any        // פרטי שגיאה נוספים (אופציונלי)
  },
  meta?: {
    requestId?: string   // מזהה בקשה לצורך דיבוג
  }
}
```

**דוגמת טיפול בשגיאות**:

```typescript
// components/ui/ErrorDisplay.tsx
interface ErrorDisplayProps {
  code: string;
  message: string;
  details?: any;
  onClose: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  code,
  message,
  details,
  onClose,
  action,
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">שגיאה: {code}</h3>
          <div className="mt-1 text-sm text-red-700">
            <p>{message}</p>
            {details && (
              <pre className="mt-2 text-xs bg-red-100 p-2 rounded">
                {JSON.stringify(details, null, 2)}
              </pre>
            )}
          </div>
          <div className="mt-4 flex">
            {action && (
              <button
                type="button"
                className="mr-4 text-sm text-red-600 hover:text-red-500 font-medium"
                onClick={action.onClick}
              >
                {action.label}
              </button>
            )}
            <button
              type="button"
              className="text-sm text-gray-600 hover:text-gray-500"
              onClick={onClose}
            >
              סגור
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## 4. התראות וסטטוס בזמן אמת

### 4.1 Webhooks לסטטוס פריסה

**נקודת קצה**: `POST /api/webhooks/deployment`

UI יכול להאזין לאירועי הפריסה מה-Server באמצעות server-sent events או אלטרנטיבה אחרת.

**דוגמת קוד**:

```typescript
// hooks/use-deployment-status.ts
import { useState, useEffect } from 'react';

export function useDeploymentStatus(deploymentId: string) {
  const [status, setStatus] = useState<string>('pending');
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!deploymentId) return;

    const eventSource = new EventSource(`/api/deployments/${deploymentId}/status`);

    eventSource.onmessage = event => {
      const data = JSON.parse(event.data);
      setStatus(data.status);
      setProgress(data.progress || 0);

      if (data.status === 'complete') {
        setUrl(data.url);
        eventSource.close();
      } else if (data.status === 'failed') {
        setError(data.error || 'Unknown error');
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      console.error('EventSource failed');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [deploymentId]);

  return { status, progress, error, url };
}
```

## 5. התאמות נוספות

### 5.1 נדרשות התאמות לכל קריאת API

- הוספת אימות (Authorization header) לכל בקשה
- טיפול בכשלי אימות ופקיעת סשן
- ניסיונות מחדש לבקשות במקרה של שגיאות זמניות
- טיפול בשגיאות תקשורת ורשת

### 5.2 אסטרטגיית State Management

- שימוש ב-React Context לנתונים גלובליים (משתמש, תהליך יצירת אתר)
- שמירת נתוני קורות חיים במצב מקומי
- שימוש ב-localStorage לשמירת טיוטות ומידע זמני
- שמירת מצב התקדמות בין צעדים

## 6. בדיקות אינטגרציה

### 6.1 בדיקות ידניות

יש לבצע בדיקות ידניות עבור כל תסריט אינטגרציה:

1. העלאת קורות חיים → ניתוח → תצוגה מקדימה
2. רישום/התחברות → ניהול פרופיל
3. בחירת תבנית → התאמה אישית → תצוגה מקדימה
4. תהליך תשלום מלא → פריסת אתר
5. חיפוש דומיין → הוספה להזמנה → פריסה עם דומיין

### 6.2 בדיקות אוטומטיות

יצירת בדיקות אינטגרציה אוטומטיות:

```typescript
// tests/integration/resume-upload-flow.test.ts
import { test, expect } from '@playwright/test';

test('Resume upload and preview flow', async ({ page }) => {
  // 1. נווט לדף ההעלאה
  await page.goto('/upload');

  // 2. העלה קובץ קורות חיים
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('./tests/fixtures/sample-resume.pdf');

  // 3. בדוק את תהליך הניתוח והטעינה
  await expect(page.locator('.upload-progress')).toBeVisible();

  // 4. המתן להשלמת הניתוח
  await expect(page.locator('.preview-container')).toBeVisible({ timeout: 10000 });

  // 5. בדוק שהתצוגה המקדימה מציגה את הנתונים הנכונים
  await expect(page.locator('h1:has-text("Sample Name")')).toBeVisible();

  // 6. בדוק שניתן לבחור תבנית
  await page.locator('button.template-option').first().click();

  // 7. בדוק שניתן להתאים צבעים
  await page.locator('.color-picker-toggle').click();
  await page.locator('.color-option').nth(2).click();

  // 8. ודא שהשינויים משתקפים בתצוגה מקדימה
  // בדיקות נוספות...
});
```

### 6.3 מוקאפים (Mocks) לפיתוח

במהלך הפיתוח, יש ליצור מוקאפים מקומיים לשירותי ניתוח ופריסה:

```typescript
// mocks/handlers.ts
import { rest } from 'msw';
import sampleResumeData from './fixtures/sample-resume-data.json';
import samplePreviewHTML from './fixtures/sample-preview-html.json';

export const handlers = [
  // Mock לניתוח קורות חיים
  rest.post('/api/parse', (req, res, ctx) => {
    return res(
      ctx.delay(1500), // סימולציית עיכוב עיבוד
      ctx.status(200),
      ctx.json({
        success: true,
        data: sampleResumeData,
        confidence: {
          overall: 0.92,
          fields: {
            fullName: 0.98,
            title: 0.95,
            // ...
          },
        },
      })
    );
  }),

  // Mock לתצוגה מקדימה
  rest.post('/api/preview', (req, res, ctx) => {
    return res(
      ctx.delay(800),
      ctx.status(200),
      ctx.json({
        success: true,
        html: samplePreviewHTML.html,
        css: samplePreviewHTML.css,
      })
    );
  }),

  // יתר המוקאפים...
];
```
