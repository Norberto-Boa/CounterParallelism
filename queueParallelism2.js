function processCustomer(id, counter) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    console.log(`Customer ${id} starts processing at counter ${counter}`);
    setTimeout(() => {
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      console.log(`Customer ${id} finished processing at counter ${counter} (${unixToTime(startTime)})`);
      resolve(`Customer ${id}`);
    }, 1000);  // Assuming each customer takes 1 second to process
  });
}

function unixToTime(timestamp) {
  const date = new Date(timestamp)

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  const time = `${hours}:${minutes}:${seconds}`;

  return time;
}

async function processInBatches(customers, batchSize) {
  for (let i = 0; i < customers.length; i += batchSize) {
    const batch = customers.slice(i, i + batchSize);
    await Promise.all(batch.map((customer, index) => processCustomer(customer, index + 1)));
  }
}

async function main() {
  const customers = Array.from({ length: 30 }, (_, i) => i + 1);
  const batchSize = 4;
  await processInBatches(customers, batchSize);
  console.log('All customers processed');
}

main().catch(console.error);