export type TicketStatus = "UNUSED" | "CLAIMED";

export type DomainTrack = 
  | "Smart Automation & Robotics"
  | "AI & Machine Learning"
  | "Clean & Green Technology"
  | "HealthTech & MedTech"
  | "Cybersecurity & Blockchain"
  | "Disaster Management"
  | "Smart Education"
  | "Open Innovation";

export interface TeamEvaluation {
  rank: number;
  totalScore: number;       // e.g. 23 / 25
  maxScore: number;         // 25
  scores: {
    innovation: number;     // max 5
    presentation: number;   // max 5
    tech: number;           // max 5
    impact: number;         // max 5
    qa: number;             // max 5
  };
  isFinalist: boolean;
  isPodium: boolean;
  badgeLabel?: string;      // "1st Rank", "Finalist", "Top 5"
}

export interface StudentTicket {
  ticketId: string;         // e.g. CE-26-A9F2-0481 (Scalable collision-free format)
  suffix: string;           // Scalable unique suffix (e.g. 0481, 1054, or alphanumeric)
  status: TicketStatus;
  claimedAt: string | null;
  claimedBy?: string;
  
  // Student College Authentication
  fullName: string;
  email: string;            // Strictly @niet.co.in
  rollNumber: string;       // AKTU Roll Number (Unique to every student in India)
  phone: string;
  college: string;          // NIET Greater Noida
  degreeBranch: string;
  yearOfStudy: string;
  domain: DomainTrack;
  
  // SIH / Automate India Team Credentials
  teamName: string;
  teamRole: "Team Leader" | "Member";
  problemStatementId?: string;
  seatNumber?: string;
  registeredAt: string;
  
  // Optional Hackathon Evaluation Scores (Leaderboard integration)
  evaluation?: TeamEvaluation;
}

export interface VerificationResult {
  found: boolean;
  success?: boolean;
  alreadyClaimed?: boolean;
  message?: string;
  ticket?: StudentTicket;
  multipleMatches?: StudentTicket[];
  error?: string;
}

export interface AdminStats {
  totalIssued: number;
  totalClaimed: number;
  totalUnused: number;
  claimRate: number;
  totalTickets?: number;
  claimedTickets?: number;
  unusedTickets?: number;
  checkInPercentage?: number;
  totalTeams?: number;
  topScore?: number;
  qualifiedTeams?: number;
  domainBreakdown?: Record<string, number>;
  branchBreakdown?: Record<string, number>;
  collegeBreakdown?: Record<string, number>;
}
