import { BankAccount } from "./bankAccount.js";


/* 
Console testing used during development

const user = new BankAccount("ACCT01", "Hassan", 300000);

console.log(user);

console.log(`Initial balance: ${user.checkBalance()}`);

console.log(user.deposit(2000));

console.log(`After first deposit: ${user.checkBalance()}`);

console.log(user.withdraw(100000));

console.log(`After first withdrawal: ${user.checkBalance()}`);

console.log(user.withdraw(3000000));

console.log(`After second withdrawal: ${user.checkBalance()}`);
*/

const accountSetup = document.querySelector(".account-setup");
const createUserForm = document.getElementById("create-account-form");
const createUserInput = document.getElementById("user");
const dashboard = document.querySelector(".dashboard");
const accountHolder =  document.getElementById("account-holder");
const accountNumber = document.getElementById("account-number");
const sortCode = document.getElementById("sort-code");
const accountBalance = document.getElementById("account-balance");
const showDepositBtn = document.getElementById("deposit-toggle");
const depositForm = document.getElementById("deposit-form");
const depositAmount = document.getElementById("deposit-amount");
const showWithdrawBtn = document.getElementById("withdraw-toggle");
const withdrawForm = document.getElementById("withdraw-form");
const withdrawAmount = document.getElementById("withdraw-amount");
const transactionList = document.getElementById("transaction-list");
const resetAcct = document.getElementById("reset-account");
const notification = document.getElementById("notification");

function closeTransactionForm(form, toggleButton) {
    form.classList.remove("is-open");
    toggleButton.setAttribute("aria-expanded", "false");
}

function openTransactionForm(form, toggleButton) {
    form.classList.add("is-open");
    toggleButton.setAttribute("aria-expanded", "true");
}

showDepositBtn.addEventListener("click", () => {
    const depositIsOpen = depositForm.classList.contains("is-open");

    closeTransactionForm(withdrawForm, showWithdrawBtn);

    if (depositIsOpen) {
        closeTransactionForm(depositForm, showDepositBtn);
    } else {
        openTransactionForm(depositForm, showDepositBtn);
    }
});

showWithdrawBtn.addEventListener("click", () => {
    const withdrawIsOpen = withdrawForm.classList.contains("is-open");

    closeTransactionForm(depositForm, showDepositBtn);

    if (withdrawIsOpen) {
        closeTransactionForm(withdrawForm, showWithdrawBtn);
    } else {
        openTransactionForm(withdrawForm, showWithdrawBtn);
    }
});

function genAccountNumber(){
    let accountNum = "";
    for(let i=0; i<8; i++){
        let number = Math.floor(Math.random()*10);
        accountNum+=number;
    }
    return accountNum;
}

function genSortCode(){
    let sortCode = "";
    for(let i=0; i<6; i++){
        let number = Math.floor(Math.random()*10);
        sortCode+=number;
    }
    return `${sortCode.slice(0, 2)}-${sortCode.slice(2, 4)}-${sortCode.slice(4, 6)}`;
}

function genBalance(){
    let balance = Math.random()* 4500+500;
    return Number(balance.toFixed(2));
}

let currentAccount;

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP"
    }).format(amount);
}

createUserForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(createUserInput.value.trim() === ""){
        showNotification("Cannot leave name empty", "error");
        return;
    }
    accountSetup.hidden = true;
    dashboard.hidden = false;

    const userName = createUserInput.value.trim();
    const generatedAcctNumber = genAccountNumber();
    const generatedSortCode = genSortCode();
    const generatedBalance = genBalance();

    currentAccount = new BankAccount(generatedAcctNumber, userName, generatedBalance, generatedSortCode);

    accountHolder.textContent = currentAccount.accountHolder;
    accountNumber.textContent = currentAccount.accountNumber;
    sortCode.textContent = currentAccount.sortCode;
    accountBalance.textContent = formatCurrency(currentAccount.balance);
    saveData();
    showNotification("Account created successfully", "success");
});

const transactions = [];

function renderTransactions() {
    transactionList.innerHTML = "";

    for (const transaction of transactions) {
        const detail = document.createElement("li");

        detail.textContent = `${transaction.type}: ${formatCurrency(transaction.amount)} -- DATE: ${formatDate(transaction.date)} -- BALANCE: ${formatCurrency(transaction.balanceAfter)}`;

        transactionList.appendChild(detail);
    }
}

function addTransaction(type, amount) {
    const transaction = {
        type,
        amount,
        date: new Date(),
        balanceAfter: currentAccount.balance
    };

    transactions.push(transaction);
    renderTransactions();
}

function formatDate(date) {
    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric"
    });
}

function saveData() {
    localStorage.setItem(
        "userAccount",
        JSON.stringify(currentAccount)
    );

    localStorage.setItem(
        "userTransactions",
        JSON.stringify(transactions)
    );
}

function loadData() {
    const savedAccount = localStorage.getItem("userAccount");
    const savedTransactions = localStorage.getItem("userTransactions");

    if (!savedAccount) {
        accountSetup.hidden = false;
        dashboard.hidden = true;
        return;
    }

    const accountData = JSON.parse(savedAccount);

    currentAccount = new BankAccount(
        accountData.accountNumber,
        accountData.accountHolder,
        accountData.balance,
        accountData.sortCode
    );

    const parsedTransactions = savedTransactions
        ? JSON.parse(savedTransactions)
        : [];

    transactions.length = 0;

    for (const transaction of parsedTransactions) {
        transactions.push({
            ...transaction,
            date: new Date(transaction.date)
        });
    }

    accountHolder.textContent = currentAccount.accountHolder;
    accountNumber.textContent = currentAccount.accountNumber;
    sortCode.textContent = currentAccount.sortCode;
    accountBalance.textContent = formatCurrency(currentAccount.balance);

    accountSetup.hidden = true;
    dashboard.hidden = false;

    renderTransactions();
}
let notificationTimer;

function showNotification(message, type) {
    clearTimeout(notificationTimer);

    notification.textContent = message;
    notification.hidden = false;

    notification.classList.remove("success", "error");
    notification.classList.add(type);
    notification.classList.add("show");

    notificationTimer = setTimeout(() => {
        notification.classList.remove("show");

        setTimeout(() => {
            notification.hidden = true;
        }, 300);
    }, 3000);
}

depositForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const amount = depositAmount.valueAsNumber;

    if (!Number.isFinite(amount) || amount <= 0) {
        showNotification("Enter a valid deposit amount", "error");
        return;
    }

    currentAccount.deposit(amount);
    addTransaction("DEPOSIT", amount);

    accountBalance.textContent = formatCurrency(currentAccount.balance);

    depositAmount.value = "";
    saveData();
    showNotification(`${formatCurrency(amount)} deposited successfully`, "success");
});

withdrawForm.addEventListener("submit", (e)=>{
    e.preventDefault();

    const amount = withdrawAmount.valueAsNumber;
    const currentBalance = currentAccount.balance;

    if (!Number.isFinite(amount) || amount <= 0) {
        showNotification("Enter a valid withdrawal amount", "error");
        return;
    }
    if (amount > currentBalance) {
        showNotification("Insufficient funds for this withdrawal","error");
        return;
    }

    currentAccount.withdraw(amount);
    addTransaction("WITHDRAWAL", amount);

    accountBalance.textContent = formatCurrency(currentAccount.balance);

    withdrawAmount.value = "";
    saveData();
    showNotification(`${formatCurrency(amount)} withdrawn successfully`, "success");
});

resetAcct.addEventListener("click", () => {
    accountSetup.hidden = false;
    dashboard.hidden = true;

    currentAccount = null;
    transactions.length = 0;

    transactionList.innerHTML = "";

    createUserInput.value = "";
    depositAmount.value = "";
    withdrawAmount.value = "";

    accountHolder.textContent = "";
    accountNumber.textContent = "";
    sortCode.textContent = "";
    accountBalance.textContent = "";

    closeTransactionForm(depositForm, showDepositBtn);
    closeTransactionForm(withdrawForm, showWithdrawBtn);
    localStorage.removeItem("userAccount");
    localStorage.removeItem("userTransactions");

    showNotification("Account reset successfully", "success");
});

loadData();