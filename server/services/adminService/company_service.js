const { forEach } = require("lodash");
const mariaDB = require("../../db/mapper.js");
const { convertObjToAry } = require("../../utils/converts.js");
const { retry } = require("rxjs");
const { company } = require("../../db/sqlList.js");

//업체조회
const  comList= async () => {
  let list = await mariaDB.query('comList')
                          .catch((err) => console.log(err));
  return list;
}

//업체리스트
const comCodeList = async() => {
  const result = await mariaDB.query('comTypeList')
                              .catch((err) => console.log(err));
  return result;
}

//사원상세조회
const comInfo = async(comno) => {
  let list = await mariaDB.query('comInfo',comno)
                          .catch((err) => console.log(err));
  return list;
}

//업체등록
const comSave = async(comSave) => {
  let resList = await mariaDB.query('autoComCode')
                             .catch((err) => console.log(err));
  let result = await mariaDB.query('comSave',[resList[0].company_code, comSave.company_name, comSave.address, comSave.tel, comSave.emp_code, comSave.company_type])
                            .catch((err) => console.log(err));
  return result;
}

//수정
const comUpdate = async(comInfo) => {
  console.log('ㅠㅠ왜그래?' , comInfo);
  let result = await mariaDB.query('comUpdate',[comInfo.company_name, comInfo.address, comInfo.tel, comInfo.emp_code, comInfo.company_type,comInfo.company_code])
                            .catch((err) => console.log(err));
                            
  return result;
}

//삭제
const comDelete = async(comCode) => {
  console.log('삭제왜안돼ㅠ',comCode);
  let result = await mariaDB.query('comDelete',comCode)
                            .catch((err) => console.log(err));
  return result;
}

module.exports 
= {
  comList,
  comCodeList,
  comInfo,
  comSave,
  comUpdate,
  comDelete,
  }

