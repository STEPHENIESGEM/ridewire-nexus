/**
 * AIResponseMapper.ts
 * 
 * Backend module that converts Multi-AI consensus results into game-ready commands.
 * Transforms AI text responses into structured AR overlays, HUD updates, and gamification data.
 * 
 * USAGE:
 * 1. Import in server.js or multiAIOrchestrator.js
 * 2. Call mapConsensusToGameCommand() after consensus is reached
 * 3. Send resulting GameCommand to Unity via WebSocket
 * 
 * EXAMPLE:
 *   const mapper = new AIResponseMapper();
 *   const gameCommand = mapper.mapConsensusToGameCommand(consensus, vehicleId);
 *   io.emit('game-command', gameCommand);
 */

const crypto = require('crypto');

class AIResponseMapper {
  constructor() {
    // Component ID mapping for AR overlays
    this.componentMapping = {
      'spark_plug': { x: -0.2, y: 0.6, z: 1.0 },
      'engine_block': { x: 0.0, y: 0.5, z: 1.2 },
      'air_filter': { x: 0.3, y: 0.6, z: 0.8 },
      'battery': { x: -0.5, y: 0.4, z: 0.5 },
      'alternator': { x: 0.4, y: 0.5, z: 1.0 },
      'fuel_pump': { x: 0.0, y: 0.3, z: -1.5 },
      'transmission': { x: 0.0, y: 0.4, z: 0.0 },
      'radiator': { x: 0.0, y: 0.5, z: 1.5 },
      'brake_pad': { x: -0.6, y: 0.1, z: 0.5 },
      'oil_filter': { x: -0.3, y: 0.4, z: 0.9 }
    };

    // Fault code to component mapping
    this.faultCodeComponents = {
      'P0300': ['spark_plug', 'engine_block'],
      'P0420': ['catalytic_converter', 'oxygen_sensor'],
      'P0171': ['air_filter', 'fuel_pump'],
      'P0128': ['thermostat', 'radiator'],
      'P0401': ['egr_valve'],
      'P0442': ['fuel_tank', 'evap_system'],
      'P0455': ['fuel_tank', 'gas_cap'],
      'B0001': ['airbag_sensor'],
      'C0035': ['wheel_speed_sensor'],
      'U0100': ['ecu']
    };

    // Safety zone color mapping
    this.safetyColors = {
      'red': { r: 255, g: 59, b: 48, a: 0.8 },
      'yellow': { r: 255, g: 204, b: 0, a: 0.8 },
      'green': { r: 52, g: 199, b: 89, a: 0.8 },
      'teal': { r: 0, g: 199, b: 190, a: 0.8 }
    };
  }

  /**
   * Main method: Convert consensus to game command
   * @param {Object} consensus - Multi-AI consensus result
   * @param {string} vehicleId - Vehicle identifier
   * @returns {Object} GameCommand object ready for Unity
   */
  mapConsensusToGameCommand(consensus, vehicleId) {
    const command = {
      commandId: this.generateCommandId(),
      commandType: 'update-hud',
      arOverlays: this.generateAROverlays(consensus, vehicleId),
      hudPanel: this.generateHUDPanel(consensus),
      gamification: this.generateGamificationData(consensus),
      safetyRules: this.generateSafetyRules(consensus)
    };

    return command;
  }

  /**
   * Generate AR overlays based on consensus
   * @param {Object} consensus - Consensus result
   * @param {string} vehicleId - Vehicle ID
   * @returns {Array} Array of AR overlay objects
   */
  generateAROverlays(consensus, vehicleId) {
    const overlays = [];
    
    // Extract components mentioned in consensus
    const components = this.extractComponentsFromText(consensus.consensus);
    
    // Add overlays for error codes
    if (consensus.relatedCodes && consensus.relatedCodes.length > 0) {
      consensus.relatedCodes.forEach(code => {
        const codeComponents = this.faultCodeComponents[code] || [];
        codeComponents.forEach(comp => {
          if (!components.includes(comp)) {
            components.push(comp);
          }
        });
      });
    }

    // Generate overlay for each component
    components.forEach((component, index) => {
      const position = this.componentMapping[component] || { x: 0, y: 0.5, z: 1.0 };
      const color = this.safetyColors[consensus.safetyZone] || this.safetyColors.green;

      overlays.push({
        overlayId: `overlay_${component}_${Date.now()}`,
        type: 'highlight',
        componentId: component,
        position: position,
        color: color,
        label: this.formatComponentLabel(component),
        duration: 0, // Permanent until dismissed
        priority: 5 + index
      });
    });

    // Add arrow pointing to most critical component
    if (components.length > 0) {
      const criticalComponent = components[0];
      const position = this.componentMapping[criticalComponent];
      
      overlays.push({
        overlayId: `arrow_${Date.now()}`,
        type: 'arrow',
        componentId: criticalComponent,
        position: { x: position.x, y: position.y + 0.3, z: position.z },
        color: { r: 255, g: 255, b: 0, a: 1.0 },
        label: 'Check Here',
        duration: 5, // Auto-hide after 5 seconds
        priority: 10
      });
    }

    return overlays;
  }

  /**
   * Generate HUD panel content
   * @param {Object} consensus - Consensus result
   * @returns {Object} HUD panel object
   */
  generateHUDPanel(consensus) {
    const panel = {
      panelId: 'consensus_panel',
      title: 'Multi-AI Diagnosis',
      content: this.formatConsensusContent(consensus),
      position: 'top-right',
      backgroundColor: this.getSafetyBackgroundColor(consensus.safetyZone),
      visibility: 'visible',
      buttons: this.generateActionButtons(consensus)
    };

    return panel;
  }

  /**
   * Format consensus content for display
   * @param {Object} consensus - Consensus result
   * @returns {string} Formatted HTML content
   */
  formatConsensusContent(consensus) {
    let content = `<h3>Diagnosis: ${consensus.consensus}</h3>`;
    content += `<p><strong>Confidence:</strong> ${consensus.overallConfidence.toFixed(1)}%</p>`;
    
    if (consensus.estimatedCost) {
      content += `<p><strong>Estimated Cost:</strong> $${consensus.estimatedCost.min}-$${consensus.estimatedCost.max}</p>`;
    }

    content += '<hr/><h4>AI Breakdown:</h4><ul>';
    consensus.aiResponses.forEach(ai => {
      content += `<li><strong>${ai.provider}:</strong> ${ai.recommendation} (${ai.confidence}%)</li>`;
    });
    content += '</ul>';

    return content;
  }

  /**
   * Generate action buttons based on consensus
   * @param {Object} consensus - Consensus result
   * @returns {Array} Array of button objects
   */
  generateActionButtons(consensus) {
    const buttons = [];

    // Enable/disable buttons based on safety zone
    const isSafe = consensus.safetyZone === 'green' || consensus.safetyZone === 'teal';
    const needsConfirmation = consensus.safetyZone === 'yellow';
    const isBlocked = consensus.safetyZone === 'red';

    buttons.push({
      label: 'View Details',
      action: 'view_details',
      enabled: true
    });

    buttons.push({
      label: 'Get Repair Quote',
      action: 'get_quote',
      enabled: isSafe || needsConfirmation
    });

    buttons.push({
      label: 'Schedule Service',
      action: 'schedule_service',
      enabled: isSafe
    });

    if (isBlocked) {
      buttons.push({
        label: '⚠️ Seek Professional Help',
        action: 'professional_help',
        enabled: true
      });
    }

    return buttons;
  }

  /**
   * Generate gamification data (XP, achievements, etc.)
   * @param {Object} consensus - Consensus result
   * @returns {Object} Gamification payload
   */
  generateGamificationData(consensus) {
    // Calculate XP based on query complexity
    const baseXP = 10;
    const confidenceBonus = Math.floor(consensus.overallConfidence * 0.5);
    const aiCountBonus = consensus.aiResponses.length * 5;
    const xpGained = baseXP + confidenceBonus + aiCountBonus;

    // Check for achievements
    const achievements = [];
    if (consensus.overallConfidence === 100) {
      achievements.push('perfect_consensus');
    }
    if (consensus.safetyZone === 'teal') {
      achievements.push('expert_diagnosis');
    }

    return {
      xpGained: xpGained,
      achievementsUnlocked: achievements,
      missionProgress: {
        missionId: 'diagnose_5_vehicles',
        progress: 20, // TODO: Calculate from actual database query: SELECT COUNT(*) FROM diagnostics WHERE user_id = ?
        completed: false
      }
    };
  }

  /**
   * Generate safety rules for this consensus
   * @param {Object} consensus - Consensus result
   * @returns {Array} Array of safety rule objects
   */
  generateSafetyRules(consensus) {
    const rules = [];

    // Block critical actions if confidence too low
    if (consensus.overallConfidence < 70) {
      rules.push({
        ruleId: 'low_confidence_critical',
        name: 'Low Confidence Block',
        condition: `confidence < 70 AND action_type IN ['engine_disable', 'fuel_cutoff']`,
        action: 'block',
        message: 'AI confidence too low for critical action. Seek professional help.',
        severity: 'critical'
      });
    }

    // Warn for yellow zone actions
    if (consensus.safetyZone === 'yellow') {
      rules.push({
        ruleId: 'yellow_zone_warning',
        name: 'Medium Confidence Warning',
        condition: `safetyZone == 'yellow'`,
        action: 'warn',
        message: 'Proceed with caution. AI agreement is moderate.',
        severity: 'warning'
      });
    }

    // Require confirmation for conflicting AI opinions
    const confidenceRange = this.getConfidenceRange(consensus.aiResponses);
    if (confidenceRange > 30) {
      rules.push({
        ruleId: 'conflicting_opinions',
        name: 'Conflicting AI Opinions',
        condition: `confidenceRange > 30`,
        action: 'require-confirmation',
        message: 'AIs have different opinions. Review all recommendations before acting.',
        severity: 'warning'
      });
    }

    return rules;
  }

  /**
   * Extract component names from consensus text
   * @param {string} text - Consensus text
   * @returns {Array} Array of component IDs
   */
  extractComponentsFromText(text) {
    const components = [];
    const lowerText = text.toLowerCase();

    // Search for component keywords
    Object.keys(this.componentMapping).forEach(component => {
      const keyword = component.replace('_', ' ');
      if (lowerText.includes(keyword)) {
        components.push(component);
      }
    });

    // Add common keywords
    const keywords = {
      'spark plug': 'spark_plug',
      'engine': 'engine_block',
      'air filter': 'air_filter',
      'battery': 'battery',
      'alternator': 'alternator',
      'fuel pump': 'fuel_pump',
      'transmission': 'transmission',
      'radiator': 'radiator',
      'brakes': 'brake_pad',
      'oil filter': 'oil_filter'
    };

    Object.entries(keywords).forEach(([keyword, component]) => {
      if (lowerText.includes(keyword) && !components.includes(component)) {
        components.push(component);
      }
    });

    return components;
  }

  /**
   * Format component label for display
   * @param {string} componentId - Component ID
   * @returns {string} Formatted label
   */
  formatComponentLabel(componentId) {
    return componentId
      .replace('_', ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get safety zone background color
   * @param {string} safetyZone - Safety zone (red/yellow/green/teal)
   * @returns {string} CSS color code
   */
  getSafetyBackgroundColor(safetyZone) {
    const colors = {
      'red': '#FF3B30',
      'yellow': '#FFCC00',
      'green': '#34C759',
      'teal': '#00C7BE'
    };
    return colors[safetyZone] || colors.green;
  }

  /**
   * Get confidence range from AI responses
   * @param {Array} aiResponses - Array of AI responses
   * @returns {number} Range between highest and lowest confidence
   */
  getConfidenceRange(aiResponses) {
    if (!aiResponses || aiResponses.length === 0) return 0;
    
    const confidences = aiResponses.map(ai => ai.confidence);
    const max = Math.max(...confidences);
    const min = Math.min(...confidences);
    
    return max - min;
  }

  /**
   * Generate unique command ID
   * @returns {string} UUID
   */
  generateCommandId() {
    return crypto.randomUUID();
  }

  /**
   * Map consensus to streaming update (for real-time UI)
   * @param {string} provider - AI provider name
   * @param {string} partialResponse - Partial AI response
   * @returns {Object} Streaming update object
   */
  mapPartialResponse(provider, partialResponse) {
    return {
      type: 'ai-response-partial',
      data: {
        provider: provider,
        content: partialResponse,
        confidence: this.estimateConfidence(partialResponse),
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Estimate confidence from partial response text
   * @param {string} text - Response text
   * @returns {number} Estimated confidence (0-100)
   */
  estimateConfidence(text) {
    // Simple heuristic: longer responses = higher confidence
    // Words like "definitely", "likely", "probably" affect score
    let confidence = 70; // Base confidence

    const certainWords = ['definitely', 'certainly', 'clearly', 'obviously'];
    const uncertainWords = ['might', 'maybe', 'possibly', 'perhaps', 'could'];

    const lowerText = text.toLowerCase();
    certainWords.forEach(word => {
      if (lowerText.includes(word)) confidence += 5;
    });
    uncertainWords.forEach(word => {
      if (lowerText.includes(word)) confidence -= 5;
    });

    return Math.max(0, Math.min(100, confidence));
  }
}

module.exports = AIResponseMapper;

// Example usage:
/*
const AIResponseMapper = require('./AIResponseMapper');
const mapper = new AIResponseMapper();

const consensus = {
  queryId: '12345',
  query: 'Engine code P0300',
  consensus: 'Random misfire detected. Check spark plugs and ignition coils.',
  overallConfidence: 85,
  aiResponses: [
    { provider: 'ChatGPT', confidence: 90, recommendation: 'Replace spark plugs', reasoning: '...' },
    { provider: 'Claude', confidence: 85, recommendation: 'Check ignition coils', reasoning: '...' },
    { provider: 'Gemini', confidence: 80, recommendation: 'Inspect fuel injectors', reasoning: '...' }
  ],
  safetyZone: 'green',
  estimatedCost: { min: 100, max: 300, currency: 'USD' },
  relatedCodes: ['P0300', 'P0301']
};

const gameCommand = mapper.mapConsensusToGameCommand(consensus, 'toyota_camry_2020');
console.log(JSON.stringify(gameCommand, null, 2));
*/
