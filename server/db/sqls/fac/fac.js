// fac.js
// 비가동설비코드
const autoUnCode = `SELECT CONCAT('UNP-',IFNULL(MAX(CAST(SUBSTR(unplay_code,5) AS SIGNED)),100)+1) AS unplay_code
FROM fac_none_play`;

//설비수리코드
const autoReCode = `SELECT CONCAT('REF-',IFNULL(MAX(CAST(SUBSTR(repaire_code,5) AS SIGNED)),100)+1) AS repaire_code
FROM repaire`;

//설비 조회
const selectFacList =
`SELECT fac_code,
        model_name,
        fac_location,
        employee_code,
        fac_pattern,
        install_date,
        inspection_cycle,
        image,
        fac_status
FROM fac`;

//설비상태페이지 리스트
const statusList =
`SELECT fac_code,
        model_name,
        fac_location,
        employee_code,
        fac_pattern,
        fac_status
FROM fac`;

//설비 모달창
const facModal =
`SELECT fac_code,
        model_name,
        fac_location,
        employee_code,
        fac_status
FROM fac
WHERE fac_code = ?`

//비가동 설비 리스트
const unplayList =
`SELECT unplay_code,
        unplay_reason_code,
        employee_code,
        unplay_start_date,
        unplay_end_date,
        note,
        fac_code
FROM fac_none_play`

// 값 체크
const facCheck =
`SELECT COUNT(*) AS checkCount
  FROM fac_none_play
  WHERE unplay_code = ?`


//설비 등록
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
SELECT ?, s.sub_code_name, ?, ?, ?, ?, ?
FROM main_codes m
  JOIN sub_codes s ON m.main_code = s.main_code
WHERE s.main_code = 'NR' AND s.sub_code = ?
LIMIT 1`

//수정
//비가동수정
const updateUnplay=
`UPDATE fac_none_play
SET ?
WHERE unplay_code = ?`

//삭제
//비가동설비 삭제
const delUnplay =
`DELETE FROM fac_none_play
WHERE unplay_code = ?`

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

//비가동고장리스트
const repaireList = 
`SELECT unplay_code,
        unplay_reason_code,
        employee_code,
        unplay_start_date,
        unplay_end_date,
        note,
        fac_code
FROM fac_none_play
WHERE unplay_reason_code IN (SELECT s.sub_code_name
                            FROM main_codes m join sub_codes s on(m.main_code = s.main_code)
                            WHERE s.sub_code_name = '고장')`

//비가동 수리처리
const repaireFac =
`INSERT INTO repaire (
  repaire_code, 
  note, 
  repaire_add_date, 
  repaire_finish_date, 
  employee_code, 
  fac_code, 
  fac_history,
  break_status,
  fac_result
)
SELECT ?,?,?,?,?,?,?,?,s.sub_code_name
FROM main_codes m
JOIN sub_codes s ON m.main_code = s.main_code
WHERE s.main_code = 'OH' AND s.sub_code = ? 
LIMIT 1;`

//수리설비 조회
const repList =
`SELECT repaire_code,
        employee_code,
        repaire_add_date,
        repaire_finish_date,
        fac_code,
        fac_result,
        break_code,
        unplay_code,
        note,
        fac_history
FROM repaire`

module.exports = {
  autoUnCode,
  selectFacList, 
  addNoFac,
  unplayList,
  updateUnplay,
  facCheck,
  delUnplay,
  reasonFac,
  facModal,
  statusList,
  repaireList,
  autoReCode,
  repaireFac,
  facResult,
  repList,
};