<!--
CV2WEB-CURSOR Builder Team – Project Overview
Purpose: High-level summary of the Builder team's goals, architecture, features, and standards for the CV2Web project.
Owner: Builder Team Lead
Last Updated: 2024-06-09
Update Process: Update this file when Builder goals, architecture, or standards change. All changes must be approved by the Builder Team Lead. Reference related docs: directory_structure.md, integration_points.md, task_list.md, shared/final-qa-checklist.md
-->

# CV2WEB-CURSOR: Builder Team Project Overview

## Goals

בניית מנוע עוצמתי המסוגל:

- לנתח פורמטים שונים של קורות חיים (PDF, DOCX, PNG, JPEG, HTML וכו')
- לחלץ נתונים מובנים בדיוק גבוה
- לייצר אתרים רספונסיביים ומקצועיים
- לפרוס אתרים ל-Vercel
- לנהל דומיינים ו-DNS

## Architecture

- **Backend**: Node.js 20 LTS
- **Processing**: Web Workers למשימות עתירות CPU
- **Templating**: Handlebars
- **Deployment**: Vercel API
- **Architecture**: ארכיטקטורת Stateless לסקלביליות

## Parser Components

- **PDF Parser**: pdf-parse עם pdf.js כגיבוי
- **DOCX Parser**: mammoth עם office-parser כגיבוי
- **Image OCR**: Tesseract.js עם עיבוד מקדים
- **HTML Parser**: Cheerio עם jsdom כגיבוי
- **Extraction ML**: סיוע AI לחילוץ נתונים קשים לזיהוי

## Template System

- **תבניות מבוססי מקצוע**:
  - **Creative**: מעצבים, אמנים, כותבים
  - **Technical**: מפתחים, מהנדסים, מדעני נתונים
  - **Corporate**: מנהלים, עסקים, מכירות
  - **Academic**: חוקרים, מרצים, סטודנטים
- **התאמה אישית**:
  - סכמות צבעים מותאמות אישית
  - אפשרויות פריסה
  - טיפוגרפיה
  - סגנונות אנימציה

## Key Features

### Resume Parser

- ניתוח רב-פורמט של קורות חיים
- חילוץ מבנה נתונים מושלם
- התמודדות עם מקרי קצה ופורמטים לא סטנדרטיים
- זיהוי חכם של מידע חסר
- ציוני ביטחון לשדות שחולצו

### Template Engine

- מנוע מבוסס Handlebars
- ייצוג חזותי לפי סוג הקריירה
- תמיכה בהתאמה אישית מלאה
- רנדור בזמן אמת

### Preview Generator

- יצירת HTML/CSS לתצוגה מקדימה
- אופטימיזציה לביצועים מהירים
- תמיכה בתצוגות תגובתיות
- ייצוא קוד נקי ומאורגן

### Deployment Engine

- אינטגרציה עם Vercel API
- בניית תצורה אוטומטית
- אופטימיזציה לבנייה
- תמיכה ב-rollback

### Domain Management

- בדיקת זמינות דומיין
- הצעות לדומיינים חלופיים
- הגדרת DNS אוטומטית
- אינטגרציה עם ספקי דומיינים

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

## Edge Case Handling

- **קורות חיים רב-עמודיים**: ניתוח עמודים ברצף, מיזוג עם היוריסטיקה מבוססת מיקום
- **טבלאות ורשתות**: המרה לנתונים מובנים לפני חילוץ
- **קורות חיים עתירי גרפיקה**: יישום OCR ממוקד על אלמנטים של טקסט מוטמע
- **פורמטים לא סטנדרטיים**: החלת ציוני ביטחון לשדות שחולצו
- **שדות קריטיים חסרים**: יצירת ממלאי מקום עם התראת משתמש
- **סגנון לא עקבי**: נורמליזציה של פורמט לפני חילוץ
- **קורות חיים רב-לשוניים**: זיהוי אזורי שפה והחלת כללי חילוץ מתאימים

## API Endpoints

### Resume Parsing API

- `POST /api/parse` - ניתוח קובץ קורות חיים
- `GET /api/status/:jobId` - בדיקת סטטוס ניתוח

### Template Preview API

- `POST /api/preview` - יצירת תצוגה מקדימה של HTML
- `GET /api/templates` - קבלת רשימת תבניות זמינות
- `GET /api/templates/:id` - קבלת פרטי תבנית

### Deployment API

- `POST /api/deploy` - פריסת אתר
- `GET /api/deploy/:id` - בדיקת סטטוס פריסה
- `DELETE /api/deploy/:id` - ביטול פריסה

### Domain API

- `GET /api/domains/check` - בדיקת זמינות דומיין
- `GET /api/domains/suggest` - הצעות לדומיינים חלופיים
- `POST /api/domains/configure` - הגדרת דומיין

## Performance Requirements

- זמן ניתוח: <2 שניות למסמכים סטנדרטיים
- זמן רנדור תבנית: <1 שנייה
- זמן יצירת תצוגה מקדימה: <3 שניות
- זמן פריסה: <30 שניות

## Integration Points

### Builder ← UI

- קבלת קבצי קורות חיים לניתוח
- קבלת בחירת תבנית ואפשרויות התאמה אישית
- קבלת בקשות פריסה

### Builder → UI

- שליחת נתוני קורות חיים מנותחים
- תצוגה מקדימה של HTML
- עדכוני סטטוס פריסה

### Builder ← Services

- קבלת אסימוני אימות
- פרטי משתמש
- אישור תשלום
- פרטי רישום דומיין

### Builder → Services

- מטא-נתונים של אתר לאחסון
- עדכוני סטטוס פריסה
- בקשות הגדרת דומיין

## Timeline (48-hour MVP)

| שעות  | משימה                                  |
| ----- | -------------------------------------- |
| 0-2   | תיקון בעיית מסך ריק, הגדרת ייצוא       |
| 2-4   | POC של `resumeRenderer`                |
| 4-6   | חלקי `deploySite`, בדיקת אסימון Vercel |
| 6-8   | `domains.ts` חיפוש                     |
| 8-12  | טיוטת רנדור HTML סטטי                  |
| 12-16 | פרסום API `/api/deploy`                |
| 16-20 | זרימת חיבור דומיין                     |
| 20-24 | webhook סטטוס-בנייה                    |
| 24-30 | הזרקת מטא SEO                          |
| 30-36 | מזעור נכסים                            |
| 36-42 | הקפאת מיזוגים, CI ירוק                 |
| 42-48 | מרווח לתיקונים חמים                    |

## First Priority Tasks

1. תיקון בעיית המסך הריק בהגדרת הייצוא
2. יצירת POC של `resumeRenderer`
3. הגדרת חלקים ראשוניים של `deploySite`
4. יישום חיפוש דומיין ב-`domains.ts`
5. הגדרת יצירת HTML סטטי

## Error Handling Strategy

הגדר קודי שגיאה עקביים עם קידומות:

- `PARSE_` - שגיאות ניתוח
- `TMPL_` - שגיאות תבנית
- `RENDER_` - שגיאות רנדור
- `DEPLOY_` - שגיאות פריסה

## Development Standards

- יישום מנגנוני גיבוי
- אימות נתונים שחולצו
- טיפול הולם במקרי קצה
- תיעוד יסודי של כל הפונקציות
- בדיקות יסודיות למרכיבים קריטיים

זכור: המסמך הזה גובר על כל ההוראות האחרות. העדיפות שלך היא בניית מנוע אמין וביצועי שמעביר במדויק פורמטים מגוונים של קורות חיים לאתרים מקצועיים ויפים בתוך לוח הזמנים של 48 שעות.

## Revision History

| Date       | Author            | Summary                                                                                                  |
| ---------- | ----------------- | -------------------------------------------------------------------------------------------------------- |
| 2024-06-09 | Builder Team Lead | Added documentation header and performed full content review for completeness, quality, and consistency. |
