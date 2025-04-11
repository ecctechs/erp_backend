const express = require("express");
const Route = express.Router();
const RouteName = "/employee";
const {
  verifyTokenWithRole,
  logUserActivity,
  verifyTokenWithbusiness_id,
} = require("../middleware/verifytokenwithrole");

const EmployeeController = require("../controllers/EmployeeController");

Route.get(
  RouteName + "/getEmployee",
  verifyTokenWithbusiness_id,
  EmployeeController.getEmployee
);
Route.post(
  RouteName + "/AddEmployee",
  verifyTokenWithbusiness_id,
  EmployeeController.AddEmployee
);
Route.put(RouteName + "/EditEmployee/:id", EmployeeController.EditEmployee);
Route.delete(
  RouteName + "/DeleteEmployee/:id",
  EmployeeController.DeleteEmployee
);
Route.post(
  RouteName + "/AddDepartment",
  verifyTokenWithbusiness_id,
  EmployeeController.AddDepartment
);
Route.put(RouteName + "/EditDepartment/:id", EmployeeController.EditDepartment);
Route.delete(
  RouteName + "/DeleteDepartment/:id",
  EmployeeController.DeleteDepartment
);
Route.get(
  RouteName + "/getDepartment",
  verifyTokenWithbusiness_id,
  EmployeeController.getDepartment
);
Route.get(
  RouteName + "/getPayment",
  verifyTokenWithbusiness_id,
  verifyTokenWithRole(["SUPERUSER", "MANAGER", "SALE"]),
  EmployeeController.getPayment
);
Route.get(
  RouteName + "/getEmployeeSalary",
  verifyTokenWithbusiness_id,
  verifyTokenWithRole(["SUPERUSER", "MANAGER", "SALE"]),
  EmployeeController.getEmployeeSalary
);
Route.put(RouteName + "/EditSalary/:id", EmployeeController.EditSalary);

Route.delete(RouteName + "/DeleteSalary/:id", EmployeeController.DeleteSalary);
Route.get(
  RouteName + "/getEmployeeQuotation",
  verifyTokenWithbusiness_id,
  verifyTokenWithRole(["SUPERUSER", "MANAGER", "SALE"]),
  EmployeeController.getEmployeeQuotation
);
Route.post(
  RouteName + "/AddPosition",
  verifyTokenWithbusiness_id,
  EmployeeController.AddPosition
);
Route.put(RouteName + "/EditPosition/:id", EmployeeController.EditPosition);
Route.delete(
  RouteName + "/DeletePosition/:id",
  EmployeeController.DeletePosition
);
Route.get(
  RouteName + "/getPosition",
  verifyTokenWithbusiness_id,
  EmployeeController.getPosition
);
Route.post(
  RouteName + "/AddPayment",
  verifyTokenWithbusiness_id,
  EmployeeController.AddPayment
);
Route.post(
  RouteName + "/AddPayment2",
  verifyTokenWithbusiness_id,
  EmployeeController.AddPayment2
);

Route.post(
  RouteName + "/AddLeave",
  verifyTokenWithbusiness_id,
  EmployeeController.AddLeave
);
Route.post(
  RouteName + "/EditLeave/:id",
  verifyTokenWithbusiness_id,
  EmployeeController.EditLeave
);
Route.delete(RouteName + "/DeleteLeave/:id", EmployeeController.DeleteLeave);
Route.get(
  RouteName + "/getLeave",
  verifyTokenWithbusiness_id,
  verifyTokenWithRole(["SUPERUSER", "MANAGER", "SALE"]),
  EmployeeController.getLeave
);

Route.post(
  RouteName + "/AddOvertime",
  verifyTokenWithbusiness_id,
  EmployeeController.AddOvertime
);
Route.get(
  RouteName + "/getOvertime",
  verifyTokenWithbusiness_id,
  verifyTokenWithRole(["SUPERUSER", "MANAGER", "SALE"]),
  EmployeeController.getOvertime
);

module.exports = Route;
