import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/src/components/layout/siteHeader";
import { InviteView } from "@/src/features/invite/components/inviteView";
import { getInviteStatusMock } from "@/src/features/invite/utils/inviteStatus";

export const metadata: Metadata = {
  title: "짝꿍 초대 | WEDID",
};

async function InviteContent({ params }: { params: PageProps<"/invite/[token]">["params"] }) {
  const { token } = await params;
  // TODO: 토큰 검증 API 연결 (P-08 만료 · 이미 연결 · 자기 링크). 지금은 MOCK 판정.
  return <InviteView status={getInviteStatusMock(token)} />;
}

export default function InvitePage({ params }: PageProps<"/invite/[token]">) {
  return (
    <>
      <SiteHeader variant="public" />
      <Suspense fallback={null}>
        <InviteContent params={params} />
      </Suspense>
    </>
  );
}
