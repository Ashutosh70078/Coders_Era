"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Layers, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  RefreshCw,
  Lock,
  Hash,
  Users,
  AlertCircle
} from "lucide-react";
import { registerStudentTicket } from "@/lib/ticket-store";
import { StudentTicket } from "@/lib/types";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import VirtualPass from "./VirtualPass";

// Strict College Domain Validation & Anti-Spam Rules
const NIET_COLLEGE_NAME = "Noida Institute of Engineering & Technology (NIET)";

const registrationSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters").max(60),
  email: z
    .string()
    .email("Enter a valid email address")
    .refine((val) => val.toLowerCase().endsWith("@niet.co.in"), {
      message: "Access Denied: Only official college email (@niet.co.in) is authorized for Automate India. Outside colleges/personal emails are blocked.",
    }),
  rollNumber: z
    .string()
    .min(10, "Roll number must be 10-14 digits")
    .max(14, "Roll number must be 10-14 digits")
    .regex(/^[0-9]+$/, "Roll number must contain digits only (e.g. 2201330100012)"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[+0-9\s-]+$/, "Invalid phone format"),
  college: z.literal(NIET_COLLEGE_NAME, {
    errorMap: () => ({ message: "Only enrolled students of NIET can register for this round." }),
  }),
  degreeBranch: z.string().min(2, "Degree & Branch is required (e.g., B.Tech CSE)"),
  yearOfStudy: z.enum(["1st Year", "2nd Year", "3rd Year", "4th Year"], {
    errorMap: () => ({ message: "Please select your year of study" }),
  }),
  teamName: z.string().min(3, "Team name must be at least 3 characters").max(40),
  teamRole: z.enum(["Team Leader", "Member"], {
    errorMap: () => ({ message: "Please select your role in the team" }),
  }),
  problemStatementId: z.string().min(3, "Enter Track ID (e.g. GenAI-01, Blockchain, or Automation)"),
  domain: z.enum([
    "Smart Automation & Robotics",
    "AI & Machine Learning",
    "Clean & Green Technology",
    "HealthTech & MedTech",
    "Cybersecurity & Blockchain",
    "Disaster Management",
    "Smart Education",
    "Open Innovation",
  ] as const, {
    errorMap: () => ({ message: "Please choose an Automate India Technical Track" }),
  }),
  securityCode: z.string().refine((val) => val.trim() === "133", {
    message: "Incorrect Campus Security Code. (Hint: AKTU College Code for NIET is 133)",
  }),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function TicketForm() {
  const [createdTicket, setCreatedTicket] = useState<StudentTicket | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      rollNumber: "",
      phone: "",
      college: NIET_COLLEGE_NAME,
      degreeBranch: "",
      yearOfStudy: "3rd Year",
      teamName: "",
      teamRole: "Team Leader",
      problemStatementId: "SIH-1521",
      domain: "AI & Machine Learning",
      securityCode: "133",
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate cryptographic verification
      await new Promise((r) => setTimeout(r, 450));
      
      const ticket = registerStudentTicket(data);
      setCreatedTicket(ticket);

      toast.success("SIH Virtual Pass Issued!", {
        description: `Ticket ID: ${ticket.ticketId} | Suffix: ${ticket.suffix}`,
      });

      // Fire festive confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00f0ff", "#8b5cf6", "#ec4899", "#10b981"],
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate pass. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFormError = (formErrors: any) => {
    if (formErrors.email) {
      toast.error("Restricted to NIET Enrolled Students", {
        description: "Registrations strictly require an official college email (@niet.co.in).",
      });
    } else if (formErrors.rollNumber) {
      toast.error("Valid AKTU Roll Number Required", {
        description: formErrors.rollNumber.message || "Please enter a valid 10-14 digit AKTU Roll Number.",
      });
    } else if (formErrors.securityCode) {
      toast.error("Campus Security Code Required", {
        description: "AKTU College Code for NIET is 133.",
      });
    } else {
      toast.error("Registration Details Required", {
        description: "Please ensure all fields are filled accurately with your NIET details.",
      });
    }
  };

  const handleRegisterAnother = () => {
    setCreatedTicket(null);
    reset();
  };

  return (
    <div className="w-full">
      {createdTicket ? (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in zoom-in duration-300">
          <div className="text-center space-y-2 px-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>COLLEGE CREDENTIALS VERIFIED • PASS ALLOCATED</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
              Automate India 2026 Pass Successfully Generated!
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Assigned unique Ticket ID and Suffix. Present this pass at the Seminar Hall entry desk on the event day.
            </p>
          </div>

          <VirtualPass ticket={createdTicket} />

          <div className="flex justify-center pt-2 sm:pt-4">
            <button
              onClick={handleRegisterAnother}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-500 transition-all cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5 text-cyber-neon" />
              <span>Register Another Teammate</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto glass-panel-glow rounded-2xl p-4 sm:p-7 md:p-8">
          {/* Header */}
          <div className="border-b border-slate-800/80 pb-4 mb-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-cyber-neon uppercase tracking-wider flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="h-4 w-4 text-cyber-cyan" />
                  College Student Verification Gate
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Automate India Pass Registration
                </h2>
              </div>
              <div className="h-10 w-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center shrink-0">
                <Lock className="h-5 w-5 text-cyber-neon" />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-4 sm:space-y-5">
            {/* Full Name & Roll Number Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    {...register("fullName")}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan text-sm text-white placeholder-slate-500 font-sans outline-none transition-all"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-rose-400 text-xs font-mono mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                  College / AKTU Roll Number <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Hash className="h-4 w-4" />
                  </div>
                  <input
                    {...register("rollNumber")}
                    placeholder="e.g. 2201330100012"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan text-sm text-white placeholder-slate-500 font-mono outline-none transition-all"
                  />
                </div>
                {errors.rollNumber && (
                  <p className="text-rose-400 text-xs font-mono mt-1">{errors.rollNumber.message}</p>
                )}
              </div>
            </div>

            {/* Official College Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                  Official College Email (@niet.co.in) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="student.cse22@niet.co.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan text-sm text-white placeholder-slate-500 font-mono outline-none transition-all"
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-400 text-xs font-mono mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                  WhatsApp / Phone Number <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    {...register("phone")}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan text-sm text-white placeholder-slate-500 font-sans outline-none transition-all"
                  />
                </div>
                {errors.phone && (
                  <p className="text-rose-400 text-xs font-mono mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Locked College & Degree Branch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase flex items-center justify-between">
                  <span>Host Institution</span>
                  <span className="text-[10px] text-cyber-neon font-bold">LOCKED TO NIET</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyber-neon">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    {...register("college")}
                    readOnly
                    value={NIET_COLLEGE_NAME}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                  Degree &amp; Branch <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <input
                    {...register("degreeBranch")}
                    placeholder="e.g. B.Tech CSE (Core / AIML / Cyber)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan text-sm text-white placeholder-slate-500 font-sans outline-none transition-all"
                  />
                </div>
                {errors.degreeBranch && (
                  <p className="text-rose-400 text-xs font-mono mt-1">{errors.degreeBranch.message}</p>
                )}
              </div>
            </div>

            {/* Team Name, Role & Problem Statement ID */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                  SIH Team Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Users className="h-4 w-4" />
                  </div>
                  <input
                    {...register("teamName")}
                    placeholder="e.g. CodeCrafters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan text-sm text-white placeholder-slate-500 font-sans outline-none transition-all"
                  />
                </div>
                {errors.teamName && (
                  <p className="text-rose-400 text-xs font-mono mt-1">{errors.teamName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                  Team Role <span className="text-rose-400">*</span>
                </label>
                <select
                  {...register("teamRole")}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan text-sm text-white font-sans outline-none transition-all cursor-pointer"
                >
                  <option value="Team Leader">Team Leader</option>
                  <option value="Member">Team Member</option>
                </select>
                {errors.teamRole && (
                  <p className="text-rose-400 text-xs font-mono mt-1">{errors.teamRole.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                  Problem Statement ID <span className="text-rose-400">*</span>
                </label>
                <input
                  {...register("problemStatementId")}
                  placeholder="e.g. SIH-1520"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan text-sm text-white placeholder-slate-500 font-mono outline-none transition-all"
                />
                {errors.problemStatementId && (
                  <p className="text-rose-400 text-xs font-mono mt-1">{errors.problemStatementId.message}</p>
                )}
              </div>
            </div>

            {/* Year of Study & SIH Domain Theme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                  Year of Study <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <select
                    {...register("yearOfStudy")}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan text-sm text-white font-sans outline-none transition-all cursor-pointer"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                  SIH 2026 Theme <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Layers className="h-4 w-4" />
                  </div>
                  <select
                    {...register("domain")}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan text-sm text-white font-sans outline-none transition-all cursor-pointer"
                  >
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
            </div>

            {/* Anti-Bot Security Verification */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-slate-300 uppercase flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-cyber-neon" />
                  Campus Human Security Challenge
                </label>
                <span className="text-[10px] font-mono text-slate-400">Anti-Spam Filter</span>
              </div>
              <p className="text-xs text-slate-400">
                Enter the official AKTU institute code for NIET Greater Noida (Answer: <code className="text-cyber-neon font-bold">133</code>):
              </p>
              <input
                {...register("securityCode")}
                placeholder="Enter 133"
                className="w-36 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-cyber-neon text-xs font-mono text-white outline-none"
              />
              {errors.securityCode && (
                <p className="text-rose-400 text-xs font-mono">{errors.securityCode.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full group relative flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-mono font-bold text-sm tracking-wider shadow-lg shadow-violet-900/40 hover:shadow-cyan-900/50 transition-all duration-300 active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Validating College Credentials...</span>
              ) : (
                <>
                  <span>GENERATE VERIFIED SIH PASS</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
