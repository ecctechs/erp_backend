function create_employee_rows(employeeslist) {
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

function create_payment_rows(paymentslist) {
    let result = [];

    paymentslist.forEach((log) => {
        result.push({
            payment_id: log.payment_id,
            date: log.Date,
            round: log.round,
            month: log.month,
            year: log.year,
            employeeID: log.employee.employeeID,
            employeeName: log.employee.F_name + " " + log.employee.L_name,
            position: log.employee.position,
            salary: log.employee.Salary,
          });
        });

    return result;
}

module.exports = {create_employee_rows, create_payment_rows};