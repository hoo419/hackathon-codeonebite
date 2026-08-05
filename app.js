// ===== 필수기능 담당: 임채호 =====
// 데이터 함수/렌더 함수 이름은 features.js와 합의된 인터페이스이므로
// 이름·파라미터를 바꿀 경우 반드시 features.js 담당자와 상의할 것.

const STORAGE_KEY = 'activities';

// localStorage에서 활동 배열을 읽어온다
function getActivities() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

// 활동 배열을 localStorage에 저장한다
function saveActivities(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// 활동 배열을 받아 #list-section에 목록을 그린다 (검색 결과 표시에도 재사용)
function renderActivities(list) {
  // TODO: 최신순 정렬, 빈 목록 안내 문구, 항목별 삭제 버튼 포함해서 구현
}

// TODO: 활동 등록 폼 처리 (#register-section) — 검증: 활동명 필수 / 날짜 미래 불가 / 참여인원 1이상 정수
// TODO: 활동 삭제 처리 (#list-section 내 삭제 버튼, 확인 절차 포함)

document.addEventListener('DOMContentLoaded', () => {
  renderActivities(getActivities());
});
