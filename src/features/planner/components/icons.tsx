/**
 * B파트 화면용 선 아이콘 (24 그리드, stroke).
 * 피그마 에셋 서버에서 원본 SVG를 받을 수 없어 같은 의미의 기본 도형으로 그렸다.
 * 디자인 시스템에 아이콘 에셋이 올라오면 그걸로 교체한다.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ children, size = 16, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {children}
    </svg>
  );
}

export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
);
export const ChevronLeftIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m15 6-6 6 6 6" />
  </Svg>
);
export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);
export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);
export const ArrowUpRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Svg>
);
export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);
export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);
export const PlusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
export const UsersIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5" />
    <path d="M16 4.8a3.4 3.4 0 0 1 0 6.4M18.5 14.8c1.7.8 2.8 2.5 3 5.2" />
  </Svg>
);
export const SlidersIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="8" cy="17" r="2" />
  </Svg>
);
export const HomeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 10.5 12 4l8 6.5V20H4z" />
    <path d="M10 20v-5h4v5" />
  </Svg>
);
export const MapIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z" />
    <path d="M9 4v14M15 6v14" />
  </Svg>
);
export const WonCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m7.5 9 1.8 6 2.7-6 2.7 6 1.8-6M7 12h10" />
  </Svg>
);
export const PinIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.3" />
  </Svg>
);
export const FlagIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 21V4M6 4h10l-2 4 2 4H6" />
  </Svg>
);
export const BulbIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
  </Svg>
);
export const CalendarIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect height="16" rx="2.5" width="17" x="3.5" y="5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Svg>
);
export const LinkIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1" />
    <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />
  </Svg>
);
export const UnlinkIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m14.5 12.5 4.9-4.9a3.5 3.5 0 0 0-5-5L12 5" />
    <path d="m9.5 11.5-4.9 4.9a3.5 3.5 0 0 0 5 5L12 19" />
    <path d="M3 3l18 18" />
  </Svg>
);
export const CopyIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect height="12" rx="2" width="12" x="8" y="8" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </Svg>
);
export const ChatIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4c5 0 8.5 3 8.5 6.8S17 17.5 12 17.5c-.8 0-1.6-.1-2.3-.2L5 20l1-3.7C4.4 15 3.5 13 3.5 10.8 3.5 7 7 4 12 4z" />
  </Svg>
);
export const RefreshIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
    <path d="M20 4v4.5h-4.5" />
  </Svg>
);
export const MailIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect height="14" rx="2.5" width="18" x="3" y="5" />
    <path d="m4 7 8 6 8-6" />
  </Svg>
);
export const LogoutIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
    <path d="M10 12h10M16 8l4 4-4 4" />
  </Svg>
);
export const AlertCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5v5M12 16h.01" />
  </Svg>
);
