import { Sequelize } from "sequelize";

const sequelize = new Sequelize("postgres", "postgres", "211996", {
  host: "localhost",
  dialect: "postgres" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
});
// (async () => {
//   try {
//     await sequelize.sync({ force: true });
//   } catch (err) {
//     console.error(err.message);
//   }
// })();
export default sequelize;
