import type { StateStorage } from "zustand/middleware";

// 브라우저 저장소가 차단돼도 현재 탭의 상태는 사용할 수 있다.
export const safeLocalStorage: StateStorage = {
  getItem(name) {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem(name, value) {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      // 저장을 사용할 수 없는 환경에서는 메모리 상태를 유지한다.
    }
  },
  removeItem(name) {
    try {
      window.localStorage.removeItem(name);
    } catch {
      // 저장소가 차단된 상태에서는 삭제할 수 없다.
    }
  },
};
