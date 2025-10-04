"use client";
import { memo } from "react";

interface InvertToggleProps {
  paramName: string;
  testId?: string; // Optional unique test ID
  isInverted: boolean;
  onToggle: () => void;
  invertedColor?: string;
}

const InvertToggle = memo((props: InvertToggleProps) => {
  InvertToggle.displayName = "InvertToggle";

  return (
    <button
      onClick={props.onToggle}
      style={{
        fontSize: "10px",
        padding: "2px 6px",
        marginTop: "2px",
        borderRadius: "3px",
        border: "1px solid #ccc",
        background: props.isInverted ? props.invertedColor || "#ff9500" : "#f0f0f0",
        color: props.isInverted ? "white" : "black",
        cursor: "pointer",
        fontWeight: "bold",
      }}
      data-testid={props.testId || `${props.paramName}-invert-toggle`}
    >
      {props.isInverted ? "INV" : "NORM"}
    </button>
  );
});

export default InvertToggle;
