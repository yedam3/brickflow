const mariaDB = require("../../db/mapper.js");
const { convertObjToAry } = require("../../utils/converts.js");

const findAll = async ()=>{
    let list = await mariadb.query('boardList'); 
    return list;
  }

module.exports = {
    
}