document.addEventListener('DOMContentLoaded', () => {
    const qrCodeElement = document.getElementById('qrCode');
    const secretKeyElement = document.getElementById('secretKey');
    // const verificationCodeInput = document.getElementById('verificationCode');
    const twoFactorAuthErrorDiv = document.getElementById('twoFactorAuthError');

    function openSidebar() {
        document.getElementById('sidebar').classList.add('active');
    }
    
    function closeSidebar() {
        document.getElementById('sidebar').classList.remove('active');
    }
    
    document.addEventListener('click', function(event) {
        const sidebar = document.getElementById('sidebar');
        const menuButton = document.querySelector('.menu-button');
        
        if (!sidebar.contains(event.target) && event.target !== menuButton) {
            closeSidebar();
        }
    });

    async function enableTwoFactorAuth() {
        try {
            const token = localStorage.getItem('token');
            console.log("Получен токен:", token);
            const response = await fetch('/login.js/enable2fa', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                qrCodeElement.innerHTML = `<img src="${data.qrCode}" alt="QR Code">`;
                secretKeyElement.textContent = data.secret;
                console.log("2FA Secret Key:", data.secret)
            } else {
                const errorData = await response.json();
                twoFactorAuthErrorDiv.textContent = `Ошибка: ${errorData.message}`;
                console.error('Ошибка при включении 2FA:', errorData.message);
            }
        } catch (error) {
            console.error('Ошибка при включении 2FA:', error);
            twoFactorAuthErrorDiv.textContent = 'Ошибка сети. Попробуйте позже.';
        }
    }

    document.getElementById('getCode').addEventListener('click', enableTwoFactorAuth);
})