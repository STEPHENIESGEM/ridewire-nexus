/**
 * Consensus Analyzer
 * Calculates semantic similarity and agreement between multiple AI responses
 * Determines if consensus is achieved without needing a tiebreaker
 */

class ConsensusAnalyzer {
  constructor() {
    this.agreementThreshold = 0.75; // 75% agreement needed for consensus
  }

  /**
   * Calculate consensus from multiple AI responses
   * @param {Array} responses - Array of {provider, response, confidence} objects
   * @returns {Object} Consensus result with score and analysis
   */
  calculateConsensus(responses) {
    if (!responses || responses.length === 0) {
      return {
        hasConsensus: false,
        score: 0,
        confidence: 0,
        analysis: 'No responses to analyze'
      };
    }

    // Extract key diagnostic elements from each response
    const diagnosticElements = responses.map(r => this.extractDiagnosticElements(r.response));
    
    // Calculate keyword overlap
    const keywordScore = this.calculateKeywordOverlap(diagnosticElements);
    
    // Calculate structural similarity
    const structureScore = this.calculateStructuralSimilarity(diagnosticElements);
    
    // Calculate semantic similarity
    const semanticScore = this.calculateSemanticSimilarity(responses.map(r => r.response));
    
    // Weighted average (keywords: 40%, structure: 30%, semantic: 30%)
    const overallScore = (keywordScore * 0.4) + (structureScore * 0.3) + (semanticScore * 0.3);
    
    // Calculate average confidence
    const avgConfidence = responses.reduce((sum, r) => sum + (r.confidence || 0.8), 0) / responses.length;
    
    // Determine if consensus is achieved
    const hasConsensus = overallScore >= this.agreementThreshold;
    
    return {
      hasConsensus,
      score: overallScore,
      confidence: avgConfidence,
      keywordScore,
      structureScore,
      semanticScore,
      analysis: this.generateAnalysis(responses, overallScore, hasConsensus),
      commonFindings: this.extractCommonFindings(diagnosticElements)
    };
  }

  /**
   * Extract diagnostic elements from response text
   * @param {string} text - Response text
   * @returns {Object} Extracted elements
   */
  extractDiagnosticElements(text) {
    const lowerText = text.toLowerCase();
    
    // Extract OBD2 codes (P0XXX format)
    const obdCodes = text.match(/P[0-3][0-9A-F]{3}/gi) || [];
    
    // Extract common automotive components
    const componentPatterns = [
      'spark plug', 'ignition coil', 'sensor', 'valve', 'filter', 
      'pump', 'catalytic converter', 'oxygen sensor', 'o2 sensor',
      'mass air flow', 'maf', 'throttle', 'fuel injector', 'egr',
      'evap', 'vacuum leak', 'gasket', 'thermostat', 'coolant',
      'transmission', 'brake', 'alternator', 'battery', 'starter'
    ];
    
    const components = componentPatterns.filter(pattern => 
      lowerText.includes(pattern)
    );
    
    // Extract symptoms
    const symptomPatterns = [
      'misfire', 'rough idle', 'stall', 'hesitation', 'vibration',
      'noise', 'leak', 'smoke', 'overheat', 'poor performance',
      'hard start', 'no start', 'check engine light', 'warning light'
    ];
    
    const symptoms = symptomPatterns.filter(pattern => 
      lowerText.includes(pattern)
    );
    
    // Extract actions
    const actionPatterns = [
      'replace', 'repair', 'clean', 'inspect', 'check', 'test',
      'diagnose', 'scan', 'reset', 'adjust'
    ];
    
    const actions = actionPatterns.filter(pattern => 
      lowerText.includes(pattern)
    );
    
    return {
      obdCodes,
      components,
      symptoms,
      actions,
      text: text.substring(0, 200) // First 200 chars for comparison
    };
  }

  /**
   * Calculate keyword overlap between responses
   * @param {Array} elements - Array of diagnostic elements
   * @returns {number} Overlap score (0-1)
   */
  calculateKeywordOverlap(elements) {
    if (elements.length < 2) return 1;
    
    const DEFAULT_KEYWORD_SCORE = 0.5; // Neutral score when no keywords found
    
    // Collect all keywords from all responses
    const allKeywords = new Set();
    elements.forEach(e => {
      [...e.components, ...e.symptoms, ...e.actions, ...e.obdCodes].forEach(k => allKeywords.add(k));
    });
    
    if (allKeywords.size === 0) return DEFAULT_KEYWORD_SCORE; // No keywords found
    
    // Count how many keywords appear in multiple responses
    let sharedCount = 0;
    allKeywords.forEach(keyword => {
      const appearances = elements.filter(e => 
        [...e.components, ...e.symptoms, ...e.actions, ...e.obdCodes].includes(keyword)
      ).length;
      
      if (appearances >= 2) {
        sharedCount += appearances / elements.length;
      }
    });
    
    return Math.min(sharedCount / allKeywords.size, 1);
  }

  /**
   * Calculate structural similarity (same types of elements mentioned)
   * @param {Array} elements - Array of diagnostic elements
   * @returns {number} Structure score (0-1)
   */
  calculateStructuralSimilarity(elements) {
    if (elements.length < 2) return 1;
    
    let similaritySum = 0;
    let comparisons = 0;
    
    // Compare each pair of responses
    for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        const e1 = elements[i];
        const e2 = elements[j];
        
        // Score each category
        const componentSim = this.jaccardSimilarity(e1.components, e2.components);
        const symptomSim = this.jaccardSimilarity(e1.symptoms, e2.symptoms);
        const actionSim = this.jaccardSimilarity(e1.actions, e2.actions);
        const codeSim = this.jaccardSimilarity(e1.obdCodes, e2.obdCodes);
        
        similaritySum += (componentSim + symptomSim + actionSim + codeSim) / 4;
        comparisons++;
      }
    }
    
    return comparisons > 0 ? similaritySum / comparisons : 0;
  }

  /**
   * Calculate semantic similarity using simple text comparison
   * @param {Array} texts - Array of response texts
   * @returns {number} Semantic score (0-1)
   */
  calculateSemanticSimilarity(texts) {
    if (texts.length < 2) return 1;
    
    // Simple word-based similarity
    const wordSets = texts.map(text => 
      new Set(text.toLowerCase().split(/\s+/).filter(w => w.length > 3))
    );
    
    let similaritySum = 0;
    let comparisons = 0;
    
    for (let i = 0; i < wordSets.length; i++) {
      for (let j = i + 1; j < wordSets.length; j++) {
        similaritySum += this.jaccardSimilarity(
          Array.from(wordSets[i]),
          Array.from(wordSets[j])
        );
        comparisons++;
      }
    }
    
    return comparisons > 0 ? similaritySum / comparisons : 0;
  }

  /**
   * Calculate Jaccard similarity between two arrays
   * @param {Array} arr1 - First array
   * @param {Array} arr2 - Second array
   * @returns {number} Jaccard similarity (0-1)
   */
  jaccardSimilarity(arr1, arr2) {
    if (arr1.length === 0 && arr2.length === 0) return 1;
    if (arr1.length === 0 || arr2.length === 0) return 0;
    
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  /**
   * Extract common findings from all responses
   * @param {Array} elements - Array of diagnostic elements
   * @returns {Object} Common findings
   */
  extractCommonFindings(elements) {
    const commonComponents = this.findCommonItems(elements.map(e => e.components));
    const commonSymptoms = this.findCommonItems(elements.map(e => e.symptoms));
    const commonActions = this.findCommonItems(elements.map(e => e.actions));
    const commonCodes = this.findCommonItems(elements.map(e => e.obdCodes));
    
    return {
      components: commonComponents,
      symptoms: commonSymptoms,
      actions: commonActions,
      obdCodes: commonCodes
    };
  }

  /**
   * Find items that appear in multiple arrays
   * @param {Array} arrays - Array of arrays
   * @returns {Array} Common items
   */
  findCommonItems(arrays) {
    if (arrays.length === 0) return [];
    
    const itemCounts = {};
    arrays.forEach(arr => {
      arr.forEach(item => {
        itemCounts[item] = (itemCounts[item] || 0) + 1;
      });
    });
    
    // Return items that appear in at least 2 responses
    return Object.entries(itemCounts)
      .filter(([itemName, count]) => count >= 2)
      .map(([itemName, count]) => itemName);
  }

  /**
   * Generate analysis text
   * @param {Array} responses - AI responses
   * @param {number} score - Consensus score
   * @param {boolean} hasConsensus - Whether consensus was achieved
   * @returns {string} Analysis text
   */
  generateAnalysis(responses, score, hasConsensus) {
    const percentage = Math.round(score * 100);
    
    if (hasConsensus) {
      return `Strong consensus achieved (${percentage}% agreement) across ${responses.length} AI models. The models agree on the primary diagnostic findings and recommended actions.`;
    } else {
      return `Limited consensus (${percentage}% agreement) across ${responses.length} AI models. The models have differing interpretations that require tiebreaker analysis.`;
    }
  }

  /**
   * Set agreement threshold
   * @param {number} threshold - New threshold (0-1)
   */
  setAgreementThreshold(threshold) {
    if (threshold < 0 || threshold > 1) {
      throw new Error('Threshold must be between 0 and 1');
    }
    this.agreementThreshold = threshold;
  }
}

module.exports = ConsensusAnalyzer;
