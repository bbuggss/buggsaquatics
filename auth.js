// ============================================================
// auth.js — account state shared across every page
// Requires config.js to be loaded first (sets window.sb)
// ============================================================

const Auth = {
  async getUser() {
    if (!window.sb) return null;
    const { data } = await window.sb.auth.getUser();
    return data?.user || null;
  },

  async getProfile(userId) {
    if (!window.sb || !userId) return null;
    const { data, error } = await window.sb
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) { console.warn('getProfile:', error.message); return null; }
    return data;
  },

  async updateProfile(userId, fields) {
    const { error } = await window.sb
      .from('profiles')
      .update(fields)
      .eq('id', userId);
    if (error) throw error;
    return true;
  },

  async signUp(email, password, username) {
    const { data, error } = await window.sb.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await window.sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    await window.sb.auth.signOut();
    window.location.href = 'index.html';
  },

  initial(nameOrEmail) {
    if (!nameOrEmail) return '?';
    return nameOrEmail.trim().charAt(0).toUpperCase();
  },
};

// ---- Nav account widget (runs on every page) ------------------
async function renderNavAccount() {
  const slot = document.getElementById('navAccount');
  const mobileSlot = document.getElementById('mobileAccount');
  if (!slot) return;

  if (!window.sb) {
    slot.innerHTML = `<a class="btn btn-ghost btn-sm" href="account.html">Sign in</a>`;
    if (mobileSlot) mobileSlot.innerHTML = `<a href="account.html">Sign in / Create account</a>`;
    return;
  }

  const user = await Auth.getUser();

  if (!user) {
    slot.innerHTML = `<a class="btn btn-ghost btn-sm" href="account.html">Sign in</a>`;
    if (mobileSlot) mobileSlot.innerHTML = `<a href="account.html">Sign in / Create account</a>`;
    return;
  }

  const profile = await Auth.getProfile(user.id);
  const name = profile?.username || user.email.split('@')[0];

  slot.innerHTML = `
    <div class="nav-account">
      <button class="nav-account-btn" id="navAccountBtn">
        <span class="avatar">${Auth.initial(name)}</span> ${name}
      </button>
      <div class="nav-account-menu" id="navAccountMenu">
        <a href="account.html">My profile</a>
        <a href="forum.html">Forum</a>
        <button id="navSignOut">Sign out</button>
      </div>
    </div>`;

  document.getElementById('navAccountBtn').addEventListener('click', () => {
    document.getElementById('navAccountMenu').classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    const wrap = document.querySelector('.nav-account');
    if (wrap && !wrap.contains(e.target)) {
      document.getElementById('navAccountMenu')?.classList.remove('open');
    }
  });
  document.getElementById('navSignOut').addEventListener('click', () => Auth.signOut());

  if (mobileSlot) {
    mobileSlot.innerHTML = `
      <a href="account.html">My profile (${name})</a>
      <button id="mobileSignOut">Sign out</button>`;
    document.getElementById('mobileSignOut').addEventListener('click', () => Auth.signOut());
  }
}

document.addEventListener('DOMContentLoaded', renderNavAccount);
