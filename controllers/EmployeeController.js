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
} = require("../model/employeeModel"); // call model

class EmployeeController {
  static async getEmployee(req, res) {
    try {
      // กำหนดความสัมพันธ์ระหว่าง Employee และ Position
      Employee.belongsTo(Position, { foreignKey: "PositionID" });
      Position.hasMany(Employee, { foreignKey: "PositionID" });

      // กำหนดความสัมพันธ์ระหว่าง Employee และ Department
      Employee.belongsTo(Department, { foreignKey: "departmentID" });
      Department.hasMany(Employee, { foreignKey: "departmentID" });

      var employees = await Employee.findAll({
        include: [{ model: Position }, { model: Department }],
      });

      return ResponseManager.SuccessResponse(req, res, 200, employees);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async AddEmployee(req, res) {
    //add category
    try {
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
        return ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "Email is already exist"
        );
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
                employeeID: { [Op.ne]: req.params.id } // ตรวจสอบสินค้าที่ไม่ใช่สินค้าปัจจุบัน
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
    //delete product
    try {
      const deletecate = await Employee.findOne({
        where: {
          employeeID: req.params.id,
        },
      });
      if (deletecate) {
        await Employee.destroy({
          where: {
            employeeID: req.params.id,
          },
        });
        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Employee Deleted"
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
      const adddepart = await Department.findOne({
        where: {
          departmentName: req.body.departmentName,
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
      const departments = await Department.findAll();

      let datalist = [];

      for (const property in departments) {
        const data = {};
        data.departmentID = departments[property].departmentID;
        data.departmentName = departments[property].departmentName;

        const employee = await Employee.findAll({
          where: {
            departmentID: departments[property].departmentID.toString(),
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
  
      const tokenData = await TokenManager.update_token(req);
      if (!tokenData) {
        return await ResponseManager.ErrorResponse(req, res, 401, "Unauthorized: Invalid token data");
      }
  
      const { RoleName, userID, userEmail } = tokenData;
      console.log("-----------------------------", RoleName);
      
      let result = [];
      let paymentslist = [];
  
      if (RoleName === 'superuser') {
        paymentslist = await Salary_pay.findAll({
          include: [
            { model: Employee, include: [Position, Department] }, // เชื่อมโยง Table2 และ Table3 และ Table4
          ],
        });
        paymentslist.forEach(log => {
          result.push({
            payment_id: log.payment_id,
            date: log.Date,
            round: log.round,
            month: log.month,
            year: log.year,
            employeeName: log.employee.F_name + " " + log.employee.L_name
          });
        });
      } else if(RoleName === 'employee') {
        paymentslist = await Salary_pay.findAll({
          include: [
            { 
              model: Employee,
              where: {
                Email: userEmail
              }, 
              include: [Position, Department] }
          ],
        });
        paymentslist.forEach(log => {
          result.push({
            payment_id: log.payment_id,
            date: log.Date,
            round: log.round,
            month: log.month,
            year: log.year,
            employeeName: log.employee.F_name + " " + log.employee.L_name
          });
        });
      } else if (RoleName === 'manager') {
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
          ]
        });
      }
      paymentslist.forEach(log => {
        result.push({
          payment_id: log.payment_id,
          date: log.Date,
          round: log.round,
          month: log.month,
          year: log.year,
          employeeName: log.employee.F_name + " " + log.employee.L_name
        });
      });
  
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

      const tokenData = await TokenManager.update_token(req);
      if (!tokenData) {
        return await ResponseManager.ErrorResponse(req, res, 401, "Unauthorized: Invalid token data");
      }
  
      const { RoleName, userID, userEmail } = tokenData;
      let result = [];  
      let employeeslist = [];
      
      if (RoleName === 'superuser') {
        employeeslist = await Employee.findAll({
          include: [{ model: Position }, { model: Department }],
        });
        employeeslist.forEach(log => {
          result.push({
            employeeID: log.payment_id,
            name: log.F_name+" "+log.L_name,
            phone: log.Phone_num,
            email: log.Email,
            department: log.department.departmentName,
            position: log.position.Position,
            salary: log.Salary
          });
        });
      } else if(RoleName === 'employee') {
        employeeslist = await Employee.findAll({
          include: [{ model: Position }, { model: Department }],
          where: {
            Email: userEmail
          }
        });
        employeeslist.forEach(log => {
          result.push({
            employeeID: log.payment_id,
            name: log.F_name+" "+log.L_name,
            phone: log.Phone_num,
            email: log.Email,
            department: log.department.departmentName,
            position: log.position.Position,
            salary: log.Salary
          });
        });
      } else if (RoleName === 'manager') {

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

        employeeslist = await Employee.findAll({
          include: [{ model: Position }, { model: Department }],
          where: {
            departmentID: userdepart,
            Email: {
              [Op.ne]: userEmail
            }
          }
        });
        employeeslist.forEach(log => {
          result.push({
            employeeID: log.payment_id,
            name: log.F_name+" "+log.L_name,
            phone: log.Phone_num,
            email: log.Email,
            department: log.department.departmentName,
            position: log.position.Position,
            salary: log.Salary
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
      const adddepart = await Position.findOne({
        where: {
          Position: req.body.Position,
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
      const data = await Salary_pay.findOne({
        where: {
          month: req.body.month,
          round: req.body.round,
          year: req.body.year,
          employeeID: req.body.employeeID,
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
                    employeeID: paymentData.employeeID
                }
            });

            if (existingPayment) {
                return res.status(400).json({ error: 'Duplicate payment entry.' });
            } else {
                // ไม่พบรายการที่ซ้ำ ดังนั้นเพิ่มรายการเงินเดือนใหม่
                paymentCreationPromises.push(Salary_pay.create({
                    employeeID: paymentData.employeeID,
                    Date: paymentData.Date,
                    round: paymentData.round,
                    month: paymentData.month,
                    year: paymentData.year,
                }));
            }
        }

        // รอให้การสร้างรายการเสร็จสมบูรณ์ทั้งหมด
        const createdPayments = await Promise.all(paymentCreationPromises);
        res.status(200).json(createdPayments);
      } catch (err) {
          res.status(500).json({ error: err.message });
      }
  }
}

module.exports = EmployeeController;
