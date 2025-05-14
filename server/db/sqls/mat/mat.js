//mat.js
const autoMatCode = `SELECT CONCAT('moc-',IFNULL(MAX(CAST(SUBSTR(mat_order_code,5) AS SIGNED)),100)+1) AS mat_order_code
FROM matOrders;
`;
//자재조회
const matList = `
  SELECT mat_code,
       mat_name,
       unit,
       by_unit_number,
       size,
       safe_inventory
  FROM mat 
  WHERE 1=1
  :searchcondition
`;
//업체명 조회
const comList = `
  SELECT company_code,
       company_name,
       tel,
       address
  FROM company
  WHERE company_type='CT1'
  :searchcondition
`;
//등록
const addMatOrder = `
   INSERT INTO matOrders(mat_order_code,
                         mat_order_name,
                         company_code,
                         request_date,
                         emp_code,
                         note,
                         status,
                         delivery_date)
  
   SELECT CONCAT('moc-',IFNULL(MAX(CAST(SUBSTR(mat_order_code,5) AS SIGNED)),100)+1),
                  ?,
                  ?,
                  ?,
                  ?,
                  ?,
                  'MS1',
                  ?
   FROM matOrders
`
//등록
const addMatDetail = `
  INSERT INTO matOrderDetail (mat_order_detailcode,
                             mat_code,
                             request_quantity,
                             mat_order_code)
  SELECT CONCAT('modc-',IFNULL(MAX(CAST(SUBSTR(mat_order_detailcode,6) AS SIGNED)),100)+1),
         ?,
         ?,
         ?
  FROM matOrderDetail
`
const matOrderList = `
  SELECT 
    m.mat_order_code,
    m.mat_order_name,
    getComName(m.company_code) AS company_name,
    m.request_date,
    m.delivery_date,
    CASE 
        WHEN COUNT(d.mat_code) = 1 THEN getMatName(MIN(d.mat_code))
        ELSE CONCAT(getMatName(MIN(d.mat_code)), ' 외 ', (COUNT(d.mat_code) - 1), '건')
    END AS mat_name,
    SUM(d.request_quantity) AS total_quantity,
    getSUbCodeName(m.status) AS status_name
FROM 
    matOrders m
    JOIN matOrderDetail d ON m.mat_order_code = d.mat_order_code
WHERE 1=1
GROUP BY 
    m.mat_order_code,
    m.company_code,
    m.request_date,
    m.emp_code,
    m.note,
    m.status,
    m.delivery_date,
    m.mat_order_name
HAVING 1=1
:searchcondition
ORDER BY 
   m.status, m.mat_order_code DESC
`
//메인 Render
const orderRender =`
   SELECT mat_order_code,
          mat_order_name,
          company_code,
          getComName(company_code) AS company_name,
          request_date,
          delivery_date,
          emp_code,
          getEmpName(emp_code) AS emp_name,
          note

  FROM matOrders

  WHERE mat_order_code = ? 
`
//상세 그리드 Render
const orderDetailRender =`
   SELECT mat_order_detailcode,
          mat_order_code,
          mat_code,
          getMatName(mat_code) AS mat_name,
          request_quantity
  FROM matOrderDetail
  WHERE mat_order_code = ? 
`
//수정 및 등록 체크
const matAddCheck = `
  SELECT COUNT(*) AS checkCount
  FROM matOrders
  WHERE mat_order_code = ?
`
//메인 업데이트
const updateOrder = `
  UPDATE matOrders
  SET company_code = ?,
      emp_code = ?,
      note = ?,
      delivery_date = ?,
      mat_order_name =?
  WHERE mat_order_code = ?
`
//디테일 업데이트
const updateOrderDetail = `
  UPDATE matOrderDetail
  SET ? 
  WHERE mat_order_detailcode = ?
`
//삭제
const delOrder = `
  DELETE FROM matOrders
  WHERE mat_order_code= ?
`;
const delOrderDetail = `
  DELETE FROM matOrderDetail
  WHERE mat_order_code= ?
`

module.exports = {
  autoMatCode,
  matList,
  comList,
  addMatOrder,
  addMatDetail,
  matOrderList,
  orderRender,
  orderDetailRender,
  matAddCheck,
  updateOrder,
  updateOrderDetail,
  delOrder,
  delOrderDetail

};
