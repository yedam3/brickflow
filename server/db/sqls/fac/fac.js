// fac.js
// 비가동설비코드
const autoUnCode = `SELECT CONCAT('UNP-',IFNULL(MAX(CAST(SUBSTR(unplay_code,5) AS SIGNED)),100)+1) AS unplay_code
FROM fac_none_play`;

//설비수리코드
const autoReCode = `SELECT CONCAT('REF-',IFNULL(MAX(CAST(SUBSTR(repaire_code,5) AS SIGNED)),100)+1) AS repaire_code
FROM repaire`;

//설비코드
const autoFacCode = `SELECT CONCAT('FAC-',IFNULL(MAX(CAST(SUBSTR(fac_code,5) AS SIGNED)),100)+1) AS fac_code
FROM fac`


//설비 조회
const selectFacList =
`SELECT fac_code,
        model_name,
        fac_location,
        getEmpName(employee_code) AS employee_name,
        fac_pattern,
        install_date,
        inspection_cycle,
        image,
        fac_status
FROM fac
ORDER BY fac_code DESC`

//설비상태페이지 리스트
const statusList =
`SELECT fac_code,
        model_name,
        fac_location,
        getEmpName(employee_code) AS employee_name,
        fac_pattern,
        fac_status
FROM fac`;

//설비 모달창
const facModal =
`SELECT fac_code,
        model_name,
        fac_location,
        getEmpName(employee_code) AS employee_name,
        fac_status
FROM fac
WHERE fac_code = ?`

//비가동 설비 리스트
const unplayList =
`SELECT unplay_code,
        unplay_reason_code,
        getEmpName(employee_code) AS employee_name,
        unplay_start_date,
        unplay_end_date,
        note,
        fac_code
FROM fac_none_play
ORDER BY unplay_start_date DESC`

// 값 체크
const facCheck =
`SELECT COUNT(*) AS checkCount
  FROM fac_none_play
  WHERE unplay_code = ?`


//설비 등록
const addFac =
`INSERT INTO fac (
    fac_code,
    model_name,
    fac_location,
    employee_code,
    fac_pattern,
    install_date,
    inspection_cycle,
    image,
    fac_status
)
VALUES (
    ?,?,?,?,                       
    (SELECT sub_code FROM sub_codes WHERE main_code = 'FC' AND sub_code = ?),
    ?,?,?,
    (SELECT sub_code FROM sub_codes WHERE main_code = 'FS' AND sub_code = ?)    
)`
//이미지 경로만 저장
const saveImagePath = `
  INSERT INTO fac (image)
  VALUES (?)
`;
//비가동
const addNoFac =
`INSERT INTO fac_none_play (
  unplay_code, 
  unplay_reason_code, 
  employee_code, 
  unplay_start_date, 
  unplay_end_date, 
  note, 
  fac_code
)
SELECT ?, s.sub_code, ?, ?, ?, ?, ?
FROM main_codes m
  JOIN sub_codes s ON m.main_code = s.main_code
WHERE s.main_code = 'NR' AND s.sub_code = ?
LIMIT 1`

//수정
//설비 수정
const updateFac =
`UPDATE fac
SET ?
WHERE fac_code = ?`

//비가동수정
const updateUnplay=
`UPDATE fac_none_play
SET ?
WHERE unplay_code = ?`

//수리
const updateReFac = `
UPDATE fac_none_play
SET unplay_end_date = ?
WHERE unplay_code = ?`

//삭제
//설비 삭제
const delFac =`
DELETE FROM fac
WHERE fac_code = ?`

//비가동설비 삭제
// const delUnplay =
// `DELETE FROM fac_none_play
// WHERE unplay_code = ?`

//비가동 사유
const reasonFac = `
  SELECT s.sub_code AS unplay_reason_code,
         s.sub_code_name
  FROM main_codes m
  JOIN sub_codes s ON m.main_code = s.main_code
  WHERE s.main_code = "NR"
`
//수리결과
const facResult = 
`SELECT s.sub_code AS fac_result,
         s.sub_code_name
  FROM main_codes m
  JOIN sub_codes s ON m.main_code = s.main_code
  WHERE s.main_code = "OH"`

  //설비상태
const facStatus =
`SELECT s.sub_code AS fac_status,
         s.sub_code_name
  FROM main_codes m
  JOIN sub_codes s ON m.main_code = s.main_code
  WHERE s.main_code = "FS"`
  
//설비유형
const facPattern =
`SELECT s.sub_code AS fac_pattern,
         s.sub_code_name
  FROM main_codes m
  JOIN sub_codes s ON m.main_code = s.main_code
  WHERE s.main_code = "FC"`

//비가동고장리스트
const repaireList = 
`SELECT unplay_code,
       unplay_reason_code,
       getEmpName(employee_code) AS employee_code,
       unplay_start_date,
       unplay_end_date,
       note,
       fac_code
FROM fac_none_play
WHERE unplay_reason_code IN (
    SELECT s.sub_code
    FROM main_codes m 
    JOIN sub_codes s ON m.main_code = s.main_code
    WHERE s.sub_code_name = '고장'
)
AND unplay_end_date IS NULL`

//비가동 수리처리 등록
const repaireFac =
`INSERT INTO repaire (
  repaire_code, 
  employee_code, 
  repaire_add_date, 
  repaire_finish_date, 
  fac_code, 
  fac_result,
  break_status,
  unplay_code,
  note, 
  fac_history
)
VALUES(?,?,?,?,?,?,?,?,?,?)`


//수리설비 조회
const repList =
`SELECT repaire_code,
        getEmpName(employee_code) AS employee_code,
        repaire_add_date,
        repaire_finish_date,
        fac_code,
        fac_result,
        break_status,
        unplay_code,
        note,
        fac_history
FROM repaire
WHERE 1=1`

//가동, 비가동 업데이트
const updateList =
`UPDATE fac SET fac_status = ? WHERE fac_code = ?`

module.exports = {
  autoUnCode,
  autoFacCode,
  selectFacList, 
  addNoFac,
  unplayList,
  updateUnplay,
  facCheck,
  reasonFac,
  facModal,
  statusList,
  repaireList,
  autoReCode,
  repaireFac,
  facResult,
  repList,
  updateList,
  facStatus,
  addFac,
  facPattern,
  updateFac,
  saveImagePath,
  updateReFac,
  delFac,
};