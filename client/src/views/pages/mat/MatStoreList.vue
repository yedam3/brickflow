<template>
    <div class="card border-0" style="height: 800px">
        <h3>자재 재고 조회</h3>
        <div class="heading-with-line">
            <h5 class="m-0 me-3">조회</h5>
        </div>
        <div class="text-end mt-5 mb-3">
            <div class="row justify-content-between align-items-center">
                <div class="col-auto">
                    <div class="input-group">
                        <select class="form-select w-auto" v-model="searchType">
                            <option value="m.mat_code" selected>자재코드</option>
                            <option value="mat_name">자재명</option>
                        </select>
                        <input type="text" v-model="searchText" placeholder="검색" @input="onSearch" class="form-control"
                            style="width: 61%;" @keydown.enter="searchMaterials" />

                        <button @click="searchMaterials" class="btn btn-primary">
                            <i class="pi pi-search"></i>
                        </button>
                    </div>
                </div>

            </div>
        </div>
        <div class="row">
            <div class="col-7">
                <h4>자재 재고</h4>
                <ag-grid-vue class="ag-theme-alpine custom-grid-theme" style="width: 100%" :columnDefs="columnDefs"
                    :rowData="rowData" :gridOptions="gridOptions1" @cellClicked="matCellclicked">
                </ag-grid-vue>
            </div>
            <div class="col-5">
                <h4>LOT별 자재재고</h4>
                <ag-grid-vue ref="secondGrid" class="ag-theme-alpine custom-grid-theme"
                    style="width: 100%; height: 150px" :columnDefs="secondColumnDefs" :rowData="secondRowData"
                    :gridOptions="gridOptions">
                </ag-grid-vue>
            </div>
        </div>
    </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import axios from "axios";
import ProgressCell from "@/components/ProgressCell.vue";
export default {
    components : {
        AgGridVue,
        ProgressCell
    },
    data() {
        return {
            searchType: "m.mat_code",  // 검색 조건 
            searchText: "",   // 검색어
            //메인그리드
            rowData: [],
            //메인그리드 필드
            columnDefs: [
                { field: "mat_code", headerName: "자재코드", flex: 2, },
                { field: "mat_name", headerName: "자재명", flex: 3,},
                { field: "store_quantity", headerName: "재고량", flex: 2,
                    valueFormatter: (params) => {
                        return params.value != null ? `${params.value}개` : '';
                    }
                },
                { field: "safe_inventory", headerName: "안전재고량", flex: 2, 
                 valueFormatter: (params) => {
                        return params.value != null ? `${params.value}개` : '';
                    }
                },
                { field: "require_quantity", headerName: "필요량", flex: 2,
                 valueFormatter: (params) => {
                        return params.value !=  0 ? `-${params.value}개` : 0;
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
                { field: "mat_name", headerName: "자재명", flex: 2 },
                { field: "lot", headerName: "LOT", flex: 2 },
                { field: "store_quantity", headerName: "재고량", flex: 1, valueFormatter: (params) => {
                        return params.value != null ? `${params.value}개` : '';
                    }
                },
                { field: "store_name", headerName: "창고", flex: 2,},
            ],
              gridOptions1: {
                domLayout: "autoHeight",
                singleClickEdit: true,
                suppressRowClickSelection: false,
                rowSelection:"single",
                pagination: true,
                paginationPageSize: 10,
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
                paginationPageSize: 10,
                paginationPageSizeSelector: false,
                overlayNoRowsTemplate: '표시할 값이 없습니다.',
                defaultColDef: {
                    suppressMovable: true,
                    resizable: false,
                    sortable: false,
                    cellStyle: { textAlign: "center" },
                },
            },
        };
    },
    mounted(){
        this.basicList();
    },
    methods: {
            async basicList () {
                await axios.get('/api/mat/matStorepage')
                            .then(res => {
                                this.rowData = res.data
                            })
                            .catch((err) => console.log(err));
            },
            //검색 조회
            async searchMaterials() {
                await axios.get('/api/mat/matStorepage', {
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
            async matCellclicked(event){
                await axios.get('/api/mat/matLotList/'+event.data.mat_code)
                           .then(res => {
                            this.secondRowData = res.data
                           })
                           .catch(err => console.log(err));
            }
        }
    
}

</script>
<style scoped>
::v-deep(.ag-row-selected) {
    background-color: #BADDF9 !important; 
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
</style>