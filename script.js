let laxativeCount = 0;
let stoolCount = 0;
let symptomGroupCount = 0;

// 削除対象を一時保持
let targetDeleteRow = null;

/* =========================
   時刻取得
========================= */
function getTime() {
  return new Date().toTimeString().slice(0, 5);
}

/* =========================
   モーダル制御（便性状）
========================= */
function openStoolModal() {
  document.getElementById('stoolModal').style.display = 'block';
}

function closeStoolModal() {
  document.getElementById('stoolModal').style.display = 'none';
}

/* =========================
   記録ボタン
========================= */

// 下剤
function addLaxative() {
  laxativeCount++;
  addRow('laxative', `💊 下剤(${laxativeCount})`, '', '');
}

// 症状（腹痛・吐き気・その他は1グループ）
function addSymptom(symptomName) {
  symptomGroupCount++;
  addRow(
    'symptom',
    '',
    `⚠️ ${symptomName}(${symptomGroupCount})`,
    ''
  );
}

// 排便（画像選択）
function addStoolImage(imagePath) {
  stoolCount++;

  const imageHtml = `
    <img src="${imagePath}"
         alt="便性状"
         style="width:50px; border-radius:4px;">
  `;

  addRow(
    'stool',
    '',
    `💩 排便(${stoolCount})`,
    imageHtml
  );

  closeStoolModal();
}

/* =========================
   行追加
========================= */
function addRow(type, laxative, other, note) {
  const tbody = document.querySelector('#logTable tbody');
  const tr = document.createElement('tr');

  // 種類を保存（削除時に使用）
  tr.dataset.type = type;

  tr.innerHTML = `
    <td class="no"></td>
    <td>${laxative}</td>
    <td>${getTime()}</td>
    <td>${other}</td>
    <td>${note}</td>
    <td>
      <button class="delete-btn" onclick="deleteRow(this)">🗑</button>
    </td>
  `;

  // 新しい記録を上に追加
  tbody.prepend(tr);
  renumberRows();
}

/* =========================
   削除（確認付き）
========================= */

// 🗑 クリック時：確認モーダルを開く
function deleteRow(button) {
  targetDeleteRow = button.closest('tr');
  document.getElementById('deleteConfirmModal').style.display = 'block';
}

// 〇 を押したとき
function confirmDelete() {
  if (!targetDeleteRow) return;

  // ✅ 行を削除せず、訂正済みの見た目にする
  targetDeleteRow.classList.add('cancelled');
  targetDeleteRow.dataset.cancelled = "1";

  // ✅ ボタン表示を変えたい場合（任意）
  const btn = targetDeleteRow.querySelector('.delete-btn');
  if (btn) {
    btn.textContent = '取消';
    // btn.innerHTML = '取消'; でもOK
  }

  // ✅ 連番は降り直し「あり/なし」どちらでもOKだけど、
  // 今回は「降り直し無し」なので renumberRows() は呼ばない

  targetDeleteRow = null;
  closeDeleteModal();
}


// × を押したとき
function cancelDelete() {
  targetDeleteRow = null;
  closeDeleteModal();
}

// 確認モーダルを閉じる
function closeDeleteModal() {
  document.getElementById('deleteConfirmModal').style.display = 'none';
}

/* =========================
   No 再採番
========================= */
function renumberRows() {
  const rows = document.querySelectorAll('#logTable tbody tr');
  rows.forEach((row, index) => {
    row.querySelector('.no').textContent = index + 1;
  });
}
