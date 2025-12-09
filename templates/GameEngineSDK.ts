/**
 * GameEngineSDK.ts
 * 
 * Client-side Unity C# wrapper for RideWire AI Hub backend communication.
 * Handles WebSocket connections, REST API calls, and data serialization.
 * 
 * USAGE:
 * 1. Copy this file to Unity project: Assets/Scripts/GameEngineSDK.cs
 * 2. Attach to GameObject in scene (e.g., GameManager)
 * 3. Configure backendURL in Unity Inspector
 * 4. Call methods from other scripts via GameEngineSDK.Instance
 */

using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using NativeWebSocket; // Install: https://github.com/endel/NativeWebSocket

namespace RideWire.GameEngine
{
    /// <summary>
    /// Singleton SDK for communicating with RideWire backend
    /// </summary>
    public class GameEngineSDK : MonoBehaviour
    {
        #region Singleton Pattern
        public static GameEngineSDK Instance { get; private set; }

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
        [Header("Backend Configuration")]
        [Tooltip("WebSocket URL for real-time communication")]
        public string backendWebSocketURL = "ws://localhost:3000/ws/game";

        [Tooltip("REST API base URL for initial queries")]
        public string backendRestURL = "http://localhost:3000/api/game";

        [Tooltip("JWT token for authentication (get from login)")]
        public string authToken = "";

        [Header("Connection Settings")]
        [Tooltip("Auto-reconnect if WebSocket drops")]
        public bool autoReconnect = true;

        [Tooltip("Max reconnection attempts")]
        public int maxReconnectAttempts = 5;

        [Tooltip("Reconnect delay in seconds")]
        public float reconnectDelay = 3f;
        #endregion

        #region Private Fields
        private WebSocket websocket;
        private bool isConnected = false;
        private int reconnectAttempts = 0;
        private Dictionary<string, Action<string>> messageHandlers = new Dictionary<string, Action<string>>();
        #endregion

        #region Events
        /// <summary>
        /// Fired when WebSocket connection is established
        /// </summary>
        public event Action OnConnected;

        /// <summary>
        /// Fired when WebSocket connection is lost
        /// </summary>
        public event Action OnDisconnected;

        /// <summary>
        /// Fired when consensus update received from backend
        /// </summary>
        public event Action<ConsensusResponse> OnConsensusReceived;

        /// <summary>
        /// Fired when partial AI response received (real-time streaming)
        /// </summary>
        public event Action<AIPartialResponse> OnPartialAIResponse;

        /// <summary>
        /// Fired when game command received from backend
        /// </summary>
        public event Action<GameCommand> OnGameCommandReceived;
        #endregion

        #region Unity Lifecycle
        private void Start()
        {
            ConnectWebSocket();
        }

        private void Update()
        {
            #if !UNITY_WEBGL || UNITY_EDITOR
            // Dispatch WebSocket messages (not needed in WebGL)
            websocket?.DispatchMessageQueue();
            #endif
        }

        private void OnDestroy()
        {
            DisconnectWebSocket();
        }

        private void OnApplicationQuit()
        {
            DisconnectWebSocket();
        }
        #endregion

        #region WebSocket Connection
        /// <summary>
        /// Establish WebSocket connection to backend
        /// </summary>
        public async void ConnectWebSocket()
        {
            try
            {
                websocket = new WebSocket(backendWebSocketURL);

                websocket.OnOpen += () =>
                {
                    Debug.Log("[GameEngineSDK] WebSocket Connected!");
                    isConnected = true;
                    reconnectAttempts = 0;
                    OnConnected?.Invoke();
                };

                websocket.OnError += (error) =>
                {
                    Debug.LogError($"[GameEngineSDK] WebSocket Error: {error}");
                };

                websocket.OnClose += (closeCode) =>
                {
                    Debug.LogWarning($"[GameEngineSDK] WebSocket Closed: {closeCode}");
                    isConnected = false;
                    OnDisconnected?.Invoke();

                    if (autoReconnect && reconnectAttempts < maxReconnectAttempts)
                    {
                        StartCoroutine(ReconnectAfterDelay());
                    }
                };

                websocket.OnMessage += (bytes) =>
                {
                    string message = System.Text.Encoding.UTF8.GetString(bytes);
                    HandleWebSocketMessage(message);
                };

                await websocket.Connect();
            }
            catch (Exception ex)
            {
                Debug.LogError($"[GameEngineSDK] Connection failed: {ex.Message}");
                if (autoReconnect)
                {
                    StartCoroutine(ReconnectAfterDelay());
                }
            }
        }

        /// <summary>
        /// Disconnect WebSocket
        /// </summary>
        public async void DisconnectWebSocket()
        {
            if (websocket != null)
            {
                await websocket.Close();
                websocket = null;
                isConnected = false;
            }
        }

        /// <summary>
        /// Reconnect after delay
        /// </summary>
        private IEnumerator ReconnectAfterDelay()
        {
            reconnectAttempts++;
            Debug.Log($"[GameEngineSDK] Reconnecting in {reconnectDelay}s (attempt {reconnectAttempts}/{maxReconnectAttempts})");
            yield return new WaitForSeconds(reconnectDelay);
            ConnectWebSocket();
        }
        #endregion

        #region Message Handling
        /// <summary>
        /// Handle incoming WebSocket messages
        /// </summary>
        private void HandleWebSocketMessage(string message)
        {
            #if UNITY_EDITOR
            Debug.Log($"[GameEngineSDK] Received: {message}");
            #else
            Debug.Log($"[GameEngineSDK] Received message ({message.Length} bytes)");
            #endif

            try
            {
                // Parse message type
                var messageData = JsonUtility.FromJson<WebSocketMessage>(message);

                switch (messageData.type)
                {
                    case "consensus-update":
                        var consensus = JsonUtility.FromJson<ConsensusResponse>(messageData.data);
                        OnConsensusReceived?.Invoke(consensus);
                        break;

                    case "ai-response-partial":
                        var partial = JsonUtility.FromJson<AIPartialResponse>(messageData.data);
                        OnPartialAIResponse?.Invoke(partial);
                        break;

                    case "game-command":
                        var command = JsonUtility.FromJson<GameCommand>(messageData.data);
                        OnGameCommandReceived?.Invoke(command);
                        break;

                    default:
                        Debug.LogWarning($"[GameEngineSDK] Unknown message type: {messageData.type}");
                        break;
                }
            }
            catch (Exception ex)
            {
                Debug.LogError($"[GameEngineSDK] Failed to parse message: {ex.Message}");
            }
        }

        /// <summary>
        /// Send WebSocket message to backend
        /// </summary>
        public async void SendWebSocketMessage(string type, string data)
        {
            if (!isConnected)
            {
                Debug.LogError("[GameEngineSDK] Cannot send message: WebSocket not connected");
                return;
            }

            var message = new WebSocketMessage
            {
                type = type,
                data = data
            };

            string json = JsonUtility.ToJson(message);
            await websocket.SendText(json);
            Debug.Log($"[GameEngineSDK] Sent: {json}");
        }
        #endregion

        #region API Methods
        /// <summary>
        /// Submit diagnostic query to backend
        /// </summary>
        public void SubmitDiagnosticQuery(QueryRequest request)
        {
            if (isConnected)
            {
                // Use WebSocket for real-time streaming
                string json = JsonUtility.ToJson(request);
                SendWebSocketMessage("diagnostic-query", json);
            }
            else
            {
                // Fallback to REST API
                StartCoroutine(SubmitQueryREST(request));
            }
        }

        /// <summary>
        /// Submit query via REST API (fallback)
        /// </summary>
        private IEnumerator SubmitQueryREST(QueryRequest request)
        {
            string url = $"{backendRestURL}/query";
            string json = JsonUtility.ToJson(request);

            using (UnityWebRequest webRequest = UnityWebRequest.Post(url, json, "application/json"))
            {
                webRequest.SetRequestHeader("Authorization", $"Bearer {authToken}");

                yield return webRequest.SendWebRequest();

                if (webRequest.result == UnityWebRequest.Result.Success)
                {
                    string response = webRequest.downloadHandler.text;
                    var consensus = JsonUtility.FromJson<ConsensusResponse>(response);
                    OnConsensusReceived?.Invoke(consensus);
                }
                else
                {
                    Debug.LogError($"[GameEngineSDK] REST API Error: {webRequest.error}");
                }
            }
        }

        /// <summary>
        /// Validate action with safety rules
        /// </summary>
        public void ValidateAction(string actionType, Action<bool, string> callback)
        {
            StartCoroutine(ValidateActionREST(actionType, callback));
        }

        /// <summary>
        /// Validate action via REST API
        /// </summary>
        private IEnumerator ValidateActionREST(string actionType, Action<bool, string> callback)
        {
            string url = $"{backendRestURL}/validate-action";
            var data = new { actionType = actionType };
            string json = JsonUtility.ToJson(data);

            using (UnityWebRequest webRequest = UnityWebRequest.Post(url, json, "application/json"))
            {
                webRequest.SetRequestHeader("Authorization", $"Bearer {authToken}");

                yield return webRequest.SendWebRequest();

                if (webRequest.result == UnityWebRequest.Result.Success)
                {
                    string response = webRequest.downloadHandler.text;
                    var result = JsonUtility.FromJson<ValidationResult>(response);
                    callback?.Invoke(result.isAllowed, result.message);
                }
                else
                {
                    callback?.Invoke(false, "Validation failed: " + webRequest.error);
                }
            }
        }

        /// <summary>
        /// Get AR overlays for specific vehicle
        /// </summary>
        public void GetAROverlays(string vehicleId, Action<AROverlay[]> callback)
        {
            StartCoroutine(GetAROverlaysREST(vehicleId, callback));
        }

        /// <summary>
        /// Get AR overlays via REST API
        /// </summary>
        private IEnumerator GetAROverlaysREST(string vehicleId, Action<AROverlay[]> callback)
        {
            string url = $"{backendRestURL}/overlays/{vehicleId}";

            using (UnityWebRequest webRequest = UnityWebRequest.Get(url))
            {
                webRequest.SetRequestHeader("Authorization", $"Bearer {authToken}");

                yield return webRequest.SendWebRequest();

                if (webRequest.result == UnityWebRequest.Result.Success)
                {
                    string response = webRequest.downloadHandler.text;
                    var wrapper = JsonUtility.FromJson<AROverlayWrapper>(response);
                    callback?.Invoke(wrapper.overlays);
                }
                else
                {
                    Debug.LogError($"[GameEngineSDK] Failed to get overlays: {webRequest.error}");
                    callback?.Invoke(new AROverlay[0]);
                }
            }
        }
        #endregion

        #region Utility Methods
        /// <summary>
        /// Check if WebSocket is connected
        /// </summary>
        public bool IsConnected()
        {
            return isConnected;
        }

        /// <summary>
        /// Set authentication token
        /// </summary>
        public void SetAuthToken(string token)
        {
            authToken = token;
            Debug.Log("[GameEngineSDK] Auth token updated");
        }
        #endregion
    }

    #region Data Structures
    [Serializable]
    public class WebSocketMessage
    {
        public string type;
        public string data;
    }

    [Serializable]
    public class QueryRequest
    {
        public string queryId;
        public string userId;
        public string vehicleId;
        public string vehicleModel;
        public int vehicleYear;
        public string query;
        public string[] errorCodes;
        public string context;
        public string timestamp;
    }

    [Serializable]
    public class ConsensusResponse
    {
        public string queryId;
        public string query;
        public string timestamp;
        public string consensus;
        public float overallConfidence;
        public AIResponse[] aiResponses;
        public string safetyZone;
        public CostEstimate estimatedCost;
        public string[] relatedCodes;
    }

    [Serializable]
    public class AIResponse
    {
        public string provider;
        public float confidence;
        public string recommendation;
        public string reasoning;
        public float responseTime;
    }

    [Serializable]
    public class AIPartialResponse
    {
        public string provider;
        public string content;
        public float confidence;
    }

    [Serializable]
    public class GameCommand
    {
        public string commandId;
        public string commandType;
        public AROverlay[] arOverlays;
        public HUDPanel hudPanel;
        public GamificationPayload gamification;
        public SafetyRule[] safetyRules;
    }

    [Serializable]
    public class AROverlay
    {
        public string overlayId;
        public string type;
        public string componentId;
        public Vector3Position position;
        public ColorRGBA color;
        public string label;
        public float duration;
        public int priority;
    }

    [Serializable]
    public class Vector3Position
    {
        public float x;
        public float y;
        public float z;

        public Vector3 ToUnityVector3()
        {
            return new Vector3(x, y, z);
        }
    }

    [Serializable]
    public class ColorRGBA
    {
        public int r;
        public int g;
        public int b;
        public float a;

        public Color ToUnityColor()
        {
            return new Color(r / 255f, g / 255f, b / 255f, a);
        }
    }

    [Serializable]
    public class HUDPanel
    {
        public string panelId;
        public string title;
        public string content;
        public string position;
        public string backgroundColor;
        public string visibility;
        public HUDButton[] buttons;
    }

    [Serializable]
    public class HUDButton
    {
        public string label;
        public string action;
        public bool enabled;
    }

    [Serializable]
    public class GamificationPayload
    {
        public string userId;
        public float xpGained;
        public float totalXp;
        public bool levelUp;
        public int newLevel;
        public string[] achievementsUnlocked;
        public MissionProgress missionProgress;
    }

    [Serializable]
    public class MissionProgress
    {
        public string missionId;
        public float progress;
        public bool completed;
    }

    [Serializable]
    public class SafetyRule
    {
        public string ruleId;
        public string name;
        public string condition;
        public string action;
        public string message;
        public string severity;
    }

    [Serializable]
    public class CostEstimate
    {
        public float min;
        public float max;
        public string currency;
    }

    [Serializable]
    public class ValidationResult
    {
        public bool isAllowed;
        public string message;
    }

    [Serializable]
    public class AROverlayWrapper
    {
        public AROverlay[] overlays;
    }
    #endregion
}
