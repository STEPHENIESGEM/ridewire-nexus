/**
 * SafetyRuleEngine.ts
 * 
 * Safety rule evaluation engine for RideWire AI Hub.
 * Implements veto system, confidence gates, and action validation.
 * 
 * USAGE:
 * 1. Copy to Unity project: Assets/Scripts/SafetyRuleEngine.cs
 * 2. Attach to GameManager or use as static utility class
 * 3. Call ValidateAction() before executing any user action
 * 4. Implement backend version (Node.js) for server-side validation
 */

using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

namespace RideWire.GameEngine
{
    /// <summary>
    /// Evaluates safety rules and validates actions
    /// </summary>
    public class SafetyRuleEngine : MonoBehaviour
    {
        #region Singleton Pattern
        public static SafetyRuleEngine Instance { get; private set; }

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        #endregion

        #region Configuration
        [Header("Safety Thresholds")]
        [Tooltip("Minimum confidence for critical actions")]
        [Range(0, 100)]
        public float criticalActionThreshold = 90f;

        [Tooltip("Minimum confidence for standard actions")]
        [Range(0, 100)]
        public float standardActionThreshold = 70f;

        [Tooltip("Maximum confidence variance for AI agreement")]
        [Range(0, 100)]
        public float maxConfidenceVariance = 30f;

        [Tooltip("Minimum single AI confidence (veto threshold)")]
        [Range(0, 100)]
        public float singleAIVetoThreshold = 40f;

        [Header("Action Categories")]
        [Tooltip("Actions requiring high confidence (90%+)")]
        public string[] criticalActions = new string[]
        {
            "engine_disable",
            "fuel_cutoff",
            "brake_override",
            "airbag_disable",
            "transmission_override"
        };

        [Tooltip("Actions requiring standard confidence (70%+)")]
        public string[] standardActions = new string[]
        {
            "component_replace",
            "system_reset",
            "diagnostic_clear",
            "calibration_adjust"
        };

        [Tooltip("Actions that always require user confirmation")]
        public string[] confirmationRequired = new string[]
        {
            "warranty_void",
            "data_wipe",
            "factory_reset"
        };
        #endregion

        #region Private Fields
        private List<SafetyRule> activeRules = new List<SafetyRule>();
        private ConsensusResponse currentConsensus;
        #endregion

        #region Rule Management
        /// <summary>
        /// Load safety rules from consensus data
        /// </summary>
        public void LoadSafetyRules(SafetyRule[] rules)
        {
            activeRules.Clear();
            if (rules != null)
            {
                activeRules.AddRange(rules);
            }
            Debug.Log($"[SafetyRuleEngine] Loaded {activeRules.Count} safety rules");
        }

        /// <summary>
        /// Set current consensus for validation
        /// </summary>
        public void SetCurrentConsensus(ConsensusResponse consensus)
        {
            currentConsensus = consensus;
            Debug.Log($"[SafetyRuleEngine] Consensus set: {consensus.overallConfidence}% confidence, {consensus.safetyZone} zone");
        }

        /// <summary>
        /// Add custom safety rule
        /// </summary>
        public void AddRule(SafetyRule rule)
        {
            activeRules.Add(rule);
            Debug.Log($"[SafetyRuleEngine] Added rule: {rule.name}");
        }

        /// <summary>
        /// Remove safety rule by ID
        /// </summary>
        public void RemoveRule(string ruleId)
        {
            activeRules.RemoveAll(r => r.ruleId == ruleId);
            Debug.Log($"[SafetyRuleEngine] Removed rule: {ruleId}");
        }

        /// <summary>
        /// Clear all safety rules
        /// </summary>
        public void ClearRules()
        {
            activeRules.Clear();
            Debug.Log("[SafetyRuleEngine] All rules cleared");
        }
        #endregion

        #region Validation Methods
        /// <summary>
        /// Validate if action is allowed
        /// </summary>
        public ValidationResult ValidateAction(string actionType)
        {
            if (currentConsensus == null)
            {
                return new ValidationResult
                {
                    isAllowed = false,
                    message = "No consensus available. Cannot validate action.",
                    severity = "critical"
                };
            }

            // Check critical actions
            if (IsCriticalAction(actionType))
            {
                return ValidateCriticalAction(actionType);
            }

            // Check standard actions
            if (IsStandardAction(actionType))
            {
                return ValidateStandardAction(actionType);
            }

            // Check confirmation-required actions
            if (RequiresConfirmation(actionType))
            {
                return new ValidationResult
                {
                    isAllowed = true,
                    requiresConfirmation = true,
                    message = "This action requires user confirmation before proceeding.",
                    severity = "warning"
                };
            }

            // Check active safety rules
            foreach (var rule in activeRules)
            {
                if (EvaluateRuleCondition(rule, actionType))
                {
                    return ApplyRuleAction(rule);
                }
            }

            // Default: allow low-risk actions
            return new ValidationResult
            {
                isAllowed = true,
                message = "Action is safe to proceed.",
                severity = "info"
            };
        }

        /// <summary>
        /// Validate critical action (requires 90%+ confidence)
        /// </summary>
        private ValidationResult ValidateCriticalAction(string actionType)
        {
            if (currentConsensus.overallConfidence < criticalActionThreshold)
            {
                return new ValidationResult
                {
                    isAllowed = false,
                    message = $"CRITICAL ACTION BLOCKED: AI confidence ({currentConsensus.overallConfidence:F1}%) below required threshold ({criticalActionThreshold}%) for '{actionType}'. Seek professional help.",
                    severity = "critical"
                };
            }

            // Check for single AI veto
            if (HasSingleAIVeto())
            {
                return new ValidationResult
                {
                    isAllowed = false,
                    message = "CRITICAL ACTION BLOCKED: One or more AIs have very low confidence. Manual expert review required.",
                    severity = "critical"
                };
            }

            return new ValidationResult
            {
                isAllowed = true,
                message = $"Critical action approved with {currentConsensus.overallConfidence:F1}% confidence.",
                severity = "info"
            };
        }

        /// <summary>
        /// Validate standard action (requires 70%+ confidence)
        /// </summary>
        private ValidationResult ValidateStandardAction(string actionType)
        {
            if (currentConsensus.overallConfidence < standardActionThreshold)
            {
                return new ValidationResult
                {
                    isAllowed = false,
                    message = $"Action blocked: AI confidence ({currentConsensus.overallConfidence:F1}%) below safety threshold ({standardActionThreshold}%).",
                    severity = "warning"
                };
            }

            // Warn if AIs disagree significantly
            float variance = CalculateConfidenceVariance();
            if (variance > maxConfidenceVariance)
            {
                return new ValidationResult
                {
                    isAllowed = true,
                    requiresConfirmation = true,
                    message = $"WARNING: AIs have conflicting opinions (variance: {variance:F1}%). Review all recommendations before proceeding.",
                    severity = "warning"
                };
            }

            return new ValidationResult
            {
                isAllowed = true,
                message = "Action approved.",
                severity = "info"
            };
        }

        /// <summary>
        /// Check if single AI has vetoed (confidence < 40%)
        /// </summary>
        private bool HasSingleAIVeto()
        {
            if (currentConsensus.aiResponses == null) return false;

            foreach (var aiResponse in currentConsensus.aiResponses)
            {
                if (aiResponse.confidence < singleAIVetoThreshold)
                {
                    Debug.LogWarning($"[SafetyRuleEngine] {aiResponse.provider} veto: {aiResponse.confidence}% confidence");
                    return true;
                }
            }

            return false;
        }

        /// <summary>
        /// Calculate confidence variance across AIs
        /// </summary>
        private float CalculateConfidenceVariance()
        {
            if (currentConsensus.aiResponses == null || currentConsensus.aiResponses.Length == 0)
            {
                return 0f;
            }

            float min = currentConsensus.aiResponses.Min(ai => ai.confidence);
            float max = currentConsensus.aiResponses.Max(ai => ai.confidence);

            return max - min;
        }

        /// <summary>
        /// Evaluate if rule condition is met
        /// </summary>
        private bool EvaluateRuleCondition(SafetyRule rule, string actionType)
        {
            // Simple condition parser (extend for complex logic)
            string condition = rule.condition.ToLower();

            // Check confidence thresholds
            if (condition.Contains("confidence <"))
            {
                int thresholdIndex = condition.IndexOf("confidence <") + 12;
                string remainingStr = condition.Substring(thresholdIndex).Trim();
                int endIndex = 0;
                while (endIndex < remainingStr.Length && (char.IsDigit(remainingStr[endIndex]) || remainingStr[endIndex] == '.'))
                {
                    endIndex++;
                }
                if (endIndex > 0 && float.TryParse(remainingStr.Substring(0, endIndex), out float threshold))
                {
                    if (currentConsensus.overallConfidence < threshold)
                    {
                        return true;
                    }
                }
            }

            // Check action type
            if (condition.Contains(actionType.ToLower()))
            {
                return true;
            }

            // Check safety zone
            if (condition.Contains($"safetyzone == '{currentConsensus.safetyZone.ToLower()}'"))
            {
                return true;
            }

            return false;
        }

        /// <summary>
        /// Apply rule action (block/warn/confirm)
        /// </summary>
        private ValidationResult ApplyRuleAction(SafetyRule rule)
        {
            bool isAllowed = rule.action != "block";
            bool requiresConfirmation = rule.action == "require-confirmation";

            return new ValidationResult
            {
                isAllowed = isAllowed,
                requiresConfirmation = requiresConfirmation,
                message = rule.message,
                severity = rule.severity,
                ruleId = rule.ruleId
            };
        }
        #endregion

        #region Action Category Checks
        /// <summary>
        /// Check if action is critical
        /// </summary>
        private bool IsCriticalAction(string actionType)
        {
            return criticalActions.Contains(actionType.ToLower());
        }

        /// <summary>
        /// Check if action is standard
        /// </summary>
        private bool IsStandardAction(string actionType)
        {
            return standardActions.Contains(actionType.ToLower());
        }

        /// <summary>
        /// Check if action requires confirmation
        /// </summary>
        private bool RequiresConfirmation(string actionType)
        {
            return confirmationRequired.Contains(actionType.ToLower());
        }
        #endregion

        #region Safety Auditing
        /// <summary>
        /// Log safety decision to audit trail
        /// </summary>
        public void LogSafetyDecision(string actionType, ValidationResult result)
        {
            string timestamp = DateTime.UtcNow.ToString("o");
            string logEntry = $"[{timestamp}] Action: {actionType}, Allowed: {result.isAllowed}, Message: {result.message}";
            
            Debug.Log($"[SafetyRuleEngine] {logEntry}");
            
            // TODO: Send to backend for persistent audit logging
            // GameEngineSDK.Instance.LogSafetyEvent(logEntry);
        }

        /// <summary>
        /// Get current safety status summary
        /// </summary>
        public SafetyStatusSummary GetSafetyStatus()
        {
            if (currentConsensus == null)
            {
                return new SafetyStatusSummary
                {
                    overallSafety = "unknown",
                    canPerformCriticalActions = false,
                    canPerformStandardActions = false,
                    warnings = new string[] { "No consensus data available" }
                };
            }

            List<string> warnings = new List<string>();

            // Check for low confidence
            if (currentConsensus.overallConfidence < standardActionThreshold)
            {
                warnings.Add($"Low AI confidence: {currentConsensus.overallConfidence:F1}%");
            }

            // Check for AI disagreement
            float variance = CalculateConfidenceVariance();
            if (variance > maxConfidenceVariance)
            {
                warnings.Add($"AIs disagree significantly (variance: {variance:F1}%)");
            }

            // Check for single AI veto
            if (HasSingleAIVeto())
            {
                warnings.Add("One or more AIs have very low confidence");
            }

            return new SafetyStatusSummary
            {
                overallSafety = currentConsensus.safetyZone,
                canPerformCriticalActions = currentConsensus.overallConfidence >= criticalActionThreshold,
                canPerformStandardActions = currentConsensus.overallConfidence >= standardActionThreshold,
                warnings = warnings.ToArray(),
                confidence = currentConsensus.overallConfidence
            };
        }
        #endregion

        #region Public Utility
        /// <summary>
        /// Get safety zone color
        /// </summary>
        public static Color GetSafetyZoneColor(string zone)
        {
            switch (zone.ToLower())
            {
                case "red":
                    return new Color(1f, 0.23f, 0.19f);
                case "yellow":
                    return new Color(1f, 0.8f, 0f);
                case "green":
                    return new Color(0.2f, 0.78f, 0.35f);
                case "teal":
                    return new Color(0f, 0.78f, 0.75f);
                default:
                    return Color.gray;
            }
        }

        /// <summary>
        /// Get recommended action based on safety zone
        /// </summary>
        public static string GetRecommendedAction(string zone)
        {
            switch (zone.ToLower())
            {
                case "red":
                    return "DO NOT PROCEED. Seek professional help immediately.";
                case "yellow":
                    return "Proceed with caution. Review all AI recommendations.";
                case "green":
                    return "Safe to proceed. Minor risk involved.";
                case "teal":
                    return "Highly confident diagnosis. Safe to proceed.";
                default:
                    return "Unknown safety status.";
            }
        }
        #endregion
    }

    #region Data Structures
    /// <summary>
    /// Result of action validation
    /// </summary>
    [Serializable]
    public class ValidationResult
    {
        public bool isAllowed;
        public bool requiresConfirmation;
        public string message;
        public string severity; // "info", "warning", "critical"
        public string ruleId;
    }

    /// <summary>
    /// Summary of current safety status
    /// </summary>
    [Serializable]
    public class SafetyStatusSummary
    {
        public string overallSafety; // red, yellow, green, teal
        public bool canPerformCriticalActions;
        public bool canPerformStandardActions;
        public string[] warnings;
        public float confidence;
    }
    #endregion
}

// ===== BACKEND VERSION (Node.js) =====
// Copy this to your Node.js project as SafetyRuleEngine.js

/*
class SafetyRuleEngine {
  constructor() {
    this.criticalActionThreshold = 90;
    this.standardActionThreshold = 70;
    this.maxConfidenceVariance = 30;
    this.singleAIVetoThreshold = 40;

    this.criticalActions = [
      'engine_disable',
      'fuel_cutoff',
      'brake_override',
      'airbag_disable',
      'transmission_override'
    ];

    this.standardActions = [
      'component_replace',
      'system_reset',
      'diagnostic_clear',
      'calibration_adjust'
    ];
  }

  validateAction(actionType, consensus) {
    if (!consensus) {
      return {
        isAllowed: false,
        message: 'No consensus available',
        severity: 'critical'
      };
    }

    if (this.criticalActions.includes(actionType)) {
      return this.validateCriticalAction(actionType, consensus);
    }

    if (this.standardActions.includes(actionType)) {
      return this.validateStandardAction(actionType, consensus);
    }

    return {
      isAllowed: true,
      message: 'Action is safe to proceed',
      severity: 'info'
    };
  }

  validateCriticalAction(actionType, consensus) {
    if (consensus.overallConfidence < this.criticalActionThreshold) {
      return {
        isAllowed: false,
        message: `CRITICAL ACTION BLOCKED: AI confidence (${consensus.overallConfidence}%) below threshold (${this.criticalActionThreshold}%)`,
        severity: 'critical'
      };
    }

    if (this.hasSingleAIVeto(consensus.aiResponses)) {
      return {
        isAllowed: false,
        message: 'CRITICAL ACTION BLOCKED: Single AI veto detected',
        severity: 'critical'
      };
    }

    return {
      isAllowed: true,
      message: `Critical action approved with ${consensus.overallConfidence}% confidence`,
      severity: 'info'
    };
  }

  validateStandardAction(actionType, consensus) {
    if (consensus.overallConfidence < this.standardActionThreshold) {
      return {
        isAllowed: false,
        message: `Action blocked: confidence below ${this.standardActionThreshold}%`,
        severity: 'warning'
      };
    }

    return {
      isAllowed: true,
      message: 'Action approved',
      severity: 'info'
    };
  }

  hasSingleAIVeto(aiResponses) {
    return aiResponses.some(ai => ai.confidence < this.singleAIVetoThreshold);
  }
}

module.exports = SafetyRuleEngine;
*/
