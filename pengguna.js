// ==================== NAVIGASI & RENDER UTAMA ====================
function navigate(viewName) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    const target = document.getElementById(`view-${viewName}`);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
    }
    
    if (viewName === 'beranda') renderBeranda();
    if (viewName === 'cari-kost') renderKatalogKost();
    if (viewName === 'oper-kost') renderOperKost();
    if (viewName === 'profil') renderProfil();
    if (viewName === 'chat') renderChatPage();
}

function updateNavAuth() {
    const navMenu = document.getElementById('nav-menu');
    const navAuth = document.getElementById('nav-auth-area');
    if (!navMenu || !navAuth) return;

    if (currentUser) {
        navMenu.innerHTML = `
            <a href="#" onclick="navigate('beranda')">Beranda</a>
            <a href="#" onclick="navigate('cari-kost')">Cari Kost</a>
            <a href="#" onclick="navigate('oper-kost')">Oper Kost</a>
            <a href="#" onclick="navigate('chat')">Pesan</a>
        `;
        navAuth.innerHTML = `
            <span style="font-size:0.88rem; font-weight:600; color:var(--text-main);">Halo, ${currentUser.nama}</span>
            <button class="btn btn-outline" style="padding:6px 12px; font-size:0.82rem;" onclick="navigate('profil')">Profil</button>
        `;
    } else {
        navMenu.innerHTML = `
            <a href="#" onclick="navigate('beranda')">Beranda</a>
            <a href="#" onclick="navigate('cari-kost')">Cari Kost</a>
            <a href="#" onclick="navigate('oper-kost')">Oper Kost</a>
        `;
        navAuth.innerHTML = `
            <button class="btn btn-outline" style="padding:6px 14px; font-size:0.85rem;" onclick="navigate('login')">Masuk</button>
            <button class="btn btn-primary" style="padding:6px 14px; font-size:0.85rem;" onclick="navigate('register')">Daftar</button>
        `;
    }
}

// ==================== BERANDA & KATALOG KOST ====================
function renderBeranda() {
    const container = document.getElementById('beranda-kost-list');
    if (!container) return;

    const topKost = kostList.slice(0, 3);
    if (topKost.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted); grid-column:1/-1;">Belum ada data kost tersedia saat ini.</p>`;
        return;
    }

    container.innerHTML = topKost.map(k => createKostCardHTML(k)).join('');
}

function renderKatalogKost() {
    const container = document.getElementById('katalog-kost-list');
    if (!container) return;

    if (kostList.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted); grid-column:1/-1;">Belum ada daftar kost yang ditemukan.</p>`;
        return;
    }

    container.innerHTML = kostList.map(k => createKostCardHTML(k)).join('');
}

function createKostCardHTML(k) {
    const savedIds = currentUser && currentUser.savedKostIds ? currentUser.savedKostIds : [];
    const isSaved = savedIds.includes(k.id);
    const fotoDefault = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80';
    const foto = k.foto || fotoDefault;

    return `
        <div class="card">
            <div class="card-img-wrapper">
                <img src="${foto}" alt="${k.nama}" class="card-img">
                <span class="badge">TERSEDIA</span>
            </div>
            <div class="card-body">
                <h3 class="card-title">${k.nama}</h3>
                <p class="card-location">&#128205; ${k.lokasi}</p>
                <div class="card-footer">
                    <div>
                        <span class="price">${formatRupiah(k.harga)}</span>
                    </div>
                    <span style="font-size:0.82rem; color:var(--text-muted);">&#128716; ${k.kamar || '1'} Kamar</span>
                </div>
                <div style="display: flex; gap: 8px; margin-top: 12px;">
                    <button class="btn btn-primary" style="flex: 2;" onclick="showDetailKost(${k.id})">Lihat Detail</button>
                    <button class="btn ${isSaved ? 'btn-primary' : 'btn-outline'}" style="flex: 1; font-size: 0.85rem;" onclick="toggleSaveKost(${k.id})">
                        ${isSaved ? '❤️ Disimpan' : '🤍 Simpan'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function filterKost() {
    const keyword = document.getElementById('search-kost-input').value.toLowerCase();
    const filterHarga = document.getElementById('filter-harga').value;
    const filterFasilitas = document.getElementById('filter-fasilitas').value;

    const filtered = kostList.filter(k => {
        const matchKeyword = k.nama.toLowerCase().includes(keyword) || k.lokasi.toLowerCase().includes(keyword);
        
        let matchHarga = true;
        if (filterHarga === 'low') matchHarga = k.harga < 1000000;
        else if (filterHarga === 'mid') matchHarga = k.harga >= 1000000 && k.harga <= 1500000;
        else if (filterHarga === 'high') matchHarga = k.harga > 1500000;

        let matchFasilitas = true;
        if (filterFasilitas !== 'all') {
            matchFasilitas = k.fasilitas && k.fasilitas.toLowerCase().includes(filterFasilitas.toLowerCase());
        }

        return matchKeyword && matchHarga && matchFasilitas;
    });

    const container = document.getElementById('katalog-kost-list');
    if (!container) return;

    if (filtered.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted); grid-column:1/-1;">Tidak ada kost yang cocok dengan filter pencarian.</p>`;
        return;
    }

    container.innerHTML = filtered.map(k => createKostCardHTML(k)).join('');
}

// ==================== DETAIL KOST & SEWA ====================
let selectedKostDetail = null;

function showDetailKost(kostId) {
    const kost = kostList.find(k => k.id === Number(kostId));
    if (!kost) {
        showToast('Data kost tidak ditemukan.');
        return;
    }
    selectedKostDetail = kost;

    const container = document.getElementById('detail-kost-container');
    const foto = kost.foto || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';
    const pemilikEmail = kost.pemilikEmail || kost.pemilik_email || 'pemilik@kostspace.com';

    let fasilitasTeks = kost.fasilitas || 'Wi-Fi, AC, Kamar Mandi Dalam';
    try {
        if (typeof fasilitasTeks === 'string' && fasilitasTeks.startsWith('[')) {
            const parsed = JSON.parse(fasilitasTeks);
            if (Array.isArray(parsed)) fasilitasTeks = parsed.join(', ');
        }
    } catch(e) {}

    container.innerHTML = `
        <div class="detail-grid">
            <div>
                <img src="${foto}" alt="${kost.nama}" style="width:100%; border-radius:12px; object-fit:cover; max-height:400px;">
            </div>
            <div>
                <span class="pill-badge">KOST TERSEDIA</span>
                <h1 style="margin-top:8px; font-size:1.8rem;">${kost.nama}</h1>
                <p style="color:var(--text-muted); margin-bottom:12px;">&#128205; ${kost.lokasi}</p>
                <h3 style="color:var(--primary); font-size:1.5rem; margin-bottom:16px;">${formatRupiah(kost.harga)}</h3>
                
                <div style="background:var(--bg-secondary); padding:16px; border-radius:8px; margin-bottom:20px;">
                    <strong>Fasilitas:</strong>
                    <p style="margin-top:4px; color:var(--text-muted); text-transform:capitalize;">${fasilitasTeks}</p>
                    <strong style="display:block; margin-top:10px;">Ketersediaan Kamar:</strong>
                    <p style="margin-top:4px; color:var(--text-muted);">${kost.kamar || 'Tersedia'} Kamar</p>
                </div>

                <div style="display:flex; gap:10px;">
                    <button class="btn btn-primary" style="flex:1;" onclick="openAjukanSewa()">Ajukan Sewa</button>
                    <button class="btn btn-outline" style="flex:1; white-space:nowrap;" onclick="openChatWithPemilik('${pemilikEmail}', '${kost.nama}', ${kost.id})">&#128172; Hubungi Pemilik</button>
                </div>
            </div>
        </div>
    `;

    navigate('detail-kost');
}

function historyBack() {
    navigate('cari-kost');
}

function openAjukanSewa() {
    if (!currentUser) {
        showToast('Silakan masuk terlebih dahulu untuk mengajukan sewa.');
        return navigate('login');
    }
    if (!selectedKostDetail) return;

    document.getElementById('sewa-kost-target').textContent = `Mengajukan sewa untuk: ${selectedKostDetail.nama} (${formatRupiah(selectedKostDetail.harga)})`;
    document.getElementById('sewa-nama').value = currentUser.nama || '';
    document.getElementById('sewa-telepon').value = currentUser.telepon || '';
    document.getElementById('sewa-tanggal').value = '';
    document.getElementById('sewa-pesan').value = '';
    navigate('ajukan-sewa');
}

async function submitPengajuanSewa(e) {
    e.preventDefault();
    if (!currentUser || !selectedKostDetail) return;

    const newPengajuan = {
        id: Date.now(),
        kost_id: selectedKostDetail.id,
        kost_nama: selectedKostDetail.nama,
        pemohon_nama: document.getElementById('sewa-nama').value,
        pemohon_email: currentUser.email,
        telepon: document.getElementById('sewa-telepon').value,
        tanggal: document.getElementById('sewa-tanggal').value,
        durasi: document.getElementById('sewa-durasi').value,
        pesan: document.getElementById('sewa-pesan').value,
        status: 'Menunggu Konfirmasi'
    };

    pengajuanList.unshift(newPengajuan);
    await db.from('pengajuan').insert([newPengajuan]);

    showToast('Pengajuan sewa berhasil dikirim!');
    navigate('profil');
    switchProfilTab('riwayat');
}

// ==================== FAVORIT & TERSIMPAN ====================
async function toggleSaveKost(kostId) {
    if (!currentUser) {
        showToast('Silakan masuk untuk menyimpan kost favorit.');
        return navigate('login');
    }

    if (!currentUser.savedKostIds) currentUser.savedKostIds = [];

    const idx = currentUser.savedKostIds.indexOf(kostId);
    if (idx > -1) {
        currentUser.savedKostIds.splice(idx, 1);
        showToast('Kost dihapus dari daftar tersimpan.');
    } else {
        currentUser.savedKostIds.push(kostId);
        showToast('Kost berhasil disimpan ke favorit!');
    }

    await saveAllData();
    renderKatalogKost();
    renderBeranda();
    renderProfil();
}

// ==================== OPER KOST & DETAIL OPER ====================
function renderOperKost() {
    const container = document.getElementById('oper-kost-list');
    if (!container) return;

    if (operList.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted); grid-column:1/-1;">Belum ada info oper kost saat ini.</p>`;
        return;
    }

    container.innerHTML = operList.map(o => {
        const foto = o.foto || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80';
        return `
            <div class="card">
                <div class="card-img-wrapper">
                    <img src="${foto}" alt="${o.nama}" class="card-img">
                    <span class="badge" style="background:var(--accent);">OPER SISA SEWA</span>
                </div>
                <div class="card-body">
                    <h3 class="card-title">${o.nama}</h3>
                    <p class="card-location">&#128205; ${o.lokasi}</p>
                    <p style="font-size:0.88rem; color:var(--text-muted); margin:8px 0;">${o.deskripsi}</p>
                    <div class="card-footer" style="margin-top:12px;">
                        <span class="price">${formatRupiah(o.harga)}</span>
                        <span style="font-size:0.8rem; color:var(--text-muted);">Pengoper: ${o.pengoper || 'Penghuni'}</span>
                    </div>
                    <button class="btn btn-primary full-width" style="margin-top:12px;" onclick="showDetailOperKost(${o.id})">Lihat Detail</button>
                </div>
            </div>
        `;
    }).join('');
}

let selectedOperDetail = null;

function showDetailOperKost(operId) {
    const oper = operList.find(o => o.id === Number(operId));
    if (!oper) {
        showToast('Data oper kost tidak ditemukan.');
        return;
    }
    selectedOperDetail = oper;

    const container = document.getElementById('detail-kost-container');
    const foto = oper.foto || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80';
    const pengoperEmail = oper.pengoperEmail || oper.pengoper_email || 'pengoper@kostspace.com';

    container.innerHTML = `
        <div class="detail-grid">
            <div>
                <img src="${foto}" alt="${oper.nama}" style="width:100%; border-radius:12px; object-fit:cover; max-height:400px;">
            </div>
            <div>
                <span class="pill-badge" style="background:var(--accent);">OPER SISA SEWA KOST</span>
                <h1 style="margin-top:8px; font-size:1.8rem;">${oper.nama}</h1>
                <p style="color:var(--text-muted); margin-bottom:12px;">&#128205; ${oper.lokasi}</p>
                <h3 style="color:var(--primary); font-size:1.5rem; margin-bottom:16px;">${formatRupiah(oper.harga)}</h3>
                
                <div style="background:var(--bg-secondary); padding:16px; border-radius:8px; margin-bottom:20px;">
                    <strong>Deskripsi & Sisa Masa Sewa:</strong>
                    <p style="margin-top:6px; color:var(--text-muted); line-height:1.5;">${oper.deskripsi}</p>
                    <strong style="display:block; margin-top:12px;">Pengoper / Penghuni Sebelumnya:</strong>
                    <p style="margin-top:4px; color:var(--text-muted);">${oper.pengoper || 'Penghuni'}</p>
                </div>

                <div style="display:flex; gap:10px;">
                    <button class="btn btn-outline" style="flex:1;" onclick="openChatWithPemilik('${pengoperEmail}', '${oper.nama}', ${oper.id})">&#128172; Hubungi Pengoper</button>
                </div>
            </div>
        </div>
    `;

    navigate('detail-kost');
}

function handlePostingOperClick() {
    if (!currentUser) {
        showToast('Silakan masuk terlebih dahulu untuk memposting oper kost.');
        return navigate('login');
    }
    document.getElementById('form-oper').reset();
    document.getElementById('oper-preview-img').style.display = 'none';
    document.getElementById('oper-upload-placeholder').style.display = 'block';
    tempUploadedBase64.oper = null;
    navigate('posting-oper');
}

async function submitOperKost(e) {
    e.preventDefault();
    if (!currentUser) return;

    const newOper = {
        id: Date.now(),
        nama: document.getElementById('oper-nama').value,
        lokasi: document.getElementById('oper-lokasi').value,
        harga: Number(document.getElementById('oper-harga').value),
        deskripsi: document.getElementById('oper-deskripsi').value,
        foto: tempUploadedBase64.oper || '',
        pengoper: currentUser.nama,
        pengoper_email: currentUser.email
    };

    operList.unshift(newOper);
    await db.from('oper_kost').insert([newOper]);

    showToast('Oper kost berhasil diposting!');
    navigate('oper-kost');
    renderOperKost();
}

// ==================== CHAT PEMILIK / PENGOPER ====================
async function openChatWithPemilik(targetEmail, kostNama, kostId) {
    if (!currentUser) {
        showToast('Silakan masuk untuk mengirim pesan.');
        return navigate('login');
    }
    if (!targetEmail) {
        targetEmail = 'pemilik@kostspace.com';
    }

    const threadId = `${kostId}_${currentUser.email.replace(/[@.]/g, '_')}`;
    let existingThread = chatThreads.find(t => t.id === threadId);

    if (!existingThread) {
        existingThread = {
            id: threadId,
            kost_id: kostId,
            kost_nama: kostNama,
            pengguna_email: currentUser.email,
            pengguna_nama: currentUser.nama,
            pemilik_email: targetEmail,
            pemilik_nama: 'Pemilik/Pengoper Kost',
            messages: []
        };
        chatThreads.push(existingThread);
        await db.from('chats').insert([existingThread]);
    }

    activeThreadId = threadId;
    navigate('chat');
    renderChatPage();
}

// ==================== PROFIL RENDER ====================
function renderProfil() {
    if (!currentUser) return;

    const dispNama = document.getElementById('disp-nama');
    const dispEmail = document.getElementById('disp-email');
    const dispTelepon = document.getElementById('disp-telepon');
    const dispAlamat = document.getElementById('disp-alamat');

    if (dispNama) dispNama.textContent = currentUser.nama || '-';
    if (dispEmail) dispEmail.textContent = currentUser.email || '-';
    if (dispTelepon) dispTelepon.textContent = currentUser.telepon || '-';
    if (dispAlamat) dispAlamat.textContent = currentUser.alamat || '-';

    const editNama = document.getElementById('edit-nama');
    const editEmail = document.getElementById('edit-email');
    const editTelepon = document.getElementById('edit-telepon');
    const editAlamat = document.getElementById('edit-alamat');
    const editPass = document.getElementById('edit-password');

    if (editNama) editNama.value = currentUser.nama || '';
    if (editEmail) editEmail.value = currentUser.email || '';
    if (editTelepon) editTelepon.value = currentUser.telepon || '';
    if (editAlamat) editAlamat.value = currentUser.alamat || '';
    if (editPass) editPass.value = currentUser.password || '';

    // Render Riwayat Pengajuan Sewa
    const tbody = document.getElementById('user-pengajuan-tbody');
    if (tbody) {
        const myPengajuan = pengajuanList.filter(p => p.pemohonEmail === currentUser.email || p.pemohon_email === currentUser.email);
        if (myPengajuan.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">Belum ada riwayat pengajuan sewa.</td></tr>`;
        } else {
            tbody.innerHTML = myPengajuan.map(p => `
                <tr>
                    <td><strong>${p.kostNama || p.kost_nama}</strong></td>
                    <td>${p.tanggal}</td>
                    <td>${p.durasi}</td>
                    <td><span class="badge" style="background:var(--primary); font-size:0.75rem;">${p.status}</span></td>
                </tr>
            `).join('');
        }
    }

    // Render Kost Tersimpan (Favorit)
    const savedContainer = document.getElementById('saved-kost-list');
    if (savedContainer) {
        const savedIds = currentUser.savedKostIds || [];
        const savedKost = kostList.filter(k => savedIds.includes(k.id));
        if (savedKost.length === 0) {
            savedContainer.innerHTML = `<p style="color:var(--text-muted); grid-column:1/-1;">Belum ada kost yang disimpan sebagai favorit.</p>`;
        } else {
            savedContainer.innerHTML = savedKost.map(k => createKostCardHTML(k)).join('');
        }
    }
}
