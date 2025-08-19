const express = require("express");
const Route = express.Router();
const RouteName = "/employee";
const {
  verifyTokenWithRole,
  logUserActivity,
  verifyTokenWithbus_id,
} = require("../middleware/verifytokenwithrole");

const EmployeeController = require("../controllers/EmployeeController");
const authMiddleware = require('../middleware/authMiddleware');

Route.get(
  RouteName + "/getEmployee",
  verifyTokenWithbus_id,
  EmployeeController.getEmployee
);
Route.post(
  RouteName + "/AddEmployee",
  authMiddleware,
  verifyTokenWithbus_id,
  EmployeeController.AddEmployee
);
Route.put(RouteName + "/EditEmployee/:id", EmployeeController.EditEmployee);
Route.delete(
  RouteName + "/DeleteEmployee/:id",
  EmployeeController.DeleteEmployee
);
Route.post(
  RouteName + "/AddDepartment",
  authMiddleware,
  verifyTokenWithbus_id,
  EmployeeController.AddDepartment
);
Route.put(RouteName + "/EditDepartment/:id", EmployeeController.EditDepartment);
Route.delete(
  RouteName + "/DeleteDepartment/:id",
  EmployeeController.DeleteDepartment
);
Route.get(
  RouteName + "/getDepartment",
  authMiddleware,
  verifyTokenWithbus_id,
  EmployeeController.getDepartment
);
Route.get(
  RouteName + "/getPayment",
  authMiddleware,
  verifyTokenWithbus_id,
  verifyTokenWithRole(["SUPERUSER", "MANAGER", "SALE"]),
  EmployeeController.getPayment
);
Route.get(
  RouteName + "/getEmployeeSalary",
  authMiddleware,
  verifyTokenWithbus_id,
  verifyTokenWithRole(["SUPERUSER", "MANAGER", "SALE"]),
  EmployeeController.getEmployeeSalary
);
Route.put(RouteName + "/EditSalary/:id", EmployeeController.EditSalary);

Route.delete(RouteName + "/DeleteSalary/:id", EmployeeController.DeleteSalary);
Route.get(
  RouteName + "/getEmployeeQuotation",
  authMiddleware,
  verifyTokenWithbus_id,
  verifyTokenWithRole(["SUPERUSER", "MANAGER", "SALE"]),
  EmployeeController.getEmployeeQuotation
);
Route.post(
  RouteName + "/AddPosition",
  authMiddleware,
  verifyTokenWithbus_id,
  EmployeeController.AddPosition
);
Route.put(RouteName + "/EditPosition/:id", EmployeeController.EditPosition);
Route.delete(
  RouteName + "/DeletePosition/:id",
  EmployeeController.DeletePosition
);
Route.get(
  RouteName + "/getPosition",
  verifyTokenWithbus_id,
  EmployeeController.getPosition
);
Route.post(
  RouteName + "/AddPayment",
  authMiddleware,
  verifyTokenWithbus_id,
  EmployeeController.AddPayment
);
Route.post(
  RouteName + "/AddPayment2",
  authMiddleware,
  verifyTokenWithbus_id,
  EmployeeController.AddPayment2
);

Route.post(
  RouteName + "/AddLeave",
  authMiddleware,
  verifyTokenWithbus_id,
  EmployeeController.AddLeave
);
Route.post(
  RouteName + "/EditLeave/:id",
  verifyTokenWithbus_id,
  EmployeeController.EditLeave
);
Route.delete(RouteName + "/DeleteLeave/:id", EmployeeController.DeleteLeave);
Route.get(
  RouteName + "/getLeave",
  authMiddleware,
  verifyTokenWithbus_id,
  verifyTokenWithRole(["SUPERUSER", "MANAGER", "SALE"]),
  EmployeeController.getLeave
);

Route.post(
  RouteName + "/AddOvertime",
  authMiddleware,
  verifyTokenWithbus_id,
  EmployeeController.AddOvertime
);
Route.get(
  RouteName + "/getOvertime",
  authMiddleware,
  verifyTokenWithbus_id,
  verifyTokenWithRole(["SUPERUSER", "MANAGER", "SALE"]),
  EmployeeController.getOvertime
);

module.exports = Route;
