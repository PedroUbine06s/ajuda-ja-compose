import { DataSource } from "typeorm";
import { ServiceSeeder } from "./service.seeder";

export class DatabaseSeeder {
  public static async run(dataSource: DataSource): Promise<void> {
    console.log('Starting database seeding...');

    await ServiceSeeder.run(dataSource);

    console.log('Database seeding completed successfully!');
  }
}
