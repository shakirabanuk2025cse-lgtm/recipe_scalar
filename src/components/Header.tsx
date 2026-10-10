import React from 'react';
import { ChefHat, Sparkles, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenPresets: () => void;
  hasActiveRecipe: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onOpenPresets, hasActiveRecipe }) => {
  return (
    <header className="border-b border-[#E7E3DC] bg-[#FAF7F2]/90 backdrop-blur-sm sticky top-0 z-30 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#2E6F40] text-white flex items-center justify-center shadow-xs">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <a href="#" className="font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-[#1F271E] block leading-none">
              Recipe Scaler
            </a>
            <span className="text-[11px] font-medium text-[#7E8C7B] tracking-wide">
              Kitchen Portion Calculator
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#586455]">
          <a href="#scaler-form" className="hover:text-[#2E6F40] transition-colors whitespace-nowrap">
            Recipe Calculator
          </a>
          <button 
            type="button"
            onClick={onOpenPresets}
            className="hover:text-[#2E6F40] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2E6F40]" />
            Sample Recipes
          </button>
          <a href="#kitchen-guide" className="hover:text-[#2E6F40] transition-colors whitespace-nowrap">
            Scaling Guide
          </a>
        </nav>

        {/* Zone 3: Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenPresets}
            className="md:hidden px-2.5 py-1.5 text-xs font-semibold text-[#2E6F40] bg-[#EBF4ED] hover:bg-[#DCEEE0] rounded-lg transition-colors whitespace-nowrap"
          >
            Presets
          </button>
          {hasActiveRecipe && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#586455] hover:text-[#1F271E] hover:bg-[#EFECE5] rounded-lg border border-[#DCD6CC] transition-colors whitespace-nowrap"
              title="Reset current form"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Form</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
