//set route to call API
//ex. if call to working code in getProduct function have to call API http://localhost:5000/product/getProduct
const express = require('express');
const Route = express.Router();
const RouteName = '/employee'
const { verifyTokenWithRole , logUserActivity} = require('../middleware/verifytokenwithrole'); 


const EmployeeController = require('../controllers/EmployeeController');

Route.get(RouteName+'/getEmployee',EmployeeController.getEmployee)
Route.post(RouteName+'/AddEmployee',EmployeeController.AddEmployee)
Route.put(RouteName+'/EditEmployee/:id',EmployeeController.EditEmployee)
Route.delete(RouteName+'/DeleteEmployee/:id',EmployeeController.DeleteEmployee)
Route.post(RouteName+'/AddDepartment',EmployeeController.AddDepartment)
Route.put(RouteName+'/EditDepartment/:id',EmployeeController.EditDepartment)
Route.delete(RouteName+'/DeleteDepartment/:id',EmployeeController.DeleteDepartment)
Route.get(RouteName+'/getDepartment',EmployeeController.getDepartment)
Route.get(RouteName+'/getPayment', verifyTokenWithRole(['SUPERUSER','MANAGER','SALE']),EmployeeController.getPayment)
Route.get(RouteName+'/getEmployeeSalary', verifyTokenWithRole(['SUPERUSER','MANAGER','SALE']),EmployeeController.getEmployeeSalary)
//Route.get(RouteName+'/getPayment', verifyTokenWithRole(['superuser','superman']),logUserActivity('Read/getPayment','getPayment'),EmployeeController.getPayment)
Route.post(RouteName+'/AddPosition',EmployeeController.AddPosition)
Route.put(RouteName+'/EditPosition/:id',EmployeeController.EditPosition)
Route.delete(RouteName+'/DeletePosition/:id',EmployeeController.DeletePosition)
Route.get(RouteName+'/getPosition',EmployeeController.getPosition)
Route.post(RouteName+'/AddPayment',EmployeeController.AddPayment)
Route.post(RouteName+'/AddPayment2',EmployeeController.AddPayment2)

module.exports = Route