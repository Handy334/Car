// src/ai/flows/recommend-cars.ts
'use server';

/**
 * @fileOverview Recommends cars based on user preferences.
 *
 * - recommendCars - A function that recommends cars based on user preferences.
 * - RecommendCarsInput - The input type for the recommendCars function.
 * - RecommendCarsOutput - The return type for the recommendCars function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendCarsInputSchema = z.object({
  preferences: z
    .string()
    .describe(
      'A description of the desired car features, such as fuel efficiency, seating capacity, and budget.'
    ),
});

export type RecommendCarsInput = z.infer<typeof RecommendCarsInputSchema>;

const RecommendCarsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('A list of recommended vehicles from the catalog that match the user criteria.'),
});

export type RecommendCarsOutput = z.infer<typeof RecommendCarsOutputSchema>;

export async function recommendCars(input: RecommendCarsInput): Promise<RecommendCarsOutput> {
  return recommendCarsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendCarsPrompt',
  input: {schema: RecommendCarsInputSchema},
  output: {schema: RecommendCarsOutputSchema},
  prompt: `You are an expert car recommendation engine.

  Based on the user's preferences, you will recommend a list of vehicles from the catalog that match their criteria.

  User Preferences: {{{preferences}}}

  Provide the recommendations in a readable format.
  `,
});

const recommendCarsFlow = ai.defineFlow(
  {
    name: 'recommendCarsFlow',
    inputSchema: RecommendCarsInputSchema,
    outputSchema: RecommendCarsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
