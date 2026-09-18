"use client";

import React from "react";
import { StudentTicket } from "@/lib/types";
import { X, CheckCircle2, AlertTriangle, UserCheck, ShieldAlert, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuffixMatchDrawerProps {
  isOpen: boolean;
  matches: StudentTicket[];
  suffixQuery: string;
  onSelectTicket: (ticket: StudentTicket) => void;
  onClose: () => void;
}

export default function SuffixMatchDrawer({
  isOpen,
  matches,
  suffixQuery,
  onSelectTicket,
  onClose,
}: SuffixMatchDrawerProps) {
  if (!isOpen || matches.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl glass-panel-glow border border-violet-500/40 p-6 sm:p-7 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                Suffix Ambiguity Resolved
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-1">
              Multiple Students Match Suffix &quot;{suffixQuery}&quot;
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Found {matches.length} registered students sharing this suffix or ID fragment. Select the specific student to view verification status and admit.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* List of Matched Students */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {matches.map((student) => {
            const isClaimed = student.status === "CLAIMED";
            return (
              <div
                key={student.ticketId}
                onClick={() => onSelectTicket(student)}
                className="group p-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyber-cyan cursor-pointer transition-all duration-200 flex items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-cyber-neon font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                      {student.ticketId}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      Seat: {student.seatNumber || "GEN"}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-cyber-neon truncate transition-colors">
                    {student.fullName}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    {student.college} • {student.domain}
                  </p>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0">
                  {isClaimed ? (
                    <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-mono">
                      <AlertTriangle className="h-3 w-3" />
                      <span>USED</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>UNUSED</span>
                    </div>
                  )}
                  <div className="h-8 w-8 rounded-lg bg-slate-800 group-hover:bg-cyber-cyan group-hover:text-slate-950 flex items-center justify-center text-slate-400 transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Security Protocol: CE-Suffix-V2</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white underline underline-offset-2"
          >
            Cancel Selection
          </button>
        </div>
      </div>
    </div>
  );
}
