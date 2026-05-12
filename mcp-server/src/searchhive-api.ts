import { Venym SearchConfig } from './config.js';

export interface SwiftSearchParams {
  query: string;
  auto_scrape_top?: number;
  max_results?: number;
  include_contacts?: boolean;
  include_social?: boolean;
}

export interface ScrapeForgeParams {
  url: string;
  extract?: string[];
  wait_for?: string;
  timeout?: number;
  use_browser?: boolean;
}

export interface DeepDiveParams {
  query: string;
  max_pages?: number;
  extract_content?: boolean;
  include_domains?: string[];
  exclude_domains?: string[];
}

export interface BatchScrapeParams {
  urls: string[];
  extract?: string[];
  timeout?: number;
  use_browser?: boolean;
}

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
  date?: string;
}

export interface ScrapeResult {
  url: string;
  title?: string;
  text?: string;
  links?: Array<{[key: string]: string}>;
  images?: string[];
  metadata?: any;
  error?: string;
  credits_used?: number;
  remaining_credits?: number;
}

export interface Contact {
  type: string;
  value: string;
  source_url?: string;
  source_title?: string;
}

export interface SocialProfile {
  platform: string;
  url: string;
  username?: string;
  source_url?: string;
  source_title?: string;
}

export class Venym SearchAPI {
  private config: Venym SearchConfig;

  constructor(config: Venym SearchConfig) {
    this.config = config;
  }

  async swiftSearch(params: SwiftSearchParams) {
    return this.makeRequest('/swiftsearch', params);
  }

  async scrapeForge(params: ScrapeForgeParams) {
    return this.makeRequest('/scrapeforge', params);
  }

  async deepDive(params: DeepDiveParams) {
    return this.makeRequest('/deepdive', params);
  }

  async batchScrape(params: BatchScrapeParams) {
    return this.makeRequest('/scrapeforge/batch', params);
  }

  private async makeRequest(endpoint: string, data: any) {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Venym Search API error (${response.status}): ${errorText}`);
    }

    return await response.json();
  }
}

export function extractContacts(text: string): Contact[] {
  const contacts: Contact[] = [];
  
  // Email regex
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = text.match(emailRegex) || [];
  emails.forEach(email => contacts.push({ type: 'email', value: email }));
  
  // Phone regex (basic US/international)
  const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  const phones = text.match(phoneRegex) || [];
  phones.forEach(phone => contacts.push({ type: 'phone', value: phone.trim() }));
  
  return contacts;
}
