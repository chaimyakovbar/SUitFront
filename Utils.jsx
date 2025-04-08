import { atom } from "jotai";

export const counterAtom = atom([
  { step1Validated: false },
  { step2Validated: false },
  { step3Validated: false },
]);

export const currentIndexAtom = atom(0);

export const currentColorAtom = atom(null);

export const currentKindAtom = atom(null);

export const selectedCollarAtom = atom(null);

export const selectedLapelTypeAtom = atom(null);

export const selectedPacketTypeAtom = atom(null);

export const selectedInsideTypeAtom = atom(null)

export const selectedButtonAtom = atom(null);

export const selectedPoshetAtom = atom(null);

export const selectedHolesButtonAtom = atom(null)

export const selectedHolesButtonUpAtom = atom(null)

export const openUserDialog = atom(false)

export const allSuitPartAtom = atom([])

export const userAtom = atom(null)




