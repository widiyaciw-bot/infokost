// ==================== DATA AWAL (MOCK DATABASE) ====================
const DEFAULT_KOST = [
    {
        id: 1,
        nama: "Kost Putri Melati",
        lokasi: "Jl. Merpati No. 12",
        harga: 850000,
        kamar: 12,
        fasilitas: ["WI-FI", "Tempat Tidur", "Kamar Mandi Dalam", "Dapur Bersama", "Lemari"],
        foto: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
        pemilikEmail: "pemilik@kost.com"
    },
    {
        id: 2,
        nama: "Kost Putra Jaya",
        lokasi: "Jl. Pendidikan No. 8",
        harga: 900000,
        kamar: 8,
        fasilitas: ["WI-FI", "Tempat Tidur", "Lemari", "Parkir Motor"],
        foto: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
        pemilikEmail: "pemilik@kost.com"
    },
    {
        id: 3,
        nama: "Kost Campur Indah",
        lokasi: "Jl. Kampus Raya No. 21",
        harga: 1200000,
        kamar: 15,
        fasilitas: ["WI-FI", "AC", "Kamar Mandi Dalam", "Dapur Bersama", "Lemari"],
        foto: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
        pemilikEmail: "pemilik@kost.com"
    }
];

const DEFAULT_OPER = [
    {
        id: 101,
        nama: "Kost Pennyy",
        lokasi: "Jl. Dirgahayu No. 01",
        harga: 1200000,
        deskripsi: "Oper kost sisa 5 bulan karena pindah kampus/magang. Kamar bersih, kamar mandi dalam, akses 24 jam.",
        foto: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80",
        pengoper: "Rina Mahasiswa",
        pengoperEmail: "rina@example.com"
    },
    {
        id: 102,
        nama: "Kost Nusa",
        lokasi: "Jl. Nusa Indah No. 12",
        harga: 1300000,
        deskripsi: "Oper kamar lantai 2, sudah termasuk kasur, lemari, dan Wi-Fi kencang. Dekat gerbang universitas.",
        foto: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
        pengoper: "Dimas Saputra",
        pengoperEmail: "dimas@example.com"
    },
    {
        id: 103,
        nama: "Kost Hitam",
        lokasi: "Jl. Kuningan No. 08",
        harga: 1000000,
        deskripsi: "Dioper cepat sisa sewa 4 bulan. Lingkungan tenang dan aman untuk belajar.",
        foto: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
        pengoper: "Alya Putri",
        pengoperEmail: "alya@example.com"
    }
];

const DEFAULT_USERS = [
    {
        nama: "Widiya Mahasiswa",
        email: "mahasiswa@kost.com",
        password: "123",
        role: "pengguna",
        telepon: "+62 812 3456 7890",
        alamat: "Jl. WR Supratman, Bengkulu"
    },
    {
        nama: "Budi Pemilik Kost",
        email: "pemilik@kost.com",
        password: "123",
        role: "pemilik",
        telepon: "+62 813 9876 5432",
        alamat: "Jl. Merpati No. 12, Bengkulu"
    }
];

const DEFAULT_PENGAJUAN = [
    {
        id: 501,
        kostId: 1,
        kostNama: "Kost Putri Melati",
        pemohonNama: "Kim Da-mi",
        pemohonEmail: "kimdami@example.com",
        telepon: "08123456789",
        tanggal: "20 Sep 2026",
        durasi: "6 Bulan",
        pesan: "Saya mahasiswi semester 3, ingin masuk tanggal 20.",
        status: "Menunggu"
    },
    {
        id: 502,
        kostId: 3,
        kostNama: "Kost Campur Indah",
        pemohonNama: "Anne Hathaway",
        pemohonEmail: "anne@example.com",
        telepon: "08987654321",
        tanggal: "18 Sep 2026",
        durasi: "12 Bulan",
        pesan: "Apakah masih tersedia kamar di lantai 1?",
        status: "Menunggu"
    }
];

const DEFAULT_CHATS = [
    {
        id: "thread_1_mahasiswa@kost.com",
        kostId: 1,
        kostNama: "Kost Putri Melati",
        penggunaEmail: "mahasiswa@kost.com",
        penggunaNama: "Widiya Mahasiswa",
        pemilikEmail: "pemilik@kost.com",
        pemilikNama: "Budi Pemilik Kost",
        messages: [
            {
                senderEmail: "mahasiswa@kost.com",
                senderName: "Widiya Mahasiswa",
                text: "Halo Pak, apakah kamar di Kost Putri Melati masih tersedia untuk bulan depan?",
                time: "09:30"
            },
            {
                senderEmail: "pemilik@kost.com",
                senderName: "Budi Pemilik Kost",
                text: "Halo Widiya, masih tersedia 12 kamar. Sudah termasuk kasur, lemari, dan Wi-Fi.",
                time: "09:35"
            }
        ]
    }
];

// ==================== STATE & STORAGE ====================
let kostList = JSON.parse(localStorage.getItem('ks_kost')) || DEFAULT_KOST;
let operList = JSON.parse(localStorage.getItem('ks_oper')) || DEFAULT_OPER;
let usersList = JSON.parse(localStorage.getItem('ks_users')) || DEFAULT_USERS;
let pengajuanList = JSON.parse(localStorage.getItem('ks_pengajuan')) || DEFAULT_PENGAJUAN;
let chatThreads = JSON.parse(localStorage.getItem('ks_chats')) || DEFAULT_CHATS;
let currentUser = JSON.parse(localStorage.getItem('ks_current_user')) || null;

let selectedKostId = null;
let activeThreadId = null;
let lastView = 'beranda';

let tempUploadedBase64 = {
    kost: null,
    oper: null
};

function saveAllData() {
    localStorage.setItem('ks_kost', JSON.stringify(kostList));
    localStorage.setItem('ks_oper', JSON.stringify(operList));
    localStorage.setItem('ks_users', JSON.stringify(usersList));
    localStorage.setItem('ks_pengajuan', JSON.stringify(pengajuanList));
    localStorage.setItem('ks_chats', JSON.stringify(chatThreads));
    localStorage.setItem('ks_current_user', JSON.stringify(currentUser));
}

function formatRupiah(angka) {
    return "Rp" + Number(angka).toLocaleString('id-ID') + "/bulan";
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==================== HELPER UPLOAD & KOMPRESI FOTO ====================
function compressImageToBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            callback(compressedDataUrl);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function previewUploadedImage(inputEl, previewImgId, placeholderId) {
    const file = inputEl.files[0];
    if (!file) return;

    compressImageToBase64(file, (base64String) => {
        const previewImg = document.getElementById(previewImgId);
        const placeholder = document.getElementById(placeholderId);

        previewImg.src = base64String;
        previewImg.style.display = 'block';
        placeholder.style.display = 'none';

        if (inputEl.id === 'kost-foto-file') {
            tempUploadedBase64.kost = base64String;
        } else if (inputEl.id === 'oper-foto-file') {
            tempUploadedBase64.oper = base64String;
        }
    });
}

// ==================== NAVIGASI & NAVBAR ====================
function renderNavbar() {
    const navMenu = document.getElementById('nav-menu');
    const authArea = document.getElementById('nav-auth-area');

    if (!currentUser) {
        navMenu.innerHTML = `
            <a href="#" onclick="navigate('beranda')">Beranda</a>
            <a href="#" onclick="navigate('cari-kost')">Cari Kost</a>
            <a href="#" onclick="navigate('oper-kost')">Oper Kost</a>
        `;
        authArea.innerHTML = `
            <span class="role-pill">Pengunjung</span>
            <button class="btn btn-primary btn-sm" onclick="navigate('login')">Masuk</button>
        `;
    } else if (currentUser.role === 'pengguna') {
        navMenu.innerHTML = `
            <a href="#" onclick="navigate('beranda')">Beranda</a>
            <a href="#" onclick="navigate('cari-kost')">Cari Kost</a>
            <a href="#" onclick="navigate('oper-kost')">Oper Kost</a>
            <a href="#" onclick="navigate('chat')">Pesan</a>
        `;
        authArea.innerHTML = `
            <span class="role-pill">Mahasiswa</span>
            <button class="btn btn-outline btn-sm" onclick="navigate('profil')">Profil</button>
        `;
    } else if (currentUser.role === 'pemilik') {
        navMenu.innerHTML = `
            <a href="#" onclick="navigate('beranda')">Beranda</a>
            <a href="#" onclick="navigate('kelola-kost')">Data Kost</a>
            <a href="#" onclick="navigate('kelola-pengajuan')">Pengajuan Sewa</a>
            <a href="#" onclick="navigate('chat')">Pesan</a>
        `;
        authArea.innerHTML = `
            <span class="role-pill">Pemilik Kost</span>
            <button class="btn btn-outline btn-sm" onclick="navigate('profil')">Profil</button>
        `;
    }
}

function navigate(viewId) {
    const activeSection = document.querySelector('.view-section.active');
    if (activeSection && activeSection.id !== `view-${viewId}`) {
        lastView = activeSection.id.replace('view-', '');
    }

    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    const target = document.getElementById(`view-${viewId}`);
    if (target) target.classList.add('active');

    window.scrollTo(0, 0);

    if (viewId === 'beranda') renderBeranda();
    if (viewId === 'cari-kost') renderKatalogKost(kostList);
    if (viewId === 'oper-kost') renderOperKost();
    if (viewId === 'profil') renderProfil();
    if (viewId === 'kelola-kost') renderKelolaKost();
    if (viewId === 'kelola-pengajuan') renderKelolaPengajuan();
    if (viewId === 'chat') renderChatPage();
}

function historyBack() {
    navigate(lastView || 'beranda');
}

// ==================== RENDER KATALOG & DETAIL KOST ====================
function createKostCardHTML(kost, isOper = false) {
    const isMine = isOper && currentUser && (kost.pengoperEmail === currentUser.email);
    const badgeText = isOper ? (isMine ? 'OPER KOST SAYA' : 'OPER KOST') : 'TERSEDIA';

    return `
        <div class="kost-card">
            <div class="card-img-wrap">
                <span class="status-badge">${badgeText}</span>
                <img src="${kost.foto}" alt="${kost.nama}">
            </div>
            <div class="card-body">
                <div>
                    <h3 class="card-title">${kost.nama}</h3>
                    <p class="card-loc">&#128205; ${kost.lokasi}</p>
                </div>
                <div>
                    <div class="card-meta">
                        <span class="card-price">${formatRupiah(kost.harga)}</span>
                        <span class="card-rooms">${isOper ? 'Oleh ' + kost.pengoper : kost.kamar + ' Kamar'}</span>
                    </div>
                    <button class="btn btn-primary full-width" onclick="${isOper ? `viewDetailOper(${kost.id})` : `viewDetailKost(${kost.id})`}">
                        Lihat Detail
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderBeranda() {
    const container = document.getElementById('beranda-kost-list');
    container.innerHTML = kostList.slice(0, 3).map(k => createKostCardHTML(k, false)).join('');
}

function renderKatalogKost(data) {
    const container = document.getElementById('katalog-kost-list');
    if (data.length === 0) {
        container.innerHTML = `<p>Tidak ada kost yang sesuai dengan pencarian.</p>`;
        return;
    }
    container.innerHTML = data.map(k => createKostCardHTML(k, false)).join('');
}

function filterKost() {
    const keyword = document.getElementById('search-kost-input').value.toLowerCase();
    const hargaFilter = document.getElementById('filter-harga').value;
    const fasFilter = document.getElementById('filter-fasilitas').value;

    const filtered = kostList.filter(k => {
        const matchText = k.nama.toLowerCase().includes(keyword) || k.lokasi.toLowerCase().includes(keyword);
        let matchHarga = true;
        if (hargaFilter === 'low') matchHarga = k.harga < 1000000;
        if (hargaFilter === 'mid') matchHarga = k.harga >= 1000000 && k.harga <= 1500000;
        if (hargaFilter === 'high') matchHarga = k.harga > 1500000;

        const matchFas = fasFilter === 'all' || k.fasilitas.includes(fasFilter);
        return matchText && matchHarga && matchFas;
    });

    renderKatalogKost(filtered);
}

function viewDetailKost(id) {
    selectedKostId = id;
    const kost = kostList.find(k => k.id === id);
    if (!kost) return;

    const isPemilikKost = currentUser && (currentUser.role === 'pemilik');
    const savedIds = (currentUser && currentUser.savedKostIds) ? currentUser.savedKostIds : [];
    const isSaved = savedIds.includes(kost.id);

    let actionHTML = '';
    if (isPemilikKost) {
        actionHTML = `
            <div style="width:100%; padding:12px; background:#fef3c7; border:1px solid #fde68a; border-radius:8px; font-size:0.88rem; color:#92400e;">
                &#9888; Anda sedang masuk sebagai <strong>Pemilik Kost</strong>. Gunakan akun <strong>Mahasiswa</strong> untuk mengajukan sewa kamar.
            </div>
        `;
    } else {
        actionHTML = `
            <button class="btn btn-primary" onclick="handleAjukanSewaClick()">Ajukan Sewa</button>
            <button class="btn btn-outline" onclick="startChatWithOwner(${kost.id})">&#128172; Chat Pemilik</button>
            <button class="btn ${isSaved ? 'btn-success' : 'btn-secondary'}" onclick="toggleSaveKost(${kost.id})">
                ${isSaved ? '&#9829; Tersimpan' : '&#9825; Simpan'}
            </button>
        `;
    }

    const container = document.getElementById('detail-kost-container');
    container.innerHTML = `
        <img src="${kost.foto}" alt="${kost.nama}" class="detail-image">
        <div class="detail-info">
            <span class="pill-badge">&bull; KAMAR TERSEDIA (${kost.kamar} Kamar)</span>
            <h1>${kost.nama}</h1>
            <p class="card-loc">&#128205; ${kost.lokasi}</p>
            <p class="detail-price">${formatRupiah(kost.harga)}</p>
            
            <h4>Fasilitas Kost:</h4>
            <div class="facility-grid">
                ${kost.fasilitas.map(f => `<div class="facility-item">&#10003; ${f}</div>`).join('')}
            </div>

            <div class="form-actions">
                ${actionHTML}
            </div>
        </div>
    `;
    navigate('detail-kost');
}

function toggleSaveKost(kostId) {
    if (!currentUser) {
        showToast('Silakan masuk sebagai Mahasiswa terlebih dahulu untuk menyimpan kost.');
        navigate('login');
        return;
    }
    if (currentUser.role === 'pemilik') {
        showToast('Fitur simpan kost hanya tersedia untuk akun Mahasiswa.');
        return;
    }

    if (!currentUser.savedKostIds) {
        currentUser.savedKostIds = [];
    }

    const index = currentUser.savedKostIds.indexOf(kostId);
    if (index === -1) {
        currentUser.savedKostIds.push(kostId);
        showToast('Kost disimpan! Lihat di menu Profil > Kost Tersimpan.');
    } else {
        currentUser.savedKostIds.splice(index, 1);
        showToast('Kost dihapus dari daftar tersimpan.');
    }

    // Sinkronkan perubahan ke array usersList di localStorage
    const userIdx = usersList.findIndex(u => u.email === currentUser.email);
    if (userIdx !== -1) usersList[userIdx] = currentUser;

    saveAllData();
    viewDetailKost(kostId);
}

function renderSavedKost() {
    const container = document.getElementById('saved-kost-list');
    if (!container || !currentUser) return;

    const savedIds = currentUser.savedKostIds || [];
    const savedKosts = kostList.filter(k => savedIds.includes(k.id));

    if (savedKosts.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; padding: 32px; text-align: center; border: 1px dashed var(--border); border-radius: var(--radius); color: var(--text-muted);">
                <p style="margin-bottom: 12px;">Belum ada kost yang Anda simpan.</p>
                <button class="btn btn-primary btn-sm" onclick="navigate('cari-kost')">Cari Kost Sekarang</button>
            </div>
        `;
        return;
    }

    container.innerHTML = savedKosts.map(k => `
        <div class="kost-card">
            <div class="card-img-wrap">
                <span class="status-badge">TERSIMPAN</span>
                <img src="${k.foto}" alt="${k.nama}">
            </div>
            <div class="card-body">
                <div>
                    <h3 class="card-title">${k.nama}</h3>
                    <p class="card-loc">&#128205; ${k.lokasi}</p>
                </div>
                <div>
                    <div class="card-meta">
                        <span class="card-price">${formatRupiah(k.harga)}</span>
                        <span class="card-rooms">${k.kamar} Kamar</span>
                    </div>
                    <div class="form-actions" style="margin-top: 0;">
                        <button class="btn btn-primary btn-sm full-width" onclick="viewDetailKost(${k.id})">Lihat Detail</button>
                        <button class="btn btn-danger btn-sm" onclick="removeSavedFromProfil(${k.id})" title="Hapus dari simpanan">Hapus</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function removeSavedFromProfil(kostId) {
    if (!currentUser || !currentUser.savedKostIds) return;
    currentUser.savedKostIds = currentUser.savedKostIds.filter(id => id !== kostId);

    const userIdx = usersList.findIndex(u => u.email === currentUser.email);
    if (userIdx !== -1) usersList[userIdx] = currentUser;

    saveAllData();
    renderSavedKost();
    showToast('Kost dihapus dari daftar tersimpan.');
}

function viewDetailOper(id) {
    const oper = operList.find(o => o.id === id);
    if (!oper) return;

    const isMyOwnOper = currentUser && (oper.pengoperEmail === currentUser.email);
    const isPemilikKost = currentUser && (currentUser.role === 'pemilik');

    let actionButtonsHTML = '';

    if (isMyOwnOper) {
        // Postingan oper kost milik akun sendiri -> Tidak boleh ajukan ke diri sendiri
        actionButtonsHTML = `
            <div style="width:100%; padding:12px; background:#f8f9fa; border:1px solid #e5e7eb; border-radius:8px; margin-bottom:12px; font-size:0.88rem; color:#374151;">
                &#9432; Ini adalah postingan <strong>Oper Kost milik Anda sendiri</strong>.
            </div>
            <button class="btn btn-danger" onclick="deleteOperKost(${oper.id})">&#128465; Hapus Postingan Oper Kost</button>
        `;
    } else if (isPemilikKost) {
        // Login sebagai Pemilik Kost -> Dilarang mengajukan oper kost
        actionButtonsHTML = `
            <div style="width:100%; padding:12px; background:#fef3c7; border:1px solid #fde68a; border-radius:8px; font-size:0.88rem; color:#92400e;">
                &#9888; Anda sedang login sebagai <strong>Pemilik Kost</strong>. Gunakan akun <strong>Mahasiswa</strong> untuk mengambil oper kost.
            </div>
        `;
    } else {
        // Pengunjung atau Mahasiswa lain -> Bisa mengajukan oper kost & chat pengoper
        actionButtonsHTML = `
            <button class="btn btn-primary" onclick="handleAmbilOperClick(${oper.id})">Ajukan Ambil Oper Kost</button>
            <button class="btn btn-outline" onclick="startChatWithOper(${oper.id})">&#128172; Chat Pengoper</button>
        `;
    }

    const container = document.getElementById('detail-kost-container');
    container.innerHTML = `
        <img src="${oper.foto}" alt="${oper.nama}" class="detail-image">
        <div class="detail-info">
            <span class="pill-badge">OPER KOST &bull; Oleh ${oper.pengoper}</span>
            <h1>${oper.nama}</h1>
            <p class="card-loc">&#128205; ${oper.lokasi}</p>
            <p class="detail-price">${formatRupiah(oper.harga)}</p>
            <p style="margin-bottom: 24px; color: var(--text-muted);">${oper.deskripsi}</p>

            <div class="form-actions">
                ${actionButtonsHTML}
            </div>
        </div>
    `;
    navigate('detail-kost');
}

// ==================== PENGAJUAN SEWA & OPER KOST ====================
function handleAjukanSewaClick() {
    if (!currentUser) {
        showToast('Silakan masuk sebagai Mahasiswa terlebih dahulu untuk mengajukan sewa.');
        navigate('login');
        return;
    }
    if (currentUser.role === 'pemilik') {
        showToast('Akun Pemilik Kost tidak dapat mengajukan sewa.');
        return;
    }

    const kost = kostList.find(k => k.id === selectedKostId);
    document.getElementById('sewa-kost-target').textContent = `Kost Tujuan: ${kost.nama} (${formatRupiah(kost.harga)})`;
    document.getElementById('sewa-nama').value = currentUser.nama;
    document.getElementById('sewa-telepon').value = currentUser.telepon || '';
    navigate('ajukan-sewa');
}

function submitPengajuanSewa(e) {
    e.preventDefault();
    const kost = kostList.find(k => k.id === selectedKostId);
    const newPengajuan = {
        id: Date.now(),
        kostId: kost.id,
        kostNama: kost.nama,
        pemohonNama: document.getElementById('sewa-nama').value,
        pemohonEmail: currentUser.email,
        telepon: document.getElementById('sewa-telepon').value,
        tanggal: document.getElementById('sewa-tanggal').value,
        durasi: document.getElementById('sewa-durasi').value,
        pesan: document.getElementById('sewa-pesan').value,
        status: "Menunggu"
    };

    pengajuanList.unshift(newPengajuan);
    saveAllData();
    showToast('Pengajuan sewa berhasil dikirim ke Pemilik Kost!');
    navigate('profil');
    switchProfilTab('riwayat');
}

function renderOperKost() {
    const container = document.getElementById('oper-kost-list');
    container.innerHTML = operList.map(o => createKostCardHTML(o, true)).join('');
}

function handlePostingOperClick() {
    if (!currentUser) {
        showToast('Silakan masuk sebagai Mahasiswa terlebih dahulu untuk memposting oper kost.');
        navigate('login');
        return;
    }
    if (currentUser.role === 'pemilik') {
        showToast('Fitur Posting Oper Kost hanya untuk Mahasiswa. Pemilik kost mengelola kamar di menu Data Kost.');
        return;
    }
    tempUploadedBase64.oper = null;
    document.getElementById('oper-preview-img').style.display = 'none';
    document.getElementById('oper-upload-placeholder').style.display = 'flex';
    navigate('posting-oper');
}

function handleAmbilOperClick(operId) {
    if (!currentUser) {
        showToast('Silakan masuk sebagai Mahasiswa terlebih dahulu.');
        navigate('login');
        return;
    }
    if (currentUser.role === 'pemilik') {
        showToast('Akun Pemilik Kost tidak dapat mengambil oper kost.');
        return;
    }

    const oper = operList.find(o => o.id === operId);
    if (!oper) return;

    if (oper.pengoperEmail === currentUser.email) {
        showToast('Anda tidak dapat mengajukan oper kost milik Anda sendiri.');
        return;
    }

    showToast(`Permintaan ambil oper kost "${oper.nama}" telah dikirim ke ${oper.pengoper}!`);
    startChatWithOper(oper.id);
}

function submitOperKost(e) {
    e.preventDefault();
    const defaultImg = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80";

    const newOper = {
        id: Date.now(),
        nama: document.getElementById('oper-nama').value,
        lokasi: document.getElementById('oper-lokasi').value,
        harga: Number(document.getElementById('oper-harga').value),
        deskripsi: document.getElementById('oper-deskripsi').value,
        foto: tempUploadedBase64.oper || defaultImg,
        pengoper: currentUser.nama,
        pengoperEmail: currentUser.email
    };

    operList.unshift(newOper);
    saveAllData();

    document.getElementById('form-oper').reset();
    tempUploadedBase64.oper = null;
    document.getElementById('oper-preview-img').style.display = 'none';
    document.getElementById('oper-upload-placeholder').style.display = 'flex';

    showToast('Oper kost berhasil diposting!');
    navigate('oper-kost');
}

function deleteOperKost(operId) {
    if (!confirm('Yakin ingin menghapus postingan oper kost Anda ini?')) return;
    operList = operList.filter(o => o.id !== operId);
    saveAllData();
    showToast('Postingan oper kost berhasil dihapus.');
    navigate('oper-kost');
}

// ==================== AUTENTIKASI & PROFIL ====================
function updateRegisterHint() {
    const selectedRoleEl = document.querySelector('input[name="reg-role"]:checked');
    const labelNama = document.getElementById('reg-nama-label');
    if (!selectedRoleEl || !labelNama) return;

    if (selectedRoleEl.value === 'pemilik') {
        labelNama.textContent = "Nama Lengkap Pemilik / Pengelola Kost";
    } else {
        labelNama.textContent = "Nama Lengkap Mahasiswa";
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const pass = document.getElementById('login-password').value;

    const found = usersList.find(u => u.email.toLowerCase() === email && u.password === pass);
    if (!found) {
        showToast('Email atau password salah!');
        return;
    }

    currentUser = found;
    saveAllData();
    renderNavbar();
    showToast(`Selamat datang kembali, ${currentUser.nama}!`);
    navigate(currentUser.role === 'pemilik' ? 'kelola-kost' : 'beranda');
}

function handleRegister(e) {
    e.preventDefault();
    const role = document.querySelector('input[name="reg-role"]:checked').value;
    const emailInput = document.getElementById('reg-email').value.trim().toLowerCase();
    const teleponInput = document.getElementById('reg-telepon') ? document.getElementById('reg-telepon').value.trim() : "+62 812 0000 0000";

    const emailSudahAda = usersList.some(u => u.email.toLowerCase() === emailInput);
    if (emailSudahAda) {
        showToast('Email ini sudah terdaftar! Silakan gunakan email lain atau Masuk.');
        return;
    }

    const newUser = {
        nama: document.getElementById('reg-nama').value.trim(),
        email: emailInput,
        password: document.getElementById('reg-password').value,
        role: role,
        telepon: teleponInput,
        alamat: "Kota Bengkulu"
    };

    usersList.push(newUser);
    currentUser = newUser;
    saveAllData();
    renderNavbar();

    if (role === 'pemilik') {
        showToast('Akun Pemilik Kost berhasil dibuat! Silakan kelola data kost Anda.');
        navigate('kelola-kost');
    } else {
        showToast('Akun Mahasiswa berhasil dibuat! Selamat mencari kost.');
        navigate('beranda');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('ks_current_user');
    renderNavbar();
    showToast('Anda telah keluar.');
    navigate('beranda');
}

function renderProfil() {
    if (!currentUser) return navigate('login');

    document.getElementById('profil-heading').textContent = 
        currentUser.role === 'pemilik' ? 'Profil Pemilik Kost' : 'Profil Mahasiswa / Pengguna';
    
    document.getElementById('disp-nama').textContent = currentUser.nama;
    document.getElementById('disp-email').textContent = currentUser.email;
    document.getElementById('disp-telepon').textContent = currentUser.telepon || '-';
    document.getElementById('disp-alamat').textContent = currentUser.alamat || '-';

    document.getElementById('edit-nama').value = currentUser.nama;
    document.getElementById('edit-email').value = currentUser.email;
    document.getElementById('edit-telepon').value = currentUser.telepon || '';
    document.getElementById('edit-alamat').value = currentUser.alamat || '';
    document.getElementById('edit-password').value = currentUser.password;

    const menuRiwayat = document.getElementById('menu-riwayat-sewa');
    if (currentUser.role === 'pemilik') {
        menuRiwayat.style.display = 'none';
    } else {
        menuRiwayat.style.display = 'block';
        const myPengajuan = pengajuanList.filter(p => p.pemohonEmail === currentUser.email);
        const tbody = document.getElementById('user-pengajuan-tbody');
        tbody.innerHTML = myPengajuan.length ? myPengajuan.map(p => `
            <tr>
                <td><strong>${p.kostNama}</strong></td>
                <td>${p.tanggal}</td>
                <td>${p.durasi}</td>
                <td><span class="badge-status status-${p.status.toLowerCase()}">${p.status}</span></td>
            </tr>
        `).join('') : `<tr><td colspan="4">Belum ada riwayat pengajuan sewa.</td></tr>`;
    }
    const menuRiwayat = document.getElementById('menu-riwayat-sewa');
    const menuTersimpan = document.getElementById('menu-kost-tersimpan');

    if (currentUser.role === 'pemilik') {
        menuRiwayat.style.display = 'none';
        if (menuTersimpan) menuTersimpan.style.display = 'none';
    } else {
        menuRiwayat.style.display = 'block';
        if (menuTersimpan) menuTersimpan.style.display = 'block';

        const myPengajuan = pengajuanList.filter(p => p.pemohonEmail === currentUser.email);
        const tbody = document.getElementById('user-pengajuan-tbody');
        tbody.innerHTML = myPengajuan.length ? myPengajuan.map(p => `
            <tr>
                <td><strong>${p.kostNama}</strong></td>
                <td>${p.tanggal}</td>
                <td>${p.durasi}</td>
                <td><span class="badge-status status-${p.status.toLowerCase()}">${p.status}</span></td>
            </tr>
        `).join('') : `<tr><td colspan="4">Belum ada riwayat pengajuan sewa.</td></tr>`;

        renderSavedKost();
    }
}

function switchProfilTab(tabName, btnEl) {
    document.querySelectorAll('.profil-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`profil-tab-${tabName}`).classList.add('active');

    if (btnEl) {
        document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
        btnEl.classList.add('active');
    }
}

function saveProfil(e) {
    e.preventDefault();
    currentUser.nama = document.getElementById('edit-nama').value;
    currentUser.email = document.getElementById('edit-email').value;
    currentUser.telepon = document.getElementById('edit-telepon').value;
    currentUser.alamat = document.getElementById('edit-alamat').value;
    currentUser.password = document.getElementById('edit-password').value;

    const idx = usersList.findIndex(u => u.email === currentUser.email);
    if (idx !== -1) usersList[idx] = currentUser;

    saveAllData();
    renderProfil();
    switchProfilTab('info');
    showToast('Perubahan profil disimpan!');
}

// ==================== KELOLA DATA KOST & PENGAJUAN (PEMILIK) ====================
function renderKelolaKost() {
    const container = document.getElementById('pemilik-kost-list');
    // Tampilkan kost milik pemilik yang sedang login (atau semua data awal jika demo)
    const myKosts = kostList.filter(k => k.pemilikEmail === currentUser.email);

    if (myKosts.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted);">Anda belum memiliki data kost. Klik tombol <strong>+ Tambah Kost</strong> untuk mulai menambahkan.</p>`;
        return;
    }

    container.innerHTML = myKosts.map(k => `
        <div class="kost-card">
            <div class="card-img-wrap">
                <span class="status-badge">${k.kamar} Tersedia</span>
                <img src="${k.foto}" alt="${k.nama}">
            </div>
            <div class="card-body">
                <div>
                    <h3 class="card-title">${k.nama}</h3>
                    <p class="card-loc">${k.lokasi}</p>
                    <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:12px;">
                        Total: ${k.kamar} Kamar &bull; ${formatRupiah(k.harga)}
                    </p>
                </div>
                <div class="form-actions" style="margin-top:0;">
                    <button class="btn btn-outline btn-sm full-width" onclick="openModalEditKost(${k.id})">Edit</button>
                    <button class="btn btn-danger btn-sm full-width" onclick="deleteKost(${k.id})">Hapus</button>
                </div>
            </div>
        </div>
    `).join('');
}

function openModalTambahKost() {
    document.getElementById('modal-kost-title').textContent = "Tambah Data Kost";
    document.getElementById('form-kelola-kost').reset();
    document.getElementById('kost-id').value = "";
    
    tempUploadedBase64.kost = null;
    document.getElementById('kost-preview-img').style.display = 'none';
    document.getElementById('kost-upload-placeholder').style.display = 'flex';

    document.getElementById('modal-kost').classList.add('active');
}

function openModalEditKost(id) {
    const kost = kostList.find(k => k.id === id);
    if (!kost) return;

    document.getElementById('modal-kost-title').textContent = "Edit Data Kost";
    document.getElementById('kost-id').value = kost.id;
    document.getElementById('kost-nama').value = kost.nama;
    document.getElementById('kost-alamat').value = kost.lokasi;
    document.getElementById('kost-harga').value = kost.harga;
    document.getElementById('kost-kamar').value = kost.kamar;
    document.getElementById('kost-fasilitas').value = kost.fasilitas.join(', ');

    tempUploadedBase64.kost = kost.foto;
    const previewImg = document.getElementById('kost-preview-img');
    const placeholder = document.getElementById('kost-upload-placeholder');
    previewImg.src = kost.foto;
    previewImg.style.display = 'block';
    placeholder.style.display = 'none';

    document.getElementById('modal-kost').classList.add('active');
}

function closeModalKost() {
    document.getElementById('modal-kost').classList.remove('active');
}

function saveKostData(e) {
    e.preventDefault();
    const id = document.getElementById('kost-id').value;
    const fasilitasArr = document.getElementById('kost-fasilitas').value.split(',').map(s => s.trim()).filter(Boolean);
    const defaultImg = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80";

    const dataObj = {
        id: id ? Number(id) : Date.now(),
        nama: document.getElementById('kost-nama').value,
        lokasi: document.getElementById('kost-alamat').value,
        harga: Number(document.getElementById('kost-harga').value),
        kamar: Number(document.getElementById('kost-kamar').value),
        fasilitas: fasilitasArr,
        foto: tempUploadedBase64.kost || defaultImg,
        pemilikEmail: currentUser.email
    };

    if (id) {
        const idx = kostList.findIndex(k => k.id === Number(id));
        kostList[idx] = dataObj;
        showToast('Data kost berhasil diperbarui!');
    } else {
        kostList.unshift(dataObj);
        showToast('Kost baru berhasil ditambahkan!');
    }

    tempUploadedBase64.kost = null;
    saveAllData();
    closeModalKost();
    renderKelolaKost();
}

function deleteKost(id) {
    if (!confirm('Yakin ingin menghapus data kost ini?')) return;
    kostList = kostList.filter(k => k.id !== id);
    saveAllData();
    renderKelolaKost();
    showToast('Data kost dihapus.');
}

function renderKelolaPengajuan() {
    const tbody = document.getElementById('pemilik-pengajuan-tbody');
    const myKostIds = kostList.filter(k => k.pemilikEmail === currentUser.email).map(k => k.id);
    const myPengajuan = pengajuanList.filter(p => myKostIds.includes(p.kostId));

    if (myPengajuan.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">Belum ada pengajuan sewa masuk untuk kost Anda.</td></tr>`;
        return;
    }

    tbody.innerHTML = myPengajuan.map(p => `
        <tr>
            <td><strong>${p.pemohonNama}</strong></td>
            <td>${p.kostNama}</td>
            <td>${p.tanggal}</td>
            <td>${p.durasi}<br><small style="color:var(--text-muted)">${p.telepon}</small></td>
            <td><span class="badge-status status-${p.status.toLowerCase()}">${p.status}</span></td>
            <td>
                ${p.status === 'Menunggu' ? `
                    <button class="btn btn-success btn-sm" onclick="updateStatusPengajuan(${p.id}, 'Diterima')">Terima</button>
                    <button class="btn btn-danger btn-sm" onclick="updateStatusPengajuan(${p.id}, 'Ditolak')">Tolak</button>
                ` : '<small style="color:var(--text-muted)">Selesai</small>'}
            </td>
        </tr>
    `).join('');
}

function updateStatusPengajuan(id, newStatus) {
    const idx = pengajuanList.findIndex(p => p.id === id);
    if (idx !== -1) {
        pengajuanList[idx].status = newStatus;
        saveAllData();
        renderKelolaPengajuan();
        showToast(`Pengajuan sewa telah ${newStatus.toLowerCase()}.`);
    }
}

// ==================== LOGIKA CHAT / PESAN LANGSUNG ====================
function startChatWithOwner(kostId) {
    if (!currentUser) {
        showToast('Silakan masuk terlebih dahulu untuk menghubungi pemilik kost.');
        navigate('login');
        return;
    }
    if (currentUser.role === 'pemilik') {
        showToast('Anda masuk sebagai Pemilik Kost.');
        navigate('chat');
        return;
    }

    const kost = kostList.find(k => k.id === kostId);
    if (!kost) return;

    const pemilikEmail = kost.pemilikEmail || "pemilik@kost.com";
    const pemilikObj = usersList.find(u => u.email === pemilikEmail);
    const pemilikNama = pemilikObj ? pemilikObj.nama : "Pemilik Kost";

    const threadId = `thread_${kost.id}_${currentUser.email}`;
    let existingThread = chatThreads.find(t => t.id === threadId);

    if (!existingThread) {
        existingThread = {
            id: threadId,
            kostId: kost.id,
            kostNama: kost.nama,
            penggunaEmail: currentUser.email,
            penggunaNama: currentUser.nama,
            pemilikEmail: pemilikEmail,
            pemilikNama: pemilikNama,
            messages: []
        };
        chatThreads.unshift(existingThread);
        saveAllData();
    }

    activeThreadId = threadId;
    navigate('chat');
}

function startChatWithOper(operId) {
    if (!currentUser) {
        showToast('Silakan masuk terlebih dahulu untuk menghubungi pengoper kost.');
        navigate('login');
        return;
    }

    const oper = operList.find(o => o.id === operId);
    if (!oper) return;

    if (oper.pengoperEmail === currentUser.email) {
        showToast('Ini adalah postingan oper kost milik Anda sendiri.');
        return;
    }

    const targetEmail = oper.pengoperEmail || "pemilik@kost.com";
    const threadId = `thread_oper_${oper.id}_${currentUser.email}`;
    let existingThread = chatThreads.find(t => t.id === threadId);

    if (!existingThread) {
        existingThread = {
            id: threadId,
            kostId: oper.id,
            kostNama: `[Oper Kost] ${oper.nama}`,
            penggunaEmail: currentUser.email,
            penggunaNama: currentUser.nama,
            pemilikEmail: targetEmail,
            pemilikNama: oper.pengoper,
            messages: []
        };
        chatThreads.unshift(existingThread);
        saveAllData();
    }

    activeThreadId = threadId;
    navigate('chat');
}

function renderChatPage() {
    if (!currentUser) return navigate('login');

    const myThreads = chatThreads.filter(t => 
        t.pemilikEmail === currentUser.email || t.penggunaEmail === currentUser.email
    );

    const threadListEl = document.getElementById('chat-thread-list');
    const headerEl = document.getElementById('chat-header');
    const msgContainer = document.getElementById('chat-messages');
    const formEl = document.getElementById('chat-form');

    if (myThreads.length === 0) {
        threadListEl.innerHTML = `<div style="padding:20px; color:var(--text-muted); font-size:0.88rem;">Belum ada percakapan.</div>`;
        headerEl.innerHTML = `<span class="text-muted">Belum ada obrolan</span>`;
        msgContainer.innerHTML = `<div class="chat-empty-state">Mulai chat dari halaman detail kost atau oper kost.</div>`;
        formEl.style.display = 'none';
        return;
    }

    if (!activeThreadId || !myThreads.some(t => t.id === activeThreadId)) {
        activeThreadId = myThreads[0].id;
    }

    threadListEl.innerHTML = myThreads.map(t => {
        const lawanBicara = t.pemilikEmail === currentUser.email ? t.penggunaNama : t.pemilikNama;
        const lastMsg = t.messages.length ? t.messages[t.messages.length - 1].text : 'Mulai obrolan baru...';
        return `
            <div class="chat-thread-item ${t.id === activeThreadId ? 'active' : ''}" onclick="selectChatThread('${t.id}')">
                <div class="thread-title">${lawanBicara}</div>
                <span class="thread-sub">${t.kostNama}</span>
                <div class="thread-preview">${lastMsg}</div>
            </div>
        `;
    }).join('');

    renderActiveChatMessages();
}

function selectChatThread(threadId) {
    activeThreadId = threadId;
    renderChatPage();
}

function renderActiveChatMessages() {
    const thread = chatThreads.find(t => t.id === activeThreadId);
    const headerEl = document.getElementById('chat-header');
    const msgContainer = document.getElementById('chat-messages');
    const formEl = document.getElementById('chat-form');

    if (!thread) {
        formEl.style.display = 'none';
        return;
    }

    const lawanBicara = thread.pemilikEmail === currentUser.email ? thread.penggunaNama : thread.pemilikNama;
    headerEl.innerHTML = `
        <div>
            <strong>${lawanBicara}</strong>
            <span style="display:block; font-size:0.8rem; color:var(--text-muted);">Topik: ${thread.kostNama}</span>
        </div>
    `;

    formEl.style.display = 'flex';

    if (thread.messages.length === 0) {
        msgContainer.innerHTML = `<div class="chat-empty-state">Kirim pesan pertama Anda mengenai <strong>${thread.kostNama}</strong>.</div>`;
    } else {
        msgContainer.innerHTML = thread.messages.map(m => {
            const isMe = m.senderEmail === currentUser.email;
            return `
                <div class="msg-bubble ${isMe ? 'msg-sent' : 'msg-received'}">
                    <div>${m.text}</div>
                    <span class="msg-meta">${isMe ? 'Anda' : m.senderName} &bull; ${m.time}</span>
                </div>
            `;
        }).join('');
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }
}

function sendChatMessage(e) {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text || !activeThreadId) return;

    const thread = chatThreads.find(t => t.id === activeThreadId);
    if (!thread) return;

    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    thread.messages.push({
        senderEmail: currentUser.email,
        senderName: currentUser.nama,
        text: text,
        time: timeStr
    });

    input.value = '';
    saveAllData();
    renderChatPage();
}

// ==================== INISIALISASI APLIKASI ====================
document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    renderBeranda();
});