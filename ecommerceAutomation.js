/**
 * E-Commerce Automation Module
 * Automates marketplace listing, payment processing, diagram sales, and revenue tracking
 * Integrates with Stripe for payments and Gumroad for marketplace
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');
const { Pool } = require('pg');

class EcommerceAutomation {
  constructor(pool) {
    this.pool = pool;
    this.PLATFORM_FEE_PERCENTAGE = 0.30; // 30% platform cut
    this.GUMROAD_ACCESS_TOKEN = process.env.GUMROAD_ACCESS_TOKEN;
    this.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    
    // Auto-pricing tiers based on complexity
    this.PRICING_TIERS = {
      simple: { min: 4.99, max: 9.99 },
      standard: { min: 9.99, max: 19.99 },
      complex: { min: 19.99, max: 49.99 },
      premium: { min: 49.99, max: 99.99 }
    };
  }

  /**
   * Automatically generate and list diagram on marketplace
   * @param {string} userId - User who created the diagram
   * @param {string} diagnosticId - Diagnostic event ID
   * @param {Object} diagnosticData - Diagnostic data
   * @returns {Promise<Object>} Marketplace listing details
   */
  async autoListDiagram(userId, diagnosticId, diagnosticData) {
    try {
      // Generate diagram metadata
      const diagram = await this.generateDiagramMetadata(diagnosticData);
      
      // Determine auto-pricing
      const price = this.autoPrice(diagnosticData);
      
      // Create marketplace listing
      const listing = await this.createMarketplaceListing({
        user_id: userId,
        diagnostic_id: diagnosticId,
        diagram_id: diagram.diagram_id,
        title: diagram.title,
        description: diagram.description,
        price: price,
        tags: diagram.tags,
        image_url: diagram.image_url
      });
      
      // Auto-publish to Gumroad if enabled
      if (process.env.GUMROAD_AUTO_PUBLISH === 'true') {
        await this.publishToGumroad(listing);
      }
      
      return listing;
    } catch (error) {
      console.error('Auto-list diagram error:', error);
      throw error;
    }
  }

  /**
   * Generate diagram metadata from diagnostic data
   * @param {Object} diagnosticData - Diagnostic information
   * @returns {Object} Diagram metadata
   */
  generateDiagramMetadata(diagnosticData) {
    const pCode = diagnosticData.query?.p_code || 'UNKNOWN';
    const vehicle = diagnosticData.vehicle || {};
    const diagnosis = diagnosticData.consensus?.diagnosis || 'Diagnostic Analysis';
    
    const diagramId = `DIAG-IMG-${Date.now()}`;
    const title = `${pCode} ${diagnosis} - ${vehicle.make} ${vehicle.model}`;
    const description = `Detailed wire diagram for troubleshooting ${pCode} on ${vehicle.year} ${vehicle.make} ${vehicle.model}. ` +
                       `Generated from AI consensus analysis with ${Math.round(diagnosticData.consensus?.score * 100)}% agreement.`;
    
    // Auto-generate tags
    const tags = [
      vehicle.make?.toLowerCase(),
      vehicle.model?.toLowerCase().replace(/\s+/g, '-'),
      pCode.toLowerCase(),
      'wire-diagram',
      'auto-diagnostic'
    ].filter(Boolean);
    
    return {
      diagram_id: diagramId,
      title: title.substring(0, 255),
      description: description,
      tags: tags,
      image_url: `https://cdn.ridewire.ai/diagrams/${diagramId}.png`,
      created_at: new Date()
    };
  }

  /**
   * Auto-price diagram based on complexity
   * @param {Object} diagnosticData - Diagnostic data
   * @returns {number} Suggested price
   */
  autoPrice(diagnosticData) {
    const consensus = diagnosticData.consensus || {};
    const score = consensus.score || 0;
    const confidence = consensus.averageConfidence || 0;
    
    // Determine complexity tier
    let tier = 'standard';
    if (score >= 0.9 && confidence >= 0.85) {
      tier = 'premium'; // High quality, premium price
    } else if (score >= 0.75 && confidence >= 0.75) {
      tier = 'complex';
    } else if (score >= 0.6 && confidence >= 0.6) {
      tier = 'standard';
    } else {
      tier = 'simple';
    }
    
    // Random price within tier range
    const range = this.PRICING_TIERS[tier];
    return Number((Math.random() * (range.max - range.min) + range.min).toFixed(2));
  }

  /**
   * Create marketplace listing in database
   * @param {Object} listingData - Listing information
   * @returns {Promise<Object>} Created listing
   */
  async createMarketplaceListing(listingData) {
    const productId = `PROD-${Date.now()}`;
    
    const result = await this.pool.query(
      `INSERT INTO marketplace_listings 
       (product_id, seller_id, diagram_id, title, description, price, tags, sales_count, created_at, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 0, NOW(), 'active')
       RETURNING *`,
      [
        productId,
        listingData.user_id,
        listingData.diagram_id,
        listingData.title,
        listingData.description,
        listingData.price,
        JSON.stringify(listingData.tags)
      ]
    );
    
    return {
      ...result.rows[0],
      listing_url: `https://ridewire.ai/marketplace/${productId}`
    };
  }

  /**
   * Publish listing to Gumroad marketplace
   * @param {Object} listing - Marketplace listing
   * @returns {Promise<Object>} Gumroad product details
   */
  async publishToGumroad(listing) {
    try {
      const response = await axios.post(
        'https://api.gumroad.com/v2/products',
        {
          access_token: this.GUMROAD_ACCESS_TOKEN,
          name: listing.title,
          description: listing.description,
          price: Math.round(listing.price * 100), // Price in cents
          url: `ridewire-${listing.product_id}`,
          published: true
        }
      );
      
      // Update listing with Gumroad product ID
      await this.pool.query(
        `UPDATE marketplace_listings 
         SET metadata = jsonb_set(COALESCE(metadata, '{}'), '{gumroad_product_id}', $1)
         WHERE product_id = $2`,
        [JSON.stringify(response.data.product.id), listing.product_id]
      );
      
      return response.data.product;
    } catch (error) {
      console.error('Gumroad publish error:', error);
      throw error;
    }
  }

  /**
   * Process automated purchase
   * @param {string} productId - Product ID
   * @param {string} buyerId - Buyer user ID
   * @param {string} paymentMethodId - Stripe payment method ID
   * @returns {Promise<Object>} Purchase result with download link
   */
  async processPurchase(productId, buyerId, paymentMethodId) {
    try {
      // Get listing details
      const listingResult = await this.pool.query(
        'SELECT * FROM marketplace_listings WHERE product_id = $1 AND status = $2',
        [productId, 'active']
      );
      
      if (listingResult.rows.length === 0) {
        throw new Error('Product not found or unavailable');
      }
      
      const listing = listingResult.rows[0];
      const amountCents = Math.round(listing.price * 100);
      
      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountCents,
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
        description: `RideWire Marketplace - ${listing.title}`,
        metadata: {
          product_id: productId,
          buyer_id: buyerId,
          seller_id: listing.seller_id
        }
      });
      
      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment failed');
      }
      
      // Calculate revenue split
      const platformFee = listing.price * this.PLATFORM_FEE_PERCENTAGE;
      const sellerPayout = listing.price - platformFee;
      
      // Create revenue event
      const revenueEvent = await this.createRevenueEvent({
        buyer_id: buyerId,
        seller_id: listing.seller_id,
        product_id: productId,
        amount: listing.price,
        platform_fee: platformFee,
        seller_payout: sellerPayout,
        payment_intent_id: paymentIntent.id
      });
      
      // Update listing sales count
      await this.pool.query(
        'UPDATE marketplace_listings SET sales_count = sales_count + 1 WHERE product_id = $1',
        [productId]
      );
      
      // Generate download token
      const downloadToken = await this.generateDownloadToken(productId, buyerId);
      
      // Send purchase confirmation email
      await this.sendPurchaseConfirmation(buyerId, listing, downloadToken);
      
      // Queue seller payout
      await this.queueSellerPayout(listing.seller_id, sellerPayout, revenueEvent.event_id);
      
      return {
        success: true,
        transaction_id: revenueEvent.event_id,
        download_url: `https://ridewire.ai/download/${downloadToken}`,
        download_expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      };
    } catch (error) {
      console.error('Purchase processing error:', error);
      throw error;
    }
  }

  /**
   * Create revenue event record
   * @param {Object} data - Revenue event data
   * @returns {Promise<Object>} Created revenue event
   */
  async createRevenueEvent(data) {
    const eventId = `REV-${new Date().toISOString().split('T')[0]}-${Date.now()}`;
    
    const result = await this.pool.query(
      `INSERT INTO revenue_events 
       (event_id, user_id, timestamp, event_type, amount, net_amount, currency, status, marketplace, stripe)
       VALUES ($1, $2, NOW(), 'marketplace_sale', $3, $4, 'USD', 'completed', $5, $6)
       RETURNING *`,
      [
        eventId,
        data.buyer_id,
        data.amount,
        data.seller_payout,
        JSON.stringify({
          product_id: data.product_id,
          seller_id: data.seller_id,
          buyer_id: data.buyer_id,
          platform_fee: data.platform_fee,
          seller_payout: data.seller_payout
        }),
        JSON.stringify({
          payment_intent_id: data.payment_intent_id
        })
      ]
    );
    
    return result.rows[0];
  }

  /**
   * Generate secure download token
   * @param {string} productId - Product ID
   * @param {string} buyerId - Buyer ID
   * @returns {Promise<string>} Download token
   */
  async generateDownloadToken(productId, buyerId) {
    const jwt = require('jsonwebtoken');
    
    const token = jwt.sign(
      {
        product_id: productId,
        buyer_id: buyerId,
        type: 'download'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return token;
  }

  /**
   * Queue seller payout for next payout cycle
   * @param {string} sellerId - Seller user ID
   * @param {number} amount - Payout amount
   * @param {string} revenueEventId - Associated revenue event
   * @returns {Promise<void>}
   */
  async queueSellerPayout(sellerId, amount, revenueEventId) {
    // Get next weekly payout date (every Monday)
    const now = new Date();
    const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
    const nextPayoutDate = new Date(now);
    nextPayoutDate.setDate(now.getDate() + daysUntilMonday);
    nextPayoutDate.setHours(0, 0, 0, 0);
    
    await this.pool.query(
      `INSERT INTO payout_queue (seller_id, amount, revenue_event_id, scheduled_date, status)
       VALUES ($1, $2, $3, $4, 'pending')
       ON CONFLICT (seller_id, scheduled_date) 
       DO UPDATE SET amount = payout_queue.amount + EXCLUDED.amount`,
      [sellerId, amount, revenueEventId, nextPayoutDate]
    );
  }

  /**
   * Send purchase confirmation email
   * @param {string} buyerId - Buyer user ID
   * @param {Object} listing - Product listing
   * @param {string} downloadToken - Download token
   * @returns {Promise<void>}
   */
  async sendPurchaseConfirmation(buyerId, listing, downloadToken) {
    // Get buyer email
    const userResult = await this.pool.query(
      'SELECT email FROM users WHERE user_id = $1',
      [buyerId]
    );
    
    if (userResult.rows.length === 0) return;
    
    const email = userResult.rows[0].email;
    const downloadUrl = `https://ridewire.ai/download/${downloadToken}`;
    
    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    console.log(`Send email to ${email}:`);
    console.log(`Subject: Your RideWire Diagram is Ready!`);
    console.log(`Download: ${downloadUrl}`);
    console.log(`Product: ${listing.title}`);
    
    // Store email notification in database for tracking
    await this.pool.query(
      `INSERT INTO notifications (user_id, type, title, message, created_at, status)
       VALUES ($1, 'purchase_confirmation', 'Your Diagram is Ready', $2, NOW(), 'sent')`,
      [buyerId, `Download your diagram: ${listing.title}`]
    );
  }

  /**
   * Process weekly seller payouts
   * @returns {Promise<Object>} Payout processing results
   */
  async processWeeklyPayouts() {
    const results = {
      processed: 0,
      failed: 0,
      total_amount: 0,
      errors: []
    };
    
    // Get all pending payouts for today or earlier
    const payoutsResult = await this.pool.query(
      `SELECT * FROM payout_queue 
       WHERE status = 'pending' AND scheduled_date <= CURRENT_DATE
       ORDER BY seller_id`
    );
    
    for (const payout of payoutsResult.rows) {
      try {
        // Get seller Stripe account ID
        const sellerResult = await this.pool.query(
          'SELECT stripe_account_id FROM users WHERE user_id = $1',
          [payout.seller_id]
        );
        
        if (sellerResult.rows.length === 0 || !sellerResult.rows[0].stripe_account_id) {
          throw new Error('Seller Stripe account not found');
        }
        
        const stripeAccountId = sellerResult.rows[0].stripe_account_id;
        
        // Create Stripe transfer
        const transfer = await stripe.transfers.create({
          amount: Math.round(payout.amount * 100), // Amount in cents
          currency: 'usd',
          destination: stripeAccountId,
          description: `RideWire marketplace payout - Week of ${payout.scheduled_date}`,
          metadata: {
            seller_id: payout.seller_id,
            payout_queue_id: payout.id
          }
        });
        
        // Update payout status
        await this.pool.query(
          `UPDATE payout_queue 
           SET status = 'completed', processed_date = NOW(), stripe_transfer_id = $1
           WHERE id = $2`,
          [transfer.id, payout.id]
        );
        
        results.processed++;
        results.total_amount += payout.amount;
        
      } catch (error) {
        console.error(`Payout failed for seller ${payout.seller_id}:`, error);
        
        await this.pool.query(
          `UPDATE payout_queue 
           SET status = 'failed', error_message = $1
           WHERE id = $2`,
          [error.message, payout.id]
        );
        
        results.failed++;
        results.errors.push({
          seller_id: payout.seller_id,
          error: error.message
        });
      }
    }
    
    return results;
  }

  /**
   * Get seller revenue dashboard
   * @param {string} sellerId - Seller user ID
   * @returns {Promise<Object>} Revenue metrics
   */
  async getSellerDashboard(sellerId) {
    // Get total revenue
    const revenueResult = await this.pool.query(
      `SELECT 
        COUNT(*) as total_sales,
        SUM((marketplace->>'seller_payout')::numeric) as total_revenue,
        AVG((marketplace->>'seller_payout')::numeric) as avg_sale_price
       FROM revenue_events
       WHERE (marketplace->>'seller_id')::text = $1 AND status = 'completed'`,
      [sellerId]
    );
    
    // Get monthly revenue
    const monthlyResult = await this.pool.query(
      `SELECT 
        DATE_TRUNC('month', timestamp) as month,
        COUNT(*) as sales,
        SUM((marketplace->>'seller_payout')::numeric) as revenue
       FROM revenue_events
       WHERE (marketplace->>'seller_id')::text = $1 AND status = 'completed'
       GROUP BY DATE_TRUNC('month', timestamp)
       ORDER BY month DESC
       LIMIT 12`,
      [sellerId]
    );
    
    // Get top products
    const topProductsResult = await this.pool.query(
      `SELECT 
        ml.product_id,
        ml.title,
        ml.price,
        ml.sales_count,
        ml.sales_count * ml.price * (1 - $2) as total_revenue
       FROM marketplace_listings ml
       WHERE ml.seller_id = $1
       ORDER BY ml.sales_count DESC
       LIMIT 10`,
      [sellerId, this.PLATFORM_FEE_PERCENTAGE]
    );
    
    // Get pending payouts
    const pendingPayoutsResult = await this.pool.query(
      `SELECT SUM(amount) as pending_amount, scheduled_date
       FROM payout_queue
       WHERE seller_id = $1 AND status = 'pending'
       GROUP BY scheduled_date
       ORDER BY scheduled_date`,
      [sellerId]
    );
    
    return {
      total_sales: parseInt(revenueResult.rows[0].total_sales) || 0,
      total_revenue: parseFloat(revenueResult.rows[0].total_revenue) || 0,
      avg_sale_price: parseFloat(revenueResult.rows[0].avg_sale_price) || 0,
      monthly_revenue: monthlyResult.rows,
      top_products: topProductsResult.rows,
      pending_payouts: pendingPayoutsResult.rows
    };
  }
}

module.exports = EcommerceAutomation;
