//mat.js
//mat_code 자동증가
const autoCountMatCode =
`SELECT CONCAT('MAT-',IFNULL(MAX(CAST(SUBSTR(mat_code,5) AS SIGNED)),100)+1) AS mat_code
FROM mat`

//조회
const selectMat =
`SELECT mat_code,
             mat_name,
             unit,
             size,
             color,
             texture,
             shape,
             safe_inventory
FROM mat`

// mat등록
const addMat =
`INSERT INTO mat
            (mat_code,
             mat_name,
             unit,
             size,
             color,
             texture,
             shape,
             safe_inventory)
VALUES(?,?,?,?,?,?,?,?)`

//수정
const updateMat =
`UPDATE mat
SET ?
WHERE mat_code = ?`

//삭제
const delMat =`
DELETE FROM mat
WHERE mat_code = ?`

module.exports ={
  autoCountMatCode,
  addMat,
  selectMat,
  updateMat,
  delMat,
}