const mariaDB = require("../../db/mapper.js");
const { convertObjToQuery } = require("../../utils/converts.js");
const { convertLikeToQuery } = require("../../utils/converts.js");

//완제품 대기리스트 조회
const labeList = async({type, keyword}) => {
    let searchCondition = {};
      let convertedCondition = ''; // 기본값
      if (type && keyword) {
        searchCondition[type] = keyword;
        // selected 배열을 넣어줘야 작동
        const converted = convertLikeToQuery(searchCondition, []); 
        convertedCondition = converted.serchKeyword;
      }
      const result = await mariaDB.query('labelList', { searchcondition: convertedCondition })
                                      .catch((err) => console.log(err));
          return result;
    }

module.exports = {
    labeList
}