const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const { Business } = require("./quotationModel");

const Employee = sequelize.define(
  "employees",
  {
    employee_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    national_id_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_working_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Salary: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    employeeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bankAccountID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PositionID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    departmentID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const Position = sequelize.define(
  "positions",
  {
    PositionID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const Salary_pay = sequelize.define(
  "salary_payments",
  {
    payment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    round: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const Leaving = sequelize.define(
  "leavings",
  {
    leaving_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date_start: {
      type: 'timestamp without time zone',
      allowNull: false,
    },
    date_end: {
      type: 'timestamp without time zone',
      allowNull: false,
    },
    detail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const Overtime = sequelize.define(
  "overtimes",
  {
    overtime_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    detail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    total: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const Department = sequelize.define(
  "departments",
  {
    departmentID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    departmentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Employee.belongsTo(Position, { foreignKey: "PositionID" });
Position.hasMany(Employee, { foreignKey: "PositionID" });

Employee.belongsTo(Business, { foreignKey: "bus_id" });
Business.hasMany(Employee, { foreignKey: "bus_id" });

Employee.belongsTo(Position, { foreignKey: "PositionID" });
Position.hasMany(Employee, { foreignKey: "PositionID" });

Employee.belongsTo(Department, { foreignKey: "departmentID" });
Department.hasMany(Employee, { foreignKey: "departmentID" });

module.exports = {
  Employee,
  Position,
  Salary_pay,
  Department,
  Leaving,
  Overtime,
};
