"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-charcoal/50 data-[state=open]:animate-in data-[state=closed]:animate-out",
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = {
  right:
    "inset-y-0 right-0 h-full w-3/4 border-l border-saffron/20 sm:max-w-sm data-[state=open]:animate-in data-[state=closed]:animate-out",
  left: "inset-y-0 left-0 h-full w-3/4 border-r border-saffron/20 sm:max-w-sm data-[state=open]:animate-in data-[state=closed]:animate-out",
  top: "inset-x-0 top-0 border-b border-saffron/20 data-[state=open]:animate-in data-[state=closed]:animate-out",
  bottom:
    "inset-x-0 bottom-0 border-t border-saffron/20 data-[state=open]:animate-in data-[state=closed]:animate-out",
} as const;

type SheetSide = keyof typeof sheetVariants;

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
  side?: SheetSide;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 bg-charcoal text-ivory p-6 shadow-lg transition ease-in-out",
        sheetVariants[side],
        className
      )}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-80 ring-offset-charcoal transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron/40">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-2 text-left", className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title className={cn("text-lg font-semibold", className)} {...props} />;
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle };