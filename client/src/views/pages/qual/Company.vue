<template>
  <div class="card border-0 h-100">
      <div class="font-semibold text-xl mb-4">업체 관리</div>
      <div class="text-end mt-3 mb-3"style="padding-right: 4%;">
     <Button label="초기화" severity="success" class="me-3" @click="comReset"/>
     <Button label="등록" severity="info" class="me-3" @click="comSave"/>
     <Button label="수정" severity="help" class="me-3" @click="comModify"/>
     <Button label="삭제" severity="danger" class="me-3" @click="comDelete"/>
   </div>
   <div class="row">
   <div class="com-grid col">
    <h5>업체목록</h5>
     <ag-grid-vue style="width: 700px; height: 500px;"
       class="ag-theme-alpine"
       :columnDefs="columnDefs"
       :rowData="rowData"
       :gridOptions="gridOptions"
       :defaultColDef="defaultColDef"

       @cellClicked="empCellClicked">
   </ag-grid-vue>
  </div>
  <div class="card border-0 col" style="width: 700px; height: 500px; background-color: #F5F5F5;">
                <h5>업체상세</h5>
                <div class="row">
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">업체코드</span>
                        <input type="text" class="form-control" placeholder="업체코드" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.company_code" readonly>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">업체명</span>
                        <input type="text" class="form-control" placeholder="업체명" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.company_name" >
                    </div>
                </div>
                <div class="row">
                <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">부서</span>
                        <input type="text" class="form-control" placeholder="부서" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.department" >
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">연락처</span>
                        <input type="text" class="form-control" placeholder="연락처" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.tel" >
                    </div>
                  </div>
                <div class="row">
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">담당자</span>
                        <input type="text" class="form-control" placeholder="담당자" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.emp_code" >
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">업체타입</span>
                        <input type="password" class="form-control" placeholder="업체타입" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.conmpany_type">
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
        company_code: "",
        company_name: "",
        department: "",
        tel: "",
        emp_code: "",
        conmpany_type: "",
       }
     ],
     columnDefs: [
       { field: 'company_code', headerName: '업체코드',flex:1},
       { field: 'company_name', headerName: '업체명' ,flex:1},
       { field: 'department', headerName: '부서' ,flex:1,
            valueFormatter: (params) => {
                if (params.value == 'DP1') {
                    return params.value = '관리자';
                } else if (params.value == 'DP2') {
                    return params.value = '영업';
                } else if (params.value == 'DP3') {
                    return params.value = '생산';
                } else if (params.value == 'DP4') {
                    return params.value = '품질';
                } else if (params.value == 'DP5') {
                    return params.value = '자재';
                } else if (params.value == 'DP6') {
                    return params.value = '설비';
                } 
              }
       },
       { field: 'tel', headerName: '연락처' ,flex:1},
       { field: 'emp_code', headerName: '담당자' ,flex:1,},
       { field: 'conmpany_type', headerName: '업체타입' ,flex:1,}         
     ],
     gridOptions:{
         pagination: true,
         paginationPageSize: 10,
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
    selectedSecondIndex: null,
    //상세그리드 행 인덱스
    prodIndex : null,

    info: {
        company_code: "",
        company_name: "",
        department: "",
        tel: "",
        emp_code: "",
        conmpany_type: "",
    },
    departmentListAry : [],
    selectedSecondIndex: null,
    prodIndex : null,
   }
 },
 async mounted() {
   await this.comPanyData();
 },
 methods: {
  async comPanyData(){
    try{
    const response = await axios.get('/api/admin/compnay');
    this.rowData = response.data;
    } catch (err) {
      console.log('데이터 조회 실패', err);
    }
  } 
 },
}
</script>
<style>
 .ag-theme-alpine .ag-header {
 background-color: #65625e; 
 color: white;
 
 }
</style>
<style scoped>



.com-grid {
 display: inline-block;
 margin-right: 30px;
 
}
.card border-0 col {
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