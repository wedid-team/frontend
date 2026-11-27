import { toManwon, toManwonRange } from "../mocks/money";
import { offers, tierMocks } from "./mocks/sdmMock";

export { defaultSdmTier } from "./mocks/sdmMock";

export const categories = ["스튜디오", "드레스", "메이크업"] as const;
type Category = (typeof categories)[number];
export type Vendor = {
  id: string;
  category: Category;
  name: string;
  subtitle: string;
  min: number;
  max: number;
  agencies: number;
  officialUrl?: string;
};

export const vendors: Vendor[] = offers.flatMap((group, categoryIndex) =>
  group.map(([name, min, max, agencies, subtitle = "기본 상품 기준"], index) => ({
    id: categoryIndex + "-" + index,
    category: categories[categoryIndex],
    name,
    min: toManwon(min),
    max: toManwon(max),
    agencies,
    subtitle,
  })),
);

export const tiers = tierMocks.map(({ rangeWon, ...tier }) => ({
  ...tier,
  range: toManwonRange(rangeWon),
}));

export const tierRanges = tiers.map((tier) => tier.range);

const vendorsById = Object.fromEntries(vendors.map((vendor) => [vendor.id, vendor]));

export const combinations = (tier: number) =>
  tiers[tier].offers.map((ids) => ids.map((id, category) => vendorsById[category + "-" + id]));
