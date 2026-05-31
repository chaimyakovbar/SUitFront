# מעבר ל-3D Suit Customizer

## המצב הנוכחי
המערכת מבוססת על שכבות תמונות WebP מ-S3.
כל בחירה (צבע, דש, כפתורים וכו') = תמונה אחרת.
מהיר, פשוט, אבל 2D בלבד וזווית קבועה.

---

## מה נדרש ל-3D — סקירה כללית

```
מודל 3D (GLB)  +  Textures לכל צבע  +  קוד React Three Fiber
      ↓                   ↓                        ↓
  החלק הקשה          החלק הבינוני             החלק הקל
```

---

## שלב 1 — מודל 3D (הצעד הכי קריטי)

### מה המודל חייב לכלול

המודל חייב להיות מחולק ל-meshes נפרדים לכל חלק שניתן להחליף:

```
suit.glb
  ├── jacket_body          ← גוף הז'קט (חובה)
  ├── lapel_slim           ← דש צר
  ├── lapel_wide           ← דש רחב
  ├── lapel_peaked         ← דש שפיץ
  ├── collar_classic       ← צווארון קלאסי
  ├── collar_mandarin      ← צווארון מנדרין
  ├── buttons              ← כפתורים (mesh נפרד לצבע)
  ├── buttonholes          ← חורי כפתורים
  ├── pocket_flat          ← כיס שטוח
  ├── pocket_flap          ← כיס עם פלאפ
  ├── pocket_welt          ← כיס ולט
  ├── lining               ← בטנה (חובה — נראה בפתיחת הז'קט)
  ├── sleeve_cuffs         ← שרוולים + שרוולונים
  ├── poshet               ← פושט (אופציונלי, mesh נפרד)
  └── pants                ← מכנסיים
```

### מה לחפש בקנייה / מה לבקש מעצב

- **Format:** GLB או GLTF (לא FBX, לא OBJ)
- **Poly count:** 50,000–150,000 פוליגונים (לא יותר, לא פחות)
- **Rigged:** לא חובה (רק אם רוצים אנימציה של לבישה)
- **UV Unwrapped:** חובה — בלי זה הtextures לא יעבדו
- **Named meshes:** כל חלק צריך שם ברור באנגלית
- **Scale:** מטרים אמיתיים (1 יחידה = 1 מטר)

---

## שלב 2 — Textures (צבעים ובדים)

לכל צבע/בד צריך 3 קבצים (PBR — Physically Based Rendering):

```
textures/
  ├── navy/
  │   ├── navy_diffuse.webp      ← הצבע עצמו
  │   ├── navy_normal.webp       ← מרקם הבד (עומק)
  │   └── navy_roughness.webp    ← ברק / מט
  ├── charcoal/
  │   ├── charcoal_diffuse.webp
  │   ├── charcoal_normal.webp
  │   └── charcoal_roughness.webp
  └── ...
```

### כיצד מייצרים textures לבד

**אפשרות א׳ — Substance 3D Sampler (Adobe)**
- מעלים תמונה של בד אמיתי
- הוא מייצר אוטומטית את כל ה-maps
- עולה ~$20/חודש

**אפשרות ב׳ — AI Texture Generator**
- Poly.cam / Materialize (חינמי) — מעלים תמונת בד, מקבלים maps
- Stable Diffusion עם ControlNet

**אפשרות ג׳ — Seamless Texture Sites**
- ambientCG.com — חינמי לגמרי, איכות גבוהה
- poliigon.com — בתשלום, מקצועי

---

## שלב 3 — הקוד (React Three Fiber)

### התקנה
```bash
npm install three @react-three/fiber @react-three/drei
```

### מבנה הקבצים החדש
```
src/components/suit-customizer/
  ├── SuitCustomizer.jsx         ← ללא שינוי (logic)
  ├── SuitPreview3D.jsx          ← חדש — מחליף את SuitPreview.jsx
  ├── SuitModel3D.jsx            ← חדש — המודל עצמו
  ├── useSuitMaterials.js        ← חדש — ניהול textures
  └── colorMap.js                ← חדש — מיפוי צבעים לtextures
```

### colorMap.js
```js
// מיפוי בין שמות הצבעים הנוכחיים ל-hex / texture path
export const COLOR_MAP = {
  navy:     { hex: "#1B2A4A", texture: "/textures/navy/navy_diffuse.webp" },
  charcoal: { hex: "#36454F", texture: "/textures/charcoal/charcoal_diffuse.webp" },
  black:    { hex: "#1a1a1a", texture: "/textures/black/black_diffuse.webp" },
  grey:     { hex: "#808080", texture: "/textures/grey/grey_diffuse.webp" },
  // ... שאר הצבעים
};
```

### useSuitMaterials.js
```js
import { useTexture } from "@react-three/drei";
import { useAtomValue } from "jotai";
import { currentColorAtom, selectedInsideTypeAtom } from "../../Utils";
import { COLOR_MAP } from "./colorMap";

export function useSuitMaterials() {
  const currColor   = useAtomValue(currentColorAtom);
  const insideColor = useAtomValue(selectedInsideTypeAtom) || currColor;

  const outerColor  = COLOR_MAP[currColor]   || COLOR_MAP.navy;
  const liningColor = COLOR_MAP[insideColor] || COLOR_MAP.navy;

  const [outerDiffuse, outerNormal, outerRoughness] = useTexture([
    outerColor.texture,
    outerColor.texture.replace("diffuse", "normal"),
    outerColor.texture.replace("diffuse", "roughness"),
  ]);

  return {
    outerMaterial: {
      map:          outerDiffuse,
      normalMap:    outerNormal,
      roughnessMap: outerRoughness,
      roughness:    0.85,
      metalness:    0.05,
    },
    liningMaterial: {
      color: liningColor.hex,
      roughness: 0.7,
    },
  };
}
```

### SuitModel3D.jsx
```jsx
import { useGLTF } from "@react-three/drei";
import { useAtomValue } from "jotai";
import {
  selectedLapelTypeAtom,
  selectedCollarAtom,
  selectedPacketTypeAtom,
  selectedButtonAtom,
  selectedPoshetAtom,
  currentKindAtom,
} from "../../Utils";
import { useSuitMaterials } from "./useSuitMaterials";
import { COLOR_MAP } from "./colorMap";

export function SuitModel3D() {
  const { nodes } = useGLTF("/models/suit.glb");
  const { outerMaterial, liningMaterial } = useSuitMaterials();

  const lapelType   = useAtomValue(selectedLapelTypeAtom);
  const collarType  = useAtomValue(selectedCollarAtom);
  const packetType  = useAtomValue(selectedPacketTypeAtom);
  const buttonColor = useAtomValue(selectedButtonAtom);
  const poshetColor = useAtomValue(selectedPoshetAtom);
  const suitKind    = useAtomValue(currentKindAtom); // kind1, kind2, kind3

  return (
    <group rotation={[0, 0.2, 0]} scale={1}>

      {/* ── גוף ראשי ── */}
      <mesh geometry={nodes.jacket_body.geometry} castShadow>
        <meshStandardMaterial {...outerMaterial} />
      </mesh>

      {/* ── שרוולים ── */}
      <mesh geometry={nodes.sleeve_cuffs.geometry} castShadow>
        <meshStandardMaterial {...outerMaterial} />
      </mesh>

      {/* ── בטנה ── */}
      <mesh geometry={nodes.lining.geometry}>
        <meshStandardMaterial {...liningMaterial} />
      </mesh>

      {/* ── דש — לפי בחירה ── */}
      {lapelType === "Slim"   && <mesh geometry={nodes.lapel_slim.geometry}   castShadow><meshStandardMaterial {...outerMaterial} /></mesh>}
      {lapelType === "Wide"   && <mesh geometry={nodes.lapel_wide.geometry}   castShadow><meshStandardMaterial {...outerMaterial} /></mesh>}
      {lapelType === "Peaked" && <mesh geometry={nodes.lapel_peaked.geometry} castShadow><meshStandardMaterial {...outerMaterial} /></mesh>}

      {/* ── צווארון ── */}
      {collarType === "collar1" && <mesh geometry={nodes.collar_classic.geometry}  castShadow><meshStandardMaterial {...outerMaterial} /></mesh>}
      {collarType === "collar2" && <mesh geometry={nodes.collar_mandarin.geometry} castShadow><meshStandardMaterial {...outerMaterial} /></mesh>}

      {/* ── כיסים ── */}
      {packetType === "packet4" && <mesh geometry={nodes.pocket_flat.geometry}  castShadow><meshStandardMaterial {...outerMaterial} /></mesh>}
      {packetType === "packet5" && <mesh geometry={nodes.pocket_flap.geometry}  castShadow><meshStandardMaterial {...outerMaterial} /></mesh>}
      {packetType === "packet6" && <mesh geometry={nodes.pocket_welt.geometry}  castShadow><meshStandardMaterial {...outerMaterial} /></mesh>}

      {/* ── כפתורים ── */}
      {buttonColor && (
        <mesh geometry={nodes.buttons.geometry}>
          <meshStandardMaterial
            color={COLOR_MAP[buttonColor]?.hex || "#888"}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>
      )}

      {/* ── פושט ── */}
      {poshetColor && (
        <mesh geometry={nodes.poshet.geometry}>
          <meshStandardMaterial color={COLOR_MAP[poshetColor]?.hex || "#fff"} />
        </mesh>
      )}

      {/* ── מכנסיים ── */}
      <mesh geometry={nodes.pants.geometry} castShadow>
        <meshStandardMaterial {...outerMaterial} />
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/suit.glb");
```

### SuitPreview3D.jsx
```jsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";
import { SuitModel3D } from "./SuitModel3D";

export default function SuitPreview3D({ isMobile }) {
  return (
    <div style={{ width: "100%", height: isMobile ? "450px" : "600px" }}>
      <Canvas
        camera={{ position: [0, 0.8, 2.5], fov: 45 }}
        shadows
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>

          {/* תאורה */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[2, 4, 2]} intensity={1} castShadow />
          <directionalLight position={[-2, 2, -1]} intensity={0.3} />

          {/* סביבה — נותנת reflection ריאליסטי לבד */}
          <Environment preset="studio" />

          {/* המודל */}
          <SuitModel3D />

          {/* צל על הרצפה */}
          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.4}
            scale={3}
            blur={2}
          />

          {/* סיבוב בעכבר / אצבע */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
            minDistance={1.5}
            maxDistance={4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

---

## שלב 4 — חיבור ל-SuitCustomizer הקיים

ב-`SuitPreview.jsx` — רק מחליפים את `ImageFilterComponent` ב-`SuitPreview3D`:

```jsx
// לפני:
import ImageFilterComponent from "../ImageCollector";
<ImageFilterComponent />

// אחרי:
import SuitPreview3D from "./SuitPreview3D";
<SuitPreview3D isMobile={isMobile} />
```

כל ה-Jotai atoms נשארים זהים — לא צריך לשנות את לוגיקת הבחירות.

---

## אפשרויות לרכישת מודל 3D

| אתר | מה לחפש | מחיר משוער |
|-----|---------|-----------|
| CGTrader | "bespoke suit GLB" / "suit jacket 3D model" | $30–150 |
| TurboSquid | "men suit GLTF" | $50–200 |
| Sketchfab | יש גם חינמיים | $0–100 |
| Fiverr | "3D suit model Blender" | $80–300 |

### מה לכתוב להזמנה מעצב (Fiverr/Upwork)

```
I need a 3D men's bespoke suit model in GLB format for a real-time web configurator.

Requirements:
- GLB format, optimized for web (under 150k polygons)
- Separate named meshes: jacket_body, lapel_slim, lapel_wide, lapel_peaked,
  collar_classic, collar_mandarin, buttons, pocket_flat, pocket_flap,
  pocket_welt, lining, sleeve_cuffs, pants
- UV unwrapped, ready for texture replacement
- PBR textures for 2-3 fabric colors (navy, charcoal, black)
- Scale in meters
- Neutral T-pose or natural standing pose
```

---

## סדר פעולות מומלץ

```
1. רכוש / הזמן מודל GLB    ← שבוע
        ↓
2. הכן textures לכל צבע    ← יום-יומיים (Substance Sampler)
        ↓
3. npm install three @react-three/fiber @react-three/drei
        ↓
4. בנה SuitModel3D.jsx עם המودל שקיבלת
        ↓
5. חבר ל-Jotai atoms הקיימים
        ↓
6. החלף SuitPreview ב-SuitPreview3D
        ↓
7. כוונן תאורה + זוויות מצלמה
```

---

## השפעה על ביצועים

| מכשיר | צפי |
|-------|-----|
| מחשב מודרני | 60fps חלק |
| מחשב ישן | 30-60fps |
| טלפון מודרני (iPhone 13+) | 30-60fps |
| טלפון ישן | עלול להיות כבד |

**טיפ:** להשאיר את המצב 2D כ-fallback למובייל ישן — `window.navigator.hardwareConcurrency < 4 → show 2D`.

---

## סיכום עלויות

| פריט | עלות משוערת |
|------|------------|
| מודל 3D (קנייה) | $30–200 |
| Textures (Substance חודש) | $20 |
| זמן פיתוח קוד | ~2–3 ימים |
| **סה"כ** | **~$50–220** |
