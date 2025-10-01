import React, { useState, useRef, useCallback } from "react";

interface KnobProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: number;
  label?: string;
  className?: string;
}

export function Knob({ value, min = 0, max = 127, onChange, size = 80, label, className = "" }: KnobProps) {
  const [isDragging, setIsDragging] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);

  // Convert value to angle (240° to 300° with 300° total range)
  const minAngle = 240; // Starting angle in degrees (bottom-left)
  const maxAngle = 300; // Ending angle in degrees (bottom-right)
  const angleRange = 300; // Total degrees of rotation (almost full circle)

  const valueToAngle = useCallback(
    (val: number) => {
      const normalizedValue = (val - min) / (max - min);
      // Adjust by -30° to align properly: start at 210°, sweep 300° total
      let angle = 210 + normalizedValue * 300;
      
      // Handle wraparound: normalize angle to 0-360 range
      while (angle >= 360) {
        angle -= 360;
      }
      while (angle < 0) {
        angle += 360;
      }
      
      return angle;
    },
    [min, max]
  );

  const currentAngle = valueToAngle(value);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const startMouseY = e.clientY;
    const startVal = value;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();

      // Calculate the change in Y position (inverted for natural feel)
      const deltaY = startMouseY - e.clientY;

      // Sensitivity: how much the value changes per pixel moved
      const sensitivity = (max - min) / 200; // Full range over 200 pixels

      // Calculate new value
      const newValue = Math.max(min, Math.min(max, startVal + deltaY * sensitivity));

      onChange(Math.round(newValue));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    // Add global mouse move and mouse up listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Cleanup effect for any remaining global listeners (safety net)
  React.useEffect(() => {
    return () => {
      // Remove any remaining listeners on unmount
      setIsDragging(false);
    };
  }, []);

  const knobStyle = {
    width: size,
    height: size,
    cursor: isDragging ? "grabbing" : "grab",
  };

  const pointerStyle = {
    transform: `rotate(${currentAngle}deg)`,
    transformOrigin: "center",
  };

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      {label && <label className="text-sm font-medium text-center">{label}</label>}

      <div className="relative">
        {/* Knob background track */}
        <div
          ref={knobRef}
          style={knobStyle}
          className="relative rounded-full bg-gradient-to-br from-gray-300 to-gray-500 border-2 border-gray-400 shadow-lg select-none"
          onMouseDown={handleMouseDown}
        >
          {/* Knob face */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 shadow-inner">
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            </div>

            {/* Pointer indicator */}
            <div style={pointerStyle} className="absolute inset-0 flex items-start justify-center pt-1">
              <div className="w-1 h-6 bg-red-500 rounded-full shadow"></div>
            </div>
          </div>

          {/* Drag overlay */}
          {isDragging && <div className="absolute inset-0 rounded-full bg-blue-500 bg-opacity-20"></div>}
        </div>

        {/* Value display */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <span className="text-xs font-mono bg-gray-800 text-white px-2 py-1 rounded">
            {value} ({Math.round(currentAngle)}°)
          </span>
        </div>
      </div>

      {/* Range indicators */}
      <div className="flex justify-between w-full px-2 text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
