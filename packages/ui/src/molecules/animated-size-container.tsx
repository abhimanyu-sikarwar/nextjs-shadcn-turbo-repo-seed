"use client";

import { cn } from "@workspace/utils";
// import { motion } from "framer-motion";
import {
  ComponentPropsWithoutRef,
  PropsWithChildren,
  forwardRef,
  useRef,
} from "react";
import { useResizeObserver } from "../hooks/use-resize-observer.ts";
// import { useResizeObserver } from "../../../../../../dub/packages/ui/src/hooks/index.ts";

type AnimatedSizeContainerProps = PropsWithChildren<{
  width?: boolean;
  height?: boolean;
}> &
  Omit<ComponentPropsWithoutRef<any>, "animate" | "children">;
// Omit<ComponentPropsWithoutRef<typeof motion.div>, "animate" | "children">;

/**
 * A container with animated width and height (each optional) based on children dimensions
 */
const AnimatedSizeContainer = forwardRef<
  HTMLDivElement,
  AnimatedSizeContainerProps
>(
  (
    {
      width = false,
      height = false,
      className,
      transition,
      children,
      ...rest
    }: AnimatedSizeContainerProps,
    forwardedRef,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const resizeObserverEntry = useResizeObserver(containerRef);

    return (
      <div
        ref={forwardedRef}
        className={cn("overflow-hidden", className)}
        // animate={{
        //   width: width
        //     ? resizeObserverEntry?.contentRect?.width ?? "auto"
        //     : "auto",
        //   height: height
        //     ? resizeObserverEntry?.contentRect?.height ?? "auto"
        //     : "auto",
        // }}
        // transition={transition ?? { type: "spring", duration: 0.3 }}
        {...rest}
      >
        <div
          ref={containerRef}
          className={cn(height && "h-max", width && "w-max")}
        >
          {children}
        </div>
      </div>
    );
  },
);

AnimatedSizeContainer.displayName = "AnimatedSizeContainer";

export { AnimatedSizeContainer };
