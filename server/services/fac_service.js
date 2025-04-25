const mariaDB = require("../db/mapper.js");
const { convertObjToAry } = require("../utils/converts.js");

const findAll = async ()=>{
  let list = await mariaDB.query("selectFacList").catch(err => console.log(err));
  return list;
}

module.exports = {
  findAll,
}