const pgConfig = {
  host: process.env.FIF_DBSERVER || '127.0.0.1',
  user: process.env.FIF_USER || 'postgres',
  password: process.env.FIF_PASSWORD || 'p@ssw0rd',
  database: process.env.FIF_DBNAME || 'FixItFriday',
  max: parseInt(process.env.FIF_MAX || 20, 10),
  idleTimeoutMillis: parseInt(process.env.FIF_IDLETIMEOUTMILLIS || 5000, 10),
  connectionTimeoutMillis: parseInt(process.env.FIF_CONNECTIONTIMEOUTMILLIS || 2000, 10),
};

const mssqlConfig = {
  server: process.env.ODS_SERVER,
  database: process.env.ODS_DBNAME,
  user: process.env.ODS_USER,
  password: process.env.ODS_PASSWORD,
  port: parseInt(process.env.ODS_PORT, 10),
  authentication: {
    type: 'default',
    options: {
      userName: process.env.ODS_USER || 'ods_user',
      password: process.env.ODS_PASSWORD || 'p@ssw0rd',
    },
  },
  options: {
    port: parseInt(process.env.ODS_PORT, 10),
    trustServerCertificate: process.env.ODS_TRUSTSERVERCERTIFICATE === 'true',
    enableArithAbort: process.env.ODS_ENABLEARITHABORT === 'true',
    database: process.env.ODS_DBNAME,
    encrypt: process.env.ODS_ENCRYPT === 'true',
  },
  connectionTimeout: 30000,
  requestTimeout: 0,
  pool: {
    idleTimeoutMillis: 30000,
    max: 100,
  },
};

exports.pgConfig = pgConfig;
exports.mssqlConfig = mssqlConfig;
