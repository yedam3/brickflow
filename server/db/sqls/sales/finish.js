//창고리스트 조회
const storeProdList = `
 SELECT storage_code,
        store_name
  FROM storage
  WHERE store_type='ST3'
`
const maxProdLot = `
  SELECT CONCAT('PROD-LOT-', IFNULL(MAX(CAST(SUBSTR(prod_lot, 10) AS SIGNED)), 100) + 1) AS code
  FROM finishStore
`
const addFinshied = `
INSERT INTO finishStore (prod_lot,
                         prod_code,
                         quantity,
                         store_date,
                         employee_code,
                         prod_check_code)
SELECT CONCAT('PROD-LOT-', IFNULL(MAX(CAST(SUBSTR(prod_lot, 10) AS SIGNED)), 100) + 1),?,?,?,?,?
  FROM finishStore
`
const storeFinished =`
  INSERT INTO store (store_code,
                         doc_code,
                         item_code,
                         lot,
                         inbound_quantity,
                         storage_code)
SELECT CONCAT('STR-', IFNULL(MAX(CAST(SUBSTR(store_code, 5) AS SIGNED)), 100) + 1),?,?,?,?,?
  FROM store
` 


module.exports = {
  storeProdList,
  maxProdLot,
  addFinshied,
  storeFinished
}
