import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Bot, 
  Code, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Search,
  Globe,
  ExternalLink,
  Settings,
  Play
} from 'lucide-react'
import { CodeBlock } from '../../components/CodeBlock'
import { Callout } from '../../components/Callout'

export default function OpenAIAssistantsPage() {
  const assistantCreation = `import openai
import requests
import json

# Initialize OpenAI client
client = openai.OpenAI(api_key="your-openai-api-key")

# Define Venym Search functions for the assistant
def search_web(query, max_results=10):
    """Search the web using Venym Search API"""
    response = requests.post(
        "https://www.search.venym.io/api/v1/search",
        headers={"Authorization": "Bearer your-VENYM_SEARCH-key"},
        json={
            "query": query,
            "max_results": max_results
        }
    )
    return response.json()

def scrape_webpage(url):
    """Scrape webpage content using Venym Search"""
    response = requests.post(
        "https://www.search.venym.io/api/v1/scrape",
        headers={"Authorization": "Bearer your-VENYM_SEARCH-key"},
        json={
            "url": url,
            "extract_options": ["title", "text", "metadata"]
        }
    )
    return response.json()

# Create assistant with Venym Search functions
assistant = client.beta.assistants.create(
    name="Web Research Assistant",
    instructions="""You are a helpful research assistant with access to real-time web search and webpage scraping capabilities. 
    
    Use the search_web function to find current information on any topic.
    Use the scrape_webpage function to extract detailed content from specific URLs.
    
    Always provide sources and cite where information came from. Be thorough in your research and cross-reference multiple sources when possible.""",
    
    model="gpt-4-turbo-preview",
    
    tools=[
        {
            "type": "function",
            "function": {
                "name": "search_web",
                "description": "Search the web for current information on any topic",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "The search query to execute"
                        },
                        "max_results": {
                            "type": "integer",
                            "description": "Maximum number of results to return (default: 10)",
                            "default": 10
                        }
                    },
                    "required": ["query"]
                }
            }
        },
        {
            "type": "function", 
            "function": {
                "name": "scrape_webpage",
                "description": "Extract content from a specific webpage URL",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "url": {
                            "type": "string",
                            "description": "The URL to scrape content from"
                        }
                    },
                    "required": ["url"]
                }
            }
        }
    ]
)

print(f"Assistant created with ID: {assistant.id}")`

  const functionHandling = `import json

def run_conversation(assistant_id, user_message):
    # Create a thread
    thread = client.beta.threads.create()
    
    # Add user message to thread
    client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user", 
        content=user_message
    )
    
    # Run the assistant
    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id
    )
    
    # Wait for completion and handle function calls
    while run.status in ['queued', 'in_progress', 'requires_action']:
        if run.status == 'requires_action':
            # Handle function calls
            tool_calls = run.required_action.submit_tool_outputs.tool_calls
            tool_outputs = []
            
            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)
                
                if function_name == "search_web":
                    result = search_web(
                        query=function_args["query"],
                        max_results=function_args.get("max_results", 10)
                    )
                elif function_name == "scrape_webpage":
                    result = scrape_webpage(url=function_args["url"])
                else:
                    result = {"error": f"Unknown function: {function_name}"}
                
                tool_outputs.append({
                    "tool_call_id": tool_call.id,
                    "output": json.dumps(result)
                })
            
            # Submit function outputs
            run = client.beta.threads.runs.submit_tool_outputs(
                thread_id=thread.id,
                run_id=run.id,
                tool_outputs=tool_outputs
            )
        
        # Wait before checking again
        time.sleep(1)
        run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
    
    # Get the assistant's response
    messages = client.beta.threads.messages.list(thread_id=thread.id)
    return messages.data[0].content[0].text.value

# Example usage
response = run_conversation(
    assistant_id=assistant.id,
    user_message="What are the latest developments in AI technology this week? Please search for recent news and provide a summary."
)

print(response)`

  const chatbotExample = `import streamlit as st
import openai
import time

st.title("🔍 AI Research Assistant")
st.caption("Powered by OpenAI GPT-4 + Venym Search APIs")

# Initialize session state
if "messages" not in st.session_state:
    st.session_state.messages = []
if "thread_id" not in st.session_state:
    st.session_state.thread_id = None

# Initialize clients
client = openai.OpenAI(api_key=st.secrets["OPENAI_API_KEY"])
ASSISTANT_ID = "asst_your_assistant_id"

def create_thread():
    """Create a new conversation thread"""
    thread = client.beta.threads.create()
    return thread.id

def run_assistant(thread_id, user_message):
    """Run the assistant with Venym Search integration"""
    # Add user message
    client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=user_message
    )
    
    # Start the run
    run = client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=ASSISTANT_ID
    )
    
    # Handle the conversation with function calls
    while run.status in ['queued', 'in_progress', 'requires_action']:
        if run.status == 'requires_action':
            # Handle Venym Search function calls
            tool_calls = run.required_action.submit_tool_outputs.tool_calls
            tool_outputs = []
            
            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)
                
                with st.spinner(f"🔍 {function_name.replace('_', ' ').title()}..."):
                    if function_name == "search_web":
                        result = search_web(
                            query=function_args["query"],
                            max_results=function_args.get("max_results", 10)
                        )
                        st.sidebar.success(f"Found {len(result.get('search_results', []))} search results")
                        
                    elif function_name == "scrape_webpage":
                        result = scrape_webpage(url=function_args["url"])
                        st.sidebar.success(f"Scraped webpage: {function_args['url']}")
                    
                    tool_outputs.append({
                        "tool_call_id": tool_call.id,
                        "output": json.dumps(result)
                    })
            
            # Submit the function outputs
            run = client.beta.threads.runs.submit_tool_outputs(
                thread_id=thread_id,
                run_id=run.id,
                tool_outputs=tool_outputs
            )
        
        time.sleep(1)
        run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
    
    # Get the assistant's response
    messages = client.beta.threads.messages.list(thread_id=thread_id)
    return messages.data[0].content[0].text.value

# Create thread if needed
if st.session_state.thread_id is None:
    st.session_state.thread_id = create_thread()

# Display chat history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Chat input
if prompt := st.chat_input("Ask me to research anything..."):
    # Add user message to history
    st.session_state.messages.append({"role": "user", "content": prompt})
    
    with st.chat_message("user"):
        st.markdown(prompt)
    
    # Get assistant response
    with st.chat_message("assistant"):
        with st.spinner("Researching..."):
            response = run_assistant(st.session_state.thread_id, prompt)
            st.markdown(response)
            
        # Add assistant response to history
        st.session_state.messages.append({"role": "assistant", "content": response})

# Sidebar with examples
st.sidebar.header("💡 Example Queries")
st.sidebar.markdown("""
- "What are the latest AI breakthroughs this month?"
- "Research the current state of renewable energy adoption"
- "Find recent news about cryptocurrency regulations"
- "Analyze the latest trends in remote work"
- "What are experts saying about climate change solutions?"
""")

st.sidebar.header("🔧 Functions Available")
st.sidebar.markdown("""
- **Web Search**: Real-time search across the internet
- **Webpage Scraping**: Extract content from any URL
- **AI Analysis**: GPT-4 powered insights and summaries
"")`

  const nodeExample = `const OpenAI = require('openai');
const axios = require('axios');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const VENYM_SEARCH_API_KEY = process.env.VENYM_SEARCH_API_KEY;

// Venym Search function implementations
async function searchWeb(query, maxResults = 10) {
  try {
    const response = await axios.post(
      'https://www.search.venym.io/api/v1/search',
      {
        query: query,
        max_results: maxResults
      },
      {
        headers: {
          'Authorization': \`Bearer \${VENYM_SEARCH_API_KEY}\`
        }
      }
    );
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
}

async function scrapeWebpage(url) {
  try {
    const response = await axios.post(
      'https://www.search.venym.io/api/v1/scrape',
      {
        url: url,
        extract_options: ['title', 'text', 'metadata']
      },
      {
        headers: {
          'Authorization': \`Bearer \${VENYM_SEARCH_API_KEY}\`
        }
      }
    );
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
}

// Create assistant
async function createResearchAssistant() {
  const assistant = await openai.beta.assistants.create({
    name: "Web Research Assistant",
    instructions: \`You are a research assistant with real-time web access. 
    Use search_web to find current information and scrape_webpage to get detailed content from URLs.
    Always cite your sources and provide accurate, up-to-date information.\`,
    model: "gpt-4-turbo-preview",
    tools: [
      {
        type: "function",
        function: {
          name: "search_web",
          description: "Search the web for current information",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string", description: "Search query" },
              maxResults: { type: "integer", description: "Max results (default: 10)" }
            },
            required: ["query"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "scrape_webpage", 
          description: "Extract content from a webpage URL",
          parameters: {
            type: "object",
            properties: {
              url: { type: "string", description: "URL to scrape" }
            },
            required: ["url"]
          }
        }
      }
    ]
  });
  
  return assistant;
}

// Handle conversation with function calls
async function runConversation(assistantId, userMessage) {
  // Create thread
  const thread = await openai.beta.threads.create();
  
  // Add message
  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: userMessage
  });
  
  // Run assistant
  let run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistantId
  });
  
  // Handle function calls
  while (run.status === 'queued' || run.status === 'in_progress' || run.status === 'requires_action') {
    if (run.status === 'requires_action') {
      const toolCalls = run.required_action.submit_tool_outputs.tool_calls;
      const toolOutputs = [];
      
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        
        let result;
        if (functionName === 'search_web') {
          result = await searchWeb(args.query, args.maxResults);
        } else if (functionName === 'scrape_webpage') {
          result = await scrapeWebpage(args.url);
        }
        
        toolOutputs.push({
          tool_call_id: toolCall.id,
          output: JSON.stringify(result)
        });
      }
      
      run = await openai.beta.threads.runs.submitToolOutputs(
        thread.id,
        run.id,
        { tool_outputs: toolOutputs }
      );
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    run = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  }
  
  // Get response
  const messages = await openai.beta.threads.messages.list(thread.id);
  return messages.data[0].content[0].text.value;
}

// Example usage
async function main() {
  const assistant = await createResearchAssistant();
  console.log(\`Assistant created: \${assistant.id}\`);
  
  const response = await runConversation(
    assistant.id,
    "What are the latest developments in quantum computing? Please search for recent news and provide a comprehensive summary."
  );
  
  console.log("Assistant Response:", response);
}

main().catch(console.error);`

  const features = [
    {
      icon: Bot,
      title: "Function Calling",
      description: "Seamlessly integrate Venym Search APIs as OpenAI Assistant functions"
    },
    {
      icon: Search,
      title: "Real-time Research",
      description: "Enable assistants to search the web and access current information"
    },
    {
      icon: Globe,
      title: "Web Scraping",
      description: "Extract detailed content from any webpage for comprehensive analysis"
    },
    {
      icon: Zap,
      title: "Intelligent Routing",
      description: "AI automatically chooses the right Venym Search API for each task"
    }
  ]

  const useCases = [
    {
      title: "Research Assistant",
      description: "Create AI assistants that can research any topic with real-time web access",
      example: "News analysis, market research, academic research"
    },
    {
      title: "Customer Support",
      description: "Build support bots that can search knowledge bases and documentation",
      example: "FAQ automation, technical support, product information"
    },
    {
      title: "Content Creation",
      description: "Assistants that gather information for content writing and fact-checking",
      example: "Blog writing, report generation, fact verification"
    },
    {
      title: "Data Analysis",
      description: "AI that can gather and analyze data from multiple web sources",
      example: "Competitor analysis, trend monitoring, price tracking"
    }
  ]

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Bot className="w-6 h-6 text-green-600" />
          </div>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            OpenAI Assistants
          </Badge>
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            Function Calling
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          OpenAI Assistants Integration
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Supercharge your OpenAI Assistants with real-time web search and scraping capabilities. 
          Enable your AI assistants to access current information and perform research tasks automatically.
        </p>
      </div>

      <Callout type="success" title="Function Calling Ready">
        Venym Search APIs integrate perfectly with OpenAI's Function Calling feature, 
        allowing your assistants to search the web and scrape content autonomously.
      </Callout>

      {/* Key Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Key Features</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <feature.icon className="w-6 h-6 text-[#efa72d]" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Setup Guide */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Setup Guide</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">1. Create Assistant with Venym Search Functions</h3>
            <CodeBlock
              language="python"
              code={assistantCreation}
              title="Create OpenAI Assistant with Venym Search Integration"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">2. Handle Function Calls</h3>
            <CodeBlock
              language="python" 
              code={functionHandling}
              title="Function Call Handler for Venym Search APIs"
            />
          </div>
        </div>
      </div>

      {/* Complete Example */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Complete Streamlit Chatbot</h2>
        
        <p className="text-gray-600 mb-6">
          Here's a complete example of a Streamlit chatbot powered by OpenAI Assistants and Venym Search:
        </p>
        
        <CodeBlock
          language="python"
          code={chatbotExample}
          title="Complete Research Chatbot with Streamlit"
        />
      </div>

      {/* Node.js Example */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Node.js Implementation</h2>
        
        <p className="text-gray-600 mb-6">
          Implementation example using Node.js and the OpenAI JavaScript SDK:
        </p>
        
        <CodeBlock
          language="javascript"
          code={nodeExample}
          title="Node.js OpenAI Assistant with Venym Search"
        />
      </div>

      {/* Use Cases */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Use Cases</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {useCases.map((useCase, index) => (
            <Card key={index} className="border-l-4 border-l-[#efa72d]">
              <CardHeader>
                <CardTitle className="text-lg">{useCase.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">{useCase.description}</p>
                <div className="text-sm text-[#efa72d] font-medium">
                  Examples: {useCase.example}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Best Practices</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Function Design
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>• Write clear, descriptive function descriptions</div>
              <div>• Define comprehensive parameter schemas</div>
              <div>• Handle errors gracefully in function implementations</div>
              <div>• Provide meaningful error messages to the assistant</div>
              <div>• Test functions independently before integration</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>• Implement caching for repeated searches</div>
              <div>• Set appropriate timeouts for API calls</div>
              <div>• Limit the number of results for large queries</div>
              <div>• Use rate limiting to avoid API quotas</div>
              <div>• Monitor token usage and optimize prompts</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Start */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Quick Start Checklist</h2>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#17457c] text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <span>Get your OpenAI API key from the OpenAI dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#17457c] text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <span>Sign up for Venym Search and get your API key</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#17457c] text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <span>Create an OpenAI Assistant with Venym Search function definitions</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#17457c] text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <span>Implement function handlers for Venym Search API calls</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#17457c] text-white rounded-full flex items-center justify-center font-bold text-sm">5</div>
                <span>Test your assistant with research queries</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-[#efa72d]" />
              Ready to Build?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Start building intelligent assistants with real-time web access using OpenAI and Venym Search.
            </p>
            <div className="flex gap-2">
              <Link href="/docs/api/search">
                <Button size="sm" className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white">
                  API Reference
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="https://platform.openai.com/docs/assistants/overview" target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                  OpenAI Docs
                  <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-500" />
              More Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Explore other AI and automation integrations with Venym Search APIs.
            </p>
            <div className="flex gap-2">
              <Link href="/docs/integrations/anthropic-claude">
                <Button size="sm" variant="outline" className="border-gray-300">
                  Anthropic Claude
                </Button>
              </Link>
              <Link href="/docs/integrations/langchain">
                <Button size="sm" variant="outline" className="border-gray-300">
                  LangChain
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}