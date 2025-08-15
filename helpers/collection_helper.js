function create_employee_rows(employeeslist) {
    let result = [];

    employeeslist.forEach((log) => {
        result.push({
          employee_id: log.employee_id,
          name: log.first_name + " " + log.last_name,
          employee_type: log.employee_type,
          phone: log.phone_number,
          email: log.email,
          department: log.department ? log.department.departmentName : "",
          position: log.position ? log.position.Position : "",
          bank_name: log.bank_name,
          bank_account_id: log.bank_account_id,
          salary: log.salary,
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
            salary: log.employee.salary,
          });
        });

    return result;
}

module.exports = {create_employee_rows, create_payment_rows};