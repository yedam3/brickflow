// emp_code 자동 생성
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
                    VALUES(?, ?, ?, ?, ?, ?)`;

// 부서리스트 조회
const departmentList = `SELECT sub_code,
		                            sub_code_name
                                FROM sub_codes
                              WHERE main_code = 'dp'`;

// 수정

const empUpdate = `UPDATE employees
                      SET emp_name=?,
                          department =?,
                          hire_date =?,
                          tel =?
                    WHERE emp_code =?`
//삭제
const empDel = `DELETE FROM employees
                    WHERE emp_code=?`


module.exports 
= {
  autoEmpCode,
  empList,
  empInfo,
  empSave,
  departmentList,
  empUpdate,
  empDel,
}