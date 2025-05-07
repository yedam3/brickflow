//procedure.js
//프로시저 실행 
//아웃모드는 DB세션을 이용해서 담기
const callGetCountByLot = `
   CALL auto_lot(?, @cnt);
   SELECT @cnt AS cnt;
`;
//세션에 담아온 아웃모드값을 다시 호출
const selectCnt = `
   SELECT @cnt AS cnt;
`;

module.exports = {
  callGetCountByLot,
  selectCnt,
};