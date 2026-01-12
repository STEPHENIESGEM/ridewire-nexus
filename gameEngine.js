/**
 * Game Engine Module
 * Manages player progression, achievements, XP, and leaderboards
 * Drives user retention through gamification mechanics
 */

const { Pool } = require('pg');

class GameEngine {
  constructor(pool) {
    this.pool = pool;
    
    // XP configuration
    this.XP_PER_DIAGNOSTIC = 10;
    this.XP_PER_DIAGRAM_GENERATED = 25;
    this.XP_PER_DIAGRAM_SOLD = 50;
    this.XP_PER_AR_SCAN = 5;
    
    // Level progression (XP required for each level)
    this.LEVEL_THRESHOLDS = this.generateLevelThresholds();
    
    // Achievement definitions
    this.ACHIEVEMENTS = {
      'ACH-FIRST-DIAG': {
        name: 'First Diagnosis',
        description: 'Complete your first diagnostic query',
        xp_reward: 100,
        rarity: 'common'
      },
      'ACH-10-DIAGS': {
        name: '10 Diagnostics',
        description: 'Complete 10 diagnostic queries',
        xp_reward: 200,
        rarity: 'uncommon'
      },
      'ACH-100-DIAGS': {
        name: 'Diagnostic Expert',
        description: 'Complete 100 diagnostic queries',
        xp_reward: 500,
        rarity: 'rare'
      },
      'ACH-FIRST-SALE': {
        name: 'First Sale',
        description: 'Sell your first diagram on the marketplace',
        xp_reward: 200,
        rarity: 'uncommon'
      },
      'ACH-10-SALES': {
        name: '10 Sales',
        description: 'Sell 10 diagrams on the marketplace',
        xp_reward: 500,
        rarity: 'rare'
      },
      'ACH-PASSIVE-INCOME-PRO': {
        name: 'Passive Income Pro',
        description: 'Earn $100 from diagram sales',
        xp_reward: 1000,
        rarity: 'epic'
      },
      'ACH-AR-EXPLORER': {
        name: 'AR Explorer',
        description: 'Use AR overlay 50 times',
        xp_reward: 300,
        rarity: 'uncommon'
      },
      'ACH-PERFECT-CONSENSUS': {
        name: 'Perfect Consensus',
        description: 'Achieve 95%+ AI agreement 10 times',
        xp_reward: 750,
        rarity: 'epic'
      },
      'ACH-WEEK-STREAK': {
        name: 'Week Warrior',
        description: 'Log in for 7 consecutive days',
        xp_reward: 400,
        rarity: 'rare'
      }
    };
  }

  /**
   * Generate level thresholds (XP required for each level)
   * @returns {Array} Array of XP thresholds
   */
  generateLevelThresholds() {
    const thresholds = [0]; // Level 1 starts at 0 XP
    let xp = 1000; // Level 2 requires 1000 XP
    
    for (let level = 2; level <= 100; level++) {
      thresholds.push(xp);
      xp = Math.floor(xp * 1.15); // 15% increase per level
    }
    
    return thresholds;
  }

  /**
   * Initialize game state for new user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Initial game state
   */
  async initializeGameState(userId) {
    const gameState = {
      user_id: userId,
      level: 1,
      xp: 0,
      total_xp: 0,
      achievements: [],
      statistics: {
        diagnostics_run: 0,
        diagrams_generated: 0,
        diagrams_sold: 0,
        total_revenue: 0,
        ar_scans: 0,
        consensus_score_avg: 0,
        accuracy_rate: 0,
        streak_days: 0,
        longest_streak: 0
      },
      created_at: new Date(),
      updated_at: new Date()
    };

    await this.pool.query(
      `INSERT INTO game_states (user_id, level, xp, total_xp, achievements, statistics, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (user_id) DO NOTHING`,
      [
        userId,
        gameState.level,
        gameState.xp,
        gameState.total_xp,
        JSON.stringify(gameState.achievements),
        JSON.stringify(gameState.statistics),
        gameState.created_at,
        gameState.updated_at
      ]
    );

    return gameState;
  }

  /**
   * Get user's game state
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Game state
   */
  async getGameState(userId) {
    const result = await this.pool.query(
      'SELECT * FROM game_states WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return await this.initializeGameState(userId);
    }

    const row = result.rows[0];
    return {
      user_id: row.user_id,
      level: row.level,
      xp: row.xp,
      total_xp: row.total_xp,
      xp_to_next_level: this.getXPToNextLevel(row.level, row.xp),
      achievements: row.achievements,
      statistics: row.statistics,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  /**
   * Add XP to user and check for level up
   * @param {string} userId - User ID
   * @param {number} xpAmount - XP to add
   * @returns {Promise<Object>} Updated game state with level up info
   */
  async addXP(userId, xpAmount) {
    const gameState = await this.getGameState(userId);
    
    gameState.xp += xpAmount;
    gameState.total_xp += xpAmount;
    gameState.updated_at = new Date();

    // Check for level up
    const levelUpInfo = this.checkLevelUp(gameState.level, gameState.xp);
    
    if (levelUpInfo.leveledUp) {
      gameState.level = levelUpInfo.newLevel;
      gameState.xp = levelUpInfo.remainingXP;
    }

    // Update database
    await this.pool.query(
      `UPDATE game_states 
       SET level = $1, xp = $2, total_xp = $3, updated_at = $4
       WHERE user_id = $5`,
      [gameState.level, gameState.xp, gameState.total_xp, gameState.updated_at, userId]
    );

    return {
      ...gameState,
      xp_to_next_level: this.getXPToNextLevel(gameState.level, gameState.xp),
      leveledUp: levelUpInfo.leveledUp,
      newLevel: levelUpInfo.newLevel
    };
  }

  /**
   * Check if user leveled up
   * @param {number} currentLevel - Current level
   * @param {number} currentXP - Current XP
   * @returns {Object} Level up information
   */
  checkLevelUp(currentLevel, currentXP) {
    if (currentLevel >= 100) {
      return { leveledUp: false };
    }

    const xpForNextLevel = this.LEVEL_THRESHOLDS[currentLevel];
    
    if (currentXP >= xpForNextLevel) {
      return {
        leveledUp: true,
        newLevel: currentLevel + 1,
        remainingXP: currentXP - xpForNextLevel
      };
    }

    return { leveledUp: false };
  }

  /**
   * Get XP required to reach next level
   * @param {number} currentLevel - Current level
   * @param {number} currentXP - Current XP
   * @returns {number} XP needed
   */
  getXPToNextLevel(currentLevel, currentXP) {
    if (currentLevel >= 100) {
      return 0;
    }
    return this.LEVEL_THRESHOLDS[currentLevel] - currentXP;
  }

  /**
   * Check for unlocked achievements
   * @param {string} userId - User ID
   * @param {Object} eventData - Event data to check against
   * @returns {Promise<Array>} Newly unlocked achievements
   */
  async checkAchievements(userId, eventData) {
    const gameState = await this.getGameState(userId);
    const unlockedAchievements = [];

    // Check each achievement
    for (const [achievementId, achievement] of Object.entries(this.ACHIEVEMENTS)) {
      // Skip if already unlocked
      if (gameState.achievements.some(a => a.achievement_id === achievementId)) {
        continue;
      }

      let shouldUnlock = false;

      // Check achievement conditions
      switch (achievementId) {
        case 'ACH-FIRST-DIAG':
          shouldUnlock = eventData.diagnostic_completed && gameState.statistics.diagnostics_run === 0;
          break;
        
        case 'ACH-10-DIAGS':
          shouldUnlock = gameState.statistics.diagnostics_run === 10;
          break;
        
        case 'ACH-100-DIAGS':
          shouldUnlock = gameState.statistics.diagnostics_run === 100;
          break;
        
        case 'ACH-FIRST-SALE':
          shouldUnlock = eventData.diagram_sold && gameState.statistics.diagrams_sold === 0;
          break;
        
        case 'ACH-10-SALES':
          shouldUnlock = gameState.statistics.diagrams_sold === 10;
          break;
        
        case 'ACH-PASSIVE-INCOME-PRO':
          shouldUnlock = gameState.statistics.total_revenue >= 100;
          break;
        
        case 'ACH-AR-EXPLORER':
          shouldUnlock = gameState.statistics.ar_scans === 50;
          break;
        
        case 'ACH-PERFECT-CONSENSUS':
          shouldUnlock = eventData.consensus_score >= 0.95 && eventData.perfect_consensus_count >= 10;
          break;
        
        case 'ACH-WEEK-STREAK':
          shouldUnlock = gameState.statistics.streak_days === 7;
          break;
      }

      if (shouldUnlock) {
        const unlockedAchievement = {
          achievement_id: achievementId,
          name: achievement.name,
          description: achievement.description,
          rarity: achievement.rarity,
          xp_reward: achievement.xp_reward,
          unlocked_at: new Date()
        };

        unlockedAchievements.push(unlockedAchievement);
        
        // Award XP for achievement
        await this.addXP(userId, achievement.xp_reward);
      }
    }

    // Update achievements in database
    if (unlockedAchievements.length > 0) {
      gameState.achievements.push(...unlockedAchievements);
      
      await this.pool.query(
        'UPDATE game_states SET achievements = $1, updated_at = $2 WHERE user_id = $3',
        [JSON.stringify(gameState.achievements), new Date(), userId]
      );
    }

    return unlockedAchievements.map(a => a.achievement_id);
  }

  /**
   * Update user statistics
   * @param {string} userId - User ID
   * @param {Object} stats - Statistics to update
   * @returns {Promise<Object>} Updated game state
   */
  async updateStatistics(userId, stats) {
    const gameState = await this.getGameState(userId);
    
    // Merge new stats with existing
    Object.keys(stats).forEach(key => {
      if (key in gameState.statistics) {
        gameState.statistics[key] = stats[key];
      }
    });

    await this.pool.query(
      'UPDATE game_states SET statistics = $1, updated_at = $2 WHERE user_id = $3',
      [JSON.stringify(gameState.statistics), new Date(), userId]
    );

    return gameState;
  }

  /**
   * Get leaderboard
   * @param {string} category - Leaderboard category (global, revenue, diagnostics)
   * @param {number} limit - Number of results
   * @returns {Promise<Array>} Leaderboard entries
   */
  async getLeaderboard(category = 'global', limit = 100) {
    let orderBy = 'total_xp DESC';
    
    if (category === 'revenue') {
      orderBy = "(statistics->>'total_revenue')::numeric DESC";
    } else if (category === 'diagnostics') {
      orderBy = "(statistics->>'diagnostics_run')::integer DESC";
    }

    const result = await this.pool.query(
      `SELECT user_id, level, total_xp, statistics
       FROM game_states
       ORDER BY ${orderBy}
       LIMIT $1`,
      [limit]
    );

    return result.rows.map((row, index) => ({
      rank: index + 1,
      user_id: row.user_id,
      level: row.level,
      total_xp: row.total_xp,
      statistics: row.statistics
    }));
  }
}

module.exports = GameEngine;
