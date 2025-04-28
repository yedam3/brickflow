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
const salesOrderAdd = 
`INSERT INTO orders(orders_code, order_name, orders_date, del_date, employee_code, note, finish_status, company_code)
VALUES( ? , ? , ? , ? , ? , ? , ? , ? )`;

//수정 및 등록 체크
const addCheck = `
  SELECT COUNT(*) AS checkCount
  FROM orders
  WHERE orders_code = ?
`
module.exports = {
  prodComList,
  salesOrderAdd,
  addCheck,
};