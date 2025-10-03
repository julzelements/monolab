/**
 * MIDI Debug Component
 *
 * Provides debugging tools for MIDI integration issues:
 * - Memory usage monitoring
 * - MIDI message throttling
 * - Feedback loop detection
 * - Performance metrics
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { SimpleMIDIManager } from "@/utils/simple-midi";

interface MidiDebugProps {
  enabled?: boolean;
  maxMessages?: number;
}

interface DebugMessage {
  timestamp: number;
  type: "incoming" | "outgoing" | "error" | "warning";
  message: string;
  data?: any;
}

export function MidiDebugPanel({ enabled = false, maxMessages = 100 }: MidiDebugProps) {
  const [messages, setMessages] = useState<DebugMessage[]>([]);
  const [memoryUsage, setMemoryUsage] = useState<any>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const midiManager = SimpleMIDIManager.getInstance();
  const messageCountRef = useRef(0);
  const lastMessageTime = useRef(0);

  // Monitor memory usage
  useEffect(() => {
    if (!enabled) return;

    const updateMemoryUsage = () => {
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        setMemoryUsage({
          usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
        });
      }
    };

    const interval = setInterval(updateMemoryUsage, 1000);
    updateMemoryUsage();

    return () => clearInterval(interval);
  }, [enabled]);

  // Add debug message
  const addMessage = (type: DebugMessage["type"], message: string, data?: any) => {
    if (!enabled) return;

    const now = Date.now();
    messageCountRef.current++;

    // Detect rapid messages (potential feedback loop)
    if (now - lastMessageTime.current < 10) {
      console.warn("🚨 Rapid MIDI messages detected - possible feedback loop!");
    }
    lastMessageTime.current = now;

    setMessages((prev) => {
      const newMessages = [
        ...prev,
        {
          timestamp: now,
          type,
          message,
          data,
        },
      ];
      // Keep only the last N messages to prevent memory buildup
      return newMessages.slice(-maxMessages);
    });
  };

  // Enable/disable monitoring
  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      midiManager.setDebugMode(true, false);
      addMessage("warning", "Debug monitoring enabled");
    } else {
      midiManager.setDebugMode(false, false);
      addMessage("warning", "Debug monitoring disabled");
    }
  };

  // Clear messages
  const clearMessages = () => {
    setMessages([]);
    messageCountRef.current = 0;
  };

  // Force garbage collection (if available)
  const forceGC = () => {
    if ("gc" in window) {
      (window as any).gc();
      addMessage("warning", "Forced garbage collection");
    } else {
      addMessage("error", "Garbage collection not available");
    }
  };

  if (!enabled) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800">MIDI Debug Panel is disabled. Set enabled=true to activate.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 text-gray-100 rounded-lg font-mono text-xs">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">🐛 MIDI Debug Panel</h3>
        <div className="flex gap-2">
          <button
            onClick={toggleMonitoring}
            className={`px-3 py-1 rounded ${
              isMonitoring ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isMonitoring ? "⏹️ Stop" : "▶️ Start"}
          </button>
          <button onClick={clearMessages} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded">
            🗑️ Clear
          </button>
          <button onClick={forceGC} className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded">
            🧹 GC
          </button>
        </div>
      </div>

      {/* Memory Usage */}
      {memoryUsage && (
        <div className="mb-4 p-2 bg-gray-800 rounded">
          <h4 className="font-semibold mb-2">Memory Usage (MB)</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-blue-400">Used</div>
              <div className={memoryUsage.usedJSHeapSize > 100 ? "text-red-400" : "text-green-400"}>
                {memoryUsage.usedJSHeapSize}
              </div>
            </div>
            <div>
              <div className="text-blue-400">Total</div>
              <div>{memoryUsage.totalJSHeapSize}</div>
            </div>
            <div>
              <div className="text-blue-400">Limit</div>
              <div>{memoryUsage.jsHeapSizeLimit}</div>
            </div>
          </div>
        </div>
      )}

      {/* Message Stats */}
      <div className="mb-4 p-2 bg-gray-800 rounded">
        <h4 className="font-semibold mb-2">Message Stats</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>Total Messages: {messageCountRef.current}</div>
          <div>Displayed: {messages.length}</div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto bg-black p-2 rounded">
        {messages.length === 0 ? (
          <div className="text-gray-500">No debug messages yet...</div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`mb-1 ${getMessageColor(msg.type)}`}>
              <span className="text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              <span className="ml-2">{getMessageIcon(msg.type)}</span>
              <span className="ml-1">{msg.message}</span>
              {msg.data && <div className="ml-4 text-gray-400 text-xs">{JSON.stringify(msg.data, null, 2)}</div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function getMessageColor(type: DebugMessage["type"]): string {
  switch (type) {
    case "incoming":
      return "text-blue-400";
    case "outgoing":
      return "text-green-400";
    case "error":
      return "text-red-400";
    case "warning":
      return "text-yellow-400";
    default:
      return "text-gray-300";
  }
}

function getMessageIcon(type: DebugMessage["type"]): string {
  switch (type) {
    case "incoming":
      return "📥";
    case "outgoing":
      return "📤";
    case "error":
      return "❌";
    case "warning":
      return "⚠️";
    default:
      return "📋";
  }
}
