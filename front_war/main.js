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
