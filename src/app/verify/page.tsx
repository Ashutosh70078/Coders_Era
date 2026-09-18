"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Search, 
  QrCode, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles,
  ArrowRight,
  Filter,
  Users,
  Lock,
  Unlock,
  ShieldAlert,
  ArrowLeft
} from "lucide-react";
import { lookupTicket, getStoredTickets, subscribeToTicketChanges, claimTicket } from "@/lib/ticket-store";
import { verifyPresidentPasscode } from "@/lib/president-auth";
import { StudentTicket } from "@/lib/types";
import VerificationCard from "@/components/scanner/VerificationCard";
import SuffixMatchDrawer from "@/components/scanner/SuffixMatchDrawer";
import QRScannerModal from "@/components/scanner/QRScannerModal";
import { toast } from "sonner";
import Link from "next/link";

function VerifyPortalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [activeTicket, setActiveTicket] = useState<StudentTicket | null>(null);
  const [multipleMatches, setMultipleMatches] = useState<StudentTicket[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [notFoundError, setNotFoundError] = useState<string | null>(null);
  const [allTickets, setAllTickets] = useState<StudentTicket[]>([]);

  // Sync with store
  useEffect(() => {
    setAllTickets(getStoredTickets());
    const unsub = subscribeToTicketChanges((updated) => {
      setAllTickets(updated);
      if (activeTicket) {
        const found = updated.find((t) => t.ticketId === activeTicket.ticketId);
        if (found) setActiveTicket(found);
      }
    });
    return () => unsub();
  }, [activeTicket]);

  // Handle URL query parameter `?id=...`
  useEffect(() => {
    const idParam = searchParams.get("id");
    if (idParam) {
      setQuery(idParam);
      executeSearch(idParam);
    }
  }, [searchParams]);

  // Execute lookup
  const executeSearch = (searchStr: string) => {
    setNotFoundError(null);
    setMultipleMatches([]);
    setDrawerOpen(false);

    if (!searchStr.trim()) {
      setActiveTicket(null);
      return;
    }

    const result = lookupTicket(searchStr);

    if (result.found && result.ticket) {
      setActiveTicket(result.ticket);
      toast.success(`Found record for ${result.ticket.fullName}`);
    } else if (result.found && result.multipleMatches && result.multipleMatches.length > 0) {
      setMultipleMatches(result.multipleMatches);
      setDrawerOpen(true);
      setActiveTicket(null);
      toast.info(`Found ${result.multipleMatches.length} students with match "${searchStr}". Please select one.`);
    } else {
      setActiveTicket(null);
      setNotFoundError(result.error || `No ticket found for "${searchStr}".`);
      toast.error("Lookup Failed", {
        description: result.error,
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  // From QR scanner
  const handleScanResult = (scannedPayload: string) => {
    let cleanId = scannedPayload.trim();
    try {
      if (cleanId.includes("id=")) {
        const urlObj = new URL(cleanId, window.location.origin);
        const urlId = urlObj.searchParams.get("id");
        if (urlId) cleanId = urlId;
      } else if (cleanId.startsWith("{") && cleanId.includes('"id":')) {
        const parsed = JSON.parse(cleanId);
        if (parsed.id) cleanId = parsed.id;
      }
    } catch {
      // Raw string
    }

    setQuery(cleanId);
    executeSearch(cleanId);
  };

  const handleClear = () => {
    setQuery("");
    setActiveTicket(null);
    setMultipleMatches([]);
    setNotFoundError(null);
    router.replace("/verify");
  };

  // Direct Gate Verification Console (No password required for scanning attendees)
  return (
    <div className="py-6 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#121215] border border-[#27272a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white">
              Gate Audit &amp; Verification Desk
            </h1>
            <p className="text-xs text-[#a1a1aa]">
              Scan attendee QR or enter Roll Number/Suffix to verify and admit attendees.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl bg-[#18181b] border border-[#27272a] text-[#a1a1aa] hover:text-white text-xs font-semibold"
          >
            Pass Portal
          </Link>
          <Link
            href="/admin"
            className="px-3.5 py-1.5 rounded-xl bg-[#38bdf8] text-black text-xs font-bold shadow-sm shadow-[#38bdf8]/20"
          >
            Attendee Roster
          </Link>
        </div>
      </div>

      {/* Search & Scan Control Bar */}
      <div className="bg-[#121215] border border-[#27272a] rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
          {/* Input field */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Ticket ID, Suffix Code, or AKTU Roll Number..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#09090b] border border-[#27272a] focus:border-[#38bdf8] text-sm font-mono text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-[#38bdf8] text-black font-extrabold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#38bdf8]/20"
          >
            <Search className="h-4 w-4" />
            <span>Verify Attendee</span>
          </button>

          {/* Camera Scanner Button */}
          <button
            type="button"
            onClick={() => setScannerModalOpen(true)}
            className="px-4 py-3 rounded-xl bg-[#18181b] border border-[#27272a] hover:border-[#38bdf8] text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all"
          >
            <QrCode className="h-4 w-4 text-[#38bdf8]" />
            <span>Scan QR</span>
          </button>

          {/* Clear Button */}
          {(query || activeTicket) && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
              title="Clear Search"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      {/* Verification Card Result */}
      {activeTicket && (
        <div className="animate-in fade-in zoom-in duration-300">
          <VerificationCard 
            ticket={activeTicket} 
            onTicketUpdated={(updated) => setActiveTicket(updated)}
            onClearSearch={handleClear}
          />
        </div>
      )}

      {/* Not Found Error Banner */}
      {notFoundError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{notFoundError}</span>
        </div>
      )}

      {/* Suffix Match Drawer */}
      <SuffixMatchDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        matches={multipleMatches}
        suffixQuery={query}
        onSelectTicket={(t) => {
          setActiveTicket(t);
          setDrawerOpen(false);
        }}
      />

      {/* Camera QR Scanner Modal */}
      <QRScannerModal
        isOpen={scannerModalOpen}
        onClose={() => setScannerModalOpen(false)}
        onScanResult={handleScanResult}
      />
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-xs font-mono text-slate-400">
        Loading Gate Verification Desk...
      </div>
    }>
      <VerifyPortalContent />
    </Suspense>
  );
}
