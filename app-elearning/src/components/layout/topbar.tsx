"use client";

import { GraduationCap, Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./search-bar";
import type { SearchDocument } from "@/lib/content";

interface TopbarProps {
  onMenuClick?: () => void;
  searchDocuments?: SearchDocument[];
}

export function Topbar({ onMenuClick, searchDocuments = [] }: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background/95 backdrop-blur-sm px-4 lg:px-6 shadow-fluent-1">
      {/* Mobile menu trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile logo */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-[#0078D4]">
          <GraduationCap className="h-4 w-4 text-white" aria-hidden />
        </div>
        <span className="font-semibold text-sm">PlanEstudio</span>
      </div>

      <div className="flex-1" />

      {searchDocuments.length > 0 && (
        <SearchBar documents={searchDocuments} />
      )}

      <ThemeToggle />
    </header>
  );
}
