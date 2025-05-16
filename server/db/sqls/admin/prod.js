//prod.js
//prod_code 자동증가
const autoCountProdCode =
  `SELECT CONCAT('PROD-',IFNULL(MAX(CAST(SUBSTR(prod_code,5) AS SIGNED)),100)+1) AS prod_code
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

module.exports = {
  autoCountProdCode,
  addInputAdd,
  
}