<template>
  <div class="card border-0 h-100">
     <div class="font-semibold text-xl mb-4">제품검수</div>
     <div class="d-flex justify-content-start me-5">
    
         </div>

     <div class="text-end mt-3 mb-3" style="padding-right: 2%;">
     <Button label="초기화" severity="help" class="me-3" @click="resetList"/>
     <Button label="저장" severity="info" class="me-3" @click="prodCheckSave"/>
   </div>

 <div class="par-grid">
   <div class="prod-grid">
     <ag-grid-vue style="width: 650px; height: 500px;"
       class="ag-theme-alpine"
       :columnDefs="columnDefs"
       :rowData="rowData"
       :gridOptions="gridOptions"
       :defaultColDef="defaultColDef"
       @cellClicked="prodCellClicked">
   </ag-grid-vue>
  </div>
  <div class="prodcheck-grid">
 <ag-grid-vue style="width: 780px; height: 500px;"
     ref="secondGrid"
     class="ag-theme-alpine"
     :columnDefs="columnDefs2"
     :rowData="rowData2"
     :gridOptions="gridOptions2"
      @cellValueChanged="testChange"
      rowSelection="multiple"
     :defaultColDef="defaultColDef2"
      @grid-ready="onSecondGridReady"
      :pinnedBottomRowData="bottomRow">
   </ag-grid-vue>
   </div>
 </div>
 </div>

</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import Swal from 'sweetalert2';
export default{
   components: {
   AgGridVue,
   Swal
 },
 data() {
   return {
     rowData: [
       {
         prod_code: "",
         prod_name: "",
         work_lot: "",
         quantity: "",
       }
     ],
     columnDefs: [
       { field: 'prod_code', headerName: '제품코드',flex:3,editable:true},
       { field: 'prod_name', headerName: '제품명' ,flex:4,editable:true},
       { field: 'work_lot', headerName: '공정LOT' ,flex:3},
       { field: 'quantity', headerName: '생산량 ' ,flex:2,editable:true},
       
     ],
     gridOptions:{
         pagination: true,
         paginationPageSize: 5,
         paginationPageSizeSelector: [5, 10, 20, 50],
         overlayNoRowsTemplate: '표시할 값이 없습니다.',
         defaultColDef: {
           suppressMovable: true, //컬럼 드래그로 순서바꾸기 못하게
           resizable: false, //컬럼 너비 마우스로 조절 못하게
           sortable: false, //정렬 기능 비활성화
         onGridReady: function (event) {
         event.api.sizeColumnsToFit();
       },
     }
    },

    rowData2: [
    {
     work_lot: "",
     prod_check_code: "",
     prod_code: "",
     prod_name: "",
     check_list: "부품 누락",
     pass_quantity: "",
     error_quantity: "",
    },
    {
     work_lot: "",
     prod_check_code: "",
     prod_code: "",
     prod_name: "",
     check_list: "외관",
     pass_quantity: "",
     error_quantity: "",
    },
    {
     work_lot: "",
     prod_check_code: "",
     prod_code: "",
     prod_name: "",
     check_list: "포장상태",
     pass_quantity: "",
     error_quantity: "",
    }
    ],
    columnDefs2: [
       { field: 'work_lot', headerName: '공정LOT' ,flex:3},
       { field: 'prod_code', headerName: '제품코드',flex:3,editable:true},
       { field: 'prod_name', headerName: '제품명',flex:4,editable:true},
       { field: 'check_list', headerName: '검수항목',flex:3,editable:true},
       { field: 'pass_quantity', headerName: '합격량' ,flex:2,editable:true},
       { field: 'error_quantity', headerName: '불량량' ,flex:2,editable:true},
     ],
     gridOptions2:{
       domLayout: "autoHeight", //행을 보고 자동으로 hight부여
        suppressRowClickSelection: true, //	행 클릭할 때 체크박스 선택 방지
        overlayNoRowsTemplate: '표시할 값이 없습니다.',
        defaultColDef: {
         suppressMovable: true, //컬럼 드래그로 순서바꾸기 못하게
           resizable: false, //컬럼 너비 마우스로 조절 못하게
           sortable: false, //정렬 기능 비활성화
        onGridReady: function (event){
        event.api.sizeColumnsToFit();
       },
     },
    
    },
    //상세그리드 행 인덱스
    selectedSecondIndex: null,
    prodIndex : null,
    firstIndex : null,
    bottomRow: [{
                  work_lot: '합계',
                  prod_code: null,
                  prod_name: null,
                  check_list: null,
                  pass_quantity: null,
                  error_quantity: null
                }]
   };
 },
 mounted() {
   this.prodcheckData();
 },
 
 methods: {
  onSecondGridReady(params) {
     this.gridOptions2.api = params.api;
  },
   async prodcheckData() {
     try {
       const response = await axios.get('/api/qual/prodcheck');
       this.rowData = response.data;
       this.rowData = [...this.rowData]
     } catch (err) {
       console.error('데이터 조회 실패:', err);
    }
   },
   prodCellClicked(event){
     this.firstIndex = event.rowIndex
     let prodCode = event.data.prod_code;
     let prodName = event.data.prod_name;
     let workLot = event.data.work_lot;

     for(let value of this.rowData2){
      value.work_lot = workLot;
      value.prod_name = prodName;
      value.prod_code = prodCode;
      value.pass_quantity = ''  
      value.error_quantity = ''
     }

     this.rowData2 =  [...this.rowData2];
     this.prodIndex = event.rowIndex
    } ,
 
      testChange(event) {
      // 변경시 변경한 index값 저장
      let rowIndex = event.rowIndex;
      //ROWDATA2의 저장한 index의 값을 가져와서 error_quantity에 바뀐값을 기입
      this.rowData2[rowIndex].error_quantity = event.data.error_quantity;
      let sum = 0 ;
      for(let value of this.rowData2){
        sum += Number(value.error_quantity);
      }

       if(sum > Number(this.rowData[this.firstIndex].quantity)){
        Swal.fire({
            title: '실패',
            text: '검수량 보다 값이 많습니다.',
            icon: 'error',
            confirmButtonText: '확인'
          });
        this.rowData2[rowIndex].error_quantity = 0;
        this.rowData2 = [...this.rowData2]
      }
      this.bottomRow= [{
                  work_lot: '합계',
                  prod_code: null,
                  prod_name: null,
                  check_list: null,
                  error_quantity: this.rowData2.reduce((prev, next) => { return prev + Number(next.error_quantity)},0),
                  pass_quantity: Number(this.rowData[this.firstIndex].quantity) -  this.rowData2.reduce((prev,next) => {return prev + Number(next.error_quantity)},0),
                }]
            
    this.rowData2 = [...this.rowData2]
    } ,

    //저장
    async prodCheckSave(){
      for(let data of this.rowData2) {
        if(data.work_lot == '' || data.prod_code == '' || data.prod_name == '' || data.check_list == ''  || data.error_quantity == ''){
          Swal.fire({
           title: '실패',
           text: '값을 다 입력해주세요',
           icon: 'error',
           confirmButtonText: '확인'
        });
        return;
       }
      }
      const res = await axios.post('/api/qual/prodchecksave', {
        insertErrorCheck :this.bottomRow,
        insertProdCheck: this.rowData2,
      })
        .then(res => {
          if(res.data.affectedRows > 0) {
            Swal.fire({
             title: '등록 성공',
             text: '정상적으로 등록이 완료되었습니다.',
             icon: 'success',
             confirmButtonText: '확인'
            });
          } else {
            Swal.fire({
             title: '등록 실패',
             text: '등록이 실패하였습니다..',
             icon: 'error',
             confirmButtonText: '확인'
           });
           return;
          }
        })
        .catch(error => {
         console.error(error);
         Swal.fire({
           title: '등록 실패',
           text: '알수 없는 오류가 발생하였습니다..',
           icon: 'error',
           confirmButtonText: '확인'
         });
         return;
       });
       this.rowData2 = [{
                          work_lot: "",
                          prod_check_code: "",
                          prod_code: "",
                          prod_name: "",
                          check_list: "부품 누락",
                          pass_quantity: "",
                          error_quantity: "",
                        },
                        {
                          work_lot: "",
                          prod_check_code: "",
                          prod_code: "",
                          prod_name: "",
                          check_list: "외관",
                          pass_quantity: "",
                          error_quantity: "",
                        },
                        {
                          work_lot: "",
                          prod_check_code: "",
                          prod_code: "",
                          prod_name: "",
                          check_list: "포장상태",
                          pass_quantity: "",
                          error_quantity: "",
                        }];
     await this.prodcheckData();
      this.rowData = [...this.rowData]
    },
    //초기화
   resetList(){
     this.rowData2 = [];
   }
 },
};
 

</script>
<style>
 .ag-theme-alpine .ag-header {
 background-color: #FF9900; 
 color: white;
 
 }
</style>
<style scoped>



.prod-grid {
 display: inline-block;
 margin-right: 30px;
 
}
.prodcheck-grid {
 display: inline-block;
 
}

</style>




