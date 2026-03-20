import { useState, useMemo } from 'react';
import type { Recipe, Spiciness } from '@/types';

type Filters = {
  duration?: 'under30' | '30to60' | 'over60';
  spiciness?: Spiciness;
  ingredient?: string;
};

/**
 * Remove diacritics / accents for accent-insensitive matching.
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function matchesDuration(recipe: Recipe, filter: Filters['duration']): boolean {
  if (!filter) return true;
  switch (filter) {
    case 'under30':
      return recipe.duration < 30;
    case '30to60':
      return recipe.duration >= 30 && recipe.duration <= 60;
    case 'over60':
      return recipe.duration > 60;
    default:
      return true;
  }
}

function matchesText(recipe: Recipe, query: string): boolean {
  if (!query) return true;
  const q = normalize(query);

  const searchable = [
    recipe.name,
    recipe.description,
    recipe.region,
    ...(recipe.tags ?? []),
    ...recipe.ingredients.map((i) => i.name),
  ];

  return searchable.some((field) => normalize(field).includes(q));
}

export function useSearch(recipes: Recipe[]) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});

  const results = useMemo(() => {
    return recipes.filter((recipe) => {
      if (!matchesText(recipe, query)) return false;
      if (!matchesDuration(recipe, filters.duration)) return false;
      if (filters.spiciness && recipe.spiciness !== filters.spiciness) return false;
      if (filters.ingredient) {
        const normalizedIngredient = normalize(filters.ingredient);
        const hasIngredient = recipe.ingredients.some((i) =>
          normalize(i.name).includes(normalizedIngredient),
        );
        if (!hasIngredient) return false;
      }
      return true;
    });
  }, [recipes, query, filters]);

  return { results, query, setQuery, filters, setFilters };
}
