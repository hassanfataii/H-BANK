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
        createUserInput.setAttribute("placeholder", "Cannot leave name empty");
        return;
    }
    accountSetup.hidden = true;
    dashboard.hidden = false;

    const userName = createUserInput.value.trim();
    const generatedAcctNumber = genAccountNumber();
    const generatedsortCode = genSortCode();
    const generatedBalance = genBalance();

    currentAccount = new BankAccount(generatedAcctNumber, userName, generatedBalance, generatedsortCode);

    accountHolder.textContent = currentAccount.accountHolder;
    accountNumber.textContent = currentAccount.accountNumber;
    sortCode.textContent = currentAccount.sortCode;
    accountBalance.textContent = formatCurrency(currentAccount.balance);
});
