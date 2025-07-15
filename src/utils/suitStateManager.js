// Utility functions to manage suit state restoration from database data

/**
 * Restores all suit customization atoms from database suit data
 * @param {Object} suitData - The suit data from database
 * @param {Object} setters - Object containing all atom setters
 */
export const restoreSuitStateFromData = (suitData, setters) => {
    if (!suitData || !setters) {
        console.warn('Missing suit data or setters for state restoration');
        return;
    }

    console.log('🔄 Restoring suit state from data:', suitData);
    console.log('Available setters:', Object.keys(setters));

    // Basic suit properties
    if (suitData.color && typeof setters.setCurrColor === 'function') setters.setCurrColor(suitData.color);
    if (suitData.kind && typeof setters.setSelectedKind === 'function') setters.setSelectedKind(suitData.kind);
    if (suitData.lapelKind && typeof setters.setSelectedCollar === 'function') setters.setSelectedCollar(suitData.lapelKind);
    if (suitData.lapelType && typeof setters.setSelectedLapelType === 'function') setters.setSelectedLapelType(suitData.lapelType);
    if (suitData.packetType && typeof setters.setSelectedPacketType === 'function') setters.setSelectedPacketType(suitData.packetType);
    if (suitData.packetKind && typeof setters.setSelectedKindType === 'function') setters.setSelectedKindType(suitData.packetKind);

    // Button and color customizations
    if (suitData.buttonColor && typeof setters.setSelectedButton === 'function') setters.setSelectedButton(suitData.buttonColor);
    if (suitData.poshetColor && typeof setters.setSelectedPoshet === 'function') setters.setSelectedPoshet(suitData.poshetColor);
    if (suitData.holeButtonColor && typeof setters.setSelectedHolesButton === 'function') setters.setSelectedHolesButton(suitData.holeButtonColor);
    if (suitData.holeButtonUpColor && typeof setters.setSelectedHolesButtonUp === 'function') setters.setSelectedHolesButtonUp(suitData.holeButtonUpColor);
    if (suitData.insideColor && typeof setters.setSelectedInsideType === 'function') setters.setSelectedInsideType(suitData.insideColor);

    // Pants customization (NEW - these were missing before)
    if (suitData.pantsColor !== undefined && typeof setters.setSelectedPantsColor === 'function') setters.setSelectedPantsColor(suitData.pantsColor);
    if (suitData.pantsLines !== undefined && typeof setters.setSelectedPantsLines === 'function') setters.setSelectedPantsLines(suitData.pantsLines);
    if (suitData.pantsHoleButton !== undefined && typeof setters.setSelectedPantsHoleButton === 'function') setters.setSelectedPantsHoleButton(suitData.pantsHoleButton);
    if (suitData.pantsHem !== undefined && typeof setters.setSelectedPantsHem === 'function') setters.setSelectedPantsHem(suitData.pantsHem);

    // Sleeve buttons (NEW - this was missing before)
    if (suitData.sleeveButtons !== undefined && typeof setters.setSelectedSleeveButtons === 'function') setters.setSelectedSleeveButtons(suitData.sleeveButtons);

    // Text inside customization (NEW - these were missing before)
    if (suitData.textInsideText !== undefined && typeof setters.setTextInsideText === 'function') setters.setTextInsideText(suitData.textInsideText);
    if (suitData.textInsideFont !== undefined && typeof setters.setTextInsideFont === 'function') setters.setTextInsideFont(suitData.textInsideFont);
    if (suitData.textInsideColor !== undefined && typeof setters.setTextInsideColor === 'function') setters.setTextInsideColor(suitData.textInsideColor);

    console.log('✅ Suit state restored successfully');
};

/**
 * Resets all suit customization atoms to default values
 * @param {Object} setters - Object containing all atom setters
 */
export const resetSuitState = (setters) => {
    if (!setters) {
        console.warn('Missing setters for state reset');
        return;
    }

    console.log('🔄 Resetting suit state to defaults');
    console.log('Available setters:', Object.keys(setters));

    // Reset basic suit properties
    if (typeof setters.setCurrColor === 'function') {
        setters.setCurrColor('blackGrey');
    } else {
        console.error('setCurrColor is not a function:', setters.setCurrColor);
    }
    if (typeof setters.setSelectedKind === 'function') {
        setters.setSelectedKind('kind1');
    } else {
        console.error('setSelectedKind is not a function:', setters.setSelectedKind);
    }
    if (typeof setters.setSelectedCollar === 'function') {
        setters.setSelectedCollar('collarTight');
    } else {
        console.error('setSelectedCollar is not a function:', setters.setSelectedCollar);
    }
    if (typeof setters.setSelectedLapelType === 'function') {
        setters.setSelectedLapelType('Standard');
    } else {
        console.error('setSelectedLapelType is not a function:', setters.setSelectedLapelType);
    }
    if (typeof setters.setSelectedPacketType === 'function') {
        setters.setSelectedPacketType('packet1');
    } else {
        console.error('setSelectedPacketType is not a function:', setters.setSelectedPacketType);
    }

    // Reset button and color customizations
    if (typeof setters.setSelectedButton === 'function') {
        setters.setSelectedButton(null);
    } else {
        console.error('setSelectedButton is not a function:', setters.setSelectedButton);
    }
    if (typeof setters.setSelectedPoshet === 'function') {
        setters.setSelectedPoshet(null);
    } else {
        console.error('setSelectedPoshet is not a function:', setters.setSelectedPoshet);
    }
    if (typeof setters.setSelectedHolesButton === 'function') {
        setters.setSelectedHolesButton(null);
    } else {
        console.error('setSelectedHolesButton is not a function:', setters.setSelectedHolesButton);
    }
    if (typeof setters.setSelectedHolesButtonUp === 'function') {
        setters.setSelectedHolesButtonUp(null);
    } else {
        console.error('setSelectedHolesButtonUp is not a function:', setters.setSelectedHolesButtonUp);
    }
    if (typeof setters.setSelectedInsideType === 'function') {
        setters.setSelectedInsideType(null);
    } else {
        console.error('setSelectedInsideType is not a function:', setters.setSelectedInsideType);
    }

    // Reset pants customization
    if (typeof setters.setSelectedPantsColor === 'function') {
        setters.setSelectedPantsColor('');
    } else {
        console.error('setSelectedPantsColor is not a function:', setters.setSelectedPantsColor);
    }
    if (typeof setters.setSelectedPantsLines === 'function') {
        setters.setSelectedPantsLines('none');
    } else {
        console.error('setSelectedPantsLines is not a function:', setters.setSelectedPantsLines);
    }
    if (typeof setters.setSelectedPantsHoleButton === 'function') {
        setters.setSelectedPantsHoleButton('Regular');
    } else {
        console.error('setSelectedPantsHoleButton is not a function:', setters.setSelectedPantsHoleButton);
    }
    if (typeof setters.setSelectedPantsHem === 'function') {
        setters.setSelectedPantsHem('none');
    } else {
        console.error('setSelectedPantsHem is not a function:', setters.setSelectedPantsHem);
    }

    // Reset sleeve buttons
    if (typeof setters.setSelectedSleeveButtons === 'function') {
        setters.setSelectedSleeveButtons('none');
    } else {
        console.error('setSelectedSleeveButtons is not a function:', setters.setSelectedSleeveButtons);
    }

    // Reset text inside customization
    if (typeof setters.setTextInsideText === 'function') {
        setters.setTextInsideText('');
    } else {
        console.error('setTextInsideText is not a function:', setters.setTextInsideText);
    }
    if (typeof setters.setTextInsideFont === 'function') {
        setters.setTextInsideFont('Arial');
    } else {
        console.error('setTextInsideFont is not a function:', setters.setTextInsideFont);
    }
    if (typeof setters.setTextInsideColor === 'function') {
        setters.setTextInsideColor('#ffffff');
    } else {
        console.error('setTextInsideColor is not a function:', setters.setTextInsideColor);
    }

    console.log('✅ Suit state reset successfully');
};

/**
 * Validates that all required suit data is present
 * @param {Object} suitData - The suit data to validate
 * @returns {Object} - Validation result with isValid boolean and missing fields array
 */
export const validateSuitData = (suitData) => {
    if (!suitData) {
        return { isValid: false, missingFields: ['suitData'], message: 'No suit data provided' };
    }

    const requiredFields = ['color', 'kind', 'lapelKind', 'lapelType', 'packetType'];
    const missingFields = requiredFields.filter(field => !suitData[field]);

    const isValid = missingFields.length === 0;
    const message = isValid
        ? 'Suit data is valid'
        : `Missing required fields: ${missingFields.join(', ')}`;

    return { isValid, missingFields, message };
};

/**
 * Creates a complete suit object with all customization data for database storage
 * @param {Object} atoms - Object containing all atom values
 * @returns {Object} - Complete suit object ready for database storage
 */
export const createCompleteSuitObject = (atoms) => {
    const {
        currentColor,
        selectedKind,
        selectedCollar,
        selectedLapelType,
        selectedPacketType,
        selectedKindType, // Add this for packet kind
        selectedButton,
        selectedPoshet,
        selectedHolesButton,
        selectedHolesButtonUp,
        selectedInsideType,
        selectedPantsColor,
        selectedPantsLines,
        selectedPantsHoleButton,
        selectedPantsHem,
        selectedSleeveButtons,
        textInsideText,
        textInsideFont,
        textInsideColor,
        priceAllSuit,
        topCollarColor, // <-- add this line
    } = atoms;

    const bottomPart = selectedKind === "kind3" || selectedKind === "kind4" ? "bottomKind3" : "bottom";
    const insideColor = selectedInsideType || currentColor;

    return {
        kind: selectedKind || null,
        colar: currentColor,
        sleeves: currentColor,
        insideUp: currentColor,
        packetUp: currentColor,
        bottomPart: bottomPart,
        color: currentColor || null,
        lapelType: selectedLapelType || null,
        lapelKind: selectedCollar || null,
        packetType: selectedPacketType || null,
        packetKind: selectedKindType || null, // Add packet kind
        totalPrice: priceAllSuit,
        buttonColor: selectedButton || null,
        insideColor: insideColor || currentColor || null,
        poshetColor: selectedPoshet || null,
        holeButtonColor: selectedHolesButton || null,
        holeButtonUpColor: selectedHolesButtonUp || null,
        // Pants customization data
        pantsColor: selectedPantsColor || null,
        pantsLines: selectedPantsLines || null,
        pantsHoleButton: selectedPantsHoleButton || null,
        pantsHem: selectedPantsHem || null,
        // Sleeve buttons data
        sleeveButtons: selectedSleeveButtons || null,
        // Text inside data
        textInsideText: textInsideText || null,
        textInsideFont: textInsideFont || null,
        textInsideColor: textInsideColor || null,
        // Top collar color
        topCollarColor: topCollarColor || null,
    };
}; 