const expenseForm = document.getElementById('expense-form');
const expenseTable = document.getElementById('expense-table');
const budgetForm = document.getElementById('budget-form');
const budgetSummary = document.getElementById('budget-summary');
const savingsForm = document.getElementById('savings-form');
const savingsList = document.getElementById('savings-list');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let budget = parseFloat(localStorage.getItem('budget')) || 0;
let savingsGoals = JSON.parse(localStorage.getItem('savingsGoals')) || [];

// Add expense
expenseForm.addEventListener('submit', e => {
  e.preventDefault();
  const category = document.getElementById('expense-category').value;
  const amount = parseFloat(document.getElementById('expense-amount').value);
  const date = new Date().toLocaleDateString();

  const expense = { category, amount, date };
  expenses.push(expense);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  renderExpenses();
  updateBudgetSummary();
  expenseForm.reset();
});

// Render expenses
function renderExpenses() {
  expenseTable.innerHTML = '';
  expenses.forEach((expense, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${expense.date}</td>
      <td>${expense.category}</td>
      <td>$${expense.amount.toFixed(2)}</td>
      <td><button onclick="deleteExpense(${index})">Delete</button></td>
    `;
    expenseTable.appendChild(row);
  });
}

// Delete expense
function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  renderExpenses();
  updateBudgetSummary();
}

// Set budget
budgetForm.addEventListener('submit', e => {
  e.preventDefault();
  budget = parseFloat(document.getElementById('monthly-budget').value);
  localStorage.setItem('budget', budget);
  updateBudgetSummary();
  budgetForm.reset();
});

// Update budget summary
function updateBudgetSummary() {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = budget - totalExpenses;
  budgetSummary.textContent = `Total Expenses: $${totalExpenses.toFixed(2)} | Remaining Budget: $${remainingBudget.toFixed(2)}`;
}

// Add savings goal
savingsForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('savings-goal-name').value;
  const amount = parseFloat(document.getElementById('savings-goal-amount').value);

  const goal = { name, amount, progress: 0 };
  savingsGoals.push(goal);
  localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals));
  renderSavingsGoals();
  savingsForm.reset();
});

// Render savings goals
function renderSavingsGoals() {
  savingsList.innerHTML = '';
  savingsGoals.forEach((goal, index) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      ${goal.name}: $${goal.progress.toFixed(2)} / $${goal.amount.toFixed(2)}
      <button onclick="updateSavings(${index})">Add Progress</button>
      <button onclick="deleteSavings(${index})">Delete</button>
    `;
    savingsList.appendChild(listItem);
  });
}

// Update savings progress
function updateSavings(index) {
  const progress = parseFloat(prompt('Enter amount to add to savings:'));
  if (!isNaN(progress) && progress > 0) {
    savingsGoals[index].progress += progress;
    localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals));
    renderSavingsGoals();
  }
}

// Delete savings goal
function deleteSavings(index) {
  savingsGoals.splice(index, 1);
  localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals));
  renderSavingsGoals();
}

// Initial render
renderExpenses();
updateBudgetSummary();
renderSavingsGoals();