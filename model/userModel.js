const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const User = sequelize.define(
  "users",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    access_token: {
      type: DataTypes.STRING,
    },
    token_create: {
      type: DataTypes.STRING,
    },
    bus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const Role = sequelize.define(
  "roles",
  {
    role_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const UserActivity = sequelize.define(
  "UserActivities",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activityType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    routeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = { User, Role, UserActivity };
