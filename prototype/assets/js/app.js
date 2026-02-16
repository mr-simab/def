const icons = [
  { name: 'Phoenix', symbol: '🔥' },
  { name: 'Shield', symbol: '🛡️' },
  { name: 'Lock', symbol: '🔒' },
  { name: 'Eye', symbol: '👁️' },
  { name: 'Server', symbol: '🖥️' },
  { name: 'Vault', symbol: '🏦' },
  { name: 'Code', symbol: '💠' },
  { name: 'Scan', symbol: '📡' },
  { name: 'Node', symbol: '🧠' },
  { name: 'Pulse', symbol: '📶' },
  { name: 'Cipher', symbol: '🔐' },
  { name: 'Trace', symbol: '🧬' }
];

const requiredPattern = ['Phoenix', 'Shield', 'Lock', 'Eye'];
const page = document.body.dataset.page;

document.querySelectorAll('a[data-link]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.add('fade-out');
    setTimeout(() => { window.location.href = a.href; }, 280);
  });
});

function gateAuth(target) {
  const visualAuth = localStorage.getItem('visualAuth') === 'true';
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  if (target === 'visual' && !visualAuth) {
    window.location.replace('visual-auth.html');
    return false;
  }
  if (target === 'login' && (!visualAuth || !loggedIn)) {
    window.location.replace(visualAuth ? 'bank-login.html' : 'visual-auth.html');
    return false;
  }
  return true;
}

if (page === 'home') {
  localStorage.removeItem('visualAuth');
  localStorage.removeItem('loggedIn');
}

if (page === 'visual-auth') {
  const container = document.getElementById('iconGrid');
  const status = document.getElementById('authStatus');
  let selected = [];

  const shuffled = [...icons].sort(() => Math.random() - 0.5);
  shuffled.forEach((icon) => {
    const btn = document.createElement('button');
    btn.className = 'icon-btn';
    btn.type = 'button';
    btn.innerHTML = `<strong>${icon.symbol}</strong>${icon.name}`;
    btn.addEventListener('click', () => {
      if (selected.length >= 4) return;
      selected.push(icon.name);
      btn.classList.add('selected');
      if (selected.length === 4) {
        const pass = JSON.stringify(selected) === JSON.stringify(requiredPattern);
        if (pass) {
          localStorage.setItem('visualAuth', 'true');
          status.className = 'notice';
          status.textContent = 'Visual identity verification complete. Proceed to secure login.';
          setTimeout(() => { window.location.href = 'bank-login.html'; }, 1000);
        } else {
          localStorage.setItem('visualAuth', 'false');
          status.className = 'notice error';
          status.textContent = 'Pattern mismatch. Access attempt blocked. Reload and try again.';
        }
      }
    });
    container.appendChild(btn);
  });
}

if (page === 'bank-login') {
  gateAuth('visual');
  const form = document.getElementById('loginForm');
  const terminal = document.getElementById('terminal');
  const msg = document.getElementById('loginStatus');

  const lines = [
    'Initiating Credential Verification...',
    'Credentials: VERIFIED',
    'Generating Secure Token...',
    'JWT Token: GENERATED',
    'Encrypting Session...',
    'Secure Channel: ESTABLISHED',
    'DefVault Authentication: SUCCESS'
  ];

  async function typeLines() {
    terminal.textContent = '';
    for (const line of lines) {
      await new Promise((resolve) => {
        let i = 0;
        const id = setInterval(() => {
          terminal.textContent += line[i] || '';
          i += 1;
          if (i > line.length) {
            clearInterval(id);
            terminal.textContent += '\n';
            setTimeout(resolve, 260);
          }
        }, 26);
      });
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = form.username.value.trim();
    const password = form.password.value;
    if (username === 'arjun.mehta' && password === 'DV@2026Secure') {
      msg.className = 'notice';
      msg.textContent = 'Credentials accepted. Establishing secure channel...';
      await typeLines();
      localStorage.setItem('loggedIn', 'true');
      setTimeout(() => { window.location.href = 'bank-dashboard.html'; }, 300);
    } else {
      msg.className = 'notice error';
      msg.textContent = 'Authentication failed. Invalid username or password.';
    }
  });
}

if (page === 'bank-dashboard') {
  gateAuth('login');
}

if (page === 'defvault-dashboard') {
  gateAuth('login');
  const threat = document.getElementById('threatPanel');
  const stored = JSON.parse(localStorage.getItem('secureMail') || '[]');
  const exe = stored.find((m) => m.attachment === 'invoice_update.exe');
  if (exe) {
    threat.innerHTML = `
      <h3>Threat Detection Panel</h3>
      <p>RAT Signature Match</p>
      <p>Phishing Indicators Detected</p>
      <p>File Hash Flagged</p>
      <p><strong>Risk Level: High</strong></p>
      <p><strong>Action: Quarantined by DefVault</strong></p>
    `;
  }
}

if (page === 'email-sender') {
  gateAuth('login');
  const form = document.getElementById('emailForm');
  const out = document.getElementById('mailStatus');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const payload = {
      to: form.to.value.trim(),
      subject: form.subject.value.trim(),
      attachment: form.attachment.value.trim(),
      body: form.body.value.trim(),
      ts: Date.now()
    };
    const mailbox = JSON.parse(localStorage.getItem('secureMail') || '[]');
    mailbox.push(payload);
    localStorage.setItem('secureMail', JSON.stringify(mailbox));
    out.className = 'notice';
    out.textContent = 'Secure mail submitted to DefVault inspection queue.';
    form.reset();
  });
}
