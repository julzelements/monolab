// import { constants } from "buffer";
import { Parameters, Parameter } from "@/types/ParameterHash";
import { MonologueParameters } from "@/lib/sysex/decoder";

export interface ParameterStateMap {
  parameter: Parameter;
  value: number;
}

export interface ParamState {
  drive: ParameterStateMap;
  vco1Shape: ParameterStateMap;
  vco1Wave: ParameterStateMap;
  vco2Octave: ParameterStateMap;
  vco1Octave: ParameterStateMap;
  vco2Wave: ParameterStateMap;
  vco2Duty: ParameterStateMap;
  vco2Pitch: ParameterStateMap;
  vco2Shape: ParameterStateMap;
  vco1Level: ParameterStateMap;
  vco2Level: ParameterStateMap;
  cutoff: ParameterStateMap;
  resonance: ParameterStateMap;
  envType: ParameterStateMap;
  envAttack: ParameterStateMap;
  envDecay: ParameterStateMap;
  envIntensity: ParameterStateMap;
  envTarget: ParameterStateMap;
  lfoWave: ParameterStateMap;
  lfoMode: ParameterStateMap;
  lfoRate: ParameterStateMap;
  lfoIntensity: ParameterStateMap;
  lfoTarget: ParameterStateMap;
}

// sysex program is stored as: 0, 1, 2
// but is sent via MIDI as: 0, 64, 127
const discreteToMidi = [0, 64, 127];

export const initialiseParamState = (monologueParams: MonologueParameters): ParamState => {
  console.log("initialiseParamState");
  return {
    drive: {
      parameter: Parameters.DRIVE,
      value: monologueParams.drive || 0,
    },
    vco1Octave: {
      parameter: Parameters.VCO1_OCTAVE,
      value: 0, // VCO1 octave is stored differently - need special handling
    },
    vco1Shape: {
      parameter: Parameters.VCO1_SHAPE,
      value: monologueParams.oscillators?.vco1?.shape || 0,
    },
    vco1Wave: {
      parameter: Parameters.VCO1_WAVE,
      value: discreteToMidi[monologueParams.oscillators?.vco1?.wave || 0],
    },
    vco2Octave: {
      parameter: Parameters.VCO2_OCTAVE,
      value: monologueParams.oscillators?.vco2?.octave || 0,
    },
    vco2Wave: {
      parameter: Parameters.VCO2_WAVE,
      value: discreteToMidi[monologueParams.oscillators?.vco2?.wave || 0],
    },
    vco2Duty: {
      parameter: Parameters.VCO2_DUTY,
      value: discreteToMidi[monologueParams.oscillators?.vco2?.sync || 0], // Note: sync maps to duty
    },
    vco2Pitch: {
      parameter: Parameters.VCO2_PITCH,
      value: monologueParams.oscillators?.vco2?.pitch || 0,
    },
    vco2Shape: {
      parameter: Parameters.VCO2_SHAPE,
      value: monologueParams.oscillators?.vco2?.shape || 0,
    },
    vco1Level: {
      parameter: Parameters.VCO1_LEVEL,
      value: monologueParams.oscillators?.vco1?.level || 0,
    },
    vco2Level: {
      parameter: Parameters.VCO2_LEVEL,
      value: monologueParams.oscillators?.vco2?.level || 0,
    },
    cutoff: {
      parameter: Parameters.CUTOFF,
      value: monologueParams.filter?.cutoff || 0,
    },
    resonance: {
      parameter: Parameters.RESONANCE,
      value: monologueParams.filter?.resonance || 0,
    },
    envType: {
      parameter: Parameters.ENV_TYPE,
      value: discreteToMidi[monologueParams.envelope?.type || 0],
    },
    envAttack: {
      parameter: Parameters.ENV_ATTACK,
      value: monologueParams.envelope?.attack || 0,
    },
    envDecay: {
      parameter: Parameters.ENV_DECAY,
      value: monologueParams.envelope?.decay || 0,
    },
    envIntensity: {
      parameter: Parameters.ENV_INTENSITY,
      value: monologueParams.envelope?.intensity || 0,
    },
    envTarget: {
      parameter: Parameters.ENV_TARGET,
      value: discreteToMidi[monologueParams.envelope?.target || 0],
    },
    lfoWave: {
      parameter: Parameters.LFO_WAVE,
      value: discreteToMidi[monologueParams.lfo?.wave || 0],
    },
    lfoMode: {
      parameter: Parameters.LFO_MODE,
      value: discreteToMidi[monologueParams.lfo?.mode || 0],
    },
    lfoRate: {
      parameter: Parameters.LFO_RATE,
      value: monologueParams.lfo?.rate || 0,
    },
    lfoIntensity: {
      parameter: Parameters.LFO_INTENSITY,
      value: monologueParams.lfo?.intensity || 0,
    },
    lfoTarget: {
      parameter: Parameters.LFO_TARGET,
      value: discreteToMidi[monologueParams.lfo?.target || 0],
    },
  };
};
