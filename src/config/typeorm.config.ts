import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: process.env.NODE_ENV === 'development',
};

// Create a new DataSource instance
const dataSource = new DataSource(typeOrmConfig);

export const initializeDatabaseConnection = async () => {
  try {
    await dataSource.initialize();
    console.log('Connected to the database successfully!');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

export default dataSource;
