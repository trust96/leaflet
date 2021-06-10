import { DataTypes } from "sequelize";
import { sequelize } from "../connection";

export const Vehicle = sequelize.define("vehicle", {
  latitude: { type: DataTypes.REAL, allowNull: false },
  longitude: { type: DataTypes.REAL, allowNull: false },
  heading: { type: DataTypes.INTEGER, allowNull: false },
  dateTime: { type: DataTypes.INTEGER, allowNull: false },
});
