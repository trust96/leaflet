import { DataTypes, Sequelize } from "sequelize";
import sequelize from "./connection";

const Vehicle = sequelize.define("vehicle", {
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  dateTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn("NOW"),
  },
});
export default Vehicle;
