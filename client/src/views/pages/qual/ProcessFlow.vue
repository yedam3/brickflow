<template>
  <div class="card border-0 h-100">
     <div class="font-semibold text-xl mb-4">공정흐름도 관리</div>
     <div class="d-flex justify-content-start me-5">
    
         </div>

     <div class="text-end mt-3 mb-3"style="padding-right: 4%;">
     <Button label="초기화" severity="help" class="me-3" @click="resetList"/>
     <Button label="저장" severity="info" class="me-3" @click="proSave"/>
   </div>

   <div class="text-end mt-3 mb-3"style="padding-right: 4%;">
     <Button label="행추가" severity="success" class="me-3" @click="addRow"/>
     <Button label="행삭제" severity="danger" class="me-3" @click="deleteRow"/>  
   </div>
 <div class="par-grid">
   <div class="prod-grid">
     <ag-grid-vue style="width: 700px; height: 500px;"
       class="ag-theme-alpine"
       :columnDefs="columnDefs"
       :rowData="rowData"
       :gridOptions="gridOptions"
       :defaultColDef="defaultColDef"
       @cellClicked="prodCellClicked">
   </ag-grid-vue>
  </div>
  <div class="procFlow-grid">
 <ag-grid-vue style="width: 700px; height: 500px;"
     ref="secondGrid"
     class="ag-theme-alpine"
     :columnDefs="columnDefs2"
     :rowData="rowData2"
     :gridOptions="gridOptions"
      rowSelection="multiple"
     :defaultColDef="defaultColDef"
     @cellClicked="procCellClicked">
   </ag-grid-vue>
   </div>
 </div>
 </div>
  <!-- 공정코드 모달창-->
  <ProcModal
       :visible="showProcModal"
       rowSelection="multiple"
       @close="showProcModal = false"
       @selectProc="procSelected"
  ></ProcModal>

</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import Swal from 'sweetalert2';
import ProcModal from '@/components/modal/ProcModal.vue';
export default{
   components: {
   AgGridVue,
   ProcModal,
   Swal
 },
 data() {
   return {
     rowData: [
       {
         prod_code: "",
         prod_name: "",
       }
     ],
     columnDefs: [
       { field: 'prod_code', headerName: '제품코드',flex:1,editable:true},
       { field: 'prod_name', headerName: '제품명' ,flex:1},
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
      prod_code: "",
      prod_name: "",
      process_code: "",
      process_name: "",
    }
    ],
    columnDefs2: [
    { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
       { field: 'prod_code', headerName: '제품코드',flex:3,editable:true},
       { field: 'prod_name', headerName: '제품명',flex:4,editable:true},
       { field: 'process_code', headerName: '공정코드' ,flex:3,editable:true},
       { field: 'process_name', headerName: '공정명 ' ,flex:4,editable:true},
     ],
     gridOptions:{
       domLayout: "autoHeight", //행을 보고 자동으로 hight부여
        suppressRowClickSelection: true, //	행 클릭할 때 체크박스 선택 방지
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
    showProcModal: false,
    //상세그리드 행 인덱스
    selectedSecondIndex: null,
    prodIndex : null,
   };
 },
 mounted() {
   this.ProcData();
 },
 methods: {
   async ProcData() {
     try {
       const response = await axios.get('/api/admin/processflow');
       this.rowData = response.data;
     } catch (err) {
       console.error('데이터 조회 실패:', err);
     }
   },
   prodCellClicked(event){
     let proc = event.data.prod_code;
     this.prodIndex = event.rowIndex
     axios.get('/api/admin/processflow/'+ proc)
                .then(res => {
                 console.log(res);
                      this.rowData2 = res.data;
                      this.rowData2 = [...this.rowData2];  
                }).catch(error => {
                 console.error(error);
                });
                console.log(event);
     


       },
   //행추가
   addRow(){
   if(this.prodIndex == null){
     Swal.fire({
           title: '실패',
           text: '제품을 클릭해주세요',
           icon: 'error',
           confirmButtonText: '확인'
         });
         return;
   }
   this.rowData2.push({  prod_code: this.rowData[this.prodIndex].prod_code,
                         prod_name: this.rowData[this.prodIndex].prod_name,
                         process_code: "",
                         process_name: "",
                         })
   
 // 새 배열로 설정하여 AG Grid가 반영하게 만듬
   this.rowData2 = [...this.rowData2];  
  },
  //행삭제
   deleteRow() {
     const selectedNodes = this.$refs.secondGrid.api.getSelectedNodes();
     const selectedData = selectedNodes.map(node => node.data);
  
     // rowData2에서 선택된 행을 제외한 나머지만 남긴다
     this.rowData2 = this.rowData2.filter(row => !selectedData.includes(row));
   },
   //공정코드를 클릭했을때 모달창 열기
   procCellClicked(parmas){
     if (parmas.colDef.field == "process_code" || parmas.colDef.field == "process_name") {
       this.selectedSecondIndex = parmas.rowIndex;;
       this.showProcModal = true;
       console.log('모달값',parmas);
     }
   },
     //공정 모달창 값 전달
     procSelected(proc) {
     
     this.rowData2[this.selectedSecondIndex].process_code = proc.process_code;
     this.rowData2[this.selectedSecondIndex].process_name = proc.process_name;
     // 새 배열로 설정하여 AG Grid가 반영하게 만듬
     this.rowData2 = [...this.rowData2];
   },
   //저장
   async proSave(){

     for(let data of this.rowData2) {
       console.log(data);
       if(data.prod_code == '' || data.prod_name == '' || data.process_code == '' || data.process_name ==''){
         Swal.fire({
           title: '실패',
           text: '값을 다 입력해주세요',
           icon: 'error',
           confirmButtonText: '확인'
         });
         return;
     }
     }
     const res = axios.post('/api/admin/procsave', {
      insertProc: this.rowData2,
       
     })
       .then(res => {
         if (res.data.affectedRows > 0) {
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
                         mat_code: "",
                         prod_name: "",
                         mat_name: "",
                         quantity: "",
                       }];
       this.ProcData();
   },
   //초기화
   resetList(){
     this.rowData2 = [];
   }
 
 }
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
.procFlow-grid {
 display: inline-block;
 
}

</style>




