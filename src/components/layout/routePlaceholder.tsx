import styles from "./routePlaceholder.module.css";

type RoutePlaceholderProps = {
  title: string;
  description: string;
};

export function RoutePlaceholder({ title, description }: RoutePlaceholderProps) {
  return (
    <section aria-labelledby="route-title" className={styles.section}>
      <p className={styles.eyebrow}>공통 레이아웃 적용 확인</p>
      <h1 className={styles.title} id="route-title">{title}</h1>
      <p className={styles.description}>{description}</p>
      <p className={styles.note}>
        이 경로는 메뉴와 화면 레이아웃을 연결하기 위한 진입점입니다. 실제 화면은 담당 기능 작업으로 교체해주세요.
      </p>
    </section>
  );
}
