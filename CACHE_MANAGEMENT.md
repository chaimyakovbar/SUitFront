# Cache Management Guide

## הבעיה
כאשר מעלים גרסה חדשה של האתר, המשתמשים עלולים לראות את הגרסה הישנה בגלל cache של הדפדפן או Service Worker.

## הפתרון שיושם

### 1. Service Worker עם Cache Busting אוטומטי
- Service Worker מתעדכן אוטומטית עם timestamp חדש בכל build
- JavaScript ו-HTML files נטענים תמיד מהרשת (no-cache)
- תמונות נשמרות ב-cache אבל עם אסטרטגיית network-first

### 2. Vite Build עם Cache Busting
- כל קובץ מקבל timestamp ו-hash ייחודי
- Manifest file נוצר עם מידע על הקבצים החדשים

### 3. Vercel Headers
- JavaScript files: no-cache, no-store, must-revalidate
- HTML files: no-cache, no-store, must-revalidate
- תמונות: cache ארוך טווח עם immutable

## איך להשתמש

### Build רגיל
```bash
npm run build
```

### Build עם עדכון cache מובטח
```bash
npm run build:prod
```

### עדכון cache בלבד
```bash
npm run update-cache
```

## מה קורה בכל build

1. **עדכון Service Worker**: הסקריפט מעדכן את `CACHE_VERSION` עם timestamp חדש
2. **Build עם Vite**: יוצר קבצים עם timestamp ו-hash ייחודיים
3. **Deploy**: הקבצים החדשים נטענים עם headers נכונים

## בדיקה שהפתרון עובד

1. **פתח Developer Tools** (F12)
2. **לך ל-Application tab > Service Workers**
3. **בדוק שהגרסה החדשה נטענת**
4. **לך ל-Application tab > Storage > Clear storage**
5. **רענן את הדף**

## פתרון בעיות

### אם עדיין רואים גרסה ישנה:

1. **נקה cache ידנית**:
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Option+E

2. **בדוק Service Worker**:
   - Developer Tools > Application > Service Workers
   - לחץ "Unregister" על ה-Service Worker הישן
   - רענן את הדף

3. **בדוק Network tab**:
   - Developer Tools > Network
   - רענן עם Ctrl+F5 (hard refresh)
   - בדוק שהקבצים נטענים עם timestamp חדש

### אם יש בעיות עם CloudFront:

1. **Invalidate CloudFront cache**:
   ```bash
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
   ```

2. **בדוק CloudFront headers**:
   - בדוק שהקבצים נטענים עם headers נכונים
   - וודא שאין cache headers ישנים

## הערות חשובות

- **Service Worker מתעדכן אוטומטית** בכל build
- **JavaScript files תמיד נטענים מהרשת** (no-cache)
- **תמונות נשמרות ב-cache** אבל עם אסטרטגיית network-first
- **HTML files נטענים מהרשת** כדי לוודא שהגרסה החדשה נטענת

## בדיקות מומלצות

לפני deploy, בדוק:
- [ ] Service Worker מתעדכן עם timestamp חדש
- [ ] JavaScript files נטענים עם no-cache headers
- [ ] HTML files נטענים מהרשת
- [ ] תמונות נטענות נכון
- [ ] אין שגיאות ב-console
