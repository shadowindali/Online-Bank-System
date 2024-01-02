const sql = require("mssql");

const config = {
  user: "mon",
  password: "123456",
  server: "DESKTOP-NIE11IJ\\SQLEXPRESS",
  database: "Bank",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(config);

// Use async/await or promises
async function connectDatabase() {
  try {
    await pool.connect();
    console.log("Connected to Database");
  } catch (err) {
    console.error("Error while connecting to SQL Server:", err);
    throw err;
  }
}

// Connect to the database when the module is loaded
connectDatabase();

module.exports = {
  pool,
  connectDatabase, // Export the connectDatabase function
};
