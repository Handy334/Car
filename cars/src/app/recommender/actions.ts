
'use server';

import { recommendCars } from '@/ai/flows/recommend-cars';
import type { RecommendCarsInput, RecommendCarsOutput } from '@/ai/flows/recommend-cars';

export async function getCarRecommendationsAction(input: RecommendCarsInput): Promise<RecommendCarsOutput> {
  try {
    const result = await recommendCars(input);
    return result;
  } catch (error) {
    console.error("Error in getCarRecommendationsAction:", error);
    // It's better to throw a custom error or return an error structure
    // For now, re-throwing to be caught by the client component
    throw new Error("Failed to fetch recommendations from AI.");
  }
}
