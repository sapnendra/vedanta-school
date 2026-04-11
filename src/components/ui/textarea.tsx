import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-md border border-saffron/20 bg-charcoal px-3 py-2 text-sm text-ivory placeholder:text-muted-warm/70 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-saffron/40 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
