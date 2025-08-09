function create_employee_rows(employeeslist, type) {
    let result = [];

    employeeslist.forEach((log) => {
        result.push({
          employeeID: log.employeeID,
          name: log.F_name + " " + log.L_name,
          employeeType: log.employeeType,
          phone: log.Phone_num,
          email: log.Email,
          department: log.department ? log.department.departmentName : "",
          position: log.position ? log.position.Position : "",
          bankName: log.bankName,
          bankAccountID: log.bankAccountID,
          salary: log.Salary,
        });
      });

    return result;
}

function create_payment_rows(employeeslist, type) {
    let result = [];

    employeeslist.forEach((log) => {
        result.push({
          employeeID: log.employeeID,
          name: log.F_name + " " + log.L_name,
          employeeType: log.employeeType,
          phone: log.Phone_num,
          email: log.Email,
          department: log.department ? log.department.departmentName : "",
          position: log.position ? log.position.Position : "",
          bankName: log.bankName,
          bankAccountID: log.bankAccountID,
          salary: log.Salary,
        });
      });

    return result;
}

module.exports = {create_employee_rows, create_payment_rows};