const sql = require("mssql/msnodesqlv8");

const config = {
    server: "LAPTOP-F034OADN\\SQLEXPRESS",
    database: "StudentManagement",

    driver: "ODBC Driver 18 for SQL Server",

    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("SQL Server connected successfully!");
        return pool;
    })
    .catch(err => {
        console.error("Database connection failed:");
        console.error(err.message);
        throw err;
    });

module.exports = {
    sql,
    poolPromise
};