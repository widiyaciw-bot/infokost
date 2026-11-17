// ==================== KONFIGURASI SUPABASE ====================
const SUPABASE_URL = 'https://oegrxxywyzaegohagped.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_k3MQY8MlyM5Mv0CrDqXhtg_Y5zw7WzW';
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==================== STATE GLOBAL ====================
let kostList = [];
let operList = [];
let usersList = [];
let pengajuanList = [];
let chatThreads = [];
let currentUser = JSON.parse(localStorage.getItem('ks_current_user')) || null;

let activeThreadId = null;
let tempUploadedBase64 = { kost: null, oper: null };

// ==================== SINKRONISASI DATA SUPABASE ====================
async function loadAllDataFromSupabase() {
    try {
        const [resUsers, resKost, resOper, resPengajuan, resChats] = await Promise.all([
            db.from('users').select('*'),
            db.from('kost').select('*').order('id', { ascending: false }),
            db.from('oper_kost').select('*').order('id', { ascending: false }),
            db.from('pengajuan').select('*').order('id', { ascending: false }),
            db.from('chats').select('*')
        ]);

        if (resUsers.data) {
            usersList = resUsers.data.map(u => ({ ...u, savedKostIds: u.saved_kost_ids || [] }));
        }
        if (resKost.data) {
            kostList = resKost.data.map(k => ({ ...k, pemilikEmail: k.pemilik_email }));
        }
        if (resOper.data) {
            operList = resOper.data.map(o => ({ ...o, pengoperEmail: o.pengoper_email }));
        }
        if (resPengajuan.data) {
            pengajuanList = resPengajuan.data.map(p => ({
                ...p,
                kostId: p.kost_id,
                kostNama: p.kost_nama,
                pemohonNama: p.pemohon_nama,
                pemohonEmail: p.pemohon_email
            }));
        }
        if (resChats.data) {
            chatThreads = resChats.data.map(c => ({
                ...c,
                kostId: c.kost_id,
                kostNama: c.kost_nama,
                penggunaEmail: c.pengguna_email,
                penggunaNama: c.pengguna_nama,
                pemilikEmail: c.pemilik_email,
                pemilikNama: c.pemilik_nama
            }));
        }

        if (currentUser) {
            const freshUser = usersList.find(u => u.email === currentUser.email);
            if (freshUser) {
                currentUser = freshUser;
                localStorage.setItem('ks_current_user', JSON.stringify(currentUser));
            }
        }
    } catch (err) {
        console.error('Error memuat data:', err);
        showToast('Gagal memuat data dari server.');
    }
}

async function saveAllData() {
    localStorage.setItem('ks_current_user', JSON.stringify(currentUser));
    try {
        if (usersList.length) {
            await db.from('users').upsert(usersList.map(u => ({
                email: u.email,
                nama: u.nama,
                password: u.password,
                role: u.role,
                telepon: u.telepon || '',
                alamat: u.alamat || '',
                saved_kost_ids: u.savedKostIds || []
            })));
        }
        if (kostList.length) {
            await db.from('kost').upsert(kostList.map(k => ({
                id: k.id,
                nama: k.nama,
                lokasi: k.lokasi,
                harga: k.harga,
                kamar: k.kamar,
                fasilitas: k.fasilitas,
                foto: k.foto,
                pemilik_email: k.pemilikEmail
            })));
        }
        if (operList.length) {
            await db.from('oper_kost').upsert(operList.map(o => ({
                id: o.id,
                nama: o.nama,
                lokasi: o.lokasi,
                harga: o.harga,
                deskripsi: o.deskripsi,
                foto: o.foto,
                pengoper: o.pengoper,
                pengoper_email: o.pengoperEmail
            })));
        }
        if (pengajuanList.length) {
            await db.from('pengajuan').upsert(pengajuanList.map(p => ({
                id: p.id,
                kost_id: p.kostId,
                kost_nama: p.kostNama,
                pemohon_nama: p.pemohonNama,
                pemohon_email: p.pemohonEmail,
                telepon: p.telepon,
                tanggal: p.tanggal,
                durasi: p.durasi,
                pesan: p.pesan,
                status: p.status
            })));
        }
        if (chatThreads.length) {
            await db.from('chats').upsert(chatThreads.map(c => ({
                id: c.id,
                kost_id: c.kostId,
                kost_nama: c.kostNama,
                pengguna_email: c.penggunaEmail,
                pengguna_nama: c.penggunaNama,
                pemilik_email: c.pemilikEmail,
                pemilik_nama: c.pemilikNama,
                messages: c.messages
            })));
        }
    } catch (err) {
        console.error('Error menyimpan data:', err);
    }
}

function formatRupiah(angka) {
    return "Rp" + Number(angka).toLocaleString('id-ID') + "/bulan";
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

// ==================== MENU MOBILE (HP) ====================
function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) navMenu.classList.toggle('mobile-open');
}

document.addEventListener('click', function (e) {
    const navMenu = document.getElementById('nav-menu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (!navMenu || !menuBtn) return;

    if (e.target.closest('#nav-menu a')) {
        navMenu.classList.remove('mobile-open');
    } else if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        navMenu.classList.remove('mobile-open');
    }
});

// ==================== UPLOAD & KOMPRESI FOTO ====================
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
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);
            callback(canvas.toDataURL('image/jpeg', 0.7));
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

        if (inputEl.id === 'kost-foto-file') tempUploadedBase64.kost = base64String;
        if (inputEl.id === 'oper-foto-file') tempUploadedBase64.oper = base64String;
    });
}

// ==================== AUTH DENGAN KONFIRMASI EMAIL ====================
async function handleRegister(e) {
    e.preventDefault();
    const role = document.querySelector('input[name="reg-role"]:checked').value;
    const nama = document.getElementById('reg-nama').value.trim();
    const telepon = document.getElementById('reg-telepon').value.trim();
    const emailInput = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;

    const { error: authError } = await db.auth.signUp({
        email: emailInput,
        password: password,
        options: {
            emailRedirectTo: window.location.origin + '/index.html'
        }
    });

    if (authError) {
        showToast('Gagal daftar: ' + authError.message);
        return;
    }

    await db.from('users').upsert({
        email: emailInput,
        nama: nama,
        password: password,
        role: role,
        telepon: telepon,
        alamat: "Indonesia",
        saved_kost_ids: []
    });

    alert('Pendaftaran berhasil! Silakan cek kotak masuk (atau folder Spam) email Anda dan klik link konfirmasi sebelum Masuk.');
    navigate('login');
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const pass = document.getElementById('login-password').value;

    const { error: authError } = await db.auth.signInWithPassword({
        email: email,
        password: pass
    });

    if (authError) {
        if (authError.message.includes('Email not confirmed')) {
            showToast('Email belum dikonfirmasi! Cek kotak masuk email Anda terlebih dahulu.');
        } else {
            showToast('Email atau password salah!');
        }
        return;
    }

    await loadAllDataFromSupabase();
    const found = usersList.find(u => u.email.toLowerCase() === email);
    if (!found) {
        showToast('Data profil pengguna tidak ditemukan.');
        return;
    }

    currentUser = found;
    localStorage.setItem('ks_current_user', JSON.stringify(currentUser));
    window.location.href = currentUser.role === 'pemilik' ? 'pemilik.html' : 'index.html';
}

async function logout() {
    await db.auth.signOut();
    currentUser = null;
    localStorage.removeItem('ks_current_user');
    window.location.href = 'index.html';
}

async function deleteAccount() {
    if (!currentUser) return;
    if (!confirm(`Yakin ingin menghapus akun "${currentUser.nama}" secara permanen?`)) return;

    const emailToDelete = currentUser.email;
    await db.from('users').delete().eq('email', emailToDelete);
    await db.from('chats').delete().or(`pengguna_email.eq.${emailToDelete},pemilik_email.eq.${emailToDelete}`);
    await db.auth.signOut();

    currentUser = null;
    localStorage.removeItem('ks_current_user');
    alert('Akun Anda berhasil dihapus.');
    window.location.href = 'index.html';
}

// ==================== FITUR LUPA & RESET KATA SANDI ====================
async function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim().toLowerCase();

    const { error } = await db.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/index.html'
    });

    if (error) {
        showToast('Gagal mengirim email: ' + error.message);
        return;
    }

    alert('Tautan reset kata sandi telah dikirim ke ' + email + '. Silakan cek kotak masuk atau folder Spam Anda.');
    navigate('login');
}

async function handleUpdateNewPassword(e) {
    e.preventDefault();
    const newPass = document.getElementById('new-password').value;
    const confirmPass = document.getElementById('confirm-new-password').value;

    if (newPass !== confirmPass) {
        showToast('Konfirmasi kata sandi tidak cocok!');
        return;
    }

    const { data, error } = await db.auth.updateUser({
        password: newPass
    });

    if (error) {
        showToast('Gagal memperbarui kata sandi: ' + error.message);
        return;
    }

    if (data && data.user && data.user.email) {
        await db.from('users')
            .update({ password: newPass })
            .eq('email', data.user.email.toLowerCase());
    }

    await db.auth.signOut();
    alert('Kata sandi berhasil diperbarui! Silakan masuk menggunakan kata sandi baru Anda.');
    navigate('login');
}

db.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
        const resetView = document.getElementById('view-reset-password');
        if (resetView) resetView.classList.add('active');
    }
});

// ==================== PROFIL & CHAT BERSAMA ====================
function switchProfilTab(tabName, btnEl) {
    document.querySelectorAll('.profil-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`profil-tab-${tabName}`).classList.add('active');
    if (btnEl) {
        document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
        btnEl.classList.add('active');
    }
}

async function saveProfil(e) {
    e.preventDefault();
    currentUser.nama = document.getElementById('edit-nama').value;
    currentUser.telepon = document.getElementById('edit-telepon').value;
    currentUser.alamat = document.getElementById('edit-alamat').value;
    currentUser.password = document.getElementById('edit-password').value;

    const idx = usersList.findIndex(u => u.email === currentUser.email);
    if (idx !== -1) usersList[idx] = currentUser;

    await saveAllData();
    if (typeof renderProfil === 'function') renderProfil();
    switchProfilTab('info');
    showToast('Perubahan profil disimpan!');
}

function renderChatPage() {
    if (!currentUser) return;
    const myThreads = chatThreads.filter(t => t.pemilikEmail === currentUser.email || t.penggunaEmail === currentUser.email);
    const threadListEl = document.getElementById('chat-thread-list');
    const headerEl = document.getElementById('chat-header');
    const msgContainer = document.getElementById('chat-messages');
    const formEl = document.getElementById('chat-form');

    if (myThreads.length === 0) {
        threadListEl.innerHTML = `<div style="padding:20px; color:var(--text-muted); font-size:0.88rem;">Belum ada percakapan.</div>`;
        headerEl.innerHTML = `<span class="text-muted">Belum ada obrolan</span>`;
        msgContainer.innerHTML = `<div class="chat-empty-state">Belum ada pesan masuk atau keluar.</div>`;
        formEl.style.display = 'none';
        return;
    }

    if (!activeThreadId || !myThreads.some(t => t.id === activeThreadId)) activeThreadId = myThreads[0].id;

    threadListEl.innerHTML = myThreads.map(t => {
        const lawan = t.pemilikEmail === currentUser.email ? t.penggunaNama : t.pemilikNama;
        const lastMsg = t.messages.length ? t.messages[t.messages.length - 1].text : 'Mulai obrolan...';
        return `
            <div class="chat-thread-item ${t.id === activeThreadId ? 'active' : ''}" onclick="selectChatThread('${t.id}')">
                <div class="thread-title">${lawan}</div>
                <span class="thread-sub">${t.kostNama}</span>
                <div class="thread-preview">${lastMsg}</div>
            </div>
        `;
    }).join('');

    const thread = chatThreads.find(t => t.id === activeThreadId);
    const lawanBicara = thread.pemilikEmail === currentUser.email ? thread.penggunaNama : thread.pemilikNama;
    headerEl.innerHTML = `<strong>${lawanBicara}</strong> <small style="color:var(--text-muted); display:block;">Topik: ${thread.kostNama}</small>`;
    formEl.style.display = 'flex';

    msgContainer.innerHTML = thread.messages.length === 0
        ? `<div class="chat-empty-state">Kirim pesan pertama mengenai <strong>${thread.kostNama}</strong>.</div>`
        : thread.messages.map(m => {
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

function selectChatThread(threadId) {
    activeThreadId = threadId;
    renderChatPage();
}

async function sendChatMessage(e) {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text || !activeThreadId) return;

    const thread = chatThreads.find(t => t.id === activeThreadId);
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    thread.messages.push({ senderEmail: currentUser.email, senderName: currentUser.nama, text, time: timeStr });
    input.value = '';
    renderChatPage();
    await saveAllData();
}
