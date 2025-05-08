const mariaDB = require("../../db/mapper.js");
const { convertObjToAry, dateFormat } = require("../../utils/converts.js");

// 생산 지시 목록 조회
const findProduct_order = async () => {
    let result = await mariaDB.query('findProduct_order').catch((err) => console.error(err));
    return result;
}

module.exports = {
    findProduct_order,               // 생산 지시 조회
}