import type { SelectOption } from "./types";

export const NIGERIAN_STATES: SelectOption[] = [
  { value: "lagos", label: "Lagos" },
  { value: "abuja", label: "Abuja (FCT)" },
  { value: "rivers", label: "Rivers" },
  { value: "kano", label: "Kano" },
  { value: "oyo", label: "Oyo" },
  { value: "delta", label: "Delta" },
  { value: "anambra", label: "Anambra" },
  { value: "kaduna", label: "Kaduna" },
  { value: "enugu", label: "Enugu" },
  { value: "edo", label: "Edo" },
];

export const ID_TYPES: SelectOption[] = [
  { value: "national_id", label: "National ID Card" },
  { value: "drivers_license", label: "Driver's Licence" },
  { value: "passport", label: "International Passport" },
  { value: "voters_card", label: "Voter's Card" },
];
