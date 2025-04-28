// clear.js
const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function clearDatabase() {
  console.log('\x1b[31m%s\x1b[0m', 'WARNING: This will delete ALL data from your database!');
  console.log('This action cannot be undone.');
  
  // Get models directly from Prisma
  const modelNames = Object.keys(prisma).filter(key => 
    !key.startsWith('_') && 
    !key.startsWith('$') && 
    typeof prisma[key] === 'object'
  );
  
  console.log('\nThe following tables will be cleared:');
  modelNames.forEach(modelName => {
    console.log(`- ${modelName}`);
  });

  return new Promise((resolve) => {
    rl.question('\nType "DELETE ALL DATA" to confirm: ', async (answer) => {
      if (answer === 'DELETE ALL DATA') {
        console.log('Deleting all data...');
        
        try {
          // Disable foreign key checks temporarily
          await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
          
          // Delete data from each table
          for (const modelName of modelNames) {
            try {
              const deleteCount = await prisma[modelName].deleteMany({});
              console.log(`Deleted ${deleteCount.count} records from ${modelName}`);
            } catch (err) {
              console.log(`Error deleting from ${modelName}: ${err.message}`);
            }
          }
          
          // Re-enable foreign key checks
          await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
          
          console.log('\x1b[32m%s\x1b[0m', 'Database content has been successfully deleted.');
          resolve(true);
        } catch (error) {
          console.error('\x1b[31m%s\x1b[0m', 'Error during deletion process:');
          console.error(error);
          resolve(false);
        }
      } else {
        console.log('Operation cancelled. No data was deleted.');
        resolve(false);
      }
      rl.close();
    });
  });
}

// Run the function
clearDatabase()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });