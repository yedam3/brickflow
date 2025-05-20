<template>
    <div class="card border-0" style="height: calc(20vh - 2rem);">
        <h3>영업 관리</h3>
        <div class="heading-with-line">
            <h5 class="m-0 me-3">제품 재고 조회</h5>
        </div>
    </div>

    <div class="row">
        <div class="col-7">
            <div class="heading-with-line">
                <h5 class="m-0 me-3">제품 재고</h5>
            </div>
            <div class="card border-0" style="height: calc(80vh - 10rem);">
                <div class="text-end mb-2">
                    <div class="row justify-content-between align-items-center">
                        <div class="col-auto">
                            <div class="input-group">
                                <select class="form-select w-auto" v-model="searchType">
                                    <option value="p.prod_code" selected>제품코드</option>
                                    <option value="prod_name">제품명</option>
                                </select>
                                <input type="text" v-model="searchText" placeholder="검색" @input="onSearch"
                                    class="form-control" style="width: 61%;" @keydown.enter="searchMaterials" />

                                <button @click="searchMaterials" class="btn btn-primary">
                                    <i class="pi pi-search"></i>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
                <ag-grid-vue class="ag-theme-alpine custom-grid-theme" style="width: 100%" :columnDefs="columnDefs"
                    :rowData="rowData" :gridOptions="gridOptions1" @cellClicked="prodClicked">
                </ag-grid-vue>
            </div>
        </div>
        <div class="col-5">
            <div class="heading-with-line">
                <h5 class="m-0 me-3">LOT별 제품재고</h5>
            </div>
            <div class="card border-0 " style="height: calc(80vh - 10rem);">
                <div class="mt-5">
                <ag-grid-vue ref="secondGrid" class="ag-theme-alpine custom-grid-theme"
                    style="width: 100%; height: 150px" :columnDefs="secondColumnDefs" :rowData="secondRowData"
                    :gridOptions="gridOptions" rowSelection="multiple">
                </ag-grid-vue>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { AgGridVue } from "ag-grid-vue3";
    import axios from "axios";
    import ProgressCell from "@/components/ProgressCell.vue";

export default  {
  components : {
    AgGridVue,
    ProgressCell
  },
  data(){
    return{
      searchType: "p.prod_code",  // 검색 조건 
            searchText: "",   // 검색어
            //메인그리드
            rowData: [],
            //메인그리드 필드
            columnDefs: [
                { field: "prod_code", headerName: "제품코드", flex: 2, },
                { field: "prod_name", headerName: "제품명", flex: 3,},
                { field: "store_quantity", headerName: "재고량", flex: 2,
                    valueFormatter: (params) => {
                        return params.value != null ? `${params.value}개` : '';
                    }
                },
                { field: "proper_store", headerName: "안전재고량", flex: 2, 
                 valueFormatter: (params) => {
                        return params.value != null ? `${params.value}개` : '';
                    }
                },
                { field: "require_quantity", headerName: "필요량", flex: 2,
                 valueFormatter: (params) => {
                        return params.value != null ? `-${params.value}개` : '';
                    } 
                },
                { field: "percentage", headerName: "안전 대비 보유율 (%)", flex: 3 ,
                    cellRenderer: 'ProgressCell'
                }
            ],
            //상세그리드
            secondRowData: [],
            //상세그리드 필드
            secondColumnDefs: [
                // 체크박스 추가
                { field: "prod_name", headerName: "제품명", hide:true },
                { field: "lot", headerName: "LOT", flex: 1 },
                { field: "store_quantity", headerName: "재고량", flex: 1, valueFormatter: (params) => {
                        return params.value != null ? `${params.value}개` : '';
                    }
                },
                { field: "store_name", headerName: "창고", flex: 1,},
            ],
             gridOptions1: {
                domLayout: "autoHeight",
                singleClickEdit: true,
                suppressRowClickSelection: false,
                rowSelection:"single",
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
    }
  },
  mounted(){
        this.basicList();
    },
  methods : {
    // 초기조회
    async basicList() {
       await axios.get('/api/sales/prodStoreList')
                   .then(res => {
                     this.rowData = res.data
                   })
                   .catch((err) => console.log(err));
    },
    //검색 조회
    async searchMaterials() {
                await axios.get('/api/sales/prodStoreList', {
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
      //클릭시 재고 조회
      async prodClicked(event) {
  
        axios.get(`/api/sales/prodStoreList/${event.data.prod_code}`)
             .then(res => {
                this.secondRowData = res.data
             })
             .catch((err) => console.log(err));
      }
  }
}
</script>

<style scoped>
::v-deep(.ag-row-selected) {
    background-color: #BADDF9 !important; 
  }
  /* 헤더 텍스트 가운데 정렬 */
::v-deep(.ag-theme-alpine .ag-header-cell-label) {
  justify-content: center;
}

/* headerClass로 설정한 header-center 클래스에 적용 */
::v-deep(.header-center .ag-header-cell-label) {
  justify-content: center;
}
.btn-primary {
      background-color: rgb(230, 171, 98);
      border-color: rgb(230, 171, 98);
    }
</style>