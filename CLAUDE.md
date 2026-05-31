# CLAUDE.md — SuitFront Project Context

## Project Overview
Bespoke suit ordering web app. React + Vite frontend (SuitFront) + Express/MongoDB backend.
Owner: Chaim. Language: Hebrew UI + English code.

---

## Tech Stack
- **React 18 + Vite**
- **MUI v5** — uses `makeStyles` from `@mui/styles` (v4 API, deprecated but in use everywhere — don't change)
- **React Router v6**
- **Firebase Auth** — user state via `useAtomValue(authUserAtom)` from `jotai`
- **Framer Motion** — already installed
- **AWS S3** — assets at `https://ch-suits.s3.us-east-1.amazonaws.com`

---

## Project Structure
```
src/
  App.jsx              — routes, lazy imports, NavBarWrapper
  homePage/
    HomePage2.jsx      — main home page (hero, featured, ScrollSequence, AllCollection)
    NavBar.jsx
  pages/
    Shopping.jsx       — suit catalog (uses GetAllSuitFromData)
    Account.jsx        — user profile, orders, measurements
    Payed.jsx          — payment page
    PaymentSuccess.jsx — post-payment success
    About.jsx / Contact.jsx / PolicySupport.jsx
  components/
    ScrollSequence.jsx — scroll-driven frame animation (canvas-based)
    GetAllSuitFromData.jsx — suit grid component
    suit-customizer/   — 3D suit customizer
  context/
    LanguageContext.jsx — t() translation hook (Hebrew/English)
    AuthContext.jsx
  Utils.js             — authUserAtom (Jotai)
public/
  scroll-frames/       — 16 WebP images (frame_01.webp … frame_16.webp), ~170–405KB each
```

---

## Routing (App.jsx)
| Path | Component | Auth required |
|------|-----------|---------------|
| `/` | HomePage2 | No |
| `/customSuit` | SuitCustomizer | Yes |
| `/Shopping` | Shopping | Yes |
| `/account` | Account | Yes |
| `/about` | About | No |
| `/contact` | Contact | No |
| `/indexSizes` | IndexSizes | No |
| `/Payed` | Payed | No |
| `/payment-success` | PaymentSuccess | No |

Everything except HomePage2 and NavBar is **lazy-loaded** via `React.lazy`.

---

## ScrollSequence Component
`src/components/ScrollSequence.jsx` — Apple-style scroll-driven image sequence.

**How it works:**
- 16 WebP frames in `public/scroll-frames/`
- Desktop: all 16 frames, 380vh scroll height
- Mobile: 10 key frames, 220vh scroll height
- Canvas-based rendering (no img tags)
- RAF loop + lerp (0.14) for smooth frame transitions
- Captions: THE FABRIC → THE CRAFT → THE SHAPING → THE DETAILS → THE FINISHING → THE SUIT

**Critical bug that was fixed:**
- `overflow: clip` must be on the root div in HomePage2.jsx — NOT `overflow-x: hidden`
- `overflow-x: hidden` breaks `position: sticky` (creates new scroll context), causing the canvas to scroll away instead of staying fixed
- The canvas must NOT have `opacity` controlled via React JSX style prop — React re-renders reset it to 0. Loading overlay covers canvas instead, fades out when loaded.

---

## Key Patterns

### Translation
```jsx
const { t } = useLanguage();
// Usage: {t("heroTitle")}
```

### Auth check
```jsx
const user = useAtomValue(authUserAtom); // null if not logged in
```

### S3 assets
```js
const S3_BASE_URL = "https://ch-suits.s3.us-east-1.amazonaws.com";
// e.g. `${S3_BASE_URL}/assets_V3/photoBackGround4.webp`
```

### makeStyles pattern (used everywhere — do NOT switch to sx or styled)
```jsx
import { makeStyles } from "@mui/styles";
const useStyles = makeStyles({ root: { ... } });
const classes = useStyles();
```

---

## Known Issues / History
- `CheckoutModern.jsx` and `CheckOut.jsx` — legacy, no active route, kept for review
- `QuickFit.jsx`, `QuickFitMannequin.jsx`, `mannequinPoints.js` — kept for review
- `Stepper.jsx` — kept for review
- `Payed.jsx` — required adding `Dialog, DialogTitle, DialogContent` to MUI imports (was crashing)
- Shopping page was previously routing to `CheckoutModern` by mistake — fixed to `Shopping.jsx`

---

## Things to Avoid
- Do NOT use `overflow: hidden` or `overflow-x: hidden` on any full-page wrapper — breaks sticky
- Do NOT control canvas opacity via React JSX `style` prop if also manipulating it via JS — React resets it on every re-render
- Do NOT switch from `makeStyles` to `sx` prop — would require rewriting too much
- Do NOT generate or expose API keys in code files
