// db/sqls/admin/processFlow.js

// process_flow_code 자동 생성
const autoProFlowCode = 
`SELECT CONCAT('pro-',IFNULL(MAX(CAST(SUBSTR(process_flow_code,5) AS SIGNED)),100)+1) AS process_flow_code
FROM process_flow`;

// 공정흐름도 관리
// 1.제품 조회
const flowProdList = `SELECT prod_code,
                      prod_name
                      FROM prod`;

// 3.공정조회
const procList = `SELECT process_flow_code,
                         process_date,
                         process_sequence,
                         emp_code,
                         prod_code,
                         pf.process_code,
                         getProdName(prod_code) as prod_name,
                         p.process_name
                  FROM process_flow pf 
                  JOIN process p
                       ON (pf.process_code = p.process_code)
                  WHERE pf.prod_code = ?`; 

// 3.공정 저장
// 일단 다 삭제
const procDelete = `DELETE FROM process_flow
                    WHERE prod_code = ?`;

// 삭제 후 다시 등록
const procSave = `INSERT INTO process_flow(process_flow_code, prod_code, process_code,process_date,process_sequence)
                    VALUES(?, ?, ?,NOW(),?)`;

//3. 공정조회
const procAllList = `SELECT process_code, process_name
                  FROM process`;


module.exports
= {
  autoProFlowCode,
  flowProdList,
  procList,
   procDelete,
   procSave,
   procAllList
  };