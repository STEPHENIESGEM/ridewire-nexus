/**
 * AIResponseMapper.ts - Multi-AI Consensus Aggregator
 * 
 * Converts three independent AI responses into a unified consensus result
 * with confidence weighting and conflict resolution.
 */

interface AIResponse {
  ai_provider: 'chatgpt' | 'claude' | 'gemini';
  diagnosis: string;
  confidence: number;
  estimated_cost?: number;
  recommended_actions: string[];
}

export class AIResponseMapper {
  /**
   * Aggregate three AI responses into unified consensus
   */
  static mapToConsensus(responses: AIResponse[], queryId: string) {
    if (responses.length === 0) {
      throw new Error('At least one AI response required');
    }

    // Calculate weighted average confidence
    const avgConfidence = responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length;

    // Extract and deduplicate actions
    const allActions = responses.flatMap(r => r.recommended_actions);
    const uniqueActions = Array.from(new Set(allActions));

    // Estimate cost (take highest estimate with weighting)
    const costs = responses
      .filter(r => r.estimated_cost !== undefined)
      .map(r => r.estimated_cost!);
    const avgCost = costs.length > 0 ? costs.reduce((a, b) => a + b) / costs.length : undefined;

    // Determine severity based on confidence and cost
    const severity = this.determineSeverity(avgConfidence, avgCost);

    return {
      type: 'consensus_result',
      query_id: queryId,
      timestamp: new Date().toISOString(),
      consensus: {
        diagnosis: this.synthesizeDiagnosis(responses),
        confidence: parseFloat(avgConfidence.toFixed(2)),
        estimated_cost: avgCost ? Math.round(avgCost) : undefined,
        severity,
        ai_breakdown: responses.reduce((acc, r) => {
          acc[r.ai_provider] = {
            diagnosis: r.diagnosis,
            confidence: r.confidence,
          };
          return acc;
        }, {} as Record<string, any>),
      },
      recommended_actions: uniqueActions,
      safety_gated: false,
    };
  }

  /**
   * Synthesize consensus diagnosis from three AI responses
   */
  private static synthesizeDiagnosis(responses: AIResponse[]): string {
    if (responses.length === 1) {
      return responses[0].diagnosis;
    }

    // Find common themes in diagnoses
    const diagnoses = responses.map(r => r.diagnosis);
    const avgLength = Math.round(
      diagnoses.reduce((sum, d) => sum + d.length, 0) / diagnoses.length
    );

    // If all diagnoses are identical, use it directly
    if (new Set(diagnoses).size === 1) {
      return diagnoses[0];
    }

    // Otherwise, synthesize based on common keywords
    const words = diagnoses
      .join(' ')
      .toLowerCase()
      .split(' ')
      .filter((w: string) => w.length > 3);

    const wordFreq = words.reduce((acc: Record<string, number>, word: string) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);

    // Create synthesis: "[Common finding]: [AI1 detail]. [AI2 detail]."
    return `${topWords.join(', ')}: ${diagnoses.join(' ')}`.substring(0, 500);
  }

  /**
   * Determine severity level
   */
  private static determineSeverity(
    confidence: number,
    estimatedCost?: number
  ): 'info' | 'warning' | 'critical' {
    if (confidence < 0.7) return 'info';
    if (estimatedCost && estimatedCost > 2000) return 'critical';
    if (confidence > 0.85) return 'critical';
    return 'warning';
  }
}

export default AIResponseMapper;
