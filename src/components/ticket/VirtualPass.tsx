"use client";

import React, { useRef, useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { 
  Download, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  Shield, 
  Calendar, 
  MapPin, 
  Sparkles,
  FileText,
  Copy,
  ExternalLink
} from "lucide-react";
import { StudentTicket } from "@/lib/types";
import { toast } from "sonner";
import Link from "next/link";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface VirtualPassProps {
  ticket: StudentTicket;
  showActions?: boolean;
}

export default function VirtualPass({ ticket, showActions = true }: VirtualPassProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/verify?id=${encodeURIComponent(ticket.ticketId)}`;
      setVerificationUrl(url);
    }
  }, [ticket.ticketId]);

  // 3D holographic tilt interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = ((y - centerY) / centerY) * -7;
    const rotY = ((x - centerX) / centerX) * 7;
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // One-click PNG Download
  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      toast.loading("Rendering high-res holographic pass...", { id: "export-ticket" });
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#080b11",
        scale: 3,
        useCORS: true,
        logging: false,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `CodersEra-Pass-${ticket.ticketId}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Holographic Pass saved to downloads!", { id: "export-ticket" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate ticket image. Please try again.", { id: "export-ticket" });
    } finally {
      setIsExporting(false);
    }
  };

  // One-click PDF Download
  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      toast.loading("Compiling official PDF pass...", { id: "export-pdf" });

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#080b11",
        scale: 2.5,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      pdf.setFillColor(8, 11, 17);
      pdf.rect(0, 0, pdfWidth, pdf.internal.pageSize.getHeight(), "F");
      
      // Add title in PDF
      pdf.setTextColor(0, 240, 255);
      pdf.setFontSize(16);
      pdf.text("CODER'S ERA - OFFICIAL EVENT PASS", margin, 18);
      
      pdf.addImage(imgData, "PNG", margin, 24, contentWidth, contentHeight);

      pdf.save(`CodersEra-Pass-${ticket.ticketId}.pdf`);
      toast.success("PDF pass downloaded successfully!", { id: "export-pdf" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to compile PDF.", { id: "export-pdf" });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(ticket.ticketId);
    toast.success(`Copied ${ticket.ticketId} to clipboard!`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Coder's Era Pass - ${ticket.fullName}`,
          text: `My verified ticket for Coder's Era: ${ticket.ticketId}`,
          url: verificationUrl,
        });
      } catch {
        // Ignored or cancelled
      }
    } else {
      navigator.clipboard.writeText(verificationUrl);
      toast.success("Verification link copied to clipboard!");
    }
  };

  const isClaimed = ticket.status === "CLAIMED";

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* 3D Container */}
      <div 
        className="w-full perspective-1000 select-none py-2"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={cardRef}
          style={{
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transition: rotateX === 0 && rotateY === 0 ? "transform 0.4s ease-out" : "none",
          }}
          className="relative w-full rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6 sm:p-7 border border-violet-500/40 shadow-2xl shadow-violet-950/40 overflow-hidden"
        >
          {/* Holographic animated overlay sheen */}
          <div className="holographic-sheen pointer-events-none" />

          {/* Ticket Cutout Notches */}
          <div className="ticket-notch-left" />
          <div className="ticket-notch-right" />

          {/* Background Circuit Grid Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

          {/* Header Bar of Pass */}
          <div className="relative z-10 flex items-start justify-between border-b border-slate-800/90 pb-4">
            <div className="flex items-center space-x-3">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-cyber-violet to-cyber-cyan p-[1px]">
                <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Shield className="h-6 w-6 text-cyber-neon" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm sm:text-base tracking-wider text-white">
                    CODER&apos;S ERA
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyber-neon">
                    SIH 2026
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400">
                  Smart India Hackathon • Seminar Hall
                </p>
              </div>
            </div>

            {/* Status Pill */}
            <div className="flex flex-col items-end">
              {isClaimed ? (
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-400 text-xs font-mono font-bold shadow-neon-rose">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                  <span>CLAIMED</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold shadow-neon-emerald animate-pulse">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>VALID PASS</span>
                </div>
              )}
              {isClaimed && ticket.claimedAt && (
                <span className="text-[9px] font-mono text-rose-300/80 mt-1">
                  Admitted
                </span>
              )}
            </div>
          </div>

          {/* Middle Body: Student Info & Dynamic QR */}
          <div className="relative z-10 py-5 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
            {/* Student Info (7 cols) */}
            <div className="sm:col-span-7 space-y-3.5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Attendee Name
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-1.5">
                  {ticket.fullName}
                </h3>
                <p className="text-xs text-cyber-neon font-mono mt-0.5">
                  {ticket.degreeBranch}
                </p>
                {ticket.rollNumber && (
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Roll No: <span className="text-slate-200">{ticket.rollNumber}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-900/80 rounded-lg p-2 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase">SIH Team</span>
                  <span className="text-slate-200 font-semibold truncate block">
                    {ticket.teamName || "Coder's Era Team"}
                  </span>
                  <span className="text-[9px] text-cyber-cyan block">
                    {ticket.teamRole || "Participant"}
                  </span>
                </div>
                <div className="bg-slate-900/80 rounded-lg p-2 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase">Theme &amp; PS</span>
                  <span className="text-cyber-purple font-semibold truncate block">
                    {ticket.domain}
                  </span>
                  <span className="text-[9px] text-slate-400 block truncate">
                    {ticket.problemStatementId || "Open Innovation"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-900/40 p-2 rounded-lg border border-slate-800/60">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  {ticket.yearOfStudy}
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="h-3 w-3 text-cyber-violet" />
                  Venue: <strong className="text-cyber-neon">{ticket.seatNumber ? `Desk ${ticket.seatNumber}` : "Seminar Hall"}</strong>
                </span>
              </div>
            </div>

            {/* Dynamic QR Code & Suffix (5 cols) */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 shadow-inner">
              <div className="p-2 bg-white rounded-lg shadow-md transition-transform hover:scale-105">
                <QRCodeSVG
                  value={verificationUrl || ticket.ticketId}
                  size={120}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <span className="text-[9px] font-mono text-slate-400 mt-2 uppercase tracking-wider text-center">
                Admin Gate Scan
              </span>
              <div className="mt-1 flex items-center space-x-1 text-[11px] font-mono">
                <span className="text-slate-400">SUFFIX:</span>
                <span className="px-1.5 py-0.5 rounded bg-cyber-violet/30 text-cyber-neon font-bold">
                  {ticket.suffix}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Collision-Free Ticket ID & Barcode Visual */}
          <div className="relative z-10 pt-4 border-t border-dashed border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase">TICKET ID:</span>
              <button
                type="button"
                onClick={handleCopyId}
                className="group/id flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-900 border border-violet-500/40 hover:border-violet-400 font-mono text-xs text-cyber-neon font-bold tracking-wider transition-colors"
                title="Click to copy Ticket ID"
              >
                <span>{ticket.ticketId}</span>
                <Copy className="h-3 w-3 text-slate-400 group-hover/id:text-cyber-neon" />
              </button>
            </div>

            {/* Barcode Mock Visual */}
            <div className="flex items-center space-x-0.5 opacity-60">
              {[4, 2, 6, 1, 3, 5, 2, 7, 3, 1, 4, 6, 2, 5, 3, 2, 6, 1, 4, 3, 5, 2].map((height, i) => (
                <div
                  key={i}
                  style={{ height: `${height * 3}px` }}
                  className="w-[2px] bg-slate-400"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="w-full mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleDownloadPNG}
            disabled={isExporting}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-cyber-cyan text-xs font-mono text-slate-200 hover:text-cyber-neon shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="h-4 w-4 text-cyber-cyan" />
            <span>Download Pass (PNG)</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-cyber-violet text-xs font-mono text-slate-200 hover:text-cyber-violet shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            <FileText className="h-4 w-4 text-cyber-violet" />
            <span>Download Pass (PDF)</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-slate-500 text-xs font-mono text-slate-300 transition-all active:scale-95"
          >
            <Share2 className="h-4 w-4 text-slate-400" />
            <span>Share Link</span>
          </button>
        </div>
      )}
    </div>
  );
}
