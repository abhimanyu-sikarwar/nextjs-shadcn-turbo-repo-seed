import { LoadingSpinner } from "@workspace/ui";
import * as React from "react";

export default function LayoutLoader() {
  return (
    <div className="flex h-[calc(100vh-16px)] items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
