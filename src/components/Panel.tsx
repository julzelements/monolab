import { Master } from "@/components/panelSections/Master";
import { VCO1 } from "@/components/panelSections/VCO1";
import { Mixer } from "@/components/panelSections/Mixer";
import { Filter } from "@/components/panelSections/Filter";
import { VCO2 } from "@/components/panelSections/VCO2";
import { Envelope } from "@/components/panelSections/Envelope";
import { LFO } from "@/components/panelSections/LFO";
import { MonologueParameters } from "@/lib/sysex/decoder";
import { getParameterValue } from "@/lib/utils/parameter-adapters";

const Panel = ({
  parameters,
  onParameterChange,
}: {
  parameters: MonologueParameters;
  onParameterChange: (path: string, value: number) => void;
}) => {
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

  return (
    <div className="monologue-container">
      <div className="section-wrapper">
        <div className="panel">
          <div className="panel-controls">
            <Master
              drive={getParameterValue(parameters, "drive")}
              octave={0} // VCO1 octave - placeholder for future implementation
              onChangeDrive={createParameterCallback("drive")}
              onChangeOctave={() => {}} // VCO1 octave - placeholder for future implementation
            />
            <VCO1
              shape={getParameterValue(parameters, "oscillators.vco1.shape")}
              wave={getParameterValue(parameters, "oscillators.vco1.wave")}
              onChangeWave={createParameterCallback("oscillators.vco1.wave")}
              onChangeShape={createParameterCallback("oscillators.vco1.shape")}
            />
            <VCO2
              octave={getParameterValue(parameters, "oscillators.vco2.octave")}
              pitch={getParameterValue(parameters, "oscillators.vco2.pitch")}
              wave={getParameterValue(parameters, "oscillators.vco2.wave")}
              duty={getParameterValue(parameters, "oscillators.vco2.sync")}
              shape={getParameterValue(parameters, "oscillators.vco2.shape")}
              onChangeOctave={createParameterCallback("oscillators.vco2.octave")}
              onChangeWave={createParameterCallback("oscillators.vco2.wave")}
              onChangeDuty={createParameterCallback("oscillators.vco2.sync")}
              onChangePitch={createParameterCallback("oscillators.vco2.pitch")}
              onChangeShape={createParameterCallback("oscillators.vco2.shape")}
            />
            <Mixer
              vco1Level={getParameterValue(parameters, "oscillators.vco1.level")}
              vco2Level={getParameterValue(parameters, "oscillators.vco2.level")}
              onChangeVCO1LevelValue={createParameterCallback("oscillators.vco1.level")}
              onChangeVCO2LevelValue={createParameterCallback("oscillators.vco2.level")}
            />
            <Filter
              cutoff={getParameterValue(parameters, "filter.cutoff")}
              resonance={getParameterValue(parameters, "filter.resonance")}
              onChangeCutoff={createParameterCallback("filter.cutoff")}
              onChangeResonance={createParameterCallback("filter.resonance")}
            />
            <div className="panel-section" id="eglfo">
              <Envelope
                type={getParameterValue(parameters, "envelope.type")}
                attack={getParameterValue(parameters, "envelope.attack")}
                decay={getParameterValue(parameters, "envelope.decay")}
                intensity={getParameterValue(parameters, "envelope.intensity")}
                target={getParameterValue(parameters, "envelope.target")}
                onChangeType={createParameterCallback("envelope.type")}
                onChangeAttack={createParameterCallback("envelope.attack")}
                onChangeDecay={createParameterCallback("envelope.decay")}
                onChangeIntensity={createParameterCallback("envelope.intensity")}
                onChangeTarget={createParameterCallback("envelope.target")}
                onIntensityInvertChange={createInvertCallback("envelope.intensity")}
              />
              <LFO
                wave={getParameterValue(parameters, "lfo.wave")}
                mode={getParameterValue(parameters, "lfo.mode")}
                rate={getParameterValue(parameters, "lfo.rate")}
                intensity={getParameterValue(parameters, "lfo.intensity")}
                target={getParameterValue(parameters, "lfo.target")}
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
      </div>
    </div>
  );
};

export default Panel;
