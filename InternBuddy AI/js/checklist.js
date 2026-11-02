/**
 * InternBuddy AI — Checklist Magang
 * CRUD with localStorage, no external dependencies.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'internbuddy_checklist';

  /* ================================================================
     Default items shown on first visit
  ================================================================ */
  const DEFAULT_ITEMS = [
    {
      title: 'Siapkan surat pengantar magang dari kampus',
      desc: 'Minta surat pengantar resmi dari bagian akademik atau kemahasiswaan kampus.',
      done: false
    },
    {
      title: 'Cari informasi profil dan bidang kerja perusahaan',
      desc: 'Baca website, media sosial, atau berita terbaru tentang perusahaan tempat magang.',
      done: false
    },
    {
      title: 'Siapkan pakaian kerja yang sesuai',
      desc: 'Tanyakan kepada HRD atau supervisor mengenai dress code yang berlaku.',
      done: false
    },
    {
      title: 'Konfirmasi jam masuk dan lokasi kantor',
      desc: 'Pastikan kamu sudah mengetahui waktu masuk, alamat kantor, dan cara aksesnya.',
      done: false
    },
    {
      title: 'Siapkan perkenalan diri singkat',
      desc: 'Latih perkenalan diri 1–2 menit: nama, asal kampus, jurusan, dan tujuan magang.',
      done: false
    },
    {
      title: 'Bawa perlengkapan kerja lengkap di hari pertama',
      desc: 'Laptop, charger, alat tulis, buku catatan, dan dokumen yang diperlukan.',
      done: false
    }
  ];

  /* ================================================================
     Data Layer (localStorage)
  ================================================================ */
  function loadItems() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    // First visit: seed with default items
    const seeded = DEFAULT_ITEMS.map(function (item, idx) {
      return { id: Date.now() + idx, title: item.title, desc: item.desc, done: item.done };
    });
    saveItems(seeded);
    return seeded;
  }

  function saveItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  /* ================================================================
     DOM references
  ================================================================ */
  const listEl        = document.getElementById('checklistList');
  const inputTitle    = document.getElementById('inputTitle');
  const inputDesc     = document.getElementById('inputDesc');
  const saveItemBtn   = document.getElementById('saveItemBtn');
  const clearFormBtn  = document.getElementById('clearFormBtn');
  const totalCountEl  = document.getElementById('totalCount');
  const doneCountEl   = document.getElementById('doneCount');
  const pendingCountEl = document.getElementById('pendingCount');
  const deleteModal   = document.getElementById('deleteModal');
  const deleteItemNameEl = document.getElementById('deleteItemName');
  const cancelDeleteBtn  = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

  if (!listEl) return; // Guard: only run on checklist page

  let items = loadItems();
  let pendingDeleteId = null;

  /* ================================================================
     Render
  ================================================================ */
  function render() {
    // Update summary
    const doneItems = items.filter(function (i) { return i.done; });
    totalCountEl.textContent   = items.length;
    doneCountEl.textContent    = doneItems.length;
    pendingCountEl.textContent = items.length - doneItems.length;

    // Clear list
    listEl.innerHTML = '';

    if (items.length === 0) {
      listEl.innerHTML = `
        <div class="checklist-empty">
          <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <p>Belum ada kegiatan yang ditambahkan.<br/>Mulai dengan menambahkan kegiatan pertamamu di atas!</p>
        </div>`;
      return;
    }

    items.forEach(function (item) {
      const el = buildItemEl(item);
      listEl.appendChild(el);
    });
  }

  function buildItemEl(item) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('checklist-item');
    wrapper.dataset.id = item.id;
    if (item.done) wrapper.classList.add('done');

    const checkedClass = item.done ? 'checked' : '';
    const statusLabel  = item.done
      ? '<span class="item-status status-done">✓ Selesai</span>'
      : '<span class="item-status status-pending">○ Belum Selesai</span>';
    const descHtml = item.desc
      ? `<div class="item-desc">${escHtml(item.desc)}</div>`
      : '';

    wrapper.innerHTML = `
      <div class="checklist-checkbox ${checkedClass}" data-action="toggle" data-id="${item.id}">
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="item-content">
        <div class="item-title">${escHtml(item.title)}</div>
        ${descHtml}
        ${statusLabel}
        <div class="item-edit-form" id="editForm-${item.id}">
          <input type="text" class="edit-title" value="${escHtml(item.title)}" maxlength="120" placeholder="Nama kegiatan" />
          <textarea class="edit-desc" maxlength="300" placeholder="Deskripsi (opsional)">${escHtml(item.desc)}</textarea>
          <div class="edit-form-actions">
            <button type="button" class="btn-outline" data-action="cancel-edit" data-id="${item.id}">Batal</button>
            <button type="button" class="btn btn-primary btn-sm" data-action="save-edit" data-id="${item.id}">Simpan</button>
          </div>
        </div>
      </div>
      <div class="item-actions">
        <button class="btn-icon" data-action="edit" data-id="${item.id}" title="Edit kegiatan">
          <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="btn-icon danger" data-action="delete" data-id="${item.id}" title="Hapus kegiatan">
          <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>`;

    return wrapper;
  }

  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }

  /* ================================================================
     CREATE
  ================================================================ */
  saveItemBtn.addEventListener('click', function () {
    const title = inputTitle.value.trim();
    if (!title) {
      inputTitle.focus();
      inputTitle.style.borderColor = '#dc2626';
      setTimeout(function () { inputTitle.style.borderColor = ''; }, 1500);
      return;
    }

    const newItem = {
      id:    Date.now(),
      title: title,
      desc:  inputDesc.value.trim(),
      done:  false
    };

    items.push(newItem);
    saveItems(items);
    render();
    clearForm();
  });

  clearFormBtn.addEventListener('click', clearForm);

  function clearForm() {
    inputTitle.value = '';
    inputDesc.value  = '';
    inputTitle.focus();
  }

  /* ================================================================
     READ + UPDATE + DELETE — delegated via data-action
  ================================================================ */
  listEl.addEventListener('click', function (e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    const id     = Number(target.dataset.id);

    if (action === 'toggle')      toggleDone(id);
    else if (action === 'edit')   openEditForm(id);
    else if (action === 'cancel-edit') closeEditForm(id);
    else if (action === 'save-edit')   saveEdit(id);
    else if (action === 'delete') openDeleteModal(id);
  });

  /* Toggle done/undone */
  function toggleDone(id) {
    items = items.map(function (item) {
      if (item.id === id) return Object.assign({}, item, { done: !item.done });
      return item;
    });
    saveItems(items);
    render();
  }

  /* Inline edit */
  function openEditForm(id) {
    const form = document.getElementById('editForm-' + id);
    if (form) form.classList.add('open');
  }

  function closeEditForm(id) {
    const form = document.getElementById('editForm-' + id);
    if (form) form.classList.remove('open');
  }

  function saveEdit(id) {
    const form  = document.getElementById('editForm-' + id);
    if (!form) return;
    const newTitle = form.querySelector('.edit-title').value.trim();
    const newDesc  = form.querySelector('.edit-desc').value.trim();

    if (!newTitle) {
      const input = form.querySelector('.edit-title');
      input.style.borderColor = '#dc2626';
      setTimeout(function () { input.style.borderColor = ''; }, 1500);
      return;
    }

    items = items.map(function (item) {
      if (item.id === id) return Object.assign({}, item, { title: newTitle, desc: newDesc });
      return item;
    });
    saveItems(items);
    render();
  }

  /* Delete with confirmation modal */
  function openDeleteModal(id) {
    const item = items.find(function (i) { return i.id === id; });
    if (!item) return;
    pendingDeleteId = id;
    deleteItemNameEl.textContent = item.title;
    deleteModal.classList.add('show');
  }

  cancelDeleteBtn.addEventListener('click', function () {
    deleteModal.classList.remove('show');
    pendingDeleteId = null;
  });

  confirmDeleteBtn.addEventListener('click', function () {
    if (pendingDeleteId !== null) {
      items = items.filter(function (i) { return i.id !== pendingDeleteId; });
      saveItems(items);
      render();
    }
    deleteModal.classList.remove('show');
    pendingDeleteId = null;
  });

  // Close modal on overlay click
  deleteModal.addEventListener('click', function (e) {
    if (e.target === deleteModal) {
      deleteModal.classList.remove('show');
      pendingDeleteId = null;
    }
  });

  /* ================================================================
     Initial render
  ================================================================ */
  render();

})();
