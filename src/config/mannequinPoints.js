// Configuration for mannequin measurement points used in Quick Fit (מקוצר)
// This is designed to be AI-friendly and easily extendable.
//
// Logical points we might support (16 total conceptually):
// - chest, waist, hip, neck, shoulderWidth, backLength, sleeveLength,
//   biceps, wrist, inseam, rise, thigh, knee, calf, ankle, frontChestToWaist
//
// For the Quick Fit flow we only activate the minimal inputs plus a couple of optional ones.

export const quickFitPoints = [
  {
    id: "height",
    inputKey: "heightCm",
    required: true,
    labelEn: "Height",
    labelHe: "גובה",
    helpEn: "Stand straight without shoes and measure from floor to the top of your head (in cm).",
    helpHe:
      "עמוד זקוף בלי נעליים ומדוד מהרצפה עד קצה הראש (בס״מ).",
    axisHint: "vertical",
  },
  {
    id: "weight",
    inputKey: "weightKg",
    required: true,
    labelEn: "Weight",
    labelHe: "משקל",
    helpEn: "Use a scale to measure your current body weight (in kg).",
    helpHe: "השתמש במשקל כדי למדוד את משקל הגוף הנוכחי שלך (בק״ג).",
    axisHint: "none",
  },
  {
    id: "chest",
    inputKey: "chestCm",
    required: true,
    labelEn: "Chest",
    labelHe: "חזה",
    helpEn:
      "Measure around the fullest part of the chest, under the armpits, keeping the tape level and relaxed.",
    helpHe:
      "מדוד סביב החלק המלא ביותר של החזה, מתחת לבית השחי, כשהסרט מאוזן ורפוי.",
    axisHint: "torso",
  },
  {
    id: "waist",
    inputKey: "waistCm",
    required: true,
    labelEn: "Waist",
    labelHe: "מותן",
    helpEn:
      "Measure around the narrowest part of your waist, usually just above the belly button.",
    helpHe:
      "מדוד סביב החלק הצר ביותר של המותן, בדרך כלל קצת מעל הפופיק.",
    axisHint: "torso",
  },
  {
    id: "hip",
    inputKey: "hipCm",
    required: true,
    labelEn: "Hips",
    labelHe: "אגן / ירכיים",
    helpEn:
      "Measure around the fullest part of your hips and seat, keeping the tape level.",
    helpHe:
      "מדוד סביב החלק המלא ביותר של האגן והישבן, כשהסרט מאוזן מסביב.",
    axisHint: "hips",
  },
  {
    id: "neck",
    inputKey: "neckCm",
    required: false,
    labelEn: "Neck (optional)",
    labelHe: "צוואר (אופציונלי)",
    helpEn:
      "Measure around the base of the neck where a shirt collar would sit. Keep one finger between tape and skin.",
    helpHe:
      "מדוד סביב בסיס הצוואר במקום שבו יושב צווארון חולצה. השאר אצבע אחת בין הסרט לעור.",
    axisHint: "neck",
  },
  {
    id: "shoulderWidth",
    inputKey: "shoulderWidthCm",
    required: false,
    labelEn: "Shoulder Width (optional)",
    labelHe: "רוחב כתפיים (אופציונלי)",
    helpEn:
      "Measure from the edge of one shoulder bone to the other, across the back, following a natural line.",
    helpHe:
      "מדוד מקצה עצם כתף אחת לקצה הכתף השנייה, לאורך הגב, בקו טבעי.",
    axisHint: "shoulders",
  },
];

// Helper to map a point id to the Quick Fit estimator input key
export const pointIdToInputKey = quickFitPoints.reduce((acc, point) => {
  acc[point.id] = point.inputKey;
  return acc;
}, {});


