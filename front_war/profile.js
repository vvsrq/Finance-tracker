document.addEventListener('DOMContentLoaded', () => {
    const transactionsContainer = document.getElementById('transactions-container');
    const addForm = document.getElementById('add-form');
    const editForm = document.getElementById('edit-form');
    const amountInput = document.getElementById('amount');
    const dateInput = document.getElementById('date');
    const categoryIdInput = document.getElementById('categoryId');
    const descriptionInput = document.getElementById('description');
    const errorDiv = document.getElementById('error');
    const editIdInput = document.getElementById('editId');
    const amountEditInput = document.getElementById('amount_edit');
    const dateEditInput = document.getElementById('date_edit');
    const categoryIdEditInput = document.getElementById('categoryId_edit');
    const descriptionEditInput = document.getElementById('description_edit');
    const errorEditDiv = document.getElementById('error_edit')
    const token = localStorage.getItem('token');

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


    // Функция для получения транзакций с сервера
    async function fetchTransactions() {
        try {
            const token = localStorage.getItem('token');
            console.log(token);
            const response = await fetch('/transactions', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                notifications.error(
                    "Ошибка при получении транзакций: " + response.status
                );
                throw new Error("Ошибка при получении транзакций: " + response.status);
            }

            const transactions = await response.json();


            const transactionsTableBody = document.querySelector('#transactionsTable tbody');
            transactionsTableBody.innerHTML = '';

            if (transactions.length === 0) {
                notifications.success(
                    "у вас нет транзакций"
                );
            } else {
                transactions.forEach(transaction => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                <td>${transaction.id}</td>
                <td>${transaction.amount}</td>
                <td>${transaction.date}</td>
                <td>${transaction.description}</td>
                <td>
                  <button class="edit-btn" data-id="${transaction.id}">Edit</button>
                  <button class="delete-btn" data-id="${transaction.id}">Delete</button>
                 </td>
                   `;
                    transactionsTableBody.appendChild(row);
                    row.querySelector('.delete-btn').addEventListener('click', () => deleteTransaction(transaction.id));
                    row.querySelector('.edit-btn').addEventListener('click', () => editTransaction(transaction.id));
                });
            }
        }
        catch (error) {
            notifications.success(
                "Ошибка получения транзакций:", error
            );
            console.error("Ошибка получения транзакций:", error);
        }
    }

    function displayTransactions(transactions) {
        transactionsContainer.innerHTML = '';

        transactions.forEach(transaction => {
            const transactionDiv = document.createElement('div');
            transactionDiv.classList.add('transaction');
            transactionDiv.innerHTML = `
      <p>Amount: ${transaction.amount}</p>
       <p>Date: ${transaction.date}</p>
       <p>Category ID: ${transaction.categoryId}</p>
       <p>Description: ${transaction.description || 'No description'}</p>
      <button class="edit-btn" data-id="${transaction.id}">Edit</button>
       <button class="delete-btn" data-id="${transaction.id}">Delete</button>
       <hr>
    `;
            transactionsContainer.appendChild(transactionDiv);
            transactionDiv.querySelector('.delete-btn').addEventListener('click', () => deleteTransaction(transaction.id));
            transactionDiv.querySelector('.edit-btn').addEventListener('click', () => editTransaction(transaction.id));
        });
    }


    async function createTransaction(amount, date, categoryId, description) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount,
                    categoryId,
                    date,
                    description
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                notifications.error(
                    "Ошибка создания транзакции:", error.message
                );
                throw new Error(error.message);
            }
            fetchTransactions();
        } catch (error) {
            notifications.error(
                'Ошибка при создании транзакции:', error
            );
            console.error('Ошибка при создании транзакции:', error);
        }
    }

    document.getElementById('addTransaction').addEventListener('click', async () => {

        const amount = amountInput.value;
        const date = dateInput.value;
        const categoryId = categoryIdInput.value;
        const description = descriptionInput.value;

        if (!amount || !date || !categoryId) {
            errorDiv.textContent = "Не все обязательные поля заполнены"
        }

        else {
            await createTransaction(amount, date, categoryId, description);
            amountInput.value = '';
            dateInput.value = '';
            categoryIdInput.value = '';
            descriptionInput.value = '';
            errorDiv.textContent = '';
        }
    });

    async function deleteTransaction(id) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/transactions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                const error = await response.json();
                notifications.error(
                    "Ошибка при удалении транзакции:", error.message
                );
                throw new Error(error.message);
            }
            fetchTransactions();
        }
        catch (error) {
            notifications.error(
                'Ошибка при удалении транзакции:', error
            );
            console.error('Ошибка при удалении транзакции:', error)
        }
    }

    async function editTransaction(id) {
        try {
            const response = await fetch(`/transactions/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                notifications.error(
                    "Ошибка при получении транзакции:", error.message
                );
                throw new Error(error.message);
            }

            const transaction = await response.json();

            editForm.style.display = 'block';
            editIdInput.value = id;
            amountEditInput.value = transaction.amount;
            dateEditInput.value = transaction.date;
            categoryIdEditInput.value = transaction.categoryId;
            descriptionEditInput.value = transaction.description;

        }
        catch (error) {
            notifications.error(
                'Ошибка при получении транзакции:', error
            );
            console.error('Ошибка при получении транзакции:', error);
        }
    }

    async function saveEdit(id, amount, date, categoryId, description) {
        try {
            const response = await fetch(`/transactions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount,
                    date,
                    categoryId,
                    description
                })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            fetchTransactions();
            document.getElementById('edit-form').style.display = 'none';
        }
        catch (error) {
            notifications.error(
                'Ошибка при обновлении транзакции:', error
            );
            console.error('Ошибка при обновлении транзакции:', error)
        }
    }

    document.getElementById('saveEdit').addEventListener('click', async () => {
        const id = editIdInput.value;
        const amount = amountEditInput.value;
        const date = dateEditInput.value;
        const categoryId = categoryIdEditInput.value;
        const description = descriptionEditInput.value;

        if (!amount || !date || !categoryId) {
            notifications.error(
                'Не все обязательные поля заполнены',
                '(Количество, Дата, Категория)'
            );
            
        }
        else {
            await saveEdit(id, amount, date, categoryId, description);
            amountEditInput.value = '';
            dateEditInput.value = '';
            categoryIdEditInput.value = '';
            descriptionEditInput.value = '';
            errorEditDiv.textContent = '';
        }
    })
    fetchTransactions();
    const addCategoryForm = document.getElementById('addCategoryForm');
    const categoryList = document.getElementById('categoryList');
    const categoryErrorDiv = document.getElementById('categoryError');

    const categoryReportTableBody = document.querySelector('#categoryReportTable tbody');
    const reportErrorDiv = document.getElementById('reportError');

    async function fetchAndDisplayCategoryReport() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/reports/category', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Ошибка при получении отчета по категориям:', errorData.message);
                notifications.error(
                    'Ошибка при получении отчета по категориям:', errorData.message
                );
                return;
            }
            const report = await response.json();

            // Очищаем таблицу
            categoryReportTableBody.innerHTML = '';
            if (report.length === 0) {
                categoryReportTableBody.innerHTML = "<tr><td colspan='4'>Нет данных для отчета</td></tr>";
            }
            else {
                report.forEach(categoryData => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                                    <td>${categoryData.categoryId}</td>
                                    <td>${categoryData.categoryName}</td>
                                     <td>${categoryData.categoryType}</td>
                                     <td>${categoryData.totalAmount}</td>
                                 `;
                    categoryReportTableBody.appendChild(row);
                });
            }
        } catch (error) {
            console.error('Ошибка при запросе:', error);
            notifications.error(
                'Ошибка сети:', error
            );
        }
    }

    // Функция для получения и отображения категорий
    async function fetchAndDisplayCategories() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Ошибка при получении категорий:', errorData.message);
                notifications.error(
                    'Ошибка при получении категорий:', errorData.message
                );
                return;
            }

            const categories = await response.json();
            // Очищаем список
            categoryList.innerHTML = '';
            categories.forEach(category => {
                const li = document.createElement('li');
                li.textContent = `${category.name} (${category.type})`;
                categoryList.appendChild(li);
            });
        } catch (error) {
            console.error('Ошибка при запросе:', error);
            notifications.error(
                'Ошибка при запросе:', error
            );
        }
    }
    fetchAndDisplayCategories();
    fetchAndDisplayCategoryReport();



    addCategoryForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        categoryErrorDiv.textContent = '';
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log('Категория добавлена');
                notifications.success(
                    'Категория добавлена'
                );
                addCategoryForm.reset();
                fetchAndDisplayCategories();
            } else {
                const errorData = await response.json();
                console.error('Ошибка при создании категории:', errorData.message);
                notifications.error(
                    'Ошибка при создании категории:', errorData.message
                );
            }
        } catch (error) {
            console.error('Ошибка сети:', error);
            notifications.error(
                'Ошибка сети:', error
            );
        }
    });
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawExpensesChart);


    async function drawExpensesChart() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                notifications.error(
                    'Ошибка при получении категорий:', response.status
                );
                throw new Error('Ошибка при получении категорий: ' + response.status);
            }

            const categories = await response.json();

            const responseTrans = await fetch('/transactions', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!responseTrans.ok) {
                notifications.error(
                    'Ошибка при получении транзакций:', responseTrans.status
                );
                throw new Error('Ошибка при получении транзакций: ' + responseTrans.status);
            }

            const transactions = await responseTrans.json();

            // Фильтруем только расходы
            const expenses = transactions
                .filter(transaction => {
                    const category = categories.find(cat => cat.id === transaction.categoryId);
                    return category && category.type === 'expense';
                })
                .map(transaction => ({
                    date: new Date(transaction.date).toLocaleDateString(),
                    amount: parseFloat(transaction.amount)
                }));

            if (expenses.length === 0) {
                document.getElementById('expenses_chart_div').innerHTML = '<p>Нет данных для построения графика.</p>';
                return;
            }

            // Группируем расходы по дате
            const groupedExpenses = {};
            expenses.forEach(({ date, amount }) => {
                groupedExpenses[date] = (groupedExpenses[date] || 0) + amount;
            });

            // Преобразуем в массив для графика
            const data = new google.visualization.DataTable();
            data.addColumn('string', 'Дата');
            data.addColumn('number', 'Сумма');

            Object.keys(groupedExpenses).forEach(date => {
                data.addRow([date, groupedExpenses[date]]);
            });

            const options = {
                title: 'График расходов по дням',
                hAxis: {
                    title: 'Дата',
                    textStyle: { fontSize: 12 },
                    slantedText: true,
                    slantedTextAngle: 45
                },
                vAxis: {
                    title: 'Сумма расходов',
                    textStyle: { fontSize: 12 },
                    gridlines: { count: 10 }
                },
                backgroundColor: '#f9f9f9',
                colors: ['#ff6b6b'],
                chartArea: { width: '80%', height: '70%' },
                animation: {
                    startup: true,
                    duration: 800,
                    easing: 'out'
                },
                legend: { position: 'none' }
            };

            const chartDiv = document.getElementById('expenses_chart_div');

            // Добавляем стили
            chartDiv.style.marginTop = '20px';
            chartDiv.style.borderRadius = '15px';
            chartDiv.style.overflow = 'hidden';
            chartDiv.style.background = 'rgba(255, 255, 255, 0.1)';
            chartDiv.style.padding = '10px';

            const chart = new google.visualization.ColumnChart(chartDiv);
            chart.draw(data, options);

        } catch (error) {
            console.error('Ошибка при получении данных для графика:', error);
            notifications.error(
                'Ошибка при получении данных для графика:', error
            );
        }
    }
});