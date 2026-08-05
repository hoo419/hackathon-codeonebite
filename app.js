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
// 정렬 기준: 활동 날짜(date) 내림차순, 날짜가 같으면 등록시각(createdAt) 내림차순
function renderActivities(list) {
  const section = document.getElementById('list-section');
  section.innerHTML = '';

  if (list.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = '등록된 활동이 없습니다.';
    section.appendChild(empty);
    return;
  }

  const sorted = [...list].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.createdAt < b.createdAt ? 1 : -1;
  });

  const ul = document.createElement('ul');
  sorted.forEach((activity) => {
    const li = document.createElement('li');
    li.dataset.id = activity.id;
    li.innerHTML = `
      <strong>${escapeHtml(activity.title)}</strong>
      (${escapeHtml(activity.date)}, ${escapeHtml(activity.place)})
      - 참여 ${activity.memberCount}명<br>
      ${escapeHtml(activity.memo || '')}
      <button class="delete-btn" data-id="${activity.id}">삭제</button>
    `;
    ul.appendChild(li);
  });
  section.appendChild(ul);
}

// 사용자 입력을 화면에 표시할 때 HTML 특수문자를 이스케이프한다 (XSS 방지)
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// TODO: 활동 등록 폼 처리 (#register-section) — 검증: 활동명 필수 / 날짜 미래 불가 / 참여인원 1이상 정수
// TODO: 활동 삭제 처리 (삭제 버튼은 renderActivities에서 이미 그려짐, 클릭 이벤트/확인 절차만 추가)

document.addEventListener('DOMContentLoaded', () => {
  renderActivities(getActivities());
});
