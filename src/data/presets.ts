import { RecipeFormData } from '../types';

export interface RecipePreset {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  data: RecipeFormData;
}

export const SAMPLE_PRESETS: RecipePreset[] = [
  {
    id: 'cookies',
    title: 'Chocolate Chip Cookies',
    subtitle: '12 cookies → 24 cookies (2× scale)',
    iconName: 'Cookie',
    data: {
      dishName: 'Bakery-Style Chocolate Chip Cookies',
      originalServings: '12',
      desiredServings: '24',
      ingredients: [
        { id: 'ing-1', name: 'All-Purpose Flour', quantity: '2.25', unit: 'cups' },
        { id: 'ing-2', name: 'Unsalted Butter', quantity: '1', unit: 'cups' },
        { id: 'ing-3', name: 'Semi-Sweet Chocolate Chips', quantity: '1.75', unit: 'cups' },
      ],
    },
  },
  {
    id: 'pizza',
    title: 'Neapolitan Pizza Dough',
    subtitle: '4 pizzas → 6 pizzas (1.5× scale)',
    iconName: 'Pizza',
    data: {
      dishName: 'Authentic Neapolitan Pizza Dough',
      originalServings: '4',
      desiredServings: '6',
      ingredients: [
        { id: 'ing-1', name: 'Tipo 00 Flour', quantity: '500', unit: 'grams' },
        { id: 'ing-2', name: 'Lukewarm Water', quantity: '325', unit: 'milliliters' },
        { id: 'ing-3', name: 'Extra Virgin Olive Oil', quantity: '2', unit: 'tablespoons' },
      ],
    },
  },
  {
    id: 'garlic-chicken',
    title: 'Tuscan Garlic Chicken',
    subtitle: '4 portions → 10 portions (Family dinner)',
    iconName: 'Utensils',
    data: {
      dishName: 'Creamy Tuscan Garlic Chicken',
      originalServings: '4',
      desiredServings: '10',
      ingredients: [
        { id: 'ing-1', name: 'Chicken Breast Cutlets', quantity: '4', unit: 'pieces' },
        { id: 'ing-2', name: 'Heavy Whipping Cream', quantity: '1.25', unit: 'cups' },
        { id: 'ing-3', name: 'Grated Parmesan', quantity: '0.75', unit: 'cups' },
      ],
    },
  },
];

export const INITIAL_EMPTY_FORM: RecipeFormData = {
  dishName: '',
  originalServings: '',
  desiredServings: '',
  ingredients: [
    { id: '1', name: '', quantity: '', unit: 'grams' },
    { id: '2', name: '', quantity: '', unit: 'cups' },
    { id: '3', name: '', quantity: '', unit: 'tablespoons' },
  ],
};

export const DEFAULT_STARTER_FORM: RecipeFormData = SAMPLE_PRESETS[0].data;
