import { Brand, type FlowActions } from "./flowUi";
import styles from "./landingPage.module.css";

export function FirstVisitFooter({
  navigate,
  intro = false,
}: Pick<FlowActions, "navigate"> & { intro?: boolean }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerColumns}>
        <div>
          <Brand onClick={() => navigate("home")} />
          <p>우리의 웨딩을 완성하다</p>
        </div>
        <div>
          <strong>서비스</strong>
          {!intro && <button onClick={() => navigate("region")}>웨딩 플랜</button>}
          <button onClick={() => navigate("region")}>비용 계산</button>
          <button onClick={() => navigate("roadmap")}>준비 로드맵</button>
          {intro && <span>예식장 찾기</span>}
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
  );
}
