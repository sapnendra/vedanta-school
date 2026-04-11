import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-md border border-saffron/20 bg-charcoal/70 px-3 py-2 text-sm text-ivory placeholder:text-muted-warm/80 shadow-xs outline-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-saffron/60",
        className
      )}
      {...props}
    />
  );
}

export { Input };