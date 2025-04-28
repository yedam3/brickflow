const mariaDB = require("../../db/mapper.js");
const { convertObjToAry } = require("../../utils/converts.js");

const findAllBom = async ()=>{
    let list = await mariadb.query('bomList'); 
    return list;
  }

module.exports = {
  findAllBom,
  
}