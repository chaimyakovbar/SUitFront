// Centralized anthropometric estimation logic for Quick Fit and other flows
// Based on: estimateMeasurements(inputs, overrideParams)
//
// Minimal required inputs:
// - heightCm
// - weightKg
// - chestCm
// - waistCm
// - hipCm
// Optional:
// - neckCm
// - shoulderWidthCm
//
// Returns:
// {
//   diagnostics: { BMI, bodyType, usedInputs, notes },
//   measurements: { chest, jacketLength, shoulderWidth, ... } // 16 fields
// }

/**
 * Core estimator function.
 * You can tune behavior via overrideParams when calibrating to real tailoring data.
 */
export function estimateMeasurements(inputs, overrideParams = {}) {
  const H = Number(inputs.heightCm) || 0;
  const W = Number(inputs.weightKg) || 0;
  const chest = inputs.chestCm ? Number(inputs.chestCm) : null;
  const waist = inputs.waistCm ? Number(inputs.waistCm) : null;
  const hip = inputs.hipCm ? Number(inputs.hipCm) : null;
  const sex = inputs.sex || "male";
  const age = inputs.age || null;

  if (!H || !W) return { error: "heightCm and weightKg required" };

  const BMI = +(W / ((H / 100) * (H / 100))).toFixed(2);

  const defaultParams = {
    shoulderFromChest: 0.25,
    jacketLengthFromHeight: 0.3,
    backLengthFromHeight: 0.18,
    sleeveFromHeight: 0.45,
    armholeAllowance: 2.5,
    inseamFromHeight: 0.45,
    riseFromHeight: 0.24,
    thighFromHip: 0.58,
    kneeFromThigh: 0.6,
    calfFromKnee: 0.8,
    ankleFromCalf: 0.5,
    bicepsFromChest: 0.18,
    wristFromChest: 0.09,
    jacketEase: 6,
    waistEase: 2,
    hipFromChestFallback: 0.98,
  };

  const params = { ...defaultParams, ...overrideParams };

  let bodyType = inputs.bodyType || "auto";
  if (bodyType === "auto") {
    if (BMI < 20) bodyType = "ectomorph";
    else if (BMI < 27) bodyType = "mesomorph";
    else bodyType = "endomorph";
  }

  const bodyTypeAdjust = {
    ectomorph: { shoulder: 0.97, thigh: 0.95, jacketEase: 0.9 },
    mesomorph: { shoulder: 1.0, thigh: 1.0, jacketEase: 1.0 },
    endomorph: { shoulder: 1.03, thigh: 1.08, jacketEase: 1.08 },
  }[bodyType];

  const sexAdjust =
    sex === "female"
      ? { shoulder: 0.92, jacketLength: 0.98 }
      : { shoulder: 1.0, jacketLength: 1.0 };

  const estChest = chest
    ? chest
    : Math.max(H * 0.5 * 0.9, W * 2.2);

  const estWaist = waist ? waist : Math.max(estChest * 0.82, estChest - 10);

  const estHip = hip
    ? hip
    : Math.max(estWaist * 1.14, estChest * params.hipFromChestFallback);

  const shoulderWidth =
    estChest *
    params.shoulderFromChest *
    bodyTypeAdjust.shoulder *
    sexAdjust.shoulder;

  const jacketLength = H * params.jacketLengthFromHeight * sexAdjust.jacketLength;
  const backLength = H * params.backLengthFromHeight;
  const sleeveLength = H * params.sleeveFromHeight;
  const biceps = estChest * params.bicepsFromChest * bodyTypeAdjust.thigh;
  const wrist = estChest * params.wristFromChest;
  const inseam = H * params.inseamFromHeight;
  const rise = H * params.riseFromHeight;
  const thigh = estHip * params.thighFromHip * bodyTypeAdjust.thigh;
  const knee = thigh * params.kneeFromThigh || thigh * 0.6;
  const calf = knee * params.calfFromKnee;
  const ankle = calf * params.ankleFromCalf;

  const chestFinal = +(estChest + params.jacketEase).toFixed(1);
  const waistFinal = +(estWaist + params.waistEase).toFixed(1);
  const hipFinal = +(estHip + 2).toFixed(1);

  return {
    diagnostics: {
      BMI,
      bodyType,
      usedInputs: {
        heightCm: H,
        weightKg: W,
        chest: chest !== null,
        waist: waist !== null,
        hip: hip !== null,
        sex,
        age,
      },
      notes: "params adjustable via overrideParams for calibration",
    },
    measurements: {
      chest: chestFinal,
      jacketLength: +jacketLength.toFixed(1),
      shoulderWidth: +shoulderWidth.toFixed(1),
      backLength: +backLength.toFixed(1),
      sleeveLength: +sleeveLength.toFixed(1),
      biceps: +biceps.toFixed(1),
      wrist: +wrist.toFixed(1),
      waist: waistFinal,
      hip: hipFinal,
      inseam: +inseam.toFixed(1),
      rise: +rise.toFixed(1),
      thigh: +thigh.toFixed(1),
      knee: +knee.toFixed(1),
      calf: +calf.toFixed(1),
      ankle: +ankle.toFixed(1),
      frontChestToWaist: +((backLength * 0.95).toFixed(1)),
    },
  };
}

/**
 * Minimal-input friendly wrapper.
 * Ensures defaults for optional fields and keeps the API small for the UI layer.
 */
export function estimateFromMinimalInput(minimalInput, overrideParams = {}) {
  const {
    heightCm,
    weightKg,
    chestCm,
    waistCm,
    hipCm,
    neckCm, // currently unused but reserved for future refinement
    shoulderWidthCm, // currently unused; can override later via overrideParams
    sex = "male",
    age = null,
    bodyType = "auto",
  } = minimalInput || {};

  const baseInputs = {
    heightCm,
    weightKg,
    chestCm,
    waistCm,
    hipCm,
    sex,
    age,
    bodyType,
  };

  const result = estimateMeasurements(baseInputs, overrideParams);

  // If user provided an explicit shoulder width, override the estimate.
  if (
    result &&
    result.measurements &&
    typeof shoulderWidthCm === "number" &&
    shoulderWidthCm > 0
  ) {
    result.measurements.shoulderWidth = +shoulderWidthCm.toFixed(1);
  }

  // neckCm is not directly used in current formulas, but kept here
  // for future patterns and to preserve original user input.
  return {
    ...result,
    diagnostics: {
      ...(result.diagnostics || {}),
      providedOptional: {
        neckCm: typeof neckCm === "number" && neckCm > 0,
        shoulderWidthCm:
          typeof shoulderWidthCm === "number" && shoulderWidthCm > 0,
      },
    },
  };
}

// --- Example usage for developers (not executed in production) ---
// const minimalInputExample = {
//   heightCm: 180,
//   weightKg: 78,
//   chestCm: 98,
//   waistCm: 82,
//   hipCm: 98,
// };
//
// const exampleResult = estimateFromMinimalInput(minimalInputExample);
// console.log("QuickFit example:", JSON.stringify(exampleResult, null, 2));


