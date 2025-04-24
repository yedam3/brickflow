const mariaDB = require("../db/mapper.js");
const { convertObjToAry } = require("../utils/converts.js");
const findAll = async () => {
    // 변수 mariadb에 등록된 query 함수를 통해 서비스에서 필요한 SQL문을 실행하도록 요청
    // -> 비동기작업이므로 await/async를 활용해서 동기식으로 동작하도록 진행
    let list = await mariaDB
        .query("selectBookList")
        .catch((err) => console.log(err));
    return list;
};
module.exports = {
    findAll
}