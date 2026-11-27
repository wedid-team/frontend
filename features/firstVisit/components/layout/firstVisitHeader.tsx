import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/common";
import { SiteHeader } from "@/src/components/layout";
import { PLANNER_ROUTES } from "@/src/features/planner/routes";
import { usePlannerStore } from "@/src/features/planner/stores/plannerStore";
import { useUtAuthStore } from "@/src/stores/utAuthStore";
import { assets } from "../../assets";
import { weddingPlanPath } from "../../model";
import { Brand, FlowIcon, type FlowActions } from "./flowUi";
import styles from "./firstVisitHeader.module.css";

export function FirstVisitHeader({
  home = false,
  roadmap = false,
  intro = false,
  navigate,
  openLogin,
}: FlowActions & { home?: boolean; roadmap?: boolean; intro?: boolean }) {
  const router = useRouter();
  const signedIn = useUtAuthStore((state) => state.provider !== null);
  const hasSavedPlan = usePlannerStore((state) => state.hasSavedPlan);
  const canOpenPlan = signedIn && hasSavedPlan;
  const openMyRoadmap = () =>
    home || canOpenPlan ? router.push(PLANNER_ROUTES.roadmap) : navigate("roadmap");
  const openAccount = () => canOpenPlan ? router.push(PLANNER_ROUTES.myInfo) : openLogin();

  return (
    <SiteHeader
      className={home ? styles.homeHeader : styles.flowHeader}
      slots={{
        start: (
          <div className={styles.headerStart}>
            <Brand large={home} onClick={() => navigate("home")} />
            {home ? (
              <nav aria-label="주요 메뉴">
                <Link href={weddingPlanPath} aria-current={intro ? "page" : undefined}>
                  웨딩 플랜
                </Link>
                <button onClick={openMyRoadmap}>내 로드맵</button>
              </nav>
            ) : (
              <nav className={styles.breadcrumb} aria-label="현재 위치">
                <button onClick={() => navigate("home")}>{roadmap ? "홈" : "비용 계산"}</button>
                <FlowIcon icon={assets.icons.breadcrumb} />
                <strong>{roadmap ? "준비 로드맵" : "결과"}</strong>
              </nav>
            )}
          </div>
        ),
        actions: home ? (
          <div className={styles.headerActions}>
            <button aria-label="관심 업체 · 로그인" onClick={openLogin}>
              <FlowIcon icon={assets.icons.favorite} />
            </button>
            <button aria-label={canOpenPlan ? "내 정보" : "로그인"} onClick={openAccount}>
              <FlowIcon icon={assets.icons.account} />
            </button>
          </div>
        ) : (
          <div className={styles.headerActions}>
            {!roadmap && (
              <Button size="sm" variant="ghost" onClick={openMyRoadmap}>
                내 로드맵
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={openAccount}>
              {canOpenPlan ? "내 정보" : "로그인"}
            </Button>
            <Button size="sm" onClick={openLogin}>
              계획 저장하기
            </Button>
          </div>
        ),
      }}
    />
  );
}
