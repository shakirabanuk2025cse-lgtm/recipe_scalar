import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Scale, Info, Flame } from 'lucide-react';

export const KitchenReference: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      id="kitchen-guide"
      className="mt-12 bg-white rounded-2xl border border-[#E7E3DC] p-6 sm:p-7 shadow-xs"
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#EBF4ED] text-[#2E6F40] flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif-display text-lg sm:text-xl font-bold text-[#1F271E]">
              Chef's Scaling Guide & Measurement Reference
            </h3>
            <p className="text-xs text-[#586455]">
              Quick conversion rules, decimal fractions, and scaling tips
            </p>
          </div>
        </div>

        <button
          type="button"
          className="p-1.5 rounded-lg text-[#586455] hover:bg-[#FAF7F2] transition-colors"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Collapse guide' : 'Expand guide'}
        >
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-6 pt-6 border-t border-[#E7E3DC] space-y-6 text-sm text-[#1F271E] animate-fadeIn">
          {/* Conversion Table Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7E3DC]">
              <div className="flex items-center gap-2 mb-2 text-[#2E6F40] font-bold text-xs uppercase tracking-wider">
                <Scale className="w-3.5 h-3.5" />
                Volume Conversions
              </div>
              <ul className="text-xs space-y-1.5 text-[#586455]">
                <li><strong className="text-[#1F271E]">1 cup</strong> = 16 tablespoons</li>
                <li><strong className="text-[#1F271E]">1 cup</strong> = 48 teaspoons</li>
                <li><strong className="text-[#1F271E]">1 cup</strong> ≈ 240 milliliters</li>
                <li><strong className="text-[#1F271E]">1 tbsp</strong> = 3 teaspoons (15 ml)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7E3DC]">
              <div className="flex items-center gap-2 mb-2 text-[#2E6F40] font-bold text-xs uppercase tracking-wider">
                <Info className="w-3.5 h-3.5" />
                Weight Conversions
              </div>
              <ul className="text-xs space-y-1.5 text-[#586455]">
                <li><strong className="text-[#1F271E]">1 ounce (oz)</strong> ≈ 28.35 grams</li>
                <li><strong className="text-[#1F271E]">1 pound (lb)</strong> = 16 oz ≈ 453.6 g</li>
                <li><strong className="text-[#1F271E]">1 stick butter</strong> = ½ cup = 113 g</li>
                <li><strong className="text-[#1F271E]">1 cup flour</strong> ≈ 120–125 grams</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7E3DC]">
              <div className="flex items-center gap-2 mb-2 text-[#2E6F40] font-bold text-xs uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5" />
                Golden Rules for Scaling
              </div>
              <ul className="text-xs space-y-1.5 text-[#586455]">
                <li><strong className="text-[#1F271E]">Spices & Salt:</strong> Scale up conservatively (start with 1.5× for 2× recipes).</li>
                <li><strong className="text-[#1F271E]">Leavening:</strong> Yeast and baking powder don't always need exact 1:1 multiplication.</li>
                <li><strong className="text-[#1F271E]">Pan Size:</strong> When scaling baking recipes, adjust your pan area or bake time.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
