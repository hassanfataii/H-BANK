export class BankAccount{
    constructor (accountNumber, accountHolder, balance, sortCode){
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.balance = balance;
        this.sortCode = sortCode;
    }

    deposit(amount){
        this.balance = amount + this.balance;
        return this.balance;
    }

    withdraw(amount){
        if (this.balance < amount) {
            return "Insufficient funds";
        }
        
        this.balance = this.balance - amount;
        return this.balance;
    }
}