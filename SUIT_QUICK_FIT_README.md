## Quick Fit / מקוצר – Minimal Measurements Flow

This flow lets the user enter **only a few basic measurements** (height, weight, chest, waist, hips, optional neck & shoulder width) and then computes all **16 suit measurements** via `src/utils/measurementEstimator.js`.

### Core pieces

- `src/utils/measurementEstimator.js`
  - `estimateMeasurements(inputs, overrideParams)` – core anthropometric estimator.
  - `estimateFromMinimalInput(minimalInput, overrideParams)` – wrapper for Quick Fit that expects:
    - `heightCm, weightKg, chestCm, waistCm, hipCm` (required)
    - `neckCm?, shoulderWidthCm?, sex?, age?, bodyType?` (optional)
  - Returns `{ diagnostics, measurements }` where `measurements` has 16 fields:
    - `chest, jacketLength, shoulderWidth, backLength, sleeveLength, biceps, wrist, waist, hip, inseam, rise, thigh, knee, calf, ankle, frontChestToWaist`.

- `src/config/mannequinPoints.js`
  - `quickFitPoints` – list of logical points shown on the mannequin:
    - Required: `height`, `weight`, `chest`, `waist`, `hip`
    - Optional: `neck`, `shoulderWidth`
  - Each point has bilingual strings (`labelEn`, `labelHe`, `helpEn`, `helpHe`) and an `inputKey` that maps directly to the estimator input.

- `src/components/QuickFitMannequin.jsx`
  - Uses the 3D `Doll2` model and renders **only the minimal Quick Fit points** as overlay markers.
  - A point turns **green** when the corresponding value is filled, otherwise red.
  - Hovering/clicking a point shows a tooltip with **Hebrew first and English** instructions in one text block.
  - Clicking a point calls `onPointSelect(inputKey)` so the form can focus the right field.

- `src/pages/QuickFit.jsx`
  - New page for the **Quick Fit / מקוצר** flow.
  - Left side: 3D mannequin with minimal points.
  - Right side: form fields for:
    - `heightCm, weightKg, chestCm, waistCm, hipCm` (marked as required)
    - `neckCm, shoulderWidthCm` (optional)
  - On submit:
    - Validates required fields.
    - Calls `estimateFromMinimalInput(values)` and renders a read-only list of **all 16 measurements** below the form, with bilingual labels.
    - Shows diagnostics like BMI and inferred body type.

- `src/sizes/IndexSizes.jsx`
  - Adds a third card/option:
    - Route: `/sizes/quick-fit`
    - Title key reused: `allMeasurements` (HE/EN already in `LanguageContext`).

- `src/App.jsx`
  - Registers route:
    - `/sizes/quick-fit` → `QuickFit` page.

### JSON example

Example input and description are stored in:

- `src/config/quickFitExample.json`

You can also create the same object in code:

```js
import { estimateFromMinimalInput } from "./src/utils/measurementEstimator";

const minimalInput = {
  heightCm: 180,
  weightKg: 78,
  chestCm: 98,
  waistCm: 82,
  hipCm: 98,
};

const result = estimateFromMinimalInput(minimalInput);
console.log(JSON.stringify(result, null, 2));
```

This will log an object of the shape:

```js
{
  "diagnostics": {
    "BMI": 24.07,
    "bodyType": "mesomorph",
    "usedInputs": { ... },
    "providedOptional": { "neckCm": false, "shoulderWidthCm": false },
    "notes": "params adjustable via overrideParams for calibration"
  },
  "measurements": {
    "chest": 104.0,
    "jacketLength": 54.0,
    "shoulderWidth": 24.5,
    "...": "remaining 13 measurements"
  }
}
```

> Note: numeric values above are illustrative; exact numbers depend on the current implementation and any `overrideParams` applied.


