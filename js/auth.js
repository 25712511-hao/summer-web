const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

function getAccounts() {
  return JSON.parse(localStorage.getItem('accounts')) || [];
}

function saveAccounts(accounts) {
  localStorage.setItem('accounts', JSON.stringify(accounts));
}

function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function showFieldError(inputEl, message) {
  clearFieldError(inputEl);
  if (!message) return;
  const err = document.createElement('p');
  err.className = 'field-error';
  err.textContent = message;
  inputEl.insertAdjacentElement('afterend', err);
  inputEl.classList.add('input-invalid');
}

function clearFieldError(inputEl) {
  inputEl.classList.remove('input-invalid');
  const next = inputEl.nextElementSibling;
  if (next && next.classList.contains('field-error')) next.remove();
}

function showFormMessage(box, message, type) {
  let msgEl = box.querySelector('.form-message');
  if (!msgEl) {
    msgEl = document.createElement('div');
    msgEl.className = 'form-message';
    box.insertBefore(msgEl, box.querySelector('form'));
  }
  msgEl.textContent = message;
  msgEl.classList.remove('form-message-success', 'form-message-error');
  msgEl.classList.add(type === 'success' ? 'form-message-success' : 'form-message-error');
  msgEl.hidden = false;
}

function initRegisterForm() {
  const form = document.querySelector('#signPassword')?.closest('form');
  if (!form) return;

  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('signEmail');
  const passwordInput = document.getElementById('signPassword');
  const confirmInput = document.getElementById('confirmPassword');
  const box = form.closest('.box');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    [fullNameInput, emailInput, passwordInput, confirmInput].forEach(clearFieldError);

    if (!fullNameInput.value.trim()) {
      showFieldError(fullNameInput, 'Vui lòng nhập họ và tên.');
      hasError = true;
    }

    if (!EMAIL_REGEX.test(emailInput.value.trim())) {
      showFieldError(emailInput, 'Email không đúng định dạng.');
      hasError = true;
    }

    if (passwordInput.value.length < MIN_PASSWORD_LENGTH) {
      showFieldError(passwordInput, `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`);
      hasError = true;
    }

    if (confirmInput.value !== passwordInput.value) {
      showFieldError(confirmInput, 'Mật khẩu xác nhận không khớp.');
      hasError = true;
    }

    if (hasError) return;

    const accounts = getAccounts();
    const emailLower = emailInput.value.trim().toLowerCase();
    if (accounts.some(acc => acc.email.toLowerCase() === emailLower)) {
      showFieldError(emailInput, 'Email này đã được đăng ký.');
      return;
    }

    accounts.push({
      fullName: fullNameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
      orderCount: 0,
      points: 0,
      favorites: 0
  });
    saveAccounts(accounts);

    showFormMessage(box, 'Đăng ký thành công! Đang chuyển sang trang đăng nhập...', 'success');
    form.reset();
    setTimeout(() => { window.location.href = 'login.html'; }, 1200);
  });
}

function initLoginForm() {
  const form = document.querySelector('#password')?.closest('form');
  if (!form) return;

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const box = form.closest('.box');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    [emailInput, passwordInput].forEach(clearFieldError);

    if (!EMAIL_REGEX.test(emailInput.value.trim())) {
      showFieldError(emailInput, 'Email không đúng định dạng.');
      hasError = true;
    }
    if (!passwordInput.value) {
      showFieldError(passwordInput, 'Vui lòng nhập mật khẩu.');
      hasError = true;
    }
    if (hasError) return;

    const accounts = getAccounts();
    const emailLower = emailInput.value.trim().toLowerCase();
    const account = accounts.find(acc => acc.email.toLowerCase() === emailLower);

    if (!account || account.password !== passwordInput.value) {
      showFormMessage(box, 'Email hoặc mật khẩu không đúng.', 'error');
      return;
    }

    setCurrentUser({ fullName: account.fullName, email: account.email });
    showFormMessage(box, `Đăng nhập thành công! Xin chào ${account.fullName}.`, 'success');
    form.reset();
    setTimeout(() => { window.location.href = '../index.html'; }, 900);
  });
}

function initForgotPasswordForm() {
  const toggleButton = document.getElementById('toggleContactType');
  const forgotText = document.getElementById('forgotText');
  const forgotLabel = document.getElementById('forgotLabel');
  const forgotInput = document.getElementById('forgotInput');
  if (!toggleButton || !forgotText || !forgotLabel || !forgotInput) return;

  let isPhoneMode = false;

  function updateUI() {
    if (isPhoneMode) {
      forgotText.textContent = 'Nhập số điện thoại của bạn để nhận mã xác minh.';
      forgotLabel.textContent = 'Số điện thoại';
      forgotInput.type = 'tel';
      forgotInput.placeholder = '0987654321';
      forgotInput.name = 'phone';
      toggleButton.textContent = 'Hoặc email';
    } else {
      forgotText.textContent = 'Nhập email của bạn để nhận mã xác minh.';
      forgotLabel.textContent = 'Email';
      forgotInput.type = 'email';
      forgotInput.placeholder = 'example@email.com';
      forgotInput.name = 'email';
      toggleButton.textContent = 'Hoặc số điện thoại';
    }
    forgotInput.value = '';
  }

  updateUI();
  toggleButton.addEventListener('click', () => {
    isPhoneMode = !isPhoneMode;
    updateUI();
  });

  const form = forgotInput.closest('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Mã xác minh đã được gửi (bản demo).');
  });
}

function initProfilePage() {
  const nameEl = document.getElementById('profileName');
  if (!nameEl) return;

  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  nameEl.textContent = user.fullName;
  const account = getAccounts().find(acc => acc.email.toLowerCase() === user.email.toLowerCase());
  document.getElementById('profileOrderCount').textContent = account?.orderCount || 0;
  document.getElementById('profilePoints').textContent = formatPrice(account?.points || 0) + ' ₫';
  const emailField = document.querySelector('#profileForm input[type="email"]');
  if (emailField) emailField.value = user.email;

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      window.location.href = '../index.html';
    });
  }

  const deleteBtn = document.getElementById('deleteAccountBtn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      if (!confirm('Bạn chắc chắn muốn xóa tài khoản này?')) return;
      const accounts = getAccounts().filter(acc => acc.email.toLowerCase() !== user.email.toLowerCase());
      saveAccounts(accounts);
      localStorage.removeItem('currentUser');
      window.location.href = '../index.html';
    });
  }

  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Đã lưu thay đổi hồ sơ (bản demo).');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initRegisterForm();
  initLoginForm();
  initForgotPasswordForm();
  initProfilePage();
});
