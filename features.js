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

// 활동 데이터 전체를 JSON 파일로 다운로드한다
function exportActivities() {
  const blob = new Blob([JSON.stringify(getActivities(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'activities.json';
  link.click();
  URL.revokeObjectURL(url);
}

document.getElementById('export-btn').addEventListener('click', exportActivities);

// 파일을 읽어 기존 데이터에 추가로 합친다 (id 중복 시 새 id 부여)
function importActivities(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const imported = JSON.parse(reader.result);
    const current = getActivities();
    const existingIds = new Set(current.map(activity => activity.id));
    let nextId = current.reduce((max, activity) => Math.max(max, activity.id), 0) + 1;

    const merged = current.concat(imported.map(activity => {
      if (existingIds.has(activity.id)) {
        const renamed = { ...activity, id: nextId };
        existingIds.add(nextId);
        nextId++;
        return renamed;
      }
      existingIds.add(activity.id);
      return activity;
    }));

    saveActivities(merged);
    renderActivities(merged);
  };
  reader.readAsText(file);
}

document.getElementById('import-input').addEventListener('change', event => {
  const file = event.target.files[0];
  if (file) importActivities(file);
});
