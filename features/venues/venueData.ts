import { toManwon, toManwonRange } from "../mocks/money";
import { moods, venueSearchRegion } from "../mocks/weddingOptions";
import { extraGuestMockWon, venueBudgetMockWon, venueMocks } from "./mocks/venueMock";

export { moods } from "../mocks/weddingOptions";
export { priceDate } from "./mocks/venueMock";
export const plan = {
  region: venueSearchRegion,
  guests: "150~200",
  venueBudget: toManwonRange(venueBudgetMockWon),
};
export const extraGuestEstimate = toManwon(extraGuestMockWon);
export const money = (amount: number) => amount.toLocaleString("ko-KR") + "만 원";
export const range = (min: number, max: number) =>
  min === max ? money(min) : money(min) + " ~ " + money(max);

type Venue = {
  id: string;
  name: string;
  hall: string;
  district: string;
  region: string;
  type: string;
  capacity?: [number, number];
  mood: (typeof moods)[number];
  moodDetail: string;
  meal: string;
  parking: boolean;
  phone: string;
  address: string;
  note: string;
  paused?: boolean;
  price?: { rental: number; meal: number; estimate: [number, number] };
  officialUrl?: string;
  hero?: string;
  compare?: string;
  related?: string;
};
export type { Venue };

export const venues: Venue[] = venueMocks.map(({ price, ...venue }) => ({
  ...venue,
  ...(price && {
    price: {
      rental: toManwon(price.rental),
      meal: toManwon(price.meal),
      estimate: toManwonRange(price.estimate),
    },
  }),
}));

export const searchVenues = venues.filter((venue) => venue.region === venueSearchRegion);

export const venueImage = (name: string) => "/images/venues/" + name + ".png";
export const estimateForGuests = (
  price: NonNullable<Venue["price"]>,
  guestRange: [number, number],
) =>
  price.estimate.map((amount, index) =>
    Math.round(amount + (guestRange[index] - (index ? 200 : 150)) * price.meal),
  ) as [number, number];
