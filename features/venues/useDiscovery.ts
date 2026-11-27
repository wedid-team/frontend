"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUtAuthStore } from "@/src/stores/utAuthStore";
import { venues } from "./venueData";

export const compareLimit = 3;
type DiscoveryState = {
  compared: string[];
  favorites: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  toggleFavorite: (id: string) => void;
};

// Preview state until the account, plan and vendor APIs are connected.
export const useDiscovery = create<DiscoveryState>()(
  persist(
    (set) => ({
      compared: [],
      favorites: [],
      toggleCompare: (id) =>
        set((state) => {
          if (!useUtAuthStore.getState().provider) return state;
          if (state.compared.includes(id))
            return { compared: state.compared.filter((entry) => entry !== id) };
          if (state.compared.length >= compareLimit || !venues.some((venue) => venue.id === id))
            return state;
          return { compared: [...state.compared, id] };
        }),
      clearCompare: () => {
        if (useUtAuthStore.getState().provider) set({ compared: [] });
      },
      toggleFavorite: (id) =>
        set((state) =>
          useUtAuthStore.getState().provider
            ? {
                favorites: state.favorites.includes(id)
                  ? state.favorites.filter((entry) => entry !== id)
                  : [...state.favorites, id],
              }
            : state,
        ),
    }),
    {
      name: "wedid-discovery-preview",
      skipHydration: true,
      partialize: ({ compared, favorites }) => ({ compared, favorites }),
      merge: (stored, current) => {
        const saved = stored as Partial<Pick<DiscoveryState, "compared" | "favorites">> | undefined;
        return {
          ...current,
          compared: Array.isArray(saved?.compared) ? saved.compared : current.compared,
          favorites: Array.isArray(saved?.favorites) ? saved.favorites : current.favorites,
        };
      },
    },
  ),
);
