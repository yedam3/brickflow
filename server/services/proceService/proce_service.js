const mariaDB = require("../../db/mapper.js");

const getCountByLot = async (matLot) => {
    // 첫 번째 쿼리 실행: auto_lot 호출
    let result = await mariaDB.query('callGetCountByLot', [matLot]);
  
    return result[result.length-1]
    
  };
  
  module.exports = {
    getCountByLot,
  };