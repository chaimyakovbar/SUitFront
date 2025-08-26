import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";

const AccessibilityMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [invertedContrast, setInvertedContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);

  // Compose visual filters so options don't override each other
  useEffect(() => {
    const filters = [];
    if (invertedContrast) filters.push("invert(100%)");
    if (grayscale) filters.push("grayscale(100%)");
    const filterValue = filters.join(" ") || "none";
    document.documentElement.style.filter = filterValue;
  }, [invertedContrast, grayscale]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const adjustFontSize = (amount) => {
    const next = Math.max(10, Math.min(28, fontSize + amount));
    setFontSize(next);
    document.documentElement.style.fontSize = `${next}px`;
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.style.backgroundColor = highContrast
      ? "#ffffff"
      : "#000000";
    document.documentElement.style.color = highContrast ? "#000000" : "#ffffff";
  };

  const toggleInvertedContrast = () => {
    setInvertedContrast(!invertedContrast);
  };

  const toggleGrayscale = () => {
    setGrayscale(!grayscale);
  };

  const toggleHighlightLinks = () => {
    setHighlightLinks(!highlightLinks);
    document.querySelectorAll("a").forEach((link) => {
      link.style.textDecoration = highlightLinks ? "none" : "underline";
      link.style.color = highlightLinks ? "inherit" : "yellow";
    });
  };

  return (
    <MenuContainer>
      <MenuButton aria-label="Accessibility menu" onClick={toggleMenu}>
        <AccessibilityNewIcon fontSize="medium" />
      </MenuButton>
      {isMenuOpen && (
        <MenuOptions role="menu">
          <MenuOption role="menuitem" className="menu-heading">
            <span>גודל כתב</span>
            <div className="controls">
              <IconButton size="small" onClick={() => adjustFontSize(2)}>
                <AddIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => adjustFontSize(-2)}>
                <RemoveIcon fontSize="small" />
              </IconButton>
            </div>
          </MenuOption>
          <MenuOption role="menuitem" onClick={toggleHighContrast}>
            {highContrast ? "כבה ניגודיות גבוהה" : "הפעל ניגודיות גבוהה"}
          </MenuOption>
          <MenuOption role="menuitem" onClick={toggleInvertedContrast}>
            {invertedContrast ? "כבה ניגודיות הפוכה" : "הפעל ניגודיות הפוכה"}
          </MenuOption>
          <MenuOption role="menuitem" onClick={toggleGrayscale}>
            {grayscale ? "כבה גווני אפור" : "הפעל גווני אפור"}
          </MenuOption>
          <MenuOption role="menuitem" onClick={toggleHighlightLinks}>
            {highlightLinks ? "כבה הדגשת קישורים" : "הפעל הדגשת קישורים"}
          </MenuOption>
        </MenuOptions>
      )}
    </MenuContainer>
  );
};

export default AccessibilityMenu;

// Styled Components
const MenuContainer = styled.div`
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 1200;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const MenuButton = styled.button`
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  width: 56px;
  height: 56px;
  font-size: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.5);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const MenuOptions = styled.div`
  direction: rtl;
  margin-top: 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
  color: #ffffff;
  min-width: 260px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: menuSlideIn 180ms ease-out;

  @keyframes menuSlideIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MenuOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
  border-radius: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  &.menu-heading {
    cursor: default;
    font-weight: 600;
    letter-spacing: 0.2px;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  button.MuiIconButton-root {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    width: 32px;
    height: 32px;
  }
`;
