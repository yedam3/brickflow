// prod_check_code 자동 생성
const autoEmpCode = 
`SELECT CONCAT('emp-',IFNULL(MAX(CAST(SUBSTR(emp_code,5) AS SIGNED)),100)+1) AS emp_code
FROM employees`;

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

// 사원 등록
const empSave = `INSERT INTO employees(emp_code, emp_name, department, hire_date, tel, pwd)
                    VALUES(?, ?, ?, NOW(), ?, ?)`

// 부서리스트 조회
const departmentList = `SELECT main_code,
	                             main_code_name
                        FROM main_codes
	                      WHERE main_code = 'dp'`
module.exports 
= {
  autoEmpCode,
  empList,
  empInfo,
  empSave,
  departmentList,
}