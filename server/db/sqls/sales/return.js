// 조회
const findReturncheck =
  `SELECT getProdName(o.prod_code) AS prod_name, delivery_quantity, prod_LOT, note
FROM order_detail o 
JOIN delivery_manage_detail d ON(o.prod_code = d.prod_code)`


module.exports = {
  findReturncheck,

}