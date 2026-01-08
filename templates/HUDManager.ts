/**
 * HUDManager.ts
 * 
 * Unity C# script for managing HUD panels, UI updates, and user interactions.
 * Displays Multi-AI responses, consensus results, and gamification elements.
 * 
 * USAGE:
 * 1. Copy to Unity project: Assets/Scripts/HUDManager.cs
 * 2. Attach to Canvas GameObject in scene
 * 3. Assign UI elements in Unity Inspector
 * 4. Subscribe to GameEngineSDK events for automatic updates
 */

using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro; // TextMeshPro for better text rendering

namespace RideWire.GameEngine
{
    /// <summary>
    /// Manages all HUD elements and UI updates
    /// </summary>
    public class HUDManager : MonoBehaviour
    {
        #region UI Element References
        [Header("Multi-AI Panel")]
        [Tooltip("Panel showing all 3 AI responses")]
        public GameObject multiAIPanel;

        [Tooltip("ChatGPT response text")]
        public TextMeshProUGUI chatGPTText;

        [Tooltip("ChatGPT confidence bar")]
        public Slider chatGPTConfidenceBar;

        [Tooltip("ChatGPT panel background")]
        public Image chatGPTBackground;

        [Tooltip("Claude response text")]
        public TextMeshProUGUI claudeText;

        [Tooltip("Claude confidence bar")]
        public Slider claudeConfidenceBar;

        [Tooltip("Claude panel background")]
        public Image claudeBackground;

        [Tooltip("Gemini response text")]
        public TextMeshProUGUI geminiText;

        [Tooltip("Gemini confidence bar")]
        public Slider geminiConfidenceBar;

        [Tooltip("Gemini panel background")]
        public Image geminiBackground;

        [Header("Consensus Banner")]
        [Tooltip("Top banner showing final consensus")]
        public GameObject consensusBanner;

        [Tooltip("Consensus text")]
        public TextMeshProUGUI consensusText;

        [Tooltip("Overall confidence display")]
        public TextMeshProUGUI overallConfidenceText;

        [Tooltip("Safety zone indicator")]
        public Image safetyZoneIndicator;

        [Header("Action Buttons")]
        [Tooltip("Button container")]
        public GameObject actionButtonContainer;

        [Tooltip("Button prefab for dynamic creation")]
        public GameObject buttonPrefab;

        [Header("XP & Progression")]
        [Tooltip("XP progress bar")]
        public Slider xpProgressBar;

        [Tooltip("Current level text")]
        public TextMeshProUGUI levelText;

        [Tooltip("XP gain popup")]
        public GameObject xpGainPopup;

        [Tooltip("XP gain amount text")]
        public TextMeshProUGUI xpGainText;

        [Header("Level Up Animation")]
        [Tooltip("Level up panel")]
        public GameObject levelUpPanel;

        [Tooltip("New level text")]
        public TextMeshProUGUI newLevelText;

        [Tooltip("Confetti particle system")]
        public ParticleSystem confettiEffect;

        [Header("Safety Warning")]
        [Tooltip("Warning dialog")]
        public GameObject warningDialog;

        [Tooltip("Warning message text")]
        public TextMeshProUGUI warningMessageText;

        [Tooltip("Warning icon")]
        public Image warningIcon;

        [Header("Loading Indicator")]
        [Tooltip("Loading spinner")]
        public GameObject loadingSpinner;

        [Tooltip("Loading text")]
        public TextMeshProUGUI loadingText;
        #endregion

        #region Colors
        private Color redColor = new Color(1f, 0.23f, 0.19f); // #FF3B30
        private Color yellowColor = new Color(1f, 0.8f, 0f); // #FFCC00
        private Color greenColor = new Color(0.2f, 0.78f, 0.35f); // #34C759
        private Color tealColor = new Color(0f, 0.78f, 0.75f); // #00C7BE
        private Color grayColor = new Color(0.5f, 0.5f, 0.5f);
        #endregion

        #region Private Fields
        private Dictionary<string, Action> buttonActions = new Dictionary<string, Action>();
        private float currentXP = 0;
        private float maxXP = 100;
        private int currentLevel = 1;
        #endregion

        #region Unity Lifecycle
        private void Start()
        {
            // Subscribe to GameEngineSDK events
            if (GameEngineSDK.Instance != null)
            {
                GameEngineSDK.Instance.OnConsensusReceived += HandleConsensusUpdate;
                GameEngineSDK.Instance.OnPartialAIResponse += HandlePartialAIResponse;
                GameEngineSDK.Instance.OnGameCommandReceived += HandleGameCommand;
            }

            // Initialize UI
            HideAllPanels();
            ShowLoadingIndicator("Connecting to backend...");
        }

        private void OnDestroy()
        {
            // Unsubscribe from events
            if (GameEngineSDK.Instance != null)
            {
                GameEngineSDK.Instance.OnConsensusReceived -= HandleConsensusUpdate;
                GameEngineSDK.Instance.OnPartialAIResponse -= HandlePartialAIResponse;
                GameEngineSDK.Instance.OnGameCommandReceived -= HandleGameCommand;
            }
        }
        #endregion

        #region Event Handlers
        /// <summary>
        /// Handle consensus update from backend
        /// </summary>
        private void HandleConsensusUpdate(ConsensusResponse consensus)
        {
            HideLoadingIndicator();
            DisplayConsensus(consensus);
            UpdateSafetyZone(consensus.safetyZone, consensus.overallConfidence);
        }

        /// <summary>
        /// Handle partial AI response (real-time streaming)
        /// </summary>
        private void HandlePartialAIResponse(AIPartialResponse partial)
        {
            UpdateAIPanel(partial.provider, partial.content, partial.confidence);
        }

        /// <summary>
        /// Handle game command from backend
        /// </summary>
        private void HandleGameCommand(GameCommand command)
        {
            switch (command.commandType)
            {
                case "update-hud":
                    if (command.hudPanel != null)
                    {
                        UpdateHUDPanel(command.hudPanel);
                    }
                    break;

                case "update-xp":
                    if (command.gamification != null)
                    {
                        UpdateGamification(command.gamification);
                    }
                    break;

                case "apply-safety-rule":
                    if (command.safetyRules != null && command.safetyRules.Length > 0)
                    {
                        ApplySafetyRules(command.safetyRules);
                    }
                    break;
            }
        }
        #endregion

        #region Display Methods
        /// <summary>
        /// Display full consensus result
        /// </summary>
        public void DisplayConsensus(ConsensusResponse consensus)
        {
            // Show consensus banner
            consensusBanner.SetActive(true);
            consensusText.text = consensus.consensus;
            overallConfidenceText.text = $"{consensus.overallConfidence:F1}%";

            // Update individual AI panels
            foreach (var aiResponse in consensus.aiResponses)
            {
                UpdateAIPanel(aiResponse.provider, aiResponse.recommendation, aiResponse.confidence);
            }

            // Update safety indicator
            UpdateSafetyZone(consensus.safetyZone, consensus.overallConfidence);

            // Show cost estimate if available
            if (consensus.estimatedCost != null)
            {
                string costText = $"\n\nEstimated Cost: ${consensus.estimatedCost.min}-${consensus.estimatedCost.max}";
                consensusText.text += costText;
            }
        }

        /// <summary>
        /// Update individual AI panel with response
        /// </summary>
        public void UpdateAIPanel(string provider, string content, float confidence)
        {
            TextMeshProUGUI textComponent = null;
            Slider confidenceBar = null;
            Image background = null;

            // Select correct panel based on provider
            switch (provider.ToLower())
            {
                case "chatgpt":
                    textComponent = chatGPTText;
                    confidenceBar = chatGPTConfidenceBar;
                    background = chatGPTBackground;
                    break;
                case "claude":
                    textComponent = claudeText;
                    confidenceBar = claudeConfidenceBar;
                    background = claudeBackground;
                    break;
                case "gemini":
                    textComponent = geminiText;
                    confidenceBar = geminiConfidenceBar;
                    background = geminiBackground;
                    break;
                default:
                    Debug.LogWarning($"Unknown AI provider: {provider}");
                    return;
            }

            // Update panel content
            if (textComponent != null)
            {
                textComponent.text = $"<b>{provider}:</b>\n{content}";
                multiAIPanel.SetActive(true);
            }

            // Update confidence bar
            if (confidenceBar != null)
            {
                confidenceBar.value = confidence / 100f;
            }

            // Update background color based on confidence
            if (background != null)
            {
                Color color = GetConfidenceColor(confidence);
                background.color = new Color(color.r, color.g, color.b, 0.3f);
            }
        }

        /// <summary>
        /// Update HUD panel from game command
        /// </summary>
        private void UpdateHUDPanel(HUDPanel panel)
        {
            // Update consensus banner
            consensusText.text = $"<b>{panel.title}</b>\n{panel.content}";
            
            // Set background color
            if (!string.IsNullOrEmpty(panel.backgroundColor))
            {
                safetyZoneIndicator.color = ParseHexColor(panel.backgroundColor);
            }

            // Update buttons
            CreateActionButtons(panel.buttons);
        }

        /// <summary>
        /// Update safety zone indicator
        /// </summary>
        public void UpdateSafetyZone(string zone, float confidence)
        {
            Color color = grayColor;
            
            switch (zone.ToLower())
            {
                case "red":
                    color = redColor;
                    break;
                case "yellow":
                    color = yellowColor;
                    break;
                case "green":
                    color = greenColor;
                    break;
                case "teal":
                    color = tealColor;
                    break;
            }

            safetyZoneIndicator.color = color;
            
            // Add pulsing animation for red zone
            if (zone.ToLower() == "red")
            {
                StartCoroutine(PulseSafetyIndicator());
            }
        }

        /// <summary>
        /// Create action buttons dynamically
        /// </summary>
        private void CreateActionButtons(HUDButton[] buttons)
        {
            // Clear existing buttons
            foreach (Transform child in actionButtonContainer.transform)
            {
                Destroy(child.gameObject);
            }

            // Create new buttons
            foreach (var buttonData in buttons)
            {
                GameObject buttonObj = Instantiate(buttonPrefab, actionButtonContainer.transform);
                Button button = buttonObj.GetComponent<Button>();
                TextMeshProUGUI buttonText = buttonObj.GetComponentInChildren<TextMeshProUGUI>();

                buttonText.text = buttonData.label;
                button.interactable = buttonData.enabled;

                // Add click listener
                string action = buttonData.action;
                button.onClick.AddListener(() => OnActionButtonClicked(action));
            }

            actionButtonContainer.SetActive(true);
        }
        #endregion

        #region Gamification Methods
        /// <summary>
        /// Update gamification elements (XP, level, achievements)
        /// </summary>
        public void UpdateGamification(GamificationPayload gamification)
        {
            // Award XP
            if (gamification.xpGained > 0)
            {
                ShowXPGain(gamification.xpGained);
                currentXP = gamification.totalXp;
                UpdateXPBar();
            }

            // Level up
            if (gamification.levelUp)
            {
                ShowLevelUpAnimation(gamification.newLevel);
                currentLevel = gamification.newLevel;
            }

            // Show achievements
            if (gamification.achievementsUnlocked != null && gamification.achievementsUnlocked.Length > 0)
            {
                foreach (var achievement in gamification.achievementsUnlocked)
                {
                    ShowAchievementUnlocked(achievement);
                }
            }
        }

        /// <summary>
        /// Show XP gain popup
        /// </summary>
        private void ShowXPGain(float xp)
        {
            xpGainPopup.SetActive(true);
            xpGainText.text = $"+{xp:F0} XP";
            StartCoroutine(FadeOutXPGain());
        }

        /// <summary>
        /// Update XP progress bar
        /// </summary>
        private void UpdateXPBar()
        {
            xpProgressBar.value = (currentXP % maxXP) / maxXP;
            levelText.text = $"Level {currentLevel}";
        }

        /// <summary>
        /// Show level up animation
        /// </summary>
        private void ShowLevelUpAnimation(int newLevel)
        {
            levelUpPanel.SetActive(true);
            newLevelText.text = $"LEVEL {newLevel}!";
            
            if (confettiEffect != null)
            {
                confettiEffect.Play();
            }

            StartCoroutine(HideLevelUpAfterDelay(3f));
        }

        /// <summary>
        /// Show achievement unlocked notification
        /// </summary>
        private void ShowAchievementUnlocked(string achievementId)
        {
            Debug.Log($"Achievement Unlocked: {achievementId}");
            // TODO: Implement achievement popup UI
        }
        #endregion

        #region Safety Methods
        /// <summary>
        /// Apply safety rules (block/warn actions)
        /// </summary>
        private void ApplySafetyRules(SafetyRule[] rules)
        {
            foreach (var rule in rules)
            {
                if (rule.action == "block" || rule.action == "warn")
                {
                    ShowWarning(rule.message, rule.severity);
                }
            }
        }

        /// <summary>
        /// Show safety warning dialog
        /// </summary>
        public void ShowWarning(string message, string severity)
        {
            warningDialog.SetActive(true);
            warningMessageText.text = message;

            // Set icon color based on severity
            Color iconColor = yellowColor;
            if (severity == "critical")
            {
                iconColor = redColor;
            }
            warningIcon.color = iconColor;
        }

        /// <summary>
        /// Hide warning dialog
        /// </summary>
        public void HideWarning()
        {
            warningDialog.SetActive(false);
        }
        #endregion

        #region Loading & Utility
        /// <summary>
        /// Show loading indicator
        /// </summary>
        public void ShowLoadingIndicator(string message = "Loading...")
        {
            loadingSpinner.SetActive(true);
            loadingText.text = message;
        }

        /// <summary>
        /// Hide loading indicator
        /// </summary>
        public void HideLoadingIndicator()
        {
            loadingSpinner.SetActive(false);
        }

        /// <summary>
        /// Hide all panels
        /// </summary>
        private void HideAllPanels()
        {
            multiAIPanel.SetActive(false);
            consensusBanner.SetActive(false);
            actionButtonContainer.SetActive(false);
            xpGainPopup.SetActive(false);
            levelUpPanel.SetActive(false);
            warningDialog.SetActive(false);
        }

        /// <summary>
        /// Get confidence-based color
        /// </summary>
        private Color GetConfidenceColor(float confidence)
        {
            if (confidence < 60) return redColor;
            if (confidence < 75) return yellowColor;
            if (confidence < 85) return greenColor;
            return tealColor;
        }

        /// <summary>
        /// Parse hex color code
        /// </summary>
        private Color ParseHexColor(string hex)
        {
            Color color;
            if (ColorUtility.TryParseHtmlString(hex, out color))
            {
                return color;
            }
            return Color.white;
        }
        #endregion

        #region Button Actions
        /// <summary>
        /// Handle action button clicks
        /// </summary>
        private void OnActionButtonClicked(string actionType)
        {
            Debug.Log($"Action button clicked: {actionType}");

            // Validate action with safety rules
            GameEngineSDK.Instance.ValidateAction(actionType, (isAllowed, message) =>
            {
                if (!isAllowed)
                {
                    ShowWarning(message, "warning");
                    return;
                }

                // Execute action
                ExecuteAction(actionType);
            });
        }

        /// <summary>
        /// Execute user action
        /// </summary>
        private void ExecuteAction(string actionType)
        {
            switch (actionType)
            {
                case "view_details":
                    // Open detailed diagnostic view
                    Debug.Log("Opening detailed view...");
                    break;

                case "get_quote":
                    // Navigate to repair quote screen
                    Debug.Log("Getting repair quote...");
                    break;

                case "schedule_service":
                    // Open service scheduling
                    Debug.Log("Scheduling service...");
                    break;

                case "professional_help":
                    // Show nearby mechanics
                    Debug.Log("Finding professional help...");
                    break;

                default:
                    Debug.LogWarning($"Unknown action: {actionType}");
                    break;
            }
        }
        #endregion

        #region Coroutines
        /// <summary>
        /// Fade out XP gain popup
        /// </summary>
        private IEnumerator FadeOutXPGain()
        {
            yield return new WaitForSeconds(2f);
            
            CanvasGroup canvasGroup = xpGainPopup.GetComponent<CanvasGroup>();
            if (canvasGroup == null)
            {
                canvasGroup = xpGainPopup.AddComponent<CanvasGroup>();
            }

            float duration = 1f;
            float elapsed = 0f;

            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                canvasGroup.alpha = 1f - (elapsed / duration);
                yield return null;
            }

            xpGainPopup.SetActive(false);
            canvasGroup.alpha = 1f;
        }

        /// <summary>
        /// Hide level up panel after delay
        /// </summary>
        private IEnumerator HideLevelUpAfterDelay(float delay)
        {
            yield return new WaitForSeconds(delay);
            levelUpPanel.SetActive(false);
        }

        /// <summary>
        /// Pulse safety indicator for critical warnings
        /// </summary>
        private IEnumerator PulseSafetyIndicator()
        {
            float duration = 0.5f;
            float elapsed = 0f;
            Color originalColor = safetyZoneIndicator.color;

            while (elapsed < duration * 3) // Pulse 3 times
            {
                elapsed += Time.deltaTime;
                float scale = Mathf.PingPong(elapsed * 2, 1f);
                safetyZoneIndicator.transform.localScale = Vector3.one * (1f + scale * 0.2f);
                yield return null;
            }

            safetyZoneIndicator.transform.localScale = Vector3.one;
        }
        #endregion

        #region Public API
        /// <summary>
        /// Manually trigger diagnosis query (called from UI button)
        /// </summary>
        public void OnDiagnoseButtonClicked()
        {
            // TODO: Add InputField component reference and get actual user input
            // For now using placeholder - replace with: query = queryInputField.text;
            string query = "P0300 - Random misfire detected"; // Placeholder

            // Create query request
            var request = new QueryRequest
            {
                queryId = Guid.NewGuid().ToString(),
                userId = "user123", // Get from authentication
                vehicleId = "vehicle456",
                query = query,
                timestamp = DateTime.UtcNow.ToString("o")
            };

            // Show loading
            ShowLoadingIndicator("Querying AI experts...");

            // Submit to backend
            GameEngineSDK.Instance.SubmitDiagnosticQuery(request);
        }
        #endregion
    }
}
