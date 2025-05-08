const login =`
SELECT count(emp_code) AS empCount, 
        pwd,
        department,
        getSUbCodeName(department),
        emp_name
FROM employees
WHERE emp_code = ?
 
`
module.exports={
  login
}