<template>
    <div class="card border-0" style="height: 800px">
        <div class="font-semibold text-xl mb-4">공정 진행 관리</div>

        <h4>공정 진행</h4>

        <div class="row mt-3 mb-3">
            <div class="col input-group mb-3 w-50">
                <select class="form-select" aria-label="Default select example">
                    <option value="1" selected>지시명</option>
                    <option value="2">주문명</option>
                    <option value="2">주문번호</option>
                </select>
            </div>
            <div class="col input-group mb-3 w-50">
                <select class="form-select" aria-label="Default select example">
                    <option value="1" selected>공정명</option>
                    <option value="2">주문명</option>
                    <option value="2">주문번호</option>
                </select>
            </div>
            <div class="col input-group mb-3 w-50">
                <select class="form-select" aria-label="Default select example">
                    <option value="1" selected>제품명</option>
                    <option value="2">주문명</option>
                    <option value="2">주문번호</option>
                </select>
            </div>
        </div>
        <!-- 메인그리드 -->
        <div class="mb-3">
            <div class="ag-wrapper justify-content-center" style="border: none;">
                <ag-grid-vue class="ag-theme-alpine custom-grid-theme" :columnDefs="productOrderColDefs"
                    :rowData="productOrderData" :gridOptions="gridOptions">
                </ag-grid-vue>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                <h4 class="text-start">작업자</h4>
                <div class="ag-wrapper justify-content-center" style="border: none;">
                    <ag-grid-vue class="ag-theme-alpine custom-grid-theme" :columnDefs="employeeColDefs" :rowData="rowData"
                        :gridOptions="gridOptions">
                    </ag-grid-vue>
                </div>
            </div>
            <div class="col-6">
                <h4 class="text-start">설비</h4>
                <div class="ag-wrapper justify-content-center" style="border: none;">
                    <ag-grid-vue class="ag-theme-alpine custom-grid-theme" :columnDefs="facColDefs" :rowData="rowData"
                        :gridOptions="gridOptions">
                    </ag-grid-vue>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center mt-3">
            <Button label="공정시작" severity="info" class="" size="large" style="width: 20rem; height: 5rem;" @click="startProcess"/>
        </div>
    </div>

</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import DatePickerEditor from "../../../components/DatePickerEditor.vue";
import axios from "axios";

export default {
    components: {
        AgGridVue,
    },
    data() {
        return {
            //메인그리드
            productOrderData: [
                {
                    product_order_code: "",         // 생산 지시 코드
                    prod_name: "",                  // 제품명
                    process_name: "",               // 공정명
                    process_seq: "",                // 공정 순서
                    order_quantity: "",             // 지시량
                    input_quantity: "",             // 투입량
                    created_quantity: "",           // 생산량
                    error_quantity: "",             // 불량량량
                    work_start_date: "",            // 시작 시간
                    work_end_date: "",              // 종료 시간
                    finish_status: "",              // 상태
                },
            ],
            productOrderColDefs: [
                { field: "mat_order_code", headerName: "생산지시명", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "company_code", headerName: "제품명", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "request_date", headerName: "공정명", flex: 2, editable: true, cellStyle: { textAlign: "center" }, cellEditor: "datePicker" },
                { field: "delivery_date", headerName: "공정순서", flex: 3, editable: true, cellStyle: { textAlign: "center" }, cellEditor: "datePicker" },
                { field: "order_quantity", headerName: "지시량", flex: 3, cellStyle: { textAlign: "center" } },
                { field: "input_quantity", headerName: "지시량", flex: 3, cellStyle: { textAlign: "center" } },
                { field: "created_quantity", headerName: "생산량", flex: 3, editable: true, cellStyle: { textAlign: "center" } },
                { field: "work_start_date", headerName: "시작시간", flex: 3, editable: true, cellStyle: { textAlign: "center" } },
                { field: "work_end_date", headerName: "종료시간", flex: 3, editable: true, cellStyle: { textAlign: "center" } },
                { field: "finish_status", headerName: "상태", flex: 3, editable: true, cellStyle: { textAlign: "center" } },
            ],
            employeeColDefs: [
                { field: "mat_order_code", headerName: "사번", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "company_code", headerName: "사원명", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "request_date", headerName: "부서명", flex: 2, cellStyle: { textAlign: "center" } },
            ],
            facColDefs: [
                { field: "fac_code", headerName: "설비코드", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "fac_name", headerName: "설비명", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "fac_status", headerName: "설비상태", flex: 2, cellStyle: { textAlign: "center" } },
            ],
            gridOptions: {
                domLayout: "autoHeight", //행을 보고 자동으로 hight부여
                singleClickEdit: true, //한번클릭했을때 수정
                suppressRowClickSelection: true, //	행 클릭할 때 체크박스 선택 방지
                defaultColDef: {
                    suppressMovable: true, //셀 이동 금지
                    resizable: false, // 열 크기 조정 가능
                    sortable: false, //정렬 금지
                },
            },
            showModal: false,
        };
    },
    watch() {

    },
    mounted() {
        this.productOrderList();
    },
    methods: {
        // 생산 지시 조회
        async productOrderList() {
            await axios.get(`/api/work/process/productOrderList`).then(res => {
                console.log(res);
            }).catch((err) => console.log(err));
        },

        // 생산 지시 조회
        

        // 공정 시작
        async startProcess() {

        }
    },
};
</script>

<style>
.ag-theme-alpine .ag-header-cell-label {
    justify-content: center;
}
</style>