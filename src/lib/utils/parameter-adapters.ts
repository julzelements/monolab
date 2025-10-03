import { MonologueParameters } from "@/lib/sysex/decoder";
import { ParamState, initialiseParamState, ParameterStateMap } from "@/types/paramState";
import { Parameters, Parameter } from "@/types/ParameterHash";

/**
 * Converts MonologueParameters to ParamState for the Panel.tsx component
 */
export function monologueParametersToParamState(params: MonologueParameters): ParamState {
  return initialiseParamState(params);
}

/**
 * Converts ParamState back to MonologueParameters for persistence and MIDI
 */
export function paramStateToMonologueParameters(
  paramState: ParamState,
  originalParams: MonologueParameters
): MonologueParameters {
  return {
    ...originalParams,
    isValid: true,
    drive: paramState.drive.value,
    oscillators: {
      vco1: {
        wave: midiToDiscrete(paramState.vco1Wave.value),
        shape: paramState.vco1Shape.value,
        level: paramState.vco1Level.value,
      },
      vco2: {
        wave: midiToDiscrete(paramState.vco2Wave.value),
        shape: paramState.vco2Shape.value,
        level: paramState.vco2Level.value,
        pitch: paramState.vco2Pitch.value,
        sync: midiToDiscrete(paramState.vco2Duty.value), // Note: duty maps to sync
        octave: paramState.vco2Octave.value,
      },
    },
    filter: {
      cutoff: paramState.cutoff.value,
      resonance: paramState.resonance.value,
    },
    envelope: {
      type: midiToDiscrete(paramState.envType.value),
      attack: paramState.envAttack.value,
      decay: paramState.envDecay.value,
      intensity: paramState.envIntensity.value,
      target: midiToDiscrete(paramState.envTarget.value),
    },
    lfo: {
      wave: midiToDiscrete(paramState.lfoWave.value),
      mode: midiToDiscrete(paramState.lfoMode.value),
      rate: paramState.lfoRate.value,
      intensity: paramState.lfoIntensity.value,
      target: midiToDiscrete(paramState.lfoTarget.value),
    },
  };
}

/**
 * Converts MIDI values (0, 64, 127) back to discrete values (0, 1, 2)
 */
function midiToDiscrete(midiValue: number): number {
  if (midiValue <= 32) return 0;
  if (midiValue <= 95) return 1;
  return 2;
}

/**
 * Creates a callback function for parameter changes that updates both the ParamState
 * and triggers the MonologueParameters change callback
 */
export function createParameterCallback(
  parameter: Parameter,
  paramState: ParamState,
  setParamState: (state: ParamState) => void,
  onMonologueParametersChange: (params: MonologueParameters) => void,
  originalParams: MonologueParameters
) {
  return (finalValue: number) => {
    // Update the specific parameter in ParamState
    const updatedParamState = {
      ...paramState,
      [parameter.name]: {
        ...paramState[parameter.name as keyof ParamState],
        value: finalValue,
      },
    };

    setParamState(updatedParamState);

    // Convert back to MonologueParameters and trigger change
    const updatedMonologueParams = paramStateToMonologueParameters(updatedParamState, originalParams);
    onMonologueParametersChange(updatedMonologueParams);
  };
}

/**
 * Creates the setParamViaCallback function expected by Panel.tsx
 */
export function createSetParamViaCallback(
  paramState: ParamState,
  setParamState: (state: ParamState) => void,
  onMonologueParametersChange: (params: MonologueParameters) => void,
  originalParams: MonologueParameters
) {
  return (parameter: Parameter) => {
    return createParameterCallback(parameter, paramState, setParamState, onMonologueParametersChange, originalParams);
  };
}
