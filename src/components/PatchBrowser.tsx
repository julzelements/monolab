import { useState, useEffect } from 'react';
import { fetchPatches, type PatchSummary } from '@/lib/utils/patch-loading';
import { type MonologueParameters } from '@/lib/sysex';

interface PatchBrowserProps {
  onPatchLoad: (parameters: MonologueParameters) => void;
}

export function PatchBrowser({ onPatchLoad }: PatchBrowserProps) {
  const [patches, setPatches] = useState<PatchSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingPatchId, setLoadingPatchId] = useState<string | null>(null);

  useEffect(() => {
    loadPatches();
  }, []);

  async function loadPatches() {
    setLoading(true);
    setError(null);
    try {
      const patchList = await fetchPatches(20);
      setPatches(patchList);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadPatch(patch: PatchSummary) {
    if (!patch.parameters) {
      setError('Patch parameters not available');
      return;
    }

    setLoadingPatchId(patch.id);
    try {
      onPatchLoad(patch.parameters);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingPatchId(null);
    }
  }

  if (loading) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="font-medium mb-2">📦 Load Patch</h3>
        <div className="text-gray-600">Loading patches...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">📦 Load Patch</h3>
        <button
          onClick={loadPatches}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>
      </div>
      
      {error && (
        <div className="text-red-600 text-sm mb-3">
          {error}
        </div>
      )}

      {patches.length === 0 ? (
        <div className="text-gray-600 text-sm">
          No saved patches found. Save a patch to see it here!
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {patches.map((patch) => (
            <div
              key={patch.id}
              className="p-3 bg-white rounded border hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {patch.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {patch.authorName && `by ${patch.authorName} • `}
                    {new Date(patch.createdAt).toLocaleDateString()}
                  </div>
                  {patch.description && (
                    <div className="text-xs text-gray-600 mt-1 truncate">
                      {patch.description}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleLoadPatch(patch)}
                  disabled={loadingPatchId === patch.id || !patch.parameters}
                  className="ml-2 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loadingPatchId === patch.id ? '...' : 'Load'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}