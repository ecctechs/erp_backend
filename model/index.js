// models/index.js

const sequelize = require("../database"); // Import Sequelize instance ของคุณ
const { Employee, Position, Salary_pay, Department, Leaving, Overtime } = require("./employeeModel");
const { Business } = require("./quotationModel");

// --- กำหนดความสัมพันธ์ทั้งหมดที่นี่ ---

// Employee Relationships
Employee.belongsTo(Position, { foreignKey: "position_id" });
Employee.belongsTo(Department, { foreignKey: "department_id" });
Employee.belongsTo(Business, { foreignKey: "bus_id" });
Employee.hasMany(Leaving, { foreignKey: "employee_id" });
Employee.hasMany(Overtime, { foreignKey: "employee_id" });
Employee.hasMany(Salary_pay, { foreignKey: "employee_id" });


// Position Relationships
Position.hasMany(Employee, { foreignKey: "position_id" });
Position.belongsTo(Business, { foreignKey: "bus_id" });

// Department Relationships
Department.hasMany(Employee, { foreignKey: "department_id" });
Department.belongsTo(Business, { foreignKey: "bus_id" });

// Business Relationships
Business.hasMany(Employee, { foreignKey: "bus_id" });
Business.hasMany(Department, { foreignKey: "bus_id" });
Business.hasMany(Position, { foreignKey: "bus_id" });
Business.hasMany(Salary_pay, { foreignKey: "bus_id" });


// Salary_pay Relationships
Salary_pay.belongsTo(Employee, { foreignKey: "employee_id" });
Salary_pay.belongsTo(Business, { foreignKey: "bus_id" });


// Leaving Relationships
Leaving.belongsTo(Employee, { foreignKey: "employee_id" });


// Overtime Relationships
Overtime.belongsTo(Employee, { foreignKey: "employee_id" });


// Export ทุกอย่างออกไปใช้งาน
module.exports = {
  sequelize,
  Employee,
  Position,
  Salary_pay,
  Department,
  Leaving,
  Overtime,
  Business,
};