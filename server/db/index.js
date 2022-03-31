const { Pool } = require("pg");
const chalk = require("chalk");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

pool.connect((err, client) => {
  if (!err) {
    console.log(
      `${chalk.green(`Database connected on  : `)}${chalk.yellow(
        `postgresql://${client.user}:[PASSWORD]@${client.host}:${client.port}/${client.database}?sslmode=disable`
      )}\n`
    );
  } else {
    console.log("Error: ", err);
  }
});

const query = (queryString, queryParams) => {
  // console.log("Query String: ", queryString);
  // console.log("Query Params: ", queryParams);
  return pool.query(queryString, queryParams);
};

module.exports = {
  query,
};
