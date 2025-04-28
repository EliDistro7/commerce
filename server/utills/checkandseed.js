// utills/checkAndSeedDatabase.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAndSeedDatabase() {
  console.log('Checking database structure before seeding...');
  
  try {
    // First, check if tables exist by attempting to count records
    // This will throw an error if tables don't exist
    const tables = [
      'category',
      'product',
      'user',
      // Add other tables from your schema here
    ];
    
    const missingTables = [];
    
    for (const table of tables) {
      try {
        // Try to access each table
        await prisma.$executeRawUnsafe(`SELECT COUNT(*) FROM \`${table}\``);
        console.log(`✅ Table '${table}' exists`);
      } catch (error) {
        console.log(`❌ Table '${table}' is missing`);
        missingTables.push(table);
      }
    }
    
    if (missingTables.length > 0) {
      console.log('\n❌ Some tables are missing. Running migrations first...');
      
      // Try to run migrations
      const { exec } = require('child_process');
      
      return new Promise((resolve, reject) => {
        exec('npx prisma migrate deploy', async (error, stdout, stderr) => {
          if (error) {
            console.error('Migration failed:', error);
            console.log('\nTrying to create tables directly from schema...');
            
            try {
              await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
              await prisma.$executeRawUnsafe(`
                CREATE TABLE IF NOT EXISTS category (
                  id VARCHAR(191) PRIMARY KEY,
                  name VARCHAR(255) NOT NULL,
                  description TEXT,
                  image VARCHAR(255),
                  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
                  updatedAt DATETIME(3)
                );
              `);
              // Add more CREATE TABLE statements for other tables
              await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
              
              console.log('Tables created directly. Now running seed...');
              await runSeed();
              resolve();
            } catch (dbError) {
              console.error('Failed to create tables directly:', dbError);
              reject(dbError);
            }
          } else {
            console.log(stdout);
            console.log('Migrations applied successfully. Now running seed...');
            await runSeed();
            resolve();
          }
        });
      });
    } else {
      console.log('\n✅ All tables exist. Running seed directly...');
      await runSeed();
    }
  } catch (error) {
    console.error('Error checking database structure:', error);
    throw error;
  }
}

async function runSeed() {
  try {
    console.log('Running seed script...');
    // Import and run your existing seed logic
    const { seedData } = require('./insertDemoData');
    await seedData();
    console.log('✅ Seed completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  checkAndSeedDatabase()
    .then(() => {
      console.log('Process completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Process failed:', error);
      process.exit(1);
    });
}

module.exports = { checkAndSeedDatabase };