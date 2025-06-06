'use server';

/**
 * @fileOverview An anomaly detection AI agent for IoT devices.
 *
 * - detectAnomalies - A function that handles the anomaly detection process.
 * - DetectAnomaliesInput - The input type for the detectAnomalies function.
 * - DetectAnomaliesOutput - The return type for the detectAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAnomaliesInputSchema = z.object({
  deviceFingerprint: z
    .string()
    .describe('A unique identifier for the IoT device.'),
  networkTrafficData: z
    .string()
    .describe(
      'A detailed record of the IoT device network traffic, including timestamps, source and destination IPs, packet sizes, and protocol types.'
    ),
  baselineBehavior: z
    .string()
    .describe(
      'The established baseline behavior of the IoT device, against which anomalies will be detected.'
    ),
});
export type DetectAnomaliesInput = z.infer<typeof DetectAnomaliesInputSchema>;

const DetectAnomaliesOutputSchema = z.object({
  isAnomalous: z
    .boolean()
    .describe(
      'Whether or not the network traffic data deviates from the established baseline behavior.'
    ),
  anomalyDescription: z
    .string()
    .describe(
      'A detailed description of the detected anomalies, including the type of deviation, severity, and potential security implications.'
    ),
  confidenceScore: z
    .number()
    .describe(
      'A numerical score representing the confidence level of the anomaly detection.'
    ),
  suggestedActions: z
    .string()
    .describe(
      'Recommended actions to mitigate the detected anomalies, such as isolating the device, updating firmware, or investigating further.'
    ),
});
export type DetectAnomaliesOutput = z.infer<typeof DetectAnomaliesOutputSchema>;

export async function detectAnomalies(
  input: DetectAnomaliesInput
): Promise<DetectAnomaliesOutput> {
  return detectAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectAnomaliesPrompt',
  input: {schema: DetectAnomaliesInputSchema},
  output: {schema: DetectAnomaliesOutputSchema},
  prompt: `You are an expert in IoT device security and network traffic analysis. Your task is to analyze the provided network traffic data against the established baseline behavior of the specified IoT device to identify any anomalies or suspicious activities.

  Device Fingerprint: {{{deviceFingerprint}}}
  Network Traffic Data: {{{networkTrafficData}}}
  Baseline Behavior: {{{baselineBehavior}}}

  Based on your analysis, determine whether the network traffic data deviates from the baseline behavior. Provide a detailed description of any detected anomalies, including the type of deviation, severity, and potential security implications. Assign a confidence score to the anomaly detection, reflecting the certainty of your assessment. Finally, suggest recommended actions to mitigate the detected anomalies, such as isolating the device, updating firmware, or investigating further.

  Ensure that the output strictly adheres to the DetectAnomaliesOutput schema.
  `,
});

const detectAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectAnomaliesFlow',
    inputSchema: DetectAnomaliesInputSchema,
    outputSchema: DetectAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
