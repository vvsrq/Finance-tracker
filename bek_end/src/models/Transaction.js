class Transaction {
    constructor(amount, date, category, description) {
      this.amount = amount;
      this.date = date;
      this.category = category;
      this.description = description;
    }
  }
  
module.exports = Transaction;