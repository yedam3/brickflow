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

const finishCheck = ` 
 SELECT COUNT(*) AS COUNT
FROM finishStore f JOIN prod_check c ON(f.prod_check_code = c.prod_check_code)
WHERE c.prod_check_code = ?
`
const finishList = `
SELECT prod_lot,
	   prod_code,
       getProdName(prod_code) AS prod_name,
       quantity,
       prod_check_code,
       store_date,
       storage_code
FROM finishStore f JOIN store s ON (f.prod_lot = s.doc_code)
ORDER BY prod_lot DESC
`

const possibleProdQuantity = `
SELECT c.prod_check_code,
	    getProdName(c.prod_code) AS prod_name,
	    work_lot,
	    c.prod_code,
        pass_quantity - sum(IFNULL(quantity,0)) + ? AS pass_quantity
FROM prod_check c  LEFT JOIN finishStore f
                  ON(c.prod_check_code = f.prod_check_code)
WHERE c.prod_code = ? 
GROUP BY c.prod_check_code
HAVING pass_quantity > 0
`

const finishUpdate = `
    UPDATE finishStore
    SET quantity = ?
    WHERE PROD_lot= ?
`
const finishStoreUpdate = `
   UPDATE store
SET inbound_quantity= ?,
    storage_code = ? 
WHERE doc_code = ?
`
//출고값 있는지 체크
const deliveryFinishCheck = `
  SELECT COUNT(*) AS count
FROM delivery_manage_detail d JOIN finishStore s 
                               ON(d.prod_lot = s.prod_lot)
WHERE s.prod_lot = ? 
`

const deleteFinish = `
  DELETE FROM finishStore
  WHERE prod_lot = ? 
`

const deleteStore = `
   DELETE FROM store
   WHERE doc_code = ? 
`
const prodStoreList = `
  SELECT 
   p.prod_code,
   prod_name,
   SUM(IFNULL(inbound_quantity,0)) - SUM(IFNULL(dispatch_quantity,0)) AS store_quantity,
   proper_store,
   size,
   weight,
   CASE 
        WHEN proper_store - (SUM(IFNULL(inbound_quantity,0)) - SUM(IFNULL(dispatch_quantity,0))) < 0 
            THEN 0
        ELSE proper_store - (SUM(IFNULL(inbound_quantity,0)) - SUM(IFNULL(dispatch_quantity,0)))
    END AS require_quantity,
	CASE 
        WHEN proper_store = 0 THEN 0
        WHEN ROUND(((SUM(IFNULL(inbound_quantity,0)) - SUM(IFNULL(dispatch_quantity,0))) / proper_store) * 100) >100 THEN 100
        ELSE ROUND(((SUM(IFNULL(inbound_quantity,0)) - SUM(IFNULL(dispatch_quantity,0))) / proper_store) * 100)
    END AS percentage
    FROM prod p 
    LEFT JOIN store s ON p.prod_code = s.item_code
    WHERE 1=1 
    :searchcondition
    GROUP BY p.prod_code
    ORDER BY percentage
`
const prodLotList = `
  SELECT 
    p.prod_code,
    prod_name,
    lot,
    SUM(IFNULL(inbound_quantity,0)) - SUM(IFNULL(dispatch_quantity,0)) AS store_quantity,
    s.storage_code,
    store_name
    FROM prod p 
LEFT JOIN store s ON p.prod_code= s.item_code
	 JOIN storage r ON s.storage_code = r.storage_code
WHERE p.prod_code = ?
GROUP BY  lot
HAVING store_quantity > 0
`
module.exports = {
  storeProdList,
  maxProdLot,
  addFinshied,
  storeFinished,
  finishCheck,
  finishList,
  possibleProdQuantity,
  finishUpdate,
  finishStoreUpdate,
  deliveryFinishCheck,
  deleteFinish,
  deleteStore,
  prodStoreList,
  prodLotList
}
