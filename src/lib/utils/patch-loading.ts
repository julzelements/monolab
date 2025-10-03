import { type MonologueParameters } from "@/lib/sysex";

export interface PatchSummary {
  id: string;
  name: string;
  description?: string;
  authorName?: string;
  createdAt: string;
  isPublic: boolean;
  parameters?: MonologueParameters;
}

export interface PatchDetail extends PatchSummary {
  sysexData: number[];
}

export async function fetchPatches(limit: number = 50): Promise<PatchSummary[]> {
  const response = await fetch(`/api/patches?limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch patches: ${response.statusText}`);
  }
  
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch patches');
  }
  
  return result.data;
}

export async function fetchPatch(id: string): Promise<PatchDetail> {
  const response = await fetch(`/api/patches/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch patch: ${response.statusText}`);
  }
  
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch patch');
  }
  
  return result.data;
}