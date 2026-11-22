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
type Offer = [string, number, number, number, string?];

const offers: Offer[][] = [
  [
    ["라이트 스튜디오", 65, 70, 2],
    ["오브제 스튜디오", 75, 80, 1],
    ["온결 스튜디오", 85, 90, 2],
    ["모먼트 스튜디오", 95, 105, 3],
    ["라벨르 스튜디오", 105, 115, 2],
    ["아뜰리에 숨", 120, 130, 1],
    ["로우 스튜디오", 140, 155, 2],
    ["어반 스튜디오", 160, 175, 3],
    ["르누아 스튜디오", 180, 200, 2],
  ],
  [
    ["디어 드레스", 80, 85, 1],
    ["아워 드레스", 85, 90, 3],
    ["메종 드레스", 100, 105, 2],
    ["아뜰리에 화이트", 110, 120, 2],
    ["로브 드 메이", 125, 140, 1],
    ["클레어 드레스", 135, 150, 4],
    ["메종 로제", 155, 175, 3],
    ["르블랑 드레스", 180, 200, 3],
    ["벨라 꾸뛰르", 210, 240, 1],
  ],
  [
    ["뷰티 결", 40, 45, 3, "내추럴"],
    ["살롱 이음", 45, 50, 2, "피부 표현 중심"],
    ["메이크업 담", 50, 55, 1, "내추럴 · 단아"],
    ["헤어앤 메이", 60, 65, 4, "헤어 스타일링 강점"],
    ["블룸 뷰티", 65, 70, 3],
    ["스튜디오 글로우", 70, 80, 2],
    ["메종 뷰티", 85, 90, 3],
    ["살롱 오브", 95, 105, 2],
    ["라비앙 뷰티", 110, 125, 1],
  ],
];

export const vendors: Vendor[] = offers.flatMap((group, categoryIndex) =>
  group.map(([name, min, max, agencies, subtitle = "기본 상품 기준"], index) => ({
    id: categoryIndex + "-" + index,
    category: categories[categoryIndex],
    name,
    min,
    max,
    agencies,
    subtitle,
  })),
);

export const tiers = [
  {
    name: "베이직",
    label: "250만원 이하",
    offers: [
      [0, 0, 0],
      [1, 1, 1],
      [2, 2, 2],
    ],
  },
  {
    name: "스탠다드",
    label: "250 ~ 350만원",
    offers: [
      [3, 3, 2],
      [4, 4, 3],
      [5, 5, 4],
    ],
  },
  {
    name: "프리미엄",
    label: "350 ~ 450만원",
    offers: [
      [5, 5, 7],
      [6, 6, 5],
      [7, 6, 6],
    ],
  },
  {
    name: "럭셔리",
    label: "450만원 이상",
    offers: [
      [7, 8, 7],
      [8, 8, 7],
      [8, 8, 8],
    ],
  },
];

export const combinations = (tier: number) =>
  tiers[tier].offers.map((ids) =>
    ids.map((id, category) => vendors[category * offers[category].length + id]),
  );
