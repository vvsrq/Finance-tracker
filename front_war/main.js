// Получаем элементы
const showLoginBtn = document.getElementById('showLogin');
const showsigninBtn = document.getElementById('showSingin');
const loginFormContainer = document.querySelector('.hiden');
const signinFormContainer = document.querySelector('.hiden-s');
const closeBtn = document.querySelector('.btnC');
const closeBtns = document.querySelector('.btnsC');

// Обработчик для показа формы
showLoginBtn.addEventListener('click', () => {
  loginFormContainer.style.display = 'flex';
});

// Обработчик для скрытия формы
closeBtn.addEventListener('click', (event) => {
  event.preventDefault();
  loginFormContainer.style.display = 'none';
});


showsigninBtn.addEventListener('click', () => {
  signinFormContainer.style.display = 'flex';
});

closeBtns.addEventListener('click', (event) => {
  event.preventDefault();
  signinFormContainer.style.display = 'none';
});

class NotificationManager {
  constructor() {
    this.container = null;
    this.initContainer();
  }

  initContainer() {
    this.container = document.createElement('div');
    this.container.className = 'notification-container';
    document.body.appendChild(this.container);
  }

  show(options) {
    const {
      title = '',
      message = '',
      type = 'info', // 'success', 'error', 'info'
      duration = 5000
    } = options;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    notification.innerHTML = `
          <div class="notification-content">
              <div class="notification-title">${title}</div>
              <div class="notification-message">${message}</div>
          </div>
          <button class="notification-close">×</button>
      `;

    this.container.appendChild(notification);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => this.hide(notification));

    if (duration) {
      setTimeout(() => this.hide(notification), duration);
    }

    return notification;
  }

  hide(notification) {
    notification.classList.add('hiding');
    notification.addEventListener('animationend', () => {
      notification.remove();
    });
  }

  success(title, message, duration) {
    return this.show({ title, message, type: 'success', duration });
  }

  error(title, message, duration) {
    return this.show({ title, message, type: 'error', duration });
  }

  info(title, message, duration) {
    return this.show({ title, message, type: 'info', duration });
  }
}

const notifications = new NotificationManager();

document.addEventListener('click', function (event) {
  const sidebar = document.getElementById('sidebar');
  const menuButton = document.querySelector('.menu-button');

  if (!sidebar.contains(event.target) && event.target !== menuButton) {
    closeSidebar();
  }
});

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      notifications.success(
        'Регистрация успешна'
      );
      const data = await response.json();
      const token = data.token;
      localStorage.setItem('token', token);

    } else {
      const errorData = await response.json();
      notifications.error(
        'Ошибка регистрации:', errorData.message
      );
      notifications.error(
        'Ошибка регистрации:', errorData.message
      );
    }
  } catch (error) {
    notifications.error(
      'Ошибка сети:', error
    );
  }
});

document.getElementById('signinForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  const errorDiv = document.getElementById('error');
  const token2FAContainer = document.getElementById('token2FAContainer');

  try {
    const response = await fetch('/login.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const data = await response.json();
      const token = data.token;
      localStorage.setItem('token', token);
      window.location.href = '/profile';
    } else {
      const errorData = await response.json();
      if (errorData.requires2FA) {
        notifications.error(
          "Необходимо ввести код 2FA"
        );
        token2FAContainer.style.display = 'block';
      }
      notifications.error(
        'Ошибка регистрации:', errorData.message
      );
      console.error('Ошибка регистрации:', errorData.message);
    }
  } catch (error) {
    notifications.error(
      'Ошибка сети:', error
    );
  }
});
