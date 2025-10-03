"use client";

import { useState, useEffect, useRef } from "react";
import { MonologueParameters } from "@/lib/sysex/decoder";
import { Knob } from "./ui/knob";
import { Slider } from "./ui/slider";

interface MonologueEditorProps {
  parameters: MonologueParameters;
  onParametersChange: (parameters: MonologueParameters) => void;
  className?: string;
}

// Wave type options based on Korg Monologue MIDI spec
const VCO1_WAVE_TYPES = ["SQR", "TRI", "SAW"];
const VCO2_WAVE_TYPES = ["NOISE", "TRI", "SAW"];
const LFO_WAVE_TYPES = ["SQR", "TRI", "SAW"];

// Envelope types
const ENVELOPE_TYPES = ["GATE", "A/G/D", "A/D"];

// Target options for EG and LFO
const EG_TARGET_TYPES = ["CUTOFF", "PITCH 2", "PITCH"];
const LFO_TARGET_TYPES = ["CUTOFF", "SHAPE", "PITCH"];

// LFO modes
const LFO_MODES = ["1-SHOT", "SLOW", "FAST"];

// VCO2 sync/ring options
const SYNC_RING_OPTIONS = ["RING", "OFF", "SYNC"];

// Octave options
const OCTAVE_OPTIONS = ["16'", "8'", "4'", "2'"];

export function MonologueEditor({ parameters, onParametersChange, className = "" }: MonologueEditorProps) {
  const updateParameter = (path: string, value: any) => {
    const updated = { ...parameters };
    const pathParts = path.split(".");
    let current: any = updated;

    // Navigate to the parent object
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]]) {
        current[pathParts[i]] = {};
      }
      current = current[pathParts[i]];
    }

    // Set the final value
    current[pathParts[pathParts.length - 1]] = value;

    onParametersChange(updated);
  };

  const getSafeValue = (path: string, fallback: any = 0): any => {
    const pathParts = path.split(".");
    let current: any = parameters;

    for (const part of pathParts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        return fallback;
      }
    }

    return current ?? fallback;
  };

  if (!parameters.isValid) {
    return (
      <div className={`p-4 border rounded-lg bg-red-50 ${className}`}>
        <h2 className="text-lg font-semibold text-red-700 mb-2">Invalid Parameters</h2>
        <p className="text-red-600">{parameters.error || "Parameters are not valid"}</p>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-[1200px] mx-auto ${className}`} style={{ height: '900px' }}>
      {/* Patch Name Header - Compact */}
      <div className="p-2 border rounded mb-3 text-center">
        <h2 className="text-lg font-semibold">Patch: {parameters.patchName}</h2>
      </div>

      {/* Main Grid - 6 Columns */}
      <div className="grid grid-cols-6 gap-2 h-[calc(100%-60px)]">
        
        {/* Column 1: VCO1 */}
        <div className="space-y-2">
          <div className="p-2 border rounded">
            <h3 className="text-xs font-semibold mb-2 text-center">VCO 1</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Wave</label>
                <select
                  value={getSafeValue("oscillators.vco1.wave", 0)}
                  onChange={(e) => updateParameter("oscillators.vco1.wave", parseInt(e.target.value))}
                  className="w-full p-1 border rounded text-xs"
                >
                  {VCO1_WAVE_TYPES.map((wave, idx) => (
                    <option key={idx} value={idx}>{wave}</option>
                  ))}
                </select>
              </div>
              <Knob
                value={getSafeValue("oscillators.vco1.shape", 0)}
                onChange={(value) => updateParameter("oscillators.vco1.shape", value)}
                min={0}
                max={1023}
                label="Shape"
                size={50}
              />
              <Knob
                value={getSafeValue("oscillators.vco1.level", 0)}
                onChange={(value) => updateParameter("oscillators.vco1.level", value)}
                min={0}
                max={1023}
                label="Level"
                size={50}
              />
            </div>
          </div>
        </div>

        {/* Column 2: VCO2 */}
        <div className="space-y-2">
          <div className="p-2 border rounded">
            <h3 className="text-xs font-semibold mb-2 text-center">VCO 2</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Wave</label>
                <select
                  value={getSafeValue("oscillators.vco2.wave", 0)}
                  onChange={(e) => updateParameter("oscillators.vco2.wave", parseInt(e.target.value))}
                  className="w-full p-1 border rounded text-xs"
                >
                  {VCO2_WAVE_TYPES.map((wave, idx) => (
                    <option key={idx} value={idx}>{wave}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Octave</label>
                <select
                  value={getSafeValue("oscillators.vco2.octave", 0)}
                  onChange={(e) => updateParameter("oscillators.vco2.octave", parseInt(e.target.value))}
                  className="w-full p-1 border rounded text-xs"
                >
                  {OCTAVE_OPTIONS.map((octave, idx) => (
                    <option key={idx} value={idx}>{octave}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Sync</label>
                <select
                  value={getSafeValue("oscillators.vco2.sync", 0)}
                  onChange={(e) => updateParameter("oscillators.vco2.sync", parseInt(e.target.value))}
                  className="w-full p-1 border rounded text-xs"
                >
                  {SYNC_RING_OPTIONS.map((sync, idx) => (
                    <option key={idx} value={idx}>{sync}</option>
                  ))}
                </select>
              </div>
              <Knob
                value={getSafeValue("oscillators.vco2.shape", 0)}
                onChange={(value) => updateParameter("oscillators.vco2.shape", value)}
                min={0}
                max={1023}
                label="Shape"
                size={45}
              />
              <Knob
                value={getSafeValue("oscillators.vco2.level", 0)}
                onChange={(value) => updateParameter("oscillators.vco2.level", value)}
                min={0}
                max={1023}
                label="Level"
                size={45}
              />
              <Knob
                value={getSafeValue("oscillators.vco2.pitch", 0)}
                onChange={(value) => updateParameter("oscillators.vco2.pitch", value)}
                min={-512}
                max={511}
                label="Pitch"
                size={45}
              />
            </div>
          </div>
        </div>

        {/* Column 3: Drive & Filter */}
        <div className="space-y-2">
          {/* Drive */}
          <div className="p-2 border rounded">
            <h3 className="text-xs font-semibold mb-2 text-center">Drive</h3>
            <div className="flex justify-center">
              <Knob
                value={getSafeValue("drive", 0)}
                onChange={(value) => updateParameter("drive", value)}
                min={0}
                max={1023}
                label="Drive"
                size={60}
              />
            </div>
          </div>

          {/* Filter */}
          <div className="p-2 border rounded">
            <h3 className="text-xs font-semibold mb-2 text-center">Filter</h3>
            <div className="space-y-2">
              <Knob
                value={getSafeValue("filter.cutoff", 0)}
                onChange={(value) => updateParameter("filter.cutoff", value)}
                min={0}
                max={1023}
                label="Cutoff"
                size={60}
              />
              <Knob
                value={getSafeValue("filter.resonance", 0)}
                onChange={(value) => updateParameter("filter.resonance", value)}
                min={0}
                max={1023}
                label="Resonance"
                size={60}
              />
            </div>
          </div>
        </div>

        {/* Column 4: Envelope */}
        <div className="space-y-2">
          <div className="p-2 border rounded h-full">
            <h3 className="text-xs font-semibold mb-2 text-center">Envelope</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                <select
                  value={getSafeValue("envelope.type", 0)}
                  onChange={(e) => updateParameter("envelope.type", parseInt(e.target.value))}
                  className="w-full p-1 border rounded text-xs"
                >
                  {ENVELOPE_TYPES.map((type, idx) => (
                    <option key={idx} value={idx}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Target</label>
                <select
                  value={getSafeValue("envelope.target", 0)}
                  onChange={(e) => updateParameter("envelope.target", parseInt(e.target.value))}
                  className="w-full p-1 border rounded text-xs"
                >
                  {EG_TARGET_TYPES.map((target, idx) => (
                    <option key={idx} value={idx}>{target}</option>
                  ))}
                </select>
              </div>
              <Knob
                value={getSafeValue("envelope.attack", 0)}
                onChange={(value) => updateParameter("envelope.attack", value)}
                min={0}
                max={1023}
                label="Attack"
                size={50}
              />
              <Knob
                value={getSafeValue("envelope.decay", 0)}
                onChange={(value) => updateParameter("envelope.decay", value)}
                min={0}
                max={1023}
                label="Decay"
                size={50}
              />
              <Knob
                value={getSafeValue("envelope.intensity", 0)}
                onChange={(value) => updateParameter("envelope.intensity", value)}
                min={-512}
                max={511}
                label="Intensity"
                size={50}
              />
            </div>
          </div>
        </div>

        {/* Column 5: LFO */}
        <div className="space-y-2">
          <div className="p-2 border rounded h-full">
            <h3 className="text-xs font-semibold mb-2 text-center">LFO</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Wave</label>
                <select
                  value={getSafeValue("lfo.wave", 0)}
                  onChange={(e) => updateParameter("lfo.wave", parseInt(e.target.value))}
                  className="w-full p-1 border rounded text-xs"
                >
                  {LFO_WAVE_TYPES.map((wave, idx) => (
                    <option key={idx} value={idx}>{wave}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Mode</label>
                <select
                  value={getSafeValue("lfo.mode", 0)}
                  onChange={(e) => updateParameter("lfo.mode", parseInt(e.target.value))}
                  className="w-full p-1 border rounded text-xs"
                >
                  {LFO_MODES.map((mode, idx) => (
                    <option key={idx} value={idx}>{mode}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Target</label>
                <select
                  value={getSafeValue("lfo.target", 0)}
                  onChange={(e) => updateParameter("lfo.target", parseInt(e.target.value))}
                  className="w-full p-1 border rounded text-xs"
                >
                  {LFO_TARGET_TYPES.map((target, idx) => (
                    <option key={idx} value={idx}>{target}</option>
                  ))}
                </select>
              </div>
              <Knob
                value={getSafeValue("lfo.rate", 0)}
                onChange={(value) => updateParameter("lfo.rate", value)}
                min={0}
                max={1023}
                label="Rate"
                size={50}
              />
              <Knob
                value={getSafeValue("lfo.intensity", 0)}
                onChange={(value) => updateParameter("lfo.intensity", value)}
                min={0}
                max={1023}
                label="Intensity"
                size={50}
              />
            </div>
          </div>
        </div>

        {/* Column 6: AMP & Misc */}
        <div className="space-y-2">
          {/* AMP */}
          <div className="p-2 border rounded">
            <h3 className="text-xs font-semibold mb-2 text-center">AMP</h3>
            <div className="space-y-2">
              <Knob
                value={getSafeValue("amp.attack", 0)}
                onChange={(value) => updateParameter("amp.attack", value)}
                min={0}
                max={1023}
                label="Attack"
                size={45}
              />
              <Knob
                value={getSafeValue("amp.decay", 0)}
                onChange={(value) => updateParameter("amp.decay", value)}
                min={0}
                max={1023}
                label="Decay"
                size={45}
              />
            </div>
          </div>

          {/* Misc */}
          <div className="p-2 border rounded">
            <h3 className="text-xs font-semibold mb-2 text-center">Misc</h3>
            <div className="space-y-2">
              <Knob
                value={getSafeValue("misc.cutoffKeyTrack", 0)}
                onChange={(value) => updateParameter("misc.cutoffKeyTrack", value)}
                min={0}
                max={3}
                label="Key Track"
                size={40}
              />
              <Knob
                value={getSafeValue("misc.portamentTime", 0)}
                onChange={(value) => updateParameter("misc.portamentTime", value)}
                min={0}
                max={127}
                label="Portamento"
                size={40}
              />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-600">BPM Sync</label>
                  <input
                    type="checkbox"
                    checked={getSafeValue("misc.bpmSync", false)}
                    onChange={(e) => updateParameter("misc.bpmSync", e.target.checked)}
                    className="w-3 h-3"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-600">Portamento</label>
                  <input
                    type="checkbox"
                    checked={getSafeValue("misc.portamentMode", false)}
                    onChange={(e) => updateParameter("misc.portamentMode", e.target.checked)}
                    className="w-3 h-3"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
