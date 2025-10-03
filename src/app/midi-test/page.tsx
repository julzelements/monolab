/**
 * Simple MIDI Event Test Page
 *
 * Minimal test to check for event dropping without complex UI
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { SimpleMIDIManager } from "@/utils/simple-midi";

export default function MidiEventTestPage() {
  const [lastEvent, setLastEvent] = useState<any>(null);
  const [eventCount, setEventCount] = useState(0);
  const [droppedCount, setDroppedCount] = useState(0);
  const eventCountRef = useRef(0);
  const lastEventTimeRef = useRef(0);
  const midiManager = SimpleMIDIManager.getInstance();

  useEffect(() => {
    console.log("🧪 Initializing minimal MIDI event test...");

    const initMIDI = async () => {
      const success = await midiManager.initialize();
      if (success) {
        console.log("✅ MIDI initialized for event test");
        midiManager.setDebugMode(true, false);
      }
    };

    initMIDI();

    // Minimal event handler - just count and log
    const handleMidiEvent = (event: any) => {
      const now = Date.now();
      eventCountRef.current++;

      // Check for potential drops (gaps > 100ms between rapid events)
      if (lastEventTimeRef.current > 0 && now - lastEventTimeRef.current > 100) {
        // Could be a natural pause or potential drop
        console.log(`⏱️ Gap detected: ${now - lastEventTimeRef.current}ms between events`);
      }

      lastEventTimeRef.current = now;

      setLastEvent({
        ...event,
        receivedAt: now,
        count: eventCountRef.current,
      });
      setEventCount(eventCountRef.current);

      console.log(`📥 Event #${eventCountRef.current}:`, event);
    };

    midiManager.on("monologueParameterChange", handleMidiEvent);

    return () => {
      midiManager.off("monologueParameterChange", handleMidiEvent);
    };
  }, [midiManager]);

  const resetCounters = () => {
    setEventCount(0);
    setDroppedCount(0);
    eventCountRef.current = 0;
    lastEventTimeRef.current = 0;
    setLastEvent(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🧪 MIDI Event Drop Test</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Stats */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📊 Event Statistics</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Events:</span>
                <span className="font-mono text-lg">{eventCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Potential Drops:</span>
                <span className="font-mono text-lg text-red-600">{droppedCount}</span>
              </div>
              <button
                onClick={resetCounters}
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Reset Counters
              </button>
            </div>
          </div>

          {/* Last Event */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📥 Last Event</h2>
            {lastEvent ? (
              <div className="space-y-1 text-sm font-mono">
                <div>
                  <strong>Parameter:</strong> {lastEvent.parameter}
                </div>
                <div>
                  <strong>Value:</strong> {lastEvent.value}
                </div>
                <div>
                  <strong>CC:</strong> {lastEvent.ccNumber}
                </div>
                <div>
                  <strong>MIDI Value:</strong> {lastEvent.midiValue}
                </div>
                <div>
                  <strong>Count:</strong> #{lastEvent.count}
                </div>
                <div>
                  <strong>Time:</strong> {new Date(lastEvent.receivedAt).toLocaleTimeString()}
                </div>
              </div>
            ) : (
              <div className="text-gray-500">No events received yet</div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-3">🎯 Test Instructions</h2>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>
              <strong>To test for event dropping:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Open Chrome DevTools (F12) and watch the console</li>
              <li>Connect your Korg Monologue via MIDI</li>
              <li>
                Turn a knob/slider <strong>slowly and steadily</strong>
              </li>
              <li>Watch the event counter and console logs</li>
              <li>Look for gaps or missing events in the sequence</li>
            </ol>
            <p>
              <strong>Expected behavior:</strong> You should see smooth, continuous event flow with no large gaps when
              turning knobs steadily.
            </p>
          </div>
        </div>

        {/* Raw Console Output */}
        <div className="mt-6 bg-gray-900 text-green-400 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">📋 Console Output</h3>
          <p className="text-sm">
            Check the browser console (F12) for detailed MIDI event logs and timing information.
          </p>
        </div>
      </div>
    </div>
  );
}
