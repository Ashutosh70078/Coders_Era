"use client";

import React, { useState, useEffect, useMemo } from "react";
import { StudentTicket } from "@/lib/types";
import { 
  getStoredTickets, 
  subscribeToTicketChanges, 
  claimTicket, 
  resetTicketStatus, 
  resetAllTickets 
} from "@/lib/ticket-store";
import { verifyPresidentPasscode, PRESIDENT_CREDENTIALS } from "@/lib/president-auth";
import { 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Clock, 
  Download, 
  Search, 
  Filter, 
  RotateCcw, 
  Lock, 
  Unlock, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertOctagon,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [tickets, setTickets] = useState<StudentTicket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "CLAIMED" | "UNUSED">("ALL");
  const [domainFilter, setDomainFilter] = useState<string>("ALL");

  useEffect(() => {
    setTickets(getStoredTickets());
    const unsubscribe = subscribeToTicketChanges((updated) => {
      setTickets(updated);
    });
    // Check if admin is already authenticated in this browser
    if (typeof window !== "undefined") {
      const savedAuth = window.localStorage.getItem("coders_era_admin_authenticated");
      if (savedAuth === "true") {
        setIsAuthenticated(true);
      }
    }
    return () => unsubscribe();
  }, []);

  // Official Admin Auth Check
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyPresidentPasscode(passcode)) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("coders_era_admin_authenticated", "true");
      }
      toast.success("Welcome, Admin! Gate credentials validated.");
    } else {
      toast.error("Invalid Admin Passcode. Use authorized credentials.");
    }
  };

  const handleDemoBypass = () => {
    setIsAuthenticated(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("coders_era_admin_authenticated", "true");
    }
    toast.success("Admin privileged mode enabled.");
  };

  const handleLockSession = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("coders_era_admin_authenticated");
    }
    toast.info("Admin Gate Desk locked.");
  };

  // Live Stats calculations
  const stats = useMemo(() => {
    const totalIssued = tickets.length;
    const totalClaimed = tickets.filter((t) => t.status === "CLAIMED").length;
    const totalUnused = totalIssued - totalClaimed;
    const claimRate = totalIssued > 0 ? Math.round((totalClaimed / totalIssued) * 100) : 0;
    return { totalIssued, totalClaimed, totalUnused, claimRate };
  }, [tickets]);

  // Filtering
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Status filter
      if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
      // Domain filter
      if (domainFilter !== "ALL" && t.domain !== domainFilter) return false;
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = t.fullName.toLowerCase().includes(q);
        const matchId = t.ticketId.toLowerCase().includes(q);
        const matchSuffix = t.suffix.toLowerCase().includes(q);
        const matchCollege = t.college.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchSuffix && !matchCollege) return false;
      }
      return true;
    });
  }, [tickets, statusFilter, domainFilter, searchTerm]);

  // CSV Exporter
  const handleExportCSV = () => {
    if (tickets.length === 0) {
      toast.error("No ticket records to export.");
      return;
    }

    const headers = [
      "Ticket ID",
      "Suffix",
      "Status",
      "Claimed At",
      "Full Name",
      "AKTU Roll Number",
      "Email",
      "Phone",
      "College",
      "SIH Team Name",
      "Team Role",
      "Problem Statement ID",
      "Degree & Branch",
      "Year",
      "SIH Theme",
      "Desk / Seat",
      "Registered At",
    ];

    const rows = tickets.map((t) => [
      `"${t.ticketId}"`,
      `"${t.suffix}"`,
      `"${t.status}"`,
      `"${t.claimedAt || ""}"`,
      `"${t.fullName.replace(/"/g, '""')}"`,
      `"${t.rollNumber || ""}"`,
      `"${t.email}"`,
      `"${t.phone}"`,
      `"${t.college.replace(/"/g, '""')}"`,
      `"${(t.teamName || "").replace(/"/g, '""')}"`,
      `"${t.teamRole || ""}"`,
      `"${t.problemStatementId || ""}"`,
      `"${t.degreeBranch.replace(/"/g, '""')}"`,
      `"${t.yearOfStudy}"`,
      `"${t.domain}"`,
      `"${t.seatNumber || ""}"`,
      `"${t.registeredAt}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `coders-era-attendees-export-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Roster exported to CSV successfully!");
  };

  // Toggle ticket status
  const handleToggleStatus = (t: StudentTicket) => {
    if (t.status === "CLAIMED") {
      resetTicketStatus(t.ticketId);
      toast.info(`Ticket ${t.ticketId} reset to UNUSED.`);
    } else {
      claimTicket(t.ticketId, "Admin Command Override");
      toast.success(`Ticket ${t.ticketId} manually redeemed.`);
    }
  };

  // Clear all registered passes
  const handleClearAllTickets = () => {
    if (window.confirm("Are you sure you want to clear all registered student passes?")) {
      resetAllTickets();
      toast.success("Ticket registry cleared.");
    }
  };

  // If not logged in, show Admin PIN lock screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-8 sm:my-12 p-6 sm:p-8 rounded-2xl glass-panel-glow border border-violet-500/40 text-center space-y-6">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-cyber-violet to-cyber-cyan p-[1px] mx-auto shadow-neon-violet">
          <div className="h-full w-full bg-slate-950 rounded-[15px] flex items-center justify-center">
            <Lock className="h-7 w-7 text-cyber-neon" />
          </div>
        </div>

        <div>
          <span className="text-xs font-mono text-cyber-neon uppercase tracking-widest font-bold">
            Authorized Gate Staff
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Admin Gate Verification Desk
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Enter administrative passcode to audit student attendance, verify passes, and manage event admissions.
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode (e.g. coders2026)"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyber-neon text-center font-mono text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-mono font-bold text-sm shadow-lg transition-all cursor-pointer"
          >
            Unlock Gate Desk
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={handleDemoBypass}
            className="text-xs font-mono text-cyber-neon hover:text-white flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>1-Click Quick Admin Unlock</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-cyber-neon animate-ping" />
            <span className="text-xs font-mono text-cyber-neon uppercase tracking-widest font-bold">
              Admin Gate Verification Desk
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white mt-1">
            Real-Time Attendance &amp; Roster Audit
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Coder&apos;s Era • SIH 2026 • Seminar Hall Attendance Intelligence
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/verify"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-mono text-white font-bold shadow-neon-emerald transition-all active:scale-95"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Laser QR Scanner Desk</span>
          </Link>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-cyber-cyan text-xs font-mono text-white shadow transition-all active:scale-95"
          >
            <Download className="h-4 w-4 text-cyber-cyan" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleClearAllTickets}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-600/50 text-xs font-mono text-slate-400 hover:text-rose-300 transition-all"
            title="Clear all registered student passes"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear All Passes</span>
          </button>

          <button
            onClick={handleLockSession}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
            title="Lock Admin Gate Desk"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Live Stats Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Issued */}
        <div className="glass-panel rounded-xl p-4 sm:p-5 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400">Total Issued</span>
            <Users className="h-4 w-4 text-cyber-cyan" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2 font-mono">
            {stats.totalIssued}
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">
            Guaranteed collision-free
          </span>
        </div>

        {/* Total Claimed */}
        <div className="glass-panel rounded-xl p-4 sm:p-5 border border-rose-900/30 bg-rose-950/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-rose-300">Claimed (Admitted)</span>
            <AlertOctagon className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-2 font-mono">
            {stats.totalClaimed}
          </div>
          <span className="text-[10px] font-mono text-rose-400/80 mt-1 block">
            Single-use strictly locked
          </span>
        </div>

        {/* Remaining Active */}
        <div className="glass-panel rounded-xl p-4 sm:p-5 border border-emerald-900/30 bg-emerald-950/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-emerald-300">Remaining Active</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2 font-mono">
            {stats.totalUnused}
          </div>
          <span className="text-[10px] font-mono text-emerald-400/80 mt-1 block">
            Pending gate arrival
          </span>
        </div>

        {/* Attendance Rate */}
        <div className="glass-panel rounded-xl p-4 sm:p-5 border border-violet-900/30 bg-violet-950/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-cyber-violet">Turnout Rate</span>
            <TrendingUp className="h-4 w-4 text-cyber-neon" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyber-neon mt-2 font-mono">
            {stats.claimRate}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.claimRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Roster Controls: Search & Filters */}
      <div className="glass-panel rounded-xl p-4 sm:p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Name, ID, or Suffix (e.g. 481)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 outline-none focus:border-cyber-neon"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Status Pills */}
            <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setStatusFilter("ALL")}
                className={cn(
                  "px-3 py-1 rounded-md transition-colors",
                  statusFilter === "ALL" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-white"
                )}
              >
                All ({tickets.length})
              </button>
              <button
                onClick={() => setStatusFilter("UNUSED")}
                className={cn(
                  "px-3 py-1 rounded-md transition-colors",
                  statusFilter === "UNUSED" ? "bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/30" : "text-slate-400 hover:text-emerald-400"
                )}
              >
                Unused ({stats.totalUnused})
              </button>
              <button
                onClick={() => setStatusFilter("CLAIMED")}
                className={cn(
                  "px-3 py-1 rounded-md transition-colors",
                  statusFilter === "CLAIMED" ? "bg-rose-950/80 text-rose-300 font-bold border border-rose-500/30" : "text-slate-400 hover:text-rose-400"
                )}
              >
                Claimed ({stats.totalClaimed})
              </button>
            </div>

            {/* Domain Dropdown */}
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 outline-none focus:border-cyber-neon"
            >
              <option value="ALL">All SIH Themes</option>
              <option value="Smart Automation & Robotics">Smart Automation &amp; Robotics</option>
              <option value="AI & Machine Learning">AI &amp; Machine Learning</option>
              <option value="Clean & Green Technology">Clean &amp; Green Technology</option>
              <option value="HealthTech & MedTech">HealthTech &amp; MedTech</option>
              <option value="Cybersecurity & Blockchain">Cybersecurity &amp; Blockchain</option>
              <option value="Disaster Management">Disaster Management</option>
              <option value="Smart Education">Smart Education</option>
            </select>
          </div>
        </div>

        {/* Mobile View: Attendee Cards (visible on phones and small screens) */}
        <div className="block md:hidden space-y-3">
          {filteredTickets.length === 0 ? (
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 text-center text-slate-500 text-xs font-mono">
              No attendees match the selected search or filter criteria.
            </div>
          ) : (
            filteredTickets.map((t) => {
              const isClaimed = t.status === "CLAIMED";
              return (
                <div 
                  key={t.ticketId}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-white text-sm">{t.fullName}</div>
                      {t.rollNumber && (
                        <div className="text-xs text-cyber-cyan font-mono mt-0.5">Roll: {t.rollNumber}</div>
                      )}
                      {t.teamName && (
                        <div className="text-xs text-pink-300 font-sans mt-0.5">
                          Team: <strong>{t.teamName}</strong> ({t.teamRole || "Member"})
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {isClaimed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-[10px] font-mono">
                          <AlertOctagon className="h-3 w-3" />
                          CLAIMED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] font-mono">
                          <CheckCircle2 className="h-3 w-3" />
                          UNUSED
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 rounded bg-cyber-violet/20 border border-cyber-violet/40 text-cyber-neon font-mono text-[10px] font-bold">
                        SUFFIX: {t.suffix}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Ticket ID</span>
                      <Link
                        href={`/verify?id=${encodeURIComponent(t.ticketId)}`}
                        className="text-white hover:text-cyber-neon font-bold flex items-center gap-1 truncate"
                      >
                        <span className="truncate">{t.ticketId}</span>
                        <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-60" />
                      </Link>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Track</span>
                      <span className="text-cyber-purple truncate block font-sans font-semibold">{t.domain}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-2">
                    <span className="text-[10px] font-mono text-slate-500 truncate">
                      {t.claimedAt ? `Admitted: ${t.claimedAt}` : t.email}
                    </span>

                    <button
                      onClick={() => handleToggleStatus(t)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 active:scale-95 cursor-pointer font-bold",
                        isClaimed
                          ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                          : "bg-emerald-600 hover:bg-emerald-500 text-black shadow-sm shadow-emerald-500/20"
                      )}
                    >
                      {isClaimed ? "Override to Unused" : "Admit Attendee"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Live Roster Table (hidden on mobile, visible on tablet/desktop) */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Suffix</th>
                <th className="py-3 px-4">Attendee &amp; Team Details</th>
                <th className="py-3 px-4">SIH Theme / PS ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Claimed Time</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No attendees match the selected search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => {
                  const isClaimed = t.status === "CLAIMED";
                  return (
                    <tr key={t.ticketId} className="hover:bg-slate-850/60 transition-colors">
                      {/* Ticket ID */}
                      <td className="py-3.5 px-4 font-bold text-white font-mono">
                        <Link
                          href={`/verify?id=${encodeURIComponent(t.ticketId)}`}
                          className="hover:text-cyber-neon underline underline-offset-2 flex items-center gap-1"
                        >
                          {t.ticketId}
                          <ExternalLink className="h-3 w-3 opacity-60" />
                        </Link>
                      </td>

                      {/* Suffix */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="px-2 py-0.5 rounded bg-cyber-violet/20 border border-cyber-violet/40 text-cyber-neon font-bold">
                          {t.suffix}
                        </span>
                      </td>

                      {/* Attendee */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white font-sans text-sm">{t.fullName}</div>
                        {t.rollNumber && (
                          <div className="text-[10px] text-cyber-cyan font-mono">Roll: {t.rollNumber}</div>
                        )}
                        {t.teamName && (
                          <div className="text-[10px] text-pink-300 font-sans">
                            Team: <strong>{t.teamName}</strong> ({t.teamRole || "Member"})
                          </div>
                        )}
                        <div className="text-[10px] text-slate-500">{t.email}</div>
                      </td>

                      {/* Track & Degree */}
                      <td className="py-3.5 px-4">
                        <span className="text-cyber-purple font-semibold block">{t.domain}</span>
                        <span className="text-[10px] text-slate-400 block">{t.problemStatementId || "PS: Open Innovation"}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isClaimed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-[10px]">
                            <AlertOctagon className="h-3 w-3" />
                            CLAIMED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-[10px]">
                            <CheckCircle2 className="h-3 w-3" />
                            UNUSED
                          </span>
                        )}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 text-[11px] text-slate-400">
                        {t.claimedAt ? (
                          <span className="text-rose-300">{t.claimedAt}</span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      {/* Overrides */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(t)}
                          className={cn(
                            "px-3 py-1 rounded-lg text-[11px] font-mono transition-all active:scale-95 cursor-pointer",
                            isClaimed
                              ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                              : "bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-600/40"
                          )}
                        >
                          {isClaimed ? "Override to Unused" : "Mark Admitted"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
