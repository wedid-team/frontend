"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { venues } from "./venueData";

export const compareLimit = 3;
type DiscoveryState = {
  signedIn: boolean;
  compared: string[];
  favorites: string[];
  contracted: string | null;
  setSignedIn: (signedIn: boolean) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  toggleFavorite: (id: string) => void;
  chooseVenue: (id: string) => void;
};

// Preview state until the account, plan and vendor APIs are connected.
export const useDiscovery = create<DiscoveryState>()(
  persist(
    (set) => ({
      signedIn: true,
      compared: [],
      favorites: [],
      contracted: null,
      setSignedIn: (signedIn) => set({ signedIn }),
      toggleCompare: (id) =>
        set((state) => {
          if (!state.signedIn) return state;
          if (state.compared.includes(id))
            return { compared: state.compared.filter((entry) => entry !== id) };
          if (state.compared.length >= compareLimit || !venues.some((venue) => venue.id === id))
            return state;
          return { compared: [...state.compared, id] };
        }),
      clearCompare: () => set((state) => (state.signedIn ? { compared: [] } : state)),
      toggleFavorite: (id) =>
        set((state) =>
          state.signedIn
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
          return state.signedIn && venue && !venue.paused ? { contracted: id } : state;
        }),
    }),
    { name: "wedid-discovery-preview", skipHydration: true },
  ),
);
