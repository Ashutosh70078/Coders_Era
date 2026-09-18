"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Ticket, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import TicketForm from "@/components/ticket/TicketForm";
import VirtualPass from "@/components/ticket/VirtualPass";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { lookupTicket, getStoredTickets, resetAllTickets } from "@/lib/ticket-store";
import { StudentTicket } from "@/lib/types";
import { toast } from "sonner";

export default function PassPortalHomePage() {
  const [activeTab, setActiveTab] = useState<"generate" | "lookup" | "admin">("generate");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedTicket, setSearchedTicket] = useState<StudentTicket | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [totalPassesCount, setTotalPassesCount] = useState<number>(0);

  useEffect(() => {
    setTotalPassesCount(getStoredTickets().length);
    const interval = setInterval(() => {
      setTotalPassesCount(getStoredTickets().length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    if (!searchQuery.trim()) {
      setSearchError("Please enter your AKTU Roll Number or Suffix Code.");
      return;
    }
    const result = lookupTicket(searchQuery.trim());
    if (result.found && result.ticket) {
      setSearchedTicket(result.ticket);
    } else {
      setSearchedTicket(null);
      setSearchError(result.error || "No registered pass found with this roll number or suffix.");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] pt-20 sm:pt-24 pb-16 sm:pb-20 px-2.5 sm:px-6 lg:px-8 selection:bg-[#38bdf8]/20">
      <div className="max-w-5xl mx-auto">
        {/* MAIN VIRTUAL PASS PORTAL CONTAINER */}
        <div className="relative w-full bg-[#121215] border border-[#27272a] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-md">
          {/* Top Holographic Cyan Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent" />

          {/* Portal Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-8 py-5 sm:py-6 border-b border-[#27272a] bg-[#18181b]/50">
            <div className="flex items-center gap-3.5 sm:gap-4">
              <Image
                alt="CodersEra Logo"
                width={44}
                height={44}
                className="h-10 w-10 sm:h-11 sm:w-11 object-contain rounded-full border border-[#27272a] shadow-sm shrink-0"
                src="/codersera-logo-original.jpg"
                priority
              />
              <div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h1 className="font-extrabold text-base sm:text-xl tracking-tight text-white">
                    CodersEra Virtual Pass Portal
                  </h1>
                  <span className="text-[9px] sm:text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/25 text-[#38bdf8] font-bold tracking-wider">
                    NIET CHAPTER
                  </span>
                </div>
                <p className="text-xs text-[#a1a1aa] mt-0.5">
                  Official Identification Pass for Seminar Hall
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#a1a1aa] self-start sm:self-center">
              <span>Active Passes:</span>
              <span className="font-mono font-bold text-[#38bdf8] bg-[#38bdf8]/10 px-3 py-1 rounded-full border border-[#38bdf8]/20">
                {totalPassesCount} Issued
              </span>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-3.5 border-b border-[#27272a] bg-[#09090b]/60 overflow-x-auto gap-2">
            <div className="flex items-center gap-2.5 min-w-max">
              <button
                onClick={() => { setActiveTab("generate"); setSearchedTicket(null); }}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "generate"
                    ? "bg-[#38bdf8] text-black shadow-md shadow-[#38bdf8]/25 font-extrabold"
                    : "bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a]"
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>Issue New Pass</span>
              </button>

              <button
                onClick={() => { setActiveTab("lookup"); setSearchedTicket(null); }}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "lookup"
                    ? "bg-[#38bdf8] text-black shadow-md shadow-[#38bdf8]/25 font-extrabold"
                    : "bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a]"
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Find My Pass</span>
              </button>

              <button
                onClick={() => setActiveTab("admin")}
                className={`px-3 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "admin"
                    ? "bg-[#38bdf8] text-black shadow-md shadow-[#38bdf8]/25 font-extrabold"
                    : "bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a]"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin Gate Verification Desk</span>
              </button>
            </div>
          </div>

          {/* Portal Tab Content */}
          <div className="p-4 sm:p-7 md:p-8 space-y-6">
            {/* TAB 1: DIRECT PASS GENERATION FORM */}
            {activeTab === "generate" && (
              <div className="space-y-6">
                {/* Clean Notice */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#18181b]/70 border border-[#27272a]">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#38bdf8]" />
                    NIET Student Verification Portal
                  </h2>
                  <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
                    Enter your enrolled NIET details below. Passes are issued with a collision-free suffix and verifiable cryptographic QR.
                  </p>
                </div>

                {/* Direct Registration Form */}
                <TicketForm />
              </div>
            )}

            {/* TAB 2: FIND MY PASS */}
            {activeTab === "lookup" && (
              <div className="space-y-6 max-w-2xl mx-auto py-4 sm:py-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#38bdf8] flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">Find or Re-download Your Pass</h2>
                  <p className="text-xs text-[#a1a1aa] max-w-md mx-auto">
                    Already generated your virtual pass? Enter your 10-14 digit AKTU Roll Number or your 4-digit Suffix Code to retrieve and download it.
                  </p>
                </div>

                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 pt-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#a1a1aa] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. 2201330100012 or Suffix 0001"
                      className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-2xl bg-[#09090b] border border-[#27272a] text-sm text-white placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#38bdf8] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 sm:py-3.5 rounded-2xl bg-[#38bdf8] text-black font-extrabold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md shadow-[#38bdf8]/20"
                  >
                    <span>Lookup Pass</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {searchError && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{searchError}</span>
                  </div>
                )}

                {searchedTicket && (
                  <div className="pt-6 border-t border-[#27272a] flex flex-col items-center animate-in fade-in duration-300">
                    <div className="mb-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Verified Pass Found
                      </span>
                    </div>
                    <VirtualPass ticket={searchedTicket} showActions={true} />
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ADMIN GATE VERIFICATION DESK */}
            {activeTab === "admin" && (
              <div className="w-full py-2 sm:py-4">
                <AdminDashboard />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
