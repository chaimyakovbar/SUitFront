# מערכת התאמת מכנסי חליפה

## סקירה כללית

מערכת זו מאפשרת התאמה אישית של מכנסי חליפה באמצעות שילוב של תמונות שונות. המערכת בנויה על React עם Jotai לניהול state ו-Material-UI לממשק המשתמש.

## מבנה הקבצים

### קומפוננטות עיקריות:

- `ImageCollectorForPants.jsx` - מציג את המכנסיים המותאמים אישית
- `PantsControls.jsx` - ממשק שליטה להתאמות
- `PantsDemo.jsx` - דף דוגמה שמציג את כל המערכת
- `TextInsideModal.jsx` - מודל להוספת טקסט פנימי

### ניהול State:

- `Utils.js` - מכיל את האטומים לניהול state של המכנסיים

## מבנה התמונות

התמונות מאורגנות בתיקיות הבאות:

### מכנסיים (`public/assets/pants/`):

```
pants/
├── AllPants/           # תמונות בסיס של המכנסיים
│   └── greyLight.png
├── lines/              # פסים על המכנסיים
│   ├── OneLinesInTheTop/    # פס אחד בחלק העליון
│   │   └── greyLight.png
│   └── twoLinesInTheTop/    # שני פסים בחלק העליון
│       └── pleats_double.png
├── HoleAndButton/      # חור וכפתור
│   ├── Regular/             # רגיל
│   │   └── greyLight.png
│   ├── behindLeftSide/      # מאחורי הצד השמאלי
│   │   └── greyLight.png
│   ├── behindRegular/       # מאחורי רגיל
│   │   └── greyLight.png
│   └── LeftSide/            # הצד השמאלי
│       └── greyLight.png
└── Hem/                # מכפלת
    └── greyLight.png
```

### כפתורי שרוולים (`public/assets/ragach/sleevseButton/`):

```
sleevseButton/
├── tree/               # 3 כפתורי שרוולים
│   └── greyLight.png
├── four/               # 4 כפתורי שרוולים
│   └── greyLight.png
└── five/               # 5 כפתורי שרוולים
    └── greyLight.png
```

### טקסט פנימי (`public/assets/adds/`):

```
adds/
└── TextInside.png      # תמונת בסיס לטקסט פנימי
```

## שימוש במערכת

### 1. הצגת המכנסיים:

```jsx
import ImageCollectorForPants from "./components/ImageCollectorForPants";

function MyComponent() {
  return <ImageCollectorForPants />;
}
```

### 2. הוספת שליטה:

```jsx
import PantsControls from "./components/PantsControls";

function MyComponent() {
  return <PantsControls />;
}
```
```

## אפשרויות התאמה

### צבעים זמינים:

- `greyLight` - אפור בהיר
- `blackGrey` - שחור אפור
- `navy` - כחול כהה
- `brown` - חום

### תכונות נוספות:

- **פסים על המכנסיים** - בחירה בין ללא פסים, פס אחד, או שני פסים
- **חור וכפתור** - בחירה בין 4 אפשרויות: רגיל, מאחורי הצד השמאלי, מאחורי רגיל, הצד השמאלי
- **מכפלת** - בחירה בין ללא מכפלת או עם מכפלת
- **כפתורי שרוולים** - בחירה בין ללא כפתורים, 3, 4, או 5 כפתורי שרוולים
- **טקסט פנימי** - הוספת טקסט מותאם אישית על תמונת TextInside עם:
  - בחירת גופן (Arial, Times New Roman, Helvetica, Georgia, Verdana, Courier New, Impact, Comic Sans MS)
  - בחירת צבע (לבן, שחור, אדום, ירוק, כחול, צהוב, מגנטה, ציאן, כתום, סגול)
  - שמירה ב-database

## ניהול State

המערכת משתמשת ב-Jotai לניהול state. האטומים העיקריים:

```javascript
// צבע המכנסיים (ריק = צבע החליפה הנוכחי)
selectedPantsColorAtom;

// פסים על המכנסיים (none = ללא פסים)
selectedPantsLinesAtom;

// חור וכפתור (Regular = ברירת מחדל)
selectedPantsHoleButtonAtom;

// מכפלת (none = ללא מכפלת)
selectedPantsHemAtom;

// כפתורי שרוולים (none = ללא כפתורים)
selectedSleeveButtonsAtom;

// טקסט פנימי
textInsideTextAtom;

// גופן טקסט פנימי
textInsideFontAtom;

// צבע טקסט פנימי
textInsideColorAtom;

// הצגת מודל טקסט פנימי
showTextInsideAtom;
```

## הוספת תמונות חדשות

כדי להוסיף תמונות חדשות:

1. הוסף את התמונה לתיקייה המתאימה ב-`public/assets/`
2. עדכן את האטומים ב-`Utils.js` אם נדרש
3. עדכן את הקומפוננטות הרלוונטיות

## דוגמה לשימוש מתקדם

```jsx
import { useAtom } from "jotai";
import { selectedPantsColorAtom, selectedSleeveButtonsAtom } from "../Utils";

function CustomPantsSelector() {
  const [pantsColor, setPantsColor] = useAtom(selectedPantsColorAtom);
  const [sleeveButtons, setSleeveButtons] = useAtom(selectedSleeveButtonsAtom);

  const changeColor = (color) => {
    setPantsColor(color);
  };

  const changeSleeveButtons = (type) => {
    setSleeveButtons(type);
  };

  return (
    <div>
      <button onClick={() => changeColor("greyLight")}>אפור בהיר</button>
      <button onClick={() => changeColor("navy")}>כחול כהה</button>
      <button onClick={() => changeSleeveButtons("four")}>
        4 כפתורי שרוולים
      </button>
    </div>
  );
}
```

## הערות חשובות

- כל התמונות חייבות להיות בפורמט PNG
- שמות הקבצים חייבים להתאים לערכים באטומים
- המערכת תומכת בתצוגה רספונסיבית למובייל
- יש טיפול בשגיאות טעינת תמונות עם הודעות אזהרה בקונסול
- כפתורי השרוולים משתמשים בתמונות מתיקיית `ragach/sleevseButton`
- טקסט פנימי מוצג על תמונת TextInside עם אפשרות להזנת טקסט חופשי
