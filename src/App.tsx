/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { RecipeFormData, FormErrors, ScaledResult } from './types';
import {
  validateRecipe,
  buildScaledResult,
  saveFormToLocalStorage,
  loadFormFromLocalStorage,
  saveResultToLocalStorage,
  loadResultFromLocalStorage,
  clearLocalStorageData,
} from './utils/scaler';
import { SAMPLE_PRESETS, INITIAL_EMPTY_FORM, DEFAULT_STARTER_FORM, RecipePreset } from './data/presets';
import { Header } from './components/Header';
import { RecipeForm } from './components/RecipeForm';
import { ResultsCard } from './components/ResultsCard';
import { QuickPresets } from './components/QuickPresets';
import { KitchenReference } from './components/KitchenReference';
import { Utensils, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  // 1. Initial State loaded from localStorage if present
  const [formData, setFormData] = useState<RecipeFormData>(() => {
    const saved = loadFormFromLocalStorage();
    return saved || DEFAULT_STARTER_FORM;
  });

  const [result, setResult] = useState<ScaledResult | null>(() => {
    return loadResultFromLocalStorage();
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [notification, setNotification] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Sync form inputs to localStorage on change
  useEffect(() => {
    saveFormToLocalStorage(formData);
  }, [formData]);

  // Sync latest valid result to localStorage
  useEffect(() => {
    saveResultToLocalStorage(result);
  }, [result]);

  // Display a brief notification toast
  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  // Field change handlers
  const handleDishNameChange = (val: string) => {
    setFormData((prev) => ({ ...prev, dishName: val }));
    if (errors.dishName) {
      setErrors((prev) => ({ ...prev, dishName: undefined }));
    }
  };

  const handleOriginalServingsChange = (val: string) => {
    setFormData((prev) => ({ ...prev, originalServings: val }));
    if (errors.originalServings) {
      setErrors((prev) => ({ ...prev, originalServings: undefined }));
    }
  };

  const handleDesiredServingsChange = (val: string) => {
    setFormData((prev) => ({ ...prev, desiredServings: val }));
    if (errors.desiredServings) {
      setErrors((prev) => ({ ...prev, desiredServings: undefined }));
    }
  };

  const handleIngredientChange = (
    index: number,
    field: 'name' | 'quantity' | 'unit',
    value: string
  ) => {
    setFormData((prev) => {
      const nextIngredients = [...prev.ingredients] as [
        typeof prev.ingredients[0],
        typeof prev.ingredients[1],
        typeof prev.ingredients[2]
      ];
      nextIngredients[index] = {
        ...nextIngredients[index],
        [field]: value,
      };
      return { ...prev, ingredients: nextIngredients };
    });

    if (errors.ingredients?.[index]?.[field as 'name' | 'quantity']) {
      setErrors((prev) => {
        if (!prev.ingredients) return prev;
        const nextIngErrors = [...prev.ingredients];
        nextIngErrors[index] = {
          ...nextIngErrors[index],
          [field]: undefined,
        };
        return { ...prev, ingredients: nextIngErrors };
      });
    }
  };

  // Quick serving adjustment handlers
  const handleQuickServingMultiply = (multiplier: number) => {
    const orig = Number(formData.originalServings) || 4;
    const newVal = (orig * multiplier).toString();
    setFormData((prev) => ({ ...prev, desiredServings: newVal }));
    if (errors.desiredServings) {
      setErrors((prev) => ({ ...prev, desiredServings: undefined }));
    }
  };

  const handleQuickServingAdd = (delta: number) => {
    const current = Number(formData.desiredServings) || Number(formData.originalServings) || 1;
    const nextVal = Math.max(1, Math.round(current + delta)).toString();
    setFormData((prev) => ({ ...prev, desiredServings: nextVal }));
    if (errors.desiredServings) {
      setErrors((prev) => ({ ...prev, desiredServings: undefined }));
    }
  };

  // Preset Selection
  const handleSelectPreset = (preset: RecipePreset) => {
    setFormData(preset.data);
    setErrors({});
    // Calculate right away for instant feedback
    const newResult = buildScaledResult(preset.data);
    setResult(newResult);
    triggerNotification(`Loaded "${preset.title}"`);

    // Smooth scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  // Main Scaling Handler
  const handleScale = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateRecipe(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      // Requirement 4: Do not display calculated results when validation fails
      setResult(null);
      triggerNotification('Please correct the highlighted form errors.');
      return;
    }

    // Form is completely valid!
    setErrors({});
    const newResult = buildScaledResult(formData);
    setResult(newResult);
    triggerNotification('Recipe scaled successfully!');

    // Smooth scroll to the results card
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  // Reset Handler
  const handleReset = () => {
    setFormData(INITIAL_EMPTY_FORM);
    setErrors({});
    setResult(null);
    clearLocalStorageData();
    triggerNotification('Form and results cleared.');
  };

  const hasActiveRecipe =
    Boolean(formData.dishName) ||
    Boolean(formData.originalServings) ||
    Boolean(result);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F271E] flex flex-col font-sans selection:bg-[#EBF4ED] selection:text-[#2E6F40]">
      {/* Toast Notification */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#1F271E] text-white text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 border border-stone-700 animate-slideUp"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Bar Contract (1-line wordmark, single-line links, 1 action) */}
      <Header
        onReset={handleReset}
        onOpenPresets={() => {
          const el = document.getElementById('presets-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        hasActiveRecipe={hasActiveRecipe}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Introduction */}
        <div className="text-center mb-8 sm:mb-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4ED] text-[#2E6F40] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#CBE1D0]">
            <Utensils className="w-3.5 h-3.5" />
            Precise Kitchen Math
          </div>
          <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#1F271E] tracking-tight text-balance">
            Proportional Recipe Scaler
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#586455] leading-relaxed text-balance">
            Effortlessly scale any recipe up or down. Enter your dish name, serving sizes, and 3 ingredients to calculate exact proportional quantities with decimal precision.
          </p>
        </div>

        {/* Quick Starter Presets Bar */}
        <div id="presets-section">
          <QuickPresets onSelectPreset={handleSelectPreset} />
        </div>

        {/* The Scaler Input Form */}
        <RecipeForm
          formData={formData}
          errors={errors}
          onChangeDishName={handleDishNameChange}
          onChangeOriginalServings={handleOriginalServingsChange}
          onChangeDesiredServings={handleDesiredServingsChange}
          onChangeIngredient={handleIngredientChange}
          onScale={handleScale}
          onReset={handleReset}
          onQuickServingMultiply={handleQuickServingMultiply}
          onQuickServingAdd={handleQuickServingAdd}
        />

        {/* The Calculated Results Card (displayed separately when valid) */}
        {result && (
          <div ref={resultsRef} className="animate-fadeIn">
            <ResultsCard result={result} onReset={handleReset} />
          </div>
        )}

        {/* Measurement Reference & Scaling Tips */}
        <KitchenReference />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E7E3DC] bg-[#FAF7F2] py-8 text-center text-xs text-[#7E8C7B]">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Recipe Scaler · Mathematical scaling for chefs and home cooks. Runs 100% locally offline.
          </p>
          <div className="flex items-center gap-4 text-[#586455]">
            <span>Formula: Qty × Desired ÷ Original</span>
            <span aria-hidden="true">·</span>
            <span>Local Storage Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
