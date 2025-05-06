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
const saveBom = async(bomsave)=>{
    //삭제
    console.log('wer'+bomsave);
    console.log(bomsave);
    let result = await mariaDB.query('bomDelete',[bomsave[0].prod_code])             
                                            .catch((err)=>console.log(err));   
  for(let value of bomsave){
    console.log(value)
                                                  
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

  result = await mariaDB.query('bomSave', addBom);
}
  return result;
  // =======
 }
}


//공정흐름도관리
//1. 제품조회
const flowProd = async () => {
  let list = await mariaDB.query('flowProdList');
  return list;
}

//2. 공정조회
const findProc = async (prodNo) => {
  let list = await mariaDB.query('procList',prodNo);
  return list;
}

//3. 저장
const saveProc = async(procsave) => {
  //삭제
  let result = await mariaDB.query('procDelete',[procsave[0].prod_code])
                                          .catch((err)=>console.log(err));
for (let value of procsave){
  console.log(value)

  // 등록 => 여러건을 등록
  for(let value of procsave){
    let addColumn = ['prod_code', 'process_code'];
    let addProc = convertObjToAry(value,addColumn);

  // process_flow_code 추가
  // process_code 자동 생성 SELECT문 조회
  let resList = await mariaDB.query('autoProFlowCode');
  // 그 결과를 newProFlow라는 변수에 담고
  let newProFlow = resList[0].process_flow_code;
  // addProc에 첫번째 값으로 추가
  addProc.unshift(newProFlow);

  result = await mariaDB.query('procsave', addProc);
  }
  return result;
  }                                        
}


//제품검수관리
//1. 제품조회
const  prodcList = async () => {
  let list = await mariaDB.query('pcprodList');
  return list;
}
module.exports = {
  findProd,
  findBom,
  saveBom,
  flowProd,
  findProc,
  saveProc,
  prodcList,
}