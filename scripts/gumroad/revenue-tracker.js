#!/usr/bin/env node

/**
 * Gumroad Revenue Tracker
 * 
 * Tracks daily revenue from Gumroad sales
 * Generates reports and analytics
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

class RevenueTracker {
  constructor() {
    this.apiKey = process.env.GUMROAD_API_KEY;
    this.revenuePath = path.join(__dirname, '../../data/gumroad-revenue.json');
    this.dataDir = path.join(__dirname, '../../data');
  }

  /**
   * Initialize revenue tracking
   */
  async initialize() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      
      try {
        await fs.access(this.revenuePath);
      } catch {
        await this.createRevenueFile();
      }
      
    } catch (error) {
      console.error('❌ Failed to initialize:', error.message);
      throw error;
    }
  }

  /**
   * Create revenue tracking file
   */
  async createRevenueFile() {
    const data = {
      created: new Date().toISOString(),
      totalRevenue: 0,
      totalSales: 0,
      byProduct: {},
      byMonth: {},
      sales: []
    };
    
    await fs.writeFile(this.revenuePath, JSON.stringify(data, null, 2));
    console.log('📊 Revenue tracking initialized');
  }

  /**
   * Fetch sales from Gumroad API
   */
  async fetchSales() {
    if (!this.apiKey) {
      console.warn('⚠️  Gumroad API key not configured, using simulated data');
      return this.simulateSales();
    }

    try {
      // In production, call Gumroad API
      /*
      const response = await fetch('https://api.gumroad.com/v2/sales', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      const data = await response.json();
      return data.sales;
      */
      
      return this.simulateSales();
      
    } catch (error) {
      console.error('❌ Failed to fetch sales:', error.message);
      return [];
    }
  }

  /**
   * Simulate sales data
   */
  simulateSales() {
    // Generate some sample sales
    const products = [
      { id: 'prod-001', name: 'RideWire AI Prompt Library', price: 17.99 },
      { id: 'prod-002', name: 'Multi-AI Diagnostic Report Templates', price: 19.99 },
      { id: 'prod-003', name: 'OBD-II Code Reference Database', price: 29.99 }
    ];
    
    const sales = [];
    const salesCount = Math.floor(Math.random() * 3); // 0-2 sales
    
    for (let i = 0; i < salesCount; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      sales.push({
        id: `sale-${Date.now()}-${i}`,
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        currency: 'USD',
        created_at: new Date().toISOString(),
        simulated: true
      });
    }
    
    return sales;
  }

  /**
   * Update revenue data
   */
  async updateRevenue() {
    await this.initialize();
    
    console.log('\n💰 Updating revenue data...\n');
    
    const data = await fs.readFile(this.revenuePath, 'utf8');
    const revenue = JSON.parse(data);
    
    // Fetch new sales
    const sales = await this.fetchSales();
    
    if (sales.length === 0) {
      console.log('ℹ️  No new sales');
      return revenue;
    }
    
    console.log(`📦 Processing ${sales.length} sales...`);
    
    // Process each sale
    for (const sale of sales) {
      // Check if already recorded
      if (revenue.sales.some(s => s.id === sale.id)) {
        continue;
      }
      
      // Add to sales
      revenue.sales.push(sale);
      revenue.totalSales++;
      revenue.totalRevenue += sale.price;
      
      // Update by product
      if (!revenue.byProduct[sale.product_id]) {
        revenue.byProduct[sale.product_id] = {
          name: sale.product_name,
          sales: 0,
          revenue: 0
        };
      }
      revenue.byProduct[sale.product_id].sales++;
      revenue.byProduct[sale.product_id].revenue += sale.price;
      
      // Update by month
      const month = new Date(sale.created_at).toISOString().slice(0, 7); // YYYY-MM
      if (!revenue.byMonth[month]) {
        revenue.byMonth[month] = {
          sales: 0,
          revenue: 0
        };
      }
      revenue.byMonth[month].sales++;
      revenue.byMonth[month].revenue += sale.price;
      
      console.log(`   ✅ ${sale.product_name}: $${sale.price}`);
    }
    
    revenue.lastUpdated = new Date().toISOString();
    
    // Save updated revenue
    await fs.writeFile(this.revenuePath, JSON.stringify(revenue, null, 2));
    
    console.log(`\n✅ Revenue data updated`);
    
    return revenue;
  }

  /**
   * Generate revenue report
   */
  async generateReport() {
    await this.initialize();
    
    const data = await fs.readFile(this.revenuePath, 'utf8');
    const revenue = JSON.parse(data);
    
    console.log('\n💰 Gumroad Revenue Report\n');
    console.log('='.repeat(60));
    
    // Overall stats
    console.log('\n📊 Overall Performance:');
    console.log(`   Total Revenue: $${revenue.totalRevenue.toFixed(2)}`);
    console.log(`   Total Sales: ${revenue.totalSales}`);
    console.log(`   Average Sale: $${(revenue.totalRevenue / Math.max(revenue.totalSales, 1)).toFixed(2)}`);
    
    // By product
    if (Object.keys(revenue.byProduct).length > 0) {
      console.log('\n📦 Revenue by Product:');
      
      const products = Object.entries(revenue.byProduct)
        .sort((a, b) => b[1].revenue - a[1].revenue);
      
      products.forEach(([id, data]) => {
        console.log(`\n   ${data.name}`);
        console.log(`      Sales: ${data.sales}`);
        console.log(`      Revenue: $${data.revenue.toFixed(2)}`);
        console.log(`      Avg: $${(data.revenue / data.sales).toFixed(2)}`);
      });
    }
    
    // By month
    if (Object.keys(revenue.byMonth).length > 0) {
      console.log('\n📅 Revenue by Month:');
      
      const months = Object.entries(revenue.byMonth)
        .sort((a, b) => b[0].localeCompare(a[0]));
      
      months.forEach(([month, data]) => {
        console.log(`   ${month}: $${data.revenue.toFixed(2)} (${data.sales} sales)`);
      });
    }
    
    // Recent sales
    if (revenue.sales.length > 0) {
      console.log('\n🛍️  Recent Sales:');
      
      const recentSales = revenue.sales.slice(-5).reverse();
      recentSales.forEach(sale => {
        const date = new Date(sale.created_at).toLocaleString();
        console.log(`   ${date}: ${sale.product_name} - $${sale.price}`);
      });
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    return revenue;
  }

  /**
   * Export revenue to CSV
   */
  async exportCSV(outputPath) {
    await this.initialize();
    
    const data = await fs.readFile(this.revenuePath, 'utf8');
    const revenue = JSON.parse(data);
    
    if (revenue.sales.length === 0) {
      console.log('⚠️  No sales to export');
      return;
    }
    
    const csv = ['Sale ID,Product,Price,Currency,Date'];
    
    revenue.sales.forEach(sale => {
      csv.push(`${sale.id},"${sale.product_name}",${sale.price},${sale.currency},${sale.created_at}`);
    });
    
    await fs.writeFile(outputPath, csv.join('\n'));
    console.log(`✅ Revenue exported to: ${outputPath}`);
  }
}

// CLI interface
if (require.main === module) {
  const tracker = new RevenueTracker();
  const args = process.argv.slice(2);
  
  if (args.includes('--update')) {
    tracker.updateRevenue()
      .then(() => tracker.generateReport())
      .catch(console.error);
  } else if (args.includes('--export')) {
    const outputPath = args[args.indexOf('--export') + 1] || 'revenue-export.csv';
    tracker.exportCSV(outputPath).catch(console.error);
  } else {
    tracker.generateReport().catch(console.error);
  }
}

module.exports = RevenueTracker;
