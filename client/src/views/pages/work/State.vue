<template>
    <div class="card border-0" style="height: 800px">
        <div class="font-semibold text-xl mb-2">공정 진행 관리</div>

        <h4>생산 실적 조회</h4>

        <div class="text-end mt-3 mb-3">
            <Button label="조회" severity="success" class="me-3" @click="orderList" />
        </div>
        <div class="mb-3">
            <Card style="overflow: hidden; background-color: #f8f9fa;">
                <template #content>
                    <div class="mb-5 row">
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    지시명
                                </InputGroupAddon>
                                <InputText v-model="formData.product_order_name" size="large" placeholder="" readonly />
                            </InputGroup>
                        </div>
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    제품명
                                </InputGroupAddon>
                                <InputText v-model="formData.prod_name" size="large" placeholder="" />
                            </InputGroup>
                        </div>
                    </div>
                    <div class="mb-5 row">
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    공정명
                                </InputGroupAddon>
                                <InputText v-model="formData.process_name" size="large" placeholder="(입력)" />
                            </InputGroup>
                        </div>
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    계획코드
                                </InputGroupAddon>
                                <InputText v-model="formData.plan_code" size="large" placeholder="" readonly />
                            </InputGroup>
                        </div>
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    계획명
                                </InputGroupAddon>
                                <InputText v-model="formData.plan_name" size="large" placeholder="" readonly />
                            </InputGroup>
                        </div>
                    </div>
                    <div class="mb-2 row">
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    시작일자
                                </InputGroupAddon>
                                <DatePicker v-model="formData.start_date_from" size="large" dateFormat="yy/mm/dd"
                                    placeholder="(입력)" showIcon iconDisplay="input" />
                                    ~
                                <DatePicker v-model="formData.start_date_to" size="large" dateFormat="yy/mm/dd"
                                    placeholder="(입력)" showIcon iconDisplay="input" />
                            </InputGroup>
                        </div>
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    종료일자
                                </InputGroupAddon>
                                <DatePicker v-model="formData.end_date_from" size="large" dateFormat="yy/mm/dd"
                                    placeholder="(입력)" showIcon iconDisplay="input" />
                                    ~
                                <DatePicker v-model="formData.end_date_to" size="large" dateFormat="yy/mm/dd"
                                    placeholder="(입력)" showIcon iconDisplay="input" />
                            </InputGroup>
                        </div>
                    </div>
                    <Button label="초기화" severity="danger" class="me-5" @click="clearForm" />
                </template>
            </Card>
        </div>
        <div class="ag-wrapper d-flex justify-content-center" style="border: none;">
            <ag-grid-vue ref="mainGrid" class="ag-theme-alpine custom-grid-theme" style="width: 100%; border: none;"
                :columnDefs="columnDefs" :rowData="rowData" :gridOptions="gridOptions"  @cellClicked="prodCellClicked">
            </ag-grid-vue>
        </div>
    </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import DatePickerEditor from "../../../components/DatePickerEditor.vue";
import axios from "axios";

export default {
    components: {
    },
    data() {
        return {
            formData: {
                product_order_name: "",
                prod_name: "",
                process_name: "",
                plan_code: "",
                plan_name: "",
                start_date_from: "",
                start_date_to: "",
                end_date_from: "",
                end_date_to: "",
            },

            gridOptions: {
                domLayout: "autoHeight",            // 행을 보고 자동으로 hight부여
                singleClickEdit: true,              // 한번 클릭 했을 때 수정
                suppressRowClickSelection: true,    // 행 클릭할 때 체크박스 선택 방지
                defaultColDef: {
                    suppressMovable: true,          // 셀 이동 금지
                    resizable: false,               // 열 크기 조정 가능
                    sortable: false,                // 정렬 금지
                },
            },
        };
    },
    watch() {

    },

    mounted() {

    },

    computed: {
        columnDefs() {
            return [
                { field: "product_order_code", headerName: "지시코드", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "product_order_name", headerName: "지시명", flex: 2, cellEditor: 'agDateCellEditor', cellStyle: { textAlign: "center" } },
                { field: "process_name", headerName: "공정명", flex: 2, cellEditor: 'agDateCellEditor', cellStyle: { textAlign: "center" } },
                { field: "process_start_date", headerName: "공정 시작 일자", flex: 3, cellStyle: { textAlign: "center" } },
                { field: "process_end_date", headerName: "공정 종료 일자", flex: 3, cellStyle: { textAlign: "center" } },
                { field: "prod_name", headerName: "제품명", flex: 3, cellStyle: { textAlign: "center" } },
                { field: "order_quantity", headerName: "지시량", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "input_quantity", headerName: "투입량", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "error_quantity", headerName: "불량량", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "created_quantity", headerName: "생산량", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "process_bar", headerName: "공정 진행도", flex: 2, cellStyle: { textAlign: "center" } },
            ]
        }
    },

    methods: {
    },
};
</script>

<style>
.ag-theme-alpine .ag-header-cell-label {
    justify-content: center;
}
</style>