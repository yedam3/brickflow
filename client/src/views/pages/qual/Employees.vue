<template>
  <div class="card border-0 h-100">
      <div class="font-semibold text-xl mb-4">사원 관리</div>
  
  
      <div class="text-end mt-3 mb-3"style="padding-right: 4%;">
     <Button label="초기화" severity="success" class="me-3" @click="empReset"/>
     <Button label="등록" severity="info" class="me-3" @click="empSave"/>
     <Button label="수정" severity="help" class="me-3" @click="empModify"/>
     <Button label="삭제" severity="danger" class="me-3" @click="empDelete"/>
   </div>
   <div class="row">
   <div class="emp-grid col">
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
                <h5>사원목록</h5>
                <div class="row">
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">사원번호</span>
                        <input type="text" class="form-control" placeholder="사원번호" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.emp_code" readonly>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">이름</span>
                        <input type="text" class="form-control" placeholder="이름" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.emp_name" readonly>
                    </div>
                </div>
                <div class="row">
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">부서</span>
                        <select class="form-select col" aria-label="Default select example" v-model="info.department">
                            <option disabled selected value="">부서</option>
                            <option v-for=" dep in departmentListAry" :key="dep.department" :value="dep.department">
                                {{ dep.department }}
                            </option>
                        </select>
                        
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">입사일</span>
                        <input type="text" class="form-control" placeholder="입사일" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.hire_date" readonly>
                    </div>
                </div>
                <div class="row">
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">전화번호</span>
                        <input type="text" class="form-control" placeholder="전화번호" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.tel" readonly>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">비밀번호</span>
                        <input type="password" class="form-control" placeholder="비밀번호" aria-label="Username"
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
         department: "",
         hire_date: "",
         tel: "",
         pwd: ''
       }
     ],
     columnDefs: [
       { field: 'emp_code', headerName: '사원번호',flex:1,editable:true},
       { field: 'emp_name', headerName: '이름' ,flex:1},
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
       { field: 'hire_date', headerName: '입사일' ,flex:1},
       { field: 'tel', headerName: '전화번호' ,flex:1,}        
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
    selectedSecondIndex: null,
    //상세그리드 행 인덱스
    prodIndex : null,

    info: {
      emp_code: "",
      prod_name: "",
      emp_name: "",
      department: "",
      hire_date: "",
      tel: "",
      pwd: "",
    },
    departmentListAry : [],
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
   empCellClicked(event){
     let emp = event.data.emp_code;
     this.prodIndex = event.rowIndex
     axios.get('/api/admin/employees/' + emp)
                .then(res => {
                  console.log(res)
                      this.info = res.data[0];
                      
                }).catch(error => {
                 console.error(error);
                });
                console.log(event);
       },

    //부서리스트 조회
    async departmentList(){
      await axios.get('/api/admin/departmentList')
                 .then(res => {
                  console.log(res.data)
                  this.departmentListAry = res.data;
                 })
    },
   //등록
   async empSave(){
    //값체크 validation
      for(let data of this.rowData) {
        console.log(data);
        if(data.emp_code == '' || data.emp_name == '' || data.department == '' || hire_date == '' || tel == '' || pwd == '') {
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
    const res = axios.post('/api/admin/empSave', {
      empList: this.rowData,
      empInfo: this.rowData[this.prodIndex].emp_code
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
                          prod_code: "",
                          prod_name: "",
                          process_code: "",
                          process_name: "",
                       }];
       this.ProcData();
      },
  }
};
</script>
<style>
 .ag-theme-alpine .ag-header {
 background-color: #65625e; 
 color: white;
 
 }
</style>
<style scoped>



.emp-grid {
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
