export const moods = ["화사한", "웅장한", "럭셔리", "그리너리", "클래식"] as const;
export const plan = {
  region: "서울 강남권 외",
  guests: "150~200",
  venueBudget: [1550, 1900],
  sdmTier: 1,
};
export const priceDate = "2026.10.09";
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

export const venues: Venue[] = [
  {
    id: "raon-classic-hall",
    name: "라온 클래식홀",
    hall: "채플홀",
    district: "영등포구",
    region: plan.region,
    type: "채플",
    capacity: [120, 250],
    mood: "클래식",
    moodDetail: "채플",
    meal: "뷔페",
    parking: false,
    phone: "02-555-0505",
    address: "서울 영등포구 예시로 55",
    note: "건물 주차 불가 · 인근 공영주차장 2시간 지원",
    price: { rental: 250, meal: 6.2, estimate: [1300, 1610] },
    compare: "raon-classic-hall-compare",
  },
  {
    id: "aw-convention",
    name: "AW컨벤션",
    hall: "그랜드홀",
    district: "마포구",
    region: plan.region,
    type: "컨벤션",
    capacity: [150, 300],
    mood: "화사한",
    moodDetail: "밝은홀",
    meal: "뷔페",
    parking: true,
    phone: "02-555-0202",
    address: "서울 마포구 예시로 202",
    note: "플라워 장식 기본 포함",
    price: { rental: 300, meal: 5.9, estimate: [1335, 1630] },
    compare: "aw-convention-compare",
  },
  {
    id: "the-bay-hotel-seoul",
    name: "더 베이호텔 서울",
    hall: "그랜드볼룸",
    district: "중구",
    region: plan.region,
    type: "호텔",
    capacity: [200, 400],
    mood: "럭셔리",
    moodDetail: "호텔",
    meal: "코스",
    parking: true,
    phone: "02-555-0303",
    address: "서울 중구 예시로 303",
    note: "세부 조건은 업체에 확인해 주세요.",
    price: { rental: 600, meal: 8.5, estimate: [2750, 2750] },
  },
  {
    id: "the-grace-convention",
    name: "더 그레이스 컨벤션",
    hall: "크리스탈홀",
    district: "영등포구",
    region: plan.region,
    type: "컨벤션",
    capacity: [200, 350],
    mood: "웅장한",
    moodDetail: "밝은홀",
    meal: "뷔페",
    parking: true,
    phone: "02-555-0101",
    address: "서울 영등포구 예시로 101",
    note: "세부 조건은 업체에 확인해 주세요.",
    related: "the-grace-convention-related",
  },
  {
    id: "the-house-wedding-hall",
    name: "더 하우스 웨딩홀",
    hall: "가든홀",
    district: "성동구",
    region: plan.region,
    type: "하우스",
    mood: "그리너리",
    moodDetail: "하우스",
    meal: "뷔페",
    parking: true,
    phone: "02-555-0707",
    address: "서울 성동구 예시로 77",
    note: "수용 인원 확인 필요",
    related: "the-house-wedding-hall-related",
  },
  {
    id: "bloom-garden",
    name: "블룸가든",
    hall: "야외홀",
    district: "은평구",
    region: plan.region,
    type: "야외",
    capacity: [100, 200],
    mood: "그리너리",
    moodDetail: "식물·야외 가든 분위기",
    meal: "코스",
    parking: true,
    phone: "02-555-0606",
    address: "서울 은평구 예시로 66",
    note: "리모델링으로 휴업 중 (재개 일정 미정)",
    paused: true,
    hero: "bloom-garden-hero",
  },
  {
    id: "grand-opera-hall",
    name: "그랜드 오페라홀",
    hall: "오페라홀",
    district: "송파구",
    region: "서울 강남권",
    type: "컨벤션",
    capacity: [150, 300],
    mood: "웅장한",
    moodDetail: "높은 층고와 넓은 홀",
    meal: "코스",
    parking: true,
    phone: "02-555-0404",
    address: "서울 송파구 예시길 44",
    note: "층고 12m 단독홀",
    hero: "grand-opera-hall",
  },
];

export const venueImage = (name: string) => "/images/venues/" + name + ".png";
export const estimateForGuests = (
  price: NonNullable<Venue["price"]>,
  guestRange: [number, number],
) =>
  price.estimate.map((amount, index) =>
    Math.round(amount + (guestRange[index] - (index ? 200 : 150)) * price.meal),
  ) as [number, number];
