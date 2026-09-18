"use client";

import React, { useState } from "react";
import { X, QrCode, Scan, ArrowRight } from "lucide-react";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult: (ticketId: string) => void;
}

export default function QRScannerModal({
  isOpen,
  onClose,
  onScanResult,
}: QRScannerModalProps) {
  const [manualInput, setManualInput] = useState("");

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScanResult(manualInput.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#121215] border border-[#27272a] p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/20 flex items-center justify-center text-[#38bdf8]">
              <Scan className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">QR Optical Gate Scanner</h3>
              <p className="text-xs text-[#a1a1aa]">Laser Scanner • Seminar Hall Entry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#18181b] border border-[#27272a] text-[#a1a1aa] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Laser Scanner Viewport Simulation */}
        <div className="relative w-full h-48 rounded-2xl bg-black border-2 border-dashed border-[#38bdf8]/50 overflow-hidden flex flex-col items-center justify-center p-4">
          <div className="laser-beam" />
          <QrCode className="h-20 w-20 text-[#38bdf8]/40 animate-pulse" />
          <p className="text-xs font-mono text-[#38bdf8] mt-3 font-bold tracking-wider">
            OPTICAL SCANNER READY
          </p>
          <span className="text-[10px] text-[#a1a1aa] text-center mt-1">
            Aim optical scanner gun or paste QR payload below
          </span>
        </div>

        {/* Direct Text input for barcode scanner guns */}
        <form onSubmit={handleManualSubmit} className="space-y-3 pt-2">
          <label className="block text-[11px] font-mono text-[#a1a1aa] uppercase">
            Scanner Gun Input / Fast Lookup
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Scan or paste Ticket ID / Suffix..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#09090b] border border-[#27272a] text-xs font-mono text-white placeholder-[#a1a1aa] outline-none focus:border-[#38bdf8]"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#38bdf8] hover:opacity-90 text-black font-extrabold text-xs flex items-center gap-1 shadow-sm"
            >
              <span>Verify</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
