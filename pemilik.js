if (!currentUser || currentUser.role !== 'pemilik') {
    window.location.href = 'index.html';
}

async function navigate(viewId) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    const target = document.getElementById(`view-${viewId}`);
    if (target) target.classList.add('active');
    window.scrollTo(0, 0);

    await loadAllDataFromSupabase();
    if (viewId === 'kelola-kost') renderKelolaKost();
    if (viewId === 'kelola-pengajuan') renderKelolaPengajuan();
    if (viewId === 'chat') renderChatPage();
    if (viewId === 'profil') renderProfil();
}

function renderKelolaKost() {
    const container = document.getElementById('pemilik-kost-list');
    const myKosts = kostList.filter(k => k.pemilikEmail === currentUser.email);

    if (myKosts.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted);">Belum ada data kost. Klik <strong>+ Tambah Kost</strong> untuk menambahkan.</p>`;
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
    previewImg.src = kost.foto;
    previewImg.style.display = 'block';
    document.getElementById('kost-upload-placeholder').style.display = 'none';
    document.getElementById('modal-kost').classList.add('active');
}

function closeModalKost() {
    document.getElementById('modal-kost').classList.remove('active');
}

async function saveKostData(e) {
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
        showToast('Data kost diperbarui!');
    } else {
        kostList.unshift(dataObj);
        showToast('Kost baru ditambahkan!');
    }

    tempUploadedBase64.kost = null;
    await saveAllData();
    closeModalKost();
    renderKelolaKost();
}

async function deleteKost(id) {
    if (!confirm('Yakin ingin menghapus data kost ini?')) return;
    await db.from('kost').delete().eq('id', id);
    kostList = kostList.filter(k => k.id !== id);
    renderKelolaKost();
    showToast('Data kost dihapus.');
}

function renderKelolaPengajuan() {
    const tbody = document.getElementById('pemilik-pengajuan-tbody');
    const myKostIds = kostList.filter(k => k.pemilikEmail === currentUser.email).map(k => k.id);
    const myPengajuan = pengajuanList.filter(p => myKostIds.includes(p.kostId));

    tbody.innerHTML = myPengajuan.length
        ? myPengajuan.map(p => `
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
        `).join('')
        : `<tr><td colspan="6">Belum ada pengajuan sewa masuk.</td></tr>`;
}

async function updateStatusPengajuan(id, newStatus) {
    const idx = pengajuanList.findIndex(p => p.id === id);
    if (idx !== -1) {
        pengajuanList[idx].status = newStatus;
        await saveAllData();
        renderKelolaPengajuan();
        showToast(`Pengajuan telah ${newStatus.toLowerCase()}.`);
    }
}

function renderProfil() {
    document.getElementById('disp-nama').textContent = currentUser.nama;
    document.getElementById('disp-email').textContent = currentUser.email;
    document.getElementById('disp-telepon').textContent = currentUser.telepon || '-';
    document.getElementById('disp-alamat').textContent = currentUser.alamat || '-';

    document.getElementById('edit-nama').value = currentUser.nama;
    document.getElementById('edit-email').value = currentUser.email;
    document.getElementById('edit-telepon').value = currentUser.telepon || '';
    document.getElementById('edit-alamat').value = currentUser.alamat || '';
    document.getElementById('edit-password').value = currentUser.password;
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadAllDataFromSupabase();
    renderKelolaKost();
});