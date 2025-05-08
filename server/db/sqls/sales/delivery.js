//출고 가능 수량그리드에 조회
const prodcheck = `
SELECT SUM(inbound_quantity) - SUM(dispatch_quantity) as delivery_before_quantity,
        item_code as prod_code,
         getProdName(item_code) AS prod_name,
          lot as prod_LOT
FROM store
WHERE item_code =?
GROUP BY item_code, lot
HAVING SUM(inbound_quantity) - SUM(dispatch_quantity) > 0;`

// 출고코드 자동 부여
const deliveryAutoOrder =
  `SELECT CONCAT('DEL-', IFNULL(MAX(CAST(SUBSTR(delivery_code, 5) AS SIGNED)), 100) + 1) AS code
  FROM delivery_manage`;

// 상세출고코드 자동 부여
const deliveryAutoDetailOrder =
  `SELECT CONCAT('DEL-', IFNULL(MAX(CAST(SUBSTR(delivery_code, 5) AS SIGNED)), 100) + 1) AS code
  FROM delivery_manage_detail`;

//등록
const deliveryAdd =
  `INSERT INTO delivery_manage(delivery_code, orders_code, company_code, employee_code, delivery_date)
VALUES( ? , ? , ? , ? , ? )`;

//상세등록
const deliveryDetailAdd =
  `INSERT INTO delivery_manage_detail(delivery_detail_code, prod_code, delivery_quantity, prod_LOT, delivery_code)
VALUES( ? , ? , ? , ? , ?)`;

//수정
const deliveryUpdate = `
UPDATE delivery_manage
SET ?
WHERE delivery_code = ?`

//상세 수정
const deliveryDetailUpdate = `
UPDATE delivery_manage_detail
SET ?
WHERE delivery_detail_code = ?`



//삭제
const deliveryDelete =
  `DELETE FROM delivery_manage
WHERE delivery_code = ? `;
//상세삭제
const deliveryDetailDelete =
  `DELETE FROM delivery_manage_detail
WHERE delivery_code = ? `;

//수정 및 등록 체크
const addCheck = `
  SELECT COUNT(*) AS checkCount
  FROM delivery_manage
  WHERE delivery_code = ?
`


module.exports = {
  deliveryAdd,
  deliveryAutoOrder,
  deliveryDetailAdd,
  deliveryDelete,
  deliveryDetailDelete,
  prodcheck,
  addCheck,
  deliveryAutoDetailOrder,
  deliveryUpdate,
  deliveryDetailUpdate,
}