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

module.exports = {
  selectFacList,
};