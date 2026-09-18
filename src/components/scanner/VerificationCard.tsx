"use client";

import React, { useState } from "react";
import { StudentTicket } from "@/lib/types";
import { 
  CheckCircle2, 
  AlertOctagon, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  User, 
  GraduationCap, 
  BookOpen, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Unlock,
  Sparkles,
  RotateCcw
} from "lucide-react";
import { claimTicket, resetTicketStatus } from "@/lib/ticket-store";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

interface VerificationCardProps {
  ticket: StudentTicket;
  onTicketUpdated: (updated: StudentTicket) => void;
  onClearSearch?: () => void;
}

export default function VerificationCard({
  ticket,
  onTicketUpdated,
  onClearSearch,
}: VerificationCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const isClaimed = ticket.status === "CLAIMED";

  // Check in action
  const handleCheckIn = () => {
    setIsProcessing(true);
    try {
      const result = claimTicket(ticket.ticketId, "Gate Checkpoint Alpha");
      if (result.success && result.ticket) {
        onTicketUpdated(result.ticket);
        toast.success(result.message, {
          description: `Attendee: ${result.ticket.fullName}`,
        });

        // Flash green celebratory confetti
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#10b981", "#06b6d4", "#00f0ff"],
        });
      } else {
        toast.error("Admission Blocked", {
          description: result.message,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during ticket check-in.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Override reset
  const handleReset = () => {
    setIsProcessing(true);
    try {
      const result = resetTicketStatus(ticket.ticketId);
      if (result.success && result.ticket) {
        onTicketUpdated(result.ticket);
        toast.info(result.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl p-6 sm:p-8 transition-all duration-300 border",
        isClaimed
          ? "bg-rose-950/25 border-rose-600/60 shadow-2xl shadow-rose-950/60 ring-2 ring-rose-500/20"
          : "bg-slate-900/90 border-emerald-500/50 shadow-2xl shadow-emerald-950/40 ring-2 ring-emerald-500/20"
      )}
    >
      {/* Top Banner: Status Header */}
      {isClaimed ? (
        /* STRICT HIGH-CONTRAST WARNING RED STATE FOR CLAIMED */
        <div className="mb-6 p-4 rounded-xl bg-rose-950/90 border-2 border-rose-500 text-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-neon-rose animate-in shake duration-300">
          <div className="flex items-center space-x-3.5 text-center sm:text-left">
            <div className="h-12 w-12 rounded-xl bg-rose-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-900/80 animate-pulse">
              <AlertOctagon className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-900 text-white font-mono text-[10px] font-black uppercase tracking-widest">
                  ACCESS DENIED
                </span>
                <span className="text-xs font-mono text-rose-300">Single-Use Breach Prevented</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Ticket Already Redeemed!
              </h3>
              <p className="text-xs text-rose-200 mt-1 font-mono flex items-center gap-1.5 justify-center sm:justify-start">
                <Clock className="h-3.5 w-3.5 text-rose-300" />
                <span>Claimed on: <strong className="text-white underline">{ticket.claimedAt}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-black/50 border border-rose-800 text-xs font-mono text-rose-300">
              <Lock className="h-3.5 w-3.5 text-rose-400" />
              <span>LOCKED ENTRY</span>
            </div>
          </div>
        </div>
      ) : (
        /* GREEN STATE FOR UNUSED */
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-neon-emerald">
          <div className="flex items-center space-x-3.5 text-center sm:text-left">
            <div className="h-12 w-12 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-900/80">
              <CheckCircle2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-200 font-mono text-[10px] font-black uppercase tracking-widest">
                  AUTHORIZED
                </span>
                <span className="text-xs font-mono text-emerald-400">Ready for First Entry</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Valid Ticket — Unclaimed
              </h3>
              <p className="text-xs text-emerald-300/90 font-mono mt-1">
                Single-use quota intact. Ready to check in attendee.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/40 border border-emerald-500/40 text-xs font-mono text-emerald-300 font-bold">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>AUTHENTIC PASS</span>
          </div>
        </div>
      )}

      {/* Ticket Credentials Block */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Student Details (8 cols) */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Ticket Identifier
              </span>
              <div className="flex items-center space-x-2 mt-0.5">
                <h2 className="text-2xl font-black text-white font-mono tracking-tight">
                  {ticket.ticketId}
                </h2>
                <span className="px-2 py-0.5 rounded bg-cyber-violet/20 border border-cyber-violet/50 text-cyber-neon font-mono text-xs font-bold">
                  SUFFIX: {ticket.suffix}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Designated Seat
              </span>
              <p className="text-lg font-mono font-bold text-cyber-neon">
                {ticket.seatNumber || "GEN-01"}
              </p>
            </div>
          </div>

          {/* Locked badge if claimed */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 relative overflow-hidden">
            {isClaimed && (
              <div className="absolute top-2 right-2 flex items-center space-x-1 px-2 py-0.5 rounded bg-rose-950/80 border border-rose-700 text-[10px] font-mono text-rose-300">
                <Lock className="h-3 w-3" />
                <span>CREDENTIALS LOCKED</span>
              </div>
            )}

            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Attendee</span>
              <h4 className="text-xl font-black text-white flex items-center gap-2">
                {ticket.fullName}
              </h4>
              {ticket.rollNumber && (
                <p className="text-xs text-cyber-cyan font-mono mt-0.5">
                  Roll No: <strong className="text-white">{ticket.rollNumber}</strong>
                </p>
              )}
              {ticket.teamName && (
                <p className="text-xs text-pink-300 font-sans mt-0.5">
                  SIH Team: <strong>{ticket.teamName}</strong> ({ticket.teamRole || "Member"})
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="flex items-center space-x-2 text-slate-300">
                <GraduationCap className="h-4 w-4 text-cyber-violet flex-shrink-0" />
                <span className="truncate">{ticket.college}</span>
              </div>

              <div className="flex items-center space-x-2 text-slate-300">
                <BookOpen className="h-4 w-4 text-cyber-cyan flex-shrink-0" />
                <span className="truncate">{ticket.degreeBranch}</span>
              </div>

              <div className="flex items-center space-x-2 text-slate-400">
                <Mail className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <span className="truncate">{ticket.email}</span>
              </div>

              <div className="flex items-center space-x-2 text-slate-400">
                <Phone className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <span>{ticket.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] font-mono">
              <span className="text-slate-400">
                Track: <strong className="text-cyber-purple">{ticket.domain}</strong>
              </span>
              <span className="text-slate-400">
                Year: <strong className="text-slate-200">{ticket.yearOfStudy}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Panel (4 cols) */}
        <div className="md:col-span-4 flex flex-col justify-between h-full space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs font-mono">
            <span className="text-[10px] text-slate-400 uppercase block">Audit Verification Gate</span>
            <div className="flex items-center justify-between text-slate-300">
              <span>Checkpoint:</span>
              <span className="text-white font-bold">Gate #1 (Main)</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Status:</span>
              <span className={isClaimed ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                {ticket.status}
              </span>
            </div>
            {ticket.claimedBy && (
              <div className="flex items-center justify-between text-slate-300">
                <span>Admitted By:</span>
                <span className="text-slate-200">{ticket.claimedBy}</span>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          {isClaimed ? (
            <div className="space-y-2">
              <button
                disabled
                className="w-full py-4 px-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-400 font-mono font-bold text-sm tracking-wider flex items-center justify-center space-x-2 cursor-not-allowed opacity-75"
              >
                <Lock className="h-4 w-4" />
                <span>ADMISSION LOCKED</span>
              </button>
              <p className="text-[11px] font-mono text-center text-rose-400">
                Single-use ticket has already expired for entrance.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={handleCheckIn}
                disabled={isProcessing}
                className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-mono font-bold text-sm tracking-wider shadow-lg shadow-emerald-950 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className="h-5 w-5 text-white" />
                <span>{isProcessing ? "Redeeming..." : "CHECK IN / MARK TICKET AS USED"}</span>
              </button>
              <p className="text-[10px] font-mono text-center text-slate-400">
                Clicking will permanently transition status to CLAIMED.
              </p>
            </div>
          )}

          {/* Secondary Reset / Clear search */}
          <div className="flex items-center justify-between gap-2 pt-2">
            {onClearSearch && (
              <button
                onClick={onClearSearch}
                className="text-xs font-mono text-slate-400 hover:text-white underline underline-offset-2"
              >
                Clear &amp; Scan Next
              </button>
            )}

            {isClaimed && (
              <button
                onClick={handleReset}
                disabled={isProcessing}
                className="flex items-center space-x-1 text-xs font-mono text-slate-400 hover:text-cyber-cyan transition-colors"
                title="Admin manual override to reset status"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Status</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
