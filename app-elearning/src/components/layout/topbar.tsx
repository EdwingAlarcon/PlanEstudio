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
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
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
        <GraduationCap className="h-5 w-5 text-primary" aria-hidden />
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
