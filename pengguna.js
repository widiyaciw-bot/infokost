if (currentUser && currentUser.role === 'pemilik') {
    window.location.href = 'pemilik.html';
}

let selectedKostId = null;
let lastView = 'beranda';

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
    } else {
        navMenu.innerHTML = `
            <a href="#" onclick="navigate('beranda')">Beranda</a>
            <a href="#" onclick="navigate('cari-kost')">Cari Kost</a>
            <a href="#" onclick="navigate('oper-kost')">Oper Kost</a>
            <a href="#" onclick="navigate('chat')">Pesan</a>
        `;
        authArea.innerHTML = `
            <span class="role-pill">Pencari Kost</span>
            <button class="btn btn-outline btn-sm" onclick="navigate('profil')">Profil</button>
        `;
    }
}

async function navigate(viewId) {
    const activeSection = document.querySelector('.view-section.active');
    if (activeSection && activeSection.id !== `view-${viewId}`) {
        lastView = activeSection.id.replace('view-', '');
    }
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    const target = document.getElementById(`view-${viewId}`);
    if (target) target.classList.add('active');
    window.scrollTo(0, 0);

    await loadAllDataFromSupabase();
    if (viewId === 'beranda') renderBeranda();
    if (viewId === 'cari-kost') renderKatalogKost(kostList);
    if (viewId === 'oper-kost') renderOperKost();
    if (viewId === 'profil') renderProfil();
    if (viewId === 'chat') renderChatPage();
}

function historyBack() {
    navigate(lastView || 'beranda');
}

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
    document.getElementById('beranda-kost-list').innerHTML = kostList.slice(0, 3).map(k => createKostCardHTML(k, false)).join('');
}

function renderKatalogKost(data) {
    const container = document.getElementById('katalog-kost-list');
    container.innerHTML = data.length ? data.map(k => createKostCardHTML(k, false)).join('') : `<p>Tidak ada kost ditemukan.</p>`;
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

    const savedIds = (currentUser && currentUser.savedKostIds) ? currentUser.savedKostIds : [];
    const isSaved = savedIds.includes(kost.id);

    document.getElementById('detail-kost-container').innerHTML = `
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
                <button class="btn btn-primary" onclick="handleAjukanSewaClick()">Ajukan Sewa</button>
                <button class="btn btn-outline" onclick="startChatWithOwner(${kost.id})">&#128172; Chat Pemilik</button>
                <button class="btn ${isSaved ? 'btn-success' : 'btn-secondary'}" onclick="toggleSaveKost(${kost.id})">
                    ${isSaved ? '&#9829; Tersimpan' : '&#9825; Simpan'}
                </button>
            </div>
        </div>
    `;
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById('view-detail-kost').classList.add('active');
}

async function toggleSaveKost(kostId) {
    if (!currentUser) {
        showToast('Silakan masuk terlebih dahulu untuk menyimpan kost.');
        navigate('login');
        return;
    }
    if (!currentUser.savedKostIds) currentUser.savedKostIds = [];

    const idx = currentUser.savedKostIds.indexOf(kostId);
    if (idx === -1) {
        currentUser.savedKostIds.push(kostId);
        showToast('Kost disimpan! Cek di Profil > Kost Tersimpan.');
    } else {
        currentUser.savedKostIds.splice(idx, 1);
        showToast('Kost dihapus dari daftar tersimpan.');
    }

    const uIdx = usersList.findIndex(u => u.email === currentUser.email);
    if (uIdx !== -1) usersList[uIdx] = currentUser;
    await saveAllData();
    viewDetailKost(kostId);
}

function handleAjukanSewaClick() {
    if (!currentUser) {
        showToast('Silakan masuk terlebih dahulu untuk mengajukan sewa.');
        navigate('login');
        return;
    }
    const kost = kostList.find(k => k.id === selectedKostId);
    document.getElementById('sewa-kost-target').textContent = `Kost Tujuan: ${kost.nama} (${formatRupiah(kost.harga)})`;
    document.getElementById('sewa-nama').value = currentUser.nama;
    document.getElementById('sewa-telepon').value = currentUser.telepon || '';
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById('view-ajukan-sewa').classList.add('active');
}

async function submitPengajuanSewa(e) {
    e.preventDefault();
    const kost = kostList.find(k => k.id === selectedKostId);
    pengajuanList.unshift({
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
    });
    await saveAllData();
    showToast('Pengajuan sewa berhasil dikirim!');
    await navigate('profil');
    switchProfilTab('riwayat');
}

function renderOperKost() {
    document.getElementById('oper-kost-list').innerHTML = operList.map(o => createKostCardHTML(o, true)).join('');
}

function viewDetailOper(id) {
    const oper = operList.find(o => o.id === id);
    if (!oper) return;

    const isMyOwnOper = currentUser && (oper.pengoperEmail === currentUser.email);
    const actionButtonsHTML = isMyOwnOper
        ? `<div style="width:100%; padding:12px; background:#f8f9fa; border:1px solid #e5e7eb; border-radius:8px; margin-bottom:10px;">
               &#9432; Ini adalah postingan <strong>Oper Kost milik Anda sendiri</strong>.
           </div>
           <button class="btn btn-danger" onclick="deleteOperKost(${oper.id})">&#128465; Hapus Postingan</button>`
        : `<button class="btn btn-primary" onclick="handleAmbilOperClick(${oper.id})">Ajukan Ambil Oper Kost</button>
           <button class="btn btn-outline" onclick="startChatWithOper(${oper.id})">&#128172; Chat Pengoper</button>`;

    document.getElementById('detail-kost-container').innerHTML = `
        <img src="${oper.foto}" alt="${oper.nama}" class="detail-image">
        <div class="detail-info">
            <span class="pill-badge">OPER KOST &bull; Oleh ${oper.pengoper}</span>
            <h1>${oper.nama}</h1>
            <p class="card-loc">&#128205; ${oper.lokasi}</p>
            <p class="detail-price">${formatRupiah(oper.harga)}</p>
            <p style="margin-bottom: 24px; color: var(--text-muted);">${oper.deskripsi}</p>
            <div class="form-actions">${actionButtonsHTML}</div>
        </div>
    `;
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById('view-detail-kost').classList.add('active');
}

function handlePostingOperClick() {
    if (!currentUser) {
        showToast('Silakan masuk terlebih dahulu untuk memposting oper kost.');
        navigate('login');
        return;
    }
    tempUploadedBase64.oper = null;
    document.getElementById('oper-preview-img').style.display = 'none';
    document.getElementById('oper-upload-placeholder').style.display = 'flex';
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById('view-posting-oper').classList.add('active');
}

async function submitOperKost(e) {
    e.preventDefault();
    const defaultImg = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80";
    operList.unshift({
        id: Date.now(),
        nama: document.getElementById('oper-nama').value,
        lokasi: document.getElementById('oper-lokasi').value,
        harga: Number(document.getElementById('oper-harga').value),
        deskripsi: document.getElementById('oper-deskripsi').value,
        foto: tempUploadedBase64.oper || defaultImg,
        pengoper: currentUser.nama,
        pengoperEmail: currentUser.email
    });
    await saveAllData();
    document.getElementById('form-oper').reset();
    showToast('Oper kost berhasil diposting!');
    navigate('oper-kost');
}

async function deleteOperKost(operId) {
    if (!confirm('Hapus postingan oper kost Anda?')) return;
    await db.from('oper_kost').delete().eq('id', operId);
    operList = operList.filter(o => o.id !== operId);
    showToast('Postingan dihapus.');
    navigate('oper-kost');
}

function handleAmbilOperClick(operId) {
    if (!currentUser) {
        showToast('Silakan masuk terlebih dahulu.');
        navigate('login');
        return;
    }
    const oper = operList.find(o => o.id === operId);
    showToast(`Permintaan ambil oper kost "${oper.nama}" dikirim ke ${oper.pengoper}!`);
    startChatWithOper(oper.id);
}

function renderProfil() {
    if (!currentUser) return navigate('login');
    document.getElementById('disp-nama').textContent = currentUser.nama;
    document.getElementById('disp-email').textContent = currentUser.email;
    document.getElementById('disp-telepon').textContent = currentUser.telepon || '-';
    document.getElementById('disp-alamat').textContent = currentUser.alamat || '-';

    document.getElementById('edit-nama').value = currentUser.nama;
    document.getElementById('edit-email').value = currentUser.email;
    document.getElementById('edit-telepon').value = currentUser.telepon || '';
    document.getElementById('edit-alamat').value = currentUser.alamat || '';
    document.getElementById('edit-password').value = currentUser.password;

    const myPengajuan = pengajuanList.filter(p => p.pemohonEmail === currentUser.email);
    document.getElementById('user-pengajuan-tbody').innerHTML = myPengajuan.length
        ? myPengajuan.map(p => `
            <tr>
                <td><strong>${p.kostNama}</strong></td>
                <td>${p.tanggal}</td>
                <td>${p.durasi}</td>
                <td><span class="badge-status status-${p.status.toLowerCase()}">${p.status}</span></td>
            </tr>
        `).join('')
        : `<tr><td colspan="4">Belum ada riwayat pengajuan sewa.</td></tr>`;

    const savedIds = currentUser.savedKostIds || [];
    const savedKosts = kostList.filter(k => savedIds.includes(k.id));
    document.getElementById('saved-kost-list').innerHTML = savedKosts.length
        ? savedKosts.map(k => `
            <div class="kost-card">
                <div class="card-img-wrap">
                    <span class="status-badge">TERSIMPAN</span>
                    <img src="${k.foto}" alt="${k.nama}">
                </div>
                <div class="card-body">
                    <div><h3 class="card-title">${k.nama}</h3><p class="card-loc">${k.lokasi}</p></div>
                    <div class="form-actions" style="margin-top:12px;">
                        <button class="btn btn-primary btn-sm full-width" onclick="viewDetailKost(${k.id})">Detail</button>
                        <button class="btn btn-danger btn-sm" onclick="toggleSaveKost(${k.id}); renderProfil();">Hapus</button>
                    </div>
                </div>
            </div>
        `).join('')
        : `<p style="color:var(--text-muted);">Belum ada kost yang disimpan.</p>`;
}

async function startChatWithOwner(kostId) {
    if (!currentUser) { showToast('Silakan masuk terlebih dahulu.'); return navigate('login'); }
    const kost = kostList.find(k => k.id === kostId);
    const pemilikEmail = kost.pemilikEmail || "pemilik@kost.com";
    const pemilikObj = usersList.find(u => u.email === pemilikEmail);
    const threadId = `thread_${kost.id}_${currentUser.email}`;

    if (!chatThreads.some(t => t.id === threadId)) {
        chatThreads.unshift({
            id: threadId,
            kostId: kost.id,
            kostNama: kost.nama,
            penggunaEmail: currentUser.email,
            penggunaNama: currentUser.nama,
            pemilikEmail: pemilikEmail,
            pemilikNama: pemilikObj ? pemilikObj.nama : "Pemilik Kost",
            messages: []
        });
        await saveAllData();
    }
    activeThreadId = threadId;
    navigate('chat');
}

async function startChatWithOper(operId) {
    if (!currentUser) { showToast('Silakan masuk terlebih dahulu.'); return navigate('login'); }
    const oper = operList.find(o => o.id === operId);
    const threadId = `thread_oper_${oper.id}_${currentUser.email}`;

    if (!chatThreads.some(t => t.id === threadId)) {
        chatThreads.unshift({
            id: threadId,
            kostId: oper.id,
            kostNama: `[Oper Kost] ${oper.nama}`,
            penggunaEmail: currentUser.email,
            penggunaNama: currentUser.nama,
            pemilikEmail: oper.pengoperEmail || "pemilik@kost.com",
            pemilikNama: oper.pengoper,
            messages: []
        });
        await saveAllData();
    }
    activeThreadId = threadId;
    navigate('chat');
}

document.addEventListener('DOMContentLoaded', async () => {
    renderNavbar();
    await loadAllDataFromSupabase();
    renderBeranda();
});