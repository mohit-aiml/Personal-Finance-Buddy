// Check login
const userEmail = localStorage.getItem('loggedInUser');
if (!userEmail) {
  window.location.href = 'index.html'; // Redirect if not logged in
}

document.getElementById('user-email').textContent = userEmail;

const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'index.html';
});

// Load transactions or initialize empty array
let transactions = JSON.parse(localStorage.getItem(userEmail + '-transactions')) || [];

const transactionForm = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const balanceEl = document.getElementById('balance');
const analysisText = document.getElementById('analysis-text');

let expenseChart = null;

transactionForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;
  const category = document.getElementById('category').value;

  if (!name || isNaN(amount) || amount <= 0 || !type || !category) {
    alert('Please fill all fields correctly.');
    return;
  }

  const transaction = { name, amount, type, category };
  transactions.push(transaction);
  localStorage.setItem(userEmail + '-transactions', JSON.stringify(transactions));

  transactionForm.reset();
  renderTransactions();
  updateSummary();
  updateChart();
  analyzeTransactions();
});

function renderTransactions() {
  transactionList.innerHTML = '';
  transactions.forEach((t, idx) => {
    const li = document.createElement('li');
    li.textContent = `${t.name} (${capitalize(t.category)}) - ${t.type === 'income' ? '+' : '-'}₹${t.amount.toFixed(2)}`;
    li.className = t.type === 'income' ? 'income' : 'expense';
    transactionList.appendChild(li);
  });
}

function updateSummary() {
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach(t => {
    if (t.type === 'income') totalIncome += t.amount;
    else totalExpenses += t.amount;
  });

  totalIncomeEl.textContent = totalIncome.toFixed(2);
  totalExpensesEl.textContent = totalExpenses.toFixed(2);
  balanceEl.textContent = (totalIncome - totalExpenses).toFixed(2);
}

function updateChart() {
  // Sum expenses by category (only expenses)
  const categories = ['needs', 'wants', 'unnecessary', 'savings'];
  const totals = { needs: 0, wants: 0, unnecessary: 0, savings: 0 };

  transactions.forEach(t => {
    if (t.type === 'expense' || t.type === 'income') {
      if (categories.includes(t.category)) {
        totals[t.category] += t.amount;
      }
    }
  });

  // Destroy previous chart if exists
  if (expenseChart) {
    expenseChart.destroy();
  }

  const ctx = document.getElementById('expenseChart').getContext('2d');
  expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Needs', 'Wants', 'Unnecessary Wants', 'Savings'],
      datasets: [{
        data: [totals.needs, totals.wants, totals.unnecessary, totals.savings],
        backgroundColor: ['#4caf50', '#2196f3', '#f44336', '#ffeb3b']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Expense Distribution' }
      }
    }
  });
}

function analyzeTransactions() {
  if (transactions.length === 0) {
    analysisText.textContent = 'Add some transactions to see your spending habits and tips.';
    return;
  }

  // Calculate total income and total expenses by category
  let totalIncome = 0;
  let totalExpenses = 0;
  let categoryTotals = { needs: 0, wants: 0, unnecessary: 0, savings: 0 };

  transactions.forEach(t => {
    if (t.type === 'income') totalIncome += t.amount;
    else if (t.type === 'expense') {
      totalExpenses += t.amount;
      if (categoryTotals.hasOwnProperty(t.category)) {
        categoryTotals[t.category] += t.amount;
      }
    }
  });

  // Calculate percentages of income spent on each expense category
  const percentNeeds = ((categoryTotals.needs / totalIncome) * 100).toFixed(1);
  const percentWants = ((categoryTotals.wants / totalIncome) * 100).toFixed(1);
  const percentUnnecessary = ((categoryTotals.unnecessary / totalIncome) * 100).toFixed(1);
  const percentSavings = ((categoryTotals.savings / totalIncome) * 100).toFixed(1);

  // Compose analysis message
  let analysis = `Your spending breakdown relative to your income:<br>
  - Needs: ${percentNeeds}%<br>
  - Wants: ${percentWants}%<br>
  - Unnecessary Wants: ${percentUnnecessary}%<br>
  - Savings: ${percentSavings}%<br><br>`;

  // Advice based on 50-30-20 budgeting rule
  if (percentNeeds > 50) {
    analysis += 'You are spending more than 50% on needs. Consider reviewing essential expenses to find savings.<br>';
  } else {
    analysis += 'Your spending on needs is within a healthy range.<br>';
  }

  if ((parseFloat(percentWants) + parseFloat(percentUnnecessary)) > 30) {
    analysis += 'Your wants and unnecessary wants exceed 30%. Try reducing discretionary spending.<br>';
  } else {
    analysis += 'Your discretionary spending is under control.<br>';
  }

  if (percentSavings < 20) {
    analysis += 'Your savings are below 20%. Aim to increase your savings gradually for financial security.<br>';
  } else {
    analysis += 'Great job maintaining good savings! Keep it up.<br>';
  }

  if (percentUnnecessary > 10) {
    analysis += 'Unnecessary wants are high. Track impulsive purchases and set spending limits.<br>';
  }

  analysis += '<br>Tips:<br>';
  analysis += '- Cook meals at home to reduce food expenses.<br>';
  analysis += '- Cancel unused subscriptions.<br>';
  analysis += '- Automate savings deposits.<br>';
  analysis += '- Review bills and negotiate better rates.<br>';

  analysisText.innerHTML = analysis;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initial render
renderTransactions();
updateSummary();
updateChart();
analyzeTransactions();
