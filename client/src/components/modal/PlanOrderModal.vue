<template>
    <CModal :visible="visible" @close="close" backdrop="static" alignment="center" size="xl" style="min-width: 1000px">
        <CModalHeader>
            <slot name="header">생산지시 목록</slot>
        </CModalHeader>

        <CModalBody>
            <div class="ag-theme-alpine" style="height: 400px; width: 100%">
                <!-- 생산계획 검색 -->
                <div class="d-flex justify-content-center me-5">
                    <div class="input-group mb-3 w-50">
                        <select class="form-select" aria-label="Default select example">
                            <option value="1" selected>지시명</option>
                            <option value="2">주문명</option>
                            <option value="2">제품명</option>
                        </select>
                        <input type="text" v-model="searchText" placeholder="검색어 입력" @keydown.enter="searchOrders"
                            class="form-control w-50" style="width: 30%" />
                        <button @click="searchMaterials" class="btn btn-primary">
                            <i class="pi pi-search"></i>
                        </button>
                    </div>
                </div>
                <AgGridVue style="width: 100%; height: 100%" class="ag-theme-alpine" :columnDefs="columnDefs"
                    :rowData="rowData" :gridOptions="gridOptions" @rowClicked="onRowClicked" />
            </div>
        </CModalBody>

        <CModalFooter>
            <slot name="footer">
                <CButton color="secondary" @click="close">닫기</CButton>
            </slot>
        </CModalFooter>
    </CModal>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import axios from "axios";

export default {
    name: "PlanOrderModal",
    components: {
        AgGridVue,
    },
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
    },
    watch: {
        visible(newVal) {
            if (newVal) {
                this.planOrderList();
            }
        }
    },
    data() {
        return {
            rowData: [

            ],
            searchType: "",
            searchText: "",

            columnDefs: [
                { field: "product_order_code", headerName: "생산지시코드", flex: 1 },
                { field: "product_order_name", headerName: "생산지시명", flex: 2 },
                { field: "start_date", headerName: "시작일", flex: 1 },
                { field: "end_date", headerName: "종료일", flex: 1 },
                { field: "prod_name", headerName: "제품명", flex: 3 },
                {
                    field: "finish_status", headerName: "상태", flex: 1,
                    valueFormatter: params => {
                        if(params.value === 'WS1') {
                            return '지시등록';
                        } else if(params.value === 'WS2') {
                            return '생산중';
                        } else if(params.value === 'SW3') {
                            return '생산완료';
                        }
                    },
                    cellStyle: params => {
                        if(params.value === 'OS1') {
                            return { textAlign: 'center', fontWeight: 'bold', color: '#6c757d' };
                        } else if(params.value == 'OS2') {
                            return { textAlign: 'center', fontWeight: 'bold', color: '#fd7e14' };
                        } else if(params.value == 'OS3') {
                            return { textAlign: 'center', fontWeight: 'bold', color: '#28a745' };
                        }
                    }
                },
            ],
            gridOptions: {
                domLayout: "autoHeight",
                // singleClickEdit: true,               // 셀 편집 ON
                // suppressRowClickSelection: true,     // 행 클릭 선택 OFF
                suppressCellFocus: true,                // 셀 포커스 OFF
                pagination: true,                       // 페이징 ON
                paginationPageSize: 5,                  // 한 페이지 보여질 행 수
                paginationPageSizeSelector: false,      //paseSize 선택란 삭제
                defaultColDef: {                        // 열(컬럼) 기본 설정
                    suppressMovable: true,              // 컬럼을 드래그하여 이동하지 못하게
                    resizable: false,                   // 컬럼 크기 조절 못하게
                    sortable: false,                    // 정렬 못하게
                    cellStyle: { textAlign: "center" }, // 텍스트를 가운데 정렬
                },
            },

        };
    },
    mounted() {
        // 계획 지시 목록
        this.planOrderList();
    },
    methods: {
        // 모달창 닫기 이벤트
        close() {
            this.$emit("close");
        },

        // 계획지시 목록 조회 API
        planOrderList() {
            axios.get('/api/work/order/list')
                .then(res => {
                    this.rowData = res.data
                })
                .catch(error => { console.error(error) })
        },

        // 그리드 행 클릭 메소드
        onRowClicked(event) {
            console.log(event.data.product_order_code);
            this.$emit('selectPlanOrder', event.data);
            this.close();
        },
    },
};
</script>


<style scoped>
.btn-primary {
    background-color: rgb(230, 171, 98);
    border-color: rgb(230, 171, 98);
    ;
}

.selected-row {
    background-color: #d0e7ff !important;
}
</style>