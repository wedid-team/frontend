import { usePlannerStore } from "@/src/features/planner/stores/plannerStore";
import { useUtAuthStore, type UtLoginProvider } from "@/src/stores/utAuthStore";
import { toPlannerDraft } from "./plannerDraft";
import { useFirstVisitStore } from "./store";

export async function loginToPlanner(provider: UtLoginProvider, restoreOnly: boolean) {
  await usePlannerStore.persist.rehydrate();
  if (!restoreOnly && !usePlannerStore.getState().hasSavedPlan) {
    await useFirstVisitStore.persist.rehydrate();
    const { answers, tier } = useFirstVisitStore.getState();
    const draft = toPlannerDraft(answers, tier);
    if (draft) await usePlannerStore.getState().savePlanIfMissing(draft, provider);
  }
  useUtAuthStore.getState().signIn(provider);
  return usePlannerStore.getState().hasSavedPlan;
}
