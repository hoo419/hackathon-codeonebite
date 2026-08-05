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

// 입력값을 검증한다. 문제가 있으면 에러 메시지를, 없으면 빈 문자열을 반환
function validateActivity({ title, date, memberCount }) {
  if (!title) return '활동명은 필수입니다.';
  const today = new Date().toISOString().slice(0, 10);
  if (date && date > today) return '날짜는 미래일 수 없습니다.';
  if (!Number.isInteger(memberCount) || memberCount < 1) {
    return '참여 인원은 1 이상의 정수여야 합니다.';
  }
  return '';
}

// 활동 등록 폼 제출을 처리한다: 검증 후 저장하고 목록을 다시 그린다
function handleRegisterSubmit(event) {
  event.preventDefault();
  const titleInput = document.getElementById('title-input');
  const dateInput = document.getElementById('date-input');
  const placeInput = document.getElementById('place-input');
  const memberCountInput = document.getElementById('member-count-input');
  const memoInput = document.getElementById('memo-input');
  const errorEl = document.getElementById('register-error');

  const title = titleInput.value.trim();
  const date = dateInput.value;
  const place = placeInput.value.trim();
  const memberCount = Number(memberCountInput.value);
  const memo = memoInput.value.trim();

  const error = validateActivity({ title, date, memberCount });
  if (error) {
    errorEl.textContent = error;
    return;
  }
  errorEl.textContent = '';

  const list = getActivities();
  list.push({
    id: Date.now(),
    title,
    date,
    place,
    memberCount,
    memo,
    createdAt: new Date().toISOString(),
  });
  saveActivities(list);
  renderActivities(list);
  event.target.reset();
}

// TODO: 활동 삭제 처리 (삭제 버튼은 renderActivities에서 이미 그려짐, 클릭 이벤트/확인 절차만 추가)

document.addEventListener('DOMContentLoaded', () => {
  renderActivities(getActivities());
  document.getElementById('register-form').addEventListener('submit', handleRegisterSubmit);
  document.getElementById('date-input').max = new Date().toISOString().slice(0, 10);
});
