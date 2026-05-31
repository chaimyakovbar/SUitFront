import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import QuickFitMannequin from "../components/QuickFitMannequin";
import { quickFitPoints, pointIdToInputKey } from "../config/mannequinPoints";
import { estimateFromMinimalInput } from "../utils/measurementEstimator";
import { useLanguage } from "../context/LanguageContext";

const requiredKeys = ["heightCm", "weightKg", "chestCm", "waistCm", "hipCm"];

const QuickFit = () => {
  const { t, language } = useLanguage();
  const [values, setValues] = useState({});
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const inputRefs = useRef({});
  const [quickFitEnabled, setQuickFitEnabled] = useState(true);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handlePointSelect = (inputKey) => {
    const ref = inputRefs.current[inputKey];
    if (ref && ref.focus) {
      ref.focus();
      ref.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleEstimate = () => {
    const newErrors = {};
    requiredKeys.forEach((key) => {
      const raw = values[key];
      if (raw === undefined || raw === null || raw === "") {
        newErrors[key] =
          language === "he"
            ? "שדה חובה"
            : "Required field";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const numericInput = {};
    Object.keys(values).forEach((key) => {
      const num = Number(values[key]);
      numericInput[key] = Number.isNaN(num) ? undefined : num;
    });

    const estimation = estimateFromMinimalInput(numericInput);
    setResult(estimation);
  };

  const minimalInputs = useMemo(
    () =>
      quickFitPoints.map((point) => ({
        id: point.id,
        inputKey: point.inputKey,
        required: point.required,
        label:
          language === "he"
            ? `${point.labelHe} (${point.labelEn})`
            : `${point.labelEn} (${point.labelHe})`,
        placeholder:
          language === "he"
            ? "ס״מ / ק\"ג"
            : "cm / kg",
      })),
    [language]
  );

  const measurementsList = useMemo(() => {
    if (!result || !result.measurements) return [];
    const m = result.measurements;
    return [
      { key: "chest", labelEn: "Chest", labelHe: "חזה" },
      { key: "waist", labelEn: "Waist", labelHe: "מותן" },
      { key: "hip", labelEn: "Hips", labelHe: "אגן / ירכיים" },
      { key: "jacketLength", labelEn: "Jacket length", labelHe: "אורך ז׳קט" },
      { key: "shoulderWidth", labelEn: "Shoulder width", labelHe: "רוחב כתפיים" },
      { key: "backLength", labelEn: "Back length", labelHe: "אורך גב" },
      { key: "sleeveLength", labelEn: "Sleeve length", labelHe: "אורך שרוול" },
      { key: "biceps", labelEn: "Biceps", labelHe: "זרוע עליונה" },
      { key: "wrist", labelEn: "Wrist", labelHe: "שורש כף יד" },
      { key: "inseam", labelEn: "Inseam", labelHe: "אורך פנים רגל" },
      { key: "rise", labelEn: "Rise", labelHe: "גובה מפשעה" },
      { key: "thigh", labelEn: "Thigh", labelHe: "ירך" },
      { key: "knee", labelEn: "Knee", labelHe: "ברך" },
      { key: "calf", labelEn: "Calf", labelHe: "שוק" },
      { key: "ankle", labelEn: "Ankle", labelHe: "קרסול" },
      {
        key: "frontChestToWaist",
        labelEn: "Front chest to waist",
        labelHe: "מרחק חזה קדמי למותן",
      },
    ].map((item) => ({
      ...item,
      value: m[item.key],
    }));
  }, [result, language]);

  const diagnostics = result?.diagnostics;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #050505 0%, #101010 40%, #050505 100%)",
        pt: { xs: 12, md: 16 },
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Typography
              variant="h4"
              sx={{
                color: "#C0D3CA",
                mb: 2,
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              {language === "he"
                ? "Quick Fit – מדידות מקוצרות"
                : "Quick Fit – Minimal Measurements"}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Button
                size="small"
                variant={quickFitEnabled ? "contained" : "outlined"}
                color="secondary"
                onClick={() => setQuickFitEnabled((prev) => !prev)}
                sx={{ borderRadius: 999 }}
              >
                {language === "he"
                  ? quickFitEnabled
                    ? "מצב Quick Fit פעיל (נקודות מדידה)"
                    : "מצב רגיל – רק בובה תלת־ממדית"
                  : quickFitEnabled
                  ? "Quick Fit ON (measurement points)"
                  : "Regular mode – 3D mannequin only"}
              </Button>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(192, 211, 202, 0.8)",
                mb: 3,
              }}
            >
              {language === "he"
                ? "מלא רק כמה נקודות בסיסיות, ונחשב בשבילך את כל 16 המדידות לחליפה מותאמת."
                : "Fill in just a few basic points and we will estimate all 16 suit measurements for you."}
            </Typography>

            <QuickFitMannequin
              values={values}
              onPointSelect={handlePointSelect}
              showPoints={quickFitEnabled}
            />
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: 4,
                background:
                  "linear-gradient(145deg, rgba(15,15,15,0.96), rgba(5,5,5,0.98))",
                border: "1px solid rgba(192,211,202,0.18)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#C0D3CA", fontWeight: 600 }}
              >
                {language === "he"
                  ? "מידות בסיס (חובה / אופציונלי)"
                  : "Basic Inputs (Required / Optional)"}
              </Typography>

              <Grid container spacing={2}>
                {minimalInputs.map((field) => (
                  <Grid item xs={12} sm={6} key={field.inputKey}>
                    <TextField
                      fullWidth
                      type="number"
                      inputRef={(el) => {
                        inputRefs.current[field.inputKey] = el;
                      }}
                      label={
                        field.required
                          ? `${field.label} *`
                          : `${field.label}`
                      }
                      value={values[field.inputKey] ?? ""}
                      onChange={(e) =>
                        handleChange(field.inputKey, e.target.value)
                      }
                      variant="outlined"
                      size="small"
                      error={Boolean(errors[field.inputKey])}
                      helperText={errors[field.inputKey] || field.placeholder}
                      InputLabelProps={{ sx: { direction: "rtl" } }}
                    />
                  </Grid>
                ))}
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 3,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEstimate}
                  sx={{ borderRadius: 999, px: 4 }}
                >
                  {language === "he"
                    ? "חשב את כל המדידות"
                    : "Estimate All Measurements"}
                </Button>
              </Box>

              {result && !result.error && (
                <>
                  <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.08)" }} />

                  <Typography
                    variant="h6"
                    sx={{ mb: 2, color: "#C0D3CA", fontWeight: 600 }}
                  >
                    {language === "he"
                      ? "16 מדידות מחושבות"
                      : "Calculated 16 Measurements"}
                  </Typography>

                  <Grid container spacing={1.5}>
                    {measurementsList.map((m) => (
                      <Grid item xs={12} sm={6} key={m.key}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            px: 1,
                            py: 0.5,
                            borderRadius: 2,
                            backgroundColor: "rgba(255,255,255,0.03)",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(192,211,202,0.9)" }}
                          >
                            {language === "he"
                              ? `${m.labelHe} (${m.labelEn})`
                              : `${m.labelEn} (${m.labelHe})`}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "#C0D3CA", fontWeight: 600 }}
                          >
                            {m.value != null ? `${m.value} cm` : "-"}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  {diagnostics && (
                    <Box sx={{ mt: 3 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "rgba(192,211,202,0.8)", mb: 0.5 }}
                      >
                        {language === "he"
                          ? `BMI: ${diagnostics.BMI} | סוג גוף: ${diagnostics.bodyType}`
                          : `BMI: ${diagnostics.BMI} | Body type: ${diagnostics.bodyType}`}
                      </Typography>
                    </Box>
                  )}
                </>
              )}

              {result && result.error && (
                <Box sx={{ mt: 2 }}>
                  <Typography color="error">{result.error}</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default QuickFit;


