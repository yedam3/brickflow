const mariaDB = require("../../db/mapper.js");
const { convertObjToAry, dateFormat } = require("../../utils/converts.js");

const findProduct_orderByNotWS3 = async () => {
    let result = await mariaDB.query('findProduct_orderByNotWS3').catch((err) => console.error(err));
    return result;
}

module.exports = {
    findProduct_orderByNotWS3,               // 생산 지시 조회
}