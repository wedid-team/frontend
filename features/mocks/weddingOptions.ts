// Local preview options. Confirm labels and identifiers against the API at integration time.
export const venueSearchRegion = "서울 강남권";
export const regions = [venueSearchRegion, "서울 강남권 외", "제주"];
export const guestRanges = ["50~100", "100~150", "150~200", "200~250", "250~300", "300~400"];
export const moods = ["화사한", "웅장한", "럭셔리", "그리너리", "클래식"] as const;
export const defaultMood = "화사한 · 클래식";
export const moodOptions = [defaultMood, ...moods, "상관없어요"];

// Existing local plans and result links can still contain these previous choices.
const previousRegions = ["경기·인천", "그 외 지역"];
export const isKnownRegion = (region: string) =>
  regions.includes(region) || previousRegions.includes(region);
export const regionsForSavedPlan = (region: string) =>
  previousRegions.includes(region) ? [...regions, region] : regions;
