# 🎩 SuitFront – Project Summary / סיכום פרוייקט

> **Last updated:** April 2026  
> **Stack:** React 19 + Vite + Firebase + MUI + Jotai + Framer Motion

---

## 📋 תיאור כללי

**SuitFront** הוא אפליקציית ווב מתקדמת להזמנת חליפות בהתאמה אישית (bespoke suits).  
המשתמש יכול לבחור מבין מגוון חליפות מוכנות, או לעצב חליפה מותאמת אישית צעד אחר צעד.  
הפרוייקט פועל עם Backend נפרד (`SuitBack`) שרץ על Render.com.

**Production URL (Backend):** `https://suitback.onrender.com`  
**Assets (Images/Videos):** AWS S3 – `https://ch-suits.s3.us-east-1.amazonaws.com`

---

## 🏗️ ארכיטקטורה כללית

```
SuitFront (Vite + React 19)
│
├── Firebase Auth        → הזדהות משתמשים (Google OAuth)
├── Jotai (Global State) → ניהול מצב גלובלי
├── React Query          → ניהול Async data
├── Framer Motion        → אנימציות
├── MUI v6               → UI Components
├── React Router v7      → Routing
└── Axios                → HTTP Client → SuitBack API
```

---

## 📁 מבנה תיקיות

```
src/
├── App.jsx                  # נקודת כניסה – ניתוב ראשי
├── Utils.js                 # כל ה-Jotai atoms (state גלובלי)
├── firebase.js              # הגדרת Firebase Auth + Google Provider
├── main.jsx                 # React root + QueryClient
│
├── homePage/                # דף הבית + NavBar
│   ├── HomePage2.jsx        # דף הבית הראשי
│   ├── NavBar.jsx           # ניווט עליון (responsive, scroll-aware)
│   ├── AllCollection.jsx    # גלריית כל החליפות
│   ├── MostPoPular.jsx      # קטע "הפופולריים ביותר"
│   ├── Drawer2.jsx          # Drawer ניווט מובייל
│   └── OpenDrawer.jsx       # כפתור פתיחת drawer
│
├── pages/                   # דפים ראשיים
│   ├── Account.jsx          # אזור משתמש – הזמנות, מידות, הגדרות
│   ├── CheckoutModern.jsx   # תהליך צ'ק-אאוט מלא (PayPal + Stripe)
│   ├── LoginWithGoogle.jsx  # דף התחברות / הרשמה
│   ├── ResetPassword.jsx    # איפוס סיסמה
│   ├── AIQuickSize.jsx      # זיהוי מידות חכם עם AI
│   ├── Payed.jsx            # דף אישור תשלום
│   ├── PaymentSuccess.jsx   # הצגת פרטי הזמנה מוצלחת
│   ├── About.jsx            # דף אודות
│   ├── Contact.jsx          # צור קשר
│   ├── PolicySupport.jsx    # מדיניות ותמיכה
│   ├── Shopping.jsx         # עגלת קניות (גרסה ישנה)
│   ├── QuickFit.jsx         # Quick Fit ייחודי
│   └── AccessibilityMenu.jsx # תפריט נגישות
│
├── components/              # קומפוננטות משנה
│   ├── suit-customizer/     # מערכת עיצוב חליפה אישית
│   │   ├── SuitCustomizer.jsx      # מרכז – ניהול כל תהליך ה-customizer
│   │   ├── SuitPreview.jsx         # תצוגת חליפה
│   │   ├── SuitToggle.jsx          # מתג front/back
│   │   ├── CustomizationPanel.jsx  # פאנל צד שמאל עם אפשרויות
│   │   ├── CustomizerHeader.jsx    # כותרת + חזרה
│   │   ├── StepNavigator.jsx       # ניווט בין צעדים
│   │   ├── ActionButtons.jsx       # כפתורי פעולה (שמירה, הוספה לעגלה)
│   │   └── steps/
│   │       ├── SuitDesign.jsx      # צעד 1 – בחירת עיצוב
│   │       ├── FabricSelection.jsx # צעד 2 – בחירת בד
│   │       └── FinishingDetails.jsx # צעד 3 – פרטי גימור
│   │
│   ├── GetAllSuitFromData.jsx  # קומפוננטה ראשית להצגת כל החליפות
│   ├── TakeSize3.jsx           # מדידות גוף – אינטראקטיבי (3D mannequin)
│   ├── TakeSizes4.jsx          # מדידות לפי מידה רגילה (S/M/L...)
│   ├── TakeSizes5.jsx          # מדידות מהחליפה הקיימת
│   ├── PantsControls.jsx       # בחירת התאמות מכנסיים
│   ├── ImageCollector.jsx      # אוסף תמונות ג'קט לבחירה
│   ├── ImageCollectorForPants.jsx # אוסף תמונות מכנסיים
│   ├── Stepper.jsx             # Stepper תהליך הזמנה
│   ├── TextInsideModal.jsx     # הזנת טקסט אישי לתוך החליפה
│   ├── QuickFitMannequin.jsx   # מודל אדם עם נקודות מדידה
│   ├── OnlySizes.jsx           # הצגת מידות בלבד
│   ├── ShowSizes.jsx           # כרטיס מידות קיים
│   ├── OfflineIndicator.jsx    # אינדיקטור מצב offline
│   ├── S3ImageLoader.jsx       # טעינת תמונות מ-S3
│   ├── ImageLoader.jsx         # טעינה עם lazy loading
│   ├── ProtectedRoute.jsx      # הגנה על נתיבים פרטיים
│   ├── LanguageToggle.jsx      # כפתור החלפת שפה (HE/EN)
│   ├── RadialMenu.jsx          # תפריט רדיאלי
│   └── Payment/                # קומפוננטות תשלום
│
├── customSuite/             # עיצוב חליפה מותאם
│   └── leftSide/
│       ├── StepTree.jsx        # עץ צעדים לבחירת חליפה
│       └── stepTree/           # תת-צעדים
│
├── context/                 # React Context
│   ├── AuthContext.jsx      # Auth state + Firebase onAuthStateChanged
│   └── LanguageContext.jsx  # i18n – תמיכה בעברית ואנגלית
│
├── Hooks/                   # Custom Hooks
│   ├── useAuth.js           # ניהול הרשמה, כניסה, Google OAuth
│   └── useProduct.js        # שאילתות מוצרים
│
├── api/                     # API calls
│   ├── orders.js            # CRUD הזמנות
│   ├── suit.js              # API חליפות
│   ├── user.js              # API משתמשים
│   └── contact.js           # API יצירת קשר
│
├── config/                  # הגדרות ראשיות
│   ├── api.js               # Axios instance + כל userAPI functions
│   ├── suitPricing.js       # מחירי בסיס ותוספות
│   ├── suitOptions.js       # אופציות עיצוב (צווארונים, דשים, כיסים...)
│   └── mannequinPoints.js   # נקודות על הדמות לזיהוי מדידות
│
├── consts/
│   └── KindOfColors.jsx     # כל URLs של תמונות/וידאו מ-S3, מדידות, bodyPoints
│
├── sizes/
│   └── IndexSizes.jsx       # דף מדריך המידות (אינדקס כל שיטות המדידה)
│
├── utils/
│   ├── suitStateManager.js      # ניהול מצב חליפה (serialize/restore)
│   ├── measurementEstimator.js  # אומדן מידות (AI-assisted)
│   └── imageUtils.js            # כלי עיבוד תמונות
│
└── reactBits/               # קומפוננטות UI אנימטיביות / decorative
```

---

## 🔐 אימות וניהול משתמשים

| מנגנון | תיאור |
|--------|--------|
| **Firebase Auth** | Google OAuth login + Email/Password |
| **AuthContext** | מאזין ל-`onAuthStateChanged`, שומר user ב-Jotai atom |
| **auth-webhook** | בעת login, שולח לבאקאנד לרשום / לעדכן את המשתמש בDB |
| **Protected Routes** | `/Shopping`, `/account`, `/customSuit` – דורשים login |
| **Reset Password** | שליחת מייל איפוס דרך backend + Firebase |

---

## 🛒 תהליך קניה מלא

```
1. HomePage → בחירת חליפה (GetAllSuitFromData / MostPopular)
2. SuitCustomizer → עיצוב אישי (3 שלבים):
   - שלב 1: SuitDesign – בחירת צבע ג'קט, דש (lapel), צווארון
   - שלב 2: FabricSelection – בד, תוספות (כיס מטפחת, כפתורים)
   - שלב 3: FinishingDetails – פרטי גימור, טקסט פנימי, מכנסיים
3. מדידות:
   - /sizes/regular  → מידות סטנדרטיות (S/M/L/XL)
   - /sizes/measure  → מדידות גוף ידניות (TakeSize3 – 3D mannequin)
   - /sizes/suitMeasur → מדידות מחליפה קיימת
   - /sizes/ai       → AIQuickSize – AI חכם לאמידת מידות
4. שמירת חליפה בDB (PostSuit API)
5. Checkout (CheckoutModern):
   - סיכום הזמנה
   - תשלום PayPal / Stripe
6. Payed.jsx / PaymentSuccess.jsx → אישור
```

---

## 💰 מבנה מחירים

| רכיב | טווח מחיר |
|------|-----------|
| חליפה בסיסית (kind1) | $500 |
| חליפה פרמיום (kind2) | $550 |
| חליפה יוקרתית (kind3) | $600 |
| חליפה יוקרתית מותאמת (kind4) | $650 |
| דש Slim/Wide | +$50 / +$75 |
| צווארון מיוחד | +$200 |
| כיס מטפחת (poshet) | +$20 |
| כפתורי חורים | +$15 |
| צבע פנים | +$22 |
| כפתורים מיוחדים | +$33 |

---

## 🌍 תמיכה בשפות (i18n)

- **LanguageContext** – מכיל את כל הטקסטים בעברית ובאנגלית
- **LanguageToggle** – כפתור HE / EN בנאוובר
- כל טקסט מוצג דרך `const { t } = useLanguage()`
- RTL / LTR נתמכים

---

## ⚡ ביצועים ואופטימיזציה

| טכניקה | יישום |
|---------|-------|
| **Code Splitting** | כל דף (חוץ מ-Home + NavBar) טעון lazy עם `React.lazy` |
| **Image Format** | כל תמונות ב-`.webp` לטעינה מהירה |
| **S3 CDN** | כל assets מוגשים מ-AWS S3 (us-east-1) |
| **Service Worker** | cache busting אוטומטי בבנייה (scripts/update-service-worker.js) |
| **React Query** | caching ו-background refetch לנתוני API |
| **Offline Indicator** | זיהוי מצב offline + הודעה למשתמש |

---

## 📦 תלויות עיקריות

| חבילה | שימוש |
|-------|-------|
| `react@19` | ספרייה ראשית |
| `vite@6` | Build tool |
| `react-router-dom@7` | ניתוב |
| `@mui/material@6` | UI components |
| `framer-motion@12` | אנימציות |
| `jotai@2` | Global state |
| `@tanstack/react-query@5` | Server state |
| `firebase@11` | Authentication |
| `axios@1.8` | HTTP requests |
| `@paypal/react-paypal-js` | PayPal checkout |
| `@stripe/react-stripe-js` | Stripe checkout |
| `@react-three/fiber` + `three` | תצוגה 3D (mannequin) |
| `formik` + `yup` | טפסים + ולידציה |
| `notistack` | התראות (snackbars) |
| `react-responsive` | Media queries |
| `react-slick` | Carousel/Slider |

---

## 🗺️ מפת נתיבים (Routes)

| נתיב | קומפוננטה | הגנה |
|------|-----------|------|
| `/` | `HomePage2` | ציבורי |
| `/login` | `LoginWithGoogle` | ציבורי |
| `/reset-password` | `ResetPassword` | ציבורי |
| `/about` | `About` | ציבורי |
| `/contact` | `Contact` | ציבורי |
| `/indexSizes` | `IndexSizes` | ציבורי |
| `/PolicySupport` | `PolicySupport` | ציבורי |
| `/sizes/regular` | `TakeSizes4` | ציבורי |
| `/sizes/measure` | `TakeSizes3` | ציבורי |
| `/sizes/suitMeasur` | `TakeSizes5` | ציבורי |
| `/sizes/ai` | `AIQuickSize` | ציבורי |
| `/Payed` | `Payed` | ציבורי |
| `/account` | `Account` | 🔒 login נדרש |
| `/Shopping` | `CheckoutModern` | 🔒 login נדרש |
| `/customSuit` | `SuitCustomizer` | 🔒 login נדרש |

---

## 🗄️ ניהול State גלובלי (Jotai Atoms)

| Atom | תיאור |
|------|-------|
| `authUserAtom` | מידע משתמש מחובר |
| `authLoadingAtom` | מצב טעינת Auth |
| `currentIndexAtom` | אינדקס חליפה פעילה |
| `currentColorAtom` | צבע נוכחי של חליפה |
| `currentKindAtom` | סוג החליפה הנוכחי |
| `selectedCollarAtom` | סוג צווארון |
| `selectedLapelTypeAtom` | סוג דש |
| `selectedPacketTypeAtom` | סוג כיס |
| `selectedInsideTypeAtom` | צבע פנים |
| `selectedButtonAtom` | כפתורים |
| `selectedPoshetAtom` | כיס מטפחת |
| `selectedHolesButtonAtom` | חורי כפתורים (שרוול) |
| `allSuitPartAtom` | רשימת כל חלקי החליפה שנבחרו |
| `priceAllSuitAtom` | מחיר כולל |
| `selectedPantsColorAtom` | צבע מכנסיים |
| `selectedPantsLinesAtom` | קפלים במכנסיים |
| `selectedPantsKindAtom` | סוג מכנסיים |
| `textInsideTextAtom` | טקסט פנימי בחליפה |
| `showTextInsideAtom` | האם להציג modal טקסט פנימי |
| `selectedSleeveButtonsAtom` | כפתורי שרוול (3/4/5) |

---

## 🚀 פריסה (Deployment)

| שרות | שימוש |
|------|-------|
| **Vercel** | פרונט (CI/CD אוטומטי מ-Git) |
| **Render.com** | Backend – `SuitBack` |
| **AWS S3** | אחסון תמונות ווידאו |
| **Firebase** | Authentication |

**קבצי פריסה:**
- `vercel.json` – הגדרות SPA routing + headers
- `.vercelignore` – קבצים שלא מועלים ל-Vercel

---

## 📁 קבצי תיעוד קיימים בפרוייקט

| קובץ | תוכן |
|------|-------|
| `README.md` | הקדמה בסיסית |
| `PANTS_README.md` | תיעוד מערכת המכנסיים |
| `PAYPAL_INTEGRATION_README.md` | אינטגרציית PayPal |
| `SUIT_DATA_FLOW_VERIFICATION.md` | בדיקת זרם נתוני חליפה |
| `SUIT_QUICK_FIT_README.md` | מערכת QuickFit |
| `CACHE_MANAGEMENT.md` | ניהול Cache |
| `CLOUDFRONT_SETUP.md` | הגדרת CloudFront |
| `CODE_REVIEW_AND_IMPROVEMENTS.md` | סקירת קוד |
| `PERFORMANCE_FIXES.md` | תיקוני ביצועים |
| `סיכום_עבודה.md` | סיכום עבודה (Hebrew) |
| `סקירת_קוד_והמלצות_שיפור.md` | סקירה ב-עברית |

---

*נוצר אוטומטית על ידי Antigravity · 2026-04-28*
