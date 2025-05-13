<template>
  <div class="card border-0 h-100">
      <div class="font-semibold text-xl mb-4">사원 관리</div>
  
  <div class="ag-theme-alpine col me-5" style="height: 400px; width: 50%">
      </div>
      <div class="text-end mt-3 mb-3"style="padding-right: 4%;">
     <Button label="초기화" severity="help" class="me-3" @click="resetList"/>
     <Button label="저장" severity="info" class="me-3" @click="bomSave"/>
     <Button label="저장" severity="help" class="me-3" @click="bomSave"/>
     <Button label="저장" severity="danger" class="me-3" @click="bomSave"/>
   </div>
   <div class="emp-grid">
     <ag-grid-vue style="width: 700px; height: 500px;"
       class="ag-theme-alpine"
       :columnDefs="columnDefs"
       :rowData="rowData"
       :gridOptions="gridOptions"
       :defaultColDef="defaultColDef"
       @cellClicked="prodCellClicked">
   </ag-grid-vue>
  </div>
  <div class="empList-grid">
  <div class="card border-0 col" style="height: 650px; background-color: #F5F5F5;">
                <h5>사원목록</h5>
                <div class="row">
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">사원번호</span>
                        <input type="text" class="form-control" placeholder="사원번호" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.mat_lot" readonly>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">이름</span>
                        <input type="text" class="form-control" placeholder="이름" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.emp_code" readonly>
                    </div>
                </div>
                <div class="row">
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">부서</span>
                        <input type="text" class="form-control" placeholder="부서" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.mat_code" readonly>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">입사일</span>
                        <input type="text" class="form-control" placeholder="입사일" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.mat_name" readonly>
                    </div>
                </div>
                <div class="row">
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">전화번호</span>
                        <input type="text" class="form-control" placeholder="전화번호" aria-label="Username"
                            aria-describedby="basic-addon1" :value="formatAleady" readonly>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">비밀번호</span>
                        <input type="text" class="form-control" placeholder="비밀번호" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.store_quantity">
                    </div>
                </div>
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
         emp_code: "",
         prod_name: "",
         emp_name: "",
         department: "",
         hire_date: "",
         tel: "",
         pwd: "",
       }
     ],
     columnDefs: [
       { field: 'emp_code', headerName: '사원번호',flex:1,editable:true},
       { field: 'emp_name', headerName: '이름' ,flex:1},
       { field: 'department', headerName: '부서' ,flex:1},
       { field: 'hire_date', headerName: '입사일' ,flex:1},
       { field: 'tel', headerName: '전화번호' ,flex:1},
       { field: 'pwd', headerName: '비밀번호' ,flex:1},
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
    info: {
      emp_code: "",
      prod_name: "",
      emp_name: "",
      department: "",
      hire_date: "",
      tel: "",
      pwd: "",
    },
    selectedSecondIndex: null,
    prodIndex : null,
   }
 },
 mounted() {
   this.EmployeesData();
 },
 methods: {
   async EmployeesData() {
     try {
       const response = await axios.get('/api/admin/employees');
       this.rowData = response.data;
     } catch (err) {
       console.error('데이터 조회 실패:', err);
     }
   },
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



.emp-grid {
 display: inline-block;
 margin-right: 30px;
 
}
.empList-grid {
 display: inline-block;
 
}

.btn-primary {
      background-color: rgb(230, 171, 98);
      border-color: rgb(230, 171, 98);
  }
  
  /* 헤더 텍스트 가운데 정렬 */
  ::v-deep(.ag-theme-alpine .ag-header-cell-label) {
      justify-content: center;
  }
  
  /* headerClass로 설정한 header-center 클래스에 적용 */
  ::v-deep(.header-center .ag-header-cell-label) {
      justify-content: center;
  }
  .input-group-text{
      background-color: #FFCC80;
      border-color: #FFCC80;
  }

</style>
