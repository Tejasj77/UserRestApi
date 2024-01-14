import dotenv from "dotenv";

dotenv.config();

let MYSQL_DB_PORT = parseInt(process.env.MYSQL_DB_PORT!) || 3306;
let MYSQL_DB_DATABASE = process.env.MYSQL_DB_DATABASE || "mydb";
let MYSQL_DB_HOSTNAME = "localhost";
let MYSQL_DB_USER = "root";

let MYSQL = {
  host: MYSQL_DB_HOSTNAME,
  db: MYSQL_DB_DATABASE,
  port: MYSQL_DB_PORT,
  user: MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
};
let SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";

let SERVER = {
  host: SERVER_HOSTNAME,
  port: process.env.PORT,
};
const ENV = process.env;
let config = {
  isDev: ENV.NODE_ENV !== "production",
  isProd: ENV.NODE_ENV === "production",
  mysql: MYSQL,
  server: SERVER,
};

export default config;
