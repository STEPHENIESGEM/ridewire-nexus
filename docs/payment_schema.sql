-- RideWire Oasis Coin App - Payment Database Schema
-- Version: 1.0
-- Date: December 9, 2025
-- Purpose: Support Stripe payment processing + Multi-AI fraud detection
-- 
-- PREREQUISITES: This schema assumes the 'users' table already exists
-- from schema.sql. Run schema.sql first if not already deployed.
-- Expected structure: users(id, email, password_hash, created_at)

-- ============================================================
-- TRANSACTIONS TABLE
-- ============================================================
-- Stores all payment transactions from Stripe
-- Dependencies: Requires users table from schema.sql
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    stripe_payment_id VARCHAR(255) UNIQUE NOT NULL,
    stripe_session_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending',
    product_id VARCHAR(100),
    product_name VARCHAR(255),
    quantity INTEGER DEFAULT 1,
    customer_email VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_stripe_payment_id ON transactions(stripe_payment_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_email ON transactions(customer_email);

-- ============================================================
-- AI CONSENSUS LOGS TABLE
-- ============================================================
-- Stores fraud detection results from multi-AI consensus
CREATE TABLE IF NOT EXISTS ai_consensus_logs (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
    chatgpt_risk DECIMAL(5, 4),
    chatgpt_response TEXT,
    claude_risk DECIMAL(5, 4),
    claude_response TEXT,
    gemini_risk DECIMAL(5, 4),
    gemini_response TEXT,
    consensus_risk DECIMAL(5, 4) NOT NULL,
    decision VARCHAR(50) NOT NULL,
    reasoning TEXT,
    confidence DECIMAL(5, 4),
    processing_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_consensus_transaction_id ON ai_consensus_logs(transaction_id);
CREATE INDEX IF NOT EXISTS idx_ai_consensus_decision ON ai_consensus_logs(decision);
CREATE INDEX IF NOT EXISTS idx_ai_consensus_risk ON ai_consensus_logs(consensus_risk);

-- ============================================================
-- FRAUD ALERTS TABLE
-- ============================================================
-- Stores flagged transactions for manual review
CREATE TABLE IF NOT EXISTS fraud_alerts (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
    alert_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    details TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_by INTEGER REFERENCES users(id),
    resolved_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_transaction_id ON fraud_alerts(transaction_id);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_resolved ON fraud_alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_severity ON fraud_alerts(severity);

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
-- Catalog of available avatar outfits for presale
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    stripe_price_id VARCHAR(255),
    category VARCHAR(100),
    image_url TEXT,
    stock_quantity INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_product_id ON products(product_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- ============================================================
-- ORDERS TABLE
-- ============================================================
-- High-level order tracking (can contain multiple products)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    transaction_id INTEGER REFERENCES transactions(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending',
    fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled',
    customer_email VARCHAR(255),
    shipping_address JSONB,
    billing_address JSONB,
    fulfillment_code TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ============================================================
-- AFFILIATES TABLE
-- ============================================================
-- Influencer affiliate program tracking
CREATE TABLE IF NOT EXISTS affiliates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    affiliate_code VARCHAR(50) UNIQUE NOT NULL,
    affiliate_name VARCHAR(255),
    email VARCHAR(255),
    commission_rate DECIMAL(5, 2) DEFAULT 15.00,
    total_sales DECIMAL(10, 2) DEFAULT 0.00,
    total_commission DECIMAL(10, 2) DEFAULT 0.00,
    total_orders INTEGER DEFAULT 0,
    tier VARCHAR(50) DEFAULT 'tier1',
    status VARCHAR(50) DEFAULT 'active',
    payment_method VARCHAR(50),
    payment_details JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_status ON affiliates(status);

-- ============================================================
-- COMMISSIONS TABLE
-- ============================================================
-- Tracks commission payouts to affiliates
CREATE TABLE IF NOT EXISTS commissions (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER REFERENCES affiliates(id) ON DELETE CASCADE,
    transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES orders(id),
    commission_amount DECIMAL(10, 2) NOT NULL,
    commission_rate DECIMAL(5, 2),
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    paid_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_commissions_affiliate_id ON commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_commissions_transaction_id ON commissions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);
CREATE INDEX IF NOT EXISTS idx_commissions_paid_at ON commissions(paid_at);

-- ============================================================
-- AUDIT LOG TABLE
-- ============================================================
-- Comprehensive audit trail for compliance
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id INTEGER,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================================
-- WEBHOOK EVENTS TABLE
-- ============================================================
-- Stores Stripe webhook events for debugging
CREATE TABLE IF NOT EXISTS webhook_events (
    id SERIAL PRIMARY KEY,
    stripe_event_id VARCHAR(255) UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processing_attempts INTEGER DEFAULT 0,
    error_message TEXT,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_webhook_events_stripe_id ON webhook_events(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed);

-- ============================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================

-- Insert sample products (Avatar Outfits)
INSERT INTO products (product_id, name, description, price, category, is_active)
VALUES
    ('avatar_basic', 'Avatar Outfit - Basic', 'Entry-level digital avatar outfit for RideWire Oasis', 10.00, 'avatar_outfit', TRUE),
    ('avatar_premium', 'Avatar Outfit - Premium', 'Enhanced avatar outfit with exclusive accessories', 25.00, 'avatar_outfit', TRUE),
    ('avatar_legendary', 'Avatar Outfit - Legendary', 'Limited edition legendary avatar outfit with VIP perks', 50.00, 'avatar_outfit', TRUE),
    ('vip_pass', 'VIP Pass Token', 'Early access to RideWire Oasis platform features', 100.00, 'access_token', TRUE)
ON CONFLICT (product_id) DO NOTHING;

-- ============================================================
-- FUNCTIONS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for transactions table
DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for orders table
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for products table
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for affiliates table
DROP TRIGGER IF EXISTS update_affiliates_updated_at ON affiliates;
CREATE TRIGGER update_affiliates_updated_at
    BEFORE UPDATE ON affiliates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- VIEWS FOR REPORTING
-- ============================================================

-- View: Transaction summary with AI consensus
CREATE OR REPLACE VIEW transaction_summary AS
SELECT 
    t.id,
    t.stripe_payment_id,
    t.amount,
    t.status,
    t.customer_email,
    t.created_at,
    ac.consensus_risk,
    ac.decision AS fraud_decision,
    o.order_number,
    o.fulfillment_status
FROM transactions t
LEFT JOIN ai_consensus_logs ac ON t.id = ac.transaction_id
LEFT JOIN orders o ON t.id = o.transaction_id
ORDER BY t.created_at DESC;

-- View: Affiliate performance
CREATE OR REPLACE VIEW affiliate_performance AS
SELECT 
    a.id,
    a.affiliate_code,
    a.affiliate_name,
    a.commission_rate,
    a.total_sales,
    a.total_commission,
    a.total_orders,
    COUNT(c.id) AS pending_commissions,
    SUM(CASE WHEN c.status = 'pending' THEN c.commission_amount ELSE 0 END) AS pending_amount
FROM affiliates a
LEFT JOIN commissions c ON a.id = c.affiliate_id
GROUP BY a.id, a.affiliate_code, a.affiliate_name, a.commission_rate, a.total_sales, a.total_commission, a.total_orders;

-- ============================================================
-- PERMISSIONS (Optional - Adjust based on user roles)
-- ============================================================

-- Grant read-only access to reporting views
-- GRANT SELECT ON transaction_summary TO reporting_user;
-- GRANT SELECT ON affiliate_performance TO reporting_user;

-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================

-- Verify tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'transactions', 
    'ai_consensus_logs', 
    'fraud_alerts', 
    'products', 
    'orders', 
    'affiliates', 
    'commissions',
    'audit_logs',
    'webhook_events'
)
ORDER BY table_name;
