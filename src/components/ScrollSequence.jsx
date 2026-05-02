import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@mui/material";

const TOTAL_FRAMES = 16;
const MOBILE_FRAMES = [1, 3, 5, 7, 9, 11, 13, 14, 15, 16];

const frameUrl = (n) =>
  `/scroll-frames/frame_${String(n).padStart(2, "0")}.webp`;

const CAPTIONS = [
  { frame: 1,  text: "THE FABRIC",    sub: "Sourced from the finest mills" },
  { frame: 4,  text: "THE CRAFT",     sub: "Every line drawn with intention" },
  { frame: 7,  text: "THE SHAPING",   sub: "Form follows the human body" },
  { frame: 10, text: "THE DETAILS",   sub: "Where mastery lives" },
  { frame: 13, text: "THE FINISHING", sub: "Nothing left to chance" },
  { frame: 16, text: "THE SUIT",      sub: "Made for you. Only you." },
];

function getCaption(frameNumber) {
  let active = CAPTIONS[0];
  for (const c of CAPTIONS) {
    if (frameNumber >= c.frame) active = c;
  }
  return active;
}

export default function ScrollSequence() {
  const containerRef  = useRef(null);
  const canvasRef     = useRef(null);
  const imagesRef     = useRef([]);
  const frameFloatRef = useRef(0);
  const prevIndexRef  = useRef(0);
  const rafRef        = useRef(null);

  const isMobile = useMediaQuery("(max-width:768px)");

  const [loaded,         setLoaded]         = useState(false);
  const [loadProgress,   setLoadProgress]   = useState(0);
  const [caption,        setCaption]        = useState(CAPTIONS[0]);
  const [captionVisible, setCaptionVisible] = useState(false);

  const frameList = isMobile
    ? MOBILE_FRAMES
    : Array.from({ length: TOTAL_FRAMES }, (_, i) => i + 1);

  // ── Draw helper ────────────────────────────────────────────────────────
  function drawFrame(index) {
    const canvas = canvasRef.current;
    const img    = imagesRef.current[index];
    if (!canvas || !img || !canvas.width || !canvas.height) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const scale = Math.max(width / img.width, height / img.height);
    const x = (width  - img.width  * scale) / 2;
    const y = (height - img.height * scale) / 2;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  }

  // ── Set canvas pixel dimensions on mount ──────────────────────────────
  useEffect(() => {
    const setSize = () => {
      const c = canvasRef.current;
      if (!c) return;
      c.width  = window.innerWidth;
      c.height = window.innerHeight;
      drawFrame(prevIndexRef.current);
    };
    setSize();
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, []); // eslint-disable-line

  // ── Preload images ─────────────────────────────────────────────────────
  useEffect(() => {
    let count = 0;
    const total = frameList.length;
    imagesRef.current  = new Array(total).fill(null);
    frameFloatRef.current = 0;
    prevIndexRef.current  = 0;

    frameList.forEach((n, i) => {
      const img = new Image();
      img.src = frameUrl(n);
      img.onload = () => {
        imagesRef.current[i] = img;
        if (i === 0) drawFrame(0); // show first frame as soon as it's ready
        count++;
        setLoadProgress(Math.round((count / total) * 100));
        if (count === total) setLoaded(true);
      };
      img.onerror = () => {
        count++;
        setLoadProgress(Math.round((count / total) * 100));
        if (count === total) setLoaded(true);
      };
    });
  }, [isMobile]); // eslint-disable-line

  // ── RAF loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;

    drawFrame(prevIndexRef.current);
    setTimeout(() => setCaptionVisible(true), 500);

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);

      const container = containerRef.current;
      if (!container) return;

      const rect       = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const scrolled  = Math.max(0, -rect.top);
      const progress  = Math.min(scrolled / scrollable, 1);
      const targetF   = progress * (frameList.length - 1);

      // Smooth lerp
      frameFloatRef.current += (targetF - frameFloatRef.current) * 0.14;
      const newIndex = Math.min(
        Math.round(frameFloatRef.current),
        frameList.length - 1
      );

      if (newIndex !== prevIndexRef.current) {
        drawFrame(newIndex);
        prevIndexRef.current = newIndex;

        const newCap = getCaption(frameList[newIndex]);
        setCaption((prev) => {
          if (prev.text !== newCap.text) {
            setCaptionVisible(false);
            setTimeout(() => setCaptionVisible(true), 200);
          }
          return newCap;
        });
      }

      if (progress > 0.02 && progress < 0.98) {
        setCaptionVisible((v) => (v ? v : true));
      } else {
        setCaptionVisible(false);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loaded, frameList]); // eslint-disable-line

  const scrollHeight = isMobile ? "220vh" : "380vh";

  return (
    <div ref={containerRef} style={{ height: scrollHeight, position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#0a0a0a",
        }}
      >
        {/*
          Canvas is ALWAYS opacity:1 — React never touches its opacity.
          The loading overlay sits on top and fades out when done.
        */}
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />

        {/* Loading overlay — covers canvas, fades out when loaded */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            backgroundColor: "#0a0a0a",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            opacity: loaded ? 0 : 1,
            transition: "opacity 0.9s ease",
            pointerEvents: loaded ? "none" : "all",
          }}
        >
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(192,211,202,0.6)",
              margin: 0,
            }}
          >
            Loading — {loadProgress}%
          </p>
          <div
            style={{
              width: "160px",
              height: "1px",
              backgroundColor: "rgba(255,255,255,0.1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${loadProgress}%`,
                backgroundColor: "#C0D3CA",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* Soft vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.28) 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Bottom fade to page background */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "18%",
            background: "linear-gradient(to top, #0a0a0a 0%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Caption */}
        <div
          style={{
            position: "absolute",
            bottom: "13%",
            left: "50%",
            transform: `translateX(-50%) translateY(${captionVisible ? "0px" : "14px"})`,
            textAlign: "center",
            opacity: captionVisible ? 1 : 0,
            transition: "opacity 0.45s ease, transform 0.45s ease",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: isMobile ? "2rem" : "3.4rem",
              fontWeight: 300,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#fff",
              margin: 0,
              lineHeight: 1,
              textShadow: "0 2px 24px rgba(0,0,0,0.6)",
            }}
          >
            {caption.text}
          </p>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: isMobile ? "0.6rem" : "0.7rem",
              fontWeight: 400,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(192,211,202,0.8)",
              margin: "0.8rem 0 0",
            }}
          >
            {caption.sub}
          </p>
        </div>

        {/* Progress dots */}
        {loaded && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: isMobile ? "1.2rem" : "2.5rem",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.45rem",
              zIndex: 2,
            }}
          >
            {frameList.map((_, i) => (
              <div
                key={i}
                style={{
                  width: "2px",
                  height: i === prevIndexRef.current ? "20px" : "6px",
                  backgroundColor:
                    i === prevIndexRef.current
                      ? "#C0D3CA"
                      : "rgba(255,255,255,0.2)",
                  borderRadius: "1px",
                  transition: "height 0.3s ease, background-color 0.3s ease",
                }}
              />
            ))}
          </div>
        )}

        {/* Scroll hint */}
        {loaded && (
          <div
            style={{
              position: "absolute",
              bottom: "4%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              opacity: captionVisible && prevIndexRef.current === 0 ? 0.5 : 0,
              transition: "opacity 0.5s ease",
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.55rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#fff",
                margin: 0,
              }}
            >
              Scroll
            </p>
            <div
              style={{
                width: "1px",
                height: "30px",
                backgroundColor: "rgba(255,255,255,0.4)",
                animation: "scrollPulse 1.5s ease-in-out infinite",
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.6); transform-origin: top; }
          50%       { opacity: 1;   transform: scaleY(1);   transform-origin: top; }
        }
      `}</style>
    </div>
  );
}
