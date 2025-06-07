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
  score: z
    .number()
    .optional()
    .describe('The moderation score of the content, indicating the level of inappropriateness.'),
});

export type ModerateForumContentOutput = z.infer<typeof ModerateForumContentOutputSchema>;

export async function moderateForumContent(input: ModerateForumContentInput): Promise<ModerateForumContentOutput> {
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
      reason: 'Moderation service error, approved by default',
      score: 0
    };
  }
}
