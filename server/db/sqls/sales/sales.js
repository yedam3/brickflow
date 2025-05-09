//업체명 조회
const prodComList = `
  SELECT company_code,
       company_name,
       tel,
       address
  FROM company
  WHERE company_type='CT2'
  :searchcondition
`;

//메인조회
const orderschoice =
  `SELECT orders_code
        , order_name
        , orders_date
        , del_date
        , employee_code
        , company_code, getComName(company_code) AS company_name
        , note
  FROM orders `

// 메인한건 조회
const orderinfochoice =
  `SELECT  orders_code
        , order_name
        , orders_date
        , del_date
        , employee_code
        , company_code, getComName(company_code) AS company_name
        , note
  FROM orders
  WHERE orders_code = ? `;

// 상세조회
const selectorders =
  `SELECT orders_detail_code
  , orders_code
  , quantity AS delivery_demand,
    (SELECT IFNULL(SUM(delivery_quantity),0)
     FROM delivery_manage_detail d JOIN delivery_manage m ON(d.delivery_code = m.delivery_code)
     WHERE orders_code = o.orders_code AND prod_code = o.prod_code) AS alreadydelivery,
    quantity - (SELECT IFNULL(SUM(delivery_quantity),0)
     FROM delivery_manage_detail d JOIN delivery_manage m ON(d.delivery_code = m.delivery_code)
      WHERE orders_code = o.orders_code AND prod_code = o.prod_code) AS yetdelivery
    , price
    , note
    , prod_code
    , getProdName(prod_code) AS prod_name
    , finish_status
    FROM order_detail o 
    WHERE orders_code = ?`;

//제품 모달창
const prodselect =
`SELECT od.orders_detail_code, od.orders_code, od.quantity, od.price, od.note, od.prod_code, od.finish_status, prod.prod_name
  FROM order_detail od JOIN prod prod ON od.prod_code = prod.prod_code
  WHERE od.orders_code = ? `;

// orders_code  자동 부여
const salesAutoOrder =
  `SELECT CONCAT('ORD-', IFNULL(MAX(CAST(SUBSTR(orders_code, 5) AS SIGNED)), 100) + 1) AS code
  FROM orders`;

//등록
const salesOrderAdd =
  `INSERT INTO orders(orders_code, order_name, orders_date, del_date, employee_code, note, finish_status, company_code)
VALUES( ? , ? , ? , ? , ? , ? , 'OS1' , ? )`;

// orders_detail_code  자동부여
const salesAutoOrderDetail =
`SELECT CONCAT('OD-',IFNULL(MAX(CAST(SUBSTR(orders_detail_code,4) AS SIGNED)),100)+1) AS code
FROM order_detail`;

//상세등록
const salesOrderDetailAdd =
  `INSERT INTO order_detail(orders_detail_code, orders_code, quantity, price, note, prod_code, finish_status)
VALUES( ? , ?, ? , ? , ? , ? , ?)`;

//수정
const ordersUpdate = `
UPDATE orders
SET ? 
WHERE orders_code = ? ` // [ 객체, 주문번호값]
//상세수정
const ordersUpdateDetail = `
UPDATE order_detail
SET ? 
WHERE orders_detail_code = ? `

//삭제
const orderDelete =
  `DELETE FROM orders
WHERE orders_code = ? `;
//상세삭제
const orderDeleteDetail =
  `DELETE FROM order_detail
WHERE orders_code = ? `;


//수정 및 등록 체크
const addCheck = `
  SELECT COUNT(*) AS checkCount
  FROM orders
  WHERE orders_code = ?
`
module.exports = {
  prodComList,
  orderschoice,
  salesOrderDetailAdd,
  salesOrderAdd,
  addCheck,
  selectorders,
  ordersUpdate,
  orderDelete,
  salesAutoOrder,
  salesAutoOrderDetail,
  orderinfochoice,
  orderDeleteDetail,
  ordersUpdateDetail,
  prodselect,
};