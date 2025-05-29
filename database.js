require("dotenv").config();

const { Sequelize } = require("sequelize");

// // // // in Sequelize(database name, username, password)
<<<<<<< Updated upstream
// const sequelize = new Sequelize("ERP_DB", "postgres", "1234", {
//   host: "localhost",
//   dialect: "postgres",
//   port: 5432,
//   omitNull: true,
// });

const sequelize = new Sequelize(process.env.POSTGRESQL_HOST, {
=======
const sequelize = new Sequelize("ERP_DB_LOCAL", "postgres", "1234", {
  host: "localhost",
>>>>>>> Stashed changes
  dialect: "postgres",
  port: 5432,
  omitNull: true,
});

// const sequelize = new Sequelize(process.env.POSTGRESQL_HOST, {
//   dialect: "postgres",
//   omitNull: true,
//   dialectoptions: {
//     ssl: true,
//   },
// });

module.exports = sequelize;
