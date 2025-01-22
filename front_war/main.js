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
      console.log('Регистрация успешна');
      
    } else {
      const errorData = await response.json();
      console.error('Ошибка регистрации:', errorData.message);
      alert('Ошибка регистрации: ' + errorData.message); 
    }
  } catch (error) {
    console.error('Ошибка сети:', error);
    alert('Ошибка сети. Попробуйте позже.');
  }
});

document.getElementById('signinForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  const errorDiv = document.getElementById('error');

  try {
  const response = await fetch('/login.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  });
  if (response.ok) {
    console.log('Регистрация успешна');
      window.location.href = '/profile';
      } else {
    const errorData = await response.json();
      console.error('Ошибка регистрации:', errorData.message);
      errorDiv.textContent = 'Ошибка регистрации: ' + errorData.message;
      }
} catch (error) {
  console.error('Ошибка сети:', error);
  errorDiv.textContent = 'Ошибка сети. Попробуйте позже.';
}
});