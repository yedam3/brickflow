const mariaDB = require("../../db/mapper.js");
const {
  convertObjToAry
} = require("../../utils/converts.js");

//메인 그리드 조회
const findMainretrun = async (orders_code) => {
  let list = await mariaDB.query("findReturncheck ", orders_code)
  return list;
}



module.exports = {
  findMainretrun,

}