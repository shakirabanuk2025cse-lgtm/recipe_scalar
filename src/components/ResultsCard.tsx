import React, { useState } from 'react';
import { ScaledResult } from '../types';
import { formatQuantity } from '../utils/scaler';
import { 
  Check, 
  Copy, 
  Printer, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface ResultsCardProps {
  result: ScaledResult;
  onReset: () => void;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({ result, onReset }) => {
  const [copied, setCopied] = useState(false);

  const factor = result.scalingFactor;
  const isScaledUp = factor > 1;
  const isScaledDown = factor < 1;
  const isSame = factor === 1;

  const handleCopy = async () => {
    const textLines = [
      `🍳 ${result.dishName} (Scaled Recipe)`,
      `Yield: ${result.desiredServings} servings (Original: ${result.originalServings} servings, ${factor.toFixed(2)}× multiplier)`,
      `Scaled Ingredients:`,
      ...result.ingredients.map(
        (ing, idx) =>
          `• ${ing.name}: ${formatQuantity(ing.newQuantity)} ${ing.unit}${
            ing.fractionDisplay ? ` (${ing.fractionDisplay})` : ''
          } [Original: ${formatQuantity(ing.originalQuantity)} ${ing.unit}]`
      ),
      `\nCalculated with Recipe Scaler at ${result.calculatedAt}`,
    ];

    try {
      await navigator.clipboard.writeText(textLines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section
      aria-labelledby="results-title"
      className="bg-white rounded-2xl border-2 border-[#2E6F40]/30 shadow-md p-6 sm:p-8 mt-8 transition-all relative overflow-hidden"
    >
      {/* Subtle decorative top bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2E6F40] via-emerald-500 to-[#2E6F40]" />

      {/* Header of Results Card */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-6 border-b border-[#E7E3DC]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EBF4ED] text-[#2E6F40] text-xs font-bold uppercase tracking-wider border border-[#CBE1D0]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6F40]" />
              Calculation Complete
            </span>
            <span className="text-xs text-[#7E8C7B] tabular-nums">
              Calculated at {result.calculatedAt}
            </span>
          </div>

          <h3
            id="results-title"
            className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1F271E] tracking-tight"
          >
            {result.dishName}
          </h3>

          <p className="text-sm text-[#586455] mt-1 flex items-center gap-2 flex-wrap">
            <span>Scaled for</span>
            <span className="font-bold text-[#1F271E] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E7E3DC] tabular-nums">
              {result.desiredServings} servings
            </span>
            <span>(originally {result.originalServings} servings)</span>
          </p>
        </div>

        {/* Multiplier Badge & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <div className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E7E3DC] text-right">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#7E8C7B]">
              Scaling Ratio
            </span>
            <div className="flex items-center gap-1 font-bold text-base text-[#1F271E] tabular-nums">
              {isScaledUp && <TrendingUp className="w-4 h-4 text-emerald-600" />}
              {isScaledDown && <TrendingDown className="w-4 h-4 text-amber-600" />}
              {isSame && <Scale className="w-4 h-4 text-slate-600" />}
              <span>{factor.toFixed(2)}×</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DCD6CC] bg-white hover:bg-[#FAF7F2] text-[#1F271E] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Copy scaled recipe to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#586455]" />
                  <span>Copy Recipe</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#DCD6CC] bg-white hover:bg-[#FAF7F2] text-[#586455] hover:text-[#1F271E] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Print scaled recipe"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Results Table / Breakdown */}
      <div className="my-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#586455]">
            Ingredient Quantity Adjustments
          </h4>
          <span className="text-xs text-[#7E8C7B]">
            Formula: Orig × {result.desiredServings} ÷ {result.originalServings}
          </span>
        </div>

        <div className="space-y-3">
          {result.ingredients.map((ing, idx) => {
            const formattedNew = formatQuantity(ing.newQuantity);
            const formattedOrig = formatQuantity(ing.originalQuantity);

            return (
              <div
                key={ing.id || idx}
                className="p-4 sm:p-4.5 rounded-xl bg-[#FAF7F2] border border-[#E7E3DC] hover:border-[#CBE1D0] transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                {/* Left: Ingredient Name & Details */}
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white border border-[#DCD6CC] text-[#2E6F40] text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="font-bold text-base text-[#1F271E]">
                      {ing.name}
                    </h5>
                    <p className="text-xs text-[#586455]">
                      Original: <span className="font-semibold tabular-nums">{formattedOrig}</span> {ing.unit}
                    </p>
                  </div>
                </div>

                {/* Right: Scaled Quantity & Fraction */}
                <div className="flex items-center sm:text-right gap-3 self-end sm:self-center">
                  <div>
                    <div className="flex items-baseline gap-1.5 sm:justify-end">
                      <span className="font-serif-display text-2xl font-bold text-[#2E6F40] tabular-nums">
                        {formattedNew}
                      </span>
                      <span className="text-sm font-bold text-[#1F271E] lowercase">
                        {ing.unit}
                      </span>
                    </div>

                    {ing.fractionDisplay && (
                      <span className="inline-block text-xs font-semibold text-[#586455] bg-white px-2 py-0.5 rounded border border-[#E7E3DC] mt-0.5">
                        ≈ {ing.fractionDisplay} {ing.unit}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Note & Footer Actions */}
      <div className="pt-5 border-t border-[#E7E3DC] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#586455]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2E6F40]" />
          <span>
            Recipe scaled with mathematical precision. Saved locally in your browser.
          </span>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs text-[#586455] hover:text-red-700 font-medium transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear Results & Start Over
        </button>
      </div>
    </section>
  );
};
