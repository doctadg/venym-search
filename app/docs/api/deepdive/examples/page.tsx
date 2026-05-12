import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Brain, 
  TrendingUp, 
  Users,
  FileText,
  ArrowRight,
  BarChart,
  Target,
  Lightbulb,
  Database,
  Search,
  Globe,
  Zap,
  CheckCircle
} from 'lucide-react'
import { CodeBlock } from '../../../components/CodeBlock'
import { Callout } from '../../../components/Callout'

export default function DeepDiveExamplesPage() {
  const marketResearch = {
    python: `import requests
import json

# Comprehensive market research with trend analysis
response = requests.post(
    "https://www.search.venym.io/api/v1/deepdive",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
    json={
        "research_query": "Electric vehicle market growth and adoption trends 2025",
        "sources": ["industry_reports", "financial", "news", "academic"],
        "analysis_depth": "comprehensive",
        "max_sources": 40,
        "timeframe": "2020-2025",
        "geographic_focus": ["North America", "Europe", "China"],
        "include_trends": True,
        "include_sentiment": True,
        "generate_summary": True,
        "generate_recommendations": True,
        "visualization_data": True
    }
)

data = response.json()
print(f"Market research completed in {data['processing_time']}s")
print(f"Sources analyzed: {len(data['sources_analyzed'])}")

# Display executive summary
print("\\n=== EXECUTIVE SUMMARY ===")
print(data['executive_summary'])

# Analyze key insights
print("\\n=== KEY MARKET INSIGHTS ===")
for i, insight in enumerate(data['key_insights'][:5], 1):
    print(f"{i}. {insight['insight']}")
    print(f"   Confidence: {insight['confidence']:.2f}")
    print(f"   Based on {len(insight['sources'])} sources")
    print()

# Display trend analysis
print("=== MARKET TRENDS ===")
for trend in data['trend_analysis']:
    direction_emoji = "📈" if trend['direction'] == 'increasing' else "📉" if trend['direction'] == 'decreasing' else "➡️"
    print(f"{direction_emoji} {trend['trend']}")
    print(f"   Direction: {trend['direction']} (confidence: {trend['confidence']:.2f})")
    print(f"   Timeframe: {trend['timeframe']}")
    print()

# Strategic recommendations
print("=== STRATEGIC RECOMMENDATIONS ===")
for i, rec in enumerate(data['recommendations'][:3], 1):
    print(f"{i}. {rec['recommendation']}")
    print(f"   Priority: {rec['priority']}")
    print(f"   Rationale: {rec['rationale']}")
    print()

# Visualization data for charts
if 'visualization_data' in data:
    print(f"Visualization data available: {len(data['visualization_data']['charts'])} charts")
    print(f"Market metrics: {list(data['visualization_data']['metrics'].keys())}")

print(f"\\nTotal credits used: {data['credits_used']}")`,
    javascript: `const axios = require('axios');

async function marketResearch() {
  try {
    const response = await axios.post(
      'https://www.search.venym.io/api/v1/deepdive',
      {
        research_query: 'Electric vehicle market growth and adoption trends 2025',
        sources: ['industry_reports', 'financial', 'news', 'academic'],
        analysis_depth: 'comprehensive',
        max_sources: 40,
        timeframe: '2020-2025',
        geographic_focus: ['North America', 'Europe', 'China'],
        include_trends: true,
        include_sentiment: true,
        generate_summary: true,
        generate_recommendations: true,
        visualization_data: true
      },
      {
        headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
      }
    );

    const data = response.data;
    console.log(\`Market research completed in \${data.processing_time}s\`);
    console.log(\`Sources analyzed: \${data.sources_analyzed.length}\`);

    // Display executive summary
    console.log('\\n=== EXECUTIVE SUMMARY ===');
    console.log(data.executive_summary);

    // Analyze key insights
    console.log('\\n=== KEY MARKET INSIGHTS ===');
    data.key_insights.slice(0, 5).forEach((insight, index) => {
      console.log(\`\${index + 1}. \${insight.insight}\`);
      console.log(\`   Confidence: \${insight.confidence.toFixed(2)}\`);
      console.log(\`   Based on \${insight.sources.length} sources\`);
      console.log();
    });

    // Display trend analysis
    console.log('=== MARKET TRENDS ===');
    data.trend_analysis.forEach(trend => {
      const directionEmoji = trend.direction === 'increasing' ? '📈' : 
                           trend.direction === 'decreasing' ? '📉' : '➡️';
      console.log(\`\${directionEmoji} \${trend.trend}\`);
      console.log(\`   Direction: \${trend.direction} (confidence: \${trend.confidence.toFixed(2)})\`);
      console.log(\`   Timeframe: \${trend.timeframe}\`);
      console.log();
    });

    // Strategic recommendations
    console.log('=== STRATEGIC RECOMMENDATIONS ===');
    data.recommendations.slice(0, 3).forEach((rec, index) => {
      console.log(\`\${index + 1}. \${rec.recommendation}\`);
      console.log(\`   Priority: \${rec.priority}\`);
      console.log(\`   Rationale: \${rec.rationale}\`);
      console.log();
    });

    // Visualization data for charts
    if (data.visualization_data) {
      console.log(\`Visualization data available: \${data.visualization_data.charts.length} charts\`);
      console.log(\`Market metrics: \${Object.keys(data.visualization_data.metrics).join(', ')}\`);
    }

    console.log(\`\\nTotal credits used: \${data.credits_used}\`);
    
    return data;
  } catch (error) {
    console.error('Market research failed:', error.response?.data || error.message);
  }
}

marketResearch();`
  }

  const competitiveAnalysis = {
    python: `import requests
import json

# Advanced competitive intelligence analysis
response = requests.post(
    "https://www.search.venym.io/api/v1/deepdive",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
    json={
        "research_query": "Streaming services competitive landscape 2025",
        "analysis_type": "competitive_analysis",
        "entities": ["Netflix", "Disney+", "Amazon Prime Video", "Apple TV+", "HBO Max"],
        "focus_areas": ["subscriber_growth", "content_strategy", "pricing", "market_share"],
        "sources": ["financial", "industry_reports", "news", "social_media"],
        "analysis_depth": "comprehensive",
        "max_sources": 60,
        "include_sentiment": True,
        "include_trends": True,
        "confidence_threshold": 0.75,
        "generate_summary": True,
        "generate_recommendations": True,
        "export_format": "pdf"
    }
)

data = response.json()
print(f"Competitive analysis completed")
print(f"Entities analyzed: {len(data.get('entity_analysis', {}))}")

# Executive summary
print("\\n=== COMPETITIVE LANDSCAPE SUMMARY ===")
print(data['executive_summary'])

# Detailed entity analysis
print("\\n=== ENTITY ANALYSIS ===")
for entity, analysis in data.get('entity_analysis', {}).items():
    print(f"\\n📺 {entity.upper()}")
    print(f"Market Position: {analysis.get('market_position', 'Unknown')}")
    print(f"Sentiment Score: {analysis.get('sentiment_score', 0):.2f}/1.0")
    print(f"Mentions Analyzed: {analysis.get('mention_count', 0)}")
    
    # Key strengths and weaknesses
    strengths = analysis.get('strengths', [])[:3]
    weaknesses = analysis.get('weaknesses', [])[:3]
    
    if strengths:
        print(f"✅ Strengths: {', '.join(strengths)}")
    if weaknesses:
        print(f"⚠️  Weaknesses: {', '.join(weaknesses)}")
    
    # Focus area analysis
    focus_metrics = analysis.get('focus_metrics', {})
    for area, score in focus_metrics.items():
        print(f"   {area.replace('_', ' ').title()}: {score}")

# Market trends affecting all players
print("\\n=== INDUSTRY TRENDS ===")
for trend in data['trend_analysis'][:5]:
    trend_emoji = "🔥" if trend['confidence'] > 0.8 else "📊"
    print(f"{trend_emoji} {trend['trend']}")
    print(f"   Impact: {trend.get('impact_level', 'Medium')}")
    print(f"   Timeframe: {trend['timeframe']}")
    print(f"   Confidence: {trend['confidence']:.2f}")
    print()

# Strategic recommendations
print("=== STRATEGIC RECOMMENDATIONS ===")
for i, rec in enumerate(data['recommendations'], 1):
    print(f"{i}. {rec['recommendation']}")
    print(f"   Target: {rec.get('target_entity', 'All players')}")
    print(f"   Priority: {rec['priority']}")
    print(f"   Expected Outcome: {rec.get('expected_outcome', 'Not specified')}")
    print()

# Export information
if 'export_url' in data:
    print(f"📄 Detailed report available: {data['export_url']}")

print(f"\\nAnalysis completed using {data['credits_used']} credits")`,
    javascript: `const axios = require('axios');

async function competitiveAnalysis() {
  try {
    const response = await axios.post(
      'https://www.search.venym.io/api/v1/deepdive',
      {
        research_query: 'Streaming services competitive landscape 2025',
        analysis_type: 'competitive_analysis',
        entities: ['Netflix', 'Disney+', 'Amazon Prime Video', 'Apple TV+', 'HBO Max'],
        focus_areas: ['subscriber_growth', 'content_strategy', 'pricing', 'market_share'],
        sources: ['financial', 'industry_reports', 'news', 'social_media'],
        analysis_depth: 'comprehensive',
        max_sources: 60,
        include_sentiment: true,
        include_trends: true,
        confidence_threshold: 0.75,
        generate_summary: true,
        generate_recommendations: true,
        export_format: 'pdf'
      },
      {
        headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
      }
    );

    const data = response.data;
    console.log('Competitive analysis completed');
    console.log(\`Entities analyzed: \${Object.keys(data.entity_analysis || {}).length}\`);

    // Executive summary
    console.log('\\n=== COMPETITIVE LANDSCAPE SUMMARY ===');
    console.log(data.executive_summary);

    // Detailed entity analysis
    console.log('\\n=== ENTITY ANALYSIS ===');
    Object.entries(data.entity_analysis || {}).forEach(([entity, analysis]) => {
      console.log(\`\\n📺 \${entity.toUpperCase()}\`);
      console.log(\`Market Position: \${analysis.market_position || 'Unknown'}\`);
      console.log(\`Sentiment Score: \${(analysis.sentiment_score || 0).toFixed(2)}/1.0\`);
      console.log(\`Mentions Analyzed: \${analysis.mention_count || 0}\`);
      
      // Key strengths and weaknesses
      const strengths = (analysis.strengths || []).slice(0, 3);
      const weaknesses = (analysis.weaknesses || []).slice(0, 3);
      
      if (strengths.length > 0) {
        console.log(\`✅ Strengths: \${strengths.join(', ')}\`);
      }
      if (weaknesses.length > 0) {
        console.log(\`⚠️  Weaknesses: \${weaknesses.join(', ')}\`);
      }
      
      // Focus area analysis
      const focusMetrics = analysis.focus_metrics || {};
      Object.entries(focusMetrics).forEach(([area, score]) => {
        console.log(\`   \${area.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())}: \${score}\`);
      });
    });

    // Market trends affecting all players
    console.log('\\n=== INDUSTRY TRENDS ===');
    (data.trend_analysis || []).slice(0, 5).forEach(trend => {
      const trendEmoji = trend.confidence > 0.8 ? '🔥' : '📊';
      console.log(\`\${trendEmoji} \${trend.trend}\`);
      console.log(\`   Impact: \${trend.impact_level || 'Medium'}\`);
      console.log(\`   Timeframe: \${trend.timeframe}\`);
      console.log(\`   Confidence: \${trend.confidence.toFixed(2)}\`);
      console.log();
    });

    // Strategic recommendations
    console.log('=== STRATEGIC RECOMMENDATIONS ===');
    (data.recommendations || []).forEach((rec, index) => {
      console.log(\`\${index + 1}. \${rec.recommendation}\`);
      console.log(\`   Target: \${rec.target_entity || 'All players'}\`);
      console.log(\`   Priority: \${rec.priority}\`);
      console.log(\`   Expected Outcome: \${rec.expected_outcome || 'Not specified'}\`);
      console.log();
    });

    // Export information
    if (data.export_url) {
      console.log(\`📄 Detailed report available: \${data.export_url}\`);
    }

    console.log(\`\\nAnalysis completed using \${data.credits_used} credits\`);
    
    return data;
  } catch (error) {
    console.error('Competitive analysis failed:', error.response?.data || error.message);
  }
}

competitiveAnalysis();`
  }

  const academicResearch = {
    python: `import requests
import json

# Academic literature review with citation analysis
response = requests.post(
    "https://www.search.venym.io/api/v1/deepdive",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
    json={
        "research_query": "Machine learning applications in medical diagnosis: systematic review",
        "analysis_type": "academic_review",
        "sources": ["academic", "patents"],
        "analysis_depth": "comprehensive",
        "max_sources": 50,
        "timeframe": "2020-2025",
        "include_citations": True,
        "citation_format": "apa",
        "include_methodology": True,
        "confidence_threshold": 0.8,
        "generate_summary": True
    }
)

data = response.json()
print(f"Academic review completed in {data['processing_time']}s")
print(f"Papers analyzed: {len(data['sources_analyzed'])}")

# Research methodology
if 'methodology' in data:
    methodology = data['methodology']
    print("\\n=== RESEARCH METHODOLOGY ===")
    print(f"Approach: {methodology.get('approach', 'Systematic review')}")
    print(f"Source Selection: {methodology.get('source_selection', 'Not specified')}")
    print(f"Analysis Methods: {', '.join(methodology.get('analysis_methods', []))}")
    if methodology.get('limitations'):
        print(f"Limitations: {', '.join(methodology['limitations'])}")

# Executive summary of literature
print("\\n=== LITERATURE SUMMARY ===")
print(data['executive_summary'])

# Key research findings
print("\\n=== KEY RESEARCH FINDINGS ===")
for i, insight in enumerate(data['key_insights'][:7], 1):
    print(f"{i}. {insight['insight']}")
    print(f"   Evidence Level: {insight.get('evidence_level', 'Standard')}")
    print(f"   Confidence: {insight['confidence']:.2f}")
    print(f"   Supporting Studies: {len(insight['sources'])}")
    print()

# Research gaps and opportunities
research_gaps = [insight for insight in data['key_insights'] 
                if 'gap' in insight['insight'].lower() or 'need' in insight['insight'].lower()]

if research_gaps:
    print("=== IDENTIFIED RESEARCH GAPS ===")
    for i, gap in enumerate(research_gaps[:3], 1):
        print(f"{i}. {gap['insight']}")
        print(f"   Opportunity Level: {gap.get('opportunity_level', 'Medium')}")
        print()

# Citation analysis
print("=== CITATION ANALYSIS ===")
print(f"Total citations: {len(data.get('citations', []))}")

# Most cited works (simulated based on source data)
high_impact_sources = [source for source in data['sources_analyzed'] 
                      if source.get('relevance', 0) > 0.9][:5]

if high_impact_sources:
    print("\\nHigh-Impact Sources:")
    for i, source in enumerate(high_impact_sources, 1):
        print(f"{i}. {source['title']}")
        print(f"   Relevance: {source['relevance']:.2f}")
        print(f"   Publication: {source.get('publication', 'Unknown')}")
        print(f"   Year: {source.get('year', 'Unknown')}")
        print()

# Sample citations in APA format
print("=== SAMPLE CITATIONS (APA) ===")
for citation in data.get('citations', [])[:5]:
    print(f"• {citation['citation']}")

print(f"\\nReview completed using {data['credits_used']} credits")`,
    javascript: `const axios = require('axios');

async function academicReview() {
  try {
    const response = await axios.post(
      'https://www.search.venym.io/api/v1/deepdive',
      {
        research_query: 'Machine learning applications in medical diagnosis: systematic review',
        analysis_type: 'academic_review',
        sources: ['academic', 'patents'],
        analysis_depth: 'comprehensive',
        max_sources: 50,
        timeframe: '2020-2025',
        include_citations: true,
        citation_format: 'apa',
        include_methodology: true,
        confidence_threshold: 0.8,
        generate_summary: true
      },
      {
        headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
      }
    );

    const data = response.data;
    console.log(\`Academic review completed in \${data.processing_time}s\`);
    console.log(\`Papers analyzed: \${data.sources_analyzed.length}\`);

    // Research methodology
    if (data.methodology) {
      const methodology = data.methodology;
      console.log('\\n=== RESEARCH METHODOLOGY ===');
      console.log(\`Approach: \${methodology.approach || 'Systematic review'}\`);
      console.log(\`Source Selection: \${methodology.source_selection || 'Not specified'}\`);
      console.log(\`Analysis Methods: \${(methodology.analysis_methods || []).join(', ')}\`);
      if (methodology.limitations) {
        console.log(\`Limitations: \${methodology.limitations.join(', ')}\`);
      }
    }

    // Executive summary of literature
    console.log('\\n=== LITERATURE SUMMARY ===');
    console.log(data.executive_summary);

    // Key research findings
    console.log('\\n=== KEY RESEARCH FINDINGS ===');
    data.key_insights.slice(0, 7).forEach((insight, index) => {
      console.log(\`\${index + 1}. \${insight.insight}\`);
      console.log(\`   Evidence Level: \${insight.evidence_level || 'Standard'}\`);
      console.log(\`   Confidence: \${insight.confidence.toFixed(2)}\`);
      console.log(\`   Supporting Studies: \${insight.sources.length}\`);
      console.log();
    });

    // Research gaps and opportunities
    const researchGaps = data.key_insights.filter(insight => 
      insight.insight.toLowerCase().includes('gap') || 
      insight.insight.toLowerCase().includes('need')
    );

    if (researchGaps.length > 0) {
      console.log('=== IDENTIFIED RESEARCH GAPS ===');
      researchGaps.slice(0, 3).forEach((gap, index) => {
        console.log(\`\${index + 1}. \${gap.insight}\`);
        console.log(\`   Opportunity Level: \${gap.opportunity_level || 'Medium'}\`);
        console.log();
      });
    }

    // Citation analysis
    console.log('=== CITATION ANALYSIS ===');
    console.log(\`Total citations: \${(data.citations || []).length}\`);

    // Most cited works (simulated based on source data)
    const highImpactSources = data.sources_analyzed
      .filter(source => (source.relevance || 0) > 0.9)
      .slice(0, 5);

    if (highImpactSources.length > 0) {
      console.log('\\nHigh-Impact Sources:');
      highImpactSources.forEach((source, index) => {
        console.log(\`\${index + 1}. \${source.title}\`);
        console.log(\`   Relevance: \${source.relevance.toFixed(2)}\`);
        console.log(\`   Publication: \${source.publication || 'Unknown'}\`);
        console.log(\`   Year: \${source.year || 'Unknown'}\`);
        console.log();
      });
    }

    // Sample citations in APA format
    console.log('=== SAMPLE CITATIONS (APA) ===');
    (data.citations || []).slice(0, 5).forEach(citation => {
      console.log(\`• \${citation.citation}\`);
    });

    console.log(\`\\nReview completed using \${data.credits_used} credits\`);
    
    return data;
  } catch (error) {
    console.error('Academic review failed:', error.response?.data || error.message);
  }
}

academicReview();`
  }

  const investmentResearch = {
    python: `import requests
import json

# Investment due diligence research
response = requests.post(
    "https://www.search.venym.io/api/v1/deepdive",
    headers={"Authorization": "Bearer " + "sk_live_YOUR_API_KEY_API_KEY_key_here"},
    json={
        "research_query": "Artificial intelligence startup investment opportunities 2025",
        "sources": ["financial", "industry_reports", "news", "patents"],
        "analysis_depth": "comprehensive",
        "entities": ["OpenAI", "Anthropic", "Cohere", "Character.AI", "Stability AI"],
        "focus_areas": ["funding_rounds", "valuation", "technology", "market_position", "team"],
        "max_sources": 45,
        "include_sentiment": True,
        "include_trends": True,
        "generate_recommendations": True,
        "confidence_threshold": 0.7,
        "timeframe": "2023-2025"
    }
)

data = response.json()
print(f"Investment research completed")
print(f"Companies analyzed: {len(data.get('entity_analysis', {}))}")

# Investment landscape summary
print("\\n=== INVESTMENT LANDSCAPE SUMMARY ===")
print(data['executive_summary'])

# Company-by-company analysis
print("\\n=== COMPANY ANALYSIS ===")
for entity, analysis in data.get('entity_analysis', {}).items():
    print(f"\\n🏢 {entity}")
    print(f"Investment Attractiveness: {analysis.get('investment_score', 'N/A')}/10")
    print(f"Market Sentiment: {analysis.get('sentiment_score', 0):.2f}")
    print(f"Risk Level: {analysis.get('risk_assessment', 'Medium')}")
    
    # Key metrics
    focus_metrics = analysis.get('focus_metrics', {})
    for metric, value in focus_metrics.items():
        print(f"   {metric.replace('_', ' ').title()}: {value}")
    
    # Investment highlights
    strengths = analysis.get('strengths', [])[:3]
    risks = analysis.get('risks', [])[:3]
    
    if strengths:
        print(f"   💪 Strengths: {', '.join(strengths)}")
    if risks:
        print(f"   ⚠️  Risks: {', '.join(risks)}")

# Market trends affecting valuations
print("\\n=== MARKET TRENDS ===")
for trend in data['trend_analysis'][:4]:
    impact_emoji = "🔥" if trend.get('market_impact') == 'high' else "📊"
    print(f"{impact_emoji} {trend['trend']}")
    print(f"   Valuation Impact: {trend.get('valuation_impact', 'Neutral')}")
    print(f"   Investment Implication: {trend.get('investment_implication', 'Monitor')}")
    print(f"   Confidence: {trend['confidence']:.2f}")
    print()

# Investment recommendations
print("=== INVESTMENT RECOMMENDATIONS ===")
for i, rec in enumerate(data['recommendations'], 1):
    action_emoji = "🎯" if rec['priority'] == 'high' else "📝" if rec['priority'] == 'medium' else "👀"
    print(f"{action_emoji} {rec['recommendation']}")
    print(f"   Investment Action: {rec.get('investment_action', 'Research further')}")
    print(f"   Risk-Reward: {rec.get('risk_reward_ratio', 'Not specified')}")
    print(f"   Time Horizon: {rec.get('time_horizon', 'Medium-term')}")
    print(f"   Rationale: {rec['rationale']}")
    print()

# Sector insights
sector_insights = [insight for insight in data['key_insights'] 
                  if any(keyword in insight['insight'].lower() 
                        for keyword in ['sector', 'industry', 'market size', 'growth'])]

if sector_insights:
    print("=== SECTOR INSIGHTS ===")
    for insight in sector_insights[:4]:
        print(f"• {insight['insight']}")
        print(f"  Investment Relevance: {insight.get('investment_relevance', 'Medium')}")
        print()

# Risk factors
risk_insights = [insight for insight in data['key_insights'] 
                if any(keyword in insight['insight'].lower() 
                      for keyword in ['risk', 'challenge', 'threat', 'concern'])]

if risk_insights:
    print("=== KEY RISK FACTORS ===")
    for risk in risk_insights[:3]:
        print(f"⚠️  {risk['insight']}")
        print(f"   Risk Level: {risk.get('risk_level', 'Medium')}")
        print()

print(f"\\nDue diligence completed using {data['credits_used']} credits")`,
    javascript: `const axios = require('axios');

async function investmentResearch() {
  try {
    const response = await axios.post(
      'https://www.search.venym.io/api/v1/deepdive',
      {
        research_query: 'Artificial intelligence startup investment opportunities 2025',
        sources: ['financial', 'industry_reports', 'news', 'patents'],
        analysis_depth: 'comprehensive',
        entities: ['OpenAI', 'Anthropic', 'Cohere', 'Character.AI', 'Stability AI'],
        focus_areas: ['funding_rounds', 'valuation', 'technology', 'market_position', 'team'],
        max_sources: 45,
        include_sentiment: true,
        include_trends: true,
        generate_recommendations: true,
        confidence_threshold: 0.7,
        timeframe: '2023-2025'
      },
      {
        headers: { 'Authorization": "Bearer': 'sk_live_YOUR_API_KEY_API_KEY_key_here' }
      }
    );

    const data = response.data;
    console.log('Investment research completed');
    console.log(\`Companies analyzed: \${Object.keys(data.entity_analysis || {}).length}\`);

    // Investment landscape summary
    console.log('\\n=== INVESTMENT LANDSCAPE SUMMARY ===');
    console.log(data.executive_summary);

    // Company-by-company analysis
    console.log('\\n=== COMPANY ANALYSIS ===');
    Object.entries(data.entity_analysis || {}).forEach(([entity, analysis]) => {
      console.log(\`\\n🏢 \${entity}\`);
      console.log(\`Investment Attractiveness: \${analysis.investment_score || 'N/A'}/10\`);
      console.log(\`Market Sentiment: \${(analysis.sentiment_score || 0).toFixed(2)}\`);
      console.log(\`Risk Level: \${analysis.risk_assessment || 'Medium'}\`);
      
      // Key metrics
      const focusMetrics = analysis.focus_metrics || {};
      Object.entries(focusMetrics).forEach(([metric, value]) => {
        console.log(\`   \${metric.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())}: \${value}\`);
      });
      
      // Investment highlights
      const strengths = (analysis.strengths || []).slice(0, 3);
      const risks = (analysis.risks || []).slice(0, 3);
      
      if (strengths.length > 0) {
        console.log(\`   💪 Strengths: \${strengths.join(', ')}\`);
      }
      if (risks.length > 0) {
        console.log(\`   ⚠️  Risks: \${risks.join(', ')}\`);
      }
    });

    // Market trends affecting valuations
    console.log('\\n=== MARKET TRENDS ===');
    data.trend_analysis.slice(0, 4).forEach(trend => {
      const impactEmoji = trend.market_impact === 'high' ? '🔥' : '📊';
      console.log(\`\${impactEmoji} \${trend.trend}\`);
      console.log(\`   Valuation Impact: \${trend.valuation_impact || 'Neutral'}\`);
      console.log(\`   Investment Implication: \${trend.investment_implication || 'Monitor'}\`);
      console.log(\`   Confidence: \${trend.confidence.toFixed(2)}\`);
      console.log();
    });

    // Investment recommendations
    console.log('=== INVESTMENT RECOMMENDATIONS ===');
    data.recommendations.forEach((rec, index) => {
      const actionEmoji = rec.priority === 'high' ? '🎯' : 
                         rec.priority === 'medium' ? '📝' : '👀';
      console.log(\`\${actionEmoji} \${rec.recommendation}\`);
      console.log(\`   Investment Action: \${rec.investment_action || 'Research further'}\`);
      console.log(\`   Risk-Reward: \${rec.risk_reward_ratio || 'Not specified'}\`);
      console.log(\`   Time Horizon: \${rec.time_horizon || 'Medium-term'}\`);
      console.log(\`   Rationale: \${rec.rationale}\`);
      console.log();
    });

    console.log(\`\\nDue diligence completed using \${data.credits_used} credits\`);
    
    return data;
  } catch (error) {
    console.error('Investment research failed:', error.response?.data || error.message);
  }
}

investmentResearch();`
  }

  const examples = [
    {
      title: "Market Research & Analysis",
      description: "Comprehensive market analysis with trend identification and strategic insights",
      icon: BarChart,
      difficulty: "Intermediate",
      credits: "~65 credits",
      features: ["Multi-source analysis", "Trend identification", "Market metrics", "Strategic recommendations"],
      code: marketResearch
    },
    {
      title: "Competitive Intelligence", 
      description: "Advanced competitive analysis with entity comparison and sentiment tracking",
      icon: Target,
      difficulty: "Advanced",
      credits: "~80 credits",
      features: ["Entity analysis", "Sentiment tracking", "Competitive positioning", "Strategic insights"],
      code: competitiveAnalysis
    },
    {
      title: "Academic Literature Review",
      description: "Systematic academic research with citation analysis and methodology documentation",
      icon: FileText,
      difficulty: "Expert",
      credits: "~70 credits",
      features: ["Citation analysis", "Research methodology", "Gap identification", "Evidence synthesis"],
      code: academicResearch
    },
    {
      title: "Investment Due Diligence",
      description: "Comprehensive investment research with risk assessment and valuation insights",
      icon: TrendingUp,
      difficulty: "Expert",
      credits: "~85 credits",
      features: ["Financial analysis", "Risk assessment", "Market trends", "Investment recommendations"],
      code: investmentResearch
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'Advanced': return 'bg-orange-100 text-orange-700'
      case 'Expert': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#17457c]">DeepDive Examples</h1>
            <p className="text-gray-600">AI-powered research workflows and analysis patterns</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Link href="/docs/api/deepdive/parameters">
            <Button variant="outline" size="sm">
              ← Parameters
            </Button>
          </Link>
          <Link href="/docs/api/deepdive">
            <Button variant="outline" size="sm">
              Overview
            </Button>
          </Link>
        </div>

        <Callout type="success" title="AI-Powered Research Examples">
          All examples showcase advanced AI analysis capabilities including sentiment analysis, 
          trend identification, entity recognition, and automated insight generation.
        </Callout>
      </div>

      {/* Examples */}
      <div className="space-y-12">
        {examples.map((example, index) => (
          <div key={index} className="border-b pb-12 last:border-b-0">
            <div className="mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-[#efa72d]/10 rounded-lg">
                  <example.icon className="w-6 h-6 text-[#efa72d]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-[#17457c]">{example.title}</h2>
                    <Badge className={getDifficultyColor(example.difficulty)}>
                      {example.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {example.credits}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{example.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {example.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <CodeBlock 
              multiLanguage={example.code}
              title={`${example.title} Implementation`}
            />
          </div>
        ))}
      </div>

      {/* Research Methodologies */}
      <div className="mb-12 mt-16">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Research Methodologies</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Search className="w-5 h-5" />
                Systematic Review
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Comprehensive source coverage</div>
              <div>• Bias reduction techniques</div>
              <div>• Quality assessment criteria</div>
              <div>• Evidence synthesis methods</div>
              <div>• Reproducible methodology</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <BarChart className="w-5 h-5" />
                Meta-Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Statistical data combination</div>
              <div>• Effect size calculation</div>
              <div>• Heterogeneity assessment</div>
              <div>• Publication bias detection</div>
              <div>• Confidence interval estimation</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Target className="w-5 h-5" />
                Competitive Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• SWOT analysis framework</div>
              <div>• Porter's Five Forces</div>
              <div>• Market positioning maps</div>
              <div>• Benchmarking studies</div>
              <div>• Strategic group analysis</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <TrendingUp className="w-5 h-5" />
                Trend Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Time series analysis</div>
              <div>• Cycle identification</div>
              <div>• Seasonal adjustments</div>
              <div>• Forecasting models</div>
              <div>• Leading indicator analysis</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Users className="w-5 h-5" />
                Sentiment Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Natural language processing</div>
              <div>• Emotion classification</div>
              <div>• Opinion mining techniques</div>
              <div>• Aspect-based sentiment</div>
              <div>• Temporal sentiment tracking</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Database className="w-5 h-5" />
                Cross-Source Validation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>• Source credibility scoring</div>
              <div>• Information triangulation</div>
              <div>• Fact-checking algorithms</div>
              <div>• Consistency analysis</div>
              <div>• Reliability assessment</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Analysis Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">AI Analysis Capabilities</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Brain className="w-5 h-5" />
                Natural Language Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Entity Recognition:</strong>
                <p className="text-gray-600">Automatic identification of people, organizations, locations, and concepts</p>
              </div>
              <div>
                <strong>Relationship Extraction:</strong>
                <p className="text-gray-600">Understanding connections and relationships between entities</p>
              </div>
              <div>
                <strong>Topic Modeling:</strong>
                <p className="text-gray-600">Discovering hidden themes and topics across large document collections</p>
              </div>
              <div>
                <strong>Semantic Analysis:</strong>
                <p className="text-gray-600">Deep understanding of meaning and context beyond keywords</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#17457c]">
                <Zap className="w-5 h-5" />
                Automated Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Pattern Recognition:</strong>
                <p className="text-gray-600">Identifying recurring patterns and anomalies in data</p>
              </div>
              <div>
                <strong>Causal Inference:</strong>
                <p className="text-gray-600">Understanding cause-and-effect relationships</p>
              </div>
              <div>
                <strong>Predictive Analysis:</strong>
                <p className="text-gray-600">Forecasting trends and future developments</p>
              </div>
              <div>
                <strong>Recommendation Generation:</strong>
                <p className="text-gray-600">AI-generated actionable recommendations based on findings</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quality Assurance */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Research Quality & Validation</h2>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#17457c]">Source Quality Assessment</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <strong>Authority Scoring:</strong>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>• Author credentials</li>
                    <li>• Publication reputation</li>
                    <li>• Peer review status</li>
                    <li>• Citation metrics</li>
                  </ul>
                </div>
                <div>
                  <strong>Recency Analysis:</strong>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>• Publication date weighting</li>
                    <li>• Information freshness</li>
                    <li>• Update frequency</li>
                    <li>• Temporal relevance</li>
                  </ul>
                </div>
                <div>
                  <strong>Relevance Scoring:</strong>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>• Topic alignment</li>
                    <li>• Keyword matching</li>
                    <li>• Contextual relevance</li>
                    <li>• Geographic relevance</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#17457c]">Cross-Validation Methods</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <strong>Multi-Source Verification:</strong>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>• Independent source confirmation</li>
                    <li>• Triangulation techniques</li>
                    <li>• Consensus building</li>
                    <li>• Outlier identification</li>
                  </ul>
                </div>
                <div>
                  <strong>Confidence Scoring:</strong>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>• Statistical confidence levels</li>
                    <li>• Evidence strength assessment</li>
                    <li>• Uncertainty quantification</li>
                    <li>• Reliability indicators</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t">
        <Link href="/docs/api/deepdive/parameters">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Parameters Reference
          </Button>
        </Link>
        <Link href="/docs/rate-limits">
          <Button className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white flex items-center gap-2">
            Rate Limits
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}