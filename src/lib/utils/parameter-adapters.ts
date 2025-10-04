import { MonologueParameters } from "@/lib/sysex/decoder";

/**
 * Helper function to get nested parameter value from MonologueParameters
 */
export function getParameterValue(parameters: MonologueParameters, path: string): number {
  const pathParts = path.split(".");
  let current: any = parameters;

  for (const part of pathParts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      console.warn(`Parameter path '${path}' not found`);
      return 0;
    }
  }

  return typeof current === "number" ? current : 0;
}

/**
 * Helper function to set nested parameter value in MonologueParameters
 */
export function setParameterValue(parameters: MonologueParameters, path: string, value: number): MonologueParameters {
  const pathParts = path.split(".");
  const result = JSON.parse(JSON.stringify(parameters)); // Deep clone
  let current: any = result;

  // Navigate to the parent object
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    if (!current[part]) {
      current[part] = {};
    }
    current = current[part];
  }

  // Set the final value
  const finalKey = pathParts[pathParts.length - 1];
  current[finalKey] = value;

  return result;
}

/**
 * Creates a parameter change callback that updates MonologueParameters directly
 */
export function createParameterCallback(
  parameters: MonologueParameters,
  onParametersChange: (params: MonologueParameters) => void
) {
  return (path: string, value: number) => {
    const updatedParameters = setParameterValue(parameters, path, value);
    onParametersChange(updatedParameters);
  };
}
