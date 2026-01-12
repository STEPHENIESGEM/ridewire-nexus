/**
 * GameEngineSDK.ts - RideWire Game Engine API Wrapper
 * 
 * Handles communication between Unity WebGL game engine and RideWire AI Hub backend.
 * Manages query submission, response handling, and state persistence.
 */

import { v4 as uuidv4 } from 'uuid';

interface AIQuery {
  type: 'ai_query';
  query_id: string;
  user_id: string;
  content: string;
  context?: Record<string, any>;
  confidence_threshold: number;
  response_timeout_ms: number;
}

interface ConsensusResult {
  type: 'consensus_result';
  query_id: string;
  timestamp: string;
  consensus: {
    diagnosis: string;
    confidence: number;
    estimated_cost?: number;
    severity: 'info' | 'warning' | 'critical';
    ai_breakdown?: Record<string, { diagnosis: string; confidence: number }>;
  };
  ar_overlay?: any;
  safety_gated: boolean;
  recommended_actions: string[];
}

type QueryState = 'pending' | 'processing' | 'complete' | 'error';

interface QueryLifecycle {
  query_id: string;
  state: QueryState;
  result?: ConsensusResult;
  error?: string;
  retryCount: number;
  maxRetries: number;
}

export class GameEngineSDK {
  private apiEndpoint: string;
  private wsEndpoint: string;
  private authToken: string;
  private queries: Map<string, QueryLifecycle> = new Map();
  private ws: WebSocket | null = null;

  constructor(apiEndpoint: string, wsEndpoint: string, authToken: string) {
    this.apiEndpoint = apiEndpoint;
    this.wsEndpoint = wsEndpoint;
    this.authToken = authToken;
    this.initializeWebSocket();
  }

  /**
   * Initialize WebSocket connection for real-time updates
   */
  private initializeWebSocket(): void {
    try {
      this.ws = new WebSocket(this.wsEndpoint);
      
      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'consensus_result') {
          this.handleConsensusResult(message);
        }
      };
      
      this.ws.onerror = () => console.error('WebSocket error');
    } catch (err) {
      console.warn('WebSocket unavailable. Real-time updates will not be received.');
    }
  }

  /**
   * Submit a diagnostic query to the backend
   */
  async submitQuery(
    content: string,
    context?: Record<string, any>,
    confidenceThreshold: number = 0.7,
    timeoutMs: number = 30000
  ): Promise<string> {
    const queryId = uuidv4();
    
    const query: AIQuery = {
      type: 'ai_query',
      query_id: queryId,
      user_id: this.getUserId(),
      content,
      context,
      confidence_threshold: confidenceThreshold,
      response_timeout_ms: timeoutMs,
    };

    // Track query lifecycle
    this.queries.set(queryId, {
      query_id: queryId,
      state: 'pending',
      retryCount: 0,
      maxRetries: 3,
    });

    // Submit via REST with automatic retry
    await this.submitWithRetry(query);
    
    return queryId;
  }

  /**
   * Submit query with exponential backoff retry
   */
  private async submitWithRetry(query: AIQuery): Promise<void> {
    const lifecycle = this.queries.get(query.query_id)!;
    
    try {
      const response = await fetch(`${this.apiEndpoint}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
        },
        body: JSON.stringify(query),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      lifecycle.state = 'processing';
      return;
    } catch (error) {
      if (lifecycle.retryCount < lifecycle.maxRetries) {
        lifecycle.retryCount++;
        const backoffMs = Math.pow(2, lifecycle.retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffMs));
        return this.submitWithRetry(query);
      }
      
      lifecycle.state = 'error';
      lifecycle.error = String(error);
    }
  }

  /**
   * Handle incoming consensus result from backend
   */
  private handleConsensusResult(result: ConsensusResult): void {
    const lifecycle = this.queries.get(result.query_id);
    if (!lifecycle) return;
    
    lifecycle.state = 'complete';
    lifecycle.result = result;
    
    // Notify listeners
    this.dispatchQueryComplete(result);
  }

  /**
   * Get query result by ID
   */
  getQueryResult(queryId: string): ConsensusResult | null {
    const lifecycle = this.queries.get(queryId);
    return lifecycle?.result || null;
  }

  /**
   * Get query state
   */
  getQueryState(queryId: string): QueryState {
    return this.queries.get(queryId)?.state || 'error';
  }

  /**
   * Dispatch event when query completes (for UI update listeners)
   */
  private dispatchQueryComplete(result: ConsensusResult): void {
    window.dispatchEvent(
      new CustomEvent('rw:consensus_ready', { detail: result })
    );
  }

  /**
   * Get current user ID from session
   */
  private getUserId(): string {
    // Implementation: retrieve from session storage or auth provider
    return sessionStorage.getItem('rw_user_id') || 'anonymous';
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default GameEngineSDK;
