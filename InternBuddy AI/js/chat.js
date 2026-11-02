/**
 * InternBuddy AI — Chat Assistant
 * Berbasis pencocokan kata kunci (rule-based), tanpa API eksternal.
 */

(function () {
  'use strict';

  /* ================================================================
     KNOWLEDGE BASE — Kata kunci & Respons
     Setiap entri berisi:
       keywords : array string yang dicocokkan dengan pesan pengguna
       response : string jawaban (mendukung \n untuk baris baru)
  ================================================================ */
  const KB = [
    {
      keywords: ['persiapan', 'sebelum magang', 'hari pertama', 'mulai magang', 'mau magang', 'awal magang', 'persiapkan'],
      response: `Berikut hal-hal yang perlu kamu siapkan sebelum memulai magang:\n\n` +
        `📋 Dokumen & Administrasi\n` +
        `• Surat pengantar dari kampus\n` +
        `• Fotokopi KTP dan kartu mahasiswa\n` +
        `• Foto formal ukuran 3×4 dan 4×6\n\n` +
        `💻 Perlengkapan Kerja\n` +
        `• Laptop beserta charger\n` +
        `• Alat tulis dan buku catatan\n` +
        `• Pakaian kerja yang sesuai aturan perusahaan\n\n` +
        `🔍 Riset Perusahaan\n` +
        `• Pelajari profil, visi-misi, dan bidang kerja perusahaan\n` +
        `• Cari tahu nama supervisor atau mentor kamu\n` +
        `• Konfirmasi jam masuk dan lokasi kantor\n\n` +
        `😊 Persiapan Mental\n` +
        `• Siapkan perkenalan diri singkat (1–2 menit)\n` +
        `• Tetapkan tujuan yang ingin dicapai selama magang\n` +
        `• Istirahat cukup malam sebelumnya`
    },
    {
      keywords: ['hari pertama', 'pertama kali masuk', 'first day', 'masuk pertama'],
      response: `Tips untuk hari pertama magang:\n\n` +
        `🕐 Waktu & Kehadiran\n` +
        `• Datang 10–15 menit lebih awal dari jam masuk\n` +
        `• Konfirmasi lokasi dan prosedur masuk gedung\n\n` +
        `👋 Perkenalan\n` +
        `• Sapa supervisor dan rekan kerja dengan ramah\n` +
        `• Perkenalkan diri secara singkat dan jelas\n` +
        `• Catat nama-nama orang penting di tim kamu\n\n` +
        `📝 Orientasi\n` +
        `• Perhatikan baik-baik saat penjelasan orientasi\n` +
        `• Catat informasi penting: tugas, target, dan aturan kerja\n` +
        `• Jangan ragu bertanya tentang hal yang belum jelas\n\n` +
        `✅ Sikap\n` +
        `• Tunjukkan antusiasme dan kemauan belajar\n` +
        `• Jadilah pendengar yang baik`
    },
    {
      keywords: ['etika', 'sopan', 'sikap', 'perilaku', 'profesional', 'attitude', 'kerja'],
      response: `Etika dan sikap profesional di tempat magang:\n\n` +
        `⏰ Kedisiplinan\n` +
        `• Selalu hadir tepat waktu atau lebih awal\n` +
        `• Beritahu supervisor jika ada keterlambatan\n` +
        `• Selesaikan tugas sesuai tenggat waktu\n\n` +
        `🤝 Hubungan Kerja\n` +
        `• Hormati semua rekan kerja tanpa memandang jabatan\n` +
        `• Gunakan bahasa yang sopan dan formal\n` +
        `• Hindari bergosip atau membicarakan orang lain\n\n` +
        `💼 Etos Kerja\n` +
        `• Tunjukkan inisiatif dan kemauan belajar\n` +
        `• Akui kesalahan dan jadikan pelajaran\n` +
        `• Jaga kerahasiaan informasi perusahaan`
    },
    {
      keywords: ['supervisor', 'atasan', 'pembimbing', 'menghubungi', 'kontak supervisor', 'chat supervisor', 'whatsapp supervisor'],
      response: `Cara menghubungi supervisor dengan profesional:\n\n` +
        `📱 Via Chat/WhatsApp\n` +
        `"Selamat pagi, Pak/Bu [nama]. Mohon maaf mengganggu waktu Bapak/Ibu. Saya [nama], mahasiswa magang. Ada beberapa hal yang ingin saya tanyakan mengenai [topik]. Apakah Bapak/Ibu ada waktu untuk berdiskusi sebentar?"\n\n` +
        `📧 Via Email\n` +
        `• Gunakan subjek yang jelas: "Pertanyaan Terkait [Topik Tugas]"\n` +
        `• Salam pembuka: "Yth. Bapak/Ibu [nama],"\n` +
        `• Sampaikan tujuan secara ringkas\n` +
        `• Tutup dengan: "Terima kasih atas perhatian Bapak/Ibu."\n\n` +
        `🗣️ Langsung / Tatap Muka\n` +
        `• Ketuk pintu atau minta izin terlebih dahulu\n` +
        `• Tanyakan apakah beliau sedang sibuk\n` +
        `• Sampaikan keperluan dengan singkat dan jelas`
    },
    {
      keywords: ['bertanya tugas', 'tanya tugas', 'minta arahan', 'tidak mengerti tugas', 'tugas tidak jelas', 'cara bertanya', 'meminta penjelasan'],
      response: `Cara bertanya tentang tugas dengan tepat:\n\n` +
        `✍️ Sebelum Bertanya\n` +
        `• Coba pahami dulu instruksi yang diberikan\n` +
        `• Catat bagian mana yang belum kamu mengerti\n` +
        `• Cari referensi mandiri terlebih dahulu\n\n` +
        `🗨️ Contoh Kalimat\n` +
        `"Permisi Pak/Bu, boleh saya meminta klarifikasi mengenai tugas [nama tugas]? Saya sudah mencoba memahaminya, namun masih ada bagian yang kurang jelas untuk saya, yaitu [bagian spesifik]."\n\n` +
        `📌 Tips\n` +
        `• Tanyakan satu hal spesifik, bukan semua sekaligus\n` +
        `• Tunjukkan bahwa kamu sudah berusaha terlebih dahulu\n` +
        `• Catat jawaban agar tidak perlu bertanya ulang`
    },
    {
      keywords: ['kendala', 'kesulitan', 'masalah', 'tidak bisa', 'bingung', 'stuck', 'menghadapi', 'hambatan'],
      response: `Cara menghadapi kesulitan saat magang:\n\n` +
        `🧠 Identifikasi Masalah\n` +
        `• Tentukan dengan jelas apa yang menjadi hambatan\n` +
        `• Pisahkan antara masalah teknis dan non-teknis\n\n` +
        `🔍 Coba Mandiri Dulu\n` +
        `• Cari solusi melalui dokumentasi, internet, atau catatan\n` +
        `• Berikan dirimu waktu 15–30 menit untuk mencoba sendiri\n\n` +
        `🤝 Minta Bantuan\n` +
        `• Jika belum menemukan solusi, hubungi rekan atau supervisor\n` +
        `• Jelaskan apa yang sudah kamu coba sebelumnya\n` +
        `• "Saya sudah mencoba [solusi], namun hasilnya masih [masalah]. Boleh saya meminta bantuan?"\n\n` +
        `📝 Catat & Pelajari\n` +
        `• Dokumentasikan kendala dan cara mengatasinya\n` +
        `• Jadikan pengalaman sebagai bahan belajar`
    },
    {
      keywords: ['izin', 'tidak masuk', 'absen', 'sakit', 'ijin', 'minta izin', 'tidak hadir', 'berhalangan'],
      response: `Cara meminta izin tidak masuk magang:\n\n` +
        `📱 Contoh Pesan Izin Sakit\n` +
        `"Selamat pagi, Pak/Bu [nama]. Mohon maaf, hari ini saya tidak dapat hadir karena sakit. Saya akan beristirahat dan berusaha hadir kembali besok. Untuk pekerjaan yang perlu diselesaikan, apakah ada yang bisa saya kerjakan dari rumah? Terima kasih atas pengertiannya."\n\n` +
        `📱 Contoh Pesan Keperluan Mendadak\n` +
        `"Selamat pagi, Pak/Bu [nama]. Mohon maaf mengganggu. Saya ada keperluan mendesak hari ini sehingga tidak dapat hadir ke kantor. Jika memungkinkan, saya siap mengerjakan tugas dari rumah. Terima kasih."\n\n` +
        `📌 Tips Penting\n` +
        `• Kirim pesan izin sebelum jam masuk (bukan saat sudah terlambat)\n` +
        `• Tawarkan solusi, jangan hanya memberi kabar\n` +
        `• Ikuti prosedur izin yang berlaku di perusahaan`
    },
    {
      keywords: ['adaptasi', 'lingkungan baru', 'menyesuaikan', 'canggung', 'tidak nyaman', 'beradaptasi', 'sosialisasi'],
      response: `Tips beradaptasi dengan lingkungan kerja baru:\n\n` +
        `👀 Amati Dulu\n` +
        `• Perhatikan budaya dan norma yang berlaku di kantor\n` +
        `• Pelajari cara tim berkomunikasi (formal/informal)\n` +
        `• Jangan terburu-buru mengubah kebiasaan orang lain\n\n` +
        `🤝 Bangun Hubungan\n` +
        `• Sapa rekan kerja setiap hari dengan ramah\n` +
        `• Ajak mengobrol saat istirahat atau waktu santai\n` +
        `• Tunjukkan ketertarikan terhadap pekerjaan mereka\n\n` +
        `💪 Percaya Diri\n` +
        `• Ingat bahwa rasa canggung di awal adalah hal yang wajar\n` +
        `• Fokus pada kontribusi, bukan pada penilaian orang lain\n` +
        `• Beri dirimu waktu — adaptasi butuh 2–4 minggu\n\n` +
        `📓 Catat & Refleksi\n` +
        `• Tulis pengalaman harian di jurnal magang\n` +
        `• Evaluasi apa yang sudah baik dan apa yang perlu diperbaiki`
    },
    {
      keywords: ['waktu', 'mengatur waktu', 'manajemen waktu', 'deadline', 'tepat waktu', 'prioritas', 'jadwal'],
      response: `Tips mengatur waktu selama magang:\n\n` +
        `📅 Rencanakan Harian\n` +
        `• Buat daftar tugas di awal hari\n` +
        `• Prioritaskan berdasarkan urgensi dan dampak\n` +
        `• Gunakan metode sederhana: tugas penting dulu, baru rutin\n\n` +
        `⏱️ Kelola Energi\n` +
        `• Kerjakan tugas berat saat masih segar (pagi hari)\n` +
        `• Ambil istirahat singkat setiap 60–90 menit\n` +
        `• Hindari multitasking berlebihan\n\n` +
        `🔔 Patuhi Tenggat Waktu\n` +
        `• Jika merasa tidak bisa selesai tepat waktu, komunikasikan lebih awal\n` +
        `• Lebih baik minta perpanjangan daripada menyerahkan hasil buruk\n` +
        `• Gunakan Checklist Magang untuk melacak progres tugasmu`
    },
    {
      keywords: ['laporan magang', 'laporan', 'menulis laporan', 'bimbingan', 'laporan akhir'],
      response: `Tips menyusun laporan magang:\n\n` +
        `📄 Struktur Umum Laporan\n` +
        `• Halaman Judul & Identitas\n` +
        `• Kata Pengantar\n` +
        `• Bab 1 – Pendahuluan (latar belakang, tujuan)\n` +
        `• Bab 2 – Profil Perusahaan\n` +
        `• Bab 3 – Kegiatan Magang (deskripsi kegiatan harian/mingguan)\n` +
        `• Bab 4 – Penutup (kesimpulan dan saran)\n` +
        `• Lampiran\n\n` +
        `✍️ Tips Penulisan\n` +
        `• Catat kegiatan harian sejak hari pertama\n` +
        `• Gunakan bahasa formal dan baku\n` +
        `• Ikuti format yang diminta kampus\n` +
        `• Minta bimbingan dosen pembimbing secara berkala`
    },
    {
      keywords: ['komunikasi', 'berbicara', 'ngobrol', 'rekan kerja', 'teman kerja', 'kolega'],
      response: `Tips berkomunikasi di lingkungan kerja:\n\n` +
        `🗣️ Komunikasi Verbal\n` +
        `• Gunakan bahasa yang sopan dan jelas\n` +
        `• Bicaralah dengan tenang, tidak terburu-buru\n` +
        `• Dengarkan lawan bicara hingga selesai\n\n` +
        `💬 Komunikasi Tertulis\n` +
        `• Periksa ejaan sebelum mengirim pesan\n` +
        `• Gunakan sapaan yang sesuai (Pak/Bu/Kak)\n` +
        `• Hindari singkatan tidak baku dalam pesan resmi\n\n` +
        `🤝 Dengan Rekan Kerja\n` +
        `• Tanyakan "Apakah kamu sedang sibuk?" sebelum mengajak bicara\n` +
        `• Hargai perbedaan pendapat dengan bijak\n` +
        `• Ucapkan terima kasih setelah mendapat bantuan`
    },
    {
      keywords: ['halo', 'hai', 'hi', 'hello', 'selamat pagi', 'selamat siang', 'selamat sore', 'apa kabar', 'siapa kamu'],
      response: `Halo! Saya InternBuddy AI, asisten berbasis kata kunci yang siap membantu kamu seputar magang. 😊\n\nKamu bisa bertanya tentang:\n• Persiapan sebelum memulai magang\n• Tips hari pertama magang\n• Etika dan sikap profesional\n• Cara menghubungi supervisor\n• Cara bertanya tentang tugas\n• Menghadapi kesulitan di tempat kerja\n• Meminta izin tidak masuk\n• Beradaptasi dengan lingkungan kerja\n\nSilakan ketik pertanyaanmu! 👇`
    },
    {
      keywords: ['terima kasih', 'makasih', 'thanks', 'thx', 'thank you'],
      response: `Sama-sama! Semoga magang kamu berjalan lancar dan menjadi pengalaman yang berharga. 🎓\n\nJika ada pertanyaan lain, jangan ragu untuk bertanya ya!`
    },
    {
      keywords: ['checklist', 'daftar tugas', 'to do', 'todo', 'persiapan list'],
      response: `Gunakan fitur Checklist Magang untuk mencatat dan memantau progres persiapanmu!\n\nDengan Checklist Magang kamu bisa:\n✅ Menambahkan kegiatan yang perlu diselesaikan\n📝 Mencatat deskripsi setiap kegiatan\n✔️ Menandai kegiatan yang sudah selesai\n🗑️ Menghapus kegiatan yang tidak relevan\n\nBuka halaman Checklist Magang melalui menu di sidebar.`
    },
    {
      keywords: ['panduan', 'baca panduan', 'informasi', 'tips magang'],
      response: `Kamu bisa membaca berbagai panduan lengkap di halaman Panduan Magang!\n\nTersedia tiga kategori panduan:\n📋 Persiapan Magang — dokumen, perlengkapan, dan persiapan hari pertama\n💬 Komunikasi Profesional — contoh kalimat dan etika komunikasi\n⚠️ Mengatasi Kendala — cara menghadapi masalah umum saat magang\n\nKlik "Panduan Magang" di menu sidebar untuk membacanya.`
    }
  ];

  /* ================================================================
     QUICK QUESTIONS — tombol shortcut yang bisa diklik pengguna
  ================================================================ */
  const QUICK_QUESTIONS = [
    'Apa saja yang perlu dipersiapkan sebelum magang?',
    'Bagaimana sikap yang baik di hari pertama magang?',
    'Bagaimana cara bertanya kepada supervisor?',
    'Bagaimana cara meminta izin tidak masuk?',
    'Tips beradaptasi dengan lingkungan kerja baru?',
    'Cara menghadapi kesulitan saat mengerjakan tugas?'
  ];

  /* ================================================================
     FALLBACK
  ================================================================ */
  const FALLBACK = `Maaf, saya belum memiliki informasi yang sesuai dengan pertanyaan tersebut.\n\nCoba tanyakan tentang:\n• Persiapan sebelum magang\n• Tips hari pertama magang\n• Etika dan komunikasi profesional\n• Cara menghubungi supervisor\n• Menghadapi kesulitan di tempat kerja\n• Meminta izin tidak masuk\n• Beradaptasi dengan lingkungan kerja\n\nAtau klik salah satu pertanyaan contoh di bawah! 👇`;

  /* ================================================================
     DOM Elements
  ================================================================ */
  const chatForm        = document.getElementById('chatForm');
  const chatInput       = document.getElementById('chatInput');
  const chatBody        = document.getElementById('chatBody');
  const sendBtn         = document.getElementById('sendBtn');
  const clearBtn        = document.getElementById('clearBtn');
  const quickContainer  = document.getElementById('quickQuestions');
  const quickWrap       = document.getElementById('quickQuestionsWrap');

  if (!chatForm) return;

  /* ================================================================
     Match a user message to a KB entry
  ================================================================ */
  function findResponse(msg) {
    const lower = msg.toLowerCase();
    for (const entry of KB) {
      if (entry.keywords.some(kw => lower.includes(kw))) {
        return entry.response;
      }
    }
    return FALLBACK;
  }

  /* ================================================================
     Render helpers
  ================================================================ */
  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function formatResponse(text) {
    // Convert \n to <br>, bold **text**, and style bullet-like lines
    return escapeHtml(text)
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  function renderMessage(text, role) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message', role === 'user' ? 'user-message' : 'ai-message');

    const avatar = document.createElement('div');
    avatar.classList.add('message-avatar');
    if (role === 'user') {
      avatar.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    } else {
      avatar.innerHTML = `<svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/><path d="M6 12v5c3.33 1.33 8.67 1.33 12 0v-5"/></svg>`;
    }

    const bubble = document.createElement('div');
    bubble.classList.add('message-bubble');
    bubble.innerHTML = role === 'user' ? escapeHtml(text) : formatResponse(text);

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    chatBody.appendChild(wrapper);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.classList.add('message', 'ai-message', 'typing-indicator');
    el.id = 'typingIndicator';
    el.innerHTML = `
      <div class="message-avatar">
        <svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/><path d="M6 12v5c3.33 1.33 8.67 1.33 12 0v-5"/></svg>
      </div>
      <div class="message-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
    chatBody.appendChild(el);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
  }

  /* ================================================================
     Send message flow
  ================================================================ */
  function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    renderMessage(trimmed, 'user');
    chatInput.value = '';
    sendBtn.disabled = true;
    chatInput.disabled = true;

    // Hide quick questions after first real interaction
    if (quickWrap) quickWrap.style.display = 'none';

    showTyping();

    // Slight delay so response feels natural (not instant)
    setTimeout(function () {
      hideTyping();
      const reply = findResponse(trimmed);
      renderMessage(reply, 'ai');
      sendBtn.disabled = false;
      chatInput.disabled = false;
      chatInput.focus();
    }, 600);
  }

  /* ================================================================
     Event Listeners
  ================================================================ */
  chatForm.addEventListener('submit', function (e) {
    e.preventDefault();
    sendMessage(chatInput.value);
  });

  chatInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(chatInput.value);
    }
  });

  // Clear / new conversation
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      // Remove all messages except the first welcome message
      const messages = chatBody.querySelectorAll('.message');
      messages.forEach(function (msg, i) {
        if (i > 0) msg.remove(); // keep index 0 (welcome)
      });
      if (quickWrap) quickWrap.style.display = 'block';
      chatInput.focus();
    });
  }

  /* ================================================================
     Build quick question buttons
  ================================================================ */
  if (quickContainer) {
    QUICK_QUESTIONS.forEach(function (q) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.classList.add('quick-btn');
      btn.textContent = q;
      btn.addEventListener('click', function () {
        sendMessage(q);
      });
      quickContainer.appendChild(btn);
    });
  }

})();
