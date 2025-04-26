const mariaDB = require("../../db/mapper.js");

const autoMatCode = async () => {
  let list = await mariaDB
    .query("autoMatCode")
    .catch((err) => console.log(err));
  return list;
};
const matList = async () => {
  let list = await mariaDB.query("matList").catch((err) => console.log(err));
  return list;
};

module.exports = {
  autoMatCode,
  matList,
};
