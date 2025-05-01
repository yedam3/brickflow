<template>
    <CModal :visible="visible" @close="close" backdrop="static" alignment="center" size="xl" style="min-width: 1000px">
        <CModalHeader>
            <slot name="header">주문 목록</slot>
        </CModalHeader>

        <CModalBody>
            <div class="row">
                <Button label="행추가" severity="success" size="large" @click="" />
            </div>
            <div class="ag-theme-alpine" style="height: 400px; width: 100%">
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
    name: "OrderModal",
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
                this.matStockList();
            }
        }
    },
    data() {
        return {
            rowData: [],
            searchType: "",
            searchText: "",

            columnDefs: [
                { field: "lot", headerName: "LOT번호", flex: 1 },
                { field: "mat_code", headerName: "자재코드", flex: 1 },
                { field: "mat_name", headerName: "자재명", flex: 1 },
                { field: "store_date", headerName: "입고일자", flex: 1 },
                { field: "prod_name", headerName: "자재출고 가능 수량", flex: 2 },
                { field: "prod_name", headerName: "자재출고 수량", flex: 2 },
            ],
            gridOptions: {
                domLayout: "autoHeight",
                // singleClickEdit: true,               // 셀 편집 ON
                // suppressRowClickSelection: true,     // 행 클릭 선택 OFF
                suppressCellFocus: true,                // 셀 포커스 OFF
                pagination: true,                       // 페이징 ON
                paginationPageSize: 5,                  // 한 페이지 보여질 행 수
                paginationPageSizeSelector: false,      // paseSize 선택란 삭제
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
        // 제품별 자재 재고 목록
        this.matStockList();
    },
    methods: {

        // 모달창 닫기 이벤트
        close() {
            this.$emit("close");
        },

        // 제품별 자재 재고 목록 조회 API
        matStockList() {
            axios.get('/api/work/plan/orderList')
                .then(res => {
                    this.rowData = res.data
                })
                .catch(error => { console.error(error) });
        },

        // 그리드 행 클릭 메소드
        onRowClicked(event) {
            this.$emit('selectOrder', event.data);
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