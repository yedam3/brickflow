// company_code 자동 생성
const autoComCode = 
`SELECT CONCAT('COM-',IFNULL(MAX(CAST(SUBSTR(company_code,5) AS SIGNED)),100)+1) AS company_code
FROM company`;

// 업체목록 조회
const comList = `SELECT company_code,
                        company_name,
                        address,
                        tel,
                        emp_code,
                        company_type
                  FROM company`;

//업체 상세조회
const comInfo = `SELECT company_code,
                        company_name,
                        address,
                        tel,
                        emp_code,
                        company_type
                  FROM company
                  WHERE company_code = ?`;

//업체타입 리스트 조회
const comTypeList = `SELECT sub_code,
		                        sub_code_name
                            FROM sub_codes
                      WHERE main_code = 'ct'`;

//등록
const comSave = `INSERT INTO company(company_code, company_name, address, tel, emp_code, company_type)
                  VALUES(?, ?, ?, ?, ?, ?)`;

//수정
const comUpdate = `UPDATE company
                      SET company_name=?,
                          address=?,
                          tel=?,
                          emp_code=?,
                          company_type=?
                    WHERE company_code =?`;

//삭제
const comDelete = `DELETE FROM company
                      WHERE company_code=?`

module.exports 
= {
  comList,
  comInfo,
  comTypeList,
  autoComCode,
  comSave,
  comUpdate,
  comDelete
}