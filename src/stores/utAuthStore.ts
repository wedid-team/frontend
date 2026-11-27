"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { safeLocalStorage } from "./localStorage";

export type UtLoginProvider = "kakao" | "google";

type UtAuthState = {
  provider: UtLoginProvider | null;
  signIn: (provider?: UtLoginProvider) => void;
  signOut: () => void;
};

// UT 브라우저에서만 사용하는 목 세션이다.
export const useUtAuthStore = create<UtAuthState>()(
  persist(
    (set) => ({
      provider: null,
      signIn: (provider = "kakao") => set({ provider }),
      signOut: () => set({ provider: null }),
    }),
    {
      name: "wedidUtSession",
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: ({ provider }) => ({ provider }),
      merge: (stored, current) => {
        const provider = (stored as { provider?: unknown } | undefined)?.provider;
        return provider === "kakao" || provider === "google" ? { ...current, provider } : current;
      },
    },
  ),
);
