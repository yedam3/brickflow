const mariaDB = require("../../db/mapper.js");
const { convertObjToQuery } = require("../../utils/converts.js");
const { convertLikeToQuery } = require("../../utils/converts.js");
//창고 리스트
const storageList = async ({ type, keyword })=>{
   let searchCondition = {};
    let convertedCondition = ''; // 기본값
    if (type && keyword) {
      searchCondition[type] = keyword;
      // selected 배열을 넣어줘야 작동
      const converted = convertLikeToQuery(searchCondition, []); 
      convertedCondition = converted.serchKeyword;
    }
    const result = await mariaDB.query('storageList', { searchcondition: convertedCondition })
                                    .catch((err) => console.log(err));
        return result;
}
//창고리스트
const storeList = async () => {
  const result =await mariaDB.query('storeList');
  return result;
}

module.exports={
  storageList,
  storeList
  
}