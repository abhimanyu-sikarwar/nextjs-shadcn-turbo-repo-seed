import * as React from "react";

import { cn } from "@workspace/ui";
import { Button } from "./button.tsx";
import { MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

interface CardFooterInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  thumbsUpCount?: number;
  thumbsDownCount?: number;
  text?: string;
  buttonText?: string;
}

const CardFooterInfo = React.forwardRef<HTMLDivElement, CardFooterInfoProps>(
  ({ className, thumbsUpCount = 0, thumbsDownCount = 0, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute bottom-0 left-0 right-0 backdrop-blur-sm p-2 pt-0 rounded-b-lg",
        className,
      )}
      {...props}
    >
      <div className="w-full flex items-center justify-between border-t pt-2">
        <div className="flex items-center gap-1">
          {/* <Button variant="ghost" size="sm" className="h-6 text-xs">
            <ThumbsUp className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs font-medium text-green-600">{thumbsUpCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-6 text-xs">
            <ThumbsDown className="w-3.5 h-3.5 text-red-600" />
            <span className="text-xs font-medium text-red-600">{thumbsDownCount}</span>
          </Button> */}
        </div>
        <Button variant="ghost" size="sm" className="h-6 text-xs">
          <MessageCircle className="w-3 h-3 mr-1" />
          Discuss
        </Button>
      </div>
    </div>
  ),
);

const CardFooterInfoWithText = React.forwardRef<
  HTMLDivElement,
  CardFooterInfoProps
>(({ className, text = "", buttonText = "", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute bottom-0 left-0 right-0 backdrop-blur-sm p-2 pt-0 rounded-b-lg",
      className,
    )}
    {...props}
  >
    <div className="w-full flex items-center justify-between border-t pt-2">
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium text-muted-foreground">
          {text}
        </span>
      </div>
      <Button variant="ghost" size="sm" className="h-6 text-xs">
        <MessageCircle className="w-3 h-3 mr-1" />
        {buttonText}
      </Button>
    </div>
  </div>
));
CardFooterInfo.displayName = "CardFooterInfoWithText";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooterInfo,
  CardFooterInfoWithText,
};
