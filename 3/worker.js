const { parentPort, workerData } = require('worker_threads');

// Worker thread logic
const { start, end, storeCount } = workerData;
const results = [];
for (let i = start; i <= end; i++) {
  const storeId = (i % storeCount) + 1;
  results.push({ customer: i, storeId });
}
parentPort.postMessage(results);
