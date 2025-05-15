//출고 가능 수량그리드에 조회
const prodcheck = `
SELECT SUM(IFNULL(inbound_quantity,0)) - SUM(IFNULL(dispatch_quantity,0)) as delivery_before_quantity,
        item_code as prod_code,
         getProdName(item_code) AS prod_name,
          lot as prod_LOT
FROM store
WHERE item_code =?
GROUP BY item_code, lot
 HAVING SUM(IFNULL(inbound_quantity,0)) - SUM(IFNULL(dispatch_quantity,0)) > 0;`

// 출고코드 자동 부여
const deliveryAutoOrder =
  `SELECT CONCAT('DEL-', IFNULL(MAX(CAST(SUBSTR(delivery_code, 5) AS SIGNED)), 100) + 1) AS code
  FROM delivery_manage`;

// 상세출고코드 자동 부여
const deliveryAutoDetailOrder =
  `SELECT CONCAT('DELD-', IFNULL(MAX(CAST(SUBSTR(delivery_detail_code, 6) AS SIGNED)), 100) + 1) AS code
  FROM delivery_manage_detail`;

//등록
const deliveryAdd =
  `INSERT INTO delivery_manage(delivery_code, orders_code, company_code, employee_code, delivery_name, delivery_date)
VALUES( ? , ? , ? , ?,?,now())`;

//상세등록
const deliveryDetailAdd =
  `INSERT INTO delivery_manage_detail(delivery_detail_code, prod_code, delivery_quantity, delivery_code)
VALUES( ? , ? , ? , ?)`;

//수정
const deliveryUpdate = `
UPDATE delivery_manage
SET delivery_name = ?, company_code = ?
WHERE delivery_code = ?`

//상세 수정
const deliveryDetailUpdate = `
UPDATE delivery_manage_detail
SET delivery_quantity =?
WHERE delivery_detail_code = ?`

//재고수정
const storageDeliveryUpdate = `
UPDATE store
SET dispatch_quantity = ?
WHERE doc_code = ?
AND LOT = ?   `



//수정 및 등록 체크
const addCheck = `
  SELECT COUNT(*) AS checkCount
  FROM delivery_manage
  WHERE delivery_code = ?
`
//창고찾기
const findProdStroage = `
 SELECT MAX(storage_code) AS storage_code
 FROM store
 WHERE lot = ?
`
//창고에 값 뺴기
const addStoreProd = `
 INSERT INTO store(store_code,
   doc_code,
   item_code,
   lot,
   dispatch_quantity,
   storage_code)
 SELECT CONCAT('STR-', IFNULL(MAX(CAST(SUBSTR(store_code, 5) AS SIGNED)), 100) + 1), ? , ? , ? , ? , ?
   FROM store
`

// 상태값 
const deliveryStatus = `
UPDATE orders
SET finish_status = ?
WHERE orders_code = ? `


//모달
const deliveryModal = `
   SELECT m.delivery_code,
     delivery_name,
     CONCAT(
       getProdName(prod_code),
       CASE WHEN COUNT(prod_code) > 1 THEN CONCAT(' 외 ', COUNT(DISTINCT prod_code) - 1, '건') ELSE ''
       END
     ) AS prod_name,
     orders_code,
     employee_code,
     company_code,
     getcomName(company_code) AS company_name,
     delivery_date
   FROM delivery_manage m
   JOIN delivery_manage_detail d ON(m.delivery_code = d.delivery_code)
   GROUP BY delivery_code
  `
// // 메인한건 조회
// const deliveryRender =
//   `SELECT  orders_code
//         , order_name
//         , orders_date
//         , del_date
//         , employee_code
//         , company_code
//         , getComName(company_code) AS company_name
//         , note
//   FROM orders
//   WHERE orders_code = ? `;


//출고 상세 
const deliveryDetailRender = `
SELECT orders_detail_code,
       o.orders_code,
        quantity AS delivery_demand,
        delivery_quantity,
        (SELECT IFNULL(SUM(delivery_quantity), 0)
        FROM delivery_manage_detail d JOIN delivery_manage m
             ON(d.delivery_code = m.delivery_code)
         WHERE orders_code = o.orders_code AND prod_code = o.prod_code) AS alreadydelivery,
        quantity - (SELECT IFNULL(SUM(delivery_quantity), 0)
                    FROM delivery_manage_detail d JOIN delivery_manage m ON(d.delivery_code = m.delivery_code)
                     WHERE orders_code = o.orders_code AND prod_code = o.prod_code) AS yetdelivery,
                       price,
                       note,
                       o.prod_code,
                       getProdName(o.prod_code) AS prod_name,
                       finish_status,
                       delivery_detail_code
FROM order_detail o JOIN delivery_manage d ON(o.orders_code = d.orders_code)
JOIN delivery_manage_detail de ON(de.delivery_code = d.delivery_code AND o.prod_code = de.prod_code)
JOIN company c ON(d.company_code = c.company_code)
WHERE o.orders_code = ? AND de.delivery_code = ?
`
//삭제
const deliveryDelete =
  `DELETE FROM delivery_manage
WHERE delivery_code = ? `

//상세삭제
const deliveryDetailDelete =
  `DELETE FROM delivery_manage_detail
WHERE delivery_code = ? `

//창고에서 삭제
const storeDeliveryDelete = `
   DELETE FROM store
   WHERE doc_code = ? 
`


module.exports = {
  deliveryAdd,
  deliveryAutoOrder,
  deliveryDetailAdd,
  prodcheck,
  addCheck,
  deliveryAutoDetailOrder,
  deliveryUpdate,
  deliveryDetailUpdate,
  deliveryDelete,
  deliveryDetailDelete,
  findProdStroage,
  addStoreProd,
  deliveryStatus,
  deliveryModal,
  deliveryDetailRender,
  storageDeliveryUpdate,
  storeDeliveryDelete,


}