# Korg Monologue SysEx Library

Complete encoder/decoder system for Korg Monologue SysEx data with dual-parser architecture supporting both MVP UI functionality and comprehensive MIDI specification compliance.

## Architecture Overview

### SysEx Format

- **Total Size**: 520 bytes
- **Data Section**: 512 bytes (7-bit MIDI data with high bits packed)
- **Transformation**: 512 data bytes / 8 \* 7 = 448 bytes after conversion
- **Bit Packing**: High bits stored separately and recombined during decoding

### Core Components

#### 🔧 Low-Level Transformation & Round-Trip (`encoder.ts`, `utilities.ts`)

- **7↔8 bit transformation** for MIDI SysEx format conversion
- Bit manipulation utilities for high-bit packing/unpacking
- Validation functions for data integrity

#### 🎹 Comprehensive Parameter Decoder (`decoder.ts`)

- **Purpose**: Complete MIDI spec implementation for full parameter access
- **Interface**: `MonologueParameters` (all parameters from official spec)
- **Size**: 220 lines - comprehensive parameter support
- **Usage**: Foundation for round-trip encoding and future development
- **Test Status**: ✅ 8/8 tests passing

#### 🔄 Round-Trip Encoder (Unified)

- **Purpose**: Converts `MonologueParameters` back to SysEx for perfect round-trip
- **Status**: ✅ Fully integrated into `encoder.ts` (all test dumps pass)
- **Implementation**: Shares bit helpers from `utilities.ts`

#### 🧪 Validation Helpers

- `validateMonologueParameters(params)` → Non-throwing validation result before encoding

## Usage Patterns

### For Comprehensive Parameter Access

```typescript
import { decodeMonologueParameters, MonologueParameters } from "@/lib/sysex";

const allParams = decodeMonologueParameters(sysexData);
// Access to VCO, VCF, EG, LFO, sequencer, motion sequencing, etc.
```

### For Round-Trip Encoding (Future)

```typescript
import { decodeMonologueParameters, encodeMonologueParameters } from "@/lib/sysex";

const params = decodeMonologueParameters(originalSysex);
// Modify parameters...
params.vcf.cutoff = 127;
const modifiedSysex = encodeMonologueParameters(params);
```

## Development History

This library evolved through several phases:

1. **Initial MVP**: Basic VCF parameter extraction for UI components
2. **Comprehensive Implementation**: Full MIDI spec support based on official documentation
3. **Round-Trip Architecture**: Perfect encode→decode→encode fidelity (in progress)
4. **Dual Parser Strategy**: Specialized implementations for different use cases

## File Structure

```
src/lib/sysex/
├── index.ts              # Public API with clear usage documentation
├── README.md             # This documentation
├── encoder.ts            # 7↔8 bit transformation + unified round-trip encoder + validation
├── utilities.ts          # Bit manipulation helpers
├── monologue-parser.ts   # MVP parser (VCF + patch names)
├── decoder.ts            # Comprehensive parser (full MIDI spec)
└── tests/                # Comprehensive test suites for all components
```

## Testing

- **MVP Parser**: 9/9 tests passing (focused on VCF parameters)
- **Comprehensive Decoder**: 8/8 tests passing (full parameter extraction)
- **Round-Trip Encoding**: 5/5 dumps passing (100% success rate)

## Future Development

The dual-parser approach enables:

- **Immediate Production Use**: MVP parser handles current UI requirements
- **Future Expansion**: Comprehensive decoder ready for additional features
- **Perfect Round-Trip**: Foundation for patch editing and saving workflows

Choose the appropriate parser based on your requirements:

- **Light & Fast**: `monologue-parser.ts` for VCF controls
- **Complete & Future-Ready**: `decoder.ts` for comprehensive access

## Mapping specs
