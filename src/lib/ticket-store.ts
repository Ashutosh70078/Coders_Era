import { StudentTicket, VerificationResult, AdminStats } from "./types";
import { generateUniqueTicketId, extractSuffix } from "./ticket-generator";

const STORAGE_KEY = "coders_era_registered_passes_clean_v3";
const LEGACY_KEYS = ["coders_era_registered_passes_v1", "coders_era_virtual_passes_live_v2"];
const EVENT_NAME = "coders_era_ticket_state_change";

/**
 * Retrieves genuine registered student tickets from localStorage.
 * STRICT POLICY: ZERO mock data. Starts completely empty until students register.
 */
export function getStoredTickets(): StudentTicket[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    // Clean up any legacy test keys if found
    for (const lk of LEGACY_KEYS) {
      if (window.localStorage.getItem(lk)) {
        window.localStorage.removeItem(lk);
      }
    }
    const item = window.localStorage.getItem(STORAGE_KEY);
    if (!item) {
      return [];
    }
    const parsed = JSON.parse(item);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error("Error reading tickets from storage:", err);
    return [];
  }
}

export function saveTickets(tickets: StudentTicket[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: tickets }));
  } catch (err) {
    console.error("Error writing tickets to storage:", err);
  }
}

export function subscribeToTicketChanges(callback: (tickets: StudentTicket[]) => void): () => void {
  if (typeof window === "undefined") return () => {};
  
  const handleCustomEvent = (e: Event) => {
    const custom = e as CustomEvent<StudentTicket[]>;
    callback(custom.detail || getStoredTickets());
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(getStoredTickets());
    }
  };

  window.addEventListener(EVENT_NAME, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(EVENT_NAME, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}

/**
 * Universal Search & Lookup supporting:
 * 1. Full Ticket ID (e.g. CE-26-A9F2-0481)
 * 2. Scalable Suffix (e.g. 0481, 481, 1054)
 * 3. AKTU Roll Number (e.g. 2201330100012)
 * 4. Team Name
 * 5. Student Name
 */
export function lookupTicket(rawQuery: string): VerificationResult {
  const query = rawQuery.trim().toUpperCase();
  if (!query) {
    return { found: false, error: "Please enter a Ticket ID, Suffix, Roll Number, or Team Name." };
  }

  const tickets = getStoredTickets();

  // 1. Direct Full ID Match
  const exactId = tickets.find((t) => t.ticketId.toUpperCase() === query);
  if (exactId) {
    return { found: true, ticket: exactId };
  }

  // 2. AKTU Roll Number Match (100% unique per student)
  const rollMatch = tickets.find((t) => t.rollNumber && t.rollNumber.trim() === rawQuery.trim());
  if (rollMatch) {
    return { found: true, ticket: rollMatch };
  }

  // 3. Suffix Match
  const extracted = extractSuffix(query);
  const matchesBySuffix = tickets.filter((t) => {
    const s = t.suffix.toUpperCase();
    const id = t.ticketId.toUpperCase();
    const sNorm = s.replace(/^0+/, "");
    const qNorm = query.replace(/^0+/, "");
    return (
      s === query ||
      (sNorm && sNorm === qNorm) ||
      (extracted && s === extracted) ||
      id.endsWith(`-${query}`) ||
      id.endsWith(query)
    );
  });

  if (matchesBySuffix.length === 1) {
    return { found: true, ticket: matchesBySuffix[0] };
  }

  if (matchesBySuffix.length > 1) {
    return { found: true, multipleMatches: matchesBySuffix };
  }

  // 4. Team Name or Student Name Match
  const teamOrNameMatches = tickets.filter((t) => {
    const team = t.teamName.toUpperCase();
    const name = t.fullName.toUpperCase();
    return team === query || name === query;
  });

  if (teamOrNameMatches.length === 1) {
    return { found: true, ticket: teamOrNameMatches[0] };
  }
  if (teamOrNameMatches.length > 1) {
    return { found: true, multipleMatches: teamOrNameMatches };
  }

  // 5. Partial Match fallback
  const partialMatches = tickets.filter((t) => {
    const id = t.ticketId.toUpperCase();
    const name = t.fullName.toUpperCase();
    const team = t.teamName.toUpperCase();
    return id.includes(query) || name.includes(query) || team.includes(query);
  });

  if (partialMatches.length === 1) {
    return { found: true, ticket: partialMatches[0] };
  }
  if (partialMatches.length > 1) {
    return { found: true, multipleMatches: partialMatches };
  }

  return { 
    found: false, 
    error: `No registered pass found for "${rawQuery}". Verify spelling or register at /register.` 
  };
}

/**
 * Mark a ticket as CLAIMED at the Gate / On-the-spot desk.
 * Strict Single-Use Policy: Idempotent and logs exact timestamp.
 */
export function claimTicket(ticketId: string, deskIdentifier: string = "Gate Check-In Desk"): VerificationResult {
  const tickets = getStoredTickets();
  const index = tickets.findIndex((t) => t.ticketId.toUpperCase() === ticketId.trim().toUpperCase());

  if (index === -1) {
    return { found: false, error: "Ticket not found in system registry." };
  }

  const existing = tickets[index];

  // If already claimed, reject
  if (existing.status === "CLAIMED") {
    const errorMsg = `Security Alert: Pass was ALREADY CLAIMED at ${existing.claimedAt ? new Date(existing.claimedAt).toLocaleTimeString() : "earlier"} by ${existing.claimedBy || "Staff Desk"}.`;
    return {
      found: true,
      success: false,
      ticket: existing,
      alreadyClaimed: true,
      message: errorMsg,
      error: errorMsg,
    };
  }

  // Update status
  const updatedTicket: StudentTicket = {
    ...existing,
    status: "CLAIMED",
    claimedAt: new Date().toISOString(),
    claimedBy: deskIdentifier,
  };

  tickets[index] = updatedTicket;
  saveTickets(tickets);

  return {
    found: true,
    success: true,
    ticket: updatedTicket,
    alreadyClaimed: false,
    message: "Ticket Successfully Admitted & Verified!",
  };
}

/**
 * Register a new genuine student ticket into the store.
 */
export function registerStudentTicket(data: Omit<StudentTicket, "ticketId" | "suffix" | "status" | "claimedAt" | "registeredAt">): StudentTicket {
  const tickets = getStoredTickets();
  
  // Prevent duplicate registration for the same AKTU Roll Number
  if (data.rollNumber) {
    const existing = tickets.find((t) => t.rollNumber && t.rollNumber.trim() === data.rollNumber.trim());
    if (existing) {
      throw new Error(`A pass has already been generated for AKTU Roll Number ${data.rollNumber}. Pass ID: ${existing.ticketId}`);
    }
  }

  // Prevent duplicate registration for the same Email
  const existingEmail = tickets.find((t) => t.email.toLowerCase().trim() === data.email.toLowerCase().trim());
  if (existingEmail) {
    throw new Error(`A pass has already been generated for ${data.email}. Pass ID: ${existingEmail.ticketId}`);
  }

  // Generate unique collision-free ID and scalable suffix
  const { ticketId, suffix } = generateUniqueTicketId(tickets);

  const newTicket: StudentTicket = {
    ...data,
    ticketId,
    suffix,
    status: "UNUSED",
    claimedAt: null,
    registeredAt: new Date().toISOString(),
  };

  tickets.unshift(newTicket);
  saveTickets(tickets);

  return newTicket;
}

/**
 * Aggregate metrics for President Command Center
 */
export function getAdminStats(): AdminStats {
  const tickets = getStoredTickets();
  const total = tickets.length;
  const claimed = tickets.filter((t) => t.status === "CLAIMED").length;
  const unused = total - claimed;

  const domainBreakdown: Record<string, number> = {};
  const branchBreakdown: Record<string, number> = {};
  const collegeBreakdown: Record<string, number> = {};

  tickets.forEach((t) => {
    domainBreakdown[t.domain] = (domainBreakdown[t.domain] || 0) + 1;
    branchBreakdown[t.degreeBranch] = (branchBreakdown[t.degreeBranch] || 0) + 1;
    collegeBreakdown[t.college] = (collegeBreakdown[t.college] || 0) + 1;
  });

  return {
    totalIssued: total,
    totalClaimed: claimed,
    totalUnused: unused,
    claimRate: total > 0 ? Math.round((claimed / total) * 100) : 0,
    totalTickets: total,
    claimedTickets: claimed,
    unusedTickets: unused,
    checkInPercentage: total > 0 ? Math.round((claimed / total) * 100) : 0,
    domainBreakdown,
    branchBreakdown,
    collegeBreakdown,
  };
}

/**
 * Reset a single ticket back to UNUSED status (President action)
 */
export function resetTicketStatus(ticketId: string): VerificationResult {
  const tickets = getStoredTickets();
  const index = tickets.findIndex((t) => t.ticketId.toUpperCase() === ticketId.trim().toUpperCase());
  if (index !== -1) {
    const updated: StudentTicket = {
      ...tickets[index],
      status: "UNUSED",
      claimedAt: null,
      claimedBy: undefined,
    };
    tickets[index] = updated;
    saveTickets(tickets);
    return {
      found: true,
      success: true,
      ticket: updated,
      message: `Pass ${ticketId} reset to UNUSED.`,
    };
  }
  return {
    found: false,
    success: false,
    message: `Pass ${ticketId} not found in system.`,
    error: `Pass ${ticketId} not found in system.`,
  };
}

/**
 * Reset all student passes (President only)
 */
export function resetAllTickets(): void {
  saveTickets([]);
}

