// models/index.js

const sequelize = require("../database");

// --- Import All Models ---
const { User, Role } = require("./userModel");
const { Business, Bank } = require("./quotationModel");
const { Employee, Position, Salary_pay, Department, Leaving, Overtime } = require("./employeeModel");

// --- Define All Associations ---

// User <-> Role
User.belongsTo(Role, { foreignKey: "RoleID" });
Role.hasMany(User, { foreignKey: "RoleID" });

// User <-> Business
User.belongsTo(Business, { foreignKey: "bus_id" });
Business.hasMany(User, { foreignKey: "bus_id" });

// Business <-> Bank
Business.belongsTo(Bank, { foreignKey: "bank_id" });
Bank.hasOne(Business, { foreignKey: "bank_id" }); // หรือ hasMany ถ้า 1 bank ใช้ได้หลาย business

// Employee <-> Position
Employee.belongsTo(Position, { foreignKey: "position_id" });
Position.hasMany(Employee, { foreignKey: "position_id" });

// Employee <-> Department
Employee.belongsTo(Department, { foreignKey: "department_id" });
Department.hasMany(Employee, { foreignKey: "department_id" });

// Employee <-> Business
Employee.belongsTo(Business, { foreignKey: "bus_id" });
Business.hasMany(Employee, { foreignKey: "bus_id" });

// Employee <-> Leaving
Employee.hasMany(Leaving, { foreignKey: "employee_id" });
Leaving.belongsTo(Employee, { foreignKey: "employee_id" });

// Employee <-> Overtime
Employee.hasMany(Overtime, { foreignKey: "employee_id" });
Overtime.belongsTo(Employee, { foreignKey: "employee_id" });

// Employee <-> Salary_pay
Employee.hasMany(Salary_pay, { foreignKey: "employee_id" });
Salary_pay.belongsTo(Employee, { foreignKey: "employee_id" });

// Business Associations
Business.hasMany(Department, { foreignKey: "bus_id" });
Business.hasMany(Position, { foreignKey: "bus_id" });
Business.hasMany(Salary_pay, { foreignKey: "bus_id" });

// Other associations
Department.belongsTo(Business, { foreignKey: "bus_id" });
Position.belongsTo(Business, { foreignKey: "bus_id" });
Salary_pay.belongsTo(Business, { foreignKey: "bus_id" });


// --- Export Everything ---
module.exports = {
  sequelize,
  User,
  Role,
  Business,
  Bank,
  Employee,
  Position,
  Salary_pay,
  Department,
  Leaving,
  Overtime,
};