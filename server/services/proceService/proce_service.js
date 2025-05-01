const mariaDB = require("../../db/mapper.js");

const getCountByLot = async (matLot) => {
    // 첫 번째 쿼리 실행: auto_lot 호출
    await mariaDB.query('callGetCountByLot', [matLot]);
  
    //프로시저 out값 가져오기
    const result = await mariaDB.query('selectCnt', []); 
  };
  
  module.exports = {
    getCountByLot,
  };