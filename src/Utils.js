import { atom } from "jotai"

export const counterAtom = atom([
    { step1Validated: false },
    { step2Validated: false },
    { step3Validated: false },
]);


export const authUserAtom = atom(null);

export const authLoadingAtom = atom(true);

export const currentIndexAtom = atom(0);

export const currentColorAtom = atom('blackGrey');

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

// export const baseURLAtom = atom("https://suitback.onrender.com")

export const baseURLAtom = atom("http://localhost:3020")