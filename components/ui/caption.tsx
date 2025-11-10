import * as React from "react";

import { cn } from "@/lib/utils";

function Caption({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="caption"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm text-sm p-1 px-2",
        className
      )}
      {...props}
    />
  );
}

export { Caption };
