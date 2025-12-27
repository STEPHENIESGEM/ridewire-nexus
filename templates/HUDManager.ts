/**
 * HUDManager.ts - AR Head-Up Display Panel Manager
 * Manages lifecycle of UI panels displaying diagnostic results in AR overlay.
 */
export class HUDManager {
  private panels: Map<string, any> = new Map();
  private activePanel: string | null = null;

  displayDiagnosticResult(result: any, duration_ms: number = 10000): string {
    const panelId = `panel-${Date.now()}`;
    const panel = {
      id: panelId,
      type: result.consensus.severity === 'critical' ? 'warning' : 'diagnostic',
      title: result.consensus.severity.toUpperCase(),
      content: result.consensus.diagnosis,
      position: { x: 0.5, y: 0.8 },
      duration_ms,
      visible: true,
    };

    this.panels.set(panelId, panel);
    this.activePanel = panelId;

    if (duration_ms > 0) {
      setTimeout(() => this.dismissPanel(panelId), duration_ms);
    }

    return panelId;
  }

  displayConfidenceBreakdown(result: any): string {
    const panelId = `confidence-${Date.now()}`;
    const breakdown = result.consensus.ai_breakdown;
    const confidenceText = `Overall: ${(result.consensus.confidence * 100).toFixed(0)}%`;
    const aiScores = Object.entries(breakdown)
      .map(([ai, data]: [string, any]) => `${ai}: ${(data.confidence * 100).toFixed(0)}%`)
      .join(' | ');

    const panel = {
      id: panelId,
      type: 'diagnostic',
      title: 'Confidence Scores',
      content: `${confidenceText}\n${aiScores}`,
      position: { x: 0.5, y: 0.6 },
      visible: true,
    };

    this.panels.set(panelId, panel);
    return panelId;
  }

  showLoading(message: string = 'Analyzing...'): string {
    const panelId = `loading-${Date.now()}`;
    const panel = {
      id: panelId,
      type: 'loading',
      title: 'Processing',
      content: message,
      position: { x: 0.5, y: 0.5 },
      visible: true,
    };

    this.panels.set(panelId, panel);
    return panelId;
  }

  dismissPanel(panelId: string): void {
    const panel = this.panels.get(panelId);
    if (panel) {
      panel.visible = false;
      if (this.activePanel === panelId) {
        this.activePanel = null;
      }
    }
  }

  getVisiblePanels(): any[] {
    return Array.from(this.panels.values()).filter(p => p.visible);
  }

  clearAll(): void {
    this.panels.forEach(panel => panel.visible = false);
    this.activePanel = null;
  }
}

export default HUDManager;
