const mariaDB = require("../../db/mapper.js");
const { convertObjToAry } = require("../../utils/converts.js");

const findAll = async () => {
  let list = await mariaDB.query("testList").catch(err => console.log(err));
}
module.exports = {
    findAll,
}