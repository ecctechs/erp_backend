const { where } = require("sequelize");
const ResponseManager = require("../middleware/ResponseManager");
const TokenManager = require('../middleware/tokenManager');
const { DataTypes, Op } = require('sequelize');
const sequelize = require('../database');
const {
  Employee,
  Position,
  Salary_pay,
  Department,
  Leaving,
  Overtime
} = require("../model/employeeModel"); // call model
const { Business } = require('../model/quotationModel')

class EmployeeController {
  static async getEmployee(req, res) {
    try {
      // กำหนดความสัมพันธ์ระหว่าง Employee และ Position
      Employee.belongsTo(Position, { foreignKey: "PositionID" });
      Position.hasMany(Employee, { foreignKey: "PositionID" });

      // กำหนดความสัมพันธ์ระหว่าง Employee และ Department
      Employee.belongsTo(Department, { foreignKey: "departmentID" });
      Department.hasMany(Employee, { foreignKey: "departmentID" });

      Employee.belongsTo(Business, { foreignKey: "bus_id" });
      Business.hasMany(Employee, { foreignKey: "bus_id" });

      const tokenData = await TokenManager.update_token(req);
      if (!tokenData) {
        return await ResponseManager.ErrorResponse(req, res, 401, "Unauthorized: Invalid token data");
      }
  
      const { RoleName, userID, userEmail, BusID } = tokenData;

      var employees = await Employee.findAll({
        include: [{ model: Position }, { model: Department }],
        where: {
          bus_id: BusID,
          F_name: {
            [Op.not]: '-' // กรองเฉพาะพนักงานที่ F_name ไม่เป็น null
          },
          L_name: {
            [Op.not]: '-' // กรองเฉพาะพนักงานที่ L_name ไม่เป็น null
          },
          Email: {
            [Op.not]: '-' // กรองเฉพาะพนักงานที่ Email ไม่เป็น null
          }
        },
      });

      return ResponseManager.SuccessResponse(req, res, 200, employees);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async AddEmployee(req, res) {
    //add category
    try {

      Employee.belongsTo(Business, { foreignKey: "bus_id" });
      Business.hasMany(Employee, { foreignKey: "bus_id" });

      const tokenData = await TokenManager.update_token(req);
      if (!tokenData) {
        return await ResponseManager.ErrorResponse(req, res, 401, "Unauthorized: Invalid token data");
      }
  
      const { RoleName, userID, userEmail, BusID } = tokenData;

      const esistingempNID = await Employee.findOne({
        where: {
          NID_num: req.body.NID_num,
        },
      });
      if (esistingempNID) {
        return ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "National ID is already exist"
        );
      }

      const esistingempEmail = await Employee.findOne({
        where: {
          Email: req.body.Email,
        },
      });

      if (esistingempEmail) {
        return ResponseManager.ErrorResponse(req, res, 400, "Email is already exist");
      }

      const existingempBankID = await Employee.findOne({
        where: {
          bankAccountID: req.body.bankAccountID,
        },
      });

      if (existingempBankID) {
        return ResponseManager.ErrorResponse(req, res, 400, "Bank Account ID is already exist");
      }

        const insert_emp = await Employee.create({
          title: req.body.title,
          F_name: req.body.F_name,
          L_name: req.body.L_name,
          Address: req.body.Address,
          Birthdate: req.body.Birthdate,
          NID_num: req.body.NID_num,
          Phone_num: req.body.Phone_num,
          Email: req.body.Email,
          start_working_date: req.body.start_working_date,
          Salary: req.body.Salary,
          employeeType: req.body.employeeType,
          bankName: req.body.bankName,
          bankAccountID: req.body.bankAccountID,
          PositionID: req.body.PositionID,
          departmentID: req.body.departmentID,
          bus_id: BusID,
        });
        console.log(req.body);
        return ResponseManager.SuccessResponse(req, res, 200, insert_emp);
      
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async EditEmployee(req, res) {
    //add product
    try {
      const editemp = await Employee.findOne({
        where: {
          employeeID: req.params.id,
        },
      });
      if (editemp) {

        
        const existingNID = await Employee.findOne({
            where: {
                NID_num: req.body.NID_num,
                employeeID: { [Op.ne]: req.params.id }
            },
        });

        if (existingNID) {
            await ResponseManager.ErrorResponse(req, res, 400, "National ID already exists");
            return;
        }
        const existingEmail = await Employee.findOne({
          where: {
              Email: req.body.Email,
              employeeID: { [Op.ne]: req.params.id } // ตรวจสอบสินค้าที่ไม่ใช่สินค้าปัจจุบัน
          },
      });

      if (existingEmail) {
          await ResponseManager.ErrorResponse(req, res, 400, "Employee's email already exists");
          return;
      }

      const existingempBankID = await Employee.findOne({
        where: {
          bankAccountID: req.body.bankAccountID,
          employeeID: { [Op.ne]: req.params.id }
        },
      });

      if (existingempBankID) {
        return ResponseManager.ErrorResponse(req, res, 400, "Bank Account ID is already exist");
      }

        await Employee.update(
          {
            title: req.body.title,
            F_name: req.body.F_name,
            L_name: req.body.L_name,
            Address: req.body.Address,
            Birthdate: req.body.Birthdate,
            NID_num: req.body.NID_num,
            Phone_num: req.body.Phone_num,
            Email: req.body.Email,
            start_working_date: req.body.start_working_date,
            Salary: req.body.Salary,
            employeeType: req.body.employeeType,
            bankName: req.body.bankName,
            bankAccountID: req.body.bankAccountID,
            PositionID: req.body.PositionID,
            DepartmentID: req.body.DepartmentID,
          },
          {
            where: {
              employeeID: req.params.id,
            },
          }
        );
        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Employee Updated"
        );
      } else {
        return ResponseManager.ErrorResponse(req, res, 400, "No Employee found");
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async DeleteEmployee(req, res) {
    try {
      // ค้นหาข้อมูลพนักงานจากฐานข้อมูล
      const employee = await Employee.findOne({
        where: {
          employeeID: req.params.id,
        },
      });
  
      if (employee) {
        // ทำการอัปเดตข้อมูลพนักงาน โดยลบเฉพาะข้อมูลส่วนตัวและคง salary, start_working_date และ employeeID ไว้
        await Employee.update({
          F_name: '-', // ลบชื่อ
          L_name: '-', // ลบนามสกุล
          Address: '-', // ลบที่อยู่
          Birthdate: '-', // ลบวันเกิด
          NID_num: '-', // ลบเลขบัตรประชาชน
          Phone_num: '-', // ลบเบอร์โทร
          Email: '-', // ลบอีเมล
          bankName: '-', // ลบชื่อธนาคาร
          bankAccountID: '-', // ลบเลขบัญชี
        }, {
          where: {
            employeeID: req.params.id,
          },
        });
  
        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Employee data partially deleted"
        );
      } else {
        return ResponseManager.ErrorResponse(req, res, 400, "No Employee found");
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  } 

  static async AddDepartment(req, res) {
    //add category
    try {

      Department.belongsTo(Business, { foreignKey: "bus_id" });
      Business.hasMany(Department, { foreignKey: "bus_id" });

      const tokenData = await TokenManager.update_token(req);
      if (!tokenData) {
        return await ResponseManager.ErrorResponse(req, res, 401, "Unauthorized: Invalid token data");
      }
  
      const { RoleName, userID, userEmail, BusID } = tokenData;


      const adddepart = await Department.findOne({
        where: {
          departmentName: req.body.departmentName,
          bus_id: BusID
        },
      });
      if (adddepart) {
        return ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "Department already exists"
        );
      } else {
        const insert_depart = await Department.create({
          departmentName: req.body.departmentName,
          bus_id: BusID
        });
        console.log(req.body);
        return ResponseManager.SuccessResponse(req, res, 200, insert_depart);
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async EditDepartment(req, res) {
    //add product
    try {
      const editemp = await Department.findOne({
        where: {
          departmentID: req.params.id,
        },
      });
      if (editemp) {

        const existingDepart = await Department.findOne({
            where: {
                departmentName: req.body.departmentName,
                departmentID: { [Op.ne]: req.params.id } // ตรวจสอบสินค้าที่ไม่ใช่สินค้าปัจจุบัน
            },
        });

        if (existingDepart) {
            await ResponseManager.ErrorResponse(req, res, 400, "Department already exists");
            return;
        }



        await Department.update(
          {
            departmentName: req.body.departmentName,
          },
          {
            where: {
              departmentID: req.params.id,
            },
          }
        );
        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Department Updated"
        );
      } else {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "No Department found"
        );
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async DeleteDepartment(req, res) {
    //delete product
    try {
      const deletecate = await Department.findOne({
        where: {
          departmentID: req.params.id,
        },
      });
      if (deletecate) {
        await Department.destroy({
          where: {
            departmentID: req.params.id,
          },
        });
        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Department Deleted"
        );
      } else {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "No Department found"
        );
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async getDepartment(req, res) {
    try {
      Department.belongsTo(Business, { foreignKey: "bus_id" });
      Business.hasMany(Department, { foreignKey: "bus_id" });

      const tokenData = await TokenManager.update_token(req);
      if (!tokenData) {
        return await ResponseManager.ErrorResponse(req, res, 401, "Unauthorized: Invalid token data");
      }
  
      const { RoleName, userID, userEmail, BusID } = tokenData;
      const departments = await Department.findAll({
        where: {
          bus_id: BusID
        },
      });

      let datalist = [];

      for (const property in departments) {
        const data = {};
        data.departmentID = departments[property].departmentID;
        data.departmentName = departments[property].departmentName;

        const employee = await Employee.findAll({
          where: {
            departmentID: departments[property].departmentID.toString(),
            bus_id: BusID
          },
        });

        data.sumEmployee = employee.length;
        datalist.push(data);
      }
      return ResponseManager.SuccessResponse(req, res, 200, datalist);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async getPayment(req, res) {
    try {
      // กำหนดความสัมพันธ์ระหว่าง Table1 และ Table2
      Employee.hasMany(Salary_pay, { foreignKey: "employeeID" });
      Salary_pay.belongsTo(Employee, { foreignKey: "employeeID" });
  
      // กำหนดความสัมพันธ์ระหว่าง Table2 และ Table3
      Employee.hasMany(Position, { foreignKey: "PositionID" });
      Position.belongsTo(Employee, { foreignKey: "PositionID" });
  
      // กำหนดความสัมพันธ์ระหว่าง Table3 และ Table4
      Department.hasMany(Employee, { foreignKey: "departmentID" });
      Employee.belongsTo(Department, { foreignKey: "departmentID" });

      Employee.belongsTo(Business, { foreignKey: "bus_id" });
      Business.hasMany(Employee, { foreignKey: "bus_id" });
      
  
      const tokenData = await TokenManager.update_token(req);
      if (!tokenData) {
        return await ResponseManager.ErrorResponse(req, res, 401, "Unauthorized: Invalid token data");
      }
  
      const { RoleName, userID, userEmail, BusID } = tokenData;
      console.log("-----------------------------", RoleName);
      
      let result = [];
      let paymentslist = [];
  
      if (RoleName === 'SUPERUSER') {
        paymentslist = await Salary_pay.findAll({
          include: [
            { model: Employee, 
              include: [Position, Department] 
            }, // เชื่อมโยง Table2 และ Table3 และ Table4
          ],
          where: { bus_id: BusID },
        });
        paymentslist.forEach(log => {
          result.push({
            payment_id: log.payment_id,
            date: log.Date,
            round: log.round,
            month: log.month,
            year: log.year,
            employeeName: log.employee.F_name + " " + log.employee.L_name,
            salary: log.employee.Salary
          });
        });
        
      } else if(RoleName === 'SALE') {
        paymentslist = await Salary_pay.findAll({
          include: [
            { 
              model: Employee,
              where: {
                Email: userEmail
              }, 
              include: [Position, Department] }
          ],
          where: { bus_id: BusID },
        });
        paymentslist.forEach(log => {
          result.push({
            payment_id: log.payment_id,
            date: log.Date,
            round: log.round,
            month: log.month,
            year: log.year,
            employeeName: log.employee.F_name + " " + log.employee.L_name,
            salary: log.employee.Salary
          });
        });
      } else if (RoleName === 'MANAGER') {
        const userData = await Employee.findOne({
          where: {
            Email: userEmail
          },
          include: [
            {
              model: Department
            }
          ]
        });
  
        if (!userData || !userData.department) {
          return await ResponseManager.ErrorResponse(req, res, 404, "Manager department data not found");
        }
  
        // console.log("Department Name:", userData.department.departmentName);
        const userdepart = userData.department.departmentID;
  
        paymentslist = await Salary_pay.findAll({
          include: [
            { 
              model: Employee,
              where: {
                departmentID: userdepart,
                Email: {
                  [Op.ne]: userEmail
                }
              },
              include: [
                {
                  model: Position
                },
                {
                  model: Department,
                  where: {
                    departmentID: userdepart
                  }
                }
              ]
            }
          ],
          where: { bus_id: BusID },
        });

        paymentslist.forEach(log => {
          result.push({
            payment_id: log.payment_id,
            date: log.Date,
            round: log.round,
            month: log.month,
            year: log.year,
            employeeName: log.employee.F_name + " " + log.employee.L_name,
            salary: log.employee.Salary
          });
        });
      }

  
      return ResponseManager.SuccessResponse(req, res, 200, result);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async getEmployeeSalary(req, res) {
    try {
      // กำหนดความสัมพันธ์ระหว่าง Employee และ Position
      Employee.belongsTo(Position, { foreignKey: "PositionID" });
      Position.hasMany(Employee, { foreignKey: "PositionID" });

      // กำหนดความสัมพันธ์ระหว่าง Employee และ Department
      Employee.belongsTo(Department, { foreignKey: "departmentID" });
      Department.hasMany(Employee, { foreignKey: "departmentID" });

      Employee.belongsTo(Business, { foreignKey: "bus_id" });
      Business.hasMany(Employee, { foreignKey: "bus_id" });

      const tokenData = await TokenManager.update_token(req);
      if (!tokenData) {
        return await ResponseManager.ErrorResponse(req, res, 401, "Unauthorized: Invalid token data");
      }
  
      const { RoleName, userID, userEmail, BusID } = tokenData;
      let result = [];  
      let employeeslist = [];
      
      if (RoleName === 'SUPERUSER') {
        employeeslist = await Employee.findAll({
          where: {
            bus_id: BusID,
            F_name: {
              [Op.ne]: "-" // กรองเฉพาะพนักงานที่ชื่อไม่เท่ากับ "-"
            },
            L_name: {
              [Op.ne]: "-" // กรองเฉพาะพนักงานที่นามสกุลไม่เท่ากับ "-"
            }
          },
          include: [{ model: Position }, { model: Department }],
        });
        employeeslist.forEach(log => {
          result.push({
            employeeID: log.employeeID,
            name: log.F_name+" "+log.L_name,
            employeeType: log.employeeType,
            phone: log.Phone_num,
            email: log.Email,
            department: log.department.departmentName,
            position: log.position.Position,
            bankName: log.bankName,
            bankAccountID: log.bankAccountID,
            salary: log.Salary,

          });
        });
      } else if(RoleName === 'SALE') {
        employeeslist = await Employee.findAll({
          where: {
            Email: userEmail,
            bus_id: BusID,
            F_name: {
              [Op.ne]: "-" // กรองเฉพาะพนักงานที่ชื่อไม่เท่ากับ "-"
            },
            L_name: {
              [Op.ne]: "-" // กรองเฉพาะพนักงานที่นามสกุลไม่เท่ากับ "-"
            }
          },
          include: [{ model: Position }, { model: Department }],
        });
        employeeslist.forEach(log => {
          result.push({
            employeeID: log.employeeID,
            name: log.F_name+" "+log.L_name,
            employeeType: log.employeeType,
            phone: log.Phone_num,
            email: log.Email,
            department: log.department.departmentName,
            position: log.position.Position,
            bankName: log.bankName,
            bankAccountID: log.bankAccountID,
            salary: log.Salary,
          });
        });
      } else if (RoleName === 'MANAGER') {

        const userData = await Employee.findOne({
          where: {
            Email: userEmail,
            bus_id: BusID
          },
          include: [
            {
              model: Department
            }
          ]
        });

        if (!userData || !userData.department) {
          return await ResponseManager.ErrorResponse(req, res, 404, "Manager department data not found");
        }
  
        // console.log("Department Name:", userData.department.departmentName);
        const userdepart = userData.department.departmentID;

        employeeslist = await Employee.findAll({
          where: {
            departmentID: userdepart,
            bus_id: BusID,
            Email: {
              [Op.ne]: userEmail
            },
            F_name: {
              [Op.ne]: "-" // กรองเฉพาะพนักงานที่ชื่อไม่เท่ากับ "-"
            },
            L_name: {
              [Op.ne]: "-" // กรองเฉพาะพนักงานที่นามสกุลไม่เท่ากับ "-"
            }
          },
          include: [{ model: Position }, { model: Department }],
        });
        employeeslist.forEach(log => {
          result.push({
            employeeID: log.employeeID,
            name: log.F_name+" "+log.L_name,
            employeeType: log.employeeType,
            phone: log.Phone_num,
            email: log.Email,
            department: log.department.departmentName,
            position: log.position.Position,
            bankName: log.bankName,
            bankAccountID: log.bankAccountID,
            salary: log.Salary,
          });
        });
      }

      // var employees = await Employee.findAll({
      //   include: [{ model: Position }, { model: Department }],
      // });

      return ResponseManager.SuccessResponse(req, res, 200, result);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async getEmployeeQuotation(req, res) {
    try {
      // กำหนดความสัมพันธ์ระหว่าง Employee และ Position
      Employee.belongsTo(Position, { foreignKey: "PositionID" });
      Position.hasMany(Employee, { foreignKey: "PositionID" });

      // กำหนดความสัมพันธ์ระหว่าง Employee และ Department
      Employee.belongsTo(Department, { foreignKey: "departmentID" });
      Department.hasMany(Employee, { foreignKey: "departmentID" });

      Employee.belongsTo(Business, { foreignKey: "bus_id" });
      Business.hasMany(Employee, { foreignKey: "bus_id" });

      const tokenData = await TokenManager.update_token(req);
      if (!tokenData) {
        return await ResponseManager.ErrorResponse(req, res, 401, "Unauthorized: Invalid token data");
      }
  
      const { RoleName, userID, userEmail, BusID } = tokenData;
      let result = [];  
      let employeeslist = [];
      
      if (RoleName === 'SUPERUSER') {
        employeeslist = await Employee.findAll({
          where: {
            bus_id: BusID,
            F_name: {
              [Op.ne]: "-" // กรองเฉพาะพนักงานที่ชื่อไม่เท่ากับ "-"
            },
            L_name: {
              [Op.ne]: "-" // กรองเฉพาะพนักงานที่นามสกุลไม่เท่ากับ "-"
            }
          },
          include: [{ model: Position }, { model: Department }],
        });
        console.log("+++++++++++++---------",employeeslist)
        employeeslist.forEach(log => {
          result.push({
            employeeID: log.employeeID,
            name: log.F_name+" "+log.L_name,
            employeeType: log.employeeType,
            phone: log.Phone_num,
            email: log.Email,
            department: log.department.departmentName,
            position: log.position.Position,
            bankName: log.bankName,
            bankAccountID: log.bankAccountID,
            salary: log.Salary,

          });
        });
      } else if(RoleName === 'SALE') {
        employeeslist = await Employee.findAll({
          where: {
            Email: userEmail,
            bus_id: BusID,
            F_name: {
              [Op.ne]: "-" // กรองเฉพาะพนักงานที่ชื่อไม่เท่ากับ "-"
            },
            L_name: {
              [Op.ne]: "-" // กรองเฉพาะพนักงานที่นามสกุลไม่เท่ากับ "-"
            }
          },
          include: [{ model: Position }, { model: Department }],
        });
        employeeslist.forEach(log => {
          result.push({
            employeeID: log.employeeID,
            name: log.F_name+" "+log.L_name,
            employeeType: log.employeeType,
            phone: log.Phone_num,
            email: log.Email,
            department: log.department.departmentName,
            position: log.position.Position,
            bankName: log.bankName,
            bankAccountID: log.bankAccountID,
            salary: log.Salary,
          });
        });
      } else if (RoleName === 'MANAGER') {

        const userData = await Employee.findOne({
          where: {
            Email: userEmail,
          },
          include: [
            {
              model: Department
            }
          ]
        });

        if (!userData || !userData.department) {
          return await ResponseManager.ErrorResponse(req, res, 404, "Manager department data not found");
        }
  
        // console.log("Department Name:", userData.department.departmentName);
        const userdepart = userData.department.departmentID;

        employeeslist = await Employee.findAll({
          where: {
            departmentID: userdepart,
            bus_id: BusID,
            Email: {
              [Op.ne]: userEmail
            },
            F_name: {
              [Op.ne]: "-" // กรองเฉพาะพนักงานที่ชื่อไม่เท่ากับ "-"
            },
            L_name: {
              [Op.ne]: "-" // กรองเฉพาะพนักงานที่นามสกุลไม่เท่ากับ "-"
            }
          },
          include: [{ model: Position }, { model: Department }],
        });
        
        employeeslist.forEach(log => {
          result.push({
            employeeID: log.employeeID,
            name: log.F_name+" "+log.L_name,
            employeeType: log.employeeType,
            phone: log.Phone_num,
            email: log.Email,
            department: log.department.departmentName,
            position: log.position.Position,
            bankName: log.bankName,
            bankAccountID: log.bankAccountID,
            salary: log.Salary,
          });
        });
      }

      // var employees = await Employee.findAll({
      //   include: [{ model: Position }, { model: Department }],
      // });

      return ResponseManager.SuccessResponse(req, res, 200, result);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async AddPosition(req, res) {
    //add category
    try {

      Position.belongsTo(Business, { foreignKey: "bus_id" });
      Business.hasMany(Position, { foreignKey: "bus_id" });

      const tokenData = await TokenManager.update_token(req);
      if (!tokenData) {
        return await ResponseManager.ErrorResponse(req, res, 401, "Unauthorized: Invalid token data");
      }
  
      const { RoleName, userID, userEmail, BusID } = tokenData;

      const adddepart = await Position.findOne({
        where: {
          Position: req.body.Position,
          bus_id: BusID
        },
      });
      if (adddepart) {
        return ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "Position already exists"
        );
      } else {
        const insert_depart = await Position.create({
          Position: req.body.Position,
          bus_id: BusID
        });
        console.log(req.body);
        return ResponseManager.SuccessResponse(req, res, 200, insert_depart);
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async EditPosition(req, res) {
    //add product
    try {
      const editemp = await Position.findOne({
        where: {
          PositionID: req.params.id,
        },
      });
      if (editemp) {

        const existingPosition = await Position.findOne({
            where: {
                Position: req.body.Position,
                PositionID: { [Op.ne]: req.params.id } // ตรวจสอบสินค้าที่ไม่ใช่สินค้าปัจจุบัน
            },
        });

        if (existingPosition) {
            await ResponseManager.ErrorResponse(req, res, 400, "Position already exists");
            return;
        }


        await Position.update(
          {
            Position: req.body.Position,
          },
          {
            where: {
              PositionID: req.params.id,
            },
          }
        );
        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Position Updated"
        );
      } else {
        return ResponseManager.ErrorResponse(req, res, 400, "No Position found");
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async DeletePosition(req, res) {
    //delete product
    try {
      const deletecate = await Position.findOne({
        where: {
          PositionID: req.params.id,
        },
      });
      if (deletecate) {
        await Position.destroy({
          where: {
            PositionID: req.params.id,
          },
        });
        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Position Deleted"
        );
      } else {
        return ResponseManager.ErrorResponse(req, res, 400, "No Position found");
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async getPosition(req, res) {
    try {
      const Positions = await Position.findAll();
      return ResponseManager.SuccessResponse(req, res, 200, Positions);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async AddPayment(req, res) {
    //add category
    try {
      Salary_pay.belongsTo(Business, { foreignKey: "bus_id" });
      Business.hasMany(Salary_pay, { foreignKey: "bus_id" });

      const tokenData = await TokenManager.update_token(req);
      if (!tokenData) {
        return await ResponseManager.ErrorResponse(req, res, 401, "Unauthorized: Invalid token data");
      }
  
      const { RoleName, userID, userEmail, BusID } = tokenData;


      const data = await Salary_pay.findOne({
        where: {
          month: req.body.month,
          round: req.body.round,
          year: req.body.year,
          employeeID: req.body.employeeID,
          bus_id: BusID
        },
      });
      if (data) {
        return ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "Employee Payment already exists"
        );
      } else {
        const data_payment = await Salary_pay.create({
          employeeID: req.body.employeeID,
          Date: req.body.Date,
          round: req.body.round,
          month: req.body.month,
          year: req.body.year,
          bus_id: BusID
        });
        console.log(req.body);
        return ResponseManager.SuccessResponse(req, res, 200, data_payment);
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async AddPayment2(req, res) {
    try {

      Salary_pay.belongsTo(Business, { foreignKey: "bus_id" });
      Business.hasMany(Salary_pay, { foreignKey: "bus_id" });

      const tokenData = await TokenManager.update_token(req);
      if (!tokenData) {
        return await ResponseManager.ErrorResponse(req, res, 401, "Unauthorized: Invalid token data");
      }
  
      const { RoleName, userID, userEmail, BusID } = tokenData;


        // ตรวจสอบว่ามีข้อมูลใน req.body.payments หรือไม่
        if (!req.body.payments || !Array.isArray(req.body.payments)) {
            return res.status(400).json({ error: 'Invalid request format. Missing payments array.' });
        }

        const paymentCreationPromises = [];

        for (const paymentData of req.body.payments) {
            // เพิ่มตรวจสอบเพิ่มเติมตามความเหมาะสม เช่น ตรวจสอบข้อมูล paymentData ก่อนที่จะใช้ในการสร้างรายการเงินเดือน
            // ตรวจสอบว่ามีรายการเงินเดือนที่มีเงื่อนไขของ month, round, year, และ employeeID ที่ซ้ำกันหรือไม่
            const existingPayment = await Salary_pay.findOne({
                where: {
                    month: paymentData.month,
                    round: paymentData.round,
                    year: paymentData.year,
                    employeeID: paymentData.employeeID,
                    bus_id: BusID
                }
            });

            if (existingPayment) {
              return ResponseManager.ErrorResponse(req, res, 400, "Duplicate payment entry.");
                // return res.status(400).json({ error: 'Duplicate payment entry.' });
            } else {
                // ไม่พบรายการที่ซ้ำ ดังนั้นเพิ่มรายการเงินเดือนใหม่
                paymentCreationPromises.push(Salary_pay.create({
                    employeeID: paymentData.employeeID,
                    Date: paymentData.Date,
                    round: paymentData.round,
                    month: paymentData.month,
                    year: paymentData.year,
                    bus_id: BusID
                }));
            }
        }

        // รอให้การสร้างรายการเสร็จสมบูรณ์ทั้งหมด
        const createdPayments = await Promise.all(paymentCreationPromises);
        return ResponseManager.SuccessResponse(req, res, 200, createdPayments);
        // res.status(200).json(createdPayments);
      } catch (err) {
        return ResponseManager.CatchResponse(req, res, err.message);
      }
  }
  static async AddLeave(req, res) {
    //add category
    try {
      Employee.belongsTo(Business, { foreignKey: "bus_id" });
      Business.hasMany(Employee, { foreignKey: "bus_id" });

      const tokenData = await TokenManager.update_token(req);
      if (!tokenData) {
        return await ResponseManager.ErrorResponse(req, res, 401, "Unauthorized: Invalid token data");
      }
  
      const { RoleName, userID, userEmail, BusID } = tokenData;


      const data = await Leaving.findOne({
        where: {
          employeeID: req.body.employeeID,
          date: req.body.date,
        },
      });
      if (data) {
        return ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "Leaving date already exists"
        );
      } else {
        const data_leaving = await Leaving.create({
          employeeID: req.body.employeeID,
          date: req.body.date,
          detail: req.body.detail,
        });
        console.log(req.body);
        return ResponseManager.SuccessResponse(req, res, 200, data_leaving);
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async getLeave(req, res) {
    //get all product type
    try {

      Employee.belongsTo(Business, { foreignKey: "bus_id" });
      Business.hasMany(Employee, { foreignKey: "bus_id" });

      Leaving.belongsTo(Employee, { foreignKey: "employeeID" });
      Employee.hasMany(Leaving, { foreignKey: "employeeID" });

      const tokenData = await TokenManager.update_token(req);
      if (!tokenData) {
        return await ResponseManager.ErrorResponse(req, res, 401, "Unauthorized: Invalid token data");
      }
  
      const { RoleName, userID, userEmail, BusID } = tokenData;
      let data_leave;

      if (RoleName === 'SUPERUSER') {
        data_leave = await Leaving.findAll({
          include: [
            {
              model: Employee,
              where: { bus_id: BusID }
            }
          ]
        });
      } else if(RoleName === 'SALE') {
        data_leave = await Leaving.findAll({
          include: [
            {
              model: Employee,
              where: { 
                bus_id: BusID,
                Email: userEmail
              }
            }
          ]
        });
      } else if (RoleName === 'MANAGER') {
        const userData = await Employee.findOne({
          where: {
            Email: userEmail,
            bus_id: BusID
          },
          include: [
            {
              model: Department
            }
          ]
        });

        if (!userData || !userData.department) {
          return await ResponseManager.ErrorResponse(req, res, 404, "Manager department data not found");
        }
  
        // console.log("Department Name:", userData.department.departmentName);
        const userdepart = userData.department.departmentID;

        data_leave = await Leaving.findAll({
          include: [
            {
              model: Employee,
              where: { 
                departmentID: userdepart,
                bus_id: BusID,
                Email: {
                  [Op.ne]: userEmail
                }
              }
            }
          ]
        });


      }

      return ResponseManager.SuccessResponse(req, res, 200, data_leave);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async AddOvertime(req, res) {
    //add category
    try {
      Employee.belongsTo(Business, { foreignKey: "bus_id" });
      Business.hasMany(Employee, { foreignKey: "bus_id" });

      const tokenData = await TokenManager.update_token(req);
      if (!tokenData) {
        return await ResponseManager.ErrorResponse(req, res, 401, "Unauthorized: Invalid token data");
      }
  
      const { RoleName, userID, userEmail, BusID } = tokenData;


      const data = await Overtime.findOne({
        where: {
          employeeID: req.body.employeeID,
          date: req.body.date,
        },
      });
      if (data) {
        return ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "Overtime date already exists"
        );
      } else {
        const data_overtime = await Overtime.create({
          employeeID: req.body.employeeID,
          date: req.body.date,
          detail: req.body.detail,
          hours: req.body.hours
        });
        console.log(req.body);
        return ResponseManager.SuccessResponse(req, res, 200, data_overtime);
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async getOvertime(req, res) {
    //get all product type
    try {

      Employee.belongsTo(Business, { foreignKey: "bus_id" });
      Business.hasMany(Employee, { foreignKey: "bus_id" });

      Overtime.belongsTo(Employee, { foreignKey: "employeeID" });
      Employee.hasMany(Overtime, { foreignKey: "employeeID" });

      const tokenData = await TokenManager.update_token(req);
      if (!tokenData) {
        return await ResponseManager.ErrorResponse(req, res, 401, "Unauthorized: Invalid token data");
      }
  
      const { RoleName, userID, userEmail, BusID } = tokenData;
      let data_overtime;

      if (RoleName === 'SUPERUSER') {
        data_overtime = await Overtime.findAll({
          include: [
            {
              model: Employee,
              where: { bus_id: BusID }
            }
          ]
          
        });
      } else if(RoleName === 'SALE') {
        data_overtime = await Overtime.findAll({
          include: [
            {
              model: Employee,
              where: { 
                bus_id: BusID,
                Email: userEmail,
               }
            }
          ]
          
        });
      } else if (RoleName === 'MANAGER') {

        const userData = await Employee.findOne({
          where: {
            Email: userEmail,
            bus_id: BusID
          },
          include: [
            {
              model: Department
            }
          ]
        });

        if (!userData || !userData.department) {
          return await ResponseManager.ErrorResponse(req, res, 404, "Manager department data not found");
        }
  
        // console.log("Department Name:", userData.department.departmentName);
        const userdepart = userData.department.departmentID;

        data_overtime = await Overtime.findAll({
          include: [
            {
              model: Employee,
              where: { 
                departmentID: userdepart,
                bus_id: BusID,
                Email: {
                  [Op.ne]: userEmail
                }
               }
            }
          ]
          
        });
      }

      return ResponseManager.SuccessResponse(req, res, 200, data_overtime);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
}

module.exports = EmployeeController;
