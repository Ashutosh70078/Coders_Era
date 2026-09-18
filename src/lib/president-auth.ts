/**
 * Official Admin Gate Credentials & Auth Policy
 * Noida Institute of Engineering & Technology (NIET)
 * Coder's Era Student Community
 */
export const ADMIN_GATE_CREDENTIALS = {
  email: "admin@niet.co.in",
  communityName: "Coder's Era",
  college: "Noida Institute of Engineering & Technology (NIET)",
  campusSecurityCode: "133",
  primaryPasscode: "coders2026",
  allowedPasscodes: ["coders2026", "admin", "admin133", "NIET@CE2026", "133"],
  role: "Admin Gate Officer, Coder's Era",
};

export function verifyAdminPasscode(input: string): boolean {
  if (!input) return false;
  const clean = input.trim().toLowerCase();
  return ADMIN_GATE_CREDENTIALS.allowedPasscodes
    .map((p) => p.toLowerCase())
    .includes(clean);
}

// Backward compatibility alias
export const PRESIDENT_CREDENTIALS = ADMIN_GATE_CREDENTIALS;
export const verifyPresidentPasscode = verifyAdminPasscode;

