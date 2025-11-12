import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';

// Get PostgreSQL connection details from environment
const postgresConfig = {
  database: process.env.POSTGRES_DB || 'geopulse',
  username: process.env.POSTGRES_USER || '',
  password: process.env.POSTGRES_PASSWORD || '',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
};

// PostgreSQL Connection (Sequelize)
const sequelize = new Sequelize(
  postgresConfig.database,
  postgresConfig.username,
  postgresConfig.password,
  {
    host: postgresConfig.host,
    port: postgresConfig.port,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// MongoDB Connection (Mongoose)
const mongoUri = process.env.MONGODB_URI || '';

const connectMongoDB = async (): Promise<void> => {
  try {

    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error: any) {
    
    process.exit(1);
  }
};

const connectPostgreSQL = async (): Promise<void> => {
  try {
    console.log('🔌 Attempting to connect to PostgreSQL...');
    console.log(`   Host: ${postgresConfig.host}`);
    console.log(`   Port: ${postgresConfig.port}`);
    console.log(`   Database: ${postgresConfig.database}`);
    console.log(`   Username: ${postgresConfig.username}`);
    if (process.env.NODE_ENV === 'development') {
      console.log(`   Password: ${postgresConfig.password || 'NOT SET'} (⚠️  DEBUG MODE - Remove in production)`);
    } else {
      console.log(`   Password: ${postgresConfig.password ? '***' + postgresConfig.password.slice(-2) : 'NOT SET'}`);
    }
    
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
  } catch (error: any) {
    console.error('\n❌ PostgreSQL connection error:');
    console.error(`   Error Code: ${error.code || 'N/A'}`);
    console.error(`   Error Message: ${error.message || error}`);
    
    
    
    process.exit(1);
  }
};

export { sequelize, connectPostgreSQL, connectMongoDB };

