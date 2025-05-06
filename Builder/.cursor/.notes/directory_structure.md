<!--
CV2WEB-CURSOR Builder Team – Directory Structure
Purpose: Documents the folder and file structure, naming conventions, and developer notes for the Builder project.
Owner: Builder Team Lead
Last Updated: 2024-06-09
Update Process: Update this file when the directory structure or naming conventions change. All changes must be approved by the Builder Team Lead. Reference related docs: project_overview.md, integration_points.md, task_list.md
-->

# CV2WEB-CURSOR: מבנה ספריות לצוות Builder

## מבנה ספריות עיקרי

```
/
├── .notes/                    # תיעוד פרויקט
├── src/                       # קוד מקור
├── api/                       # נקודות קצה API
├── workers/                   # יישומי Web Worker
├── utils/                     # פונקציות עזר
├── tests/                     # מערכי בדיקה
├── .env.example               # דוגמה למשתני סביבה
├── .cursorrules               # כללי הפעלה ל-CURSOR
├── .cursorignore              # הגדרות התעלמות ל-CURSOR
├── tsconfig.json              # תצורת TypeScript
└── package.json               # תלויות פרויקט
```

## פירוט מבנה הספריות

### `/src` - קוד מקור

```
/src
├── parsers/                   # מודולי ניתוח קורות חיים
│   ├── index.ts               # נקודת כניסה וממשק מאוחד
│   ├── pdf/                   # מנתח PDF
│   │   ├── index.ts           # נקודת כניסה למנתח PDF
│   │   ├── pdf-parse.ts       # שימוש ב-pdf-parse
│   │   ├── pdf-js.ts          # גיבוי עם pdf.js
│   │   └── utils.ts           # פונקציות עזר
│   ├── docx/                  # מנתח DOCX
│   │   ├── index.ts           # נקודת כניסה למנתח DOCX
│   │   ├── mammoth.ts         # שימוש ב-mammoth
│   │   ├── office-parser.ts   # גיבוי עם office-parser
│   │   └── utils.ts           # פונקציות עזר
│   ├── image/                 # מנתח תמונה (OCR)
│   │   ├── index.ts           # נקודת כניסה למנתח תמונה
│   │   ├── tesseract.ts       # שימוש ב-Tesseract.js
│   │   ├── pre-processor.ts   # עיבוד מקדים לתמונות
│   │   └── utils.ts           # פונקציות עזר
│   ├── html/                  # מנתח HTML
│   │   ├── index.ts           # נקודת כניסה למנתח HTML
│   │   ├── cheerio.ts         # שימוש ב-cheerio
│   │   ├── jsdom.ts           # גיבוי עם jsdom
│   │   └── utils.ts           # פונקציות עזר
│   └── utils/                 # פונקציות עזר משותפות
│       ├── format-detection.ts # זיהוי פורמט
│       ├── error-handling.ts  # טיפול בשגיאות
│       └── validation.ts      # אימות נתונים
├── extractors/                # פונקציות חילוץ נתונים
│   ├── index.ts               # נקודת כניסה לחילוץ
│   ├── name/                  # חילוץ שם
│   │   ├── index.ts           # נקודת כניסה לחילוץ שם
│   │   ├── full-name.ts       # חילוץ שם מלא
│   │   └── utils.ts           # פונקציות עזר
│   ├── contact/               # חילוץ פרטי קשר
│   │   ├── index.ts           # נקודת כניסה לחילוץ פרטי קשר
│   │   ├── email.ts           # חילוץ אימייל
│   │   ├── phone.ts           # חילוץ טלפון
│   │   ├── location.ts        # חילוץ מיקום
│   │   └── utils.ts           # פונקציות עזר
│   ├── experience/            # חילוץ ניסיון
│   │   ├── index.ts           # נקודת כניסה לחילוץ ניסיון
│   │   ├── job-entries.ts     # חילוץ רשומות עבודה
│   │   ├── date-parser.ts     # ניתוח תאריכים
│   │   └── utils.ts           # פונקציות עזר
│   ├── education/             # חילוץ חינוך
│   │   ├── index.ts           # נקודת כניסה לחילוץ חינוך
│   │   ├── degree.ts          # חילוץ תארים
│   │   ├── institution.ts     # חילוץ מוסדות
│   │   └── utils.ts           # פונקציות עזר
│   └── skills/                # חילוץ מיומנויות
│       ├── index.ts           # נקודת כניסה לחילוץ מיומנויות
│       ├── technical-skills.ts # חילוץ מיומנויות טכניות
│       ├── soft-skills.ts     # חילוץ מיומנויות רכות
│       └── utils.ts           # פונקציות עזר
├── templates/                 # תבניות אתר
│   ├── index.ts               # ממשק תבניות
│   ├── engine.ts              # מנוע תבניות
│   ├── helpers.ts             # עוזרי Handlebars
│   ├── creative/              # תבניות למקצועות יצירתיים
│   │   ├── index.ts           # רשימת תבניות יצירתיות
│   │   ├── designer.ts        # תבנית מעצב
│   │   ├── artist.ts          # תבנית אמן
│   │   ├── writer.ts          # תבנית כותב
│   │   └── templates/         # תבניות Handlebars
│   ├── technical/             # תבניות למקצועות טכניים
│   │   ├── index.ts           # רשימת תבניות טכניות
│   │   ├── developer.ts       # תבנית מפתח
│   │   ├── engineer.ts        # תבנית מהנדס
│   │   ├── data-scientist.ts  # תבנית מדען נתונים
│   │   └── templates/         # תבניות Handlebars
│   ├── corporate/             # תבניות למקצועות תאגידיים
│   │   ├── index.ts           # רשימת תבניות תאגידיות
│   │   ├── executive.ts       # תבנית מנהל בכיר
│   │   ├── manager.ts         # תבנית מנהל
│   │   ├── business.ts        # תבנית איש עסקים
│   │   └── templates/         # תבניות Handlebars
│   └── academic/              # תבניות למקצועות אקדמיים
│       ├── index.ts           # רשימת תבניות אקדמיות
│       ├── researcher.ts      # תבנית חוקר
│       ├── professor.ts       # תבנית פרופסור
│       ├── student.ts         # תבנית סטודנט
│       └── templates/         # תבניות Handlebars
├── renderer/                  # מנוע רנדור HTML
│   ├── index.ts               # נקודת כניסה לרנדור
│   ├── html-renderer.ts       # רנדור HTML
│   ├── css-generator.ts       # יצירת CSS
│   ├── optimizers.ts          # אופטימיזציות קוד
│   └── utils.ts               # פונקציות עזר
├── deployment/                # פריסת Vercel
│   ├── index.ts               # נקודת כניסה לפריסה
│   ├── vercel-client.ts       # לקוח Vercel API
│   ├── deploy-manager.ts      # מנהל פריסות
│   ├── status-tracker.ts      # מעקב אחר סטטוס
│   └── utils.ts               # פונקציות עזר
└── domains/                   # ניהול דומיינים
    ├── index.ts               # נקודת כניסה לדומיינים
    ├── checker.ts             # בדיקת זמינות
    ├── suggester.ts           # מציע דומיינים חלופיים
    ├── configurator.ts        # הגדרת DNS
    └── utils.ts               # פונקציות עזר
```

### `/api` - נקודות קצה API

```
/api
├── index.ts                   # נקודת כניסה ראשית
├── parse/                     # נקודות קצה לניתוח קורות חיים
│   ├── index.ts               # נקודת כניסה לניתוח
│   ├── pdf.ts                 # ניתוח PDF
│   ├── docx.ts                # ניתוח DOCX
│   ├── image.ts               # ניתוח תמונה
│   ├── html.ts                # ניתוח HTML
│   └── status.ts              # בדיקת סטטוס
├── preview/                   # נקודות קצה לתצוגה מקדימה
│   ├── index.ts               # נקודת כניסה לתצוגה מקדימה
│   ├── generate.ts            # יצירת תצוגה מקדימה
│   ├── templates.ts           # רשימת תבניות
│   └── customize.ts           # התאמה אישית
├── deploy/                    # נקודות קצה לפריסה
│   ├── index.ts               # נקודת כניסה לפריסה
│   ├── create.ts              # יצירת פריסה
│   ├── status.ts              # בדיקת סטטוס
│   └── cancel.ts              # ביטול פריסה
└── domains/                   # נקודות קצה לדומיינים
    ├── index.ts               # נקודת כניסה לדומיינים
    ├── check.ts               # בדיקת זמינות
    ├── suggest.ts             # הצעות דומיין
    └── configure.ts           # הגדרת דומיין
```

### `/workers` - יישומי Web Worker

```
/workers
├── parser-worker.ts           # Worker לניתוח קורות חיים
├── template-worker.ts         # Worker למנוע תבניות
├── renderer-worker.ts         # Worker לרנדור
└── deploy-worker.ts           # Worker לפריסה
```

### `/utils` - פונקציות עזר

```
/utils
├── logger.ts                  # כלי רישום יומן
├── error.ts                   # טיפול בשגיאות
├── validation.ts              # שיטות אימות
├── async.ts                   # כלי עזר אסינכרוניים
├── file.ts                    # טיפול בקבצים
├── text-processing.ts         # עיבוד טקסט
├── regex.ts                   # ביטויים רגולריים נפוצים
└── security.ts                # פונקציות אבטחה
```

### `/tests` - מערכי בדיקה

```
/tests
├── parsers/                   # בדיקות למנתחים
│   ├── pdf.test.ts
│   ├── docx.test.ts
│   ├── image.test.ts
│   └── html.test.ts
├── extractors/                # בדיקות לחילוץ
│   ├── name.test.ts
│   ├── contact.test.ts
│   ├── experience.test.ts
│   └── education.test.ts
├── templates/                 # בדיקות לתבניות
│   ├── engine.test.ts
│   ├── creative.test.ts
│   └── technical.test.ts
├── renderer/                  # בדיקות לרנדור
│   └── html-renderer.test.ts
├── deployment/                # בדיקות לפריסה
│   └── vercel-client.test.ts
├── domains/                   # בדיקות לדומיינים
│   └── suggester.test.ts
├── api/                       # בדיקות ל-API
│   ├── parse.test.ts
│   └── preview.test.ts
├── fixtures/                  # נתוני בדיקה
│   ├── resumes/               # דוגמאות קורות חיים
│   │   ├── pdf/
│   │   ├── docx/
│   │   ├── image/
│   │   └── html/
│   └── expected/              # תוצאות צפויות
└── utils/                     # כלי עזר לבדיקות
    └── test-helpers.ts
```

### `/.notes` - תיעוד פרויקט

```
/.notes
├── project_overview.md        # סקירת פרויקט
├── task_list.md               # רשימת משימות
├── directory_structure.md     # מבנה ספריות
├── integration_points.md      # נקודות אינטגרציה
├── parser_schema.md           # סכמת מנתח
└── meeting_notes.md           # הערות פגישה
```

## Resume Data Structure

```typescript
interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
  }[];
  links: {
    type: string;
    url: string;
  }[];
}
```

## API Endpoints

### Resume Parsing API

```
POST /api/parse
- Request: FormData with file
- Response: JSON with parsed resume data and confidence scores
```

### Template Preview API

```
POST /api/preview
- Request: resumeData, templateId, customization
- Response: HTML and CSS for preview
```

### Deployment API

```
POST /api/deploy
- Request: websiteId, userId, template, domain, metadata
- Response: deploymentId, url, status
```

### Domain API

```
GET /api/domains/check
- Request: domainName
- Response: available, suggestions
```

## מוסכמות שיום

- **קבצים ותיקיות**: kebab-case (כגון `pdf-parser.ts`)
- **פונקציות**: camelCase (כגון `extractFullName`)
- **קלאסים**: PascalCase (כגון `PDFParser`)
- **ממשקים**: PascalCase עם 'I' כקידומת (כגון `IResumeData`)
- **טיפוסים**: PascalCase (כגון `ResumeParserOptions`)
- **קבועים**: UPPER_SNAKE_CASE (כגון `MAX_FILE_SIZE`)

## התלויות העיקריות

- **Node.js 20**: פלטפורמת שרת
- **TypeScript**: שפה מוקלדת סטטית
- **pdf-parse**: ניתוח PDF עיקרי
- **pdf.js**: גיבוי לניתוח PDF
- **mammoth**: ניתוח DOCX
- **Tesseract.js**: OCR לתמונות
- **Cheerio**: ניתוח HTML
- **jsdom**: גיבוי לניתוח HTML
- **Handlebars**: מנוע תבניות
- **Web Workers**: עיבוד מקבילי
- **Vercel SDK**: אינטגרציית פריסה
- **Jest**: פריימוורק בדיקות
- **Express**: שרת API

## הערות למפתח

- משתמש ב-**Worker Threads** לניתוח תובעני של מעבד
- מיישם **מנגנוני גיבוי** לכל פורמט קורות חיים
- מחיל **ציוני ביטחון** על שדות שחולצו
- טיפול הולם ב**מקרי קצה**
- שומר על **מודולריות** לקלות תחזוקה
- מיישם בדיקות יסודיות
- משתמש ב-**Error Handling** שיטתי
- פעולות לא ייחוסמו את לולאת האירועים

## Revision History

| Date       | Author            | Summary                                                                                                  |
| ---------- | ----------------- | -------------------------------------------------------------------------------------------------------- |
| 2024-06-09 | Builder Team Lead | Added documentation header and performed full content review for completeness, quality, and consistency. |
