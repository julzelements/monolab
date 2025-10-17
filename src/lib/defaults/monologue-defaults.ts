import { MonologueParameters } from "@/lib/sysex/decoder";

export const defaultMonologueParameters: MonologueParameters = {
  isValid: true,
  patchName: "Init Patch",
  drive: 0,
  oscillators: {
    vco1: {
      wave: 0, // SAW
      shape: 0,
      level: 512,
      octave: 1, // 8'
    },
    vco2: {
      wave: 0, // SAW
      shape: 0,
      level: 512,
      pitch: 512,
      sync: 0, // OFF
      octave: 1, // 8'
    },
  },
  filter: {
    cutoff: 512,
    resonance: 0,
  },
  envelope: {
    type: 1, // ADSR
    attack: 0,
    decay: 300,
    intensity: 0,
    target: 1, // CUTOFF
  },
  lfo: {
    wave: 0, // SAW
    mode: 1, // SLOW
    rate: 50,
    intensity: 0,
    target: 1, // CUTOFF
  },
  sequencer: {
    stepLength: 16,
    stepResolution: 1, // 1/8
    swing: 0,
    stepOnOff: new Array(16).fill(true),
    motionOnOff: new Array(16).fill(false),
  },
  motionSequencing: {
    slots: [
      {
        motionOn: false,
        smoothOn: false,
        parameterId: 0,
        stepEnabled: new Array(16).fill(false),
      },
      {
        motionOn: false,
        smoothOn: false,
        parameterId: 0,
        stepEnabled: new Array(16).fill(false),
      },
      {
        motionOn: false,
        smoothOn: false,
        parameterId: 0,
        stepEnabled: new Array(16).fill(false),
      },
      {
        motionOn: false,
        smoothOn: false,
        parameterId: 0,
        stepEnabled: new Array(16).fill(false),
      },
    ],
    stepEvents: new Array(16).fill(null).map(() => ({
      noteNumber: 0,
      velocity: 100,
      gateTime: 36, // 50%
      triggerSwitch: false,
      motionData: [
        { data1: 0, data2: 0, data3: 0, data4: 0 },
        { data1: 0, data2: 0, data3: 0, data4: 0 },
        { data1: 0, data2: 0, data3: 0, data4: 0 },
        { data1: 0, data2: 0, data3: 0, data4: 0 },
      ],
    })),
  },
  amp: {
    attack: 0,
    decay: 60,
  },
  misc: {
    bpmSync: false,
    portamentMode: false,
    portamentTime: 0,
    cutoffVelocity: 0,
    cutoffKeyTrack: 0,
    sliderAssign: "CUTOFF",
  },
};
