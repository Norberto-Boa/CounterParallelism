// Customer gets ID and time from 1 to 10 minutes
class Customer {
  constructor(id) {
    this.id = id;
    this.processTime = Math.floor(Math.random() * 10) + 1;
  }
}


// Simulate self checkout
class SelfCheckout {
  constructor(numMachines) {
    this.numMachines = numMachines;
    // machine is free and receive a customer object when occupied
    this.machines = new Array(numMachines).fill(null);
  }

  process(customers) {
    let time = 0;
    let queue = [...customers];
    // run ultill queue is empty and machines are free
    while (queue.length > 0 || this.machines.some(machine => machine !== null)) {
      for (let i = 0; i < this.numMachines; i++) {
        if (this.machines[i] === null && queue.length > 0) {
          this.machines[i] = queue.shift();
        }
      }
      // time customer takes on machine
      for (let i = 0; i < this.numMachines; i++) {
        if (this.machines[i] !== null) {
          this.machines[i].processTime -= 1;
          if (this.machines[i].processTime <= 0) {
            this.machines[i] = null;
          }
        }
      }
      time += 1;
    }
    return time;
  }
}

class TraditionalCheckout {
  constructor(numLanes) {
    this.numLanes = numLanes;
    this.lanes = new Array(numLanes).fill(null).map(() => []);
  }

  process(customers) {
    let time = 0;
    let queue = [...customers];
    while (queue.length > 0 || this.lanes.some(lane => lane.length > 0)) {
      for (let i = 0; i < this.numLanes; i++) {
        if (this.lanes[i].length === 0 && queue.length > 0) {
          this.lanes[i].push(queue.shift());
        }
        if (this.lanes[i].length > 0) {
          this.lanes[i][0].processTime -= 1;
          if (this.lanes[i][0].processTime <= 0) {
            this.lanes[i].shift();
          }
        }
      }
      time += 1;
    }
    return time;
  }
}

// Simulation
const numCustomers = 20;
const customers = Array.from({ length: numCustomers }, (_, id) => new Customer(id));

const selfCheckout = new SelfCheckout(5);
const traditionalCheckout = new TraditionalCheckout(3);

const selfCheckoutTime = selfCheckout.process(customers);
const traditionalCheckoutTime = traditionalCheckout.process(customers);

console.log(`Time taken in self-checkout: ${selfCheckoutTime} units`);
console.log(`Time taken in traditional checkout: ${traditionalCheckoutTime} units`);