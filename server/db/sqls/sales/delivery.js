

//등록
const deliveryAdd =
  `INSERT INTO delivery_manage(delivery_code, orders_code, company_code, employee_code, delivery_date)
VALUES( ? , ? , ? , ? , ? )`;
// delivery_code  자동 부여
const deliveryAutoOrder =
  `SELECT CONCAT('OUT-', IFNULL(MAX(CAST(SUBSTR(delivery_code, 5) AS SIGNED)), 100) + 1) AS code
  FROM delivery_manage`;

//상세등록
const deliveryDetailAdd = 
   `INSERT INTO delivery(delivery_detail_code, prod_code, delivery_quantity, prod_LOT, delivery_code)
VALUES( ? , ? , ? , ? , ? )`;


//삭제
const deliveryDelete =
  `DELETE FROM delivery_manage
WHERE delivery_code = ? `;
//상세삭제
const deliveryDetailDelete =
  `DELETE FROM delivery_manage
WHERE delivery_code = ? `;


module.exports = {
  
  deliveryAdd,
  deliveryAutoOrder,
  deliveryDetailAdd,
  deliveryDelete,
  deliveryDetailDelete

}