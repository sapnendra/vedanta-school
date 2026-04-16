"use client";

import { MessageCircle } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function WhatsAppButton() {
  return (
    <div className="hidden md:flex fixed bottom-6 right-6 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href="https://wa.me/919685238884?text=Hello%20Vedanta%20Life%20School!%20I%20have%20a%20query%20regarding%20the%20seminars."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-colors hover:bg-green-600 before:absolute before:inset-0 before:rounded-full before:bg-green-400 before:animate-ping before:opacity-75"
          >
            <span className="relative z-10">
              <MessageCircle size={24} />
            </span>
          </a>
        </TooltipTrigger>
        <TooltipContent side="left">Chat with us on WhatsApp</TooltipContent>
      </Tooltip>
    </div>
  );
}
