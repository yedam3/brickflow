// fac.js
const autoUnCode = `SELECT CONCAT('UNP-',IFNULL(MAX(CAST(SUBSTR(unplay_code,5) AS SIGNED)),100)+1) AS unplay_code
FROM fac_none_play`;

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
`INSERT INTO fac_none_play(unplay_code, 
                           unplay_reason_code, 
                           employee_code, 
                           unplay_start_date, 
                           unplay_end_date,
                           note,
                           fac_code)
VALUES(?,?,?,?,?,?,?)`

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

const reasonFac =
`SELECT s.sub_code_name
 FROM main_codes m join sub_codes s on(m.main_code = s.main_code)
 WHERE s.main_code = "NR"`

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
};