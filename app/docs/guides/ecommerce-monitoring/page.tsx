import Link from 'next/link'
import {
  ShoppingCart,
  TrendingDown,
  Bell,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Clock,
  Target,
  DollarSign,
  Eye
} from 'lucide-react'
import { CodeBlock } from '../../components/CodeBlock'
import { Callout } from '../../components/Callout'

export default function EcommerceMonitoringPage() {
  const implementation = `import requests
import sqlite3
import smtplib
import time
import json
from datetime import datetime
from email.mime.text import MimeText
from typing import List, Dict

class EcommerceMonitor:
    def __init__(self, VENYM_SEARCH_api_key: str, db_path: str = "ecommerce.db"):
        self.api_key = VENYM_SEARCH_api_key
        self.db_path = db_path
        self.base_url = "https://www.search.venym.io/api/v1"
        self.init_database()

    def init_database(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                search_query TEXT NOT NULL,
                target_price REAL,
                current_price REAL,
                url TEXT,
                last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                price_history TEXT
            )
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER,
                alert_type TEXT,
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products (id)
            )
        ''')

        conn.commit()
        conn.close()

    def add_product(self, name: str, search_query: str, target_price: float = None):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO products (name, search_query, target_price, price_history)
            VALUES (?, ?, ?, ?)
        ''', (name, search_query, target_price, '[]'))

        product_id = cursor.lastrowid
        conn.commit()
        conn.close()

        return product_id

    def search_product_prices(self, search_query: str) -> List[Dict]:
        response = requests.post(
            f"{self.base_url}/search",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json={
                "query": f"{search_query} price buy",
                "max_results": 20,
                "country": "us"
            }
        )

        if response.status_code != 200:
            return []

        results = response.json()["search_results"]

        ecommerce_domains = [
            'amazon.com', 'ebay.com', 'walmart.com', 'target.com',
            'bestbuy.com', 'homedepot.com', 'lowes.com', 'costco.com',
            'newegg.com', 'etsy.com', 'shopify.com'
        ]

        filtered_results = []
        for result in results:
            domain = result['link'].split('/')[2].replace('www.', '')
            if any(ecom in domain for ecom in ecommerce_domains):
                filtered_results.append(result)

        return filtered_results

    def extract_price_from_page(self, url: str) -> Dict:
        response = requests.post(
            f"{self.base_url}/scrape",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json={
                "url": url,
                "extract_options": ["title", "text", "metadata"],
                "wait_for_selector": "body",
                "remove_selectors": [".ads", ".popup", ".modal"]
            }
        )

        if response.status_code != 200:
            return {}

        data = response.json()
        content = data.get("primary_content", {})

        import re
        text = content.get("text", "")

        price_patterns = [
            r'\\$([0-9,]+\\.?[0-9]*)',
            r'USD\\s*([0-9,]+\\.?[0-9]*)',
            r'Price:\\s*\\$([0-9,]+\\.?[0-9]*)',
        ]

        prices = []
        for pattern in price_patterns:
            matches = re.findall(pattern, text)
            for match in matches:
                try:
                    price = float(match.replace(',', ''))
                    if 1 < price < 10000:
                        prices.append(price)
                except ValueError:
                    continue

        return {
            "url": url,
            "title": content.get("title", ""),
            "prices": list(set(prices)),
            "lowest_price": min(prices) if prices else None,
            "extracted_at": datetime.now().isoformat()
        }

def main():
    monitor = EcommerceMonitor("your-venym-search-api-key")
    monitor.add_product("iPhone 15 Pro", "iPhone 15 Pro 256GB", target_price=900.00)
    monitor.add_product("Sony WH-1000XM5", "Sony WH-1000XM5 headphones", target_price=300.00)

if __name__ == "__main__":
    main()`

  const dashboardCode = `import streamlit as st
import sqlite3
import pandas as pd
import plotly.express as px
import json

st.set_page_config(page_title="E-commerce Price Monitor", layout="wide")
st.title("E-commerce Price Monitor Dashboard")

@st.cache_resource
def get_connection():
    return sqlite3.connect("ecommerce.db", check_same_thread=False)

conn = get_connection()
cursor = conn.cursor()

cursor.execute("SELECT COUNT(*) FROM products")
total_products = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM alerts WHERE created_at > datetime('now', '-24 hours')")
alerts_24h = cursor.fetchone()[0]

col1, col2 = st.columns(2)
col1.metric("Products Monitored", total_products)
col2.metric("Alerts (24h)", alerts_24h)

cursor.execute('SELECT id, name, current_price, target_price FROM products')
products_data = cursor.fetchall()
if products_data:
    df = pd.DataFrame(products_data, columns=['ID', 'Product', 'Current Price', 'Target Price'])
    st.dataframe(df, use_container_width=True)`

  const features = [
    { icon: Eye, title: "Multi-Site Monitoring", description: "Track prices across Amazon, eBay, Walmart, and other major retailers" },
    { icon: Bell, title: "Smart Alerts", description: "Get notifications when prices drop below your target threshold" },
    { icon: BarChart3, title: "Price Analytics", description: "Analyze price trends, historical data, and market patterns" },
    { icon: DollarSign, title: "Deal Detection", description: "Automatically identify the best deals and savings opportunities" }
  ]

  const steps = [
    { step: 1, title: "Setup Monitoring", description: "Initialize the database and configure your Venym Search API key" },
    { step: 2, title: "Add Products", description: "Define products to monitor with search queries and target prices" },
    { step: 3, title: "Price Discovery", description: "Automatically search across multiple e-commerce sites" },
    { step: 4, title: "Data Extraction", description: "Scrape product pages to extract accurate pricing information" },
    { step: 5, title: "Alert System", description: "Send notifications when prices meet your criteria" }
  ]

  return (
    <div className="max-w-none">
      <div className="mb-10">
        <div className="venym-meta mb-3 flex items-center gap-3">
          <span>GUIDE · E-COMMERCE MONITORING</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-emerald-400/20 text-emerald-300/80">
            Featured
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 leading-[1.1]">
          E-commerce Price Monitoring System
        </h1>
        <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl">
          Build a comprehensive price monitoring system that tracks competitor prices across multiple e-commerce platforms and alerts you to the best deals automatically.
        </p>
      </div>

      <Callout type="info" title="What You'll Build">
        A complete price monitoring system with automated price discovery, historical tracking, intelligent alerts, and a real-time dashboard to visualize pricing trends.
      </Callout>

      <div className="mb-12">
        <div className="venym-meta mb-3">01 · Features</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Key Features</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature, index) => (
            <div key={index} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <feature.icon className="w-4 h-4 text-amber-400/80" />
                <span className="text-[15px] font-medium text-white">{feature.title}</span>
              </div>
              <p className="text-[13px] text-white/55 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">02 · How It Works</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">How It Works</h2>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
              <div className="flex items-center gap-4">
                <span className="w-6 h-6 inline-flex items-center justify-center text-[10px] font-mono text-white/50 border border-white/10 rounded-sm">
                  {String(step.step).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-[14px] font-medium text-white mb-1">{step.title}</h3>
                  <p className="text-[12.5px] text-white/55">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">03 · Implementation</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Complete Implementation</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Here's the complete Python implementation of an e-commerce price monitoring system:
        </p>

        <CodeBlock
          language="python"
          code={implementation}
          title="E-commerce Price Monitor - Complete Implementation"
        />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">04 · Dashboard</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Interactive Dashboard</h2>

        <p className="text-[14px] text-white/55 leading-relaxed mb-6">
          Create a Streamlit dashboard to visualize price trends and manage your monitoring system:
        </p>

        <CodeBlock
          language="python"
          code={dashboardCode}
          title="Streamlit Dashboard for Price Monitoring"
        />
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">05 · Use Cases</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Use Cases</h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Retail Arbitrage', desc: 'Find price differences between platforms to buy low and sell high. Perfect for resellers and drop-shippers.' },
            { title: 'Personal Shopping', desc: 'Monitor wish list items and get alerted when they go on sale. Never miss a deal on products you want.' },
            { title: 'Competitor Analysis', desc: 'Track competitor pricing strategies and market trends. Make informed pricing decisions for your business.' }
          ].map((u) => (
            <div key={u.title} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
              <h3 className="text-[15px] font-medium text-white mb-2">{u.title}</h3>
              <p className="text-[13px] text-white/55 leading-relaxed">{u.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="venym-meta mb-3">06 · Deployment</div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Deployment & Scaling</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-amber-400/80" />
              <span className="text-[15px] font-medium text-white">Automation</span>
            </div>
            <ul className="text-[13px] text-white/65 space-y-1.5">
              <li>• Use cron jobs for scheduled price checks</li>
              <li>• Implement rate limiting to respect API quotas</li>
              <li>• Add error handling and retry logic</li>
              <li>• Log all activities for debugging</li>
            </ul>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-sky-400/80" />
              <span className="text-[15px] font-medium text-white">Optimization</span>
            </div>
            <ul className="text-[13px] text-white/65 space-y-1.5">
              <li>• Cache search results to reduce API calls</li>
              <li>• Use database indexes for better performance</li>
              <li>• Implement concurrent processing for speed</li>
              <li>• Archive old data to keep database lean</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <h3 className="text-[15px] font-medium text-white mb-3">Ready to Build?</h3>
          <p className="text-[13px] text-white/55 leading-relaxed mb-4">
            Start building your e-commerce monitoring system with Venym Search APIs and expand your competitive intelligence capabilities.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Link href="/docs/api/search" className="venym-btn-primary">
              Search API
              <ArrowRight className="w-3 h-3 ml-1.5" />
            </Link>
            <Link href="/docs/api/scrape" className="venym-btn-secondary">
              Scrape API
            </Link>
          </div>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
          <h3 className="text-[15px] font-medium text-white mb-3">More Guides</h3>
          <p className="text-[13px] text-white/55 leading-relaxed mb-4">
            Explore other implementation guides and learn how to build more powerful applications with Venym Search.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Link href="/docs/guides/lead-generation" className="venym-btn-ghost">Lead Generation</Link>
            <Link href="/docs/guides/market-research" className="venym-btn-ghost">Market Research</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
