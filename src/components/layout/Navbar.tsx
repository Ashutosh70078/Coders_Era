"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Bell, 
  Menu, 
  X, 
  Ticket, 
  ShieldCheck, 
  ChevronRight
} from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "https://www.codersera.in/" },
    { name: "Virtual Pass", href: "/", isCurrent: true },
    { name: "About", href: "https://www.codersera.in/about" },
    { name: "Events", href: "https://www.codersera.in/events" },
    { name: "Team", href: "https://www.codersera.in/team" },
    { name: "Community", href: "https://www.codersera.in/community" },
    { name: "Contact", href: "https://www.codersera.in/contact" },
  ];

  return (
    <>
      <header 
        className={`fixed top-4 left-0 right-0 z-50 mx-auto w-[95%] max-w-7xl rounded-full transition-all duration-300 border ${
          isScrolled 
            ? "bg-[#121215]/90 border-[#27272a] backdrop-blur-md py-3 px-6 shadow-xl" 
            : "bg-[#09090b]/60 border-[#27272a]/60 backdrop-blur-sm py-4 px-6"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo & Brand Name */}
          <Link className="flex items-center gap-3 group" href="/">
            <Image
              alt="CodersEra Logo"
              width={36}
              height={36}
              className="h-9 w-9 object-contain rounded-full border border-[#27272a] group-hover:scale-105 transition-transform"
              src="/codersera-logo-original.jpg"
              priority
            />
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">
                CodersEra
              </span>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#38bdf8] font-bold hidden sm:inline-block">
                Virtual Pass Portal
              </span>
            </div>
          </Link>

          {/* Central Pill Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-[#18181b]/70 rounded-full px-2 py-1 border border-[#27272a] backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                  link.isCurrent 
                    ? "bg-[#09090b] text-[#38bdf8] shadow-xs font-bold border border-[#38bdf8]/30" 
                    : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                <span className="relative z-10">{link.name}</span>
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-full bg-[#18181b] border border-[#27272a] text-[#a1a1aa] hover:text-white transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-500 rounded-full" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-[#121215] border border-[#27272a] p-4 shadow-2xl z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#27272a] font-bold text-white">
                    <span>Pass Portal Live</span>
                    <span className="text-[10px] text-[#38bdf8] font-mono">NIET Chapter</span>
                  </div>
                  <div className="py-3 space-y-2">
                    <p className="font-semibold text-white">
                      Single-Use Virtual Pass Registration
                    </p>
                    <p className="text-[#a1a1aa] leading-relaxed text-[11px]">
                      Enter your verified college credentials (@niet.co.in) and AKTU roll number to instantly generate your holographic pass.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Gate Verification Desk */}
            <Link
              href="/admin"
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#38bdf8] text-black text-xs font-extrabold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm shadow-[#38bdf8]/20"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Gate</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-[#18181b] border border-[#27272a] text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#09090b]/95 backdrop-blur-xl md:hidden pt-24 px-6 pb-12 overflow-y-auto animate-in fade-in duration-200 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-[#27272a]">
              <Image
                alt="CodersEra Logo"
                width={36}
                height={36}
                className="h-9 w-9 object-contain rounded-full border border-[#27272a]"
                src="/codersera-logo-original.jpg"
              />
              <div>
                <span className="font-extrabold text-base text-white block">CodersEra</span>
                <span className="text-xs text-[#a1a1aa]">Virtual Pass Portal • NIET Chapter</span>
              </div>
            </div>

            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-2xl text-sm font-semibold flex items-center justify-between transition-colors ${
                    link.isCurrent 
                      ? "bg-[#38bdf8]/10 text-[#38bdf8] font-bold border border-[#38bdf8]/20" 
                      : "text-[#a1a1aa] hover:text-white hover:bg-[#18181b]"
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </a>
              ))}
            </nav>

            <div className="pt-4 border-t border-[#27272a] space-y-3">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 rounded-2xl bg-[#38bdf8] text-black text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#38bdf8]/20"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Gate Verification Desk</span>
              </Link>
            </div>
          </div>

          <div className="pt-8 border-t border-[#27272a] text-center text-xs text-[#a1a1aa]">
            <p>© 2026 CodersEra Community • NIET Chapter</p>
          </div>
        </div>
      )}
    </>
  );
}
