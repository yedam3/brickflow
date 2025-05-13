//사원 목록 조회
const empList = `SELECT emp_code,
	                      emp_name,
                        department,
                        hire_date,
                        tel
                 FROM employees`;

// 사원 상세조회
const empInfo = `SELECT emp_code,
	                      emp_name,
                        department,
                        hire_date,
                        tel
                  FROM employees
                  WHERE emp_code = ?`;
module.exports 
= {
  empList,
  empInfo,
}