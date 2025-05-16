const mariaDB = require("../../db/mapper.js");
const {convertObjToAry} = require("../../utils/converts.js");

//등록
const prodAdd = async (rowData) => {
  let result = ['prod_code', 'prod_name','unit', 'by_unit_number', 'proper_store',' size',' weight'];
  let data = convertObjToAry(rowData, result);
  let resInfo = await mariaDB.query("addInputAdd", data).catch(err => console.log(err));
  return resInfo;
}

module.exports = {
  prodAdd,

}