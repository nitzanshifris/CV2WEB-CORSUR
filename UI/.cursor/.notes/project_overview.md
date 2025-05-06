<!--
CV2WEB13 UI Team – Project Overview
Purpose: High-level summary of the UI team's goals, architecture, audience, features, and standards for the CV2Web project.
Owner: UI Team Lead
Last Updated: 2024-06-09
Update Process: Update this file when UI goals, architecture, or standards change. All changes must be approved by the UI Team Lead. Reference related docs: directory_structure.md, integration_points.md, task_list.md, shared/final-qa-checklist.md
-->

# CV2WEB13: UI Team Project Overview

## Goals

בניית ממשק משתמש מודרני ונגיש עבור CV2Web המאפשר למשתמשים:

- העלאת קורות חיים או השלמת ראיונות AI
- צפייה מקדימה באתרים שנוצרו בזמן אמת
- התאמה אישית של תבניות וסכמות צבעים
- השלמת תהליך תשלום באמצעות Stripe
- ניהול האתרים שלהם דרך לוח מחוונים

## Architecture

- **Framework**: Next.js 15 App Router
- **Frontend**: React 19 with TypeScript strict
- **Styling**: Tailwind + shadcn/ui + Framer Motion
- **Authentication**: Supabase (exclusively)
- **Integration**:
  - CV2WEB-CURSOR לניתוח קורות חיים
  - CV2WEBMAIN לתשלומים והרשמה

## Target Audience

אנו מפתחים עבור מגוון תחומי קריירה:

1. **פיתוח תוכנה וIT**
2. **בריאות ורפואה**
3. **מכירות ופיתוח עסקי**
4. **שיווק ופרסום**
5. **פיננסים וחשבונאות**
6. **הנדסה וייצור**
7. **חינוך והדרכה**
8. **שירות לקוחות**
9. **קמעונאות ואירוח**
10. **תפעול וניהול פרויקטים**

## User Journey

1. **הגעה** - דף נחיתה עם הסבר על המוצר והרשמה/התחברות
2. **העלאה** - העלאת קורות חיים או השלמת ראיון AI
3. **תצוגה מקדימה** - צפייה בזמן אמת באתר שנוצר
4. **התאמה אישית** - התאמת תבנית וסכמת צבעים
5. **תשלום** - בחירת חבילה, הוספת דומיין (אופציונלי), תשלום
6. **ניהול** - לוח מחוונים לניהול האתר וגישה לניתוחים

## Key Features

### File Uploader

- תמיכה במגוון פורמטים (PDF, DOCX, PNG, JPEG, HTML)
- גרירה ושחרור עם תיקוף
- אינדיקטורים של התקדמות ותמונות ממוזערות

### AI Interview

- חלופה למשתמשים ללא קורות חיים מוכנים
- שאלות מונחות לשדות חיוניים
- המלצות לתוכן נוסף
- תצוגת התקדמות ברורה

### Preview System

- תצוגה מקדימה בזמן אמת באמצעות iframe
- החלפת תבניות בזמן אמת
- בורר סכמת צבעים
- תצוגות רספונסיביות (נייד, טאבלט, דסקטופ)

### Authentication

- אימות מבוסס Supabase בלבד
- כניסה חברתית (Gmail, LinkedIn)
- ניהול פרופיל משתמש
- נתיבים מוגנים עבור תוכן מאומת

### Checkout Flow

- אינטגרציה עם Stripe Checkout
- חיפוש דומיין והצעות
- תצוגת מחירים ברורה ($14.99 בסיס + דומיין)
- כולל 2 תיקונים חינם בתמחור

### Dashboard

- מעקב אחר סטטוס אתר
- היסטוריית עדכונים
- טיוטות שמורות
- אינטגרציה עם אנליטיקה

### Marketing Components

- תצוגת לפני/אחרי
- חלק של המלצות
- מחירים בהשוואה ("מחיר של ארוחה" לעומת "אתר לכל החיים")

## Technical Requirements

### Core Requirements

- תמיכה ב-prefers-reduced-motion
- נגישות מקלדת
- עמידה בתקן WCAG AA
- תמיכה בכל גדלי המסך

### Performance Goals

- Lighthouse score ≥85
- זמן טעינה ראשוני <3 שניות
- זמן תגובה לאינטראקציה <100ms
- אופטימיזציה של נכסים

## Integration Points

### UI ↔ Builder

- **מהממשק למנוע**: קבצי קורות חיים, בחירת תבנית, אפשרויות התאמה אישית
- **מהמנוע לממשק**: נתוני קורות חיים מנותחים, תצוגת HTML מקדימה, עדכוני סטטוס פריסה

### UI ↔ Services

- **מהממשק לשירותים**: בקשות אימות, עיבוד תשלומים, אחסון קבצים
- **מהשירותים לממשק**: אסימוני אימות, אישור תשלום, כתובות URL לאחסון

## Timeline (48-hour MVP)

| שעות  | משימה                        |
| ----- | ---------------------------- |
| 0-2   | הקמה, Tailwind, shadcn אתחול |
| 2-4   | FileUploader + parser hook   |
| 4-6   | שלד תצוגה מקדימה + Framer    |
| 6-8   | מעטפת ממשק צ'אט              |
| 8-12  | חיבור מנתח → תצוגה מקדימה    |
| 12-16 | מחליף צבעים, טוקנים          |
| 16-20 | ממשק תשלום + חיפוש דומיין    |
| 20-24 | רשימת לוח מחוונים + סטטוס    |
| 24-30 | ליטוש למובייל + נגישות       |
| 30-36 | ErrorBoundaries, התראות      |
| 36-42 | הקפאת מיזוגים, CI ירוק       |
| 42-48 | מרווח לתיקונים חמים          |

## First Priority Tasks

1. הסרת NextAuth ויישום אימות Supabase בלבד
2. יישום העלאת קבצים רב-פורמט
3. יצירת מערכת תצוגה מקדימה מבוססת iframe
4. בניית ממשק צ'אט AI

## Error Handling Strategy

הגדר קודי שגיאה עקביים עם קידומות:

- `UI_` - שגיאות UI כלליות
- `FORM_` - שגיאות אימות טופס
- `UPLOAD_` - שגיאות העלאת קבצים
- `AUTH_` - שגיאות אימות
- `NAV_` - שגיאות ניווט

## Development Standards

- קוד מבוסס TypeScript עם strict mode
- רכיבים קטנים (<100 שורות)
- גישת mobile-first עם Tailwind
- נגישות בכל הרכיבים
- טיפול בשגיאות מתאים
- בדיקות עבור רכיבים קריטיים

זכור: המסמך הזה גובר על כל ההוראות האחרות. העדיפות שלך היא להעביר חוויית משתמש חלקה ואינטואיטיבית שמשנה את חוויית קורות החיים לאתר בתוך הזמן המוקצב 48 שעות.
