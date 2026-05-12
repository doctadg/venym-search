import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Target,
  TrendingUp,
  Bell,
  Database,
  Code,
  Play,
  CheckCircle,
  ArrowRight,
  Clock,
  Zap,
  BarChart3,
  AlertCircle
} from 'lucide-react'
import { CodeBlock } from '../../components/CodeBlock'
import { Callout } from '../../components/Callout'

export default function BitcoinTrackingGuidePage() {
  const setupCode = {
    python: `# requirements.txt
VENYM_SEARCH-python>=1.0.0
requests>=2.28.0
pandas>=1.5.0
matplotlib>=3.6.0
schedule>=1.2.0
python-dotenv>=1.0.0
smtplib  # Built-in for email alerts

# Install dependencies
pip install -r requirements.txt`
  }

  const configCode = `# config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # API Keys
    VENYM_SEARCH_API_KEY = os.getenv('VENYM_SEARCH_API_KEY')
    
    # Monitoring settings
    CHECK_INTERVAL_MINUTES = int(os.getenv('CHECK_INTERVAL_MINUTES', 30))
    PRICE_THRESHOLD_HIGH = float(os.getenv('PRICE_THRESHOLD_HIGH', 150000))
    PRICE_THRESHOLD_LOW = float(os.getenv('PRICE_THRESHOLD_LOW', 80000))
    
    # Data sources to monitor
    SOURCES = [
        'coinmarketcap.com/currencies/bitcoin',
        'coingecko.com/en/coins/bitcoin',
        'bloomberg.com/quote/XBTUSD:CUR',
        'cnn.com/business/bitcoin',
        'reuters.com/technology/bitcoin'
    ]
    
    # Alert settings
    EMAIL_ALERTS = os.getenv('EMAIL_ALERTS', 'False').lower() == 'true'
    EMAIL_FROM = os.getenv('EMAIL_FROM')
    EMAIL_TO = os.getenv('EMAIL_TO')
    SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
    EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')
    
    # Storage
    DATA_FILE = 'bitcoin_data.csv'
    LOG_FILE = 'bitcoin_tracker.log'`

  const trackerCode = `# bitcoin_tracker.py
import requests
import pandas as pd
import json
import re
import schedule
import time
import smtplib
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart
from datetime import datetime
import logging
from config import Config

class BitcoinTracker:
    def __init__(self):
        self.api_key = Config.VENYM_SEARCH_API_KEY
        self.setup_logging()
        self.data_history = self.load_existing_data()
        
    def setup_logging(self):
        """Set up logging configuration."""
        logging.basicConfig(
            filename=Config.LOG_FILE,
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)
    
    def load_existing_data(self):
        """Load existing price data from CSV file."""
        try:
            return pd.read_csv(Config.DATA_FILE)
        except FileNotFoundError:
            # Create new DataFrame with required columns
            return pd.DataFrame(columns=[
                'timestamp', 'current_price', 'market_cap', 
                'volume_24h', 'price_change_24h', 'sentiment_score',
                'news_count', 'prediction_avg', 'source'
            ])
    
    def search_bitcoin_info(self, query="Bitcoin price current market analysis"):
        """Search for Bitcoin information using SwiftSearch."""
        try:
            response = requests.post(
                "https://www.search.venym.io/api/v1/swiftsearch",
                headers={
                    "Authorization": "Bearer " + self.api_key,
                    "Content-Type": "application/json"
                },
                json={
                    "query": query,
                    "max_results": 10,
                    "auto_scrape_top": 5
                }
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            self.logger.error(f"Search failed: {e}")
            return None
    
    def scrape_specific_source(self, url):
        """Scrape a specific Bitcoin data source."""
        try:
            response = requests.post(
                "https://www.search.venym.io/api/v1/scrapeforge",
                headers={
                    "Authorization": "Bearer " + self.api_key,
                    "Content-Type": "application/json"
                },
                json={
                    "url": url,
                    "extract_options": ["title", "text", "metadata"]
                }
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            self.logger.error(f"Scraping {url} failed: {e}")
            return None
    
    def extract_price_from_text(self, text):
        """Extract Bitcoin price from scraped text using regex."""
        # Common price patterns
        patterns = [
            r'\\$([0-9]{1,3}(?:,[0-9]{3})*(?:\\.[0-9]{2})?)',  # $123,456.78
            r'([0-9]{1,3}(?:,[0-9]{3})*(?:\\.[0-9]{2})?)\\s*USD',  # 123,456.78 USD
            r'BTC[:\s]*\\$?([0-9]{1,3}(?:,[0-9]{3})*(?:\\.[0-9]{2})?)',  # BTC: $123,456
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                # Clean and convert to float
                price_str = matches[0].replace(',', '')
                try:
                    price = float(price_str)
                    # Sanity check: Bitcoin price should be reasonable
                    if 1000 <= price <= 1000000:
                        return price
                except ValueError:
                    continue
        
        return None
    
    def analyze_sentiment(self, scraped_content):
        """Analyze market sentiment from scraped content."""
        positive_words = [
            'bullish', 'surge', 'rally', 'growth', 'increase', 'rise', 
            'optimistic', 'breakthrough', 'adoption', 'institutional'
        ]
        negative_words = [
            'bearish', 'crash', 'decline', 'drop', 'fall', 'pessimistic',
            'regulation', 'ban', 'risk', 'volatility', 'correction'
        ]
        
        sentiment_score = 0
        word_count = 0
        
        for content in scraped_content:
            if content.get('text'):
                text = content['text'].lower()
                words = text.split()
                word_count += len(words)
                
                for word in positive_words:
                    sentiment_score += text.count(word) * 1
                
                for word in negative_words:
                    sentiment_score -= text.count(word) * 1
        
        # Normalize sentiment score
        if word_count > 0:
            return sentiment_score / (word_count / 1000)  # Per 1000 words
        return 0
    
    def extract_predictions(self, scraped_content):
        """Extract price predictions from scraped content."""
        predictions = []
        
        for content in scraped_content:
            if content.get('text'):
                text = content['text']
                # Look for price predictions
                prediction_patterns = [
                    r'predict[s]?.*?\\$([0-9]{1,3}(?:,[0-9]{3})*)',
                    r'target.*?\\$([0-9]{1,3}(?:,[0-9]{3})*)',
                    r'forecast[s]?.*?\\$([0-9]{1,3}(?:,[0-9]{3})*)',
                    r'2025.*?\\$([0-9]{1,3}(?:,[0-9]{3})*)',
                ]
                
                for pattern in prediction_patterns:
                    matches = re.findall(pattern, text, re.IGNORECASE)
                    for match in matches:
                        try:
                            price = float(match.replace(',', ''))
                            if 50000 <= price <= 1000000:  # Reasonable prediction range
                                predictions.append(price)
                        except ValueError:
                            continue
        
        return predictions
    
    def collect_data(self):
        """Main data collection function."""
        self.logger.info("Starting Bitcoin data collection...")
        
        # Search for current Bitcoin information
        search_data = self.search_bitcoin_info()
        if not search_data:
            self.logger.error("Failed to get search data")
            return None
        
        current_price = None
        all_scraped_content = search_data.get('scraped_content', [])
        
        # Try to extract price from search results
        for content in all_scraped_content:
            if content.get('text'):
                price = self.extract_price_from_text(content['text'])
                if price:
                    current_price = price
                    break
        
        # If no price found in search, try specific sources
        if not current_price:
            for source_url in Config.SOURCES[:2]:  # Check first 2 sources
                scraped_data = self.scrape_specific_source(f"https://{source_url}")
                if scraped_data and scraped_data.get('primary_content', {}).get('text'):
                    text = scraped_data['primary_content']['text']
                    price = self.extract_price_from_text(text)
                    if price:
                        current_price = price
                        all_scraped_content.append(scraped_data['primary_content'])
                        break
        
        if not current_price:
            self.logger.warning("Could not extract Bitcoin price")
            return None
        
        # Analyze data
        sentiment_score = self.analyze_sentiment(all_scraped_content)
        predictions = self.extract_predictions(all_scraped_content)
        prediction_avg = sum(predictions) / len(predictions) if predictions else None
        
        # Create data record
        data_record = {
            'timestamp': datetime.now().isoformat(),
            'current_price': current_price,
            'sentiment_score': sentiment_score,
            'news_count': len(search_data.get('search_results', [])),
            'prediction_avg': prediction_avg,
            'source': 'VENYM_SEARCH_analysis',
            'scraped_sources': len(all_scraped_content)
        }
        
        self.logger.info(f"Collected data: BTC \${current_price:,.2f}, Sentiment: {sentiment_score:.2f}")
        
        # Save to history
        new_row = pd.DataFrame([data_record])
        self.data_history = pd.concat([self.data_history, new_row], ignore_index=True)
        self.data_history.to_csv(Config.DATA_FILE, index=False)
        
        # Check for alerts
        self.check_alerts(current_price, data_record)
        
        return data_record
    
    def check_alerts(self, current_price, data_record):
        """Check if price alerts should be triggered."""
        alert_triggered = False
        alert_message = ""
        
        if current_price >= Config.PRICE_THRESHOLD_HIGH:
            alert_triggered = True
            alert_message = f"🚀 Bitcoin BULL ALERT: \${current_price:,.2f} (Above \${Config.PRICE_THRESHOLD_HIGH:,.2f})"
        elif current_price <= Config.PRICE_THRESHOLD_LOW:
            alert_triggered = True
            alert_message = f"📉 Bitcoin BEAR ALERT: \${current_price:,.2f} (Below \${Config.PRICE_THRESHOLD_LOW:,.2f})"
        
        # Check for significant sentiment changes
        if len(self.data_history) > 1:
            prev_sentiment = self.data_history.iloc[-2]['sentiment_score']
            current_sentiment = data_record['sentiment_score']
            sentiment_change = abs(current_sentiment - prev_sentiment)
            
            if sentiment_change > 5:  # Significant sentiment shift
                alert_triggered = True
                trend = "POSITIVE" if current_sentiment > prev_sentiment else "NEGATIVE"
                alert_message += f"\\n\\n📊 SENTIMENT ALERT: {trend} shift detected (Change: {sentiment_change:.1f})"
        
        if alert_triggered:
            self.logger.info(f"Alert triggered: {alert_message}")
            if Config.EMAIL_ALERTS:
                self.send_email_alert(alert_message, data_record)
            print(f"\\n{alert_message}\\n")
    
    def send_email_alert(self, message, data_record):
        """Send email alert."""
        try:
            msg = MimeMultipart()
            msg['From'] = Config.EMAIL_FROM
            msg['To'] = Config.EMAIL_TO
            msg['Subject'] = f"Bitcoin Alert - \${data_record['current_price']:,.2f}"
            
            body = f"""
Bitcoin Tracker Alert

{message}

Current Data:
- Price: \${data_record['current_price']:,.2f}
- Sentiment Score: {data_record['sentiment_score']:.2f}
- News Articles: {data_record['news_count']}
- Avg Prediction: \${data_record.get('prediction_avg', 'N/A')}
- Timestamp: {data_record['timestamp']}

Visit your dashboard for more details.
            """
            
            msg.attach(MimeText(body, 'plain'))
            
            server = smtplib.SMTP(Config.SMTP_SERVER, Config.SMTP_PORT)
            server.starttls()
            server.login(Config.EMAIL_FROM, Config.EMAIL_PASSWORD)
            server.sendmail(Config.EMAIL_FROM, Config.EMAIL_TO, msg.as_string())
            server.quit()
            
            self.logger.info("Email alert sent successfully")
        except Exception as e:
            self.logger.error(f"Failed to send email alert: {e}")
    
    def get_summary_report(self):
        """Generate a summary report of recent data."""
        if len(self.data_history) == 0:
            return "No data available yet."
        
        recent_data = self.data_history.tail(24)  # Last 24 records
        
        current_price = recent_data.iloc[-1]['current_price']
        avg_price = recent_data['current_price'].mean()
        price_change = current_price - recent_data.iloc[0]['current_price']
        price_change_pct = (price_change / recent_data.iloc[0]['current_price']) * 100
        
        avg_sentiment = recent_data['sentiment_score'].mean()
        
        report = f"""
Bitcoin Tracker Summary Report
================================

Current Status:
- Latest Price: \${current_price:,.2f}
- 24-Record Average: \${avg_price:,.2f}
- Change: \${price_change:,.2f} ({price_change_pct:+.2f}%)
- Average Sentiment: {avg_sentiment:.2f}

Data Points: {len(self.data_history)}
Last Updated: {recent_data.iloc[-1]['timestamp']}

Thresholds:
- High Alert: \${Config.PRICE_THRESHOLD_HIGH:,.2f}
- Low Alert: \${Config.PRICE_THRESHOLD_LOW:,.2f}
"""
        
        return report
    
    def start_monitoring(self):
        """Start the monitoring process."""
        print("🚀 Starting Bitcoin Price Tracker...")
        print(f"⏰ Checking every {Config.CHECK_INTERVAL_MINUTES} minutes")
        print(f"📊 Alert thresholds: \${Config.PRICE_THRESHOLD_LOW:,} - \${Config.PRICE_THRESHOLD_HIGH:,}")
        
        # Schedule data collection
        schedule.every(Config.CHECK_INTERVAL_MINUTES).minutes.do(self.collect_data)
        
        # Run initial collection
        self.collect_data()
        
        # Keep running
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # Check every minute for scheduled jobs
        except KeyboardInterrupt:
            print("\\n👋 Bitcoin tracker stopped.")
            self.logger.info("Bitcoin tracker stopped by user")`

  const mainCode = `# main.py
from bitcoin_tracker import BitcoinTracker
import argparse

def main():
    parser = argparse.ArgumentParser(description='Bitcoin Price Tracker')
    parser.add_argument('--collect', action='store_true', help='Run one-time data collection')
    parser.add_argument('--report', action='store_true', help='Show summary report')
    parser.add_argument('--monitor', action='store_true', help='Start continuous monitoring')
    
    args = parser.parse_args()
    
    tracker = BitcoinTracker()
    
    if args.collect:
        print("Collecting Bitcoin data...")
        data = tracker.collect_data()
        if data:
            print(f"✅ Data collected: BTC \${data['current_price']:,.2f}")
        else:
            print("❌ Data collection failed")
    
    elif args.report:
        print(tracker.get_summary_report())
    
    elif args.monitor:
        tracker.start_monitoring()
    
    else:
        print("Bitcoin Price Tracker")
        print("Usage:")
        print("  python main.py --collect   # One-time data collection")
        print("  python main.py --report    # Show summary report")
        print("  python main.py --monitor   # Start continuous monitoring")

if __name__ == "__main__":
    main()`

  const envExample = `# .env
VENYM_SEARCH_API_KEY=sk_live_YOUR_API_KEY_key_here

# Monitoring Settings
CHECK_INTERVAL_MINUTES=30
PRICE_THRESHOLD_HIGH=150000
PRICE_THRESHOLD_LOW=80000

# Email Alerts (optional)
EMAIL_ALERTS=true
EMAIL_FROM=your_email@gmail.com
EMAIL_TO=alerts@yourcompany.com
EMAIL_PASSWORD=your_app_password
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587`

  const usageExamples = {
    bash: `# Run one-time data collection
python main.py --collect

# Show current summary report
python main.py --report

# Start continuous monitoring (runs until stopped)
python main.py --monitor`,
    python: `# Use as a library
from bitcoin_tracker import BitcoinTracker

tracker = BitcoinTracker()

# Collect data once
data = tracker.collect_data()
print(f"Bitcoin price: \${data['current_price']:,.2f}")

# Get historical data
df = tracker.data_history
latest_prices = df.tail(10)['current_price'].tolist()
print(f"Last 10 prices: {latest_prices}")`
  }

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Target className="w-6 h-6 text-orange-600" />
          </div>
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            Featured Guide
          </Badge>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            ~2 hours
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          Bitcoin Price Tracking Bot
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Build a comprehensive Bitcoin price monitoring system that tracks prices, analyzes market sentiment, 
          sends alerts, and provides predictive insights using Venym Search APIs.
        </p>
      </div>

      {/* What You'll Build */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">What You'll Build</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <TrendingUp className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-sm text-gray-600">Monitor Bitcoin prices from multiple sources with automatic updates</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <BarChart3 className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="font-semibold mb-2">Sentiment Analysis</h3>
              <p className="text-sm text-gray-600">Analyze market sentiment from news articles and social media</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-[#efa72d]">
            <CardContent className="p-4">
              <Bell className="w-8 h-8 text-[#efa72d] mb-3" />
              <h3 className="font-semibold mb-2">Smart Alerts</h3>
              <p className="text-sm text-gray-600">Price threshold alerts and sentiment change notifications</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <Database className="w-8 h-8 text-purple-500 mb-3" />
              <h3 className="font-semibold mb-2">Historical Data</h3>
              <p className="text-sm text-gray-600">Store and analyze price history with trend analysis</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Callout type="info" title="Prerequisites">
        Basic Python knowledge, Venym Search API key, and about 2 hours. We'll use SwiftSearch for data collection, 
        ScrapeForge for specific sources, and DeepDive for market research.
      </Callout>

      {/* Setup & Installation */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">1. Setup & Installation</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Install Dependencies</h3>
            <CodeBlock
              multiLanguage={setupCode}
              title="Project setup"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Environment Configuration</h3>
            <CodeBlock
              code={envExample}
              language="bash"
              title=".env file configuration"
            />
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">2. Configuration Module</h2>
        
        <p className="text-gray-600 mb-6">
          Create a configuration module to manage all settings, thresholds, and data sources.
        </p>

        <CodeBlock
          code={configCode}
          language="python"
          title="config.py - Centralized configuration"
        />
      </div>

      {/* Main Tracker Class */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">3. Bitcoin Tracker Implementation</h2>
        
        <p className="text-gray-600 mb-6">
          The core tracker class that handles data collection, analysis, and alerting using Venym Search APIs.
        </p>

        <CodeBlock
          code={trackerCode}
          language="python"
          title="bitcoin_tracker.py - Main implementation"
        />

        <div className="mt-6">
          <Callout type="tip" title="Key features of this implementation">
            • Uses SwiftSearch for general Bitcoin news and price data<br />
            • Falls back to ScrapeForge for specific sources if needed<br />
            • Extracts prices using regex patterns<br />
            • Analyzes sentiment from scraped content<br />
            • Sends email alerts for threshold breaches<br />
            • Stores historical data in CSV format
          </Callout>
        </div>
      </div>

      {/* Main Script */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">4. Main Script</h2>
        
        <p className="text-gray-600 mb-6">
          Create a main script with command-line options for different modes of operation.
        </p>

        <CodeBlock
          code={mainCode}
          language="python"
          title="main.py - Command-line interface"
        />
      </div>

      {/* Usage Examples */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">5. Usage & Testing</h2>
        
        <CodeBlock
          multiLanguage={usageExamples}
          title="How to run the Bitcoin tracker"
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Play className="w-5 h-5" />
                Quick Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Run a one-time data collection to test everything is working:
              </p>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                python main.py --collect
              </code>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Clock className="w-5 h-5" />
                Continuous Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Start continuous monitoring (runs until stopped):
              </p>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                python main.py --monitor
              </code>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Expected Output */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Expected Output</h2>
        
        <CodeBlock
          code={`🚀 Starting Bitcoin Price Tracker...
⏰ Checking every 30 minutes
📊 Alert thresholds: $80,000 - $150,000

INFO - Collected data: BTC $118,450.23, Sentiment: 2.3
INFO - Collected data: BTC $119,123.45, Sentiment: 1.8
INFO - Collected data: BTC $120,890.12, Sentiment: 3.1

📊 SENTIMENT ALERT: POSITIVE shift detected (Change: 1.3)

✅ Data collected: BTC $120,890.12
📧 Email alert sent successfully

Bitcoin Tracker Summary Report
================================

Current Status:
- Latest Price: $120,890.12
- 24-Record Average: $119,456.78
- Change: +$2,890.12 (+2.45%)
- Average Sentiment: 2.4

Data Points: 48
Last Updated: 2025-07-22T15:30:42.123456`}
          language="bash"
          title="Sample output when running"
        />
      </div>

      {/* Enhancements */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Enhancement Ideas</h2>
        
        <div className="space-y-6">
          <Card className="border-l-4 border-l-[#efa72d]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#efa72d]" />
                Advanced Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Technical Analysis</p>
                  <p className="text-sm text-gray-600">Add moving averages, RSI, and other indicators</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Social Media Monitoring</p>
                  <p className="text-sm text-gray-600">Track Twitter sentiment and Reddit discussions</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Machine Learning Predictions</p>
                  <p className="text-sm text-gray-600">Train models on historical data for price forecasting</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-500" />
                Integration Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Webhook Notifications</p>
                  <p className="text-sm text-gray-600">Send alerts to Slack, Discord, or custom endpoints</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Database Storage</p>
                  <p className="text-sm text-gray-600">Replace CSV with PostgreSQL or MongoDB</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Web Dashboard</p>
                  <p className="text-sm text-gray-600">Build a Flask/FastAPI dashboard with charts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Troubleshooting</h2>
        
        <div className="space-y-4">
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Price extraction fails</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Check the regex patterns in <code>extract_price_from_text()</code>. 
                    Websites may change their format. Add debugging prints to see the scraped text.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">High credit usage</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Reduce <code>auto_scrape_top</code> value or increase <code>CHECK_INTERVAL_MINUTES</code>. 
                    Each scraped page costs 3 credits.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Email alerts not working</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Check your email credentials and make sure you're using an app password for Gmail. 
                    Enable 2FA and generate an app-specific password.
                  </p>
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
              <Target className="w-5 h-5 text-[#efa72d]" />
              Deploy to Production
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Learn how to deploy this bot to AWS, Google Cloud, or a VPS for 24/7 monitoring.
            </p>
            <Link href="/docs/guides/deployment">
              <Button variant="outline" className="border-[#efa72d] text-[#efa72d] hover:bg-[#efa72d] hover:text-white">
                Deployment Guide
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#17457c]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-[#17457c]" />
              More Use Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Explore other real-world applications like e-commerce monitoring and lead generation.
            </p>
            <div className="flex gap-2">
              <Link href="/docs/guides/ecommerce-monitoring">
                <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                  E-commerce
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