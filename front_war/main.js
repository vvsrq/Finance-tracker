// Получаем элементы
const showLoginBtn = document.getElementById('showLogin');
const loginFormContainer = document.querySelector('.hiden');
const closeBtn = document.querySelector('.btnC');

// Обработчик для показа формы
showLoginBtn.addEventListener('click', () => {
    loginFormContainer.style.display = 'flex'; // Показываем форму как flex-контейнер
});

// Обработчик для скрытия формы
closeBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Предотвращаем стандартное поведение кнопки
    loginFormContainer.style.display = 'none'; // Скрываем форму
});


showLoginBtn.addEventListener('click', () => {
    loginFormContainer.classList.add('show');
});

closeBtn.addEventListener('click', (event) => {
    event.preventDefault();
    loginFormContainer.classList.remove('show');
});
