import Image from "next/image";
import { Button } from "@/src/components/common";
import { assets } from "../assets";
import { Brand, FlowIcon, type FlowActions } from "./flowUi";
import styles from "./landingPage.module.css";

const venues = [
  {
    image: assets.images.luxuryVenue,
    mood: "럭셔리",
    region: "서울 중구",
    name: "더 베이호텔 서울",
    meal: "코스",
    note: "호텔 뷔페로 변경 가능 · 보증 인원 200명부터",
  },
  {
    image: assets.images.brightVenue,
    mood: "화사한",
    region: "서울 마포구",
    name: "AW컨벤션",
    meal: "뷔페",
    note: "플라워 장식 기본 포함",
  },
  {
    image: assets.images.gardenVenue,
    mood: "그리너리",
    region: "서울 성동구",
    name: "더 하우스 웨딩홀",
    meal: "뷔페",
    note: "야외 가든 예식 가능 (4~10월)",
  },
  {
    image: assets.images.grandVenue,
    mood: "웅장한",
    region: "서울 송파구",
    name: "그랜드 오페라홀",
    meal: "코스",
    note: "층고 12m 단독홀",
  },
];

export function LandingPage({ navigate, openLogin }: FlowActions) {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroPhoto}>
          <Image
            alt="꽃으로 장식된 예식장에 선 신랑 신부"
            src={assets.images.hero}
            width={835}
            height={1253}
            priority
            unoptimized
          />
        </div>
        <div className={styles.heroCopy}>
          <h1>
            우리 결혼,
            <br />
            얼마나 들까?
          </h1>
          <p>
            질문 5개로 우리 결혼의 예상 비용을 계산하고,
            <br />
            짝꿍과 함께 준비 로드맵을 관리하세요.
          </p>
          <div className={styles.heroActions}>
            <Button size="xl" onClick={() => navigate("region")} className={styles.heroButton}>
              우리 결혼 비용 계산하기 <FlowIcon icon={assets.icons.whiteArrow} />
            </Button>
            <button className={styles.textButton} onClick={() => navigate("roadmap")}>
              이미 계획이 있다면 내 로드맵 보기 <FlowIcon icon={assets.icons.chevron} />
            </button>
          </div>
        </div>
      </section>
      <section
        className={`${styles.homeContainer} ${styles.featureList}`}
        aria-label="웨딧에서 할 수 있는 일"
      >
        {[
          {
            title: "비용 계산",
            copy: "질문 5개로 우리 결혼 예상 비용 확인",
            icon: assets.icons.cost,
            action: () => navigate("region"),
          },
          {
            title: "준비 로드맵",
            copy: "언제 무엇을, 얼마에 정할지 한눈에",
            icon: assets.icons.location,
            action: () => navigate("roadmap"),
          },
          {
            title: "함께 준비",
            copy: "할 일을 나누고 같은 계획을 함께 관리",
            icon: assets.icons.members,
            action: openLogin,
          },
        ].map((feature) => (
          <button key={feature.title} onClick={feature.action} className={styles.featureCard}>
            <span className={styles.iconTile}>
              <FlowIcon icon={feature.icon} />
            </span>
            <h2>{feature.title}</h2>
            <p>{feature.copy}</p>
          </button>
        ))}
      </section>
      <section className={`${styles.homeContainer} ${styles.venueSection}`}>
        <div className={styles.sectionHeading}>
          <div>
            <h2 className="tH2">분위기로 골라보는 예식장</h2>
            <p>화사한 · 웅장한 · 럭셔리 · 그리너리 · 클래식 중 우리에게 맞는 곳을 찾아보세요</p>
          </div>
          <button className={styles.textButton} disabled title="예식장 목록은 준비 중이에요">
            전체 보기 <FlowIcon icon={assets.icons.chevron} />
          </button>
        </div>
        <div className={styles.venueGrid}>
          {venues.map((venue) => (
            <article key={venue.name} className={styles.venueCard}>
              <div className={styles.venuePhoto}>
                <Image src={venue.image} alt={venue.name} width={312} height={234} unoptimized />
                <span className={styles.venueMood}>{venue.mood}</span>
                <button
                  onClick={openLogin}
                  className={styles.favoriteButton}
                  aria-label={`${venue.name} 관심 업체 저장 · 로그인`}
                >
                  <FlowIcon icon={assets.icons.whiteHeart} />
                </button>
              </div>
              <div className={styles.venueDetails}>
                <small>{venue.region}</small>
                <h3>{venue.name}</h3>
                <div className={styles.venueTags}>
                  <span>
                    <FlowIcon icon={assets.icons.check} />
                    {venue.meal}
                  </span>
                  <span>
                    <FlowIcon icon={assets.icons.check} />
                    주차 가능
                  </span>
                </div>
                <p>{venue.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.planSection} id="weddingPlan">
        <div className={styles.homeContainer}>
          <div>
            <p className="tEyebrow">WEDDING PLAN</p>
            <h2>
              우리 결혼,
              <br />
              얼마나 들까?
            </h2>
            <p>
              지역과 하객 수만 알려주세요. 예상 비용을 계산하고, 짝꿍과 함께 볼 준비 로드맵까지
              <br />한 번에 만들어 드려요.
            </p>
            <div className={styles.inlineActions}>
              <Button onClick={() => navigate("region")}>
                결혼 비용 계산하기 <FlowIcon icon={assets.icons.whiteArrow} />
              </Button>
              <Button variant="outline" onClick={() => navigate("roadmap")}>
                웨딩 플랜 알아보기
              </Button>
            </div>
          </div>
          <div className={styles.planPreview}>
            <small>예상 총 비용</small>
            <h3>1,800만 ~ 2,250만원</h3>
            <p>서울 강남권 외 · 하객 150~200명 · 스탠다드</p>
            <div className={styles.miniProgress}>
              {Array.from({ length: 6 }, (_, index) => (
                <i key={index} />
              ))}
            </div>
            <small>다음 할 일 · 예식장 계약</small>
          </div>
        </div>
      </section>
      <footer className={styles.footer}>
        <div className={styles.footerColumns}>
          <div>
            <Brand onClick={() => navigate("home")} />
            <p>우리의 웨딩을 완성하다</p>
          </div>
          <div>
            <strong>서비스</strong>
            <button onClick={() => navigate("region")}>웨딩 플랜</button>
            <button onClick={() => navigate("region")}>비용 계산</button>
            <button onClick={() => navigate("roadmap")}>준비 로드맵</button>
          </div>
          <div>
            <strong>고객지원</strong>
            <span>자주 묻는 질문</span>
            <span>고객센터</span>
          </div>
          <div>
            <strong>정책</strong>
            <span>이용약관</span>
            <span>개인정보처리방침</span>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 WEDID</span>
          <span>비용 데이터: 한국소비자원 참가격</span>
        </div>
      </footer>
    </main>
  );
}
