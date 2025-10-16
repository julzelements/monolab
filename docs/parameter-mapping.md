# Parameter Mapping

This document shows the mapping and relationships between different parameter systems in the Monologue synthesizer.

## Overview

The Korg Monologue uses a complex parameter mapping system where values are stored across multiple bytes with different bit ranges and encoding schemes.

### Communication Methods

There are two ways the hardware can send parameter data to the application:

| Method                  | Description                      | Real-time | Parameter Coverage | Value Range             |
| ----------------------- | -------------------------------- | --------- | ------------------ | ----------------------- |
| **SysEx Program Dump**  | Complete patch data transmission | No        | All parameters     | Full precision (10-bit) |
| **MIDI Control Change** | Individual parameter updates     | Yes       | Limited subset     | 7-bit (0-127)           |

### Parameter Communication Support

Not all parameters can be controlled via MIDI CC - some are only available through SysEx program dumps:

| Parameter       | MIDI CC Support    | SysEx Support | Notes                              |
| --------------- | ------------------ | ------------- | ---------------------------------- |
| VCO 1 Pitch     | ✅ Yes (CC varies) | ✅ Yes        | Real-time pitch control available  |
| Cutoff          | ✅ Yes (CC 74)     | ✅ Yes        | Real-time filter control available |
| Resonance       | ✅ Yes (CC 71)     | ✅ Yes        | Real-time filter control available |
| Program Name    | ❌ No              | ✅ Yes        | Text data, SysEx only              |
| Sequencer Steps | ❌ No              | ✅ Yes        | Complex data structure, SysEx only |

**Key Points:**

- **SysEx dumps** contain the complete patch state with full 10-bit precision
- **MIDI CC** messages provide real-time control but with reduced 7-bit precision (0-127)
- **Complex parameters** like sequencer data and patch names are only available via SysEx
- **Real-time performance** parameters typically support both methods

## Parameter Storage Structure

```mermaid
graph TD
    A[Program Data] --> B[VCO Parameters]
    A --> C[Filter Parameters]
    A --> D[Envelope Parameters]
    A --> E[LFO Parameters]
    A --> F[Sequencer Parameters]

    B --> B1[VCO 1 Pitch<br/>Offset 16 + 30:0-1]
    B --> B2[VCO 1 Shape<br/>Offset 17 + 30:2-3]
    B --> B3[VCO 1 Level<br/>Offset 20 + 33:0-1]
    B --> B4[VCO 1 Wave<br/>Offset 30:6-7]
    B --> B5[VCO 1 Octave<br/>Offset 30:4-5]

    B --> B6[VCO 2 Pitch<br/>Offset 18 + 31:0-1]
    B --> B7[VCO 2 Shape<br/>Offset 19 + 31:2-3]
    B --> B8[VCO 2 Level<br/>Offset 21 + 33:2-3]
    B --> B9[VCO 2 Wave<br/>Offset 31:6-7]
    B --> B10[VCO 2 Octave<br/>Offset 31:4-5]

    C --> C1[Cutoff<br/>Offset 22 + 33:4-5]
    C --> C2[Resonance<br/>Offset 23 + 33:6-7]

    D --> D1[Attack<br/>Offset 24 + 34:2-3]
    D --> D2[Decay<br/>Offset 25 + 34:4-5]
    D --> D3[EG Intensity<br/>Offset 28 + 35:0-1]
    D --> D4[EG Type<br/>Offset 34:0-1]
    D --> D5[EG Target<br/>Offset 34:6-7]

    E --> E1[LFO Rate<br/>Offset 27 + 35:2-3]
    E --> E2[LFO Intensity<br/>Offset 28 + 35:4-5]
    E --> E3[LFO Type<br/>Offset 36:0-1]
    E --> E4[LFO Mode<br/>Offset 36:2-3]
    E --> E5[LFO Target<br/>Offset 36:4-5]
```

## 10-bit Parameter Encoding

Many parameters use 10-bit values (0-1023) stored across two bytes:

```mermaid
graph LR
    A[10-bit Value<br/>0-1023] --> B[Upper 8 bits<br/>Offset N]
    A --> C[Lower 2 bits<br/>Offset M:X-Y]

    B --> D[Bits 2-9]
    C --> E[Bits 0-1]

    D --> F[Combined Value]
    E --> F
```

## Wave Type Mapping

```mermaid
graph TD
    A[Wave Types] --> B[VCO 1 Wave]
    A --> C[VCO 2 Wave]
    A --> D[LFO Wave]

    B --> B1[0: Square]
    B --> B2[1: Triangle]
    B --> B3[2: Sawtooth]

    C --> C1[0: Noise]
    C --> C2[1: Triangle]
    C --> C3[2: Sawtooth]

    D --> D1[0: Square]
    D --> D2[1: Triangle]
    D --> D3[2: Sawtooth]
```

## Sequencer Structure

```mermaid
graph TD
    A[Sequencer Data] --> B[Global Settings]
    A --> C[Step Settings]
    A --> D[Motion Slots]

    B --> B1[BPM<br/>Offset 52-53]
    B --> B2[Step Length<br/>Offset 54]
    B --> B3[Resolution<br/>Offset 55]
    B --> B4[Swing<br/>Offset 56]

    C --> C1[Step On/Off<br/>Offset 64-65]
    C --> C2[Motion On/Off<br/>Offset 66-67]
    C --> C3[Slide On/Off<br/>Offset 68-69]

    D --> D1[Motion Slot 1<br/>Offset 72-73]
    D --> D2[Motion Slot 2<br/>Offset 74-75]
    D --> D3[Motion Slot 3<br/>Offset 76-77]
    D --> D4[Motion Slot 4<br/>Offset 78-79]

    C --> E[Step Event Data<br/>96-447]
    E --> E1[Note Number]
    E --> E2[Velocity]
    E --> E3[Gate Time]
    E --> E4[Motion Data]
```

## Parameter Value Ranges

| Parameter     | Range  | Notes                   |
| ------------- | ------ | ----------------------- |
| VCO Pitch     | 0-1023 | Special cent mapping    |
| VCO Shape     | 0-1023 | Wave shape modulation   |
| VCO Level     | 0-1023 | Oscillator level        |
| Cutoff        | 0-1023 | Filter cutoff frequency |
| Resonance     | 0-1023 | Filter resonance        |
| EG Attack     | 0-1023 | Envelope attack time    |
| EG Decay      | 0-1023 | Envelope decay time     |
| LFO Rate      | 0-1023 | LFO speed               |
| LFO Intensity | 0-1023 | LFO modulation depth    |
| Drive         | 0-1023 | Overdrive amount        |

## Special Mappings

### VCO Pitch Mapping (Cents)

```mermaid
xychart-beta
    title "VCO Pitch Mapping: Parameter Value vs Cents"
    x-axis "Parameter Value" 0 --> 1023
    y-axis "Pitch (Cents)" -1200 --> 1200
    line [0, 4, 356, 476, 492, 532, 548, 668, 1020, 1023]
    line [-1200, -1200, -256, -16, 0, 0, 16, 256, 1200, 1200]
```

| Value Range | Cent Range    | Notes                     |
| ----------- | ------------- | ------------------------- |
| 0 - 4       | -1200         | Fixed at -1200 cents      |
| 4 - 356     | -1200 to -256 | Linear interpolation      |
| 356 - 476   | -256 to -16   | Linear interpolation      |
| 476 - 492   | -16 to 0      | Linear interpolation      |
| 492 - 532   | 0             | Fixed at 0 cents (center) |
| 532 - 548   | 0 to 16       | Linear interpolation      |
| 548 - 668   | 16 to 256     | Linear interpolation      |
| 668 - 1020  | 256 to 1200   | Linear interpolation      |
| 1020 - 1023 | 1200          | Fixed at +1200 cents      |

### LFO Rate BPM Sync Mapping

```mermaid
graph TD
    A[BPM Sync Mode] --> B[Different Rate Mappings]

    B --> C[0-63: 4 beats]
    B --> D[64-127: 2 beats]
    B --> E[128-191: 1 beat]
    B --> F[192-255: 3/4 beat]
    B --> G[256-319: 1/2 beat]
    B --> H[320-383: 3/8 beat]
    B --> I[384-447: 1/3 beat]
    B --> J[448-511: 1/4 beat]
    B --> K[512-575: 3/16 beat]
    B --> L[576-639: 1/6 beat]
    B --> M[640-703: 1/8 beat]
    B --> N[704-767: 1/12 beat]
    B --> O[768-831: 1/16 beat]
    B --> P[832-895: 1/24 beat]
    B --> Q[896-959: 1/32 beat]
    B --> R[960-1023: 1/36 beat]
```

## Data Flow

```mermaid
flowchart LR
    A[Hardware Knobs] --> B[MIDI CC Values<br/>0-127]
    B --> C[Parameter Conversion<br/>Scale to 0-1023]
    C --> D[Split into Bytes<br/>Upper 8 + Lower 2]
    D --> E[Store in SysEx<br/>Multiple Offsets]
    E --> F[Transmit as<br/>Program Dump]

    F --> G[Receive SysEx]
    G --> H[Parse Bytes]
    H --> I[Reconstruct 10-bit<br/>Values]
    I --> J[Apply to Synth<br/>Parameters]
```

This diagram shows how parameter values flow from hardware controls through MIDI processing to final synthesizer parameter application.
