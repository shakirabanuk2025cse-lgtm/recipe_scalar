import React from 'react';
import { RecipeFormData, FormErrors } from '../types';
import { COMMON_UNITS } from '../utils/scaler';
import { AlertCircle, RotateCcw, Calculator, ArrowRight, UtensilsCrossed } from 'lucide-react';

interface RecipeFormProps {
  formData: RecipeFormData;
  errors: FormErrors;
  onChangeDishName: (value: string) => void;
  onChangeOriginalServings: (value: string) => void;
  onChangeDesiredServings: (value: string) => void;
  onChangeIngredient: (index: number, field: 'name' | 'quantity' | 'unit', value: string) => void;
  onScale: (e: React.FormEvent) => void;
  onReset: () => void;
  onQuickServingMultiply: (multiplier: number) => void;
  onQuickServingAdd: (delta: number) => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({
  formData,
  errors,
  onChangeDishName,
  onChangeOriginalServings,
  onChangeDesiredServings,
  onChangeIngredient,
  onScale,
  onReset,
  onQuickServingMultiply,
  onQuickServingAdd,
}) => {
  const hasErrors =
    Boolean(errors.dishName) ||
    Boolean(errors.originalServings) ||
    Boolean(errors.desiredServings) ||
    Boolean(errors.ingredients?.some((ing) => ing?.name || ing?.quantity));

  // Calculate live preview ratio if both numbers are valid
  const origNum = Number(formData.originalServings);
  const desNum = Number(formData.desiredServings);
  const showRatio = origNum > 0 && desNum > 0 && isFinite(origNum) && isFinite(desNum);
  const ratio = showRatio ? (desNum / origNum).toFixed(2) : null;

  return (
    <form
      id="scaler-form"
      onSubmit={onScale}
      noValidate
      className="bg-white rounded-2xl border border-[#E7E3DC] p-6 sm:p-8 shadow-sm transition-all"
    >
      {/* Card Header */}
      <div className="pb-6 border-b border-[#E7E3DC]/70 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-semibold tracking-wider text-[#2E6F40] uppercase">
            Step 1 · Enter Recipe Data
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1F271E] mt-0.5">
            Recipe Ingredients & Servings
          </h2>
        </div>
        {showRatio && (
          <div className="self-start sm:self-center px-3.5 py-1.5 rounded-full bg-[#EBF4ED] text-[#2E6F40] text-xs font-semibold flex items-center gap-1.5 border border-[#CBE1D0]">
            <span>Multiplier:</span>
            <span className="font-bold text-sm tabular-nums">{ratio}×</span>
          </div>
        )}
      </div>

      {/* Global Validation Banner if any error */}
      {hasErrors && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-6 p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 flex items-start gap-3 text-sm animate-fadeIn"
        >
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-950">
              Please fix the following recipe issues before scaling:
            </p>
            <ul className="list-disc pl-4 text-xs space-y-0.5 text-amber-800">
              {errors.dishName && <li>{errors.dishName}</li>}
              {errors.originalServings && <li>{errors.originalServings}</li>}
              {errors.desiredServings && <li>{errors.desiredServings}</li>}
              {errors.ingredients?.map((ing, i) => (
                <React.Fragment key={i}>
                  {ing?.name && <li>Ingredient {i + 1}: {ing.name}</li>}
                  {ing?.quantity && <li>Ingredient {i + 1}: {ing.quantity}</li>}
                </React.Fragment>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Section 1: Dish Name */}
      <div className="mb-6">
        <label
          htmlFor="dishName"
          className="block text-sm font-semibold text-[#1F271E] mb-1.5"
        >
          Dish Name <span className="text-red-500 font-normal">*</span>
        </label>
        <div className="relative">
          <input
            id="dishName"
            type="text"
            value={formData.dishName}
            onChange={(e) => onChangeDishName(e.target.value)}
            placeholder="e.g., Rustic Sourdough Loaf, Chocolate Lava Cake"
            aria-invalid={Boolean(errors.dishName)}
            aria-describedby={errors.dishName ? 'dishName-error' : undefined}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm sm:text-base transition-colors bg-[#FAF7F2]/40 focus:bg-white focus:outline-none focus:ring-2 ${
              errors.dishName
                ? 'border-red-400 focus:border-red-500 focus:ring-red-100 text-red-950'
                : 'border-[#DCD6CC] focus:border-[#2E6F40] focus:ring-[#EBF4ED] text-[#1F271E]'
            }`}
          />
        </div>
        {errors.dishName && (
          <p id="dishName-error" className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.dishName}
          </p>
        )}
      </div>

      {/* Section 2: Servings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 p-4 sm:p-5 rounded-xl bg-[#FAF7F2] border border-[#E7E3DC]">
        {/* Original Servings */}
        <div>
          <label
            htmlFor="originalServings"
            className="block text-sm font-semibold text-[#1F271E] mb-1"
          >
            Original Servings <span className="text-red-500 font-normal">*</span>
          </label>
          <p className="text-xs text-[#586455] mb-2">
            The quantity the original recipe yields (e.g., 4)
          </p>
          <div className="relative">
            <input
              id="originalServings"
              type="number"
              step="any"
              min="0.1"
              value={formData.originalServings}
              onChange={(e) => onChangeOriginalServings(e.target.value)}
              placeholder="e.g., 4"
              aria-invalid={Boolean(errors.originalServings)}
              aria-describedby={errors.originalServings ? 'orig-servings-error' : undefined}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm sm:text-base font-medium tabular-nums transition-colors bg-white focus:outline-none focus:ring-2 ${
                errors.originalServings
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                  : 'border-[#DCD6CC] focus:border-[#2E6F40] focus:ring-[#EBF4ED]'
              }`}
            />
          </div>
          {errors.originalServings && (
            <p id="orig-servings-error" className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.originalServings}
            </p>
          )}
        </div>

        {/* Desired Servings */}
        <div>
          <label
            htmlFor="desiredServings"
            className="block text-sm font-semibold text-[#1F271E] mb-1"
          >
            Desired Servings <span className="text-red-500 font-normal">*</span>
          </label>
          <p className="text-xs text-[#586455] mb-2">
            How many portions you wish to prepare (e.g., 8)
          </p>
          <div className="relative">
            <input
              id="desiredServings"
              type="number"
              step="any"
              min="0.1"
              value={formData.desiredServings}
              onChange={(e) => onChangeDesiredServings(e.target.value)}
              placeholder="e.g., 8"
              aria-invalid={Boolean(errors.desiredServings)}
              aria-describedby={errors.desiredServings ? 'desired-servings-error' : undefined}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm sm:text-base font-medium tabular-nums transition-colors bg-white focus:outline-none focus:ring-2 ${
                errors.desiredServings
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                  : 'border-[#DCD6CC] focus:border-[#2E6F40] focus:ring-[#EBF4ED]'
              }`}
            />
          </div>

          {/* Quick serving adjustment pills */}
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-[#7E8C7B] font-medium mr-1">Quick scale:</span>
            <button
              type="button"
              onClick={() => onQuickServingMultiply(0.5)}
              className="px-2 py-0.5 text-xs font-medium rounded bg-white hover:bg-[#EFECE5] border border-[#DCD6CC] text-[#586455] transition-colors"
              title="Half yield (0.5×)"
            >
              ½×
            </button>
            <button
              type="button"
              onClick={() => onQuickServingMultiply(2)}
              className="px-2 py-0.5 text-xs font-medium rounded bg-white hover:bg-[#EFECE5] border border-[#DCD6CC] text-[#586455] transition-colors"
              title="Double yield (2×)"
            >
              2×
            </button>
            <button
              type="button"
              onClick={() => onQuickServingMultiply(3)}
              className="px-2 py-0.5 text-xs font-medium rounded bg-white hover:bg-[#EFECE5] border border-[#DCD6CC] text-[#586455] transition-colors"
              title="Triple yield (3×)"
            >
              3×
            </button>
            <button
              type="button"
              onClick={() => onQuickServingAdd(1)}
              className="px-2 py-0.5 text-xs font-medium rounded bg-white hover:bg-[#EFECE5] border border-[#DCD6CC] text-[#586455] transition-colors"
              title="Add 1 serving"
            >
              +1
            </button>
            <button
              type="button"
              onClick={() => onQuickServingAdd(-1)}
              className="px-2 py-0.5 text-xs font-medium rounded bg-white hover:bg-[#EFECE5] border border-[#DCD6CC] text-[#586455] transition-colors"
              title="Subtract 1 serving"
            >
              -1
            </button>
          </div>

          {errors.desiredServings && (
            <p id="desired-servings-error" className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.desiredServings}
            </p>
          )}
        </div>
      </div>

      {/* Section 3: Three Ingredients */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-[#1F271E] flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-[#2E6F40]" />
              Recipe Ingredients (3 Required)
            </h3>
            <p className="text-xs text-[#586455] mt-0.5">
              Enter each ingredient with its original quantity and measurement unit
            </p>
          </div>
          <span className="text-xs font-medium text-[#7E8C7B] bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#E7E3DC]">
            Decimals allowed (e.g. 1.5, 0.75)
          </span>
        </div>

        {/* Desktop Table Headers */}
        <div className="hidden sm:grid sm:grid-cols-12 gap-3 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#7E8C7B] border-b border-[#E7E3DC]">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5">Ingredient Name</div>
          <div className="col-span-3">Original Quantity</div>
          <div className="col-span-3">Measurement Unit</div>
        </div>

        {/* Ingredient Rows */}
        <div className="divide-y divide-[#E7E3DC]/70 space-y-4 sm:space-y-0 sm:divide-y">
          {formData.ingredients.map((ingredient, index) => {
            const ingErr = errors.ingredients?.[index];
            const rowNumber = index + 1;

            return (
              <div
                key={ingredient.id || index}
                className="pt-4 sm:py-3.5 sm:grid sm:grid-cols-12 sm:gap-3 sm:items-start"
              >
                {/* Index badge */}
                <div className="hidden sm:flex col-span-1 items-center justify-center pt-2">
                  <span className="w-6 h-6 rounded-full bg-[#EBF4ED] text-[#2E6F40] text-xs font-bold flex items-center justify-center">
                    {rowNumber}
                  </span>
                </div>

                {/* Mobile label */}
                <div className="sm:hidden flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-[#EBF4ED] text-[#2E6F40] text-xs font-bold flex items-center justify-center">
                    {rowNumber}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#586455]">
                    Ingredient #{rowNumber}
                  </span>
                </div>

                {/* Ingredient Name */}
                <div className="sm:col-span-5 mb-2.5 sm:mb-0">
                  <label htmlFor={`ingredient-name-${index}`} className="sr-only sm:not-sr-only sm:sr-only">
                    Ingredient {rowNumber} Name
                  </label>
                  <input
                    id={`ingredient-name-${index}`}
                    type="text"
                    value={ingredient.name}
                    onChange={(e) => onChangeIngredient(index, 'name', e.target.value)}
                    placeholder={`e.g., ${index === 0 ? 'All-Purpose Flour' : index === 1 ? 'Granulated Sugar' : 'Unsalted Butter'}`}
                    aria-invalid={Boolean(ingErr?.name)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors bg-[#FAF7F2]/30 focus:bg-white focus:outline-none focus:ring-2 ${
                      ingErr?.name
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                        : 'border-[#DCD6CC] focus:border-[#2E6F40] focus:ring-[#EBF4ED]'
                    }`}
                  />
                  {ingErr?.name && (
                    <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {ingErr.name}
                    </p>
                  )}
                </div>

                {/* Original Quantity */}
                <div className="grid grid-cols-2 sm:grid-cols-6 sm:col-span-6 gap-2">
                  <div className="sm:col-span-3">
                    <label htmlFor={`ingredient-qty-${index}`} className="block sm:hidden text-xs text-[#586455] mb-1">
                      Quantity
                    </label>
                    <input
                      id={`ingredient-qty-${index}`}
                      type="number"
                      step="any"
                      min="0.001"
                      value={ingredient.quantity}
                      onChange={(e) => onChangeIngredient(index, 'quantity', e.target.value)}
                      placeholder="e.g., 2.5"
                      aria-invalid={Boolean(ingErr?.quantity)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm font-medium tabular-nums transition-colors bg-[#FAF7F2]/30 focus:bg-white focus:outline-none focus:ring-2 ${
                        ingErr?.quantity
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                          : 'border-[#DCD6CC] focus:border-[#2E6F40] focus:ring-[#EBF4ED]'
                      }`}
                    />
                    {ingErr?.quantity && (
                      <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {ingErr.quantity}
                      </p>
                    )}
                  </div>

                  {/* Unit Selector */}
                  <div className="sm:col-span-3">
                    <label htmlFor={`ingredient-unit-${index}`} className="block sm:hidden text-xs text-[#586455] mb-1">
                      Unit
                    </label>
                    <select
                      id={`ingredient-unit-${index}`}
                      value={ingredient.unit}
                      onChange={(e) => onChangeIngredient(index, 'unit', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#DCD6CC] text-sm bg-white focus:outline-none focus:border-[#2E6F40] focus:ring-2 focus:ring-[#EBF4ED] capitalize cursor-pointer text-[#1F271E]"
                    >
                      {COMMON_UNITS.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="pt-6 border-t border-[#E7E3DC] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
        <button
          type="button"
          onClick={onReset}
          className="order-2 sm:order-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#DCD6CC] bg-white hover:bg-[#FAF7F2] text-[#586455] hover:text-[#1F271E] font-semibold text-sm transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Form
        </button>

        <button
          type="submit"
          className="order-1 sm:order-2 inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#2E6F40] hover:bg-[#245833] text-white font-semibold text-base shadow-sm hover:shadow transition-all cursor-pointer group"
        >
          <Calculator className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span>Scale Recipe</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
};
