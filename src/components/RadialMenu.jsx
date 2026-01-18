import React, { useState } from "react";
import "./RadialMenu.css";

/**
 * Generic radial menu for mobile.
 * Props:
 * - buttons: [{ label: string, action: () => void }]
 */
export default function RadialMenu({ buttons = [] }) {
  const [open, setOpen] = useState(false);

  if (!buttons.length) return null;

  return (
    <div className={`radial-container ${open ? "open" : ""}`}>
      <button
        className={`main-btn ${open ? "open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        ☰
      </button>

      {open && (
        <div className="center-menu">
          {buttons.map((btn, index) => {
            const angle = (360 / buttons.length) * index;
            const diagonalAngle = angle + 45; // פתיחה באלכסון במקום ישר למעלה/למטה/ימינה/שמאלה
            return (
              <div
                key={btn.label || index}
                className="radial-item"
                style={{
                  "--angle": `${diagonalAngle}deg`,
                }}
                onClick={() => {
                  setOpen(false);
                  if (btn.action) btn.action();
                }}
              >
                <span className="radial-item-inner">{btn.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
