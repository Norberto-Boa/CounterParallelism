function processCustomer(id, counter) {
  return new Promise((resolve) => {
    console.log(`Customer ${id} starts processing at counter ${counter}`);
    setTimeout(() => {
      console.log(`Customer ${id} finished processing at counter ${counter}`);
      resolve(`Customer ${id}`);
    }, 1000);  // Assuming each customer takes 1 second to process
  });
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
