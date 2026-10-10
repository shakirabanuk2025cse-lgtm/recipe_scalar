import React from 'react';
import { SAMPLE_PRESETS, RecipePreset } from '../data/presets';
import { Sparkles, Cookie, Pizza, Utensils } from 'lucide-react';

interface QuickPresetsProps {
  onSelectPreset: (preset: RecipePreset) => void;
}

export const QuickPresets: React.FC<QuickPresetsProps> = ({ onSelectPreset }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cookie':
        return <Cookie className="w-4 h-4 text-amber-700" />;
      case 'Pizza':
        return <Pizza className="w-4 h-4 text-red-600" />;
      default:
        return <Utensils className="w-4 h-4 text-[#2E6F40]" />;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2E6F40]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1F271E]">
            Quick Starter Recipes
          </h3>
        </div>
        <span className="text-xs text-[#7E8C7B]">
          Click to pre-fill and test immediately
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SAMPLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPreset(preset)}
            className="group p-3.5 rounded-xl bg-white border border-[#E7E3DC] hover:border-[#2E6F40] hover:shadow-xs transition-all text-left flex items-start gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] group-hover:bg-[#EBF4ED] flex items-center justify-center shrink-0 transition-colors">
              {getIcon(preset.iconName)}
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-sm text-[#1F271E] group-hover:text-[#2E6F40] transition-colors truncate">
                {preset.title}
              </h4>
              <p className="text-xs text-[#7E8C7B] truncate mt-0.5">
                {preset.subtitle}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
