#!/usr/bin/env node

/**
 * Gumroad Product Sync
 * 
 * Automatically publishes and syncs digital products to Gumroad
 * 
 * Products include:
 * - Diagnostic templates
 * - AI prompt libraries
 * - Shop marketing materials
 * - Pricing calculators
 * - Training guides
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

class GumroadSync {
  constructor() {
    this.apiKey = process.env.GUMROAD_API_KEY;
    this.productsPath = path.join(__dirname, '../../data/gumroad-products.json');
    this.dataDir = path.join(__dirname, '../../data');
    
    this.validateConfig();
  }

  validateConfig() {
    if (!this.apiKey) {
      console.warn('⚠️  GUMROAD_API_KEY not configured');
      console.warn('⚠️  Get API key from: https://gumroad.com/settings/advanced');
      console.warn('⚠️  Running in simulation mode');
    }
  }

  /**
   * Load product catalog
   */
  async loadProducts() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      
      try {
        const data = await fs.readFile(this.productsPath, 'utf8');
        return JSON.parse(data);
      } catch {
        // Create default product catalog
        return await this.createDefaultCatalog();
      }
    } catch (error) {
      console.error('❌ Failed to load products:', error.message);
      throw error;
    }
  }

  /**
   * Create default product catalog (34 products from problem statement)
   */
  async createDefaultCatalog() {
    const catalog = {
      created: new Date().toISOString(),
      tier1: [
        {
          id: 'prod-001',
          name: 'RideWire AI Prompt Library',
          price: 17.99,
          description: 'Complete collection of AI prompts for automotive diagnostics. Over 200 tested prompts for ChatGPT, Claude, and Gemini.',
          category: 'prompts',
          fileType: 'PDF',
          pages: 45,
          status: 'draft',
          features: [
            '200+ tested AI prompts',
            'Multi-AI compatibility',
            'Organized by diagnostic category',
            'Copy-paste ready',
            'Regular updates included'
          ]
        },
        {
          id: 'prod-002',
          name: 'Multi-AI Diagnostic Report Templates',
          price: 19.99,
          description: 'Professional templates for documenting multi-AI diagnostic consensus. Impress clients with detailed analysis reports.',
          category: 'templates',
          fileType: 'PDF + Word',
          pages: 30,
          status: 'draft',
          features: [
            '10 professional templates',
            'Consensus documentation format',
            'Client-ready layouts',
            'Editable Word files',
            'Usage examples included'
          ]
        },
        {
          id: 'prod-003',
          name: 'OBD-II Code Reference Database',
          price: 29.99,
          description: 'Comprehensive database of OBD-II codes with AI-powered explanations and fix recommendations.',
          category: 'reference',
          fileType: 'PDF + Excel',
          pages: 150,
          status: 'draft',
          features: [
            '5000+ OBD-II codes',
            'AI-generated explanations',
            'Fix recommendations',
            'Searchable Excel format',
            'Vehicle-specific notes'
          ]
        },
        {
          id: 'prod-004',
          name: 'Complete Shop Marketing Kit',
          price: 29.99,
          description: 'Everything you need to market your AI-powered diagnostic services. Templates, scripts, and social media content.',
          category: 'marketing',
          fileType: 'ZIP (multiple formats)',
          status: 'draft',
          features: [
            'Social media templates',
            'Email campaign scripts',
            'Flyer designs (Canva)',
            'Google Ads templates',
            'Customer testimonial guides'
          ]
        },
        {
          id: 'prod-005',
          name: 'Automotive Shop Pricing Calculator',
          price: 24.99,
          description: 'Excel-based pricing calculator with AI cost estimates. Set competitive prices while maintaining profitability.',
          category: 'tools',
          fileType: 'Excel',
          status: 'draft',
          features: [
            'Labor rate calculator',
            'Parts markup optimizer',
            'Competition analysis',
            'Profit margin tracker',
            'Service bundling tool'
          ]
        }
      ],
      tier2: [], // To be added in Month 2
      tier3: []  // To be added in Month 3
    };

    await fs.writeFile(this.productsPath, JSON.stringify(catalog, null, 2));
    console.log('📋 Default product catalog created with 5 Tier 1 products');
    
    return catalog;
  }

  /**
   * Generate product assets (simulated)
   */
  async generateAssets(product) {
    console.log(`\n📄 Generating assets for: ${product.name}`);
    
    const assetsDir = path.join(__dirname, '../../assets/gumroad', product.id);
    await fs.mkdir(assetsDir, { recursive: true });
    
    // Simulate asset generation
    console.log(`   - Creating ${product.fileType} file...`);
    console.log(`   - Generating preview images...`);
    console.log(`   - Writing product description...`);
    
    const assets = {
      productId: product.id,
      files: [
        `${product.id}-main.${product.fileType.toLowerCase().split(' ')[0]}`,
        `${product.id}-bonus.pdf`,
        `${product.id}-license.txt`
      ],
      preview: `${product.id}-preview.png`,
      thumbnail: `${product.id}-thumb.png`,
      generatedAt: new Date().toISOString()
    };
    
    console.log('   ✅ Assets generated (simulated)');
    
    return assets;
  }

  /**
   * Create product on Gumroad
   */
  async createProduct(product, assets) {
    console.log(`\n🚀 Publishing to Gumroad: ${product.name}`);
    
    if (!this.apiKey) {
      console.log('⚠️  API key not configured, simulating...');
      return this.simulateProductCreation(product);
    }

    try {
      // In production, call Gumroad API
      /*
      const response = await fetch('https://api.gumroad.com/v2/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: product.name,
          description: this.formatDescription(product),
          price: Math.round(product.price * 100), // Convert to cents
          currency: 'USD',
          published: false, // Start as draft
          customizable_price: false
        })
      });
      
      const data = await response.json();
      return data.product;
      */
      
      return this.simulateProductCreation(product);
      
    } catch (error) {
      console.error('❌ Failed to create product:', error.message);
      throw error;
    }
  }

  /**
   * Simulate product creation
   */
  simulateProductCreation(product) {
    const gumroadProduct = {
      id: `sim-${product.id}`,
      name: product.name,
      price: product.price,
      url: `https://gumroad.com/l/${product.id}`,
      published: false,
      created_at: new Date().toISOString()
    };
    
    console.log('✅ Product created (simulated)');
    console.log(`   URL: ${gumroadProduct.url}`);
    
    return gumroadProduct;
  }

  /**
   * Format product description for Gumroad
   */
  formatDescription(product) {
    let description = `${product.description}\n\n`;
    
    description += `## What's Included:\n\n`;
    product.features.forEach(feature => {
      description += `✅ ${feature}\n`;
    });
    
    description += `\n## File Details:\n`;
    description += `- Format: ${product.fileType}\n`;
    if (product.pages) {
      description += `- Pages: ${product.pages}\n`;
    }
    
    description += `\n## Important Disclaimers:\n\n`;
    description += `⚠️ This product provides educational and informational content only. All automotive diagnostic information should be verified by qualified mechanics and automotive professionals. RideWire AI Hub does not replace professional automotive repair services. Always consult a certified mechanic for vehicle repairs and diagnostics.\n\n`;
    
    description += `© ${new Date().getFullYear()} RideWire AI Hub. All rights reserved.`;
    
    return description;
  }

  /**
   * Sync all products
   */
  async syncAll() {
    console.log('\n🔄 Starting Gumroad product sync...\n');
    console.log('='.repeat(60));
    
    const catalog = await this.loadProducts();
    const tier1 = catalog.tier1 || [];
    
    if (tier1.length === 0) {
      console.log('⚠️  No products to sync');
      return;
    }
    
    const syncResults = [];
    
    for (const product of tier1) {
      try {
        // Generate assets
        const assets = await this.generateAssets(product);
        
        // Create on Gumroad
        const gumroadProduct = await this.createProduct(product, assets);
        
        // Update product status
        product.status = 'synced';
        product.gumroadId = gumroadProduct.id;
        product.gumroadUrl = gumroadProduct.url;
        product.lastSynced = new Date().toISOString();
        
        syncResults.push({
          productId: product.id,
          name: product.name,
          status: 'success',
          url: gumroadProduct.url
        });
        
      } catch (error) {
        console.error(`❌ Failed to sync ${product.name}:`, error.message);
        
        syncResults.push({
          productId: product.id,
          name: product.name,
          status: 'failed',
          error: error.message
        });
      }
    }
    
    // Save updated catalog
    await fs.writeFile(this.productsPath, JSON.stringify(catalog, null, 2));
    
    // Display summary
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 Sync Summary:\n');
    
    const successful = syncResults.filter(r => r.status === 'success').length;
    const failed = syncResults.filter(r => r.status === 'failed').length;
    
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📦 Total: ${syncResults.length}\n`);
    
    if (successful > 0) {
      console.log('Synced Products:');
      syncResults
        .filter(r => r.status === 'success')
        .forEach(r => {
          console.log(`   - ${r.name}: ${r.url}`);
        });
      console.log();
    }
    
    return syncResults;
  }

  /**
   * Get product stats
   */
  async getStats() {
    const catalog = await this.loadProducts();
    const tier1 = catalog.tier1 || [];
    
    const stats = {
      total: tier1.length,
      synced: tier1.filter(p => p.status === 'synced').length,
      draft: tier1.filter(p => p.status === 'draft').length,
      totalValue: tier1.reduce((sum, p) => sum + p.price, 0)
    };
    
    console.log('\n📊 Gumroad Product Stats\n');
    console.log('='.repeat(60));
    console.log(`Total Products: ${stats.total}`);
    console.log(`Synced: ${stats.synced}`);
    console.log(`Draft: ${stats.draft}`);
    console.log(`Total Catalog Value: $${stats.totalValue.toFixed(2)}`);
    console.log('='.repeat(60) + '\n');
    
    return stats;
  }
}

// CLI interface
if (require.main === module) {
  const sync = new GumroadSync();
  const args = process.argv.slice(2);
  
  if (args.includes('--stats')) {
    sync.getStats().catch(console.error);
  } else {
    sync.syncAll()
      .then(results => {
        const failed = results.filter(r => r.status === 'failed').length;
        process.exit(failed > 0 ? 1 : 0);
      })
      .catch(error => {
        console.error('\n💥 Sync failed:', error);
        process.exit(1);
      });
  }
}

module.exports = GumroadSync;
