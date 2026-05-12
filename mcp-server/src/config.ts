import { config } from 'dotenv';

config();

export interface Venym SearchConfig {
  apiKey: string;
  baseUrl: string;
}

export function getConfig(): Venym SearchConfig {
  const apiKey = process.env.SEARCHHIVE_API_KEY;
  const baseUrl = process.env.SEARCHHIVE_BASE_URL || 'https://www.search.venym.io/api/v1';

  if (!apiKey) {
    throw new Error(
      'SEARCHHIVE_API_KEY environment variable is required. ' +
      'Get your API key from https://search.venym.io/dashboard'
    );
  }

  return {
    apiKey,
    baseUrl
  };
}