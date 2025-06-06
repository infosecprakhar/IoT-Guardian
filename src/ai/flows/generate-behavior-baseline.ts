// use server'
'use server';
/**
 * @fileOverview A behavior baseline generator for IoT devices.
 *
 * - generateBehaviorBaseline - A function that handles the behavior baseline generation process.
 * - GenerateBehaviorBaselineInput - The input type for the generateBehaviorBaseline function.
 * - GenerateBehaviorBaselineOutput - The return type for the generateBehaviorBaseline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBehaviorBaselineInputSchema = z.object({
  deviceTrafficData: z
    .string()
    .describe(
      'Network traffic data from the IoT device. This should include details like packet sizes, communication intervals, and destination IP addresses.'
    ),
  deviceType: z.string().describe('The type of IoT device (e.g., smart thermostat, security camera).'),
  deviceId: z.string().describe('Unique identifier for the IoT device.'),
});
export type GenerateBehaviorBaselineInput = z.infer<typeof GenerateBehaviorBaselineInputSchema>;

const GenerateBehaviorBaselineOutputSchema = z.object({
  baselineDescription: z
    .string()
    .describe('A detailed description of the normal behavior of the IoT device, derived from the network traffic data.'),
  typicalCommunicationPatterns: z
    .string()
    .describe('Identifies the typical communication patterns (e.g., frequently accessed IP addresses, communication protocols) of the device.'),
  expectedDataVolume: z
    .string()
    .describe('The expected range of data volume transmitted and received by the device during normal operation.'),
});
export type GenerateBehaviorBaselineOutput = z.infer<typeof GenerateBehaviorBaselineOutputSchema>;

export async function generateBehaviorBaseline(input: GenerateBehaviorBaselineInput): Promise<GenerateBehaviorBaselineOutput> {
  return generateBehaviorBaselineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBehaviorBaselinePrompt',
  input: {schema: GenerateBehaviorBaselineInputSchema},
  output: {schema: GenerateBehaviorBaselineOutputSchema},
  prompt: `You are an AI expert in IoT device behavior analysis. Analyze the network traffic data provided for the specified IoT device and establish a baseline for its normal operation.

  Device Type: {{{deviceType}}}
  Device ID: {{{deviceId}}}
  Network Traffic Data: {{{deviceTrafficData}}}

  Based on this data, provide a detailed description of the device's normal behavior, including typical communication patterns and expected data volume.
  Ensure the description is comprehensive and can be used to identify deviations from normal behavior.
  Follow the output schema format.`,
});

const generateBehaviorBaselineFlow = ai.defineFlow(
  {
    name: 'generateBehaviorBaselineFlow',
    inputSchema: GenerateBehaviorBaselineInputSchema,
    outputSchema: GenerateBehaviorBaselineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
