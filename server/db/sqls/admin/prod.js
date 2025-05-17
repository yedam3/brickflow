//prod.js
//prod_code 자동증가
const autoCountProdCode =
  `SELECT CONCAT('PROD-',IFNULL(MAX(CAST(SUBSTR(prod_code,5) AS SIGNED)),100)+1) AS prod_code
FROM prod`

//조회
const selectProdchoice = 
`SELECT prod_code
              , prod_name
              , unit
              , by_unit_number
              , proper_store
              , size
              , weight
FROM prod`

//제품 등록
const addInputAdd =
  `INSERT INTO prod
              (prod_code
              , prod_name
              , unit
              , by_unit_number
              , proper_store
              , size
              , weight)
VALUES (?, ?, ?, ?, ?, ?, ?)`

//수정
const updateProdInput = 
  `UPDATE prod
  SET ?
  WHERE prod_code = ?`

//삭제
const deleteProd =
  `DELETE FROM prod
WHERE prod_code = ?`

module.exports = {
  autoCountProdCode,  //자동증가
  selectProdchoice,   //제품조회
  addInputAdd,        //제품등록
  updateProdInput,     //제품수정
  deleteProd,         //제품삭제
  
}