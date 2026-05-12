import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Bot, 
  Puzzle, 
  Code,
  Zap,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Download,
  PlayCircle
} from 'lucide-react'
import { CodeBlock } from '../../components/CodeBlock'
import { Callout } from '../../components/Callout'

export default function LangChainIntegrationPage() {
  const installCode = {
    python: `# Install required packages
pip install langchain VENYM_SEARCH-python

# Or install with extras for async support
pip install "langchain[async]" VENYM_SEARCH-python[async]`,
    bash: `# Using pip
pip install langchain VENYM_SEARCH-python

# Using conda
conda install -c conda-forge langchain
pip install VENYM_SEARCH-python`
  }

  const basicToolCode = `from langchain.tools import BaseTool
from langchain.pydantic_v1 import BaseModel, Field
from typing import Optional, Type
import requests
import json

class SearchInput(BaseModel):
    """Input for Search tool."""
    query: str = Field(description="Search query")
    max_results: Optional[int] = Field(default=5, description="Maximum results to return")

class SearchTool(BaseTool):
    """Tool for real-time web search using Venym Search Search API."""
    
    name = "web_search"
    description = "Search the web for current information on any topic. Use this when you need up-to-date information that might not be in your training data."
    args_schema: Type[BaseModel] = SearchInput
    
    def __init__(self, api_key: str):
        super().__init__()
        self.api_key = api_key
    
    def _run(self, query: str, max_results: int = 5) -> str:
        """Execute the search."""
        try:
            response = requests.post(
                "https://www.search.venym.io/api/v1/search",
                headers={
                    "Authorization": "Bearer " + self.api_key,
                    "Content-Type": "application/json"
                },
                json={
                    "query": query,
                    "max_results": max_results
                }
            )
            response.raise_for_status()
            
            data = response.json()
            
            # Format results for LLM consumption
            results = []
            for result in data.get('search_results', []):
                results.append(f"""
Title: {result['title']}
URL: {result['link']}
Summary: {result['snippet']}
Date: {result.get('date', 'N/A')}
""")
            
            return f"Found {len(results)} results for '{query}':\\n\\n" + "\\n---\\n".join(results)
            
        except Exception as e:
            return f"Search failed: {str(e)}"
    
    async def _arun(self, query: str, max_results: int = 5) -> str:
        """Async version - for now, just call sync version."""
        return self._run(query, max_results)`

  const scrapeToolCode = `from langchain.tools import BaseTool
from langchain.pydantic_v1 import BaseModel, Field
from typing import Optional, Type, List
import requests

class ScrapeInput(BaseModel):
    """Input for Scrape tool."""
    url: str = Field(description="URL to scrape")
    extract_options: Optional[List[str]] = Field(
        default=["title", "text"], 
        description="What to extract: title, text, links, images, metadata"
    )

class ScrapeToolLangChain(BaseTool):
    """Tool for web scraping using Venym Search Scrape API."""
    
    name = "web_scraper"
    description = "Extract content from any webpage. Use this to get detailed content from specific URLs."
    args_schema: Type[BaseModel] = ScrapeInput
    
    def __init__(self, api_key: str):
        super().__init__()
        self.api_key = api_key
    
    def _run(self, url: str, extract_options: List[str] = ["title", "text"]) -> str:
        """Scrape the webpage."""
        try:
            response = requests.post(
                "https://www.search.venym.io/api/v1/scrape",
                headers={
                    "Authorization": "Bearer " + self.api_key,
                    "Content-Type": "application/json"
                },
                json={
                    "url": url,
                    "extract_options": extract_options
                }
            )
            response.raise_for_status()
            
            data = response.json()
            content = data.get('primary_content', {})
            
            if content.get('error'):
                return f"Failed to scrape {url}: {content['error']}"
            
            result = f"Content from {url}:\\n\\n"
            
            if 'title' in extract_options and content.get('title'):
                result += f"Title: {content['title']}\\n\\n"
            
            if 'text' in extract_options and content.get('text'):
                # Truncate very long content
                text = content['text'][:2000]
                if len(content['text']) > 2000:
                    text += "... [truncated]"
                result += f"Content: {text}\\n\\n"
            
            return result
            
        except Exception as e:
            return f"Scraping failed: {str(e)}"
    
    async def _arun(self, url: str, extract_options: List[str] = ["title", "text"]) -> str:
        """Async version."""
        return self._run(url, extract_options)`

  const researchToolCode = `from langchain.tools import BaseTool
from langchain.pydantic_v1 import BaseModel, Field
from typing import Optional, Type
import requests


    topic: str = Field(description="Research topic")

    max_sources: Optional[int] = Field(default=5, description="Maximum sources to analyze")

class ResearchTool(BaseTool):
    
    name = "research_topic"
    description = "Conduct comprehensive research on any topic by analyzing multiple sources. Use this for in-depth analysis and when you need comprehensive information."
    
    def __init__(self, api_key: str):
        super().__init__()
        self.api_key = api_key
    
    def _run(self, topic: str, max_sources: int = 5) -> str:
        """Research the topic."""
        try:
            response = requests.post(
                headers={
                    "Authorization": "Bearer " + self.api_key,
                    "Content-Type": "application/json"
                },
                json={
                    "topic": topic,
                    "max_sources": max_sources
                }
            )
            response.raise_for_status()
            
            data = response.json()
            
            result = f"Research results for '{topic}':\\n\\n"
            result += f"Sources analyzed: {data.get('sources_analyzed', 0)}\\n"
            result += f"Research depth: {data.get('research_depth', 'N/A')}\\n\\n"
            
            # Include search results
            if data.get('search_results'):
                result += "Key Sources:\\n"
                for i, source in enumerate(data['search_results'][:3], 1):
                    result += f"{i}. {source['title']} ({source['link']})\\n"
                result += "\\n"
            
            # Include scraped content summaries
            if data.get('scraped_content'):
                result += "Content Analysis:\\n"
                for content in data['scraped_content'][:2]:
                    if not content.get('error') and content.get('text'):
                        # Get first 200 chars as summary
                        summary = content['text'][:200] + "..." if len(content['text']) > 200 else content['text']
                        result += f"• {summary}\\n\\n"
            
            return result
            
        except Exception as e:
            return f"Research failed: {str(e)}"
    
    async def _arun(self, topic: str, max_sources: int = 5) -> str:
        """Async version."""
        return self._run(topic, max_sources)`

  const agentExampleCode = `import os
from langchain.agents import initialize_agent, AgentType
from langchain.llms import OpenAI
from langchain.memory import ConversationBufferMemory

# Initialize your Venym Search tools
api_key = os.getenv("VENYM_SEARCH_API_KEY")
search_tool = SearchTool(api_key)
scrape_tool = ScrapeToolLangChain(api_key)
research_tool = ResearchTool(api_key)

# Initialize LLM
llm = OpenAI(temperature=0)

# Create memory for conversation context
memory = ConversationBufferMemory(memory_key="chat_history")

# Initialize agent with tools
agent = initialize_agent(
    tools=[search_tool, scrape_tool, research_tool],
    llm=llm,
    agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
    memory=memory,
    verbose=True
)

# Now your agent can use real-time web data!
result = agent.run("What are the latest developments in AI? Then find a specific article and analyze it in detail.")
print(result)`

  const bitcoinBotCode = `from langchain.agents import initialize_agent, AgentType
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate

class BitcoinPriceBot:
    def __init__(self, VENYM_SEARCH_api_key: str, openai_api_key: str):
        # Initialize tools
        self.search_tool = SearchTool(VENYM_SEARCH_api_key)
        self.scrape_tool = ScrapeToolLangChain(VENYM_SEARCH_api_key)
        
        # Initialize LLM
        self.llm = OpenAI(api_key=openai_api_key, temperature=0.3)
        
        # Create specialized agent
        self.agent = initialize_agent(
            tools=[self.search_tool, self.scrape_tool],
            llm=self.llm,
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True
        )
    
    def get_price_analysis(self) -> str:
        """Get comprehensive Bitcoin price analysis."""
        prompt = """
        I need a comprehensive Bitcoin price analysis. Please:
        1. Search for the current Bitcoin price and recent news
        2. Find expert predictions for 2025
        3. Scrape detailed analysis from major crypto news sites
        4. Provide a summary with key price drivers and predictions
        """
        
        return self.agent.run(prompt)
    
    def monitor_specific_sources(self, sources: list) -> str:
        """Monitor specific sources for Bitcoin news."""
        results = []
        
        for source_url in sources:
            try:
                content = self.scrape_tool._run(source_url)
                results.append(f"Content from {source_url}:\\n{content}\\n---\\n")
            except Exception as e:
                results.append(f"Failed to scrape {source_url}: {e}\\n---\\n")
        
        # Ask LLM to analyze all content
        analysis_prompt = f"""
        Analyze the following Bitcoin-related content and provide insights:
        
        {' '.join(results)}
        
        Please summarize key insights, price predictions, and market sentiment.
        """
        
        return self.llm(analysis_prompt)

# Usage example
bot = BitcoinPriceBot(
    VENYM_SEARCH_api_key="sk_live_YOUR_API_KEY_API_KEY_key_here",
    openai_api_key="your_openai_key_here"
)

# Get current analysis
analysis = bot.get_price_analysis()
print(analysis)

# Monitor specific sources
sources = [
    "https://coindesk.com/price/bitcoin",
    "https://cointelegraph.com/bitcoin-price-prediction"
]
monitoring_result = bot.monitor_specific_sources(sources)
print(monitoring_result)`

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Bot className="w-6 h-6 text-green-600" />
          </div>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Popular Integration
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          LangChain Integration
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Build AI agents that can search, scrape, and research the web in real-time. 
          Connect your LangChain applications directly to live web data with Venym Search tools.
        </p>
      </div>

      {/* Quick Benefits */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold">Real-time Data</h3>
            </div>
            <p className="text-sm text-gray-600">Your agents access current web information, not stale training data</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Puzzle className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">Drop-in Tools</h3>
            </div>
            <p className="text-sm text-gray-600">Pre-built LangChain tools that work with any agent framework</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-[#efa72d]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Code className="w-5 h-5 text-[#efa72d]" />
              <h3 className="font-semibold">Easy Setup</h3>
            </div>
            <p className="text-sm text-gray-600">Add web capabilities to existing agents in minutes</p>
          </CardContent>
        </Card>
      </div>

      <Callout type="success" title="What you'll build">
        By the end of this guide, you'll have AI agents that can search the web, scrape specific pages, 
        and conduct comprehensive research - all with real-time data from Venym Search APIs.
      </Callout>

      {/* Installation */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Installation</h2>
        
        <CodeBlock
          multiLanguage={installCode}
          title="Install required packages"
        />

        <div className="mt-6">
          <Callout type="info" title="Prerequisites">
            You'll need Python 3.8+, LangChain, and a Venym Search API key. 
            <Link href="/docs/quickstart" className="text-blue-600 hover:underline ml-1">
              Get your API key here →
            </Link>
          </Callout>
        </div>
      </div>

      {/* Tool 1: Web Search */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">1. Web Search Tool</h2>
        
        <p className="text-gray-600 mb-6">
          Create a LangChain tool that gives your agents real-time web search capabilities using Search.
        </p>

        <CodeBlock
          code={basicToolCode}
          language="python"
          title="Search LangChain Tool"
        />

        <div className="mt-6">
          <Callout type="tip" title="Tool customization">
            You can extend this tool to include auto-scraping, contact extraction, and social discovery 
            by adding the appropriate parameters to the API call.
          </Callout>
        </div>
      </div>

      {/* Tool 2: Web Scraper */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">2. Web Scraping Tool</h2>
        
        <p className="text-gray-600 mb-6">
          Enable your agents to extract content from specific web pages using Scrape.
        </p>

        <CodeBlock
          code={scrapeToolCode}
          language="python"
          title="Scrape LangChain Tool"
        />
      </div>

      {/* Tool 3: Research Tool */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">3. AI Research Tool</h2>
        
        <p className="text-gray-600 mb-6">
        </p>

        <CodeBlock
          code={researchToolCode}
          language="python"
        />
      </div>

      {/* Creating an Agent */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Creating Your Web-Enabled Agent</h2>
        
        <p className="text-gray-600 mb-6">
          Now let's put it all together and create an AI agent with web superpowers.
        </p>

        <CodeBlock
          code={agentExampleCode}
          language="python"
          title="Web-enabled LangChain Agent"
        />

        <div className="mt-6">
          <Callout type="important" title="Environment setup">
            Make sure to set your environment variables:
            <br />• <code>VENYM_SEARCH_API_KEY</code> - Your Venym Search API key
            <br />• <code>OPENAI_API_KEY</code> - Your OpenAI API key (or use another LLM)
          </Callout>
        </div>
      </div>

      {/* Real Example: Bitcoin Bot */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Real Example: Bitcoin Price Bot</h2>
        
        <p className="text-gray-600 mb-6">
          Here's a complete example of a Bitcoin price monitoring bot that demonstrates real-world usage.
        </p>

        <CodeBlock
          code={bitcoinBotCode}
          language="python"
          title="Bitcoin Price Analysis Bot"
        />

        <div className="mt-6">
          <div className="flex items-start gap-3">
            <PlayCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What this bot does:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Searches for current Bitcoin price and news</li>
                <li>• Finds expert predictions for 2025</li>
                <li>• Scrapes detailed analysis from crypto news sites</li>
                <li>• Provides AI-generated insights and summaries</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Patterns */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Advanced Patterns</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-500" />
                Multi-Agent Systems
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                Create specialized agents for different tasks: one for search, one for analysis, one for reporting.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Search agent finds relevant sources</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Scraper agent extracts content</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Analysis agent processes results</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#efa72d]" />
                Streaming & Async
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                Handle real-time data streams and implement async processing for better performance.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Async tool implementations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Streaming responses to users</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Background monitoring tasks</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Error Handling */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Error Handling & Best Practices</h2>
        
        <div className="space-y-6">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="text-red-700">Handle API Errors Gracefully</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock
                code={`def _run(self, query: str) -> str:
    try:
        response = requests.post(...)
        response.raise_for_status()
        return self._format_results(response.json())
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 401:
            return "Error: Invalid API key. Please check your Venym Search configuration."
        elif e.response.status_code == 402:
            return "Error: Insufficient credits. Please add more credits to your account."
        elif e.response.status_code == 429:
            return "Error: Rate limit exceeded. Please wait before making more requests."
        else:
            return f"API Error: {e.response.status_code} - {e.response.text}"
    except Exception as e:
        return f"Unexpected error: {str(e)}"`}
                language="python"
                title="Robust error handling"
              />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-blue-700">Credit Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Monitor credit usage in your tools</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Set usage limits to prevent runaway costs</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Cache results when appropriate to save credits</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Use auto-scraping judiciously (costs 3 credits per page)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Next Steps */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-l-4 border-l-[#efa72d]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-[#efa72d]" />
              Get the Complete Package
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Download our official Python SDK with pre-built LangChain tools.
            </p>
            <Link href="/docs/sdks/python">
              <Button variant="outline" className="border-[#efa72d] text-[#efa72d] hover:bg-[#efa72d] hover:text-white">
                Python SDK Docs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#17457c]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-[#17457c]" />
              More Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              See complete implementation guides and real-world examples.
            </p>
            <div className="flex gap-2">
              <Link href="/docs/guides/bitcoin-tracking">
                <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                  Bitcoin Bot
                </Button>
              </Link>
              <Link href="/docs/guides/lead-generation">
                <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                  Lead Gen
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

