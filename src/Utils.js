import { atom } from "jotai"

export const counterAtom = atom([
    { step1Validated: false },
    { step2Validated: false },
    { step3Validated: false },
]);


export const authUserAtom = atom(null);

export const authLoadingAtom = atom(true);

export const currentIndexAtom = atom(0);

export const currentColorAtom = atom('greyLight');

export const currentKindAtom = atom('kind1');

export const selectedCollarAtom = atom('collarTight');

export const selectedLapelTypeAtom = atom('Standard');

export const selectedPacketTypeAtom = atom('packet1');

export const selectedKindTypeAtom = atom('packetBottom');

export const selectedInsideTypeAtom = atom(null)

export const selectedButtonAtom = atom(null);

export const selectedPoshetAtom = atom(null);

export const selectedHolesButtonAtom = atom(null)

export const selectedHolesButtonUpAtom = atom(null)

export const openUserDialog = atom(false)

export const allSuitPartAtom = atom([])

export const priceAllSuitAtom = atom(0)



// Pants customization atoms
export const selectedPantsColorAtom = atom(''); // Empty = use suit color
export const selectedPantsLinesAtom = atom('none'); // none, OneLinesInTheTop, twoLinesInTheTop
export const selectedPantsHoleButtonAtom = atom('Regular'); // Regular, behindLeftSide, behindRegular, LeftSide
export const selectedPantsHemAtom = atom('none'); // none, Hem

// TextInside functionality
export const textInsideTextAtom = atom(''); // Free text for TextInside
export const textInsideFontAtom = atom('Arial'); // Font family for TextInside
export const textInsideColorAtom = atom('#ffffff'); // Text color for TextInside
export const showTextInsideAtom = atom(false); // Whether to show TextInside modal

// Sleeve buttons selection
export const selectedSleeveButtonsAtom = atom('none'); // none, tree, four, five

export const selectedTopCollarColorAtom = atom('black');