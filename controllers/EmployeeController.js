const { where } = require("sequelize");
const ResponseManager = require("../middleware/ResponseManager");
const TokenManager = require("../middleware/tokenManager");
const { DataTypes, Op } = require("sequelize");
const sequelize = require("../database");
const {
  Employee,
  Position,
  Salary_pay,
  Department,
  Leaving,
  Overtime,
  Business,
} = require("../model");
const { create_employee_rows, create_payment_rows } = require('../helpers/collection_helper');

class EmployeeController {
  static async getEmployee(req, res) {
    try {
      const { bus_id } = req.userData;
   
      var employees = await Employee.findAll({
        include: [{ model: Position }, { model: Department }],
        where: {
          bus_id: bus_id,
          first_name: {
            [Op.not]: "-",
          },
          last_name: {
            [Op.not]: "-",
          },
          email: {
            [Op.not]: "-",
          },
        },
      });

      return ResponseManager.SuccessResponse(req, res, 200, employees);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async AddEmployee(req, res) {
    try {

      const { bus_id } = req.userData;

      const esistingempNID = await Employee.findOne({
        where: {
          national_id_number: req.body.national_id_number,
        },
      });
      const checkphoneDup = await Employee.findOne({
        where: {
          phone_number: req.body.phone_number,
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
      if (checkphoneDup) {
        return ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "Phone is already exist"
        );
      }

      const esistingempEmail = await Employee.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (esistingempEmail) {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "email is already exist"
        );
      }

      const insert_emp = await Employee.create({
        title: req.body.title,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: req.body.address,
        birth_date: req.body.birth_date,
        national_id_number: req.body.national_id_number,
        phone_number: req.body.phone_number,
        email: req.body.email,
        start_working_date: req.body.start_working_date,
        salary: req.body.salary || "0",
        employee_type: req.body.employee_type,
        bank_name: req.body.bank_name,
        bank_account_id: req.body.bank_account_id,
        position_id: req.body.position_id,
        department_id: req.body.department_id,
        bus_id: bus_id,
        employee_status: "active",
      });
      console.log(req.body);
      return ResponseManager.SuccessResponse(req, res, 200, insert_emp);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async EditEmployee(req, res) {
    try {
      const editemp = await Employee.findOne({
        where: {
          employee_id: req.params.id,
        },
      });
      if (editemp) {
        const existingNID = await Employee.findOne({
          where: {
            national_id_number: req.body.national_id_number,
            employee_id: { [Op.ne]: req.params.id },
          },
        });

        if (existingNID) {
          await ResponseManager.ErrorResponse(
            req,
            res,
            400,
            "National ID already exists"
          );
          return;
        }
        const existingEmail = await Employee.findOne({
          where: {
            email: req.body.email,
            employee_id: { [Op.ne]: req.params.id }, // ตรวจสอบสินค้าที่ไม่ใช่สินค้าปัจจุบัน
          },
        });

        const updatedData = {
          title: req.body.title,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          address: req.body.address,
          birth_date: req.body.birth_date,
          national_id_number: req.body.national_id_number,
          phone_number: req.body.phone_number,
          email: req.body.email,
          start_working_date: req.body.start_working_date,
          salary: req.body.salary,
          employee_type: req.body.employee_type,
          bank_name: req.body.bank_name,
          bank_account_id: req.body.bank_account_id,
          position_id: req.body.position_id,
          department_id: req.body.department_id,
        };

        console.log("Updating employee with data:", updatedData);

        await Employee.update(updatedData, {
          where: {
            employee_id: req.params.id,
          },
        });
        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Employee Updated"
        );
      } else {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "No Employee found"
        );
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async DeleteEmployee(req, res) {
    try {
      const employee = await Employee.findOne({
        where: {
          employee_id: req.params.id,
        },
      });

      if (employee) {
        const updatedData = {
          employee_status: "not active",
        };

        await Employee.update(updatedData, {
          where: {
            employee_id: req.params.id,
          },
        });

        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Employee data partially deleted"
        );
      } else {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "No Employee found"
        );
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async AddDepartment(req, res) {
    try {

      const { bus_id } = req.userData;

      const adddepart = await Department.findOne({
        where: {
          department_name: req.body.department_name,
          bus_id: bus_id,
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
          department_name: req.body.department_name,
          bus_id: bus_id,
        });
        console.log(req.body);
        return ResponseManager.SuccessResponse(req, res, 200, insert_depart);
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async EditDepartment(req, res) {
    try {
      const editemp = await Department.findOne({
        where: {
          department_id: req.params.id,
        },
      });
      if (editemp) {
        const existingDepart = await Department.findOne({
          where: {
            department_name: req.body.department_name,
            department_id: { [Op.ne]: req.params.id },
          },
        });

        if (existingDepart) {
          await ResponseManager.ErrorResponse(
            req,
            res,
            400,
            "Department already exists"
          );
          return;
        }

        await Department.update(
          {
            department_name: req.body.department_name,
          },
          {
            where: {
              department_id: req.params.id,
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
    try {
      const deletecate = await Department.findOne({
        where: {
          department_id: req.params.id,
        },
      });
      const checkEmployee = await Employee.findOne({
        where: {
          department_id: req.params.id,
        },
      });
      if (checkEmployee) {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "Cant Delete bacause Employee is binding"
        );
      }
      if (deletecate) {
        await Department.destroy({
          where: {
            department_id: req.params.id,
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

  static async DeleteLeave(req, res) {
    try {
      const deletecate = await Leaving.findOne({
        where: {
          leaving_id: req.params.id,
        },
      });

      if (deletecate) {
        await Leaving.destroy({
          where: {
            leaving_id: req.params.id,
          },
        });
        return ResponseManager.SuccessResponse(req, res, 200, "Leave Deleted");
      } else {
        return ResponseManager.ErrorResponse(req, res, 400, "No Leave found");
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async getDepartment(req, res) {
    try {
      const { bus_id } = req.userData;
      const departments = await Department.findAll({
        where: {
          bus_id: bus_id,
        },
      });

      let datalist = [];

      for (const property in departments) {
        const data = {};
        data.department_id = departments[property].department_id;
        data.department_name = departments[property].department_name;

        const employee = await Employee.findAll({
          where: {
            department_id: departments[property].department_id.toString(),
            bus_id: bus_id,
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
      const { userRole, user_id, userEmail } = req.userData;
      const { bus_id } = req.userData;

      let result = [];
      let paymentslist = [];

      if (userRole === "SUPERUSER" || userRole === "MANAGER") {
        paymentslist = await Salary_pay.findAll({
          include: [{ model: Employee, include: [Position, Department] }],
          where: { bus_id: bus_id },
        });

        result = create_payment_rows(paymentslist);

      } else if (userRole === "SALE") {
        paymentslist = await Salary_pay.findAll({
          include: [
            {
              model: Employee,
              where: {
                email: userEmail,
              },
              include: [Position, Department],
            },
          ],
          where: { bus_id: bus_id },
        });

         result = create_payment_rows(paymentslist);
      }

      return ResponseManager.SuccessResponse(req, res, 200, result);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async getEmployeeSalary(req, res) {
    try {
      const { userRole, user_id, userEmail } = req.userData;
      const { bus_id } = req.userData;

      let result = [];
      let employeeslist = [];

      if (userRole === "SUPERUSER") {
        employeeslist = await Employee.findAll({
          where: {
            bus_id: bus_id,
            first_name: {
              [Op.ne]: "-",
            },
            last_name: {
              [Op.ne]: "-",
            },
          },
          include: [{ model: Position }, { model: Department }],
        });

        result = create_employee_rows(employeeslist);

      } else if (userRole === "SALE") {
        employeeslist = await Employee.findAll({
          where: {
            email: userEmail,
            bus_id: bus_id,
            first_name: {
              [Op.ne]: "-",
            },
            last_name: {
              [Op.ne]: "-",
            },
          },
          include: [{ model: Position }, { model: Department }],
        });

        result = create_employee_rows(employeeslist);

      } else if (userRole === "MANAGER") {
        const userData = await Employee.findOne({
          where: {
            email: userEmail,
          },
          include: [
            {
              model: Department,
            },
          ],
        });

        if (!userData || !userData.department) {
          return await ResponseManager.ErrorResponse(
            req,
            res,
            404,
            "Manager department data not found"
          );
        }

        const userdepart = userData.department.department_id;

        employeeslist = await Employee.findAll({
          where: {
            department_id: userdepart,
            bus_id: bus_id,
            email: {
              [Op.ne]: userEmail,
            },
            first_name: {
              [Op.ne]: "-",
            },
            last_name: {
              [Op.ne]: "-",
            },
          },
          include: [{ model: Position }, { model: Department }],
        });

        result = create_employee_rows(employeeslist);

      }

      return ResponseManager.SuccessResponse(req, res, 200, result);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async EditSalary(req, res) {
    try {
      const editemp = await Salary_pay.findOne({
        where: {
          payment_id: req.params.id,
        },
      });
      if (editemp) {
        const existingPosition = await Salary_pay.findOne({
          where: {
            round: req.body.round,
            month: req.body.month,
            payment_id: { [Op.ne]: req.params.id },
          },
        });

        if (existingPosition) {
          await ResponseManager.ErrorResponse(
            req,
            res,
            400,
            "salary already exists"
          );
          return;
        }

        await Salary_pay.update(
          {
            Date: req.body.Date,
            round: req.body.round,
            month: req.body.month,
            year: req.body.year,
          },
          {
            where: {
              payment_id: req.params.id,
            },
          }
        );
        return ResponseManager.SuccessResponse(req, res, 200, "salary Updated");
      } else {
        return ResponseManager.ErrorResponse(req, res, 400, "No salary found");
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async DeleteSalary(req, res) {
    try {
      const deletecate = await Salary_pay.findOne({
        where: {
          payment_id: req.params.id,
        },
      });
      if (deletecate) {
        await Salary_pay.destroy({
          where: {
            payment_id: req.params.id,
          },
        });
        return ResponseManager.SuccessResponse(req, res, 200, "salary Deleted");
      } else {
        return ResponseManager.ErrorResponse(req, res, 400, "No salary found");
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async getEmployeeQuotation(req, res) {
    try {

      const { userRole, user_id, userEmail } = req.userData;

      const { bus_id } = req.userData;
      let result = [];
      let employeeslist = [];

      if (userRole === "SUPERUSER") {
        employeeslist = await Employee.findAll({
          where: {
            bus_id: bus_id,
            first_name: {
              [Op.ne]: "-",
            },
            last_name: {
              [Op.ne]: "-",
            },
          },
          include: [{ model: Position }, { model: Department }],
        });
        
        result = create_employee_rows(employeeslist);
        
      } else if (userRole === "SALE") {
        employeeslist = await Employee.findAll({
          where: {
            email: userEmail,
            bus_id: bus_id,
            first_name: {
              [Op.ne]: "-",
            },
            last_name: {
              [Op.ne]: "-",
            },
          },
          include: [{ model: Position }, { model: Department }],
        });

       result = create_employee_rows(employeeslist);

      } else if (userRole === "MANAGER") {
        const userData = await Employee.findOne({
          where: {
            email: userEmail,
          },
          include: [
            {
              model: Department,
            },
          ],
        });

        if (!userData || !userData.department) {
          return await ResponseManager.ErrorResponse(
            req,
            res,
            404,
            "Manager department data not found"
          );
        }

        const userdepart = userData.department.department_id;

        employeeslist = await Employee.findAll({
          where: {
            department_id: userdepart,
            bus_id: bus_id,
            email: {
              [Op.ne]: userEmail,
            },
            first_name: {
              [Op.ne]: "-",
            },
            last_name: {
              [Op.ne]: "-",
            },
          },
          include: [{ model: Position }, { model: Department }],
        });

        result = create_employee_rows(employeeslist);
      }

      return ResponseManager.SuccessResponse(req, res, 200, result);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async AddPosition(req, res) {
    try {
      const { bus_id } = req.userData;

      const adddepart = await Position.findOne({
        where: {
          position_name: req.body.position_name,
          bus_id: bus_id,
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
          position_name: req.body.position_name,
          bus_id: bus_id,
        });
        console.log(req.body);
        return ResponseManager.SuccessResponse(req, res, 200, insert_depart);
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async EditPosition(req, res) {
    try {
      const editemp = await Position.findOne({
        where: {
          position_id: req.params.id,
        },
      });
      if (editemp) {
        const existingPosition = await Position.findOne({
          where: {
            position_name: req.body.position_name,
            position_id: { [Op.ne]: req.params.id },
          },
        });

        if (existingPosition) {
          await ResponseManager.ErrorResponse(
            req,
            res,
            400,
            "Position already exists"
          );
          return;
        }

        await Position.update(
          {
            position_name: req.body.position_name,
          },
          {
            where: {
              position_id: req.params.id,
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
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "No Position found"
        );
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async DeletePosition(req, res) {
    try {
      const deletecate = await Position.findOne({
        where: {
          position_id: req.params.id,
        },
      });
      if (deletecate) {
        await Position.destroy({
          where: {
            position_id: req.params.id,
          },
        });
        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Position Deleted"
        );
      } else {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "No Position found"
        );
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async getPosition(req, res) {
    try {
      const { bus_id } = req.userData;

      const Positions = await Position.findAll({
        where: {
          bus_id: bus_id, // กรองข้อมูลที่ bus_id ตรงกับที่ผู้ใช้มี
        },
      });

      return ResponseManager.SuccessResponse(req, res, 200, Positions);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async AddPayment(req, res) {
    try {
      const { bus_id } = req.userData;

      let datalist = [];
      var data_arry = {};

      if (
        req.body.payments[0].month === "" ||
        req.body.payments[0].round === "" ||
        req.body.payments[0].year === ""
      ) {
        return ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "กรุณาใส่ เดือน ปี และ รอบเงินเดือน"
        );
      }

      const paymentPromises = req.body.payments.map(async (payment) => {
        const existingPayment = await Salary_pay.findOne({
          where: {
            month: payment.month,
            round: payment.round,
            year: payment.year,
            employee_id: payment.employee_id,
            bus_id: bus_id,
          },
        });

        if (existingPayment) {
          throw new Error("Duplicate payment found");
        }

        // Create a new payment record
        await Salary_pay.create({
          employee_id: payment.employee_id,
          Date: payment.Date,
          round: payment.round,
          month: payment.month,
          year: payment.year,
          bus_id: bus_id,
        });
      });

      try {
        // Wait for all payment processing to complete
        await Promise.all(paymentPromises);
        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          req.body.payments
        );
      } catch (error) {
        return ResponseManager.ErrorResponse(req, res, 400, error.message);
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async AddPayment2(req, res) {
    try {
      const { bus_id } = req.userData;

      if (!req.body.payments || !Array.isArray(req.body.payments)) {
        return ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "Invalid request format. Missing payments array."
        );
      }

      const paymentCreationPromises = [];

      for (const paymentData of req.body.payments) {
        const existingPayment = await Salary_pay.findOne({
          where: {
            month: paymentData.month,
            round: paymentData.round,
            year: paymentData.year,
            employee_id: paymentData.employee_id,
            bus_id: bus_id,
          },
        });

        if (existingPayment) {
          return ResponseManager.ErrorResponse(
            req,
            res,
            400,
            "Duplicate payment entry."
          );
        } else {
          paymentCreationPromises.push(
            Salary_pay.create({
              employee_id: paymentData.employee_id,
              Date: paymentData.Date,
              round: paymentData.round,
              month: paymentData.month,
              year: paymentData.year,
              bus_id: bus_id,
            })
          );
        }
      }
      return ResponseManager.SuccessResponse(req, res, 200, "success payment ");
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async AddLeave(req, res) {
    try {
      const data = await Leaving.findOne({
        where: {
          employee_id: req.body.employee_id,
          date_start: req.body.date_start,
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
          employee_id: req.body.employee_id,
          date_start: req.body.date_start, // TODO1 fix frontend req.body.date to req.body.date_start
          date_end: req.body.date_end, // TODO2 fix frontend req.body.dateEnd to req.body.date_end
          detail: req.body.detail,
        });

        return ResponseManager.SuccessResponse(req, res, 200, data_leaving);
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async EditLeave(req, res) {
    try {
      const data = await Leaving.findOne({
        where: {
          leaving_id: req.params.id,
        },
      });

      if (!data) {
        return ResponseManager.SuccessResponse(
          req,
          res,
          400,
          "Not found leaving_id"
        );
      } else {
        const body = {
          date_start: req.body.date, // TODO1
          date_end: req.body.dateEnd, // TODO2
          detail: req.body.detail,
          employee_id: req.body.employee_id,
        };
        await Leaving.update(body, {
          where: {
            leaving_id: req.params.id,
          },
        });
        return ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Edit Leave Success"
        );
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async getLeave(req, res) {
    try {
      const { userRole, user_id, userEmail } = req.userData;
      const { bus_id } = req.userData;
      let data_leave;

      if (userRole === "SUPERUSER") {
        data_leave = await Leaving.findAll({
          include: [
            {
              model: Employee,
              where: { bus_id: bus_id },
            },
          ],
        });
      } else if (userRole === "SALE") {
        data_leave = await Leaving.findAll({
          include: [
            {
              model: Employee,
              where: {
                bus_id: bus_id,
                email: userEmail,
              },
            },
          ],
        });
      } else if (userRole === "MANAGER") {
        const userData = await Employee.findOne({
          where: {
            email: userEmail,
            bus_id: bus_id,
          },
          include: [
            {
              model: Department,
            },
          ],
        });

        if (!userData || !userData.department) {
          return await ResponseManager.ErrorResponse(
            req,
            res,
            404,
            "Manager department data not found"
          );
        }

        const userdepart = userData.department.department_id;

        data_leave = await Leaving.findAll({
          include: [
            {
              model: Employee,
              where: {
                department_id: userdepart,
                bus_id: bus_id,
                email: {
                  [Op.ne]: userEmail,
                },
              },
            },
          ],
        });
      }

      return ResponseManager.SuccessResponse(req, res, 200, data_leave);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async AddOvertime(req, res) {
    try {
      const data = await Overtime.findOne({
        where: {
          employee_id: req.body.employee_id,
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
          employee_id: req.body.employee_id,
          date: req.body.date,
          detail: req.body.detail,
          hours: req.body.hours,
          rate: req.body.rate,
          total: req.body.total,
        });
        console.log(req.body);
        return ResponseManager.SuccessResponse(req, res, 200, data_overtime);
      }
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async getOvertime(req, res) {
    try {
      const { userRole, user_id, userEmail } = req.userData;
      const { bus_id } = req.userData;
      let data_overtime;

      if (userRole === "SUPERUSER" || userRole === "MANAGER") {
        data_overtime = await Overtime.findAll({
          include: [
            {
              model: Employee,
              where: { bus_id: bus_id },
            },
          ],
        });
      } else if (userRole === "SALE") {
        data_overtime = await Overtime.findAll({
          include: [
            {
              model: Employee,
              where: {
                bus_id: bus_id,
                email: userEmail,
              },
            },
          ],
        });
      }

      return ResponseManager.SuccessResponse(req, res, 200, data_overtime);
    } catch (err) {
      return ResponseManager.CatchResponse(req, res, err.message);
    }
  }
}

module.exports = EmployeeController;
