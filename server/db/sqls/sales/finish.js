//창고리스트 조회
const storeList = `
 SELECT storage_code,
        store_name
  FROM storage
  WHERE store_type='ST1'
`



module.exports = {
  storeList,
}
