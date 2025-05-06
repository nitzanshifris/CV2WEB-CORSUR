<!--
CV2WEB13 UI Team – Directory Structure
Purpose: Documents the folder and file structure, naming conventions, and developer notes for the UI project.
Owner: UI Team Lead
Last Updated: 2024-06-09
Update Process: Update this file when the directory structure or naming conventions change. All changes must be approved by the UI Team Lead. Reference related docs: project_overview.md, integration_points.md, task_list.md
-->

# CV2WEB13: מבנה ספריות לצוות UI

## מבנה ספריות עיקרי

```
/
├── .notes/                    # תיעוד פרויקט
├── app/                       # Next.js App Router routes
├── components/                # רכיבי UI לשימוש חוזר
├── lib/                       # פונקציות שירות וספריות
├── hooks/                     # React hooks מותאמים אישית
├── styles/                    # סגנונות גלובליים
├── public/                    # נכסים סטטיים
├── .env.example               # דוגמה למשתני סביבה
├── .cursorrules               # כללי הפעלה ל-CURSOR
├── .cursorignore              # הגדרות התעלמות ל-CURSOR
├── next.config.js             # תצורת Next.js
├── tailwind.config.js         # תצורת Tailwind CSS
├── tsconfig.json              # תצורת TypeScript
└── package.json               # תלויות פרויקט
```

## פירוט מבנה הספריות

### `/app` - נתיבי App Router של Next.js

```
/app
├── auth/                      # דפי אימות
│   ├── login/                 # דף התחברות
│   ├── register/              # דף הרשמה
│   ├── reset-password/        # דף איפוס סיסמה
│   └── callback/              # נתיב callback לאימות חברתי
├── dashboard/                 # לוח מחוונים משתמש
│   ├── page.tsx               # דף ראשי של לוח המחוונים
│   ├── sites/                 # ניהול אתרים
│   ├── account/               # ניהול חשבון
│   └── revisions/             # ניהול בקשות תיקון
├── editor/                    # עורך אתר
│   ├── templates/             # בחירת תבנית
│   └── customization/         # התאמה אישית של אתר
├── preview/                   # תצוגה מקדימה של אתר
│   └── [id]/                  # תצוגה מקדימה ספציפית לאתר
├── checkout/                  # תהליך תשלום
│   ├── page.tsx               # דף תשלום ראשי
│   ├── success/               # דף הצלחת תשלום
│   └── cancel/                # דף ביטול תשלום
├── interview/                 # ראיון AI
│   └── page.tsx               # ממשק ראיון AI
├── upload/                    # העלאת קורות חיים
│   └── page.tsx               # ממשק העלאת קובץ
├── layout.tsx                 # פריסה ראשית
├── page.tsx                   # דף הבית
├── globals.css                # סגנונות גלובליים
└── favicon.ico                # אייקון אתר
```

### `/components` - רכיבי UI לשימוש חוזר

```
/components
├── ui/                        # רכיבי shadcn/ui
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ...
├── forms/                     # רכיבי טפסים
│   ├── auth/                  # טפסי אימות
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── reset-password-form.tsx
│   ├── upload/                # טפסי העלאה
│   │   ├── file-uploader.tsx
│   │   └── file-preview.tsx
│   └── payment/               # טפסי תשלום
│       ├── checkout-form.tsx
│       └── domain-form.tsx
├── layout/                    # רכיבי פריסה
│   ├── header/                # רכיבי כותרת
│   │   ├── main-nav.tsx
│   │   ├── user-nav.tsx
│   │   └── logo.tsx
│   ├── footer/                # רכיבי כותרת תחתונה
│   │   └── footer.tsx
│   └── sidebar/               # רכיבי סרגל צדדי
│       └── dashboard-sidebar.tsx
├── previewer/                 # רכיבי תצוגה מקדימה
│   ├── preview-frame.tsx      # iframe תצוגה מקדימה
│   ├── responsive-controls.tsx # בקרי תצוגה רספונסיביים
│   ├── template-switcher.tsx  # מחליף תבניות
│   └── color-picker.tsx       # בורר צבעים
├── chat/                      # רכיבי ראיון AI
│   ├── chat-interface.tsx     # ממשק צ'אט
│   ├── message-bubble.tsx     # בועת הודעה
│   └── question-prompt.tsx    # הנחיית שאלה
└── marketing/                 # רכיבי שיווק
    ├── before-after.tsx       # השוואת לפני/אחרי
    ├── testimonials.tsx       # המלצות
    ├── pricing-card.tsx       # כרטיס תמחור
    └── feature-showcase.tsx   # תצוגת פיצ'רים
```

### `/lib` - פונקציות שירות וספריות

```
/lib
├── supabase/                  # קליינט Supabase ועוזרים
│   ├── client.ts              # קליינט Supabase
│   ├── auth.ts                # פונקציות עזר לאימות
│   └── database.ts            # פונקציות עזר למסד נתונים
├── api/                       # פונקציות לקוח API
│   ├── resume.ts              # API לניתוח קורות חיים
│   ├── preview.ts             # API לתצוגה מקדימה
│   ├── deploy.ts              # API לפריסה
│   └── domains.ts             # API לדומיינים
├── utils/                     # פונקציות עזר
│   ├── format.ts              # פורמטי נתונים
│   ├── validation.ts          # אימות נתונים
│   ├── colors.ts              # ניהול צבעים
│   └── error.ts               # טיפול בשגיאות
└── constants/                 # קבועים
    ├── routes.ts              # קבועי נתיב
    ├── plans.ts               # פרטי תכניות
    └── templates.ts           # נתוני תבניות
```

### `/hooks` - React hooks מותאמים אישית

```
/hooks
├── use-auth.ts                # ניהול אימות
├── use-file-upload.ts         # לוגיקת העלאת קבצים
├── use-preview.ts             # ניהול תצוגה מקדימה
├── use-checkout.ts            # לוגיקת תשלום
├── use-chat.ts                # ניהול ראיון AI
└── use-form.ts                # ניהול טפסים
```

### `/styles` - סגנונות גלובליים

```
/styles
├── globals.css                # סגנונות CSS גלובליים
└── theme.ts                   # הגדרות ערכת נושא
```

### `/public` - נכסים סטטיים

```
/public
├── images/                    # תמונות
│   ├── logo.svg               # לוגו
│   ├── templates/             # תמונות תבניות
│   ├── icons/                 # אייקונים
│   └── backgrounds/           # תמונות רקע
├── fonts/                     # גופנים
└── favicon.ico                # אייקון אתר
```

### `/.notes` - תיעוד פרויקט

```
/.notes
├── project_overview.md        # סקירת פרויקט
├── task_list.md               # רשימת משימות
├── directory_structure.md     # מבנה ספריות
├── integration_points.md      # נקודות אינטגרציה
└── meeting_notes.md           # הערות פגישה
```

## מוסכמות שיום

- **קבצים ותיקיות**: kebab-case (כגון `file-uploader.tsx`)
- **רכיבי React**: PascalCase (כגון `FileUploader`)
- **פונקציות ומשתנים**: camelCase (כגון `uploadFile`)
- **קבועים**: UPPER_SNAKE_CASE (כגון `MAX_FILE_SIZE`)
- **טיפוסי TypeScript**: PascalCase (כגון `FileUploaderProps`)
- **Hooks**: camelCase עם קידומת use (כגון `useFileUpload`)

## התלויות העיקריות

- **Next.js 15**: מסגרת React
- **React 19**: ספריית UI
- **TypeScript**: שפה מוקלדת סטטית
- **Tailwind CSS**: מסגרת CSS utility-first
- **shadcn/ui**: רכיבי UI
- **Framer Motion**: אנימציות
- **Supabase JS Client**: גישה למסד נתונים ואימות
- **React Hook Form**: ניהול טפסים
- **Zod**: סכמת אימות
- **date-fns**: פונקציות תאריך
- **SWR**: אחזור נתונים

## הערות למפתח

- השתמש באפשרות ה-**App Router** של Next.js
- יישם **Server Components** כברירת מחדל
- השתמש ב-**Client Components** רק לאינטראקטיביות
- אמץ גישת **mobile-first** עם Tailwind
- שמור על נגישות עם תקן **WCAG AA**
- ודא **keyboard accessibility** לכל האינטראקציות
- תמוך ב-**prefers-reduced-motion** לאנימציות
- שמור על רכיבים קטנים (<100 שורות)
- השתמש ב-**SWR** לשמירה במטמון ובקשות חוזרות
