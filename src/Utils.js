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

// New pants5 model atoms (logic only, no UI changes)
// Kind: regularBase | longRegular | longWide | wide | MiddleWide
export const selectedPantsKindAtom = atom('regularBase');

// Button within kind; values per rules (or 'none')
export const selectedPantsButtonKindAtom = atom('none');

// Loops within kind; values: none | loop | twoLoop | wideOneIoop | wideTwoLoop | wideMiddleLoop | wideMiddleTowLoop
export const selectedPantsLoopsAtom = atom('none');

// Iron within kind; values: none | regularIron | oneIron | oneIronTwoButton | wideIron
export const selectedPantsIronAtom = atom('none');

// TextInside functionality
export const textInsideTextAtom = atom('chb'); // Free text for TextInside
export const textInsideFontAtom = atom('script'); // Font family for TextInside
export const textInsideColorAtom = atom('#ffffff'); // Text color for TextInside
export const showTextInsideAtom = atom(false); // Whether to show TextInside modal

// Sleeve buttons selection
export const selectedSleeveButtonsAtom = atom('four'); // none, tree, four, five

export const selectedTopCollarColorAtom = atom('black');

export const selectedBackSuitCutAtom = atom('oneCut'); // oneCut, twoCut

export const selectedTopCollarTextAtom = atom('chb');           // free text on collar
export const selectedTopCollarTextColorAtom = atom('#ffffff'); // text color on collar

// Pants pockets atoms
export const selectedPantsFrontPocketAtom = atom('regular'); // regular, jeans
export const selectedPantsBackPocketAtom = atom('none');     // none, backPocket

// Suit stitches atom
export const selectedSuitStitchesAtom = atom('none'); // none, match, white, contrast