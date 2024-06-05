const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  signDisplay: "always",
});

const list = document.getElementById("transactionList");
const form = document.getElementById("transactionForm");
const st = document.getElementById("st");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

form.addEventListener("submit", addTransaction);

// update functionality
function updateTotal() {
  let incomeTotal = 0;
  let expenseTotal = 0;

  transactions.forEach((trx) => {
    if (trx.type === "income") {
      incomeTotal += trx.amount;
    } else if (trx.type === "expense") {
      expenseTotal += trx.amount;
    }
  });

  const balanceTotal = incomeTotal - expenseTotal;

  const formattedBalance = formatter.format(balanceTotal);
  const formattedIncome = formatter.format(incomeTotal);
  const formattedExpense = formatter.format(expenseTotal * -1);

  document.getElementById("balance").textContent = formattedBalance.substring(1);
  document.getElementById("income").textContent = formattedIncome;
  document.getElementById("expense").textContent = formattedExpense;
}

// render list functions

function renderList() {
  // Clear the existing list and status
  list.innerHTML = "";
  st.textContent = "";

  // Check if there are any transactions
  if (transactions.length === 0) {
    st.textContent = "No transactions.";
    return;
  }

  // Iterate over each transaction and generate HTML elements
  transactions.forEach(({ id, name, amount, date, type }) => {
    const sign = type === "income" ? 1 : -1;

    const li = document.createElement("li");

    li.innerHTML = `
      <div class="name">
        <h4>${name}</h4>
        <p>${new Date(date).toLocaleDateString()}</p>
      </div>
      <div class="amount ${type}">
        <span>${formatter.format(amount * sign)}</span>
      </div>
      <div class="action">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" onclick="deleteTransaction(${id})">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    `;

    list.appendChild(li);
  });
}

// Call renderList to display transactions and update the total amount
renderList();
updateTotal();


function deleteTransaction(id) {
  const index = transactions.findIndex((trx) => trx.id === id);

  if (index !== -1) {
    transactions.splice(index, 1);
    updateTotal();
    saveTransactions();
    renderList();
  } 
}

// add function
function addTransaction(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const name = formData.get("name");
  const amount = parseFloat(formData.get("amount"));
  const date = new Date(formData.get("date"));
  const type = formData.get("type") === "on" ? "income" : "expense";

  transactions.push({
    id: transactions.length + 1,
    name: name,
    amount: amount,
    date: date,
    type: type,
  });

  this.reset();

  updateTotal();
  saveTransactions();
  renderList();
}


function saveTransactions() {
  try {
    // Sort the transactions array by date in descending order
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Save the sorted transactions array to localStorage as a JSON string
    localStorage.setItem("transactions", JSON.stringify(transactions));
  } catch (error) {
    console.error("Error saving transactions to localStorage:", error);
  }
}

