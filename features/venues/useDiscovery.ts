"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUtAuthStore } from "@/src/stores/utAuthStore";
import { venues } from "./venueData";

export const compareLimit = 3;
type DiscoveryState = {
  compared: string[];
  favorites: string[];
  contracted: string | null;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  toggleFavorite: (id: string) => void;
  chooseVenue: (id: string) => void;
};

// Preview state until the account, plan and vendor APIs are connected.
export const useDiscovery = create<DiscoveryState>()(
  persist(
    (set) => ({
      compared: [],
      favorites: [],
      contracted: null,
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
      chooseVenue: (id) =>
        set((state) => {
          const venue = venues.find((entry) => entry.id === id);
          return useUtAuthStore.getState().provider && venue && !venue.paused
            ? { contracted: id }
            : state;
        }),
    }),
    {
      name: "wedid-discovery-preview",
      skipHydration: true,
      partialize: ({ compared, favorites, contracted }) => ({ compared, favorites, contracted }),
    },
  ),
);
