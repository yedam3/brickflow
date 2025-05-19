const mariaDB = require("../../db/mapper.js");
const {
  convertObjToAry
} = require("../../utils/converts.js");

//제품코드
const autoProdCode = async () => {
  return mariaDB.query("autoCountProdCode")
    .then(([rows]) => rows)
    .catch(err => {
      console.log("autoProdCode 쿼리 오류 : ", err);
      return [];
    })
}

//조회
const findAllProd = async () => {
  let list = await mariaDB.query('selectProdchoice')
  return list;
}

//등록
const prodAdd = async (rowData) => {
  let result = ['prod_code', 'prod_name', 'unit', 'by_unit_number', 'proper_store', 'size', 'weight'];
  let data = convertObjToAry(rowData, result);
  let resInfo = await mariaDB.query("addInputAdd", data).catch(err => console.log(err));
  return resInfo;
}

//수정
const updateProdNum = async (prodInfo) => {
  let Produpdate = [prodInfo, prodInfo.prod_code];
  let result = await mariaDB.query('updateProdInput', Produpdate).catch((err) => console.log(err));
  return result;
}

//삭제
const deleteProdreset = async (prodCode) => {
  let result = await mariaDB.query('deleteProd', prodCode).catch((err) => console.log(err))
  if (result.affectedRows < 1) {
    return result;
  }
  return result;
}

module.exports = {
  autoProdCode,
  findAllProd, //조회
  prodAdd, //등록
  updateProdNum, //수정
  deleteProdreset, //삭제

}