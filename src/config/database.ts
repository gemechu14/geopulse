import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';

// Get PostgreSQL connection details from environment
const postgresConfig = {
  database: process.env.POSTGRES_DB || 'geopulse',
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'pass1',
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
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/geopulse';

const connectMongoDB = async (): Promise<void> => {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log(`   URI: ${mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@')}`); // Mask password in URI
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error: any) {
    console.error('❌ MongoDB connection error:');
    console.error(`   Error: ${error.message}`);
    console.error(`   URI: ${mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@')}`);
    console.error('\n💡 Troubleshooting tips:');
    console.error('   1. Check if MongoDB is running');
    console.error('   2. Verify MONGODB_URI in your .env file');
    console.error('   3. Check MongoDB connection string format');
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
    
    console.error('\n📋 Connection Details Used:');
    console.error(`   Host: ${postgresConfig.host}`);
    console.error(`   Port: ${postgresConfig.port}`);
    console.error(`   Database: ${postgresConfig.database}`);
    console.error(`   Username: ${postgresConfig.username}`);
    console.error(`   Password: ${postgresConfig.password || 'NOT SET'} (⚠️  Shown for debugging)`);
    
    console.error('\n💡 Troubleshooting tips:');
    console.error('   1. Verify PostgreSQL is running:');
    console.error('      Windows: Check Services or run: pg_isready');
    console.error('      Linux/Mac: sudo systemctl status postgresql or: pg_isready');
    console.error('   2. Check your .env file has correct credentials:');
    console.error(`      POSTGRES_HOST=${postgresConfig.host}`);
    console.error(`      POSTGRES_PORT=${postgresConfig.port}`);
    console.error(`      POSTGRES_DB=${postgresConfig.database}`);
    console.error(`      POSTGRES_USER=${postgresConfig.username}`);
    console.error(`      POSTGRES_PASSWORD=${postgresConfig.password || 'YOUR_PASSWORD_HERE'}`);
    console.error('   3. Test connection manually:');
    console.error(`      psql -h ${postgresConfig.host} -p ${postgresConfig.port} -U ${postgresConfig.username} -d ${postgresConfig.database}`);
    console.error('   4. Verify the database exists:');
    console.error(`      CREATE DATABASE ${postgresConfig.database};`);
    console.error('   5. Reset PostgreSQL password (if needed):');
    console.error('      ALTER USER ' + postgresConfig.username + ' WITH PASSWORD \'your_new_password\';');
    console.error('   6. Check pg_hba.conf allows password authentication');
    
    process.exit(1);
  }
};

export { sequelize, connectPostgreSQL, connectMongoDB };

