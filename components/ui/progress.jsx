import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

// A thin wrapper around Radix Progress to allow usage like: <Progress value={33} />
// Tailwind styles match the rest of the UI components in this repo.
const Progress = React.forwardRef(({ className, value = 0, indicatorClassName, ...props }, ref) => {
  const safeValue = typeof value === "number" && isFinite(value) ? Math.min(Math.max(value, 0), 100) : 0;
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20 dark:bg-zinc-800",
        className
      )}
      value={safeValue}
      {...props}
   >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 bg-primary transition-transform duration-300",
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - safeValue}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = "Progress";

export { Progress };
