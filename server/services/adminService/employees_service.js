const { forEach } = require("lodash");
const mariaDB = require("../../db/mapper.js");
const { convertObjToAry } = require("../../utils/converts.js");
const { retry } = require("rxjs");
const { empSave } = require("../../db/sqlList.js");
//암호화 가능 require
const bcrypt = require("bcrypt"); 
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
const saveEmp = async(empInfo)=>{
  let resList = await mariaDB.query('autoEmpCode')
                              .catch((err) => console.log(err));
  //  // 1. 비밀번호 해시
    const saltRounds = 10;
    const hashedPwd = await bcrypt.hash(empInfo.pwd, saltRounds);
  let result = await mariaDB.query('empSave',[resList[0].emp_code, empInfo.emp_name, empInfo.department,empInfo.hire_date, empInfo.tel, hashedPwd])
                            .catch((err) => console.log(err));
  
return result;
}
//부서리스트
const empCodeList = async () => {
  const result = await mariaDB.query('departmentList')
                               .catch((err) => console.log(err));
  return result;
}

//수정
const empUpdate = async (empInfo) => {
  
  let hashedPwd = null;
  let result = null;
  if(empInfo.pwd){
    console.log('ㅠㅠ서비스',empInfo);
    const saltRounds = 10;
    hashedPwd = await bcrypt.hash(empInfo.pwd, saltRounds);
    console.log('해쉬된 자료',hashedPwd)
    result = await mariaDB.query('empPassUpdate',[empInfo.emp_name, empInfo.department,empInfo.hire_date,empInfo.tel,hashedPwd,empInfo.emp_code])
                          .catch((err) => console.log(err));
    console.log('결관',result)
    return result;
  }
 
  result = await mariaDB.query('empUpdate',[empInfo.emp_name, empInfo.department,empInfo.hire_date,empInfo.tel,empInfo.emp_code])
                        .catch((err) => console.log(err));

  return result;         
}

//삭제
const empDelete = async(emp_code) => {

  let result = await mariaDB.query('empDel',emp_code)
  .catch((err) => console.log(err));
  return result;
}
module.exports 
= {
  empList,
  empInfo,
  saveEmp,
  empCodeList,
  empUpdate,
  empDelete,
}