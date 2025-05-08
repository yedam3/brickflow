const mariaDB = require("../../db/mapper.js");

//로그인
const login = async (id,pwd) => {
  let result = await mariaDB.query('login',id);
  return result;
}
module.exports = {
  login
}