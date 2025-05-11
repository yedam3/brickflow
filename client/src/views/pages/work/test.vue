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

        <!-- 생산 지시 목록 그리드 -->
        <div class="mb-3">
            <div class="ag-wrapper justify-content-center" style="border: none;">
                <ag-grid-vue class="ag-theme-alpine custom-grid-theme" :columnDefs="productOrderColDefs"
                    :rowData="productOrderDataList" :gridOptions="productOrderGridOptions" @rowClicked="productOrderRowClicked">
                </ag-grid-vue>
            </div>
        </div>

        <div class="row">
            <!-- 사원 목록 그리드 -->
            <div class="col-6">
                <h4 class="text-start">작업자</h4>
                <div class="ag-wrapper justify-content-center" style="border: none;">
                    <ag-grid-vue class="ag-theme-alpine custom-grid-theme" :columnDefs="employeeColDefs" :rowData="empDataList"
                        :gridOptions="empGridOptions" @rowClicked="empRowClicked">
                    </ag-grid-vue>
                </div>
            </div>
            
            <!-- 설비 목록 그리드 -->
            <div class="col-6">
                <h4 class="text-start">설비</h4>
                <div class="ag-wrapper justify-content-center" style="border: none;">
                    <ag-grid-vue class="ag-theme-alpine custom-grid-theme" :columnDefs="facColDefs" :rowData="facDataList"
                        :gridOptions="facGridOptions" @rowClicked="facRowClicked">
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
            //  생산 지시 데이터 목록
            productOrderDataList: [
                // {
                //     work_lot: "",                   // 공정 LOT
                //     product_order_code: "",         // 생산 지시 코드
                //     product_order_name: "",         // 생산 지시명
                //     prod_name: "",                  // 제품명
                //     process_code: "",               // 공정 코드
                //     process_name: "",               // 공정명
                //     process_sequence: "",           // 공정 순서
                //     order_quantity: "",             // 지시량
                //     input_quantity: "",             // 투입량
                //     created_quantity: "",           // 생산량
                //     error_quantity: "",             // 불량량
                //     work_start_date: "",            // 시작 시간
                //     work_end_date: "",              // 종료 시간
                //     finish_status: "",              // 상태
                // },
            ],
            // 사원 데이터 목록
            empDataList: [
                // {
                //     emp_code: "",                   // 사번
                //     emp_name: "",                   // 사원명
                //     department_name: "",            // 부서명
                // }
            ],
            // 설비 데이터 목록
            facDataList: [
                // {
                //     fac_code: "",                   // 설비 코드
                //     model_name: "",                 // 설비명
                //     fac_status: "",                 // 설비 상태
                // }
            ],

            // 공정 시작 데이터
            processData: {

            },

            // 생산 지시 행 클릭 Index
            productOrderSelectedIdx: null,
            // 사원 행 클릭 Index
            empSelectedIdx: null,
            // 설비 행 클릭 Index
            facSelectedIdx: null,

            // 선택된 행 노드 저장
            selectedProductOrderRow: null,
            selectedEmpRow: null,
            selectedFacRow: null,

            // AG-GRID 정보
            productOrderColDefs: [
                { field: "work_lot", headerName: "Work_LOT", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "product_order_name", headerName: "생산지시명", flex: 3, cellStyle: { textAlign: "center" } },
                { field: "prod_name", headerName: "제품명", flex: 3, cellStyle: { textAlign: "center" } },
                { field: "process_name", headerName: "공정명", flex: 3, cellStyle: { textAlign: "center" }, cellEditor: "datePicker" },
                { field: "process_sequence", headerName: "공정순서", flex: 1.5, cellStyle: { textAlign: "center" }, cellEditor: "datePicker" },
                { field: "order_quantity", headerName: "지시량", flex: 1.5, cellStyle: { textAlign: "center" } },
                { field: "input_quantity", headerName: "투입량", flex: 1.5, cellStyle: { textAlign: "center" } },
                { field: "created_quantity", headerName: "생산량", flex: 1.5, cellStyle: { textAlign: "center" } },
                { field: "error_quantity", headerName: "불량량", flex: 1.5, cellStyle: { textAlign: "center" } },
                { field: "work_start_date", headerName: "시작시간", flex: 3, cellStyle: { textAlign: "center" } },
                { field: "work_end_date", headerName: "종료시간", flex: 3, cellStyle: { textAlign: "center" } },
                {
                    field: "finish_status", headerName: "상태", flex: 2,
                    valueFormatter: params => {
                        if(params.value === 'PP1') {
                            return '생산 대기';
                        } else if(params.value == 'PP2') {
                            return '생산중';
                        } else if(params.value == 'PP3') {
                            return '부분 생산 완료';
                        }
                    },
                    cellStyle: params => {
                        if(params.value === 'PP1') {
                            return { textAlign: 'center', fontWeight: 'bold', color: '#6c757d' };
                        } else if(params.value == 'PP2') {
                            return { textAlign: 'center', fontWeight: 'bold', color: '#007bff' };
                        } else if(params.value == 'PP3') {
                            return { textAlign: 'center', fontWeight: 'bold', color: '#28a745' };
                        }
                    }
                },
            ],
            employeeColDefs: [
                { field: "emp_code", headerName: "사번", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "emp_name", headerName: "사원명", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "department_name", headerName: "부서명", flex: 2, cellStyle: { textAlign: "center" } },
            ],
            facColDefs: [
                { field: "fac_code", headerName: "설비코드", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "model_name", headerName: "설비명", flex: 2, cellStyle: { textAlign: "center" } },
                { 
                    field: "fac_status", headerName: "설비상태", flex: 2,
                    valueFormatter: params => {
                        if(params.value === 'FS1') {
                            return '사용가능';
                        } else if(params.value == 'FS2') {
                            return '사용불가';
                        }
                    },
                    cellStyle: params => {
                        if(params.value === 'FS1') {
                            return { textAlign: 'center', fontWeight: 'bold', color: '#28a745' };
                        } else if(params.value == 'FS2') {
                            return { textAlign: 'center', fontWeight: 'bold', color: '#007bff' };
                        }
                    }
                },
            ],
            // 각 그리드별 옵션 분리
            productOrderGridOptions: {
                domLayout: "autoHeight",
                singleClickEdit: true,
                suppressRowClickSelection: false,  // 행 선택 활성화
                rowSelection: 'single',           // 단일 행 선택
                getRowClass: (params) => {
                    return this.selectedProductOrderRow === params.node ? 'ag-row-selected-custom' : '';
                },
                defaultColDef: {
                    suppressMovable: true,
                    resizable: false,
                    sortable: false,
                },
            },
            empGridOptions: {
                domLayout: "autoHeight",
                singleClickEdit: true,
                suppressRowClickSelection: false,  // 행 선택 활성화
                rowSelection: 'single',           // 단일 행 선택
                getRowClass: (params) => {
                    return this.selectedEmpRow === params.node ? 'ag-row-selected-custom' : '';
                },
                defaultColDef: {
                    suppressMovable: true,
                    resizable: false,
                    sortable: false,
                },
            },
            facGridOptions: {
                domLayout: "autoHeight",
                singleClickEdit: true,
                suppressRowClickSelection: false,  // 행 선택 활성화
                rowSelection: 'single',           // 단일 행 선택
                getRowClass: (params) => {
                    return this.selectedFacRow === params.node ? 'ag-row-selected-custom' : '';
                },
                defaultColDef: {
                    suppressMovable: true,
                    resizable: false,
                    sortable: false,
                },
            },
            showModal: false,
        };
    },
    watch() {

    },
    mounted() {
        this.productOrderList();
        this.empList();
    },
    methods: {
        // 생산 지시 조회
        async productOrderList() {
            await axios.get(`/api/work/process/productOrderList`).then(res => {
                const list = res.data
                this.productOrderDataList = [...list];
            }).catch((err) => console.error(err));
        },

        // 사원 목록 조회
        async empList() {
            await axios.get(`/api/work/process/empList`).then(res => {
                const list = res.data
                this.empDataList = [...list];
            }).catch((err) => console.error(err));
        },

        // 생산 행 클릭 - 설비 목록 조회
        async productOrderRowClicked(params) {
            // 이전 선택 행 스타일 제거 및 새 선택 행 저장
            this.selectedProductOrderRow = params.node;

            // 선택된 행의 스타일 업데이트를 위해 그리드 리프레시
            if (params.api) {
                params.api.refreshCells({
                    force: true,
                    rowNodes: [params.node]
                });
            }

            await axios.get(`/api/work/process/facList/${params.data.work_lot}`).then(res => {
                const list = res.data;
                this.facDataList = [...list];
                
                // 기존 코드에 오류가 있어 수정
                // this.productOrderData.push 대신 직접 배열 할당
            }).catch((err) => console.error(err));
            
            this.processData = {};

            this.processData.process = {
                work_lot: params.data.work_lot,                         // 공정 LOT
                product_order_name: params.data.product_order_code,     // 생산 지시명
                prod_name: params.data.prod_name,                       // 제품명
                process_code: params.data.process_code,                 // 공정 코드
                process_name: params.data.process_name,                 // 공정명
                process_sequence: params.data.process_sequence,         // 공정 순서
                order_quantity: params.data.order_quantity,             // 지시량
                input_quantity: params.data.input_quantity,             // 투입량
                created_quantity: params.data.created_quantity,         // 생산량
                error_quantity: params.data.error_quantity,             // 불량량
                work_start_date: params.data.work_start_date,           // 시작 시간
                work_end_date: params.data.work_end_date,               // 종료 시간
                finish_status: params.data.finish_status,               // 상태
            };
            
            // 설비 행 선택 초기화
            this.selectedFacRow = null;
            if (this.$refs.facGrid && this.$refs.facGrid.api) {
                this.$refs.facGrid.api.deselectAll();
            }
        },

        // 사원 행 클릭
        empRowClicked(params) {
            // 이전 선택 행 스타일 제거 및 새 선택 행 저장
            this.selectedEmpRow = params.node;
            
            // 선택된 행의 스타일 업데이트를 위해 그리드 리프레시
            if (params.api) {
                params.api.refreshCells({
                    force: true,
                    rowNodes: [params.node]
                });
            }

            this.processData.emp = {
                emp_code: params.data.emp_code,                 // 사번
                emp_name: params.data.emp_name,                 // 사원명
                department_name: params.data.department_name,   // 부서명
            }
        },

        // 설비 행 클릭
        facRowClicked(params) {
            // 이전 선택 행 스타일 제거 및 새 선택 행 저장
            this.selectedFacRow = params.node;
            
            // 선택된 행의 스타일 업데이트를 위해 그리드 리프레시
            if (params.api) {
                params.api.refreshCells({
                    force: true,
                    rowNodes: [params.node]
                });
            }

            this.processData.fac = {
                fac_code: params.data.fac_code,             // 설비 코드
                model_name: params.data.model_name,         // 설비명
                fac_status: params.data.fac_status,         // 설비 상태
            }
        },
        
        // 공정 시작
        startProcess() {
            this.$router.push({ name: 'Control', query:{ work_lot: this.processData.process.work_lot, emp_code: this.processData.emp.emp_code, fac_code: this.processData.fac.fac_code}});
        },
    },
}
</script>

<style>
.ag-theme-alpine .ag-header-cell-label {
    justify-content: center;
}
.ag-row-selected-custom {
  background-color: #d9f2ff !important;  /* 파란색 계열 하이라이트 */
  font-weight: bold;
}
</style>