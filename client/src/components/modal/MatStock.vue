<template>
    <CModal :visible="visible" @close="close" backdrop="static" alignment="center" size="xl" style="min-width: 1000px">
        <CModalHeader>
            <slot name="header">주문 목록</slot>
        </CModalHeader>

        <CModalBody>
            <div class="text-end mb-3">
                <Button label="자동계산" severity="success" size="large" @click="" />
            </div>
            <div class="ag-theme-alpine align-content-center">
                <AgGridVue style="width: 100%; height: 100%" class="ag-theme-alpine" :columnDefs="columnDefs"
                    :rowData="rowData" :gridOptions="gridOptions" />
            </div>
            <div class="text-center mt-3">
                <Button label="자재 확보" severity="success" size="large" @click="matSecure" />
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
        mat_code: {
            type: String,
            required: true,
        },
            
    },
    
    watch: {
        visible(newVal) {
            if (newVal) {
                this.matStockList();
            }
        },
        mat_code(newVal) {
            if (newVal) {
                this.matStockList();
            }
        }
    },
    data() {
        return {
            rowData: [],

            mat_data: [],

            columnDefs: [
                { field: "mat_LOT", headerName: "LOT번호", flex: 1 },
                { field: "mat_code", headerName: "자재코드", flex: 1 },
                { field: "mat_name", headerName: "자재명", flex: 1 },
                { field: "store_date", headerName: "입고일자", flex: 1 },
                { field: "available_qty", headerName: "자재출고 가능 수량", flex: 2 },
                { field: "mat_hold_qty", headerName: "자재출고 수량", editable: true, flex: 2 },
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
        async matStockList() {
            const result = await axios.get(`/api/work/order/matQty/${this.mat_code}`).catch(error => { console.error(error) });
            let matList = result.data;
            this.rowData = [...matList];
        },

        // 자재 확보 버튼
        matSecure() {
            this.mat_data = [];
            for(let row of this.rowData) {
                if(row.mat_hold_qty != '' && row.mat_hold_qty > 0) {
                    this.mat_data.push({
                        mat_code: row.mat_code,
                        mat_LOT: row.mat_LOT,
                        mat_hold_qty: row.mat_hold_qty
                    })
                }
            }
            this.$emit('matHoldData', this.mat_data);
            this.close();
        },

        // 그리드 행 클릭 메소드
        onRowClicked() {
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