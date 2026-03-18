const VALID_EMAIL = 'admin@email.com';
const VALID_PASSWORD = 'admin123';

function getUsers() {
    return JSON.parse(localStorage.getItem('app_users') || '[]');
}
function saveUsers(users) {
    localStorage.setItem('app_users', JSON.stringify(users));
}

function showToast(text, type = 'success', duration = 3500) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'app-toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.className = `toast ${type}`;
    toast.textContent = text;
    clearTimeout(toast._t);
    requestAnimationFrame(() => {
        toast.classList.add('show');
        toast._t = setTimeout(() => toast.classList.remove('show'), duration);
    });
}

function setMsg(el, text, type = 'error') {
    el.textContent = text;
    el.className = `modal-msg ${type}`;
}

function shake(el) {
    el.style.animation = 'none';
    requestAnimationFrame(() => {
        el.style.animation = 'shake .4s ease';
        el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
    });
}

function openModal(ov) { ov.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeModal(ov) { ov.classList.remove('active'); document.body.style.overflow = ''; }

function injectModals() {
    if (!document.getElementById('modal-keyframes')) {
        const s = document.createElement('style');
        s.id = 'modal-keyframes';
        s.textContent = `
      @keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
      @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
    `;
        document.head.appendChild(s);
    }

    document.body.insertAdjacentHTML('beforeend', `
  <div class="modal-overlay" id="modal-register">
    <div class="modal-box">
      <button class="modal-close" id="close-register">&times;</button>
      <h2>Criar conta</h2>
      <p class="modal-subtitle">Preencha os dados abaixo para se registrar</p>
      <div class="input-box">
        <span class="icon"><ion-icon name="person"></ion-icon></span>
        <input type="text" id="reg-name" required autocomplete="off">
        <label>Nome completo</label>
      </div>
      <div class="input-box">
        <span class="icon"><ion-icon name="mail"></ion-icon></span>
        <input type="email" id="reg-email" required autocomplete="off">
        <label>Email</label>
      </div>
      <div class="input-box">
        <span class="icon"><ion-icon name="lock-closed"></ion-icon></span>
        <input type="password" id="reg-pass" required>
        <label>Senha</label>
      </div>
      <div class="input-box">
        <span class="icon"><ion-icon name="lock-open"></ion-icon></span>
        <input type="password" id="reg-pass2" required>
        <label>Confirmar senha</label>
      </div>
      <p class="modal-msg" id="reg-msg"></p>
      <button type="button" id="btn-register">Criar conta</button>
    </div>
  </div>

  <div class="modal-overlay" id="modal-forgot">
    <div class="modal-box">
      <button class="modal-close" id="close-forgot">&times;</button>
      <h2>Redefinir senha</h2>
      <p class="modal-subtitle">Informe seu e-mail e enviaremos um link de recuperação</p>
      <div class="input-box" style="margin-top:30px">
        <span class="icon"><ion-icon name="mail"></ion-icon></span>
        <input type="email" id="forgot-email" required autocomplete="off">
        <label>Email cadastrado</label>
      </div>
      <p class="modal-msg" id="forgot-msg"></p>
      <button type="button" id="btn-forgot">Enviar link</button>
    </div>
  </div>`);
}

document.addEventListener('DOMContentLoaded', () => {
    injectModals();

    const loginForm = document.querySelector('form');
    const emailIn = loginForm.querySelector('input[type="email"]');
    const passIn = loginForm.querySelector('input[type="password"]');
    const rememberCb = loginForm.querySelector('input[type="checkbox"]');
    const loginBtn = loginForm.querySelector('button[type="submit"]');
    const loginBox = document.querySelector('.login-box');
    const regOverlay = document.getElementById('modal-register');
    const fgtOverlay = document.getElementById('modal-forgot');

    const saved = localStorage.getItem('rememberedEmail');
    if (saved) { emailIn.value = saved; rememberCb.checked = true; }

    document.querySelector('.register-link a')
        .addEventListener('click', e => { e.preventDefault(); openModal(regOverlay); });
    document.querySelector('.remember-forgot a')
        .addEventListener('click', e => { e.preventDefault(); openModal(fgtOverlay); });

    document.getElementById('close-register').addEventListener('click', () => closeModal(regOverlay));
    document.getElementById('close-forgot').addEventListener('click', () => closeModal(fgtOverlay));
    [regOverlay, fgtOverlay].forEach(ov =>
        ov.addEventListener('click', e => { if (e.target === ov) closeModal(ov); })
    );
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeModal(regOverlay); closeModal(fgtOverlay); }
    });

    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = emailIn.value.trim();
        const pass = passIn.value;
        if (!email || !pass) { showLoginMsg('Preencha todos os campos.'); return; }

        setLoadingBtn(loginBtn, true, 'Entrando…', 'Login');
        setTimeout(() => {
            setLoadingBtn(loginBtn, false, 'Entrando…', 'Login');
            const users = getUsers();
            const ok = users.find(u => u.email === email && u.password === pass)
                || (email === VALID_EMAIL && pass === VALID_PASSWORD);
            if (ok) {
                rememberCb.checked
                    ? localStorage.setItem('rememberedEmail', email)
                    : localStorage.removeItem('rememberedEmail');
                showLoginMsg('Login realizado com sucesso! ✓', 'success');
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
            } else {
                showLoginMsg('E-mail ou senha incorretos.');
                shake(loginBox);
            }
        }, 300);
    });

    function showLoginMsg(text, type = 'error') {
        const old = loginForm.querySelector('.login-msg');
        if (old) old.remove();
        const p = document.createElement('p');
        p.className = 'login-msg';
        p.textContent = text;
        p.style.cssText = `text-align:center;margin-top:12px;font-size:.85em;
      color:${type === 'success' ? '#7fff7f' : '#ff7f7f'};animation:fadeIn .3s ease;`;
        loginForm.appendChild(p);
        setTimeout(() => p.remove(), 3000);
    }

    function setLoadingBtn(btn, loading, loadText, idleText) {
        btn.disabled = loading;
        btn.textContent = loading ? loadText : idleText;
    }

    document.getElementById('btn-register').addEventListener('click', () => {
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const pass = document.getElementById('reg-pass').value;
        const pass2 = document.getElementById('reg-pass2').value;
        const msgEl = document.getElementById('reg-msg');
        const box = regOverlay.querySelector('.modal-box');

        if (!name || !email || !pass || !pass2)
            return setMsg(msgEl, 'Preencha todos os campos.'), shake(box);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return setMsg(msgEl, 'E-mail inválido.'), shake(box);
        if (pass.length < 4)
            return setMsg(msgEl, 'Senha deve ter ao menos 4 caracteres.'), shake(box);
        if (pass !== pass2)
            return setMsg(msgEl, 'As senhas não coincidem.'), shake(box);

        const users = getUsers();
        if (users.find(u => u.email === email))
            return setMsg(msgEl, 'Este e-mail já está cadastrado.'), shake(box);

        users.push({ name, email, password: pass });
        saveUsers(users);

        closeModal(regOverlay);
        ['reg-name', 'reg-email', 'reg-pass', 'reg-pass2'].forEach(id =>
            document.getElementById(id).value = '');
        setMsg(msgEl, '', '');

        showToast(`Conta criada! Bem-vindo, ${name} 🎉`, 'success');
    });

    document.getElementById('btn-forgot').addEventListener('click', () => {
        const email = document.getElementById('forgot-email').value.trim();
        const msgEl = document.getElementById('forgot-msg');
        const box = fgtOverlay.querySelector('.modal-box');
        const btn = document.getElementById('btn-forgot');

        if (!email)
            return setMsg(msgEl, 'Informe seu e-mail.'), shake(box);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return setMsg(msgEl, 'E-mail inválido.'), shake(box);

        setLoadingBtn(btn, true, 'Enviando…', 'Enviar link');
        setTimeout(() => {
            setLoadingBtn(btn, false, 'Enviando…', 'Enviar link');
            closeModal(fgtOverlay);
            document.getElementById('forgot-email').value = '';
            setMsg(msgEl, '', '');
            showToast('Se este e-mail estiver cadastrado, o link será enviado em breve 📩', 'success', 4500);
        }, 800);
    });
});
