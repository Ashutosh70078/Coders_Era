"use client";

import React, { createContext, useContext, useState } from "react";

export type PassModalTab = "generate" | "lookup" | "admin";

interface PassModalContextType {
  isOpen: boolean;
  activeTab: PassModalTab;
  openPassModal: (tab?: PassModalTab) => void;
  closePassModal: () => void;
  setActiveTab: (tab: PassModalTab) => void;
}

const PassModalContext = createContext<PassModalContextType | undefined>(undefined);

export function PassModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PassModalTab>("generate");

  const openPassModal = (tab: PassModalTab = "generate") => {
    setActiveTab(tab);
    setIsOpen(true);
  };

  const closePassModal = () => {
    setIsOpen(false);
  };

  return (
    <PassModalContext.Provider
      value={{
        isOpen,
        activeTab,
        openPassModal,
        closePassModal,
        setActiveTab,
      }}
    >
      {children}
    </PassModalContext.Provider>
  );
}

export function usePassModal() {
  const context = useContext(PassModalContext);
  if (!context) {
    throw new Error("usePassModal must be used within a PassModalProvider");
  }
  return context;
}
