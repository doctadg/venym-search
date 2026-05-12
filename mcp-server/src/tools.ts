import { z } from 'zod';
import { Venym SearchAPI, extractContacts } from './venym-search-api.js';

export function createSwiftSearchTool(api: Venym SearchAPI) {
  return {
    name: 'swift_search',
    description: 'Search the web in real-time with optional auto-scraping of top results. Perfect for finding current information, news, or research data.',
    inputSchema: {
      query: z.string().describe('The search query to execute'),
      auto_scrape_top: z.number().min(0).max(10).optional().describe('Number of top results to automatically scrape (0-10)'),
      max_results: z.number().min(1).max(50).optional().default(10).describe('Maximum number of search results to return (1-50)'),
      include_contacts: z.boolean().optional().default(false).describe('Extract contact information from scraped content'),
      include_social: z.boolean().optional().default(false).describe('Extract social media profiles from scraped content')
    },
    handler: async (params: any) => {
      try {
        const result = await api.swiftSearch(params);
        
        let responseText = `# Search Results for "${params.query}"\n\n`;
        responseText += `Found ${result.results_count} results`;
        if (result.scraped_count > 0) {
          responseText += ` and scraped ${result.scraped_count} pages`;
        }
        responseText += `\n\n`;

        // Add search results
        if (result.search_results && result.search_results.length > 0) {
          responseText += `## Search Results\n\n`;
          result.search_results.forEach((item: any, index: number) => {
            responseText += `${index + 1}. **${item.title}**\n`;
            responseText += `   ${item.link}\n`;
            responseText += `   ${item.snippet}\n\n`;
          });
        }

        // Add scraped content
        if (result.scraped_content && result.scraped_content.length > 0) {
          responseText += `## Scraped Content\n\n`;
          result.scraped_content.forEach((content: any, index: number) => {
            if (!content.error) {
              responseText += `### ${content.title || 'Untitled'}\n`;
              responseText += `**URL:** ${content.url}\n\n`;
              if (content.text) {
                const preview = content.text.substring(0, 500);
                responseText += `${preview}${content.text.length > 500 ? '...' : ''}\n\n`;
              }
            }
          });
        }

        // Add contacts if found
        if (result.contacts && result.contacts.length > 0) {
          responseText += `## Extracted Contacts\n\n`;
          result.contacts.forEach((contact: any) => {
            responseText += `- **${contact.type}:** ${contact.value}`;
            if (contact.source_url) {
              responseText += ` (from ${contact.source_url})`;
            }
            responseText += `\n`;
          });
          responseText += `\n`;
        }

        // Add social profiles if found
        if (result.social_profiles && result.social_profiles.length > 0) {
          responseText += `## Social Profiles\n\n`;
          result.social_profiles.forEach((profile: any) => {
            responseText += `- **${profile.platform}:** ${profile.url}`;
            if (profile.username) {
              responseText += ` (@${profile.username})`;
            }
            responseText += `\n`;
          });
          responseText += `\n`;
        }

        responseText += `\n---\n**Credits used:** ${result.credits_used} | **Remaining:** ${result.remaining_credits}`;

        return {
          content: [{ type: 'text' as const, text: responseText }]
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error performing search: ${error}` }],
          isError: true
        };
      }
    }
  };
}

export function createScrapeForgeTool(api: Venym SearchAPI) {
  return {
    name: 'scrape_forge',
    description: 'Scrape a single URL with advanced browser rendering capabilities. Handles JavaScript, bypasses bot detection, and extracts comprehensive content.',
    inputSchema: {
      url: z.string().url().describe('The URL to scrape'),
      extract: z.array(z.enum(['title', 'text', 'links', 'images', 'metadata', 'all'])).optional().default(['title', 'text']).describe('What content to extract'),
      wait_for: z.string().optional().describe('CSS selector to wait for before extracting content'),
      timeout: z.number().min(5).max(60).optional().default(30).describe('Timeout in seconds (5-60)'),
      use_browser: z.boolean().optional().default(true).describe('Use full browser rendering for JavaScript-heavy sites')
    },
    handler: async (params: any) => {
      try {
        const result = await api.scrapeForge(params);
        
        let responseText = `# Scraped Content from ${result.url}\n\n`;

        if (result.error) {
          responseText += `**Error:** ${result.error}\n\n`;
          return {
            content: [{ type: 'text' as const, text: responseText }],
            isError: true
          };
        }

        if (result.title) {
          responseText += `**Title:** ${result.title}\n\n`;
        }

        if (result.text) {
          responseText += `## Content\n\n${result.text}\n\n`;
        }

        if (result.links && result.links.length > 0) {
          responseText += `## Links Found (${result.links.length})\n\n`;
          result.links.slice(0, 20).forEach((link: any, index: number) => {
            const url = link.href || link.url || link.link;
            const text = link.text || link.title || 'No text';
            responseText += `${index + 1}. [${text}](${url})\n`;
          });
          if (result.links.length > 20) {
            responseText += `... and ${result.links.length - 20} more links\n`;
          }
          responseText += `\n`;
        }

        if (result.images && result.images.length > 0) {
          responseText += `## Images Found (${result.images.length})\n\n`;
          result.images.slice(0, 10).forEach((image: string, index: number) => {
            responseText += `${index + 1}. ${image}\n`;
          });
          if (result.images.length > 10) {
            responseText += `... and ${result.images.length - 10} more images\n`;
          }
          responseText += `\n`;
        }

        if (result.metadata) {
          responseText += `## Metadata\n\n`;
          Object.entries(result.metadata).forEach(([key, value]) => {
            responseText += `**${key}:** ${value}\n`;
          });
          responseText += `\n`;
        }

        responseText += `---\n**Credits used:** ${result.credits_used ?? 0} | **Remaining:** ${result.remaining_credits ?? 'N/A'}`;

        return {
          content: [{ type: 'text' as const, text: responseText }]
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error scraping URL: ${error}` }],
          isError: true
        };
      }
    }
  };
}

export function createDeepDiveTool(api: Venym SearchAPI) {
  return {
    name: 'deep_dive',
    description: 'Perform comprehensive research on a topic across multiple sources with AI-powered analysis and summarization.',
    inputSchema: {
      query: z.string().describe('The research topic or question'),
      max_pages: z.number().min(1).max(20).optional().default(5).describe('Maximum number of pages to research (1-20)'),
      extract_content: z.boolean().optional().default(true).describe('Extract full content from discovered sources'),
      include_domains: z.array(z.string()).optional().describe('Only include results from these domains'),
      exclude_domains: z.array(z.string()).optional().describe('Exclude results from these domains')
    },
    handler: async (params: any) => {
      try {
        const result = await api.deepDive(params);
        
        let responseText = `# Deep Dive Research: "${params.query}"\n\n`;

        if (result.summary) {
          responseText += `## Executive Summary\n\n${result.summary}\n\n`;
        }

        if (result.search_results && result.search_results.length > 0) {
          responseText += `## Key Sources (${result.search_results.length})\n\n`;
          result.search_results.forEach((source: any, index: number) => {
            responseText += `${index + 1}. **${source.title}**\n`;
            responseText += `   ${source.link}\n`;
            responseText += `   ${source.snippet}\n\n`;
          });
        }

        if (result.scraped_content && result.scraped_content.length > 0) {
          responseText += `## Detailed Content Analysis\n\n`;
          result.scraped_content.forEach((content: any, index: number) => {
            if (!content.error && content.text) {
              responseText += `### Source ${index + 1}: ${content.title || 'Untitled'}\n`;
              responseText += `**URL:** ${content.url}\n\n`;
              const preview = content.text.substring(0, 1000);
              responseText += `${preview}${content.text.length > 1000 ? '...' : ''}\n\n`;
            }
          });
        }

        responseText += `---\n**Credits used:** ${result.credits_used ?? 0} | **Remaining:** ${result.remaining_credits ?? 'N/A'}`;

        return {
          content: [{ type: 'text' as const, text: responseText }]
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error performing deep dive research: ${error}` }],
          isError: true
        };
      }
    }
  };
}

export function createExtractContactsTool() {
  return {
    name: 'extract_contacts',
    description: 'Extract contact information (emails, phone numbers) from text content.',
    inputSchema: {
      text: z.string().describe('The text content to extract contacts from')
    },
    handler: async (params: any) => {
      try {
        const contacts = extractContacts(params.text);
        
        let responseText = `# Extracted Contacts\n\n`;
        
        if (contacts.length === 0) {
          responseText += `No contact information found in the provided text.\n`;
        } else {
          const emails = contacts.filter(c => c.type === 'email');
          const phones = contacts.filter(c => c.type === 'phone');
          
          if (emails.length > 0) {
            responseText += `## Email Addresses (${emails.length})\n\n`;
            emails.forEach((email, index) => {
              responseText += `${index + 1}. ${email.value}\n`;
            });
            responseText += `\n`;
          }
          
          if (phones.length > 0) {
            responseText += `## Phone Numbers (${phones.length})\n\n`;
            phones.forEach((phone, index) => {
              responseText += `${index + 1}. ${phone.value}\n`;
            });
            responseText += `\n`;
          }
        }

        return {
          content: [{ type: 'text' as const, text: responseText }]
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error extracting contacts: ${error}` }],
          isError: true
        };
      }
    }
  };
}

export function createBatchScrapeTool(api: Venym SearchAPI) {
  return {
    name: 'batch_scrape',
    description: 'Scrape multiple URLs efficiently in batch. Perfect for processing lists of URLs or following multiple leads.',
    inputSchema: {
      urls: z.array(z.string().url()).max(20).describe('Array of URLs to scrape (max 20)'),
      extract: z.array(z.enum(['title', 'text', 'links', 'images', 'metadata'])).optional().default(['title', 'text']).describe('What content to extract from each URL'),
      timeout: z.number().min(5).max(60).optional().default(30).describe('Timeout in seconds (5-60)'),
      use_browser: z.boolean().optional().default(true).describe('Use full browser rendering for JavaScript-heavy sites')
    },
    handler: async (params: any) => {
      try {
        const { urls, extract, timeout, use_browser } = params;
        let result: any;
        
        let responseText = `# Batch Scrape Results\n\n`;
        responseText += `Processing ${urls.length} URLs...\n\n`;

        try {
          result = await api.batchScrape({ urls, extract, timeout, use_browser });
        } catch {
          // Fallback: loop scrape calls
          const results: any[] = [];
          for (const url of urls) {
            try {
              const r = await api.scrapeForge({ url, extract, timeout, use_browser });
              results.push(r);
            } catch (err) {
              results.push({ url, error: String(err) });
            }
          }
          result = { results };
        }

        const results = result.results || result;
        const items = Array.isArray(results) ? results : [];
        let successCount = 0;
        let totalContacts: any[] = [];

        items.forEach((r: any, i: number) => {
          responseText += `## ${i + 1}. ${r.title || 'Untitled'}\n`;
          responseText += `**URL:** ${r.url}\n`;
          
          if (r.error) {
            responseText += `**Error:** ${r.error}\n\n`;
          } else {
            successCount++;
            if (r.text) {
              const preview = r.text.substring(0, 300);
              responseText += `**Content Preview:** ${preview}${r.text.length > 300 ? '...' : ''}\n`;
            }
            responseText += `\n`;
          }
        });

        if (totalContacts.length > 0) {
          responseText += `## All Extracted Contacts (${totalContacts.length})\n\n`;
          const emails = totalContacts.filter(c => c.type === 'email');
          const phones = totalContacts.filter(c => c.type === 'phone');
          
          if (emails.length > 0) {
            responseText += `### Emails (${emails.length})\n`;
            emails.forEach((email, index) => {
              responseText += `${index + 1}. ${email.value} (from ${email.source_title || email.source_url})\n`;
            });
            responseText += `\n`;
          }
          
          if (phones.length > 0) {
            responseText += `### Phone Numbers (${phones.length})\n`;
            phones.forEach((phone, index) => {
              responseText += `${index + 1}. ${phone.value} (from ${phone.source_title || phone.source_url})\n`;
            });
            responseText += `\n`;
          }
        }

        responseText += `---\n**Summary:** Successfully scraped ${successCount}/${urls.length} URLs`;
        if (result.credits_used !== undefined) {
          responseText += ` | **Credits used:** ${result.credits_used} | **Remaining:** ${result.remaining_credits ?? 'N/A'}`;
        }

        return {
          content: [{ type: 'text' as const, text: responseText }]
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error performing batch scrape: ${error}` }],
          isError: true
        };
      }
    }
  };
}