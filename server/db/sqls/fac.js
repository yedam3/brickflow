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



const addNoFac =
`INSERT INTO fac_none_play(unplay_code, unplay_reson_code, employee_code, unplay_start_date, unplay_end_date)
VALUES(?,?,?,?,?)`;

module.exports = {
  selectFacList, 
  addNoFac,
};