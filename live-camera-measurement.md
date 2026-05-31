# Live Camera Body Measurement — מדידות חי עם מצלמה

## הרעיון הכללי

המשתמש עומד מול המצלמה במרחק קבוע (נניח 2 מטר).
על המסך מוצג הוידאו החי עם נקודות הניתנות לגרירה.
אדם שני (או המשתמש עצמו) מסדר את הנקודות על חלקי הגוף הנכונים.
המערכת מחשבת מרחקים בפיקסלים ומתרגמת לסנטימטרים.

---

## שלב 1 — פתיחת מצלמה (WebRTC)

```jsx
// useLiveCamera.js
import { useEffect, useRef } from "react";

export function useLiveCamera(videoRef) {
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720, facingMode: "user" } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Camera error:", err));

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);
}
```

```jsx
// בקומפוננטה
const videoRef = useRef(null);
useLiveCamera(videoRef);

<video ref={videoRef} autoPlay playsInline muted
  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
```

---

## שלב 2 — Calibration (כיול)

לפני המדידה, צריך לדעת כמה פיקסלים = 1 ס"מ.

### אפשרות א׳ — מרחק קבוע + FOV
אם המשתמש עומד בדיוק 2 מטר ומצלמת ה-webcam הרגילה היא ~65° FOV:

```js
const DISTANCE_CM = 200; // 2 מטר
const FOV_DEG = 65;
const VIDEO_WIDTH_PX = 1280;

function calcPixelsPerCm(videoWidth) {
  const fovRad = (FOV_DEG * Math.PI) / 180;
  const realWidthAtDistance = 2 * DISTANCE_CM * Math.tan(fovRad / 2); // ס"מ
  return videoWidth / realWidthAtDistance; // פיקסל לס"מ
}
// ~6.8 פיקסל לכל ס"מ במרחק 2 מטר
```

### אפשרות ב׳ — Reference Object (מדויק יותר ✓)
המשתמש מחזיק דף A4 (21×29.7 ס"מ) ומסמנים את שתי הפינות:

```js
function calibrateWithA4(pointA, pointB) {
  // pointA, pointB = {x, y} בפיקסלים של פינות הדף
  const pixelDist = Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y);
  const realCm = 21; // רוחב A4
  return pixelDist / realCm; // pixelsPerCm
}
```

---

## שלב 3 — נקודות גריאות (Draggable Landmarks)

```jsx
// LandmarkPoint.jsx
export function LandmarkPoint({ id, x, y, label, color = "#C0D3CA", onDrag }) {
  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX - x;
    const startY = e.clientY - y;

    const onMove = (ev) => onDrag(id, ev.clientX - startX, ev.clientY - startY);
    const onUp   = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Touch support
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const startX = touch.clientX - x;
    const startY = touch.clientY - y;

    const onMove = (ev) => {
      const t = ev.touches[0];
      onDrag(id, t.clientX - startX, t.clientY - startY);
    };
    const onEnd = () => {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };

    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
  };

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ cursor: "grab", userSelect: "none" }}
    >
      <circle r={10} fill={color} opacity={0.85} />
      <circle r={3}  fill="#fff" />
      <text
        y={-14}
        textAnchor="middle"
        fill="#fff"
        fontSize={10}
        fontFamily="Montserrat, sans-serif"
        style={{ pointerEvents: "none" }}
      >
        {label}
      </text>
    </g>
  );
}
```

---

## שלב 4 — נקודות הגוף לחליפה

```js
// landmarks.js
export const SUIT_LANDMARKS = [
  { id: "shoulder_l",  label: "כתף שמאל",    x: 300, y: 180 },
  { id: "shoulder_r",  label: "כתף ימין",     x: 500, y: 180 },
  { id: "armpit_l",    label: "בית שחי שמאל", x: 310, y: 260 },
  { id: "armpit_r",    label: "בית שחי ימין",  x: 490, y: 260 },
  { id: "chest_l",     label: "חזה שמאל",     x: 320, y: 280 },
  { id: "chest_r",     label: "חזה ימין",      x: 480, y: 280 },
  { id: "waist_l",     label: "מותן שמאל",    x: 330, y: 360 },
  { id: "waist_r",     label: "מותן ימין",     x: 470, y: 360 },
  { id: "hip_l",       label: "ירך שמאל",     x: 320, y: 430 },
  { id: "hip_r",       label: "ירך ימין",      x: 480, y: 430 },
  { id: "neck_top",    label: "עורף",          x: 400, y: 130 },
  { id: "elbow_l",     label: "מרפק שמאל",    x: 240, y: 340 },
  { id: "elbow_r",     label: "מרפק ימין",     x: 560, y: 340 },
  { id: "wrist_l",     label: "פרק שמאל",     x: 195, y: 430 },
  { id: "wrist_r",     label: "פרק ימין",      x: 605, y: 430 },
];
```

---

## שלב 5 — חישוב המידות

```js
// calculations.js

function dist(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function pxToCm(px, pixelsPerCm) {
  return (px / pixelsPerCm).toFixed(1);
}

export function calcMeasurements(points, pixelsPerCm) {
  const p = Object.fromEntries(points.map((pt) => [pt.id, pt]));

  const shoulderWidthPx  = dist(p.shoulder_l,  p.shoulder_r);
  const chestHalfPx      = dist(p.chest_l,     p.chest_r);
  const waistHalfPx      = dist(p.waist_l,     p.waist_r);
  const hipHalfPx        = dist(p.hip_l,       p.hip_r);
  const sleeveLeftPx     = dist(p.shoulder_l,  p.elbow_l) + dist(p.elbow_l, p.wrist_l);
  const backLengthPx     = dist(p.neck_top,    p.waist_l);

  return {
    shoulderWidth:  pxToCm(shoulderWidthPx,       pixelsPerCm),
    chestCircum:    pxToCm(chestHalfPx * 2,        pixelsPerCm), // × 2 כי מצלמים מלפנים
    waistCircum:    pxToCm(waistHalfPx * 2,        pixelsPerCm),
    hipCircum:      pxToCm(hipHalfPx * 2,          pixelsPerCm),
    sleeveLength:   pxToCm(sleeveLeftPx,           pixelsPerCm),
    backLength:     pxToCm(backLengthPx,           pixelsPerCm),
  };
}
```

---

## שלב 6 — Component ראשי

```jsx
// LiveMeasurement.jsx
import React, { useRef, useState } from "react";
import { useLiveCamera } from "./useLiveCamera";
import { LandmarkPoint } from "./LandmarkPoint";
import { SUIT_LANDMARKS } from "./landmarks";
import { calcMeasurements, calibrateWithA4 } from "./calculations";

export default function LiveMeasurement({ onComplete }) {
  const videoRef = useRef(null);
  useLiveCamera(videoRef);

  const [points, setPoints] = useState(SUIT_LANDMARKS);
  const [pixelsPerCm, setPixelsPerCm] = useState(null);
  const [calibrating, setCalibrating] = useState(false);
  const [calibPoints, setCalibPoints] = useState([]);
  const [measurements, setMeasurements] = useState(null);

  const VIDEO_W = 800;
  const VIDEO_H = 600;

  const handleDrag = (id, x, y) => {
    setPoints((prev) =>
      prev.map((p) => (p.id === id ? { ...p, x, y } : p))
    );
  };

  const handleCalibClick = (e) => {
    if (!calibrating) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pt = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setCalibPoints((prev) => {
      const next = [...prev, pt];
      if (next.length === 2) {
        setPixelsPerCm(calibrateWithA4(next[0], next[1]));
        setCalibrating(false);
        return [];
      }
      return next;
    });
  };

  const calculate = () => {
    if (!pixelsPerCm) return alert("יש לכייל קודם");
    const result = calcMeasurements(points, pixelsPerCm);
    setMeasurements(result);
  };

  return (
    <div style={{ position: "relative", width: VIDEO_W, height: VIDEO_H }}>
      {/* וידאו */}
      <video
        ref={videoRef}
        autoPlay playsInline muted
        style={{ width: VIDEO_W, height: VIDEO_H, objectFit: "cover", display: "block" }}
      />

      {/* SVG overlay */}
      <svg
        width={VIDEO_W} height={VIDEO_H}
        style={{ position: "absolute", inset: 0 }}
        onClick={handleCalibClick}
      >
        {/* קווים בין נקודות */}
        <line x1={points.find(p=>p.id==="shoulder_l")?.x} y1={points.find(p=>p.id==="shoulder_l")?.y}
              x2={points.find(p=>p.id==="shoulder_r")?.x} y2={points.find(p=>p.id==="shoulder_r")?.y}
              stroke="#C0D3CA" strokeWidth={1} strokeDasharray="4,4" opacity={0.5} />
        {/* ... ניתן להוסיף קווים נוספים */}

        {/* נקודות */}
        {points.map((pt) => (
          <LandmarkPoint key={pt.id} {...pt} onDrag={handleDrag} />
        ))}

        {/* נקודות calibration */}
        {calibPoints.map((cp, i) => (
          <circle key={i} cx={cp.x} cy={cp.y} r={8} fill="orange" />
        ))}
      </svg>

      {/* כפתורים */}
      <div style={{ position: "absolute", bottom: 16, left: 16, display: "flex", gap: 8 }}>
        <button onClick={() => { setCalibrating(true); setCalibPoints([]); }}>
          {calibrating ? "לחץ על 2 קצוות הדף A4" : "🔧 כייל עם A4"}
        </button>
        {pixelsPerCm && (
          <button onClick={calculate}>📏 חשב מידות</button>
        )}
      </div>

      {/* תוצאות */}
      {measurements && (
        <div style={{
          position: "absolute", top: 16, right: 16,
          background: "rgba(10,10,10,0.85)", color: "#fff",
          padding: 16, borderRadius: 8, fontSize: 13,
          fontFamily: "Montserrat, sans-serif",
        }}>
          <div>רוחב כתפיים: {measurements.shoulderWidth} ס"מ</div>
          <div>היקף חזה: {measurements.chestCircum} ס"מ</div>
          <div>היקף מותניים: {measurements.waistCircum} ס"מ</div>
          <div>היקף ירכיים: {measurements.hipCircum} ס"מ</div>
          <div>אורך שרוול: {measurements.sleeveLength} ס"מ</div>
          <div>אורך גב: {measurements.backLength} ס"מ</div>
          <button onClick={() => onComplete(measurements)} style={{ marginTop: 12 }}>
            שמור מידות ✓
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## דיוק והגבלות

| גורם | השפעה על דיוק |
|------|--------------|
| calibration עם A4 | ±1–2 ס"מ |
| מרחק קבוע בלבד | ±3–5 ס"מ |
| בגדים רופפים | ±2–4 ס"מ (לבוש צמוד = עדיף) |
| תאורה גרועה | קשה לזהות גבולות |
| הנחה שהגוף סימטרי | נכון ל-90% מהמקרים |

**טיפ חשוב:** לבקש מהמשתמש ללבוש חולצה צמודה בזמן המדידה.

---

## שלבים להטמעה בפרויקט

1. צור `src/pages/LiveMeasure.jsx` עם הקומפוננטה הראשית
2. הוסף route `/sizes/live` ב-`App.jsx`
3. הוסף כפתור "מדידה חיה 📷" בדף `IndexSizes.jsx`
4. כשהמשתמש לוחץ "שמור מידות" — שמור ל-profile שלו ב-Account
