const { forEach } = require("lodash");
const mariaDB = require("../../db/mapper.js");
const { convertObjToAry } = require("../../utils/converts.js");
const { retry } = require("rxjs");

//BOM관리
// 1. 제품조회
const findProd = async ()=>{
  let list = await mariaDB.query('prodList');
  return list;
}
// 2. BOM조회
const findBom = async (prno)=>{
  let list = await mariaDB.query('bomList',prno);
  return list;
}
//3. 저장
const saveBom = async(bomsave,prodBom)=>{
    //삭제
console.log(prodBom)
    let result = await mariaDB.query('bomDelete',[prodBom])             
                                            .catch((err)=>console.log(err));   

  //삭제만 해 등록 하지 말고 나가
  if(bomsave.length <1){
      return result;
  }
                                                  
  // 등록 => 여러건을 등록
  for(let value of bomsave){
  let addColumn = ['mat_code', 'prod_code', 'quantity'];
  let addBom = convertObjToAry(value,addColumn);
  
  // bom code 추가
  // bom code 자동 생성 SELEC문 조회
  let resList = await mariaDB.query('autoBomCode');
  // 그결과를 newBomCode라는 변수에 담고
  let newBomCode = resList[0].BOM_code;
  // addBom에 첫번째 값으로 추가
  addBom.unshift(newBomCode); 
  
  result = await mariaDB.query('bomSave', addBom)
                        .catch((err) => console.log);

   }
  return result;
  // =======
 }


module.exports 
= {
  findProd,
  findBom,
  saveBom,
}