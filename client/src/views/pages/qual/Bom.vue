<template>
  <div class="card border-0 h-100">
     <div class="font-semibold text-xl mb-4">BOM 관리</div>
     <div class="d-flex justify-content-start me-5">

         </div>

     <div class="text-end mt-3 mb-3"style="padding-right: 4%;">
     <Button label="초기화" severity="help" class="me-3" @click="resetList"/>
     <Button label="저장" severity="info" class="me-3" @click="bomSave"/>
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
  <div class="bom-grid">
 <ag-grid-vue style="width: 700px; height: 500px;"
     ref="secondGrid"
     class="ag-theme-alpine"
     :columnDefs="columnDefs2"
     :rowData="rowData2"
     :gridOptions="gridOptions"
      rowSelection="multiple"
     :defaultColDef="defaultColDef2"
     @cellClicked="bomCellClicked">
   </ag-grid-vue>
   </div>
 </div>
 </div>
  <!-- 자재코드 모달창-->
  <MatModal
       :visible="showMatModal"
       rowSelection="multiple"
       @close="showMatModal = false"
       @selectMat="matSelected"
  ></MatModal>

</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import Swal from 'sweetalert2';
import MatModal from '@/components/modal/MatModal.vue';
export default{
   components: {
   AgGridVue,
   MatModal,
   Swal
 },
 data() {
   return {
     rowData: [],
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
     mat_code: "",
     prod_code: "",
     prod_name: "",
     mat_name: "",
     quantity: "",
    }
    ],
    columnDefs2: [
    { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
       { field: 'mat_code', headerName: '자재코드',flex:3,editable:true},
       { field: 'prod_code', headerName: '제품코드',flex:3,editable:true},
       { field: 'prod_name', headerName: '제품명' ,flex:4,editable:true},
       { field: 'mat_name', headerName: '자재명 ' ,flex:3,editable:true},
       { field: 'quantity', headerName: '수량 ' ,flex:2,editable:true},
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
    showMatModal: false,
    //상세그리드 행 인덱스
    selectedSecondIndex: null,
    prodIndex : null,
   };
  
 },
 mounted() {
   this.BomData();
 },
 methods: {
   async BomData() {
     try {
       const response = await axios.get('/api/admin/bom');
       this.rowData = response.data;
     } catch (err) {
       console.error('데이터 조회 실패:', err);
     }
   },
   prodCellClicked(event){
     let bom = event.data.prod_code;
     this.prodIndex = event.rowIndex
     axios.get('/api/admin/bom/' + bom)
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
   this.rowData2.push({  mat_code: "",
                         prod_code : this.rowData[this.prodIndex].prod_code,
                         prod_name: this.rowData[this.prodIndex].prod_name,
                         mat_name: "",
                         quantity: "",
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
   //자재코드를 클릭했을때 모달창 열기
   bomCellClicked(parmas){
     if (parmas.colDef.field == "mat_code" || parmas.colDef.field == "mat_name") {
       this.selectedSecondIndex = parmas.rowIndex;;
       this.showMatModal = true;
     }
   },
     //자재 모달창 값 전달
     matSelected(mat) {
     for (let rowInclude of this.rowData2) {
       if (rowInclude.mat_code == mat.mat_code) {
         Swal.fire({
           title: '실패',
           text: '같은 자재를 기입할 수 없습니다.',
           icon: 'error',
           confirmButtonText: '확인'
         });
         return;
       }
     }
     this.rowData2[this.selectedSecondIndex].mat_code = mat.mat_code;
     this.rowData2[this.selectedSecondIndex].mat_name = mat.mat_name;
     // 새 배열로 설정하여 AG Grid가 반영하게 만듬
     this.rowData2 = [...this.rowData2];
   },
   //저장
   async bomSave(){

    //값체크 validation
     for(let data of this.rowData2) {
       console.log(data);
       if(data.mat_code == '' || data.prod_code == '' || data.prod_name == '' || data.mat_name ==''|| data.quantity ==0){
         Swal.fire({
           title: '실패',
           text: '값을 다 입력해주세요',
           icon: 'error',
           confirmButtonText: '확인'
         });
         return;
     }
     }
     console.log(this.rowData[this.prodIndex])
     //등록시작
     const res = axios.post('/api/admin/bomsave', {
       insertBom: this.rowData2,
       prodBom : this.rowData[this.prodIndex].prod_code
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
       this.BomData();
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
.bom-grid {
 display: inline-block;
 
}

</style>




