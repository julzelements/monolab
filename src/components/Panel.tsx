import { Master } from "@/components/panelSections/Master";
import { VCO1 } from "@/components/panelSections/VCO1";
import { Mixer } from "@/components/panelSections/Mixer";
import { Filter } from "@/components/panelSections/Filter";
import { VCO2 } from "@/components/panelSections/VCO2";
import { Envelope } from "@/components/panelSections/Envelope";
import { LFO } from "@/components/panelSections/LFO";
import { MonologueParameters } from "@/lib/sysex/decoder";
import { getParameterValue } from "@/lib/utils/parameter-adapters";
import { useState } from "react";

const Panel = ({
  parameters,
  onParameterChange,
}: {
  parameters: MonologueParameters;
  onParameterChange: (path: string, value: number) => void;
}) => {
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);

  // Create parameter callback function
  const createParameterCallback = (path: string) => (value: number) => {
    onParameterChange(path, value);
  };

  // Create invert callback for invertible parameters
  const createInvertCallback = (path: string) => (isInverted: boolean) => {
    const currentValue = getParameterValue(parameters, path);
    const absValue = Math.abs(currentValue);
    const newValue = isInverted ? -absValue : absValue;
    onParameterChange(path, newValue);
  };

  const toggleToolbar = () => {
    setIsToolbarOpen(!isToolbarOpen);
  };

  return (
    <div className="monologue-container">
      <div className="section-wrapper">
        <div className="panel">
          <div className="panel-controls">
            <Master
              drive={parameters.drive}
              octave={parameters.oscillators.vco1.octave} // VCO1 octave - placeholder for future implementation
              onChangeDrive={createParameterCallback("drive")}
              onChangeOctave={createParameterCallback("oscillators.vco1.octave")} // VCO1 octave - placeholder for future implementation
            />
            <VCO1
              shape={parameters.oscillators.vco1.shape}
              wave={parameters.oscillators.vco1.wave}
              onChangeWave={createParameterCallback("oscillators.vco1.wave")}
              onChangeShape={createParameterCallback("oscillators.vco1.shape")}
            />
            <VCO2
              octave={parameters.oscillators.vco2.octave}
              pitch={parameters.oscillators.vco2.pitch}
              wave={parameters.oscillators.vco2.wave}
              duty={parameters.oscillators.vco2.sync}
              shape={parameters.oscillators.vco2.shape}
              onChangeOctave={createParameterCallback("oscillators.vco2.octave")}
              onChangeWave={createParameterCallback("oscillators.vco2.wave")}
              onChangeDuty={createParameterCallback("oscillators.vco2.sync")}
              onChangePitch={createParameterCallback("oscillators.vco2.pitch")}
              onChangeShape={createParameterCallback("oscillators.vco2.shape")}
            />
            <Mixer
              vco1Level={parameters.oscillators.vco1.level}
              vco2Level={parameters.oscillators.vco2.level}
              onChangeVCO1LevelValue={createParameterCallback("oscillators.vco1.level")}
              onChangeVCO2LevelValue={createParameterCallback("oscillators.vco2.level")}
            />
            <Filter
              cutoff={parameters.filter.cutoff}
              resonance={parameters.filter.resonance}
              onChangeCutoff={createParameterCallback("filter.cutoff")}
              onChangeResonance={createParameterCallback("filter.resonance")}
            />
            <div className="panel-section" id="eglfo">
              <Envelope
                type={parameters.envelope.type}
                attack={parameters.envelope.attack}
                decay={parameters.envelope.decay}
                intensity={parameters.envelope.intensity}
                target={parameters.envelope.target}
                onChangeType={createParameterCallback("envelope.type")}
                onChangeAttack={createParameterCallback("envelope.attack")}
                onChangeDecay={createParameterCallback("envelope.decay")}
                onChangeIntensity={createParameterCallback("envelope.intensity")}
                onChangeTarget={createParameterCallback("envelope.target")}
                onIntensityInvertChange={createInvertCallback("envelope.intensity")}
              />
              <LFO
                wave={parameters.lfo.wave}
                mode={parameters.lfo.mode}
                rate={parameters.lfo.rate}
                intensity={parameters.lfo.intensity}
                target={parameters.lfo.target}
                onChangeWave={createParameterCallback("lfo.wave")}
                onChangeMode={createParameterCallback("lfo.mode")}
                onChangeRate={createParameterCallback("lfo.rate")}
                onChangeIntensity={createParameterCallback("lfo.intensity")}
                onChangeTarget={createParameterCallback("lfo.target")}
                onIntensityInvertChange={createInvertCallback("lfo.intensity")}
              />
            </div>
          </div>
        </div>

        {/* Toolbar Container */}
        <div className="toolbar-container">
          {/* Toolbar Toggle Button */}
          <div className="toolbar-toggle">
            <button
              onClick={toggleToolbar}
              className="toolbar-toggle-btn"
              aria-label={isToolbarOpen ? "Close toolbar" : "Open toolbar"}
            >
              <svg
                className={`chevron ${isToolbarOpen ? "chevron-up" : "chevron-down"}`}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
          </div>

          {/* Slide-out Toolbar */}
          <div className={`toolbar ${isToolbarOpen ? "toolbar-open" : "toolbar-closed"}`}>
            <div className="toolbar-content">
              <div className="toolbar-section">
                <button className="toolbar-btn">📥 Load Patch</button>
                <button className="toolbar-btn">💾 Save Patch</button>
                <button className="toolbar-btn">📋 Copy Settings</button>
                <button className="toolbar-btn">📂 Library</button>
              </div>
              <div className="toolbar-section">
                <button className="toolbar-btn">� Reset</button>
                <button className="toolbar-btn">� Share</button>
                <button className="toolbar-btn">⚙️ Settings</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Panel;
