const { forEach } = require("lodash");
const mariaDB = require("../../db/mapper.js");
const { convertObjToAry } = require("../../utils/converts.js");
const { retry } = require("rxjs");
const { empSave } = require("../../db/sqlList.js");

//사원조회
const empList = async () => {
  let list = await mariaDB.query('empList')
                          .catch((err) => console.log(err));
  return list;
}
//사원상세조회
const empInfo = async (empno) => {
  let list = await mariaDB.query('empInfo',empno)
                          .catch((err) => console.log(err));
  return list;
}

//사원등록
const saveEmp = async(empList,empInfo)=>{

for(let value of empSave){
  let addColumn = ['emp_code', 'emp_name', 'department', 'hire_date', 'pwd'];
  let addEmp = convertObjToAry(value,addColumn);

// emp_code증가
//emp_code 자동생성 SELECT문 조회
let empList = await mariaDB.query('empSave', addEmp);
// 그결과를 newEmpCode라는 변수에 담고
let newEmpCode = resList[0].emp_code;
// addBom에 첫번째 값으로 추가
addEmp.unshift(newEmpCode);

let resList = await mariaDB.query('empSave', addEmp)
                                  .catch((err) => console.log(err));
}
return result;
}
//부서리스트
const EmpCodeList = async () => {
  const result = await mariaDB.query('departmentList');
  return result;
}

module.exports 
= {
  empList,
  empInfo,
  saveEmp,
  EmpCodeList,
}