import { describe, it, expect } from 'vitest';
import { decodeMonologueParameters } from '../decoder';
import { diffMonologueParameters } from '../parameter-diff';
import fs from 'fs';
import path from 'path';

const dump1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'dumps', 'dump1.json'), 'utf8'));
const dump2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'dumps', 'dump2.json'), 'utf8'));

const params1 = decodeMonologueParameters(dump1.rawData);
const params2 = decodeMonologueParameters(dump2.rawData);

describe('Parameter diff', () => {
  it('detects differences between two parameter sets', () => {
    const diffs = diffMonologueParameters(params1, params2);
    expect(diffs.length).toBeGreaterThan(0);
    // Spot check at least one known differing path
    const hasDrive = diffs.some(d => d.path === 'drive');
    expect(hasDrive).toBe(true);
  });

  it('returns empty diff for identical object', () => {
    const diffs = diffMonologueParameters(params1, params1);
    expect(diffs).toEqual([]);
  });
});
