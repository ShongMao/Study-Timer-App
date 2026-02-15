import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// console.log("Connecting with:", {
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   db: process.env.MYSQL_DB,
// });

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST!,
  port: Number(process.env.MYSQL_PORT!),
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DB!,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// const dbUrl = new URL("mysql://root:uzOFBaCUtbARoNPQAyYFTnLrfEfXtDUC@yamanote.proxy.rlwy.net:46501/railway");

// export const pool = mysql.createPool({
//   host: dbUrl.hostname,                  // yamanote.proxy.rlwy.net
//   port: parseInt(dbUrl.port),            // 46501
//   user: dbUrl.username,                  // root
//   password: dbUrl.password,              // uzOFBaCUtbARoNPQAyYFTnLrfEfXtDUC
//   database: dbUrl.pathname.replace("/", ""), // railway
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });