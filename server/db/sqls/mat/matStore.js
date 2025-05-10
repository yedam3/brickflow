const possilbleList = `
  SELECT o.mat_order_code,
        m.check_code,
	      m.mat_code,
        getComName(o.company_code) company_name,
        getMatName(m.mat_code) mat_name,
        m.mat_check_pass - sum(IFNULL(store_quantity,0)) AS mat_check_pass
FROM mat_check m LEFT JOIN mat_store s 
						ON(m.check_code = s.check_code)
                      JOIN matOrderDetail d
				        ON(m.mat_order_detailCode = d.mat_order_detailCode)
					  JOIN matOrders o
                        ON(o.mat_order_code = d.mat_order_code)
                  
WHERE mat_check_pass > 0
GROUP BY  o.mat_order_code,
          m.check_code,
	        m.mat_code
HAVING 1=1
AND  mat_check_pass > 0
:searchcondition
`;
//lot 자동증가
const autoMatLot = `
 SELECT CONCAT('mat-lot-',IFNULL(MAX(CAST(SUBSTR(mat_lot,9) AS SIGNED)),100)+1) AS mat_lot
 FROM mat_store
`
//창고리스트 조회
const storeList = `
 SELECT storage_code,
        store_name
  FROM storage
  WHERE store_type='ST1'
`
//등록 수정 체크
const countCheck = `
  SELECT count(*) AS countCheck
  FROM mat_store
  WHERE mat_lot = ?
`
const addSMattore = `
  INSERT INTO mat_store (mat_lot,
                       store_date,
                       emp_code,
                       mat_code,
                       store_quantity,
                       note,
                       check_code)
SELECT CONCAT('mat-lot-',IFNULL(MAX(CAST(SUBSTR(mat_lot,9) AS SIGNED)),100)+1),CURDATE(),?,?,?,?,?
 FROM mat_store
`
const addStore = `
 INSERT INTO store(store_code,
                  doc_code,
                  item_code,
                  lot,
                  inbound_quantity,
                  storage_code)
SELECT CONCAT('str-',IFNULL(MAX(CAST(SUBSTR(store_code,5) AS SIGNED)),100)+1) ,?,?,?,?,?
FROM store
`
const updateMatStore= `
  UPDATE mat_store
  SET  emp_code = ?,
       mat_code= ?,
       store_quantity= ?,
       note=?
  WHERE mat_lot = ? 
`
const updateStore = `
  UPDATE store
  SET item_code = ?,
      lot = ?,
      inbound_quantity = ?,
      storage_code = ? 
  WHERE doc_code = ? 
`
//입고처리조회 모달창
const storageList = `
 SELECT m.emp_code,
       m.mat_lot,
	   m.mat_code,
       getMatName(m.mat_code) AS mat_name,
       m.store_quantity,
       s.storage_code,
       r.store_name,
       c.check_code,
       c.mat_check_pass - (SELECT sum(store_quantity)
                            FROM mat_store
                            WHERE check_code = c.check_code
                           ) + m.store_quantity AS mat_check_pass
FROM mat_store m JOIN store s
                   ON (m.mat_lot =s.doc_code)
				 JOIN storage r
                  ON(s.storage_code = r.storage_code)
                JOIN mat_check c
                  ON(c.check_code = m.check_code)
GROUP BY m.emp_code,
       m.mat_lot,
	   m.mat_code,
              m.store_quantity,
       s.storage_code,
       r.store_name
HAVING 1=1
:searchcondition
`
//삭제
const storeDelete = `
  DELETE FROM mat_store
  WHERE mat_lot = ? 
`
//삭제
const storageDelete =`
  DELETE FROM store
  WHERE doc_code = ? 
`

//자재출고확인
const matUseCheck = `
 SELECT count(*) useCheck
 FROM mat_store s JOIN mat_hold h
                   ON(s.mat_lot = h.mat_lot)
WHERE s.mat_lot = ? 
`


//자재 재고 확인 
const matStorePageList = `
 SELECT 
    m.mat_code,
    mat_name,
    SUM(IFNULL(inbound_quantity,0)) - SUM(IFNULL(dispatch_quantity,0)) AS store_quantity,
    safe_inventory,
    CASE 
        WHEN safe_inventory - (SUM(IFNULL(inbound_quantity,0)) - SUM(IFNULL(dispatch_quantity,0))) < 0 
            THEN 0
        ELSE safe_inventory - (SUM(IFNULL(inbound_quantity,0)) - SUM(IFNULL(dispatch_quantity,0)))
    END AS require_quantity,
    CASE 
        WHEN safe_inventory = 0 THEN 0
        WHEN ROUND(((SUM(IFNULL(inbound_quantity,0)) - SUM(IFNULL(dispatch_quantity,0))) / safe_inventory) * 100) >100 THEN 100
        ELSE ROUND(((SUM(IFNULL(inbound_quantity,0)) - SUM(IFNULL(dispatch_quantity,0))) / safe_inventory) * 100)
    END AS percentage

FROM mat m 
LEFT JOIN store s ON m.mat_code = s.item_code
WHERE 1=1
:searchcondition
GROUP BY m.mat_code
ORDER BY percentage ASC;
`

const matLotList = `
 SELECT 
    m.mat_code,
    mat_name,
    lot,
    SUM(IFNULL(inbound_quantity,0)) - SUM(IFNULL(dispatch_quantity,0)) AS store_quantity,
    s.storage_code,
    store_name
    FROM mat m 
LEFT JOIN store s ON m.mat_code = s.item_code
	 JOIN storage r ON s.storage_code = r.storage_code
WHERE m.mat_code = ?
GROUP BY  lot
HAVING store_quantity > 0
`
module.exports = {
  possilbleList,
  autoMatLot,
  storeList,
  countCheck,
  addStore,
  addSMattore,
  updateMatStore,
  updateStore,
  storageList,
  storeDelete,
  storageDelete,
  matUseCheck,
  matStorePageList,
  matLotList
}