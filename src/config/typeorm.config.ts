import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: dbPort,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
});
