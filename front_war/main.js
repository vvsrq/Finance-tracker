// Получаем элементы
const showLoginBtn = document.getElementById('showLogin');
const loginFormContainer = document.querySelector('.hiden');
const closeBtn = document.querySelector('.btnC');

// Обработчик для показа формы
showLoginBtn.addEventListener('click', () => {
    loginFormContainer.style.display = 'flex'; 
});

// Обработчик для скрытия формы
closeBtn.addEventListener('click', (event) => {
    event.preventDefault(); 
    loginFormContainer.style.display = 'none'; 
});


showLoginBtn.addEventListener('click', () => {
    loginFormContainer.classList.add('show');
});

closeBtn.addEventListener('click', (event) => {
    event.preventDefault();
    loginFormContainer.classList.remove('show');
});


document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
    const response = await fetch('/users.js', { // Отправляем POST-запрос на /users
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Преобразуем данные в JSON
    });

    if (response.ok) {
      // Регистрация успешна
      console.log('Регистрация успешна');
      // Перенаправляем пользователя или отображаем сообщение об успехе
      // window.location.href = '/login';
    } else {
      const errorData = await response.json();
      console.error('Ошибка регистрации:', errorData.message);
      // Отображаем сообщение об ошибке пользователю
      alert('Ошибка регистрации: ' + errorData.message); 
    }
  } catch (error) {
    console.error('Ошибка сети:', error);
    alert('Ошибка сети. Попробуйте позже.');
  }
});