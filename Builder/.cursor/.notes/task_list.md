<!--
CV2WEB-CURSOR Builder Team – Task List
Purpose: Tracks all Builder team tasks, priorities, technical debt, PR templates, and conventions for the CV2Web project.
Owner: Builder Team Lead
Last Updated: 2024-06-09
Update Process: Update this file when tasks, priorities, or conventions change. All changes must be approved by the Builder Team Lead. Reference related docs: project_overview.md, directory_structure.md, integration_points.md, shared/final-qa-checklist.md
-->

# CV2WEB-CURSOR (Builder Team) - Task List

## High Priority

- [ ] יישום פונקציות חילוץ חסרות

  - [ ] `extractFullName` - זיהוי שם מלא
  - [ ] `extractTitle` - זיהוי תפקיד מקצועי
  - [ ] `extractContact` - ניתוח אימייל, טלפון, מיקום
  - [ ] `extractSummary` - חילוץ סיכום מקצועי
  - [ ] `extractSkills` - זיהוי מיומנויות
  - [ ] `extractExperience` - ניתוח ניסיון עבודה עם תאריכים
  - [ ] `extractEducation` - חילוץ רקע חינוכי

- [ ] יצירת מנוע תבניות מבוסס Worker

  - [ ] הגדרת מערכת תבניות Handlebars
  - [ ] יצירת תבניות ספציפיות למקצוע
  - [ ] יישום מנגנון התאמה אישית
  - [ ] אופטימיזציית ביצועים

- [ ] בניית יוצר תצוגה מקדימה HTML

  - [ ] יצירת רנדור HTML נקי
  - [ ] יישום אינטגרציה עם מנוע תבניות
  - [ ] יצירת CSS דינמי
  - [ ] אופטימיזציה למהירות וביצועים

- [ ] יישום אינטגרציית פריסה Vercel
  - [ ] הגדרת לקוח Vercel API
  - [ ] יצירת לוגיקת פריסה
  - [ ] יישום ניטור סטטוס
  - [ ] טיפול בשגיאות פריסה

## Medium Priority

- [ ] הוספת בדיקת זמינות דומיין

  - [ ] אינטגרציה עם ספק דומיינים
  - [ ] יישום API לבדיקת זמינות
  - [ ] טיפול בשגיאות ומקרי קצה

- [ ] יצירת אלגוריתם להצעת דומיינים חלופיים

  - [ ] יישום לוגיקת הצעות חכמה
  - [ ] התממשקות עם API זמינות דומיין
  - [ ] מדרוג הצעות לפי רלוונטיות

- [ ] יישום הזרקת מטא-נתוני SEO

  - [ ] יצירת מטא-תגים דינמיים
  - [ ] אופטימיזציה למנועי חיפוש
  - [ ] אינטגרציה עם נתוני קורות חיים

- [ ] בניית וריאציות תבנית רספונסיביות
  - [ ] התאמה למובייל
  - [ ] התאמה לטאבלט
  - [ ] התאמה לדסקטופ
  - [ ] בדיקות קומפטיביליות

## Low Priority

- [ ] יישום מטמון תבניות לביצועים

  - [ ] מנגנון שמירה במטמון
  - [ ] אסטרטגיית פינוי מטמון
  - [ ] מטריקות ביצועים

- [ ] הוספת אינטגרציית אנליטיקה

  - [ ] הזרקת קוד מעקב
  - [ ] אנונימיזציה של נתונים
  - [ ] אינטגרציה עם פלטפורמות אנליטיקה

- [ ] יצירת דפי 404 מותאמים אישית

  - [ ] תבנית לדפי שגיאה
  - [ ] אינטגרציה עם מיתוג
  - [ ] הוספת פעולות הבאות

- [ ] הוספת יצירת favicon
  - [ ] ייצור אוטומטי מראשי תיבות
  - [ ] אופציות התאמה אישית
  - [ ] תמיכה בגדלים שונים

## Completed

- [x] אינטגרציית ניתוח PDF
- [x] אינטגרציית ניתוח DOCX
- [x] מבנה תבנית בסיסי
- [x] הגדרת מבנה פרויקט
- [x] יישום ממשק API בסיסי

## Technical Debt

- [ ] שיפור דיוק חילוץ בפורמטים מורכבים
- [ ] אופטימיזציית ביצועי ניתוח
- [ ] טיפול במקרי קצה של קורות חיים
- [ ] אבטחת תהליך פריסה
- [ ] בדיקות עומס למנוע תבניות

## API Endpoints

### Resume Parsing API

```
POST /api/parse
- Request: FormData with file
- Response: JSON with parsed resume data & confidence scores
```

### Template Preview API

```
POST /api/preview
- Request: resumeData, templateId, customization
- Response: HTML & CSS for preview
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

## Integration Points

### Builder ← UI

- קבלת קבצי קורות חיים לניתוח (`/api/parse`)
- קבלת בחירת תבנית והתאמות (`/api/preview`)
- קבלת בקשות פריסה (`/api/deploy`)

### Builder → UI

- שליחת נתוני קורות חיים מנותחים (תשובה ל-`/api/parse`)
- שליחת HTML מקדים (תשובה ל-`/api/preview`)
- עדכוני סטטוס פריסה (webhooks)

### Builder ← Services

- קבלת אסימוני אימות (header)
- קבלת פרטי תשלום (webhook)
- קבלת פרטי רישום דומיין (API)

### Builder → Services

- שליחת מטא-נתוני אתר לאחסון (API)
- עדכוני סטטוס פריסה (webhook)
- בקשות הגדרת דומיין (API)

## Pull Request Template

```
## תיאור
[תיאור קצר של השינויים]

## סוג השינוי
- [ ] תיקון באג
- [ ] פיצ'ר חדש
- [ ] שיפור ביצועים
- [ ] טיפול במקרי קצה

## מה נבדק?
- [ ] בדיקות יחידה
- [ ] בדיקות אינטגרציה
- [ ] בדיקות ביצועים
- [ ] בדיקות עם מקרי קצה אמיתיים

## נקודות אינטגרציה
[האם השינוי משפיע על אינטגרציה עם צוותים אחרים?]
```

## Commit Convention

```
[builder-component] תיאור קצר של השינוי

הסבר מפורט יותר של השינוי, אם נדרש
```
