export interface Ingredient {
  id: string;
  name: string;
  quantity: string; // string to handle raw input while typing (including decimals)
  unit: string;
}

export interface ScaledIngredient {
  id: string;
  name: string;
  originalQuantity: number;
  newQuantity: number;
  unit: string;
  fractionDisplay?: string;
}

export interface ScaledResult {
  dishName: string;
  originalServings: number;
  desiredServings: number;
  scalingFactor: number;
  ingredients: ScaledIngredient[];
  calculatedAt: string;
}

export interface RecipeFormData {
  dishName: string;
  originalServings: string;
  desiredServings: string;
  ingredients: [Ingredient, Ingredient, Ingredient];
}

export interface FormErrors {
  dishName?: string;
  originalServings?: string;
  desiredServings?: string;
  ingredients?: {
    name?: string;
    quantity?: string;
  }[];
  general?: string;
}
