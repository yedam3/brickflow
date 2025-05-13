const { forEach } = require("lodash");
const mariaDB = require("../../db/mapper.js");
const { convertObjToAry } = require("../../utils/converts.js");
const { retry } = require("rxjs");

// 사원조회
const empList = async () => {
  let list = await mariaDB.query('empList')
                          .catch((err) => console.log(err));
  return list;
}
// 사원상세조회
const empInfo = async (empno) => {
  let list = await mariaDB.query('empInfo',empno)
                          .catch((err) => console.log(err));
  return list;
}
module.exports 
= {
  empList,
  empInfo,
}