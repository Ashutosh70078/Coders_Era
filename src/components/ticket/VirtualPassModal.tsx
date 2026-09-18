"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  X, 
  Ticket, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { usePassModal } from "@/context/PassModalContext";
import TicketForm from "./TicketForm";
import VirtualPass from "./VirtualPass";
import { lookupTicket, getStoredTickets } from "@/lib/ticket-store";
import { StudentTicket } from "@/lib/types";

export default function VirtualPassModal() {
  const { isOpen, closePassModal, activeTab, setActiveTab } = usePassModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedTicket, setSearchedTicket] = useState<StudentTicket | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [totalPassesCount, setTotalPassesCount] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setTotalPassesCount(getStoredTickets().length);
    }
  }, [isOpen, activeTab]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePassModal();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closePassModal]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#121215] border border-[#27272a] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#27272a] bg-[#18181b]/50">
          <div className="flex items-center gap-3">
            <Image
              alt="CodersEra Logo"
              width={36}
              height={36}
              className="h-9 w-9 object-contain rounded-full border border-[#27272a]"
              src="/codersera-logo-original.jpg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  Automate India Virtual Pass
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#38bdf8] font-bold">
                  NIET Chapter
                </span>
              </div>
              <p className="text-xs text-[#a1a1aa]">
                Official Single-Use Entry &amp; Identification Pass for Seminar Hall
              </p>
            </div>
          </div>

          <button
            onClick={closePassModal}
            className="p-2 rounded-full bg-[#18181b] border border-[#27272a] text-[#a1a1aa] hover:text-white hover:bg-[#27272a] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#27272a] bg-[#09090b]/40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab("generate"); setSearchedTicket(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "generate"
                  ? "bg-[#38bdf8] text-black shadow-md shadow-[#38bdf8]/20"
                  : "bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a]"
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Issue New Pass</span>
            </button>

            <button
              onClick={() => { setActiveTab("lookup"); setSearchedTicket(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "lookup"
                  ? "bg-[#38bdf8] text-black shadow-md shadow-[#38bdf8]/20"
                  : "bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a]"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Find My Pass</span>
            </button>

            <button
              onClick={() => setActiveTab("admin")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "admin"
                  ? "bg-[#38bdf8] text-black shadow-md shadow-[#38bdf8]/20"
                  : "bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a]"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Admin Gate Verification Desk</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#a1a1aa]">
            <span>Active Passes:</span>
            <span className="font-mono font-bold text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded-full border border-[#38bdf8]/20">
              {totalPassesCount} Issued
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {activeTab === "generate" && (
            <div>
              <TicketForm />
            </div>
          )}

          {activeTab === "lookup" && (
            <div className="max-w-xl mx-auto py-6 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#38bdf8] flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Find Your Virtual Pass</h3>
                <p className="text-xs text-[#a1a1aa]">
                  Enter your AKTU Roll Number or Suffix Code to retrieve your pass.
                </p>
              </div>

              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. 2201330100012 or 0481"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#09090b] border border-[#27272a] text-xs text-white placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#38bdf8] text-black font-extrabold text-xs hover:opacity-90 transition-opacity shrink-0"
                >
                  Search
                </button>
              </form>

              {searchError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{searchError}</span>
                </div>
              )}

              {searchedTicket && (
                <div className="pt-4 border-t border-[#27272a]">
                  <VirtualPass ticket={searchedTicket} showActions={true} />
                </div>
              )}
            </div>
          )}

          {activeTab === "admin" && (
            <div className="max-w-xl mx-auto py-6 space-y-6">
              <div className="p-6 rounded-3xl bg-[#18181b]/80 border border-[#27272a] text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#38bdf8] flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Admin Gate Verification Desk</h3>
                  <p className="text-xs text-[#a1a1aa] mt-1">
                    Live attendee check-in scanner and administrative pass control at Seminar Hall.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#09090b] border border-[#27272a] text-left text-xs space-y-2">
                  <div className="flex justify-between text-[#a1a1aa]">
                    <span>Authorized Login:</span>
                    <strong className="text-white font-mono">admin@niet.co.in</strong>
                  </div>
                  <div className="flex justify-between text-[#a1a1aa]">
                    <span>Event Passcode:</span>
                    <strong className="text-white font-mono">coders2026</strong>
                  </div>
                </div>

                <Link
                  href="/admin"
                  onClick={closePassModal}
                  className="w-full py-3 rounded-2xl bg-[#38bdf8] text-black font-extrabold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <span>Open Full Admin Gate Desk</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
