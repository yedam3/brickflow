// fac.js
const autoUnCode = `SELECT CONCAT('nup-',IFNULL(MAX(CAST(SUBSTR(unplay_code,5) AS SIGNED)),100)+1) AS unplay_code
FROM fac_none_play`;

//설비 조회
const selectFacList =
`SELECT f.fac_code,
        f.model_name,
        f.fac_location,
        f.employee_code,
        f.fac_pattern,
        f.install_date,
        f.inspection_cycle,
        f.image,
        f.fac_status
FROM fac f`;

const unplaryList =
`SELECT unplay_code,
        unplay_reson_code,
        employee_code,
        unplay_start_date,
        unplay_end_date,
        note,
        fac_code,
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
                           unplay_reson_code, 
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

module.exports = {
  autoUnCode,
  selectFacList, 
  addNoFac,
  unplaryList,
  updateUnplay,
  facCheck,
  delUnplay,
};