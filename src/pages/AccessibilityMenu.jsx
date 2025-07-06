import React, { useState } from "react";
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const adjustFontSize = (amount) => {
    setFontSize((prevSize) => prevSize + amount);
    document.body.style.fontSize = `${fontSize + amount}px`;
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.body.style.backgroundColor = highContrast ? "#ffffff" : "#000000";
    document.body.style.color = highContrast ? "#000000" : "#ffffff";
  };

  const toggleInvertedContrast = () => {
    setInvertedContrast(!invertedContrast);
    document.body.style.filter = invertedContrast ? "none" : "invert(100%)";
  };

  const toggleGrayscale = () => {
    setGrayscale(!grayscale);
    document.body.style.filter = grayscale ? "none" : "grayscale(100%)";
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
      <MenuButton onClick={toggleMenu}>
        <AccessibilityNewIcon style={{ color: "#ffffff" }} />
      </MenuButton>
      {isMenuOpen && (
        <MenuOptions>
          <MenuOption>
            <p>גודל כתב</p>
            <IconButton onClick={() => adjustFontSize(2)}>
              <AddIcon />
            </IconButton>
            <IconButton onClick={() => adjustFontSize(-2)}>
              <RemoveIcon />
            </IconButton>
          </MenuOption>
          <MenuOption onClick={toggleHighContrast}>
            {highContrast ? "כבה ניגודיות גבוהה" : "הפעל ניגודיות גבוהה"}
          </MenuOption>
          <MenuOption onClick={toggleInvertedContrast}>
            {invertedContrast ? "כבה ניגודיות הפוכה" : "הפעל ניגודיות הפוכה"}
          </MenuOption>
          <MenuOption onClick={toggleGrayscale}>
            {grayscale ? "כבה גווני אפור" : "הפעל גווני אפור"}
          </MenuOption>
          <MenuOption onClick={toggleHighlightLinks}>
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
  bottom: 80px;
  left: 20px;
  z-index: 1000;
`;

const MenuButton = styled.button`
  background-color: #192E44;
  color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1f3b5a;
  }
`;

const MenuOptions = styled.div`
  margin-top: 10px;
  background-color: #192E44;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  color: #ffffff;
  width: 250px;
`;

const MenuOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1f3b5a;
  }
`;
