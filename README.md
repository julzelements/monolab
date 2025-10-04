# Monolab

A web-based patch manager and real-time editor for the **Korg Monologue** synthesizer, featuring bidirectional MIDI communication and a complete hardware-mirrored interface.

## ✨ Features

### 🎛️ Complete Hardware Interface

- **Full Panel UI**: All Monologue parameters accessible through web interface
- **Real-time Sync**: Hardware changes instantly reflected in UI and vice versa
- **Invertible Parameters**: INT knobs with NORM/INV toggle functionality
- **Visual Feedback**: Color-coded controls matching hardware design

### 🔄 MIDI Communication

- **Bidirectional Control**: Send and receive MIDI CC messages
- **Hardware Sync**: Turn knobs on Monologue to see UI update in real-time
- **Parameter Feedback**: Elegant loop prevention for smooth interaction
- **SysEx Support**: Full program dump encoding/decoding

### 🧪 Test Coverage

- **Comprehensive Test Suite**: Playwright E2E tests for all controls
- **MIDI Testing**: Mock MIDI environment for reliable automation
- **Parameter Validation**: Round-trip encode/decode verification
- **Hardware Simulation**: Test hardware interactions without physical device

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Chrome/Edge browser (for Web MIDI API)
- Korg Monologue (optional for full experience)

### Installation

1. **Clone and install**:

   ```bash
   git clone <repository-url>
   cd monolab
   npm install
   ```

2. **Set up environment**:

   ```bash
   cp .env.example .env.local
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

4. **Open browser** to `http://localhost:3000`

### Docker Development

```bash
npm run docker:dev
```

---

## � Using Monolab

1. **Connect your Korg Monologue** via USB
2. **Allow MIDI access** when prompted by browser
3. **Turn knobs on hardware** → see UI controls move in real-time
4. **Adjust UI controls** → hear changes on the synthesizer
5. **Toggle INT knobs** between NORM/INV modes for creative modulation

### Special Features

**Invertible Parameters (INT Knobs)**:

- EG and LFO intensity knobs support positive/negative values
- Click NORM/INV toggle to flip parameter sign
- Visual feedback with color changes when inverted
- Hardware integration maintains toggle state

---

## 🛠️ Development

### Project Structure

```
src/
├── app/                           # Next.js app directory
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Main application page
│   └── api/patches/              # Patch save/load API routes
├── components/
│   ├── Panel.tsx                 # Main hardware panel component
│   ├── PanelWithMIDI.tsx        # Panel with MIDI integration
│   ├── controlGroups/           # Reusable control components
│   │   ├── Knob.tsx            # Rotary knob control
│   │   ├── InvertToggle.tsx    # NORM/INV toggle button
│   │   └── SwitchContainer.tsx # Multi-position switches
│   └── panelSections/          # Hardware section components
│       ├── Envelope.tsx        # EG section with INT knob
│       ├── LFO.tsx            # LFO section with INT knob
│       ├── Filter.tsx         # VCF controls
│       ├── VCO1.tsx          # VCO1 oscillator
│       ├── VCO2.tsx          # VCO2 oscillator
│       └── Mixer.tsx         # Level controls
├── lib/
│   ├── sysex/                  # SysEx encode/decode system
│   ├── services/               # Business logic services
│   └── utils/                  # Helper utilities
├── types/                      # TypeScript definitions
├── utils/                      # MIDI and conversion utilities
└── tests/                      # Playwright E2E tests
```

### Key Architecture Decisions

**Component Hierarchy**:

- `PanelWithMIDI` → `Panel` → Section Components → Control Groups
- Separation of concerns: MIDI logic separate from UI components
- Reusable control components with consistent interfaces

**MIDI System**:

- `simple-midi.ts`: Core MIDI communication with feedback prevention
- `midi-cc.ts`: Parameter to MIDI CC mapping and conversion
- `conversions.ts`: Value conversion utilities for different parameter types

**Test Architecture**:

- Comprehensive E2E tests using Playwright
- Mock MIDI can act as a virtual device to send and recieve midi

---

### MIDI Implementation

**Parameter Control**:

- All Monologue parameters mapped to MIDI CC values
- Bidirectional communication with elegant feedback loop prevention
- Special handling for invertible parameters (EG/LFO intensity)

**Key MIDI CCs**:

```
Drive:        CC 5   (0-127)
VCO1 Shape:   CC 16  (0-127)
VCO2 Pitch:   CC 17  (0-127)
VCO1 Mix:     CC 32  (0-127)
VCO2 Mix:     CC 33  (0-127)
Cutoff:       CC 74  (0-127)
Resonance:    CC 71  (0-127)
Attack:       CC 73  (0-127)
Decay:        CC 75  (0-127)
EG INT:       CC 25  (0-127, internally -511 to +511)
LFO Rate:     CC 76  (0-127)
LFO INT:      CC 26  (0-127, internally -511 to +511)
```

---

## � Current Status

### ✅ Implemented Features

- **Complete Hardware Panel UI** - All Monologue sections represented
- **Bidirectional MIDI Communication** - Real-time hardware ↔ software sync
- **Invertible INT Knobs** - EG/LFO intensity with NORM/INV toggles
- **Comprehensive Test Suite** - E2E tests for all controls and MIDI interactions
- **Parameter Feedback Prevention** - Elegant loop prevention for smooth UX
- **SysEx System** - Full program dump encoding/decoding (foundation)
- **Responsive Design** - Works on desktop and mobile devices

### 🚧 In Development

- **Patch Save/Load System** - Database integration and persistence
- **Hardware Dump Integration** - Capture real SysEx from device
- **UI Polish** - Visual improvements and user experience refinements

### 📅 Roadmap

**Phase 1: Core Patch Management** (Next)

- [ ] Complete patch save/load functionality
- [ ] Hardware program dump capture
- [ ] Patch library with search/filter
- [ ] Import/export SysEx files

**Phase 2: Sharing & Collaboration**

- [ ] Patch sharing via URLs
- [ ] Public patch library
- [ ] User accounts and authentication
- [ ] Patch versioning and forking

**Phase 3: Creative Tools**

- [ ] Patch randomizer/generator
- [ ] Parameter comparison/diff tools
- [ ] Patch audition with built-in sequencer
- [ ] Advanced categorization and tagging

---

## 🎛️ Invertible Parameter System

### Overview

The Monologue's EG and LFO intensity parameters are **invertible**, meaning they can have positive or negative values. This is represented in the UI with special INT knobs that have NORM/INV toggle buttons.

### Technical Implementation

**Value Range**:

- Internal range: `-511` to `+511` (sysex)
- MIDI CC range: `0` to `127` (standard)
- Visual angle: Same for both positive and negative values

**State Management**:

- Knob value determines sign: `props.intensity < 0` = inverted
- Toggle button reflects current state visually
- Clicking toggle flips the sign while preserving magnitude
- Zero value requires knob movement before toggle is visible

**Key Design Decisions**:

1. **Separate Components**: Toggle button outside knob component for cleaner state management
2. **Visual Consistency**: Same knob angle for +250 and -250 values
3. **Test IDs**: Specific test targeting for reliable automation
4. **Zero Handling**: Toggle only effective when knob is away from center

### Testing Considerations

- Tests move knob away from zero before testing toggle functionality
- Mock MIDI environment simulates hardware interactions
- Specific test IDs ensure reliable element targeting

---

## 🧪 Testing

### Running Tests

```bash
# Run all E2E tests
npm run test:playwright

# Run tests in UI mode
npm run test:playwright:ui

# Run tests in headed mode (see browser)
npm run test:playwright:headed

# Run specific test file
npm run test:playwright -- tests/midi-cc/intKnobs.spec.ts
```

### Test Categories

- **Parameter Tests**: Verify MIDI CC output for all controls
- **Hardware Simulation**: Mock MIDI input to test UI updates
- **INT Knob Tests**: Special tests for invertible parameter functionality
- **Visual Tests**: Screenshot comparison for UI consistency

### SysEx Tests

```bash
# Run SysEx encode/decode tests
npm test

# Run with verbose debug output
MONOLOGUE_SYSEX_TEST_DEBUG=1 npm test
```

---

## 🔧 Development Notes

### Patch Save System (In Progress)

Current implementation includes foundation for patch management:

- SysEx encoding/decoding system
- Database schema with deduplication
- API endpoints for patch operations
- Validation and safety checks

**Next Steps**:

- Connect real hardware SysEx capture
- Implement patch library UI
- Add authentication for user patches
- Enable import/export functionality

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."  # For migrations

# Development
NEXT_PUBLIC_CLASSROOM_MODE="false"  # Enables debug features
MONOLOGUE_SYSEX_TEST_DEBUG="1"     # Verbose test output
```

---

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Run tests: `npm test && npm run test:playwright`
4. Submit a pull request

### Code Style

- TypeScript with strict mode
- Prettier for formatting
- ESLint for code quality
- Test-driven development for new features

### Adding New Parameters

1. Update MIDI CC mapping in `midi-cc.ts`
2. Add UI controls in appropriate panel section
3. Create E2E tests for the new parameter
4. Update documentation

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 🙏 Acknowledgments

- Korg for the Monologue synthesizer
- Web MIDI API community
- Next.js and React teams
- Playwright testing framework

---

## 🧪 Test Suite & Debug Logging

The project includes a comprehensive SysEx test suite (round‑trip encode/decode, full parameter extraction, validation, diff, and safety wrappers).

By default tests run quietly. To enable verbose diagnostic logging for round‑trip and parameter extraction tests, set an environment variable:

```bash
MONOLOGUE_SYSEX_TEST_DEBUG=1 npm test --silent
```

Or for a single run (non watch mode):

```bash
MONOLOGUE_SYSEX_TEST_DEBUG=1 npx vitest --run
```

What it shows when enabled:

- Round‑trip parse/encode status per SysEx dump
- Parameter extraction summaries (patch name, drive, key oscillator + filter values)
- Placeholder TODO traces for future extended spec assertions

Leave the flag unset for CI or routine local runs to keep output minimal.

### Adding New Tests

1. Place new test files in `src/lib/sysex/tests/`.
2. Import from `src/lib/sysex/index.ts` where possible (public API) instead of deep paths.
3. If adding large fixture data, store raw dumps under `src/lib/sysex/tests/data/`.
4. Keep noisy inspection logs behind the `MONOLOGUE_SYSEX_TEST_DEBUG` gate.

---

---

## 🎯 Original Specification

See the full [Monolab Functional Specification](#monolab--functional-specification) below for the complete vision.

---

# Monolab – Functional Specification

Monolab is a web-based patch manager and editor for the **Korg Monologue**, enabling real-time two-way communication between hardware and browser UI.

---

## 🎯 MVP Functionality (Version 1)

### 🔹 Core Patch Flows

1. **Receive patch from synth**

   - Request current program from the Monologue (SysEx dump → parsed → displayed in UI).
   - Option to save into library.

2. **Send patch to synth**

   - Select stored patch → serialize to SysEx → send to hardware.
   - Option to overwrite current buffer or write to a bank slot.

3. **UI → Hardware parameter changes**

   - User tweaks sliders/knobs in the web UI.
   - WebMIDI sends CC messages in real-time to the synth.

4. **Hardware → UI parameter changes**

   - User tweaks knobs/faders on the Monologue.
   - Monologue sends CC/SysEx parameter updates.
   - React state updates → UI instantly reflects hardware changes.

5. **Edit patch parameters in UI**

   - All Monologue parameters exposed as interactive controls.
   - Changes saved to current patch state.

6. **Save patch to library**

   - Save current patch with metadata (name, tags, author, version).
   - Stored in persistent DB.

7. **Load patch from library**
   - Search/filter patches.
   - Load into UI state.
   - Option to send to synth immediately.

---

### 🔹 Library / Patch Management

8. **Search & filter patches**

   - By name, tag, category, or date.

9. **Organize patches**

   - Basic banks/collections support.

10. **Export / Import patches**

    - Export single patch as SysEx.
    - Import SysEx file → convert into patch entry.

11. **Persistence**
    - Patches stored in a persistent backend database.
    - User library survives refresh and device changes.

---

### 🔹 Sharing

12. **Patch sharing via URL**
    - Encode SysEx dump in URL-safe format (e.g., Base64 or compressed string).
    - Open shared URL → Monolab decodes SysEx → loads patch into editor.
    - No login required.

---

### 🔹 Device & Settings

13. **Device detection**

    - List connected MIDI devices.
    - User selects Monologue input/output ports.

14. **App settings**
    - Default MIDI port.
    - Theme (dark/light mode).

---

## 🚀 Phase 2+ Functionality (Future Versions)

### 🔹 Extended Library Features

15. **Patch versioning**

    - Save multiple versions of a patch.
    - Restore history.

16. **Tagging & advanced metadata**

    - Categorization (e.g., “Lead”, “Bass”, “FX”).
    - Notes/annotations.

17. **Batch export/import**
    - Export bank as `.syx`.
    - Import full banks.

---

### 🔹 Creative Tools

18. **Patch randomizer**

    - Generate new sounds with parameter ranges.

19. **Patch comparison / diff**

    - Visualize parameter differences between patches.

20. **Patch audition**
    - Play demo sequence/arpeggiator to preview patch.

---

## ✅ Summary

- **MVP = Real-time patch editing + library with persistence + import/export + URL sharing.**
- **Phase 2+ = Advanced library tools + randomizer + audition features.**

This ensures Monolab starts with **core patch management and true bi-directional sync**, while enabling **easy patch sharing** as a core differentiator.
