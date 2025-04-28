// utils/resetDatabase.js
const { exec } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
      resolve(stdout);
    });
  });
}

async function resetDatabase() {
  console.log('\x1b[33m%s\x1b[0m', '=== Database Management Tool ===');
  console.log('Select an option:');
  console.log('1. Complete Reset (drop all tables and reapply migrations)');
  console.log('2. Re-seed Only (keep schema, just insert demo data)');
  console.log('3. Cancel');

  rl.question('\nEnter your choice (1-3): ', async (answer) => {
    try {
      if (answer === '1') {
        console.log('\x1b[31m%s\x1b[0m', 'WARNING: This will drop all tables and data!');
        rl.question('Type "RESET" to confirm: ', async (confirmation) => {
          if (confirmation === 'RESET') {
            console.log('\nResetting database...');
            await runCommand('npx prisma migrate reset --force');
            console.log('\x1b[32m%s\x1b[0m', 'Database reset complete!');
          } else {
            console.log('Reset cancelled.');
          }
          rl.close();
        });
      } else if (answer === '2') {
        console.log('\nRe-seeding database with demo data...');
        await runCommand('node utills/insertDemoData.js');
        console.log('\x1b[32m%s\x1b[0m', 'Database re-seeding complete!');
        rl.close();
      } else {
        console.log('Operation cancelled.');
        rl.close();
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', 'An error occurred:');
      console.error(error);
      rl.close();
    }
  });
}

// Run the script if it's called directly
if (require.main === module) {
  resetDatabase();
}

module.exports = { resetDatabase };