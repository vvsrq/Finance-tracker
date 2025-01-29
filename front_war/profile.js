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


    // Функция для получения транзакций с сервера
    async function fetchTransactions() {
        try {
            const response = await fetch('/transactions'); 
            if (!response.ok) {
                throw new Error("Ошибка при получении транзакций: " + response.status); 
            }

            const transactions = await response.json();  
            

            const transactionsTableBody = document.querySelector('#transactionsTable tbody');
            transactionsTableBody.innerHTML = '';  

            if (transactions.length === 0) {
                transactionsTableBody.innerHTML = "<tr><td colspan='5'>У вас пока нет транзакций</td></tr>";
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
            console.error("Ошибка получения транзакций:", error);
            alert(error);
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
            const response = await fetch('/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
                throw new Error(error.message);
            }
            fetchTransactions();
        } catch (error) {
            alert(error);
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
            const response = await fetch(`/transactions/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            fetchTransactions();
        }
        catch (error) {
            alert(error)
            console.error('Ошибка при удалении транзакции:', error)
        }
    }

    async function editTransaction(id) {
        try {
            const response = await fetch(`/transactions/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
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
            alert(error);
            console.error('Ошибка при получении транзакции:', error);
        }
    }

    async function saveEdit(id, amount, date, categoryId, description) {
        try {
            const response = await fetch(`/transactions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
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
            alert(error);
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
            errorEditDiv.textContent = "Не все обязательные поля заполнены"
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
                  const response = await fetch('/reports/category', {
                     method: 'GET',
                      headers: {
                          'Content-Type': 'application/json'
                       }
                  });
                if (!response.ok) {
                        const errorData = await response.json();
                         console.error('Ошибка при получении отчета по категориям:', errorData.message);
                         reportErrorDiv.textContent = 'Ошибка при получении отчета по категориям: ' + errorData.message;
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
                   reportErrorDiv.textContent = 'Ошибка сети. Попробуйте позже.';
              }
        }

    // Функция для получения и отображения категорий
    async function fetchAndDisplayCategories() {
        try {
            const response = await fetch('/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Ошибка при получении категорий:', errorData.message);
                categoryErrorDiv.textContent = 'Ошибка при получении категорий: ' + errorData.message;
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
            categoryErrorDiv.textContent = 'Ошибка сети. Попробуйте позже.';
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
            const response = await fetch('/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log('Категория добавлена');
                addCategoryForm.reset();
                fetchAndDisplayCategories(); 
            } else {
                const errorData = await response.json();
                console.error('Ошибка при создании категории:', errorData.message);
                categoryErrorDiv.textContent = 'Ошибка создания категории: ' + errorData.message;
            }
        } catch (error) {
            console.error('Ошибка сети:', error);
            categoryErrorDiv.textContent = 'Ошибка сети. Попробуйте позже.';
        }
    });
    google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawExpensesChart);


async function drawExpensesChart() {
try {
const response = await fetch('/categories', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
 });

  if (!response.ok) {
    throw new Error('Ошибка при получении категорий: ' + response.status);
   }

  const categories = await response.json();

  const responseTrans = await fetch('/transactions');
  if (!responseTrans.ok) {
      throw new Error('Ошибка при получении транзакций: ' + responseTrans.status);
   }

   const transactions = await responseTrans.json();

  const expenses = transactions.filter(transaction => {
    const category = categories.find(cat => cat.id === transaction.categoryId);
  return category && category.type === 'expense';
});

const data = new google.visualization.DataTable();
    data.addColumn('string', 'Date');
    data.addColumn('number', 'Amount');

    expenses.forEach(transaction => {
     data.addRow([transaction.date, parseFloat(transaction.amount)]);
    });

const options = {
    title: 'График расходов',
   curveType: 'function',
     legend: { position: 'bottom' }
};

const chart = new google.visualization.PieChart(document.getElementById('expenses_chart_div'));
  chart.draw(data, options);

 } catch (error) {
    console.error('Ошибка при получении данных для графика:', error);
 }
}
});