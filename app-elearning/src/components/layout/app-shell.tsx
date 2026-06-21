"use client";

import { useState, useCallback } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import type { SearchDocument } from "@/lib/content";

interface AppShellProps {
  children: React.ReactNode;
  searchDocuments?: SearchDocument[];
}

export function AppShell({ children, searchDocuments = [] }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const openMenu = useCallback(() => setMobileOpen(true), []);
  const closeMenu = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={mobileOpen} onClose={closeMenu} />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar onMenuClick={openMenu} searchDocuments={searchDocuments} />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto p-4 lg:p-8 focus:outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
