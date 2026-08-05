// ===== 선택기능 담당: 조영남 =====
// getActivities() / saveActivities(list) / renderActivities(list) 는 app.js에 정의되어 있음.
// 이 파일이 index.html에서 app.js 다음에 로드되므로 그대로 가져다 쓸 수 있음.

// 검색어로 활동명·장소를 필터링한 배열을 반환한다
function filterActivities(keyword) {
  const lower = keyword.trim().toLowerCase();
  if (!lower) return getActivities();
  return getActivities().filter(activity =>
    activity.title.toLowerCase().includes(lower) ||
    activity.place.toLowerCase().includes(lower)
  );
}

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', () => {
  renderActivities(filterActivities(searchInput.value));
});

// TODO: JSON 내보내기 (#io-section) — getActivities() 결과를 JSON 파일로 다운로드

// TODO: JSON 가져오기 (#io-section) — 선택한 파일을 파싱해 기존 데이터에 추가로 합침
//   (id 중복 시 새 id 부여 후 saveActivities()로 저장, renderActivities()로 다시 그리기)
