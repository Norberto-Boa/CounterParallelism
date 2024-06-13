import readline from "readline-sync";

let Cashiers = Number(readline.question('How many cashier your store has: '));
let WorkHours = Number(readline.question('How many work hours your store has: '));
let MaxClients = Number(readline.question('How many clients your store can handle per hour: '));

/**
 * 
 * @param {number} Cashiers 
 * @param {number} workHours 
 * @param {number} maxClients 
 */
function CashierConsumption(cashiers, workHours, maxClients) {
  const CashierConsumptionResult = cashiers * maxClients * workHours;
  return CashierConsumptionResult;
}

const TotalClients = CashierConsumption(Cashiers, WorkHours, MaxClients);

function EachCashierConsumptionPerHour(workHours, cashiers) {
  const clientsPerCashier = TotalClients / cashiers;
  const clientsPerCashierPerHour = clientsPerCashier / workHours

  return clientsPerCashierPerHour;
}

const ClientsPerHour = EachCashierConsumptionPerHour(WorkHours, Cashiers);

console.log(`The store can handle ${TotalClients} clients over the period of ${WorkHours} hours.`);
console.log(`Each cashier can handle ${ClientsPerHour} clients over the period of 1 hour.`);

