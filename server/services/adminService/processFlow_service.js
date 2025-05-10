const { forEach } = require("lodash");
const mariaDB = require("../../db/mapper.js");
const { convertObjToAry } = require("../../utils/converts.js");
const { retry } = require("rxjs");

//공정흐름도관리
//1. 제품조회
const flowProd = async () => {
  let list = await mariaDB.query('flowProdList');
  return list;
}

//2. 공정조회
const findProc = async (prodNo) => {
  let list = await mariaDB.query('procList',prodNo)
                          .catch ((err) => console.log(err));
  return list;
}

//공정 전체 조회
const allProc = async() => {
  let list = await mariaDB.query('procAllList')
                          .catch ((err) => console.log(err));
      return list;
}


//3. 저장
const saveProc = async(procsave) => {
  //삭제

  let result = await mariaDB.query('procDelete',[procsave[0].prod_code])
                                          .catch((err)=>console.log(err));

for (let value of procsave){
  // 등록 => 여러건을 등록
  for(let index in procsave){
    
    let addColumn = ['prod_code', 'process_code'];
    let addProc = convertObjToAry(procsave[index],addColumn);

  // process_flow_code 추가
  // process_code 자동 생성 SELECT문 조회
  let resList = await mariaDB.query('autoProFlowCode');
  // 그 결과를 newProFlow라는 변수에 담고
  let newProFlow = resList[0].process_flow_code;
  let flowIndex = Number(index)+1;
  // addProc에 첫번째 값으로 추가
  addProc.unshift(newProFlow);
  //인덱스는 두번쨰값으로추가 
  addProc.push(flowIndex)

  result = await mariaDB.query('procSave', addProc);
  }
  return result;
  }                                        
}

module.exports 
= {
  flowProd,
  findProc,
  saveProc,
  allProc
}