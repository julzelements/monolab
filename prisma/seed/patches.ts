// Auto-generated patch data from SysEx dumps
// Generated on: 2025-10-17T04:27:31.164Z
// Do not edit manually - run 'npm run db:seed-generate' to regenerate

import { MonologueParameters } from "@/lib/sysex";

export interface DecodedPatch {
  name: string;
  description: string;
  tags: string[];
  parameters: MonologueParameters;
  rawData: number[];
}

export const patches: DecodedPatch[] = [
  {
    "name": "<afx acid3>",
    "description": "Decoded patch from dump1.json",
    "tags": [
      "demo",
      "test",
      "decoded"
    ],
    "parameters": {
      "isValid": true,
      "patchName": "<afx acid3>",
      "drive": 0,
      "oscillators": {
        "vco1": {
          "wave": 2,
          "shape": 0,
          "level": 1023,
          "octave": 1
        },
        "vco2": {
          "wave": 2,
          "shape": 0,
          "level": 1023,
          "sync": 1,
          "pitch": 1023,
          "octave": 0
        }
      },
      "filter": {
        "cutoff": 488,
        "resonance": 909
      },
      "envelope": {
        "type": 0,
        "attack": 0,
        "decay": 485,
        "intensity": 343,
        "target": 0
      },
      "lfo": {
        "wave": 1,
        "mode": 1,
        "rate": 512,
        "intensity": 0,
        "target": 2
      },
      "sequencer": {
        "stepLength": 16,
        "stepResolution": 0,
        "swing": -75,
        "stepOnOff": [
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true
        ],
        "motionOnOff": [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true
        ]
      },
      "motionSequencing": {
        "slots": [
          {
            "motionOn": false,
            "smoothOn": false,
            "parameterId": 23,
            "stepEnabled": [
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true
            ]
          },
          {
            "motionOn": false,
            "smoothOn": false,
            "parameterId": 24,
            "stepEnabled": [
              true,
              true,
              true,
              true,
              true,
              false,
              false,
              true,
              false,
              true,
              false,
              false,
              false,
              true,
              false,
              false
            ]
          },
          {
            "motionOn": true,
            "smoothOn": true,
            "parameterId": 27,
            "stepEnabled": [
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true
            ]
          },
          {
            "motionOn": true,
            "smoothOn": true,
            "parameterId": 28,
            "stepEnabled": [
              true,
              true,
              true,
              true,
              true,
              false,
              false,
              true,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false
            ]
          }
        ],
        "stepEvents": [
          {
            "noteNumber": 40,
            "velocity": 37,
            "gateTime": 54,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 3,
                "data2": 3,
                "data3": 3,
                "data4": 3
              },
              {
                "data1": 128,
                "data2": 128,
                "data3": 128,
                "data4": 128
              }
            ]
          },
          {
            "noteNumber": 75,
            "velocity": 70,
            "gateTime": 54,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 171,
                "data2": 171,
                "data3": 171,
                "data4": 171
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 160,
                "data2": 160,
                "data3": 160,
                "data4": 160
              }
            ]
          },
          {
            "noteNumber": 29,
            "velocity": 90,
            "gateTime": 127,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 255,
                "data2": 255,
                "data3": 255,
                "data4": 255
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 1,
                "data2": 1,
                "data3": 1,
                "data4": 1
              },
              {
                "data1": 174,
                "data2": 174,
                "data3": 174,
                "data4": 174
              }
            ]
          },
          {
            "noteNumber": 0,
            "velocity": 0,
            "gateTime": 0,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 255,
                "data2": 255,
                "data3": 255,
                "data4": 255
              },
              {
                "data1": 1,
                "data2": 1,
                "data3": 1,
                "data4": 1
              },
              {
                "data1": 206,
                "data2": 206,
                "data3": 206,
                "data4": 206
              }
            ]
          },
          {
            "noteNumber": 30,
            "velocity": 59,
            "gateTime": 22,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 255,
                "data2": 255,
                "data3": 255,
                "data4": 255
              },
              {
                "data1": 105,
                "data2": 105,
                "data3": 105,
                "data4": 105
              },
              {
                "data1": 255,
                "data2": 255,
                "data3": 255,
                "data4": 255
              }
            ]
          },
          {
            "noteNumber": 29,
            "velocity": 43,
            "gateTime": 22,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 178,
                "data2": 178,
                "data3": 178,
                "data4": 178
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 120,
                "data2": 120,
                "data3": 120,
                "data4": 120
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 50,
            "velocity": 52,
            "gateTime": 22,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 221,
                "data2": 221,
                "data3": 228,
                "data4": 237
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 34,
                "data2": 34,
                "data3": 34,
                "data4": 34
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 33,
            "velocity": 61,
            "gateTime": 54,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 113,
                "data2": 113,
                "data3": 113,
                "data4": 113
              },
              {
                "data1": 162,
                "data2": 162,
                "data3": 162,
                "data4": 162
              },
              {
                "data1": 133,
                "data2": 133,
                "data3": 133,
                "data4": 133
              },
              {
                "data1": 170,
                "data2": 170,
                "data3": 170,
                "data4": 170
              }
            ]
          },
          {
            "noteNumber": 30,
            "velocity": 52,
            "gateTime": 54,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 37,
                "data2": 37,
                "data3": 37,
                "data4": 37
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 6,
                "data2": 6,
                "data3": 6,
                "data4": 6
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 65,
            "velocity": 61,
            "gateTime": 54,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 87,
                "data2": 87,
                "data3": 87,
                "data4": 87
              },
              {
                "data1": 201,
                "data2": 201,
                "data3": 201,
                "data4": 201
              },
              {
                "data1": 57,
                "data2": 61,
                "data3": 69,
                "data4": 76
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 30,
            "velocity": 44,
            "gateTime": 54,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 43,
                "data2": 43,
                "data3": 43,
                "data4": 43
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 76,
                "data2": 84,
                "data3": 89,
                "data4": 93
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 28,
            "velocity": 68,
            "gateTime": 54,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 100,
                "data2": 100,
                "data3": 100,
                "data4": 100
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 93,
                "data2": 99,
                "data3": 105,
                "data4": 112
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 34,
            "velocity": 70,
            "gateTime": 54,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 74,
                "data2": 74,
                "data3": 74,
                "data4": 74
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 112,
                "data2": 120,
                "data3": 129,
                "data4": 138
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 41,
            "velocity": 61,
            "gateTime": 54,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 34,
                "data2": 34,
                "data3": 34,
                "data4": 34
              },
              {
                "data1": 253,
                "data2": 253,
                "data3": 253,
                "data4": 253
              },
              {
                "data1": 138,
                "data2": 147,
                "data3": 155,
                "data4": 164
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 33,
            "velocity": 59,
            "gateTime": 54,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 36,
                "data2": 36,
                "data3": 36,
                "data4": 36
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 164,
                "data2": 172,
                "data3": 180,
                "data4": 188
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 75,
            "velocity": 50,
            "gateTime": 54,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 118,
                "data2": 118,
                "data3": 118,
                "data4": 118
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 188,
                "data2": 194,
                "data3": 196,
                "data4": 196
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          }
        ]
      },
      "amp": {
        "attack": 128,
        "decay": 0
      },
      "misc": {
        "bpmSync": false,
        "portamentMode": false,
        "portamentTime": 0,
        "cutoffVelocity": 2,
        "cutoffKeyTrack": 0,
        "sliderAssign": "PITCH BEND"
      }
    },
    "rawData": [
      240,
      66,
      48,
      0,
      1,
      68,
      64,
      0,
      80,
      82,
      79,
      71,
      60,
      97,
      102,
      0,
      120,
      32,
      97,
      99,
      105,
      100,
      51,
      84,
      62,
      0,
      0,
      0,
      127,
      0,
      127,
      101,
      127,
      122,
      99,
      0,
      121,
      85,
      0,
      29,
      0,
      0,
      16,
      3,
      97,
      79,
      16,
      0,
      3,
      37,
      50,
      0,
      12,
      36,
      0,
      32,
      56,
      19,
      38,
      87,
      0,
      72,
      83,
      8,
      69,
      81,
      68,
      48,
      4,
      16,
      0,
      12,
      0,
      54,
      127,
      127,
      0,
      0,
      0,
      94,
      0,
      119,
      127,
      127,
      127,
      35,
      20,
      0,
      0,
      0,
      0,
      23,
      0,
      24,
      3,
      56,
      27,
      3,
      28,
      127,
      127,
      31,
      34,
      7,
      127,
      127,
      31,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      40,
      0,
      4,
      37,
      0,
      54,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      3,
      60,
      3,
      3,
      0,
      0,
      0,
      0,
      75,
      104,
      0,
      70,
      0,
      54,
      0,
      43,
      43,
      3,
      43,
      43,
      0,
      0,
      0,
      0,
      0,
      120,
      0,
      0,
      0,
      32,
      32,
      32,
      32,
      80,
      29,
      0,
      90,
      0,
      127,
      0,
      127,
      7,
      127,
      127,
      127,
      0,
      0,
      0,
      0,
      112,
      1,
      1,
      1,
      1,
      46,
      46,
      46,
      1,
      46,
      0,
      0,
      0,
      0,
      0,
      0,
      112,
      0,
      0,
      0,
      0,
      127,
      127,
      127,
      97,
      127,
      1,
      1,
      1,
      1,
      78,
      78,
      67,
      78,
      78,
      30,
      0,
      59,
      0,
      22,
      96,
      0,
      0,
      0,
      0,
      0,
      127,
      127,
      67,
      127,
      127,
      105,
      105,
      105,
      105,
      127,
      7,
      127,
      127,
      127,
      29,
      0,
      43,
      0,
      61,
      22,
      0,
      50,
      50,
      50,
      50,
      0,
      0,
      0,
      0,
      0,
      120,
      120,
      120,
      120,
      0,
      0,
      0,
      0,
      0,
      50,
      0,
      52,
      122,
      0,
      22,
      0,
      93,
      93,
      100,
      109,
      0,
      0,
      0,
      0,
      0,
      34,
      34,
      34,
      0,
      34,
      0,
      0,
      0,
      0,
      33,
      0,
      4,
      61,
      0,
      54,
      0,
      113,
      113,
      113,
      126,
      113,
      34,
      34,
      34,
      34,
      5,
      5,
      63,
      5,
      5,
      42,
      42,
      42,
      42,
      30,
      8,
      0,
      52,
      0,
      54,
      0,
      37,
      37,
      0,
      37,
      37,
      0,
      0,
      0,
      0,
      6,
      0,
      6,
      6,
      6,
      0,
      0,
      0,
      0,
      16,
      65,
      0,
      61,
      0,
      54,
      0,
      87,
      120,
      87,
      87,
      87,
      73,
      73,
      73,
      73,
      0,
      57,
      61,
      69,
      76,
      0,
      0,
      0,
      32,
      0,
      30,
      0,
      44,
      0,
      54,
      0,
      0,
      43,
      43,
      43,
      43,
      0,
      0,
      0,
      0,
      0,
      76,
      84,
      89,
      93,
      0,
      0,
      64,
      0,
      0,
      28,
      0,
      68,
      0,
      54,
      0,
      0,
      100,
      100,
      100,
      100,
      0,
      0,
      0,
      0,
      0,
      93,
      99,
      105,
      112,
      0,
      0,
      0,
      0,
      0,
      34,
      0,
      70,
      0,
      1,
      54,
      0,
      74,
      74,
      74,
      74,
      0,
      96,
      0,
      0,
      0,
      112,
      120,
      1,
      10,
      0,
      0,
      0,
      0,
      0,
      41,
      0,
      61,
      2,
      0,
      54,
      0,
      34,
      34,
      34,
      34,
      127,
      125,
      125,
      125,
      125,
      10,
      19,
      27,
      1,
      36,
      0,
      0,
      0,
      0,
      33,
      0,
      4,
      59,
      0,
      54,
      0,
      36,
      36,
      36,
      96,
      36,
      0,
      0,
      0,
      0,
      36,
      44,
      3,
      52,
      60,
      0,
      0,
      0,
      0,
      75,
      8,
      0,
      50,
      0,
      54,
      0,
      118,
      118,
      64,
      118,
      118,
      0,
      0,
      0,
      0,
      60,
      7,
      66,
      68,
      68,
      0,
      0,
      0,
      0,
      247
    ]
  },
  {
    "name": "Injection",
    "description": "Decoded patch from dump2.json",
    "tags": [
      "demo",
      "test",
      "decoded"
    ],
    "parameters": {
      "isValid": true,
      "patchName": "Injection",
      "drive": 1023,
      "oscillators": {
        "vco1": {
          "wave": 2,
          "shape": 0,
          "level": 573,
          "octave": 1
        },
        "vco2": {
          "wave": 1,
          "shape": 0,
          "level": 1023,
          "sync": 1,
          "pitch": 472,
          "octave": 1
        }
      },
      "filter": {
        "cutoff": 687,
        "resonance": 852
      },
      "envelope": {
        "type": 2,
        "attack": 0,
        "decay": 499,
        "intensity": 90,
        "target": 0
      },
      "lfo": {
        "wave": 1,
        "mode": 1,
        "rate": 109,
        "intensity": 131,
        "target": 0
      },
      "sequencer": {
        "stepLength": 16,
        "stepResolution": 0,
        "swing": -75,
        "stepOnOff": [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true
        ],
        "motionOnOff": [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true
        ]
      },
      "motionSequencing": {
        "slots": [
          {
            "motionOn": true,
            "smoothOn": true,
            "parameterId": 23,
            "stepEnabled": [
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true
            ]
          },
          {
            "motionOn": true,
            "smoothOn": true,
            "parameterId": 27,
            "stepEnabled": [
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true
            ]
          },
          {
            "motionOn": false,
            "smoothOn": false,
            "parameterId": 0,
            "stepEnabled": [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false
            ]
          },
          {
            "motionOn": false,
            "smoothOn": false,
            "parameterId": 0,
            "stepEnabled": [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false
            ]
          }
        ],
        "stepEvents": [
          {
            "noteNumber": 43,
            "velocity": 66,
            "gateTime": 71,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 147,
                "data2": 147,
                "data3": 147,
                "data4": 147
              },
              {
                "data1": 48,
                "data2": 48,
                "data3": 48,
                "data4": 48
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 43,
            "velocity": 66,
            "gateTime": 71,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 104,
                "data2": 104,
                "data3": 104,
                "data4": 104
              },
              {
                "data1": 48,
                "data2": 48,
                "data3": 48,
                "data4": 46
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 43,
            "velocity": 66,
            "gateTime": 71,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 124,
                "data2": 124,
                "data3": 124,
                "data4": 124
              },
              {
                "data1": 46,
                "data2": 46,
                "data3": 46,
                "data4": 50
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 55,
            "velocity": 66,
            "gateTime": 71,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 65,
                "data2": 65,
                "data3": 65,
                "data4": 65
              },
              {
                "data1": 50,
                "data2": 50,
                "data3": 50,
                "data4": 47
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 43,
            "velocity": 55,
            "gateTime": 71,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 157,
                "data2": 157,
                "data3": 157,
                "data4": 157
              },
              {
                "data1": 47,
                "data2": 47,
                "data3": 47,
                "data4": 48
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 55,
            "velocity": 66,
            "gateTime": 73,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 187,
                "data2": 187,
                "data3": 187,
                "data4": 187
              },
              {
                "data1": 48,
                "data2": 48,
                "data3": 45,
                "data4": 45
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 58,
            "velocity": 87,
            "gateTime": 73,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 220,
                "data2": 220,
                "data3": 220,
                "data4": 220
              },
              {
                "data1": 45,
                "data2": 45,
                "data3": 46,
                "data4": 47
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 62,
            "velocity": 84,
            "gateTime": 73,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 164,
                "data2": 164,
                "data3": 164,
                "data4": 164
              },
              {
                "data1": 47,
                "data2": 47,
                "data3": 47,
                "data4": 47
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 43,
            "velocity": 84,
            "gateTime": 73,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 104,
                "data2": 104,
                "data3": 104,
                "data4": 104
              },
              {
                "data1": 47,
                "data2": 46,
                "data3": 48,
                "data4": 48
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 43,
            "velocity": 84,
            "gateTime": 73,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 160,
                "data2": 160,
                "data3": 160,
                "data4": 160
              },
              {
                "data1": 48,
                "data2": 48,
                "data3": 47,
                "data4": 47
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 43,
            "velocity": 84,
            "gateTime": 73,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 197,
                "data2": 197,
                "data3": 197,
                "data4": 197
              },
              {
                "data1": 47,
                "data2": 47,
                "data3": 47,
                "data4": 50
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 55,
            "velocity": 66,
            "gateTime": 73,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 95,
                "data2": 95,
                "data3": 95,
                "data4": 95
              },
              {
                "data1": 49,
                "data2": 49,
                "data3": 49,
                "data4": 50
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 43,
            "velocity": 80,
            "gateTime": 73,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 175,
                "data2": 175,
                "data3": 175,
                "data4": 175
              },
              {
                "data1": 50,
                "data2": 50,
                "data3": 49,
                "data4": 48
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 55,
            "velocity": 66,
            "gateTime": 73,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 206,
                "data2": 206,
                "data3": 206,
                "data4": 206
              },
              {
                "data1": 48,
                "data2": 48,
                "data3": 49,
                "data4": 49
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 58,
            "velocity": 78,
            "gateTime": 73,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 161,
                "data2": 161,
                "data3": 161,
                "data4": 161
              },
              {
                "data1": 49,
                "data2": 49,
                "data3": 45,
                "data4": 45
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 55,
            "velocity": 76,
            "gateTime": 71,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 99,
                "data2": 99,
                "data3": 99,
                "data4": 99
              },
              {
                "data1": 45,
                "data2": 45,
                "data3": 46,
                "data4": 48
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          }
        ]
      },
      "amp": {
        "attack": 128,
        "decay": 0
      },
      "misc": {
        "bpmSync": true,
        "portamentMode": true,
        "portamentTime": 0,
        "cutoffVelocity": 0,
        "cutoffKeyTrack": 1,
        "sliderAssign": "PITCH BEND"
      }
    },
    "rawData": [
      240,
      66,
      48,
      0,
      1,
      68,
      64,
      0,
      80,
      82,
      79,
      71,
      73,
      110,
      106,
      0,
      101,
      99,
      116,
      105,
      111,
      110,
      0,
      68,
      0,
      0,
      0,
      0,
      118,
      0,
      15,
      39,
      127,
      43,
      85,
      0,
      124,
      22,
      27,
      23,
      32,
      127,
      16,
      80,
      101,
      61,
      50,
      1,
      118,
      5,
      50,
      0,
      12,
      36,
      0,
      34,
      56,
      76,
      79,
      102,
      0,
      72,
      83,
      8,
      69,
      81,
      68,
      98,
      4,
      16,
      0,
      12,
      0,
      54,
      127,
      127,
      0,
      0,
      0,
      30,
      0,
      127,
      127,
      127,
      127,
      0,
      0,
      0,
      0,
      0,
      3,
      23,
      3,
      27,
      0,
      120,
      0,
      0,
      0,
      127,
      127,
      127,
      127,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      43,
      0,
      112,
      66,
      0,
      71,
      0,
      19,
      19,
      19,
      1,
      19,
      48,
      48,
      48,
      48,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      43,
      0,
      0,
      66,
      0,
      71,
      0,
      104,
      104,
      0,
      104,
      104,
      48,
      48,
      48,
      46,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      43,
      0,
      66,
      0,
      71,
      0,
      124,
      0,
      124,
      124,
      124,
      46,
      46,
      46,
      50,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      55,
      0,
      66,
      0,
      71,
      0,
      0,
      65,
      65,
      65,
      65,
      50,
      50,
      50,
      0,
      47,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      43,
      0,
      55,
      0,
      71,
      30,
      0,
      29,
      29,
      29,
      29,
      47,
      47,
      0,
      47,
      48,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      55,
      0,
      66,
      0,
      60,
      73,
      0,
      59,
      59,
      59,
      59,
      48,
      0,
      48,
      45,
      45,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      58,
      0,
      87,
      120,
      0,
      73,
      0,
      92,
      92,
      92,
      92,
      0,
      45,
      45,
      46,
      47,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      62,
      0,
      112,
      84,
      0,
      73,
      0,
      36,
      36,
      36,
      1,
      36,
      47,
      47,
      47,
      47,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      43,
      0,
      0,
      84,
      0,
      73,
      0,
      104,
      104,
      0,
      104,
      104,
      47,
      46,
      48,
      48,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      64,
      43,
      0,
      84,
      0,
      73,
      0,
      32,
      7,
      32,
      32,
      32,
      48,
      48,
      47,
      47,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      43,
      0,
      84,
      0,
      73,
      0,
      15,
      69,
      69,
      69,
      69,
      47,
      47,
      47,
      0,
      50,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      55,
      0,
      66,
      0,
      73,
      0,
      0,
      95,
      95,
      95,
      95,
      49,
      49,
      0,
      49,
      50,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      43,
      0,
      80,
      0,
      60,
      73,
      0,
      47,
      47,
      47,
      47,
      50,
      0,
      50,
      49,
      48,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      55,
      0,
      66,
      120,
      0,
      73,
      0,
      78,
      78,
      78,
      78,
      0,
      48,
      48,
      49,
      49,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      58,
      0,
      112,
      78,
      0,
      73,
      0,
      33,
      33,
      33,
      1,
      33,
      49,
      49,
      45,
      45,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      55,
      0,
      0,
      76,
      0,
      71,
      0,
      99,
      99,
      0,
      99,
      99,
      45,
      45,
      46,
      48,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      247
    ]
  },
  {
    "name": "Anfem",
    "description": "Decoded patch from dump3.json",
    "tags": [
      "demo",
      "test",
      "decoded"
    ],
    "parameters": {
      "isValid": true,
      "patchName": "Anfem",
      "drive": 78,
      "oscillators": {
        "vco1": {
          "wave": 1,
          "shape": 0,
          "level": 1023,
          "octave": 1
        },
        "vco2": {
          "wave": 2,
          "shape": 364,
          "level": 1023,
          "sync": 1,
          "pitch": 225,
          "octave": 3
        }
      },
      "filter": {
        "cutoff": 90,
        "resonance": 579
      },
      "envelope": {
        "type": 2,
        "attack": 0,
        "decay": 704,
        "intensity": 309,
        "target": 0
      },
      "lfo": {
        "wave": 2,
        "mode": 2,
        "rate": 50,
        "intensity": 235,
        "target": 0
      },
      "sequencer": {
        "stepLength": 16,
        "stepResolution": 0,
        "swing": -75,
        "stepOnOff": [
          true,
          true,
          false,
          true,
          true,
          false,
          true,
          false,
          false,
          true,
          true,
          true,
          false,
          true,
          true,
          true
        ],
        "motionOnOff": [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false
        ]
      },
      "motionSequencing": {
        "slots": [
          {
            "motionOn": false,
            "smoothOn": false,
            "parameterId": 0,
            "stepEnabled": [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false
            ]
          },
          {
            "motionOn": false,
            "smoothOn": false,
            "parameterId": 0,
            "stepEnabled": [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false
            ]
          },
          {
            "motionOn": false,
            "smoothOn": false,
            "parameterId": 0,
            "stepEnabled": [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false
            ]
          },
          {
            "motionOn": false,
            "smoothOn": false,
            "parameterId": 0,
            "stepEnabled": [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false
            ]
          }
        ],
        "stepEvents": [
          {
            "noteNumber": 49,
            "velocity": 46,
            "gateTime": 127,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 49,
            "velocity": 46,
            "gateTime": 25,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 0,
            "velocity": 0,
            "gateTime": 0,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 49,
            "velocity": 46,
            "gateTime": 127,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 49,
            "velocity": 46,
            "gateTime": 5,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 0,
            "velocity": 0,
            "gateTime": 0,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 49,
            "velocity": 44,
            "gateTime": 73,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 0,
            "velocity": 0,
            "gateTime": 0,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 0,
            "velocity": 0,
            "gateTime": 0,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 54,
            "velocity": 55,
            "gateTime": 35,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 61,
            "velocity": 78,
            "gateTime": 36,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 56,
            "velocity": 44,
            "gateTime": 58,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 0,
            "velocity": 0,
            "gateTime": 0,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 52,
            "velocity": 58,
            "gateTime": 65,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 44,
            "velocity": 48,
            "gateTime": 127,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 44,
            "velocity": 48,
            "gateTime": 3,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          }
        ]
      },
      "amp": {
        "attack": 128,
        "decay": 0
      },
      "misc": {
        "bpmSync": true,
        "portamentMode": false,
        "portamentTime": 0,
        "cutoffVelocity": 2,
        "cutoffKeyTrack": 0,
        "sliderAssign": "CUTOFF"
      }
    },
    "rawData": [
      240,
      66,
      48,
      0,
      1,
      68,
      64,
      0,
      80,
      82,
      79,
      71,
      65,
      110,
      102,
      0,
      101,
      109,
      0,
      0,
      0,
      0,
      0,
      68,
      0,
      0,
      0,
      0,
      56,
      91,
      127,
      53,
      127,
      22,
      16,
      0,
      48,
      77,
      12,
      57,
      58,
      19,
      80,
      49,
      101,
      111,
      2,
      1,
      57,
      10,
      55,
      0,
      12,
      36,
      0,
      32,
      23,
      34,
      46,
      112,
      0,
      72,
      83,
      8,
      69,
      81,
      68,
      68,
      4,
      16,
      0,
      12,
      0,
      54,
      127,
      127,
      0,
      0,
      0,
      4,
      0,
      91,
      110,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      49,
      0,
      4,
      46,
      0,
      127,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      49,
      0,
      0,
      46,
      0,
      25,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      32,
      0,
      49,
      0,
      46,
      0,
      127,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      49,
      0,
      46,
      0,
      5,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      49,
      0,
      44,
      2,
      0,
      73,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      16,
      54,
      0,
      55,
      0,
      35,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      32,
      0,
      61,
      0,
      78,
      0,
      36,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      64,
      0,
      0,
      56,
      0,
      44,
      0,
      58,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      52,
      0,
      58,
      2,
      0,
      65,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      44,
      0,
      4,
      48,
      0,
      127,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      44,
      0,
      0,
      48,
      0,
      3,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      247
    ]
  },
  {
    "name": "<wavetable>",
    "description": "Decoded patch from dump4.json",
    "tags": [
      "demo",
      "test",
      "decoded"
    ],
    "parameters": {
      "isValid": true,
      "patchName": "<wavetable>",
      "drive": 0,
      "oscillators": {
        "vco1": {
          "wave": 0,
          "shape": 0,
          "level": 1023,
          "octave": 1
        },
        "vco2": {
          "wave": 1,
          "shape": 584,
          "level": 1023,
          "sync": 1,
          "pitch": 563,
          "octave": 0
        }
      },
      "filter": {
        "cutoff": 756,
        "resonance": 0
      },
      "envelope": {
        "type": 0,
        "attack": 95,
        "decay": 1023,
        "intensity": 215,
        "target": 0
      },
      "lfo": {
        "wave": 1,
        "mode": 2,
        "rate": 0,
        "intensity": 511,
        "target": 1
      },
      "sequencer": {
        "stepLength": 9,
        "stepResolution": 0,
        "swing": -75,
        "stepOnOff": [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true
        ],
        "motionOnOff": [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true
        ]
      },
      "motionSequencing": {
        "slots": [
          {
            "motionOn": true,
            "smoothOn": true,
            "parameterId": 16,
            "stepEnabled": [
              true,
              true,
              false,
              true,
              true,
              true,
              false,
              true,
              true,
              true,
              false,
              true,
              true,
              true,
              false,
              true
            ]
          },
          {
            "motionOn": true,
            "smoothOn": true,
            "parameterId": 20,
            "stepEnabled": [
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true
            ]
          },
          {
            "motionOn": true,
            "smoothOn": true,
            "parameterId": 14,
            "stepEnabled": [
              false,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              false,
              false,
              true,
              true,
              true
            ]
          },
          {
            "motionOn": true,
            "smoothOn": true,
            "parameterId": 18,
            "stepEnabled": [
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true
            ]
          }
        ],
        "stepEvents": [
          {
            "noteNumber": 60,
            "velocity": 24,
            "gateTime": 127,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 1,
                "data2": 1,
                "data3": 1,
                "data4": 1
              },
              {
                "data1": 1,
                "data2": 1,
                "data3": 1,
                "data4": 1
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 99,
                "data2": 99,
                "data3": 99,
                "data4": 99
              }
            ]
          },
          {
            "noteNumber": 60,
            "velocity": 24,
            "gateTime": 127,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 2,
                "data2": 2,
                "data3": 2,
                "data4": 2
              },
              {
                "data1": 1,
                "data2": 1,
                "data3": 1,
                "data4": 1
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 53,
                "data2": 53,
                "data3": 53,
                "data4": 53
              }
            ]
          },
          {
            "noteNumber": 60,
            "velocity": 24,
            "gateTime": 127,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 1,
                "data2": 1,
                "data3": 1,
                "data4": 1
              },
              {
                "data1": 2,
                "data2": 2,
                "data3": 2,
                "data4": 2
              },
              {
                "data1": 237,
                "data2": 237,
                "data3": 237,
                "data4": 237
              },
              {
                "data1": 100,
                "data2": 100,
                "data3": 100,
                "data4": 100
              }
            ]
          },
          {
            "noteNumber": 60,
            "velocity": 24,
            "gateTime": 127,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 1,
                "data2": 1,
                "data3": 1,
                "data4": 1
              },
              {
                "data1": 1,
                "data2": 1,
                "data3": 1,
                "data4": 1
              },
              {
                "data1": 88,
                "data2": 88,
                "data3": 88,
                "data4": 88
              },
              {
                "data1": 234,
                "data2": 234,
                "data3": 234,
                "data4": 234
              }
            ]
          },
          {
            "noteNumber": 60,
            "velocity": 24,
            "gateTime": 127,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 1,
                "data2": 1,
                "data3": 1,
                "data4": 1
              },
              {
                "data1": 2,
                "data2": 2,
                "data3": 2,
                "data4": 2
              },
              {
                "data1": 73,
                "data2": 73,
                "data3": 73,
                "data4": 73
              },
              {
                "data1": 37,
                "data2": 37,
                "data3": 37,
                "data4": 37
              }
            ]
          },
          {
            "noteNumber": 60,
            "velocity": 24,
            "gateTime": 127,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 2,
                "data2": 2,
                "data3": 2,
                "data4": 2
              },
              {
                "data1": 1,
                "data2": 1,
                "data3": 1,
                "data4": 1
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 255,
                "data2": 255,
                "data3": 255,
                "data4": 255
              }
            ]
          },
          {
            "noteNumber": 60,
            "velocity": 24,
            "gateTime": 127,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 2,
                "data2": 2,
                "data3": 2,
                "data4": 2
              },
              {
                "data1": 172,
                "data2": 172,
                "data3": 172,
                "data4": 172
              },
              {
                "data1": 9,
                "data2": 9,
                "data3": 9,
                "data4": 9
              }
            ]
          },
          {
            "noteNumber": 60,
            "velocity": 24,
            "gateTime": 127,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 2,
                "data2": 2,
                "data3": 2,
                "data4": 2
              },
              {
                "data1": 1,
                "data2": 1,
                "data3": 1,
                "data4": 1
              },
              {
                "data1": 1,
                "data2": 1,
                "data3": 1,
                "data4": 1
              },
              {
                "data1": 146,
                "data2": 146,
                "data3": 146,
                "data4": 146
              }
            ]
          },
          {
            "noteNumber": 60,
            "velocity": 24,
            "gateTime": 127,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 2,
                "data2": 2,
                "data3": 2,
                "data4": 2
              },
              {
                "data1": 2,
                "data2": 2,
                "data3": 2,
                "data4": 2
              },
              {
                "data1": 199,
                "data2": 199,
                "data3": 199,
                "data4": 199
              },
              {
                "data1": 55,
                "data2": 55,
                "data3": 55,
                "data4": 55
              }
            ]
          },
          {
            "noteNumber": 60,
            "velocity": 24,
            "gateTime": 127,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 2,
                "data2": 2,
                "data3": 2,
                "data4": 2
              },
              {
                "data1": 1,
                "data2": 1,
                "data3": 1,
                "data4": 1
              },
              {
                "data1": 156,
                "data2": 156,
                "data3": 156,
                "data4": 156
              },
              {
                "data1": 67,
                "data2": 67,
                "data3": 67,
                "data4": 67
              }
            ]
          },
          {
            "noteNumber": 60,
            "velocity": 24,
            "gateTime": 127,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 2,
                "data2": 2,
                "data3": 2,
                "data4": 2
              },
              {
                "data1": 51,
                "data2": 51,
                "data3": 51,
                "data4": 51
              },
              {
                "data1": 124,
                "data2": 124,
                "data3": 124,
                "data4": 124
              }
            ]
          },
          {
            "noteNumber": 60,
            "velocity": 24,
            "gateTime": 127,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 1,
                "data2": 1,
                "data3": 1,
                "data4": 1
              },
              {
                "data1": 1,
                "data2": 1,
                "data3": 1,
                "data4": 1
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 223,
                "data2": 223,
                "data3": 223,
                "data4": 223
              }
            ]
          },
          {
            "noteNumber": 60,
            "velocity": 24,
            "gateTime": 127,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 1,
                "data2": 1,
                "data3": 1,
                "data4": 1
              },
              {
                "data1": 2,
                "data2": 2,
                "data3": 2,
                "data4": 2
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 113,
                "data2": 113,
                "data3": 113,
                "data4": 113
              }
            ]
          },
          {
            "noteNumber": 60,
            "velocity": 24,
            "gateTime": 127,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 2,
                "data2": 2,
                "data3": 2,
                "data4": 2
              },
              {
                "data1": 1,
                "data2": 1,
                "data3": 1,
                "data4": 1
              },
              {
                "data1": 141,
                "data2": 141,
                "data3": 141,
                "data4": 141
              },
              {
                "data1": 3,
                "data2": 3,
                "data3": 3,
                "data4": 3
              }
            ]
          },
          {
            "noteNumber": 60,
            "velocity": 24,
            "gateTime": 127,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 2,
                "data2": 2,
                "data3": 2,
                "data4": 2
              },
              {
                "data1": 53,
                "data2": 53,
                "data3": 53,
                "data4": 53
              },
              {
                "data1": 79,
                "data2": 79,
                "data3": 79,
                "data4": 79
              }
            ]
          },
          {
            "noteNumber": 60,
            "velocity": 24,
            "gateTime": 127,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 1,
                "data2": 1,
                "data3": 1,
                "data4": 1
              },
              {
                "data1": 1,
                "data2": 1,
                "data3": 1,
                "data4": 1
              },
              {
                "data1": 185,
                "data2": 185,
                "data3": 185,
                "data4": 185
              },
              {
                "data1": 148,
                "data2": 148,
                "data3": 148,
                "data4": 148
              }
            ]
          }
        ]
      },
      "amp": {
        "attack": 128,
        "decay": 0
      },
      "misc": {
        "bpmSync": false,
        "portamentMode": false,
        "portamentTime": 0,
        "cutoffVelocity": 0,
        "cutoffKeyTrack": 0,
        "sliderAssign": "GATE TIME"
      }
    },
    "rawData": [
      240,
      66,
      48,
      0,
      1,
      68,
      64,
      0,
      80,
      82,
      79,
      71,
      60,
      119,
      97,
      0,
      118,
      101,
      116,
      97,
      98,
      108,
      101,
      116,
      62,
      0,
      0,
      0,
      12,
      18,
      127,
      51,
      127,
      61,
      0,
      23,
      127,
      53,
      0,
      17,
      127,
      0,
      16,
      67,
      101,
      15,
      60,
      2,
      51,
      89,
      50,
      0,
      12,
      36,
      0,
      32,
      57,
      34,
      6,
      95,
      0,
      72,
      83,
      8,
      69,
      81,
      68,
      53,
      4,
      9,
      0,
      12,
      0,
      54,
      127,
      127,
      0,
      0,
      0,
      30,
      0,
      127,
      127,
      127,
      127,
      0,
      0,
      0,
      0,
      0,
      3,
      16,
      3,
      20,
      3,
      120,
      14,
      3,
      18,
      59,
      59,
      127,
      127,
      15,
      126,
      103,
      127,
      127,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      60,
      0,
      4,
      24,
      0,
      127,
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      99,
      99,
      99,
      99,
      60,
      0,
      0,
      24,
      0,
      127,
      0,
      2,
      2,
      0,
      2,
      2,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      53,
      53,
      53,
      53,
      0,
      60,
      0,
      24,
      0,
      127,
      0,
      1,
      0,
      1,
      1,
      1,
      2,
      2,
      2,
      2,
      15,
      109,
      109,
      109,
      109,
      100,
      100,
      100,
      0,
      100,
      60,
      0,
      24,
      0,
      127,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      96,
      1,
      88,
      88,
      88,
      88,
      106,
      106,
      3,
      106,
      106,
      60,
      0,
      24,
      0,
      127,
      0,
      0,
      1,
      1,
      1,
      1,
      2,
      2,
      0,
      2,
      2,
      73,
      73,
      73,
      73,
      37,
      0,
      37,
      37,
      37,
      60,
      0,
      24,
      0,
      0,
      127,
      0,
      2,
      2,
      2,
      2,
      1,
      0,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      15,
      127,
      127,
      127,
      127,
      60,
      0,
      24,
      0,
      0,
      127,
      0,
      0,
      0,
      0,
      0,
      112,
      2,
      2,
      2,
      2,
      44,
      44,
      44,
      1,
      44,
      9,
      9,
      9,
      9,
      60,
      0,
      0,
      24,
      0,
      127,
      0,
      2,
      2,
      2,
      0,
      2,
      1,
      1,
      1,
      1,
      1,
      1,
      60,
      1,
      1,
      18,
      18,
      18,
      18,
      60,
      0,
      0,
      24,
      0,
      127,
      0,
      2,
      2,
      64,
      2,
      2,
      2,
      2,
      2,
      2,
      71,
      7,
      71,
      71,
      71,
      55,
      55,
      55,
      55,
      0,
      60,
      0,
      24,
      0,
      127,
      0,
      2,
      0,
      2,
      2,
      2,
      1,
      1,
      1,
      1,
      15,
      28,
      28,
      28,
      28,
      67,
      67,
      67,
      0,
      67,
      60,
      0,
      24,
      0,
      127,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      2,
      2,
      0,
      2,
      51,
      51,
      51,
      51,
      124,
      124,
      0,
      124,
      124,
      60,
      0,
      24,
      0,
      127,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      64,
      1,
      1,
      0,
      0,
      0,
      0,
      95,
      7,
      95,
      95,
      95,
      60,
      0,
      24,
      0,
      0,
      127,
      0,
      1,
      1,
      1,
      1,
      2,
      0,
      2,
      2,
      2,
      0,
      0,
      0,
      0,
      0,
      113,
      113,
      113,
      113,
      60,
      0,
      24,
      0,
      0,
      127,
      0,
      2,
      2,
      2,
      2,
      112,
      1,
      1,
      1,
      1,
      13,
      13,
      13,
      1,
      13,
      3,
      3,
      3,
      3,
      60,
      0,
      0,
      24,
      0,
      127,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      2,
      2,
      2,
      53,
      53,
      0,
      53,
      53,
      79,
      79,
      79,
      79,
      60,
      0,
      0,
      24,
      0,
      127,
      0,
      1,
      1,
      64,
      1,
      1,
      1,
      1,
      1,
      1,
      57,
      127,
      57,
      57,
      57,
      20,
      20,
      20,
      20,
      247
    ]
  },
  {
    "name": "Lu-Fuki",
    "description": "Decoded patch from dump5.json",
    "tags": [
      "demo",
      "test",
      "decoded"
    ],
    "parameters": {
      "isValid": true,
      "patchName": "Lu-Fuki",
      "drive": 88,
      "oscillators": {
        "vco1": {
          "wave": 1,
          "shape": 0,
          "level": 1023,
          "octave": 1
        },
        "vco2": {
          "wave": 2,
          "shape": 0,
          "level": 777,
          "sync": 2,
          "pitch": 523,
          "octave": 1
        }
      },
      "filter": {
        "cutoff": 176,
        "resonance": 736
      },
      "envelope": {
        "type": 0,
        "attack": 0,
        "decay": 244,
        "intensity": 267,
        "target": 0
      },
      "lfo": {
        "wave": 2,
        "mode": 0,
        "rate": 224,
        "intensity": 346,
        "target": 0
      },
      "sequencer": {
        "stepLength": 16,
        "stepResolution": 0,
        "swing": -75,
        "stepOnOff": [
          true,
          true,
          true,
          false,
          true,
          false,
          false,
          true,
          true,
          true,
          false,
          true,
          false,
          true,
          true,
          true
        ],
        "motionOnOff": [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false
        ]
      },
      "motionSequencing": {
        "slots": [
          {
            "motionOn": false,
            "smoothOn": false,
            "parameterId": 0,
            "stepEnabled": [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false
            ]
          },
          {
            "motionOn": false,
            "smoothOn": false,
            "parameterId": 0,
            "stepEnabled": [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false
            ]
          },
          {
            "motionOn": false,
            "smoothOn": false,
            "parameterId": 0,
            "stepEnabled": [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false
            ]
          },
          {
            "motionOn": false,
            "smoothOn": false,
            "parameterId": 0,
            "stepEnabled": [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false
            ]
          }
        ],
        "stepEvents": [
          {
            "noteNumber": 51,
            "velocity": 44,
            "gateTime": 22,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 46,
            "velocity": 44,
            "gateTime": 54,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 49,
            "velocity": 43,
            "gateTime": 54,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 42,
            "velocity": 40,
            "gateTime": 54,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 51,
            "velocity": 45,
            "gateTime": 54,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 42,
            "velocity": 40,
            "gateTime": 54,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 49,
            "velocity": 40,
            "gateTime": 54,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 42,
            "velocity": 46,
            "gateTime": 22,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 44,
            "velocity": 42,
            "gateTime": 54,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 46,
            "velocity": 33,
            "gateTime": 54,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 56,
            "velocity": 39,
            "gateTime": 54,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 49,
            "velocity": 45,
            "gateTime": 54,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 61,
            "velocity": 46,
            "gateTime": 54,
            "triggerSwitch": true,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 54,
            "velocity": 42,
            "gateTime": 54,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 56,
            "velocity": 29,
            "gateTime": 54,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          },
          {
            "noteNumber": 54,
            "velocity": 45,
            "gateTime": 54,
            "triggerSwitch": false,
            "motionData": [
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              },
              {
                "data1": 0,
                "data2": 0,
                "data3": 0,
                "data4": 0
              }
            ]
          }
        ]
      },
      "amp": {
        "attack": 128,
        "decay": 0
      },
      "misc": {
        "bpmSync": false,
        "portamentMode": false,
        "portamentTime": 1,
        "cutoffVelocity": 0,
        "cutoffKeyTrack": 0,
        "sliderAssign": "PITCH BEND"
      }
    },
    "rawData": [
      240,
      66,
      48,
      0,
      1,
      68,
      64,
      0,
      80,
      82,
      79,
      71,
      76,
      117,
      45,
      0,
      70,
      117,
      107,
      105,
      0,
      0,
      0,
      84,
      0,
      0,
      0,
      0,
      2,
      0,
      127,
      37,
      66,
      44,
      56,
      0,
      61,
      66,
      56,
      25,
      86,
      22,
      80,
      19,
      102,
      7,
      0,
      2,
      35,
      2,
      50,
      0,
      12,
      36,
      1,
      32,
      56,
      34,
      6,
      112,
      0,
      72,
      83,
      8,
      69,
      81,
      68,
      104,
      3,
      16,
      0,
      12,
      0,
      22,
      127,
      127,
      0,
      0,
      0,
      6,
      0,
      23,
      107,
      0,
      0,
      2,
      96,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      51,
      0,
      0,
      44,
      0,
      22,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      46,
      0,
      0,
      44,
      0,
      54,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      49,
      0,
      43,
      0,
      54,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      32,
      0,
      42,
      0,
      40,
      0,
      54,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      51,
      0,
      45,
      0,
      54,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      42,
      0,
      40,
      0,
      1,
      54,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      49,
      0,
      40,
      2,
      0,
      54,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      42,
      0,
      0,
      46,
      0,
      22,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      44,
      0,
      0,
      42,
      0,
      54,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      46,
      0,
      33,
      0,
      54,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      32,
      0,
      56,
      0,
      39,
      0,
      54,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      49,
      0,
      45,
      0,
      54,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      61,
      0,
      46,
      0,
      1,
      54,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      54,
      0,
      42,
      0,
      0,
      54,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      56,
      0,
      0,
      29,
      0,
      54,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      54,
      0,
      0,
      45,
      0,
      54,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      247
    ]
  }
];
