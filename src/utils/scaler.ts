import { RecipeFormData, ScaledResult, ScaledIngredient, FormErrors } from '../types';

export const STORAGE_KEYS = {
  FORM: 'recipe_scaler_form_data_v1',
  RESULT: 'recipe_scaler_latest_result_v1',
};

export const COMMON_UNITS = [
  'grams',
  'cups',
  'tablespoons',
  'teaspoons',
  'pieces',
  'milliliters',
  'ounces',
  'pounds',
  'slices',
  'cloves',
  'pinches',
  'custom',
] as const;

/**
 * Calculates scaled quantity using formula:
 * New quantity = Original quantity × Desired servings ÷ Original servings
 */
export function calculateNewQuantity(
  originalQuantity: number,
  desiredServings: number,
  originalServings: number
): number {
  if (originalServings <= 0) return 0;
  return (originalQuantity * desiredServings) / originalServings;
}

/**
 * Formats decimal numbers cleanly:
 * - Whole integers: "4"
 * - Round decimals: "1.5", "0.75"
 * - Replaces floating-point imprecision (e.g. 1.3333333333333335 -> 1.333)
 */
export function formatQuantity(val: number): string {
  if (Number.isInteger(val)) {
    return val.toString();
  }
  
  // Round to up to 3 decimal places to keep precision high while preventing floating point errors
  const fixed = val.toFixed(3);
  // Strip trailing zeros after decimal point
  const trimmed = parseFloat(fixed).toString();
  return trimmed;
}

/**
 * Converts decimal numbers to familiar culinary fraction strings
 * e.g., 0.5 -> "½", 1.25 -> "1 ¼", 2.33 -> "2 ⅓"
 */
export function getCookingFraction(val: number): string | null {
  if (val <= 0) return null;
  
  const whole = Math.floor(val);
  const frac = val - whole;

  const fractions: [number, string][] = [
    [0.125, '⅛'],
    [0.166, '⅙'],
    [0.2, '⅕'],
    [0.25, '¼'],
    [0.333, '⅓'],
    [0.375, '⅜'],
    [0.5, '½'],
    [0.625, '⅝'],
    [0.666, '⅔'],
    [0.75, '¾'],
    [0.833, '⅚'],
    [0.875, '⅞'],
  ];

  for (const [target, glyph] of fractions) {
    if (Math.abs(frac - target) < 0.04) {
      return whole > 0 ? `${whole} ${glyph}` : glyph;
    }
  }

  return null;
}

/**
 * Validates the entire recipe form according to the strict requirements:
 * - Dish name not empty
 * - Servings numbers not empty, > 0, and valid numbers
 * - All three ingredients have non-empty names and valid quantities > 0
 */
export function validateRecipe(formData: RecipeFormData): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {
    ingredients: [{}, {}, {}],
  };
  let isValid = true;

  // 1. Dish name
  if (!formData.dishName || formData.dishName.trim() === '') {
    errors.dishName = 'Please enter a dish name.';
    isValid = false;
  }

  // 2. Original servings
  const origTrimmed = formData.originalServings.trim();
  if (!origTrimmed) {
    errors.originalServings = 'Original servings is required.';
    isValid = false;
  } else {
    const origNum = Number(origTrimmed);
    if (isNaN(origNum) || !isFinite(origNum)) {
      errors.originalServings = 'Original servings must be a valid number.';
      isValid = false;
    } else if (origNum <= 0) {
      errors.originalServings = 'Original servings must be greater than zero.';
      isValid = false;
    }
  }

  // 3. Desired servings
  const desiredTrimmed = formData.desiredServings.trim();
  if (!desiredTrimmed) {
    errors.desiredServings = 'Desired servings is required.';
    isValid = false;
  } else {
    const desiredNum = Number(desiredTrimmed);
    if (isNaN(desiredNum) || !isFinite(desiredNum)) {
      errors.desiredServings = 'Desired servings must be a valid number.';
      isValid = false;
    } else if (desiredNum <= 0) {
      errors.desiredServings = 'Desired servings must be greater than zero.';
      isValid = false;
    }
  }

  // 4. Three ingredients
  formData.ingredients.forEach((ing, index) => {
    const ingErrors: { name?: string; quantity?: string } = {};

    if (!ing.name || ing.name.trim() === '') {
      ingErrors.name = `Ingredient ${index + 1} name is required.`;
      isValid = false;
    }

    const qtyTrimmed = ing.quantity.trim();
    if (!qtyTrimmed) {
      ingErrors.quantity = `Ingredient ${index + 1} quantity is required.`;
      isValid = false;
    } else {
      const qtyNum = Number(qtyTrimmed);
      if (isNaN(qtyNum) || !isFinite(qtyNum)) {
        ingErrors.quantity = `Quantity must be a valid number.`;
        isValid = false;
      } else if (qtyNum <= 0) {
        ingErrors.quantity = `Quantity must be greater than 0.`;
        isValid = false;
      }
    }

    if (errors.ingredients) {
      errors.ingredients[index] = ingErrors;
    }
  });

  return { isValid, errors };
}

/**
 * Builds the scaled result object given valid form input
 */
export function buildScaledResult(formData: RecipeFormData): ScaledResult {
  const origServings = Number(formData.originalServings);
  const desServings = Number(formData.desiredServings);
  const scalingFactor = desServings / origServings;

  const ingredients: ScaledIngredient[] = formData.ingredients.map((ing) => {
    const origQty = Number(ing.quantity);
    const newQty = calculateNewQuantity(origQty, desServings, origServings);
    const fractionDisplay = getCookingFraction(newQty) || undefined;

    return {
      id: ing.id,
      name: ing.name.trim(),
      originalQuantity: origQty,
      newQuantity: newQty,
      unit: ing.unit,
      fractionDisplay,
    };
  });

  return {
    dishName: formData.dishName.trim(),
    originalServings: origServings,
    desiredServings: desServings,
    scalingFactor,
    ingredients,
    calculatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

/**
 * Safe LocalStorage helpers
 */
export function saveFormToLocalStorage(formData: RecipeFormData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FORM, JSON.stringify(formData));
  } catch (e) {
    console.error('Failed to save form to localStorage', e);
  }
}

export function loadFormFromLocalStorage(): RecipeFormData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FORM);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (
      parsed &&
      Array.isArray(parsed.ingredients) &&
      parsed.ingredients.length === 3
    ) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load form from localStorage', e);
  }
  return null;
}

export function saveResultToLocalStorage(result: ScaledResult | null): void {
  try {
    if (result) {
      localStorage.setItem(STORAGE_KEYS.RESULT, JSON.stringify(result));
    } else {
      localStorage.removeItem(STORAGE_KEYS.RESULT);
    }
  } catch (e) {
    console.error('Failed to save result to localStorage', e);
  }
}

export function loadResultFromLocalStorage(): ScaledResult | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RESULT);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load result from localStorage', e);
  }
  return null;
}

export function clearLocalStorageData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.FORM);
    localStorage.removeItem(STORAGE_KEYS.RESULT);
  } catch (e) {
    console.error('Failed to clear localStorage data', e);
  }
}
