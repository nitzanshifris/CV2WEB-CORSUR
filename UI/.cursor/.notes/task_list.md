<!--
CV2WEB13 UI Team – Task List
Purpose: Tracks all UI team tasks, priorities, technical debt, PR templates, and conventions for the CV2Web project.
Owner: UI Team Lead
Last Updated: 2024-06-09
Update Process: Update this file when tasks, priorities, or conventions change. All changes must be approved by the UI Team Lead. Reference related docs: project_overview.md, directory_structure.md, integration_points.md, shared/final-qa-checklist.md
-->

# CV2WEB13 (UI Team) - Task List

## High Priority

- [ ] הסרת NextAuth ויישום אימות Supabase בלבד

  - [ ] הגדרת קליינט Supabase
  - [ ] יצירת דפי התחברות והרשמה
  - [ ] יישום התחברות חברתית (Gmail, LinkedIn)
  - [ ] יצירת נתיבים מוגנים

- [ ] יישום העלאת קבצים רב-פורמט

  - [ ] יצירת רכיב FileUploader תומך drag-and-drop
  - [ ] יישום אימות פורמט קובץ
  - [ ] הוספת מחוונים לקידום והודעות שגיאה
  - [ ] יישום תצוגה ממוזערת של קבצים שהועלו
  - [ ] אינטגרציה עם שירות ניתוח של צוות Builder

- [ ] יצירת מערכת תצוגה מקדימה מבוססת iframe

  - [ ] יישום תצוגת iframe מאובטחת
  - [ ] יצירת בוררי תצוגה רספונסיבית
  - [ ] אינטגרציה עם API תצוגה מקדימה של צוות Builder
  - [ ] הוספת עדכונים חלקים בזמן אמת

- [ ] יישום ממשק צ'אט ראיון AI
  - [ ] עיצוב ויישום ממשק צ'אט
  - [ ] יצירת תהליך שאלות מובנה
  - [ ] הוספת מחוון התקדמות
  - [ ] שמירת תוצאות ראיון ויצירת קורות חיים וירטואליים

## Medium Priority

- [ ] בניית ממשק תשלום עם אינטגרציה ל-Stripe

  - [ ] יישום הצגת מידע מוצר
  - [ ] יצירת טופס תשלום
  - [ ] אינטגרציה עם API תשלומים של צוות Services
  - [ ] יישום דף אישור והודעות שגיאה

- [ ] יישום פונקציונליות חיפוש דומיין

  - [ ] יצירת ממשק חיפוש דומיין
  - [ ] אינטגרציה עם API דומיינים של צוות Services
  - [ ] הצגת הצעות דומיין חלופיות
  - [ ] הוספת דומיין להזמנה

- [ ] יצירת לוח מחוונים לניהול אתר

  - [ ] עיצוב ויישום של תצוגת רשימת אתרים
  - [ ] יצירת עמוד פרטי אתר
  - [ ] יישום קישורים לעריכה ותצוגה מקדימה
  - [ ] הוספת מחווני סטטוס פריסה

- [ ] בניית תצוגת לפני/אחרי להשוואה
  - [ ] יצירת רכיב השוואה חזותי
  - [ ] יישום תצוגת גלילה ומעבר
  - [ ] אינטגרציה עם תצוגה מקדימה של אתר

## Low Priority

- [ ] הוספת אינטגרציית אנליטיקה

  - [ ] יישום מעקב אירועים
  - [ ] יצירת לוח מחוונים אנליטיקה בסיסי
  - [ ] מעקב אחר המרות וביצועים

- [ ] יישום אפשרויות ייצוא

  - [ ] יצירת אפשרויות ייצוא עבור קוד אתר
  - [ ] הוספת אפשרויות שמירה וחלוקה
  - [ ] יישום ייצוא PDF

- [ ] יצירת רכיבי שיווק

  - [ ] רכיב "לפני/אחרי"
  - [ ] תצוגת מחירים השוואתית
  - [ ] מקרי בוחן ודוגמאות קריירה
  - [ ] מקטע המלצות

- [ ] הוספת מקטע המלצות
  - [ ] עיצוב ויישום מקטע המלצות
  - [ ] יצירת ממשק ניהול המלצות
  - [ ] הוספת עיצוב רספונסיבי

## Completed

- [x] הגדרת פרויקט עם Next.js
- [x] אינטגרציה של רכיבי shadcn/ui
- [x] הגדרת Tailwind CSS
- [x] יצירת מבנה פרויקט בסיסי

## Technical Debt

- [ ] שיפור ביצועי העלאת קבצים גדולים
- [ ] אופטימיזציית זמני תגובה ב-iframe
- [ ] הרחבת בדיקות נגישות
- [ ] יצירת בדיקות יחידה מקיפות
- [ ] ניתוח ביצועים מלא

## Integration Points

### UI → Builder

- העלאת קבצי קורות חיים (API: `/api/parse`)
- בקשת תצוגה מקדימה של HTML (API: `/api/preview`)
- התאמה אישית של תבנית (API: `/api/preview`)
- פריסת אתרים לאחר תשלום (API: `/api/deploy`)

### UI → Services

- בקשות אימות משתמש (API: `/api/auth`)
- עיבוד תשלומים דרך Stripe (API: `/api/payments`)
- אחסון קבצים (API: `/api/storage`)
- חיפוש ורישום דומיין (API: `/api/domains`)

## Pull Request Template

```
## תיאור
[תיאור קצר של השינויים]

## סוג השינוי
- [ ] תיקון באג
- [ ] פיצ'ר חדש
- [ ] שינויי ביצועים
- [ ] שיפור קוד

## איך זה נבדק?
[תיאור כיצד השינויים נבדקו]

## צילומי מסך (אם רלוונטי)
[צילומי מסך או הקלטת מסך]

## נקודות אינטגרציה
[האם השינוי משפיע על אינטגרציה עם צוותים אחרים?]
```

## Commit Convention

```
[ui-component] תיאור קצר של השינוי

הסבר מפורט יותר של השינוי, אם נדרש
```

## Daily Priorities

### Day 1 (0-24h)

- הגדרת הפרויקט והרכיבים הבסיסיים
- הסרת NextAuth ויישום אימות Supabase
- יישום העלאת קבצים רב-פורמט
- יצירת מערכת תצוגה מקדימה בסיסית

### Day 2 (24-48h)

- השלמת ממשק צ'אט AI
- בניית ממשק תשלום
- יישום לוח מחוונים בסיסי
- ליטוש UI/UX וטיפול בבאגים

## Start Here

1. התחל בהסרת NextAuth ויישום אימות Supabase
2. עבור ליישום רכיב העלאת קבצים רב-פורמט
3. עבוד על אינטגרציה עם API ניתוח של צוות Builder
4. יישם את מערכת התצוגה המקדימה באמצעות iframe

## Testing Checklist

- [ ] בדיקות יחידה לרכיבים קריטיים
- [ ] בדיקות אינטגרציה עם APIs
- [ ] בדיקות נגישות לעמידה בתקן WCAG AA
- [ ] בדיקות קומפטיביליות דפדפן
- [ ] בדיקות רספונסיביות לכל גדלי המסך
