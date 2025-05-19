<template>
  <div class="card border-0 h-100">
    <h3>업체 관리</h3>
      <div class="text-end mt-3 mb-3">
     <Button label="초기화" severity="success" class="me-3" @click="comReset"/>
     <Button label="등록" severity="info" class="me-3" @click="comSave"/>
     <Button label="수정" severity="help" class="me-3" @click="comUpdate"/>
     <Button label="삭제" severity="danger" class="me-3" @click="comDelete"/>
   </div>
   <div class="row">
   <div class="com-grid col">
    <div class="heading-with-line">
    <h5>업체목록</h5>
  </div>
     <ag-grid-vue style="width: 1000px; height: 500px;"
       class="ag-theme-alpine"
       :columnDefs="columnDefs"
       :rowData="rowData"
       :gridOptions="gridOptions"
       :defaultColDef="defaultColDef"

       @cellClicked="comellClicked">
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
                        <span class="input-group-text" id="basic-addon1">위치</span>
                        <input type="text" class="form-control" placeholder="위치" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.address" >
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
                        <select class="form-select col" aria-label="Default select example" v-model="info.company_type">
                            <option disabled selected value="">업체타입</option>
                            <option v-for=" dep in companyListAry" :key="dep.sub_code" :value="dep.sub_code">
                                {{ dep.sub_code_name }}
                            </option>
                        </select>
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
        address: "",
        tel: "",
        emp_code: "",
        company_type: "",
       }
     ],
     columnDefs: [
       { field: 'company_code', headerName: '업체코드',flex:3},
       { field: 'company_name', headerName: '업체명' ,flex:5},
       { field: 'address', headerName: '위치' ,flex:6,},
       { field: 'tel', headerName: '연락처' ,flex:3},
       { field: 'emp_code', headerName: '담당자' ,flex:2,},
       { field: 'company_type', headerName: '업체타입' ,flex:2,
       valueFormatter: (params) => {
                if (params.value == 'CT1') {
                    return params.value = '입고업체';
                } else if (params.value == 'CT2') {
                    return params.value = '판매업체';
                } else if (params.value == 'CT3') {
                    return params.value = '설비수리업체';
                } else if (params.value == 'CT4') {
                    return params.value = '설비구매업체';
              }
       }
       }         
     ],
     gridOptions:{
         pagination: true,
         paginationPageSize: 9,
         paginationPageSizeSelector: [5, 10, 20, 50],
         overlayNoRowsTemplate: '표시할 값이 없습니다.',
         defaultColDef: {
           suppressMovable: true, //컬럼 드래그로 순서바꾸기 못하게
           resizable: false, //컬럼 너비 마우스로 조절 못하게
           sortable: false, //정렬 기능 비활성화
           cellClass: 'cursor-pointer',
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
        address: "",
        tel: "",
        emp_code: "",
        company_type: "",
    },
    companyListAry : [],
    selectedSecondIndex: null,
    prodIndex : null,
   }
 },
 async mounted() {
   await this.companyData();
   await this.companyList();
 },
 methods: {
  //업체목록
  async companyData(){
    try{
    const response = await axios.get('/api/admin/company');
    this.rowData = response.data;
    } catch (err) {
      console.log('데이터 조회 실패', err);
    }
  },
  comellClicked(event){
     let com = event.data.company_code;
     this.prodIndex = event.rowIndex
     axios.get('/api/admin/company/' + com)
                .then(res => {
                  console.log(res)
                      this.info = res.data[0];
                      
                }).catch(error => {
                 console.error(error);
                });
                console.log(event);
       },




  //업체타입 리스트
  async companyList(){
    await axios.get('/api/admin/comTypeList')
                 .then(res => {
                  console.log(res.data);
                  this.companyListAry = res.data;
                 })
  },

      //값체크 validation
      checkValue(){
      if(this.info.company_name == '' || this.info.address == '' || this.info.tel == ''|| this.info.emp_code == '' || this.info.company_type == '') {
          Swal.fire({
           title: '실패',
           text: '값을 다 입력해주세요',
           icon: 'error',
           confirmButtonText: '확인'
         });
         return 1;
        } else
        return 0;
    },


  //등록
  async comSave(){
    let validation = this.checkValue();
      if(validation == 1){
        return;
      }
      if(this.info.company_code != ''){
      Swal.fire({
            title: '등록 불가',
            text: '이미 업체가 등록된 건입니다.',
            icon: 'error',
            confirmButtonText: '확인'
          });
          return;
    }


       //등록시작
       const res =  await axios.post('/api/admin/comSave', this.info)
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
       await this.companyData();
       this.info =  {
                      company_code: "",
                      company_name: "",
                      address: "",
                      tel: "",
                      emp_code: "",
                      company_type: "",
                    }
      },
    
        //수정
        //값 다 넣었는지 체크
  async comUpdate(){
    let validation = this.checkValue();
        if(validation==1){
      return;
    }
    if(this.info.emp_code == ''){
      Swal.fire({
            title: '수정 불가',
            text: '업체코드가 필요합니다.',
            icon: 'error',
            confirmButtonText: '확인'
          });
          return;
    }

      //수정시작
      await axios.put('/api/admin/comUpdate',this.info)
     .then(res => {
        if(res.data.affectedRows >0) {
          Swal.fire({
            title: '수정 완료',
            text: '수정이 완료되었습니다.',
            icon: 'success',
            confirmButtonText: '확인'
          });
          this.companyData();
       this.info =  {
                      company_code: "",
                      company_name: "",
                      address: "",
                      tel: "",
                      emp_code: "",
                      company_type: "",
                    } 
          
        }else{
          Swal.fire({
            title: '수정 실패',
            text: '수정을 실패하였습니다.',
            icon: 'error',
            confirmButtonText: '확인'
          });
          return;
        }
     })
     .catch(err =>{
       console.error(err);
       Swal.fire({
         title: '수정 실패',
         text: '알수 없는 에러.',
         icon: 'error',
         confirmButtonText: '확인'
       });
       return
     });
     this.info = [{
        company_code: "",
        company_name: "",
        address: "",
        tel: "",
        emp_code: "",
        company_type: "",
    }]
  },
  //삭제
  async comDelete(){
    if(this.info.company_code == ''){
      Swal.fire({
            title: '삭제 실패',
            text: '삭제코드가 필요합니다.',
            icon: 'error',
            confirmButtonText: '확인'
          });
          return;
    }
    await axios.delete('/api/admin/comDelete/'+ this.info.company_code)
    .then(res => {
        if(res.data.affectedRows >0) {
          Swal.fire({
            title: '삭제 성공',
            text: '정상적으로 삭제되었습니다.',
            icon: 'success',
            confirmButtonText: '확인'
          });
          this.companyData();
       this.info =  {
                      company_code: "",
                      company_name: "",
                      address: "",
                      tel: "",
                      emp_code: "",
                      company_type: "",
                    } 
          
        }else{
          Swal.fire({
            title: '삭제 실패',
            text: '삭제를 실패하였습니다.',
            icon: 'error',
            confirmButtonText: '확인'
          });
          return;
        }
     })
     .catch(err =>{
       console.error(err);
       Swal.fire({
         title: '삭제 실패',
         text: '알수 없는 에러.',
         icon: 'error',
         confirmButtonText: '확인'
       });
       return
     });
     this.info = [{
                      company_code: "",
                      company_name: "",
                      address: "",
                      tel: "",
                      emp_code: "",
                      company_type: "",
    }]
  },
  //초기화
  comReset() {
    this.info = [];
  }
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