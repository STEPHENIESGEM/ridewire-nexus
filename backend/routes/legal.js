const express = require('express');
const router = express.Router();
const { pool } = require('../db'); // Adjust path based on your database connection setup

/**
 * POST /api/legal/accept-disclaimer
 * Record user acceptance of legal disclaimer
 * 
 * Body: {
 *   disclaimerType: 'diagnostic' | 'terms_of_service' | 'privacy_policy',
 *   version: '1.0.0'
 * }
 */
router.post('/accept-disclaimer', async (req, res) => {
  try {
    const { disclaimerType, version } = req.body;
    const userId = req.user?.id; // Assuming authentication middleware sets req.user

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!disclaimerType || !version) {
      return res.status(400).json({ error: 'Missing required fields: disclaimerType and version' });
    }

    // Validate disclaimer type
    const validTypes = ['diagnostic', 'terms_of_service', 'privacy_policy'];
    if (!validTypes.includes(disclaimerType)) {
      return res.status(400).json({ error: 'Invalid disclaimer type' });
    }

    // Get user's IP address and user agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    // Insert or update user agreement
    const query = `
      INSERT INTO user_agreements (user_id, disclaimer_type, version, ip_address, user_agent, accepted_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, disclaimer_type, version)
      DO UPDATE SET 
        accepted_at = CURRENT_TIMESTAMP,
        ip_address = EXCLUDED.ip_address,
        user_agent = EXCLUDED.user_agent
      RETURNING id, accepted_at
    `;

    const result = await pool.query(query, [userId, disclaimerType, version, ipAddress, userAgent]);

    res.json({
      success: true,
      disclaimerType,
      version,
      acceptedAt: result.rows[0].accepted_at,
      message: 'Disclaimer acceptance recorded successfully'
    });

  } catch (error) {
    console.error('Error accepting disclaimer:', error);
    res.status(500).json({ error: 'Failed to record disclaimer acceptance' });
  }
});

/**
 * GET /api/legal/check-disclaimer/:type
 * Check if user has accepted a specific disclaimer
 * 
 * Params: type - 'diagnostic' | 'terms_of_service' | 'privacy_policy'
 * Query: version (optional) - Check for specific version, defaults to any version
 */
router.get('/check-disclaimer/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { version } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Validate disclaimer type
    const validTypes = ['diagnostic', 'terms_of_service', 'privacy_policy'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid disclaimer type' });
    }

    // Build query based on whether version is specified
    let query, params;
    if (version) {
      query = `
        SELECT id, version, accepted_at
        FROM user_agreements
        WHERE user_id = $1 AND disclaimer_type = $2 AND version = $3
        ORDER BY accepted_at DESC
        LIMIT 1
      `;
      params = [userId, type, version];
    } else {
      query = `
        SELECT id, version, accepted_at
        FROM user_agreements
        WHERE user_id = $1 AND disclaimer_type = $2
        ORDER BY accepted_at DESC
        LIMIT 1
      `;
      params = [userId, type];
    }

    const result = await pool.query(query, params);

    if (result.rows.length > 0) {
      res.json({
        accepted: true,
        disclaimerType: type,
        version: result.rows[0].version,
        acceptedAt: result.rows[0].accepted_at
      });
    } else {
      res.json({
        accepted: false,
        disclaimerType: type,
        message: 'User has not accepted this disclaimer'
      });
    }

  } catch (error) {
    console.error('Error checking disclaimer:', error);
    res.status(500).json({ error: 'Failed to check disclaimer status' });
  }
});

/**
 * GET /api/legal/user-agreements
 * Get all disclaimer acceptances for the current user
 */
router.get('/user-agreements', async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const query = `
      SELECT disclaimer_type, version, accepted_at
      FROM user_agreements
      WHERE user_id = $1
      ORDER BY accepted_at DESC
    `;

    const result = await pool.query(query, [userId]);

    res.json({
      agreements: result.rows
    });

  } catch (error) {
    console.error('Error fetching user agreements:', error);
    res.status(500).json({ error: 'Failed to fetch user agreements' });
  }
});

/**
 * GET /api/legal/current-version/:type
 * Get the current version of a disclaimer
 * (Useful for checking if user needs to re-accept updated terms)
 */
router.get('/current-version/:type', (req, res) => {
  const { type } = req.params;

  // Current versions - update these when disclaimers are revised
  const versions = {
    diagnostic: '1.0.0',
    terms_of_service: '1.0.0',
    privacy_policy: '1.0.0'
  };

  const validTypes = ['diagnostic', 'terms_of_service', 'privacy_policy'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid disclaimer type' });
  }

  res.json({
    disclaimerType: type,
    currentVersion: versions[type],
    lastUpdated: '2026-01-05' // Update this when versions change
  });
});

module.exports = router;
