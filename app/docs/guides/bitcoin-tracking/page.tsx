import Link from 'next/link'
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
        logging.basicConfig(
            filename=Config.LOG_FILE,
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)

    def load_existing_data(self):
        try:
            return pd.read_csv(Config.DATA_FILE)
        except FileNotFoundError:
            return pd.DataFrame(columns=[
                'timestamp', 'current_price', 'market_cap',
                'volume_24h', 'price_change_24h', 'sentiment_score',
                'news_count', 'prediction_avg', 'source'
            ])

    def search_bitcoin_info(self, query="Bitcoin price current market analysis"):
        try:
            response = requests.post(
                "https://www.search.venym.io/api/v1/search",
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
        try:
            response = requests.post(
                "https://www.search.venym.io/api/v1/scrape",
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
        patterns = [
            r'\\$([0-9]{1,3}(?:,[0-9]{3})*(?:\\.[0-9]{2})?)',
            r'([0-9]{1,3}(?:,[0-9]{3})*(?:\\.[0-9]{2})?)\\s*USD',
            r'BTC[:\\s]*\\$?([0-9]{1,3}(?:,[0-9]{3})*(?:\\.[0-9]{2})?)',
        ]

        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                price_str = matches[0].replace(',', '')
                try:
                    price = float(price_str)
                    if 1000 <= price <= 1000000:
                        return price
                except ValueError:
                    continue

        return None

    def collect_data(self):
        self.logger.info("Starting Bitcoin data collection...")
        search_data = self.search_bitcoin_info()
        if not search_data:
            return None

        current_price = None
        for content in search_data.get('scraped_content', []):
            if content.get('text'):
                price = self.extract_price_from_text(content['text'])
                if price:
                    current_price = price
                    break

        if not current_price:
            return None

        data_record = {
            'timestamp': datetime.now().isoformat(),
            'current_price': current_price,
            'news_count': len(search_data.get('search_results', [])),
        }

        new_row = pd.DataFrame([data_record])
        self.data_history = pd.concat([self.data_history, new_row], ignore_index=True)
        self.data_history.to_csv(Config.DATA_FILE, index=False)

        return data_record

    def start_monitoring(self):
        print("Starting Bitcoin Price Tracker...")
        schedule.every(Config.CHECK_INTERVAL_MINUTES).minutes.do(self.collect_data)
        self.collect_data()
        while True:
            schedule.run_pending()
            time.sleep(60)`

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
        data = tracker.collect_data()
        if data:
            print(f"Data collected: BTC \${data['current_price']:,.2f}")
    elif args.monitor:
        tracker.start_monitoring()

if __name__ == "__main__":
    main()`

  const envExample = `# .env
VENYM_SEARCH_API_KEY=sk_live_YOUR_API_KEY_API_KEY_key_here

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

data = tracker.collect_data()
print(f"Bitcoin price: \${data['current_price']:,.2f}")

df = tracker.data_history
latest_prices = df.tail(10)['current_price'].tolist()
print(f"Last 10 prices: {latest_prices}")`
  }

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3 flex items-center gap-3">
          <span>GUIDE · BITCOIN TRACKING</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-amber-400/20 text-amber-300/80">
            Featured
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-emerald-400/20 text-emerald-300/80">
            ~2 hours
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          Bitcoin Price Tracking Bot
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl">
          Build a comprehensive Bitcoin price monitoring system that tracks prices, analyzes market sentiment, sends alerts, and provides predictive insights using Venym Search APIs.
        </p>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">What You'll Build</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">What You'll Build</h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: TrendingUp, title: 'Real-time Tracking', desc: 'Monitor Bitcoin prices from multiple sources with automatic updates' },
            { icon: BarChart3, title: 'Sentiment Analysis', desc: 'Analyze market sentiment from news articles and social media' },
            { icon: Bell, title: 'Smart Alerts', desc: 'Price threshold alerts and sentiment change notifications' },
            { icon: Database, title: 'Historical Data', desc: 'Store and analyze price history with trend analysis' }
          ].map((f) => (
            <div key={f.title} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
              <f.icon className="w-5 h-5 text-white/50 mb-3" />
              <h3 className="text-[14px] font-medium text-white mb-2">{f.title}</h3>
              <p className="text-[12.5px] text-white/55 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Callout type="info" title="Prerequisites">
        Basic Python knowledge, Venym Search API key, and about 2 hours. We'll use Search for data collection.
      </Callout>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-6 inline-flex items-center justify-center text-[10px] font-mono text-white/50 border border-white/10 rounded-sm">01</span>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Setup & Installation</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Install Dependencies</h3>
            <CodeBlock multiLanguage={setupCode} title="Project setup" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Environment Configuration</h3>
            <CodeBlock code={envExample} language="bash" title=".env file configuration" />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-6 inline-flex items-center justify-center text-[10px] font-mono text-white/50 border border-white/10 rounded-sm">02</span>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Configuration Module</h2>
        </div>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Create a configuration module to manage all settings, thresholds, and data sources.
        </p>

        <CodeBlock code={configCode} language="python" title="config.py - Centralized configuration" />
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-6 inline-flex items-center justify-center text-[10px] font-mono text-white/50 border border-white/10 rounded-sm">03</span>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Bitcoin Tracker Implementation</h2>
        </div>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          The core tracker class that handles data collection, analysis, and alerting using Venym Search APIs.
        </p>

        <CodeBlock code={trackerCode} language="python" title="bitcoin_tracker.py - Main implementation" />

        <Callout type="tip" title="Key features of this implementation">
          - Uses Search for general Bitcoin news and price data<br />
          - Falls back to Scrape for specific sources if needed<br />
          - Extracts prices using regex patterns<br />
          - Analyzes sentiment from scraped content<br />
          - Sends email alerts for threshold breaches<br />
          - Stores historical data in CSV format
        </Callout>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-6 inline-flex items-center justify-center text-[10px] font-mono text-white/50 border border-white/10 rounded-sm">04</span>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Main Script</h2>
        </div>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Create a main script with command-line options for different modes of operation.
        </p>

        <CodeBlock code={mainCode} language="python" title="main.py - Command-line interface" />
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-6 inline-flex items-center justify-center text-[10px] font-mono text-white/50 border border-white/10 rounded-sm">05</span>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Usage & Testing</h2>
        </div>

        <CodeBlock multiLanguage={usageExamples} title="How to run the Bitcoin tracker" />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Play className="w-4 h-4 text-emerald-400/80" />
              <span className="text-[15px] font-medium text-white">Quick Test</span>
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed mb-3">
              Run a one-time data collection to test everything is working:
            </p>
            <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">
              python main.py --collect
            </code>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-sky-400/80" />
              <span className="text-[15px] font-medium text-white">Continuous Monitoring</span>
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed mb-3">
              Start continuous monitoring (runs until stopped):
            </p>
            <code className="px-1.5 py-0.5 text-[12.5px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-sm">
              python main.py --monitor
            </code>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">Expected Output</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Expected Output</h2>

        <CodeBlock
          code={`Starting Bitcoin Price Tracker...
Checking every 30 minutes
Alert thresholds: $80,000 - $150,000

INFO - Collected data: BTC $118,450.23, Sentiment: 2.3
INFO - Collected data: BTC $119,123.45, Sentiment: 1.8
INFO - Collected data: BTC $120,890.12, Sentiment: 3.1

SENTIMENT ALERT: POSITIVE shift detected (Change: 1.3)

Data collected: BTC $120,890.12
Email alert sent successfully

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

      <div className="mb-12">
        <div className="venym-meta mb-3">Enhancements</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Enhancement Ideas</h2>

        <div className="space-y-4">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-400/80" />
              <span className="text-[15px] font-medium text-white">Advanced Features</span>
            </div>
            <div className="space-y-3">
              {[
                { t: 'Technical Analysis', d: 'Add moving averages, RSI, and other indicators' },
                { t: 'Social Media Monitoring', d: 'Track Twitter sentiment and Reddit discussions' },
                { t: 'Machine Learning Predictions', d: 'Train models on historical data for price forecasting' }
              ].map((i) => (
                <div key={i.t} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400/80 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-medium text-white">{i.t}</p>
                    <p className="text-[12.5px] text-white/55">{i.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-4 h-4 text-sky-400/80" />
              <span className="text-[15px] font-medium text-white">Integration Options</span>
            </div>
            <div className="space-y-3">
              {[
                { t: 'Webhook Notifications', d: 'Send alerts to Slack, Discord, or custom endpoints' },
                { t: 'Database Storage', d: 'Replace CSV with PostgreSQL or MongoDB' },
                { t: 'Web Dashboard', d: 'Build a Flask/FastAPI dashboard with charts' }
              ].map((i) => (
                <div key={i.t} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400/80 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-medium text-white">{i.t}</p>
                    <p className="text-[12.5px] text-white/55">{i.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">Troubleshooting</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Troubleshooting</h2>

        <div className="space-y-3">
          {[
            { t: 'Price extraction fails', d: 'Check the regex patterns in extract_price_from_text(). Websites may change their format. Add debugging prints to see the scraped text.', tone: 'rose' },
            { t: 'High credit usage', d: 'Reduce auto_scrape_top value or increase CHECK_INTERVAL_MINUTES. Each scraped page costs 3 credits.', tone: 'amber' },
            { t: 'Email alerts not working', d: "Check your email credentials and make sure you're using an app password for Gmail. Enable 2FA and generate an app-specific password.", tone: 'sky' }
          ].map((issue) => (
            <div key={issue.t} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${issue.tone === 'rose' ? 'text-rose-400/80' : issue.tone === 'amber' ? 'text-amber-400/80' : 'text-sky-400/80'}`} />
                <div>
                  <p className="text-[14px] font-medium text-white">{issue.t}</p>
                  <p className="text-[13px] text-white/55 mt-1 leading-relaxed">{issue.d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-amber-400/80" />
            <span className="text-[15px] font-medium text-white">Deploy to Production</span>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed mb-4">
            Learn how to deploy this bot to AWS, Google Cloud, or a VPS for 24/7 monitoring.
          </p>
          <Link href="/docs/guides/deployment" className="venym-btn-secondary">
            Deployment Guide
            <ArrowRight className="w-3 h-3 ml-1.5" />
          </Link>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-4 h-4 text-sky-400/80" />
            <span className="text-[15px] font-medium text-white">More Use Cases</span>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed mb-4">
            Explore other real-world applications like e-commerce monitoring and lead generation.
          </p>
          <div className="flex gap-2">
            <Link href="/docs/guides/ecommerce-monitoring" className="venym-btn-ghost">E-commerce</Link>
            <Link href="/docs/guides/lead-generation" className="venym-btn-ghost">Lead Gen</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
