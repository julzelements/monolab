# Monolab – MVP (Cutoff & Resonance Controller)

A simplified MVP version of Monolab focusing on real-time VCF (filter) control for the **Korg Monologue** synthesizer.

## 🎯 MVP Features

- **Real-time VCF Control**: Cutoff and Resonance sliders with bidirectional MIDI communication
- **Hardware Sync**: Changes on the Monologue hardware are instantly reflected in the web UI
- **Simple Interface**: Clean, responsive interface focused on essential filter controls

---

## 🚀 Quick Start

### Option 1: Local Development (No Docker)

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment**:

   ```bash
   cp .env.example .env.local
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:3000`

### Option 2: Docker Development

1. **Start the development environment**:

   ```bash
   npm run docker:dev
   ```

2. **Open your browser** to `http://localhost:3000`

---

## 🎛️ Using the Controller

1. **Connect your Korg Monologue** via USB
2. **Allow MIDI access** when prompted by your browser
3. **Move the sliders** in the web interface to control cutoff and resonance
4. **Turn knobs on the hardware** to see the UI update in real-time

---

## 🛠️ Development

### Project Structure (MVP)

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page with VCF controls
├── components/
│   └── VCFControls.tsx   # Main filter control component
├── types/
│   └── mvp.ts           # Simplified types for MVP
└── utils/
    └── simple-midi.ts   # Simplified MIDI utilities
```

### MIDI Implementation

The MVP uses the Web MIDI API to communicate with the Monologue:

- **Cutoff**: CC 74 (0-127)
- **Resonance**: CC 71 (0-127)

### Next Steps

After the MVP is working, the next iterations will add:

- More parameters (VCO, EG, LFO, etc.)
- Patch save/load functionality
- Patch sharing via URLs
- Full database integration

---

## 📦 Patch Save Flow (Implemented Skeleton)

Current codebase now includes an initial end-to-end path for saving a raw Monologue program dump (520-byte SysEx) to the database:

1. UI button (temporary) in `src/app/page.tsx` prepares a 520-byte placeholder buffer.
2. Client helper `savePatch` (`src/lib/utils/patch-saving.ts`) POSTs to `/api/patches`.
3. API route `src/app/api/patches/route.ts` validates payload and invokes `PatchService.createFromSysEx`.
4. `PatchService` (`src/lib/services/patch-service.ts`) decodes full parameters, hashes SysEx (SHA-256), dedups, and persists.

### Added Schema Fields (Pending Migration Execution)

- `sysexHash` (unique) – deduplication + lookup
- `sourcePatchId` – future forking lineage
- `deletedAt` – soft delete support

### Next Wiring Tasks

- Capture real incoming SysEx dump from device (replace dummy buffer)
- Implement actual DB migration (currently generate failed due to env var; provide `DIRECT_URL` or remove field temporarily)
- Add GET endpoints for listing patches (own/public)
- Filter out soft-deleted patches (`deletedAt is null`)
- Auth integration to set `authorId` (currently anonymous fallback)
- UI feedback improvements (loading states, error banners)
- Fork & Favorite flows (future)

### Validation / Safety

- Length check enforces 520-byte program dumps
- Decode failure aborts save (returns 500 with message)
- Dedup returns existing ID with `created:false`

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
