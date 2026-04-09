import React, { useState, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Slider,
  TextField,
  Button,
  Chip,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TuneIcon from "@mui/icons-material/Tune";
import SaveIcon from "@mui/icons-material/Save";
import { estimateFromMinimalInput } from "../utils/measurementEstimator";
import { useLanguage } from "../context/LanguageContext";
import { useSnackbar } from "notistack";
import { useAtom } from "jotai";
import { authUserAtom } from "../Utils";
import { postProduct } from "../api/suit";

// ─── constants ──────────────────────────────────────────────────────────────

const BODY_TYPES = [
  {
    key: "ectomorph",
    labelEn: "Slim",
    labelHe: "רזה",
    emoji: "🏃",
    descEn: "Lean frame, fast metabolism",
    descHe: "מסגרת רזה, חילוף חומרים מהיר",
  },
  {
    key: "mesomorph",
    labelEn: "Athletic",
    labelHe: "שרירי",
    emoji: "💪",
    descEn: "Muscular, well-proportioned",
    descHe: "שרירי, פרופורציות טובות",
  },
  {
    key: "regular",
    labelEn: "Regular",
    labelHe: "רגיל",
    emoji: "🧍",
    descEn: "Average build",
    descHe: "גזרה ממוצעת",
  },
  {
    key: "endomorph",
    labelEn: "Full",
    labelHe: "מלא",
    emoji: "🏋️",
    descEn: "Broader frame, fuller figure",
    descHe: "מסגרת רחבה, גזרה מלאה",
  },
];

const FIT_TYPES = [
  {
    key: "slim",
    labelEn: "Slim Fit",
    labelHe: "צמוד",
    descEn: "Close to the body, sharp silhouette",
    descHe: "קרוב לגוף, סילואט חד",
    emoji: "✂️",
    adjustCm: -3,
  },
  {
    key: "regular",
    labelEn: "Regular Fit",
    labelHe: "רגיל",
    descEn: "Classic comfort & style",
    descHe: "נוחות וסגנון קלאסי",
    emoji: "👔",
    adjustCm: 0,
  },
  {
    key: "relaxed",
    labelEn: "Relaxed Fit",
    labelHe: "מרווח",
    descEn: "Extra room & freedom of movement",
    descHe: "מרחב נוסף וחופש תנועה",
    emoji: "🌊",
    adjustCm: 4,
  },
];

const MEASUREMENT_LABELS = {
  chest: { en: "Chest", he: "חזה" },
  waist: { en: "Waist", he: "מותן" },
  hip: { en: "Hips", he: "ירכיים" },
  shoulderWidth: { en: "Shoulders", he: "כתפיים" },
  sleeveLength: { en: "Sleeve", he: "שרוול" },
  jacketLength: { en: "Jacket Length", he: "אורך ז'קט" },
  inseam: { en: "Inseam", he: "אורך רגל פנימי" },
  backLength: { en: "Back Length", he: "אורך גב" },
  thigh: { en: "Thigh", he: "ירך" },
  rise: { en: "Rise", he: "מכפלת" },
};

// Primary measurements to show prominently
const PRIMARY_KEYS = ["chest", "waist", "hip", "shoulderWidth", "sleeveLength", "jacketLength"];
// Secondary measurements
const SECONDARY_KEYS = ["inseam", "backLength", "thigh", "rise"];

// ─── helpers ─────────────────────────────────────────────────────────────────

const calcAccuracy = (bodyType, fitType, height, weight) => {
  let base = 78;
  if (bodyType && bodyType !== "auto") base += 6;
  if (fitType) base += 3;
  if (height >= 155 && height <= 200) base += 3;
  if (weight >= 50 && weight <= 130) base += 3;
  return Math.min(base, 93);
};

const bodyTypeToEstimatorKey = {
  ectomorph: "ectomorph",
  mesomorph: "mesomorph",
  regular: "mesomorph",
  endomorph: "endomorph",
};

// ─── animation variants ──────────────────────────────────────────────────────

const pageVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.2 } },
};

// ─── sub-components ──────────────────────────────────────────────────────────

const StepLabel = ({ step, total, label }) => (
  <Box sx={{ mb: 1 }}>
    <Typography
      sx={{
        fontSize: "0.75rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "rgba(192,211,202,0.55)",
        mb: 0.5,
      }}
    >
      {label} — {step}/{total}
    </Typography>
    <LinearProgress
      variant="determinate"
      value={(step / total) * 100}
      sx={{
        height: 3,
        borderRadius: 2,
        backgroundColor: "rgba(192,211,202,0.1)",
        "& .MuiLinearProgress-bar": {
          background: "linear-gradient(90deg, #C0D3CA, #8fb8a9)",
          borderRadius: 2,
        },
      }}
    />
  </Box>
);

const SelectCard = ({ item, selected, onClick, language }) => (
  <Box
    onClick={onClick}
    sx={{
      cursor: "pointer",
      border: selected
        ? "2px solid #C0D3CA"
        : "1px solid rgba(192,211,202,0.15)",
      borderRadius: "16px",
      p: { xs: 2, md: 2.5 },
      background: selected
        ? "linear-gradient(135deg, rgba(192,211,202,0.12) 0%, rgba(143,184,169,0.08) 100%)"
        : "rgba(255,255,255,0.02)",
      transition: "all 0.25s ease",
      position: "relative",
      "&:hover": {
        border: "1px solid rgba(192,211,202,0.4)",
        background: "rgba(192,211,202,0.06)",
        transform: "translateY(-2px)",
      },
    }}
  >
    {selected && (
      <CheckCircleIcon
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          fontSize: "1.1rem",
          color: "#C0D3CA",
        }}
      />
    )}
    <Typography sx={{ fontSize: "1.6rem", mb: 0.5 }}>{item.emoji}</Typography>
    <Typography
      sx={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: { xs: "1.1rem", md: "1.25rem" },
        color: selected ? "#C0D3CA" : "rgba(192,211,202,0.8)",
        fontWeight: 600,
        mb: 0.3,
      }}
    >
      {language === "he" ? item.labelHe : item.labelEn}
    </Typography>
    <Typography
      sx={{
        fontSize: "0.75rem",
        color: "rgba(192,211,202,0.5)",
        lineHeight: 1.4,
      }}
    >
      {language === "he" ? item.descHe : item.descEn}
    </Typography>
  </Box>
);

const MeasurementRow = ({ label, value, isHighlight }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      py: 1.2,
      px: 2,
      borderRadius: "10px",
      background: isHighlight
        ? "rgba(192,211,202,0.07)"
        : "transparent",
      border: isHighlight
        ? "1px solid rgba(192,211,202,0.12)"
        : "none",
      mb: isHighlight ? 1 : 0.5,
    }}
  >
    <Typography
      sx={{
        fontSize: isHighlight ? "0.95rem" : "0.85rem",
        color: isHighlight ? "rgba(192,211,202,0.9)" : "rgba(192,211,202,0.55)",
        fontWeight: isHighlight ? 500 : 400,
      }}
    >
      {label}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
      <Typography
        sx={{
          fontSize: isHighlight ? "1.15rem" : "0.95rem",
          fontWeight: 700,
          color: "#C0D3CA",
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{ fontSize: "0.7rem", color: "rgba(192,211,202,0.45)" }}
      >
        cm
      </Typography>
    </Box>
  </Box>
);

// ─── main component ───────────────────────────────────────────────────────────

const AIQuickSize = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { enqueueSnackbar } = useSnackbar();
  const [user] = useAtom(authUserAtom);
  const isHe = language === "he";

  const [step, setStep] = useState(0); // 0=height/weight, 1=bodytype, 2=fit, 3=results
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [heightInput, setHeightInput] = useState("175");
  const [weightInput, setWeightInput] = useState("75");
  const [selectedBodyType, setSelectedBodyType] = useState(null);
  const [selectedFit, setSelectedFit] = useState("regular");
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const TOTAL_STEPS = 3;

  const computeResult = useCallback(() => {
    const estimatorBodyType = selectedBodyType
      ? bodyTypeToEstimatorKey[selectedBodyType]
      : "auto";

    const raw = estimateFromMinimalInput({
      heightCm: height,
      weightKg: weight,
      bodyType: estimatorBodyType,
    });

    if (!raw || raw.error) return null;

    const fitAdjust =
      FIT_TYPES.find((f) => f.key === selectedFit)?.adjustCm ?? 0;

    // Apply fit adjustment to torso measurements
    const m = { ...raw.measurements };
    m.chest = +(m.chest + fitAdjust).toFixed(1);
    m.waist = +(m.waist + fitAdjust * 0.8).toFixed(1);
    m.hip = +(m.hip + fitAdjust * 0.5).toFixed(1);

    return {
      measurements: m,
      diagnostics: raw.diagnostics,
      accuracy: calcAccuracy(selectedBodyType, selectedFit, height, weight),
    };
  }, [height, weight, selectedBodyType, selectedFit]);

  const handleNext = () => {
    if (step === TOTAL_STEPS - 1) {
      // Compute and show results
      const r = computeResult();
      setResult(r);
      setStep(3);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step === 0) {
      navigate("/indexSizes");
    } else {
      setStep((s) => s - 1);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.email || !result) return;
    setSaving(true);
    try {
      const measurements = result.measurements;
      const profileData = {
        email: user.email,
        profileName: isHe ? "פרופיל AI מהיר" : "AI Quick Profile",
        chest: measurements.chest,
        waist: measurements.waist,
        hip: measurements.hip,
        shoulderWidth: measurements.shoulderWidth,
        sleeveLength: measurements.sleeveLength,
        jacketLength: measurements.jacketLength,
        inseam: measurements.inseam,
        generatedByAI: true,
        accuracy: result.accuracy,
        inputHeight: height,
        inputWeight: weight,
        bodyType: selectedBodyType || "auto",
        fitPreference: selectedFit,
      };
      await postProduct(profileData);
      setSaved(true);
      enqueueSnackbar(
        isHe
          ? "✅ הפרופיל נשמר בהצלחה!"
          : "✅ Profile saved successfully!",
        { variant: "success" }
      );
    } catch {
      enqueueSnackbar(
        isHe ? "שגיאה בשמירת הפרופיל" : "Error saving profile",
        { variant: "error" }
      );
    } finally {
      setSaving(false);
    }
  };

  // ── render helpers ──

  const renderStep0 = () => (
    <Box>
      <Typography
        sx={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: { xs: "1.8rem", md: "2.2rem" },
          color: "#C0D3CA",
          mb: 0.5,
          fontWeight: 300,
        }}
      >
        {isHe ? "גובה ומשקל" : "Height & Weight"}
      </Typography>
      <Typography
        sx={{ fontSize: "0.9rem", color: "rgba(192,211,202,0.55)", mb: 4 }}
      >
        {isHe
          ? "שני הנתונים הבסיסיים שמהם מחשבים הכל"
          : "The two base inputs from which everything is calculated"}
      </Typography>

      {/* Height */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography sx={{ color: "rgba(192,211,202,0.8)", fontSize: "0.9rem" }}>
            {isHe ? "גובה" : "Height"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              value={heightInput}
              onChange={(e) => {
                setHeightInput(e.target.value);
                const n = Number(e.target.value);
                if (n >= 140 && n <= 220) setHeight(n);
              }}
              size="small"
              inputProps={{ style: { textAlign: "center", color: "#C0D3CA", width: 52 } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(192,211,202,0.25)" },
                  "&:hover fieldset": { borderColor: "rgba(192,211,202,0.5)" },
                  "&.Mui-focused fieldset": { borderColor: "#C0D3CA" },
                },
              }}
            />
            <Typography sx={{ color: "rgba(192,211,202,0.5)", fontSize: "0.85rem" }}>
              cm
            </Typography>
          </Box>
        </Box>
        <Slider
          value={height}
          min={140}
          max={220}
          step={1}
          onChange={(_, v) => {
            setHeight(v);
            setHeightInput(String(v));
          }}
          sx={{
            color: "#C0D3CA",
            "& .MuiSlider-rail": { backgroundColor: "rgba(192,211,202,0.15)" },
            "& .MuiSlider-track": { background: "linear-gradient(90deg,#C0D3CA,#8fb8a9)" },
            "& .MuiSlider-thumb": {
              backgroundColor: "#C0D3CA",
              "&:hover": { boxShadow: "0 0 0 8px rgba(192,211,202,0.16)" },
            },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: "0.7rem", color: "rgba(192,211,202,0.3)" }}>140</Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "rgba(192,211,202,0.3)" }}>220</Typography>
        </Box>
      </Box>

      {/* Weight */}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography sx={{ color: "rgba(192,211,202,0.8)", fontSize: "0.9rem" }}>
            {isHe ? "משקל" : "Weight"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              value={weightInput}
              onChange={(e) => {
                setWeightInput(e.target.value);
                const n = Number(e.target.value);
                if (n >= 40 && n <= 180) setWeight(n);
              }}
              size="small"
              inputProps={{ style: { textAlign: "center", color: "#C0D3CA", width: 52 } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(192,211,202,0.25)" },
                  "&:hover fieldset": { borderColor: "rgba(192,211,202,0.5)" },
                  "&.Mui-focused fieldset": { borderColor: "#C0D3CA" },
                },
              }}
            />
            <Typography sx={{ color: "rgba(192,211,202,0.5)", fontSize: "0.85rem" }}>
              kg
            </Typography>
          </Box>
        </Box>
        <Slider
          value={weight}
          min={40}
          max={180}
          step={1}
          onChange={(_, v) => {
            setWeight(v);
            setWeightInput(String(v));
          }}
          sx={{
            color: "#C0D3CA",
            "& .MuiSlider-rail": { backgroundColor: "rgba(192,211,202,0.15)" },
            "& .MuiSlider-track": { background: "linear-gradient(90deg,#C0D3CA,#8fb8a9)" },
            "& .MuiSlider-thumb": {
              backgroundColor: "#C0D3CA",
              "&:hover": { boxShadow: "0 0 0 8px rgba(192,211,202,0.16)" },
            },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: "0.7rem", color: "rgba(192,211,202,0.3)" }}>40</Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "rgba(192,211,202,0.3)" }}>180</Typography>
        </Box>
      </Box>

      {/* BMI live indicator */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: "12px",
          background: "rgba(192,211,202,0.04)",
          border: "1px solid rgba(192,211,202,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: "0.8rem", color: "rgba(192,211,202,0.5)" }}>
          BMI
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#C0D3CA",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            {(weight / ((height / 100) ** 2)).toFixed(1)}
          </Typography>
          <Chip
            label={
              weight / ((height / 100) ** 2) < 18.5
                ? isHe ? "תת משקל" : "Underweight"
                : weight / ((height / 100) ** 2) < 25
                ? isHe ? "תקין" : "Normal"
                : weight / ((height / 100) ** 2) < 30
                ? isHe ? "עודף משקל" : "Overweight"
                : isHe ? "השמנה" : "Obese"
            }
            size="small"
            sx={{
              fontSize: "0.7rem",
              backgroundColor: "rgba(192,211,202,0.12)",
              color: "#C0D3CA",
              border: "1px solid rgba(192,211,202,0.2)",
            }}
          />
        </Box>
      </Box>
    </Box>
  );

  const renderStep1 = () => (
    <Box>
      <Typography
        sx={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: { xs: "1.8rem", md: "2.2rem" },
          color: "#C0D3CA",
          mb: 0.5,
          fontWeight: 300,
        }}
      >
        {isHe ? "מבנה גוף" : "Body Type"}
      </Typography>
      <Typography
        sx={{ fontSize: "0.9rem", color: "rgba(192,211,202,0.55)", mb: 3 }}
      >
        {isHe
          ? "בחר את מה שהכי מתאים לך — זה משפר את הדיוק"
          : "Choose the one that best describes you — improves accuracy"}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        {BODY_TYPES.map((bt) => (
          <SelectCard
            key={bt.key}
            item={bt}
            selected={selectedBodyType === bt.key}
            onClick={() => setSelectedBodyType(bt.key)}
            language={language}
          />
        ))}
      </Box>
      <Typography
        sx={{ mt: 2.5, fontSize: "0.78rem", color: "rgba(192,211,202,0.35)", textAlign: "center" }}
      >
        {isHe ? "* שלב אופציונלי — ניתן לדלג" : "* Optional step — you can skip"}
      </Typography>
    </Box>
  );

  const renderStep2 = () => (
    <Box>
      <Typography
        sx={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: { xs: "1.8rem", md: "2.2rem" },
          color: "#C0D3CA",
          mb: 0.5,
          fontWeight: 300,
        }}
      >
        {isHe ? "העדפת הלבשה" : "Fit Preference"}
      </Typography>
      <Typography
        sx={{ fontSize: "0.9rem", color: "rgba(192,211,202,0.55)", mb: 3 }}
      >
        {isHe
          ? "איך אתה מעדיף שהחליפה תישב על הגוף?"
          : "How do you prefer your suit to sit on the body?"}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {FIT_TYPES.map((ft) => (
          <SelectCard
            key={ft.key}
            item={ft}
            selected={selectedFit === ft.key}
            onClick={() => setSelectedFit(ft.key)}
            language={language}
          />
        ))}
      </Box>
    </Box>
  );

  const renderResults = () => {
    if (!result) return null;
    const m = result.measurements;
    const accuracy = result.accuracy;
    const bmi = result.diagnostics?.BMI;
    const detectedBodyType = result.diagnostics?.bodyType;

    return (
      <Box>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              mb: 1.5,
            }}
          >
            <AutoAwesomeIcon sx={{ color: "#C0D3CA", fontSize: "1.2rem" }} />
            <Typography
              sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: { xs: "1.8rem", md: "2.2rem" },
                color: "#C0D3CA",
                fontWeight: 300,
              }}
            >
              {isHe ? "המידות שלך" : "Your Measurements"}
            </Typography>
          </Box>

          {/* Accuracy badge */}
          <Box
            sx={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              px: 3,
              py: 1.5,
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, rgba(192,211,202,0.12) 0%, rgba(143,184,169,0.06) 100%)",
              border: "1px solid rgba(192,211,202,0.25)",
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                color: "rgba(192,211,202,0.6)",
                textTransform: "uppercase",
                mb: 0.3,
              }}
            >
              {isHe ? "דיוק התאמה" : "Fit Accuracy"}
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2rem",
                fontWeight: 700,
                color: "#C0D3CA",
                lineHeight: 1,
              }}
            >
              {accuracy}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={accuracy}
              sx={{
                mt: 0.8,
                width: 100,
                height: 4,
                borderRadius: 2,
                backgroundColor: "rgba(192,211,202,0.1)",
                "& .MuiLinearProgress-bar": {
                  background: "linear-gradient(90deg, #C0D3CA, #8fb8a9)",
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {/* Summary chips */}
          <Box sx={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap" }}>
            <Chip
              label={`${isHe ? "גובה" : "Height"}: ${height}cm`}
              size="small"
              sx={{ background: "rgba(192,211,202,0.08)", color: "#C0D3CA", fontSize: "0.75rem" }}
            />
            <Chip
              label={`${isHe ? "משקל" : "Weight"}: ${weight}kg`}
              size="small"
              sx={{ background: "rgba(192,211,202,0.08)", color: "#C0D3CA", fontSize: "0.75rem" }}
            />
            <Chip
              label={`BMI: ${bmi}`}
              size="small"
              sx={{ background: "rgba(192,211,202,0.08)", color: "#C0D3CA", fontSize: "0.75rem" }}
            />
            {selectedBodyType && (
              <Chip
                label={
                  BODY_TYPES.find((b) => b.key === selectedBodyType)?.[
                    isHe ? "labelHe" : "labelEn"
                  ]
                }
                size="small"
                sx={{ background: "rgba(192,211,202,0.08)", color: "#C0D3CA", fontSize: "0.75rem" }}
              />
            )}
            <Chip
              label={
                FIT_TYPES.find((f) => f.key === selectedFit)?.[
                  isHe ? "labelHe" : "labelEn"
                ]
              }
              size="small"
              sx={{ background: "rgba(192,211,202,0.08)", color: "#C0D3CA", fontSize: "0.75rem" }}
            />
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(192,211,202,0.1)", mb: 2 }} />

        {/* Primary measurements */}
        <Typography
          sx={{
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(192,211,202,0.4)",
            mb: 1.5,
          }}
        >
          {isHe ? "מידות עיקריות" : "Primary Measurements"}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr" },
            gap: 1,
            mb: 2.5,
          }}
        >
          {PRIMARY_KEYS.map((key) => {
            const label = MEASUREMENT_LABELS[key];
            if (!label || m[key] === undefined) return null;
            return (
              <Box
                key={key}
                sx={{
                  p: 1.5,
                  borderRadius: "12px",
                  background: "rgba(192,211,202,0.06)",
                  border: "1px solid rgba(192,211,202,0.12)",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontSize: "0.7rem", color: "rgba(192,211,202,0.45)", mb: 0.3 }}>
                  {isHe ? label.he : label.en}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: "#C0D3CA",
                    lineHeight: 1,
                  }}
                >
                  {m[key]}
                </Typography>
                <Typography sx={{ fontSize: "0.65rem", color: "rgba(192,211,202,0.35)" }}>cm</Typography>
              </Box>
            );
          })}
        </Box>

        {/* Secondary measurements */}
        <Typography
          sx={{
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(192,211,202,0.4)",
            mb: 1,
          }}
        >
          {isHe ? "מידות נוספות" : "Additional Measurements"}
        </Typography>
        {SECONDARY_KEYS.map((key) => {
          const label = MEASUREMENT_LABELS[key];
          if (!label || m[key] === undefined) return null;
          return (
            <MeasurementRow
              key={key}
              label={isHe ? label.he : label.en}
              value={m[key]}
              isHighlight={false}
            />
          );
        })}

        <Divider sx={{ borderColor: "rgba(192,211,202,0.1)", my: 2.5 }} />

        {/* Actions */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {user && (
            <Button
              fullWidth
              variant="contained"
              startIcon={saved ? <CheckCircleIcon /> : <SaveIcon />}
              onClick={handleSaveProfile}
              disabled={saving || saved}
              sx={{
                background: saved
                  ? "rgba(192,211,202,0.2)"
                  : "linear-gradient(135deg, #C0D3CA 0%, #8fb8a9 100%)",
                color: "#0a0a0a",
                fontWeight: 700,
                borderRadius: "12px",
                py: 1.4,
                fontSize: "0.9rem",
                "&:disabled": { opacity: 0.7 },
              }}
            >
              {saved
                ? isHe ? "✓ נשמר!" : "✓ Saved!"
                : saving
                ? isHe ? "שומר..." : "Saving..."
                : isHe ? "שמור כפרופיל מידות" : "Save as Size Profile"}
            </Button>
          )}

          <Button
            fullWidth
            variant="outlined"
            startIcon={<TuneIcon />}
            onClick={() => navigate("/sizes/measure")}
            sx={{
              borderColor: "rgba(192,211,202,0.3)",
              color: "rgba(192,211,202,0.8)",
              borderRadius: "12px",
              py: 1.4,
              fontSize: "0.85rem",
              "&:hover": {
                borderColor: "rgba(192,211,202,0.6)",
                background: "rgba(192,211,202,0.06)",
              },
            }}
          >
            {isHe ? "דייק עם מדידות אמיתיות" : "Refine with real measurements"}
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={() => setStep(0)}
            sx={{ color: "rgba(192,211,202,0.45)", fontSize: "0.8rem" }}
          >
            {isHe ? "← חשב מחדש" : "← Recalculate"}
          </Button>
        </Box>

        {/* Disclaimer */}
        <Typography
          sx={{
            mt: 2.5,
            fontSize: "0.72rem",
            color: "rgba(192,211,202,0.3)",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          {isHe
            ? `✦ מידות אלו הן הערכה אנתרופומטרית בדיוק של ~${accuracy}%. למידות מדויקות 100% השתמש בזרוע המדידות הידנית.`
            : `✦ These measurements are an anthropometric estimate with ~${accuracy}% accuracy. For 100% precision, use the manual measurement tool.`}
        </Typography>
      </Box>
    );
  };

  const canGoNext =
    step === 0
      ? height >= 140 && height <= 220 && weight >= 40 && weight <= 180
      : true; // body type and fit are optional / have defaults

  // ── layout ──

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 30%, #0f0f0f 70%, #0a0a0a 100%)",
        pt: { xs: 10, md: 12 },
        pb: 8,
        color: "#fff",
      }}
    >
      <Container maxWidth="sm">
        {/* Top navigation */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton
            onClick={handleBack}
            sx={{
              color: "rgba(192,211,202,0.6)",
              "&:hover": { color: "#C0D3CA", background: "rgba(192,211,202,0.08)" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flex: 1, mx: 2 }}>
            {step < 3 && (
              <StepLabel
                step={step + 1}
                total={TOTAL_STEPS}
                label={isHe ? "שלב" : "Step"}
              />
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              px: 1.5,
              py: 0.6,
              borderRadius: "20px",
              background: "rgba(192,211,202,0.06)",
              border: "1px solid rgba(192,211,202,0.15)",
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: "0.9rem", color: "#C0D3CA" }} />
            <Typography sx={{ fontSize: "0.72rem", color: "#C0D3CA", letterSpacing: "0.05em" }}>
              AI
            </Typography>
          </Box>
        </Box>

        {/* Card */}
        <Box
          sx={{
            background:
              "linear-gradient(135deg, rgba(20,20,20,0.92) 0%, rgba(30,30,30,0.96) 100%)",
            border: "1px solid rgba(192,211,202,0.12)",
            borderRadius: "24px",
            p: { xs: 3, md: 4 },
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            minHeight: 400,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {step === 0 && renderStep0()}
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderResults()}
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* Bottom CTA */}
        {step < 3 && (
          <Box sx={{ mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              disabled={!canGoNext}
              onClick={handleNext}
              sx={{
                background: "linear-gradient(135deg, #C0D3CA 0%, #8fb8a9 100%)",
                color: "#0a0a0a",
                fontWeight: 700,
                borderRadius: "14px",
                py: 1.6,
                fontSize: "1rem",
                letterSpacing: "0.05em",
                "&:disabled": { opacity: 0.35 },
                "&:hover": {
                  background: "linear-gradient(135deg, #d4e5de 0%, #a3cbbf 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 8px 24px rgba(192,211,202,0.3)",
                },
                transition: "all 0.25s ease",
              }}
            >
              {step === TOTAL_STEPS - 1
                ? isHe ? "✨ חשב את המידות שלי" : "✨ Calculate My Measurements"
                : isHe ? "הבא →" : "Next →"}
            </Button>

            {/* Skip body type step */}
            {step === 1 && (
              <Button
                fullWidth
                variant="text"
                onClick={handleNext}
                sx={{ mt: 1, color: "rgba(192,211,202,0.35)", fontSize: "0.8rem" }}
              >
                {isHe ? "דלג (ללא בחירת מבנה גוף)" : "Skip (without body type)"}
              </Button>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AIQuickSize;
