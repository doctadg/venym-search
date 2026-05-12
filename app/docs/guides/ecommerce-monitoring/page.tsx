import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
        """Initialize SQLite database for storing price data"""
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
                price_history TEXT -- JSON array of price points
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER,
                alert_type TEXT, -- 'price_drop', 'stock_alert', 'competitor'
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def add_product(self, name: str, search_query: str, target_price: float = None):
        """Add a product to monitor"""
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
        """Search for product prices across multiple sites"""
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
            print(f"Search failed: {response.status_code}")
            return []
        
        results = response.json()["search_results"]
        
        # Filter for e-commerce sites
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
        """Extract detailed pricing information from product page"""
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
        
        # Extract price using pattern matching
        import re
        text = content.get("text", "")
        
        # Common price patterns
        price_patterns = [
            r'\\$([0-9,]+\\.?[0-9]*)',  # $123.45
            r'USD\\s*([0-9,]+\\.?[0-9]*)',  # USD 123.45
            r'Price:\\s*\\$([0-9,]+\\.?[0-9]*)',  # Price: $123.45
        ]
        
        prices = []
        for pattern in price_patterns:
            matches = re.findall(pattern, text)
            for match in matches:
                try:
                    price = float(match.replace(',', ''))
                    if 1 < price < 10000:  # Reasonable price range
                        prices.append(price)
                except ValueError:
                    continue
        
        return {
            "url": url,
            "title": content.get("title", ""),
            "prices": list(set(prices)),  # Remove duplicates
            "lowest_price": min(prices) if prices else None,
            "extracted_at": datetime.now().isoformat()
        }
    
    def check_all_products(self):
        """Check prices for all monitored products"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, name, search_query, target_price, price_history FROM products")
        products = cursor.fetchall()
        
        for product_id, name, search_query, target_price, price_history_json in products:
            print(f"Checking prices for: {name}")
            
            # Search for current prices
            search_results = self.search_product_prices(search_query)
            
            current_prices = []
            for result in search_results[:5]:  # Check top 5 results
                price_data = self.extract_price_from_page(result['link'])
                if price_data.get('lowest_price'):
                    current_prices.append({
                        'price': price_data['lowest_price'],
                        'url': price_data['url'],
                        'title': price_data['title']
                    })
                
                time.sleep(1)  # Rate limiting
            
            if current_prices:
                # Find the best current price
                best_price = min(current_prices, key=lambda x: x['price'])
                
                # Update price history
                price_history = json.loads(price_history_json)
                price_history.append({
                    'price': best_price['price'],
                    'timestamp': datetime.now().isoformat(),
                    'url': best_price['url']
                })
                
                # Keep only last 100 entries
                price_history = price_history[-100:]
                
                # Update database
                cursor.execute('''
                    UPDATE products 
                    SET current_price = ?, url = ?, price_history = ?, last_checked = ?
                    WHERE id = ?
                ''', (best_price['price'], best_price['url'], 
                      json.dumps(price_history), datetime.now(), product_id))
                
                # Check for price alerts
                if target_price and best_price['price'] <= target_price:
                    self.create_alert(product_id, 'price_drop', 
                                    f"🎉 {name} is now \${best_price['price']} (target: \${target_price})")
                
                print(f"✅ {name}: \${best_price['price']} at {best_price['url']}")
            else:
                print(f"❌ No prices found for {name}")
        
        conn.commit()
        conn.close()
    
    def create_alert(self, product_id: int, alert_type: str, message: str):
        """Create a new alert"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO alerts (product_id, alert_type, message)
            VALUES (?, ?, ?)
        ''', (product_id, alert_type, message))
        
        conn.commit()
        conn.close()
        
        # Send notification (implement your preferred method)
        self.send_notification(message)
    
    def send_notification(self, message: str):
        """Send notification via email, Slack, etc."""
        print(f"🔔 ALERT: {message}")
        
        # Example: Send email notification
        # self.send_email_alert(message)
    
    def get_price_trends(self, product_id: int) -> Dict:
        """Get price trends for a product"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT name, current_price, price_history 
            FROM products WHERE id = ?
        ''', (product_id,))
        
        result = cursor.fetchone()
        if not result:
            return {}
        
        name, current_price, price_history_json = result
        price_history = json.loads(price_history_json)
        
        if len(price_history) < 2:
            return {"message": "Not enough data for trend analysis"}
        
        # Calculate trends
        prices = [entry['price'] for entry in price_history]
        timestamps = [entry['timestamp'] for entry in price_history]
        
        lowest_price = min(prices)
        highest_price = max(prices)
        avg_price = sum(prices) / len(prices)
        price_change = prices[-1] - prices[0] if len(prices) > 1 else 0
        
        conn.close()
        
        return {
            "product_name": name,
            "current_price": current_price,
            "lowest_price": lowest_price,
            "highest_price": highest_price,
            "average_price": round(avg_price, 2),
            "price_change": round(price_change, 2),
            "trend": "↗️" if price_change > 0 else "↘️" if price_change < 0 else "→",
            "data_points": len(price_history)
        }

# Usage example
def main():
    # Initialize monitor
    monitor = EcommerceMonitor("your-venym-search-api-key")
    
    # Add products to monitor
    monitor.add_product("iPhone 15 Pro", "iPhone 15 Pro 256GB", target_price=900.00)
    monitor.add_product("Sony WH-1000XM5", "Sony WH-1000XM5 headphones", target_price=300.00)
    monitor.add_product("MacBook Air M3", "MacBook Air M3 13 inch", target_price=1100.00)
    
    # Check prices
    monitor.check_all_products()
    
    # Get trends for a product
    trends = monitor.get_price_trends(1)
    print(json.dumps(trends, indent=2))

if __name__ == "__main__":
    main()`

  const dashboardCode = `import streamlit as st
import sqlite3
import pandas as pd
import plotly.express as px
import json

from datetime import datetime, timedelta

st.set_page_config(page_title="E-commerce Price Monitor", page_icon="🛒", layout="wide")

st.title("🛒 E-commerce Price Monitor Dashboard")
st.caption("Track competitor prices and find the best deals")

# Database connection
@st.cache_resource
def get_connection():
    return sqlite3.connect("ecommerce.db", check_same_thread=False)

conn = get_connection()

# Sidebar controls
st.sidebar.header("Controls")
if st.sidebar.button("🔄 Check All Prices"):
    # Trigger price check
    st.sidebar.success("Price check initiated!")

# Main dashboard
col1, col2, col3, col4 = st.columns(4)

# Get summary stats
cursor = conn.cursor()
cursor.execute("SELECT COUNT(*) FROM products")
total_products = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM alerts WHERE created_at > datetime('now', '-24 hours')")
alerts_24h = cursor.fetchone()[0]

cursor.execute("SELECT AVG(current_price) FROM products WHERE current_price IS NOT NULL")
avg_price = cursor.fetchone()[0] or 0

cursor.execute("SELECT COUNT(*) FROM products WHERE current_price <= target_price")
good_deals = cursor.fetchone()[0]

with col1:
    st.metric("Products Monitored", total_products)

with col2:
    st.metric("Alerts (24h)", alerts_24h)

with col3:
    st.metric("Avg Price", f"\${avg_price:.2f}")

with col4:
    st.metric("Good Deals", good_deals)

# Products table
st.header("📊 Product Overview")

cursor.execute('''
    SELECT id, name, current_price, target_price, url, last_checked
    FROM products
    ORDER BY last_checked DESC
''')

products_data = cursor.fetchall()
if products_data:
    df = pd.DataFrame(products_data, 
                     columns=['ID', 'Product', 'Current Price', 'Target Price', 'URL', 'Last Checked'])
    
    # Add status column
    df['Status'] = df.apply(lambda row: 
        "🎯 Good Deal!" if row['Target Price'] and row['Current Price'] <= row['Target Price']
        else "📈 Above Target" if row['Target Price'] and row['Current Price'] > row['Target Price']
        else "👀 Monitoring", axis=1)
    
    st.dataframe(df, use_container_width=True)

# Price trends chart
st.header("📈 Price Trends")

selected_product = st.selectbox("Select Product", 
                               [f"{row[0]}: {row[1]}" for row in products_data])

if selected_product:
    product_id = int(selected_product.split(':')[0])
    
    cursor.execute("SELECT price_history FROM products WHERE id = ?", (product_id,))
    history_json = cursor.fetchone()[0]
    
    if history_json:
        history = json.loads(history_json)
        if history:
            df_history = pd.DataFrame(history)
            df_history['timestamp'] = pd.to_datetime(df_history['timestamp'])
            
            fig = px.line(df_history, x='timestamp', y='price', 
                         title=f"Price History - {selected_product.split(': ', 1)[1]}")
            st.plotly_chart(fig, use_container_width=True)

# Recent alerts
st.header("🔔 Recent Alerts")

cursor.execute('''
    SELECT a.message, a.created_at, p.name
    FROM alerts a
    JOIN products p ON a.product_id = p.id
    ORDER BY a.created_at DESC
    LIMIT 10
''')

alerts = cursor.fetchall()
for message, created_at, product_name in alerts:
    st.success(f"{message} - {created_at}")

conn.close()`

  const features = [
    {
      icon: Eye,
      title: "Multi-Site Monitoring",
      description: "Track prices across Amazon, eBay, Walmart, and other major retailers"
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notifications when prices drop below your target threshold"
    },
    {
      icon: BarChart3,
      title: "Price Analytics",
      description: "Analyze price trends, historical data, and market patterns"
    },
    {
      icon: DollarSign,
      title: "Deal Detection",
      description: "Automatically identify the best deals and savings opportunities"
    }
  ]

  const steps = [
    {
      step: 1,
      title: "Setup Monitoring",
      description: "Initialize the database and configure your Venym Search API key"
    },
    {
      step: 2,
      title: "Add Products",
      description: "Define products to monitor with search queries and target prices"
    },
    {
      step: 3,
      title: "Price Discovery",
      description: "Automatically search across multiple e-commerce sites"
    },
    {
      step: 4,
      title: "Data Extraction",
      description: "Scrape product pages to extract accurate pricing information"
    },
    {
      step: 5,
      title: "Alert System",
      description: "Send notifications when prices meet your criteria"
    }
  ]

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Implementation Guide
          </Badge>
          <Badge variant="outline" className="border-green-500 text-green-700">
            Featured
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[#17457c] mb-4">
          E-commerce Price Monitoring System
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Build a comprehensive price monitoring system that tracks competitor prices across 
          multiple e-commerce platforms and alerts you to the best deals automatically.
        </p>
      </div>

      <Callout type="info" title="What You'll Build">
        A complete price monitoring system with automated price discovery, historical tracking, 
        intelligent alerts, and a real-time dashboard to visualize pricing trends.
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

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">How It Works</h2>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <Card key={index} className="border-l-4 border-l-[#efa72d]">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[#efa72d] text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Complete Implementation */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Complete Implementation</h2>
        
        <p className="text-gray-600 mb-6">
          Here's the complete Python implementation of an e-commerce price monitoring system:
        </p>
        
        <CodeBlock
          language="python"
          code={implementation}
          title="E-commerce Price Monitor - Complete Implementation"
        />
      </div>

      {/* Dashboard */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Interactive Dashboard</h2>
        
        <p className="text-gray-600 mb-6">
          Create a Streamlit dashboard to visualize price trends and manage your monitoring system:
        </p>
        
        <CodeBlock
          language="python"
          code={dashboardCode}
          title="Streamlit Dashboard for Price Monitoring"
        />
      </div>

      {/* Use Cases */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Use Cases</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-lg">Retail Arbitrage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Find price differences between platforms to buy low and sell high. 
                Perfect for resellers and drop-shippers.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-lg">Personal Shopping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Monitor wish list items and get alerted when they go on sale. 
                Never miss a deal on products you want.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="text-lg">Competitor Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Track competitor pricing strategies and market trends. 
                Make informed pricing decisions for your business.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Deployment Tips */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#17457c] mb-6">Deployment & Scaling</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#efa72d]" />
                Automation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>• Use cron jobs for scheduled price checks</div>
              <div>• Implement rate limiting to respect API quotas</div>
              <div>• Add error handling and retry logic</div>
              <div>• Log all activities for debugging</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>• Cache search results to reduce API calls</div>
              <div>• Use database indexes for better performance</div>
              <div>• Implement concurrent processing for speed</div>
              <div>• Archive old data to keep database lean</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Next Steps */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#17457c]">Ready to Build?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Start building your e-commerce monitoring system with Venym Search APIs and expand your competitive intelligence capabilities.
            </p>
            <div className="flex gap-2">
              <Link href="/docs/api/search">
                <Button size="sm" className="bg-[#efa72d] hover:bg-[#efa72d]/90 text-white">
                  Search API
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/docs/api/scrape">
                <Button size="sm" variant="outline" className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white">
                  Scrape API
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-[#17457c]">More Guides</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Explore other implementation guides and learn how to build more powerful applications with Venym Search.
            </p>
            <div className="flex gap-2">
              <Link href="/docs/guides/lead-generation">
                <Button size="sm" variant="outline" className="border-gray-300">
                  Lead Generation
                </Button>
              </Link>
              <Link href="/docs/guides/market-research">
                <Button size="sm" variant="outline" className="border-gray-300">
                  Market Research
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

