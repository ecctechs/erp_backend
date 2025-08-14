function create_employee_rows(employeeslist) {
    let result = [];

    employeeslist.forEach((log) => {
        result.push({
          employee_id: log.employee_id,
          name: log.first_name + " " + log.last_name,
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
            employee_id: log.employee.employee_id,
            employeeName: log.employee.first_name + " " + log.employee.last_name,
            position: log.employee.position,
            salary: log.employee.Salary,
          });
        });

    return result;
}

module.exports = {create_employee_rows, create_payment_rows};