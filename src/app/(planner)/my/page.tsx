import type { Metadata } from "next";
import { MyInfoView } from "@/src/features/myInfo/components/myInfoView";

export const metadata: Metadata = {
  title: "내 정보 | WEDID",
};

export default function MyInfoPage() {
  return <MyInfoView />;
}
