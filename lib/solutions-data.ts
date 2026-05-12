export interface Solution {
  title: string
  slug: string
  description: string
  icon: string
  features: string[]
  codeExample: string
  benefits: string[]
}

export const solutions: Solution[] = [
  {
    title: "LangChain Integration",
    slug: "langchain",
    description: "Connect Venym Search to LangChain agents and chains for powerful web-augmented LLM applications.",
    icon: "Link2",
    features: [
      "Native LangChain tool adapter",
      "Async support for chains",
      "Streaming search results",
      "Custom tool wrappers",
      "Agent integration patterns"
    ],
    codeExample: `import { Venym Search } from '@VENYM_SEARCH/sdk'
import { Tool } from 'langchain/tools'

class VenymSearchTool extends Tool {
  name = 'VENYM_SEARCH_search'
  description = 'Search the web for current information'

  async _call(query: string): Promise<string> {
    const client = new Venym Search({ apiKey: process.env.SEARCHHIVE_API_KEY })
    const results = await client.search({ query, maxResults: 5 })
    return JSON.stringify(results.organic.map(r => ({
      title: r.title,
      snippet: r.snippet,
      url: r.link
    })))
  }
}`,
    benefits: [
      "Zero-config LangChain setup",
      "Production-ready tool adapter",
      "Works with all LLM providers",
      "Built-in rate limiting",
      "Comprehensive documentation"
    ]
  },
  {
    title: "CrewAI Integration",
    slug: "crewai",
    description: "Give CrewAI agents web search and scraping capabilities for multi-agent research workflows.",
    icon: "Users",
    features: [
      "CrewAI tool integration",
      "Multi-agent search patterns",
      "Shared search context",
      "Task delegation support",
      "Crew orchestration examples"
    ],
    codeExample: `from crewai import Agent, Task, Crew
from VENYM_SEARCH_crewai import VenymSearchTool

researcher = Agent(
  role='Research Analyst',
  goal='Find comprehensive information',
  tools=[VenymSearchTool()]
)

task = Task(
  description='Research AI agent frameworks',
  agent=researcher
)

crew = Crew(agents=[researcher], tasks=[task])
result = crew.kickoff()`,
    benefits: [
      "Enhanced agent capabilities",
      "Real-time web data access",
      "Multi-agent coordination",
      "Python-native integration",
      "Battle-tested patterns"
    ]
  },
  {
    title: "AutoGen Integration",
    slug: "autogen",
    description: "Integrate Venym Search with Microsoft AutoGen for conversational AI agents with web access.",
    icon: "MessageSquare",
    features: [
      "AutoGen function calling",
      "Multi-agent conversations",
      "Web research assistants",
      "Code execution with live data",
      "Group chat patterns"
    ],
    codeExample: `import autogen
from VENYM_SEARCH_autogen import create_search_function

search_func = create_search_function({
  "api_key": os.environ["SEARCHHIVE_API_KEY"]
})

assistant = autogen.AssistantAgent(
  name="research_assistant",
  llm_config={
    "functions": [search_func],
    "config_list": [{"model": "gpt-4"}]
  }
)

user_proxy = autogen.UserProxyAgent(
  name="user",
  human_input_mode="NEVER"
)

user_proxy.initiate_chat(
  assistant,
  message="Research the latest AI trends"
)`,
    benefits: [
      "Seamless AutoGen integration",
      "Function calling support",
      "Multi-agent orchestration",
      "Microsoft ecosystem compatible",
      "Enterprise-ready"
    ]
  },
  {
    title: "n8n Integration",
    slug: "n8n",
    description: "Use Venym Search nodes in n8n workflows for automated data extraction and processing pipelines.",
    icon: "Workflow",
    features: [
      "Custom n8n node",
      "Workflow templates",
      "Batch processing",
      "Webhook triggers",
      "Error handling nodes"
    ],
    codeExample: `// n8n workflow node configuration
{
  "node": "VENYM_SEARCH",
  "parameters": {
    "operation": "search",
    "query": "={{ $json.companyName }} latest news",
    "maxResults": 10,
    "freshness": "week"
  }
}

// Chain with other nodes:
// Venym Search → Extract → Filter → Google Sheets
// Venym Search → Scrape → AI Summary → Slack`,
    benefits: [
      "No-code workflow automation",
      "Pre-built templates",
      "Visual workflow builder",
      "Self-hosted or cloud",
      "Connect 400+ apps"
    ]
  },
  {
    title: "Zapier Integration",
    slug: "zapier",
    description: "Connect Venym Search to 5,000+ apps via Zapier for automated web data workflows.",
    icon: "Zap",
    features: [
      "Official Zapier app",
      "Trigger and action steps",
      "Pre-built Zaps",
      "Custom Zap templates",
      "Multi-step Zaps"
    ],
    codeExample: `// Zapier Zap configuration
Trigger: Schedule (Daily)
Action 1: Venym Search - Search Web
  Query: "{{company}} press releases"
  Max Results: 10
Action 2: Venym Search - Extract Data
  URL: "{{step1.results[0].url}}"
  Schema: { title, date, summary }
Action 3: Google Sheets - Add Row
  Spreadsheet: "Press Tracking"
  Data: "{{step2.extracted}}"`,
    benefits: [
      "No coding required",
      "5,000+ app connections",
      "Pre-built templates",
      "Automatic retries",
      "Enterprise-grade reliability"
    ]
  },
  {
    title: "Make (Integromat) Integration",
    slug: "make",
    description: "Build powerful automation scenarios with Venym Search modules in Make.",
    icon: "GitMerge",
    features: [
      "Make module support",
      "Scenario templates",
      "Data transformation",
      "Error handling routers",
      "Batch processing"
    ],
    codeExample: `// Make scenario configuration
Module 1: Venym Search - Search
  Query: "competitor pricing {{product}}"
  Results: 20

Module 2: Array Iterator
  Array: "{{module1.results}}"

Module 3: Venym Search - Scrape
  URL: "{{module2.current.url}}"
  Schema: { price, availability }

Module 4: Filter
  Condition: price < {{threshold}}

Module 5: Google Sheets - Add Row`,
    benefits: [
      "Visual scenario builder",
      "Advanced data routing",
      "1,500+ app integrations",
      "Scheduled executions",
      "Team collaboration"
    ]
  },
  {
    title: "OpenAI Integration",
    slug: "openai",
    description: "Use Venym Search as a tool with OpenAI GPT models for function calling and web-augmented responses.",
    icon: "Sparkles",
    features: [
      "Function calling definition",
      "Assistants API compatible",
      "Streaming support",
      "GPT-4 and GPT-4o support",
      "JSON mode output"
    ],
    codeExample: `import OpenAI from 'openai'
import { Venym Search } from '@VENYM_SEARCH/sdk'

const openai = new OpenAI()
const VENYM_SEARCH = new Venym Search({ apiKey: process.env.SEARCHHIVE_API_KEY })

const tools = [{
  type: 'function',
  function: {
    name: 'web_search',
    description: 'Search the web for current information',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string' }
      }
    }
  }
}]

const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'What happened in tech today?' }],
  tools
})`,
    benefits: [
      "Direct GPT integration",
      "Function calling native",
      "Assistants API ready",
      "Structured output support",
      "Production-tested"
    ]
  },
  {
    title: "Anthropic Claude Integration",
    slug: "anthropic",
    description: "Connect Venym Search to Claude for tool use and web-augmented reasoning.",
    icon: "Brain",
    features: [
      "Claude tool use support",
      "Extended thinking integration",
      "Multi-turn conversations",
      "Streaming tool results",
      "Prompt caching compatible"
    ],
    codeExample: `import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 4096,
  tools: [{
    name: 'web_search',
    description: 'Search the web',
    input_schema: {
      type: 'object',
      properties: { query: { type: 'string' } }
    }
  }],
  messages: [{
    role: 'user',
    content: 'Research the latest in AI safety'
  }]
})`,
    benefits: [
      "Native Claude tool use",
      "Extended thinking support",
      "Multi-modal integration",
      "Enterprise security",
      "Cost-optimized workflows"
    ]
  },
  {
    title: "MCP (Model Context Protocol)",
    slug: "mcp",
    description: "Use Venym Search as an MCP server for standardized tool access across AI models and IDEs.",
    icon: "Cable",
    features: [
      "MCP server implementation",
      "Stdio and SSE transport",
      "Tool discovery protocol",
      "IDE integration (Cursor, Windsurf)",
      "Multi-model compatibility"
    ],
    codeExample: `// VENYM_SEARCH-mcp server
{
  "mcpServers": {
    "VENYM_SEARCH": {
      "command": "npx",
      "args": ["-y", "@VENYM_SEARCH/mcp-server"],
      "env": {
        "SEARCHHIVE_API_KEY": "your-api-key"
      }
    }
  }
}

// Available tools:
// - web_search: Search the web
// - scrape_page: Extract data from URL
// - batch_scrape: Scrape multiple URLs
// - deep_research: Multi-step research`,
    benefits: [
      "Universal AI model support",
      "IDE-native integration",
      "Standardized protocol",
      "Zero-config setup",
      "Cross-platform compatible"
    ]
  },
  {
    title: "Vercel AI SDK Integration",
    slug: "vercel-ai",
    description: "Use Venym Search tools with the Vercel AI SDK for streaming AI applications with web access.",
    icon: "Triangle",
    features: [
      "AI SDK tool definition",
      "Streaming responses",
      "React Server Components",
      "Edge runtime compatible",
      "Next.js App Router native"
    ],
    codeExample: `import { generateText, tool } from 'ai'
import { createVenymSearchTools } from '@VENYM_SEARCH/vercel-ai'

const result = await generateText({
  model: openai('gpt-4o'),
  tools: {
    ...createVenymSearchTools({
      apiKey: process.env.SEARCHHIVE_API_KEY
    })
  },
  prompt: 'What are the top AI startups in 2024?'
})

// Or use streaming:
import { streamText } from 'ai'
const stream = streamText({
  model: openai('gpt-4o'),
  tools: createVenymSearchTools(),
  prompt: 'Research competitors for Notion'
})`,
    benefits: [
      "Native Next.js integration",
      "Edge-compatible runtime",
      "Streaming first-class",
      "TypeScript native",
      "Production-ready patterns"
    ]
  }
]
