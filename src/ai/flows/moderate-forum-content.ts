'use server';

/**
 * @fileOverview This file defines a Genkit flow for moderating forum content using AI.
 *
 * It includes:
 * - moderateForumContent - A function to moderate forum content.
 * - ModerateForumContentInput - The input type for the moderateForumContent function.
 * - ModerateForumContentOutput - The output type for the moderateForumContent function.
 */

import {z} from 'genkit';

const ModerateForumContentInputSchema = z.object({
  content: z.string().describe('The content of the forum post or reply to be moderated.'),
});

export type ModerateForumContentInput = z.infer<typeof ModerateForumContentInputSchema>;

const ModerateForumContentOutputSchema = z.object({
  isAppropriate: z.boolean().describe('Whether the content is appropriate for the forum.'),
  reason: z
    .string()
    .optional()
    .describe('The reason why the content is considered inappropriate, if applicable.'),
});

export type ModerateForumContentOutput = z.infer<typeof ModerateForumContentOutputSchema>;

export async function moderateForumContent(input: ModerateForumContentInput): Promise<ModerateForumContentOutput> {
  return moderateForumContentFlow(input);
}

const moderateForumContentPrompt = ai.definePrompt({
  name: 'moderateForumContentPrompt',
  model: 'googleai/gemini-1.5-flash-latest', // Specify the model here
  input: {schema: ModerateForumContentInputSchema},
  output: {schema: ModerateForumContentOutputSchema},
  prompt: `You are an AI content moderator for a community forum. Your task is to determine if the given content is appropriate for the forum.

    Consider the following:
    - Is the content respectful and considerate of others?
    - Does the content contain hate speech, harassment, or personal attacks?
    - Does the content contain misinformation or harmful advice?
    - Is the content sexually explicit or exploit, abuse or endanger children?

    Based on your assessment, determine whether the content is appropriate or inappropriate for the forum.

    Content: {{{content}}}
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_CIVIC_INTEGRITY',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const moderateForumContentFlow = ai.defineFlow(
  {
    name: 'moderateForumContentFlow',
    inputSchema: ModerateForumContentInputSchema,
    outputSchema: ModerateForumContentOutputSchema,
  },
  async input => {
    const {output} = await moderateForumContentPrompt(input);
    return output!;
  }
);

// Simple content moderation function
export interface ModerateForumContentInput {
  content: string;
}

interface ModerateForumContentResult {
  isAppropriate: boolean;
  reason?: string;
  score?: number;
}

// Simple content moderation function
export async function moderateForumContent(input: ModerateForumContentInput): Promise<ModerateForumContentResult> {
  try {
    const { content } = input;
    const inappropriateTerms = [
      'profanity', 'offensive', 'inappropriate'
    ];
    const lowerContent = content.toLowerCase();
    const foundTerms = inappropriateTerms.filter(term => lowerContent.includes(term));
    if (foundTerms.length > 0) {
      return {
        isAppropriate: false,
        reason: 'Content contains inappropriate language',
        score: 0.8
      };
    }
    return {
      isAppropriate: true,
      score: 0.2
    };
  } catch (error) {
    console.error('Error in content moderation:', error);
    return {
      isAppropriate: true, 
      reason: 'Moderation service error, approved by default'
    };
  }
}
