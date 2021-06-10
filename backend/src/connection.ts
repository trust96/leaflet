import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("postgres", "postgres", "211996", {
  dialect: "postgres",
  host: "localhost",
});

(async () => {
  try {
    await sequelize.sync();
  } catch (error) {
    console.error(error.message);
  }
})();
