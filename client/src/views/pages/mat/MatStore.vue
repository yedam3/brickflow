<template>
    <div class="card border-0" style="height: 800px">
        <div class="font-semibold text-xl mb-4">자재입고관리</div>
        <div class="text-end mt-3 mb-3">
            <Button label="조회" severity="success" class="me-3" @click="searchStore"/>
            <Button label="등록" severity="info" class="me-3" @click="addStore"/>
            <Button label="수정" severity="help" class="me-3" @click="updateStore"/>
            <Button label="삭제" severity="danger" class="me-5" @click="deleteStore"/>
        </div>
        <div class="row">
            <div class="ag-theme-alpine col me-5" style="height: 400px; width: 50%">
                <!-- 검색창 -->
                <div class="d-flex justify-content-start">
                    <div class="input-group mb-5" style="width: 65%;">
                        <!-- 검색 조건 선택 -->
                        <select v-model="searchType" class="form-select" aria-label="Default select example">
                            <option value="mat_name" selected>자재명</option>
                            <option value="o.mat_order_code">발주코드</option>
                            <option value="company_name">업체명</option>
                            <option value="m.check_code">검수코드</option>
                        </select>
                        <!-- 검색어 입력 -->
                        <input type="text" v-model="searchText" placeholder="검색어 입력" class="form-control w-50"
                            style="width: 100%" @keydown.enter="searchReadyList" />
                        <!-- 검색 버튼 -->
                        <button @click="searchReadyList" class="btn btn-primary">
                            <i class="pi pi-search"></i>
                        </button>
                    </div>
                </div>
                <!-- ag-Grid 테이블 -->
                <AgGridVue style="width: 100%; height: 100%" class="ag-theme-alpine" :columnDefs="columnDefs"
                    :rowData="rowData" :gridOptions="gridOptions" @rowClicked="clicked" />
            </div>
            <div class="card border-0 col" style="height: 650px; background-color: #F5F5F5;">
                <h5>입고등록</h5>
                <div class="row">
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">LOT</span>
                        <input type="text" class="form-control" placeholder="LOT" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.mat_lot" readonly>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">담당자</span>
                        <input type="text" class="form-control" placeholder="담당자" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.emp_code" readonly>
                    </div>
                </div>
                <div class="row">
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">자재코드</span>
                        <input type="text" class="form-control" placeholder="자재코드" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.mat_code" readonly>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">자재명</span>
                        <input type="text" class="form-control" placeholder="자재명" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.mat_name" readonly>
                    </div>
                </div>
                <div class="row">
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">입고가능수량</span>
                        <input type="text" class="form-control" placeholder="입고가능수량" aria-label="Username"
                            aria-describedby="basic-addon1" :value="formatAleady" readonly>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">입고수량</span>
                        <input type="number" class="form-control" placeholder="입고수량" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.store_quantity">
                    </div>
                </div>
                <div class="row">
                    <div class="input-group col">
                        <span class="input-group-text" id="basic-addon1">비고</span>
                        <textarea class="form-control" v-model="info.note" placeholder="비고"
                            style="height: 100px; resize: none;"></textarea>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">창고</span>
                        <select class="form-select col" aria-label="Default select example" v-model="info.storage_code">
                            <option disabled selected value="">창고</option>
                            <option v-for="store in storeListAry" :key="store.storage_code" :value="store.storage_code">
                                {{ store.store_name }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <StoreList
        :visible="showModal"
        rowSelection="multiple"
        @close="showModal = false"
        @selectOrder="orderSelected"
   ></StoreList>
</template>
  
  <script>
  import Swal from 'sweetalert2';
  import axios from "axios";
  import { AgGridVue } from "ag-grid-vue3";
  import StoreList from '@/components/modal/StoreList.vue';
  
  export default{
    components:{
         AgGridVue,
          Swal,
          StoreList
    },
    data(){
      return {
        rowData: [],
        searchType: "mat_name",  // 검색 조건 
        searchText: "",   // 검색어
        columnDefs: [
          { field: "mat_code", headerName: "자재코드", flex: 1 },
          { field: "mat_name", headerName: "자재명", flex: 1 },
          { field: "mat_order_code", headerName: "발주코드", flex: 1 },
          { field: "company_name", headerName: "업체명", flex: 1 },
          { field: "check_code", headerName: "검수코드", hide:true},
          { field: "mat_check_pass", headerName: "입고가능수량", flex: 1,
          valueFormatter: (params) => {
                return params.value != null ? `${params.value}개` : '';
              }
           },
        ],
        gridOptions: {
          domLayout: "autoHeight",
          singleClickEdit: true,
          suppressRowClickSelection: true,
          pagination: true,
          paginationPageSize: 8,
          paginationPageSizeSelector: false,
          overlayNoRowsTemplate: '표시할 값이 없습니다.',
          defaultColDef: {
            suppressMovable: true,
            resizable: false,
            sortable: false,
            cellStyle: { textAlign: "center" },
          },
  
        },
        info: {
          mat_lot: '',
          emp_code: '',
          mat_code: '', 
          mat_name: '',  
          mat_check_pass: '',
          store_quantity: '',
          check_code:'',
          note: '',
          storage_code : ''
        },
        storeListAry : [],
        showModal : false
      }
    },
    mounted(){
      this.readyList();
      this.lotAuto();
      this.storeList();
    },
    computed :{
      formatAleady(){
              if(this.info.mat_check_pass==''){
                  return this.info.mat_check_pass
              }else{
              return this.info.mat_check_pass +'개'
             }
          },
    },
    watch : {
        'info.store_quantity' :function (newVal) {
            if(this.info.mat_check_pass<this.info.store_quantity){
                this.info.store_quantity = this.info.mat_check_pass;
                alert('입고가능수량보다 입고량이 넘을 수 없습니다.')
            }
        }
    },
    methods: {
      close() {
              this.$emit("close");
          },
          async readyList() {
            //검수대기 항목 조회
              await axios.get('/api/mat/storeReadyList')
                  .then(res => {
                      this.rowData = res.data;
                  })
                  .catch(error => {
                      console.error(error);
                  });
          },
          //검색 조회
          async searchReadyList() {
              await axios.get('/api/mat/storeReadyList', {
                  params: {
                      type: this.searchType,
                      keyword: this.searchText,
                  }
              })
                  .then(res => {
                      this.rowData = res.data;
                  })
                  .catch(error => {
                      console.error(error);
                  });
          },
          //등록건수 체크
          async storageCheck() {
            let result = await axios.get('/api/mat/storeCount/'+this.info.mat_lot)
                        .catch((err) => {
                            console.log(err);
                        })
            return result.data.countCheck;
          } ,
          //LOT 자동증가
          async lotAuto() {
              await axios.get('/api/mat/matLotAuto')
                          .then(res => {
                              this.info.mat_lot = res.data.mat_lot;
                          })
                          .catch(err => {
                              console.log(err)
                          })
          },
          //클릭시 전달
          clicked(event){
              this.info.mat_name = event.data.mat_name;
              this.info.mat_code = event.data.mat_code;
              this.info.mat_check_pass = event.data.mat_check_pass;
              this.info.check_code = event.data.check_code;
          },
          //창고리스트 조회
          async storeList(){
            await axios.get('/api/mat/storeList')
                       .then(res => {
                        console.log(res.data)
                        this.storeListAry = res.data;
                       })
          },
          //등록
          async addStore(){
            //값 다 넣었는지 조회
            if(this.info.store_quantity=='' || this.info.storage_code=='' ||this.info.mat_code == ''){
                Swal.fire({
                    title:'실패',
                    text:'해당하는 값을 입력해주십시오',
                    icon: "error",
                    confirmButtonText : '확인'
                })
                return;
            }
            //이미등록건인지 조회
            let count = await this.storageCheck();
            if(count>0){
                Swal.fire({
                    title:'실패',
                    text:'이미 등록이 진행된 건 입니다.',
                    icon: "error",
                    confirmButtonText : '확인'
                })
                return;
            }
            //등록 진행
            await axios.post('/api/mat/storeAdd',this.info)
                       .then(res => {
                        if(res.data.affectedRows > 0){
                            Swal.fire({
                                title: '성공',
                                text: '등록이 성공하였습니다',
                                icon: "success",
                                confirmButtonText: '확인'
                            })
                            //초기화
                            this.resetValue();
                            this.readyList();
                            this.lotAuto();
                        }
                        else{
                            Swal.fire({
                                title: '실패',
                                text: '등록이 실패하였습니다.',
                                icon: "error",
                                confirmButtonText: '확인'
                            })
                        }
                       })
          },
          async searchStore(){
            this.showModal = true;
          },
          //값전달
          async orderSelected(event) {
            this.info.mat_lot = event.mat_lot;
            this.info.mat_code = event.mat_code;
            this.info.mat_name = event.mat_name;
            this.info.mat_check_pass = event.mat_check_pass;
            this.info.store_quantity = event.store_quantity;
            this.info.check_code = event.check_code;
            this.info.storage_code = event.storage_code;
          },
          //초기화
          resetValue(){
            this.info.mat_lot = '';
            this.info.mat_code = '';
            this.info.mat_name = '';
            this.info.mat_check_pass = '';
            this.info.store_quantity = '';
            this.info.check_code = '';
            this.info.storage_code = '';
          }
          ,
          //수정
          async updateStore(){
            //값 다 넣었는지 조회
            if(this.info.store_quantity=='' || this.info.storage_code=='' || this.info.mat_code == '' ){
                Swal.fire({
                    title:'실패',
                    text:'해당하는 값을 입력해주십시오',
                    icon: "error",
                    confirmButtonText : '확인'
                })
                return;
            }
             //이미등록건인지 조회
            let count = await this.storageCheck();
            if(count<1){
                Swal.fire({
                    title:'실패',
                    text:'등록이 되지 않은 건입니다.',
                    icon: "error",
                    confirmButtonText : '확인'
                })
                return;
            }
            await axios.put('/api/mat/storeUpdate',this.info)
                        .then(res => {
                            if(res.data.affectedRows > 0){
                                Swal.fire({
                                    title: '수정',
                                    text: '수정이 완료되었습니다.',
                                    icon: "success",
                                    confirmButtonText: '확인'
                                })
                                //초기화
                                this.resetValue();
                                this.readyList();
                                this.lotAuto();
                            }else{
                                Swal.fire({
                                    title: '수정실패',
                                    text: '수정이 실패하였습니다',
                                    icon: "error",
                                    confirmButtonText: '확인'
                                })
                            }
                        })
                        .catch((err) => console.log(err));
          },
          //삭제
          async deleteStore(){
              //이미등록건인지 조회
              let count = await this.storageCheck();
            if(count<1){
                Swal.fire({
                    title:'실패',
                    text:'등록이 되지 않은 건입니다.',
                    icon: "error",
                    confirmButtonText : '확인'
                })
                return;
            }
            //삭제시작
            await axios.delete('/api/mat/storeDelete/'+this.info.mat_lot)
                        .then(res => {
                            //삭제 성고
                            if(res.data.affectedRows > 0){
                                Swal.fire({
                                    title: '삭제',
                                    text: '삭제기 완료되었습니다.',
                                    icon: "success",
                                    confirmButtonText: '확인'
                                })
                                //초기화
                                this.resetValue();
                                this.readyList();
                                this.lotAuto();
                            }else{
                                Swal.fire({
                                    title: '삭제실패',
                                    text: '삭제가 실패하였습니다',
                                    icon: "error",
                                    confirmButtonText: '확인'
                                })
                            }
                        })
          }
        
    },
    
   
  }
  </script>
  
  <style scoped>
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