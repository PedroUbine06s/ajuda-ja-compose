import { DatabaseSeeder } from "./seeders";
import AppDataSource from '../config/typeorm.config'

async function runSeeder() {
  try {
    console.log('📦 Connecting to database...');
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully!');

    await DatabaseSeeder.run(AppDataSource);  // This should work now

    await AppDataSource.destroy();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

runSeeder();
