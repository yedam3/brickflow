<template>
  <div class="card border-0" style="height: 800px">
    <div class="font-semibold text-xl mb-4">자재검수관리</div>
    <div class="text-end mt-3 mb-3">
            <Button label="조회" severity="success" class="me-3"  />
            <Button label="등록" severity="info" class="me-3"/>
            <Button label="수정" severity="help" class="me-3" />
            <Button label="삭제" severity="danger" class="me-5"/>
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
                        <span class="input-group-text" id="basic-addon1">발주코드</span>
                        <input type="text" class="form-control" placeholder="발주코드" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.mat_order_code" readonly>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">발주상세코드</span>
                        <input type="text" class="form-control" placeholder="발주상세코드" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.mat_order_detailCode" readonly>
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
                        <span class="input-group-text" id="basic-addon1">기검수량</span>
                        <input type="text" class="form-control" placeholder="기검수량" aria-label="Username"
                            aria-describedby="basic-addon1" :value="formatAleady" readonly>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">미검수량</span>
                        <input type="text" class="form-control" placeholder="미검수량" aria-label="Username"
                            aria-describedby="basic-addon1" :value="formatNot" readonly>
                    </div>
                </div>
                <div class="row">
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">발주량</span>
                        <input type="text" class="form-control" placeholder="발주량" aria-label="Username"
                            aria-describedby="basic-addon1" :value="formatRequest" readonly>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">검수량</span>
                        <input type="number" class="form-control" placeholder="검수량" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.check_quantity">
                    </div>
                </div>
                <div class="row">
                    <div class="input-group col">
                        <span class="input-group-text" id="basic-addon1">검수내역</span>
                        <textarea class="form-control"  v-model="info.check_history" placeholder="비고" style="height: 100px; resize: none;"></textarea>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">등록자</span>
                        <input type="text" class="form-control" placeholder="등록자" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.emp_code" readonly>
                    </div>
                </div>
          </div>
       </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import axios from "axios";
import { AgGridVue } from "ag-grid-vue3";

export default{
  components:{
       AgGridVue,
        Swal,
  },
  data(){
    return {
      rowData: [],
      searchType: "mat_name",  // 검색 조건 
      searchText: "",   // 검색어
      columnDefs: [
        { field: "mat_name", headerName: "자재명", flex: 1 },
        { field: "mat_order_code", headerName: "발주코드", flex: 1 },
        { field: "company_name", headerName: "업체명", flex: 1 },
        { field: "check_code", headerName: "검수코드", flex: 1 },
        { field: "mat_code", headerName: "자재코드", flex: 1 },
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
        mat_order_detailCode: '',
        mat_code: '',
        already_check_quantity: '', //기검수량
        not_check_quantity: '',  //미검수량
        mat_name: '',
        request_quantity: '',
        check_quantity: 0,
        check_history: '',
        mat_order_code: '',
        emp_code: '',
        check_code: '',

      },
      showModal : false
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
  },
  mounted(){
    this.readyList();
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