"use client";

import { useCallback, useEffect } from "react";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  method?: {
    upi?: boolean;
    card?: boolean;
    netbanking?: boolean;
    wallet?: boolean;
    paylater?: boolean;
    emi?: boolean;
  };
  config?: {
    display?: {
      blocks?: Record<string, unknown>;
      sequence?: string[];
      preferences?: {
        show_default_blocks?: boolean;
      };
    };
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
    confirm_close?: boolean;
    escape?: boolean;
  };
  handler: (response: RazorpayResponse) => void;
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
  on: (event: string, callback: () => void) => void;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window.Razorpay !== "undefined") {
      resolve(true);
      return;
    }

    const existingScript = document.getElementById("razorpay-checkout-js") as HTMLScriptElement | null;
    if (existingScript) {
      if (existingScript.getAttribute("data-loaded") === "true") {
        resolve(true);
        return;
      }
      existingScript.onload = () => resolve(true);
      existingScript.onerror = () => resolve(false);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      script.setAttribute("data-loaded", "true");
      resolve(true);
    };
    script.onerror = () => {
      console.error("[Razorpay] Failed to load checkout script");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export function useRazorpay() {
  useEffect(() => {
    void loadRazorpayScript();
  }, []);

  const openPaymentModal = useCallback(async (options: RazorpayOptions): Promise<void> => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      throw new Error("Razorpay checkout script failed to load. Check your internet connection.");
    }

    return new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        ...options,
        modal: {
          ondismiss: () => {
            console.log("[Razorpay] Modal dismissed by user");
            reject(new Error("PAYMENT_CANCELLED"));
          },
          confirm_close: true,
          escape: false,
        },
        handler: (response: RazorpayResponse) => {
          void options.handler(response);
          resolve();
        },
      });

      rzp.open();
    });
  }, []);

  return { openPaymentModal };
}
