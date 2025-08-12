// components/nav/FontControls.tsx
import React from "react";
import { Button } from "@workspace/ui";
import { Separator } from "@workspace/ui";

interface FontControlsProps {
  onSpacingChange: (spacing: "compact" | "normal" | "relaxed") => void;
  onFontSizeChange: (change: "small" | "base" | "large") => void;
  currentSpacing: string;
  currentFontSize: string;
}

export const FontControls: React.FC<FontControlsProps> = ({
  onSpacingChange,
  onFontSizeChange,
  currentSpacing,
  currentFontSize,
}) => {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Spacing Controls */}
      <div className="flex items-center gap-2 flex-1 md:flex-initial">
        <Button
          variant={currentSpacing === "compact" ? "default" : "outline"}
          size="sm"
          onClick={() => onSpacingChange("compact")}
        >
          AB
        </Button>
        <Button
          variant={currentSpacing === "normal" ? "default" : "outline"}
          size="sm"
          onClick={() => onSpacingChange("normal")}
        >
          A_B
        </Button>
        <Button
          variant={currentSpacing === "relaxed" ? "default" : "outline"}
          size="sm"
          onClick={() => onSpacingChange("relaxed")}
        >
          A__B
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Font Size Controls */}
      <div className="flex items-center gap-2 flex-1 md:flex-initial">
        <Button
          variant={currentFontSize === "small" ? "default" : "outline"}
          size="sm"
          onClick={() => onFontSizeChange("small")}
        >
          A-
        </Button>
        <Button
          variant={currentFontSize === "base" ? "default" : "outline"}
          size="sm"
          onClick={() => onFontSizeChange("base")}
        >
          A
        </Button>
        <Button
          variant={currentFontSize === "large" ? "default" : "outline"}
          size="sm"
          onClick={() => onFontSizeChange("large")}
        >
          A+
        </Button>
      </div>
    </div>
  );
};
