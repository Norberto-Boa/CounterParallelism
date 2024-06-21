const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const path = require('path');
const os = require('os');

class Store {
  constructor(id, capacity) {
    this.id = id;
    this.capacity = capacity;
    this.customers = [];
  }

  addCustomer(customer) {
    if (this.customers.length < this.capacity) {
      this.customers.push(customer);
      return true;
    } else {
      return false;
    }
  }

  getStatus() {
    return {
      storeId: this.id,
      customersCount: this.customers.length,
      remainingCapacity: this.capacity - this.customers.length
    };
  }
}

class QueueManagementSystem {
  constructor(storeCount, storeCapacity) {
    this.stores = [];
    for (let i = 0; i < storeCount; i++) {
      this.stores.push(new Store(i + 1, storeCapacity));
    }
    this.logTable = [];
  }

  addCustomer(customer, storeId) {
    const store = this.stores.find(store => store.id === storeId);
    if (store && store.addCustomer(customer)) {
      const logEntry = { Customer: customer, Store: store.id };
      this.logTable.push(logEntry);
      return `Customer ${customer} assigned to store ${store.id}`;
    } else {
      return `All stores are full. Customer ${customer} cannot be assigned.`;
    }
  }

  getStatus() {
    return this.stores.map(store => store.getStatus());
  }

  printLog() {
    console.table(this.logTable);
  }
}

const totalCustomers = 50000;
const storeCount = 5;
const storeCapacity = 10000;
const numWorkers = os.cpus().length;

if (isMainThread) {
  const queueSystem = new QueueManagementSystem(storeCount, storeCapacity);

  // Function to handle customer allocation
  function allocateCustomers(start, end) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(path.resolve(__dirname, 'worker.js'), {
        workerData: { start, end, storeCount }
      });
      worker.on('message', (allocations) => {
        for (let { customer, storeId } of allocations) {
          queueSystem.addCustomer(customer, storeId);
        }
        resolve();
      });
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  // Split the customers among workers
  const customersPerWorker = Math.ceil(totalCustomers / numWorkers);
  const promises = [];

  for (let i = 0; i < numWorkers; i++) {
    const start = i * customersPerWorker + 1;
    const end = Math.min(start + customersPerWorker - 1, totalCustomers);
    promises.push(allocateCustomers(start, end));
  }

  Promise.all(promises).then(() => {
    queueSystem.printLog();
    console.log(queueSystem.getStatus());
  }).catch((err) => {
    console.error(err);
  });
} else {
  // Worker thread logic
  const { start, end, storeCount } = workerData;
  const results = [];
  for (let i = start; i <= end; i++) {
    const storeId = (i % storeCount) + 1;
    results.push({ customer: i, storeId });
  }
  parentPort.postMessage(results);
}
