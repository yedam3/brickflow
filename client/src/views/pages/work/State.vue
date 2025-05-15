<template>
    <div class="card border-0" style="height: 800px">
        <div class="font-semibold text-xl mb-2">공정 진행 관리</div>

        <h4>생산 실적 조회</h4>

        <div class="mb-3">
            <Card style="overflow: hidden; background-color: #f8f9fa;">
                <template #content>
                    <div class="mb-5 row">
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    계획코드
                                </InputGroupAddon>
                                <InputText v-model="formData.plan_code" size="large" placeholder="(입력)" />
                            </InputGroup>
                        </div>
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    지시 코드
                                </InputGroupAddon>
                                <InputText v-model="formData.product_order_code" size="large" placeholder="(입력)" />
                            </InputGroup>
                        </div>
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    제품명
                                </InputGroupAddon>
                                <InputText v-model="formData.prod_name" size="large" placeholder="(입력)" />
                            </InputGroup>
                        </div>
                    </div>
                    <div class="mb-5 row">
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    계획명
                                </InputGroupAddon>
                                <InputText v-model="formData.plan_name" size="large" placeholder="(입력)" />
                            </InputGroup>
                        </div>
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    지시명
                                </InputGroupAddon>
                                <InputText v-model="formData.product_order_name" size="large" placeholder="(입력)" />
                            </InputGroup>
                        </div>
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    공정명
                                </InputGroupAddon>
                                <InputText v-model="formData.process_name" size="large" placeholder="(입력)" />
                            </InputGroup>
                        </div>
                    </div>
                    <div class="mb-2 row">
                        <div class="col-6">
                            <InputGroup>
                                <InputGroupAddon>
                                    시작일자
                                </InputGroupAddon>
                                <DatePicker v-model="formData.work_start_date_from" size="large" dateFormat="yy/mm/dd"
                                    placeholder="(입력)" showIcon iconDisplay="input" />
                                    <div class="align-content-center">
                                        <div class="mx-2">~</div>
                                    </div>
                                <DatePicker v-model="formData.work_start_date_to" size="large" dateFormat="yy/mm/dd"
                                    placeholder="(입력)" showIcon iconDisplay="input" />
                            </InputGroup>
                        </div>
                        <div class="col-6">
                            <InputGroup>
                                <InputGroupAddon>
                                    종료일자
                                </InputGroupAddon>
                                <DatePicker v-model="formData.work_end_date_from" size="large" dateFormat="yy/mm/dd"
                                    placeholder="(입력)" showIcon iconDisplay="input" />
                                    <div class="align-content-center">
                                        <div class="mx-2">~</div>
                                    </div>
                                <DatePicker v-model="formData.work_end_date_to" size="large" dateFormat="yy/mm/dd"
                                    placeholder="(입력)" showIcon iconDisplay="input" />
                            </InputGroup>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center">
                        <div class="mt-2">
                            <Button label="조회" severity="success" size="large" class="me-2" @click="searchProcessData" />
                            <Button label="초기화" severity="danger" size="large" class="" @click="clearForm" />
                        </div>
                    </div>
                </template>
            </Card>
        </div>
        <div class="ag-wrapper d-flex justify-content-center" style="border: none;">
            <ag-grid-vue ref="mainGrid" class="ag-theme-alpine custom-grid-theme" style="width: 100%; border: none;"
                :columnDefs="columnDefs" :rowData="processList" :gridOptions="gridOptions" @cellClicked="">
            </ag-grid-vue>
        </div>
    </div>
</template>

<script>
import axios from "axios";

import { AgGridVue } from "ag-grid-vue3";
import DatePickerEditor from "../../../components/DatePickerEditor.vue";
import Swal from 'sweetalert2';
import ProgressCell from "@/components/ProgressCell.vue";

export default {
    components: {
        AgGridVue,
        DatePicker: DatePickerEditor,
        ProgressCell,
    },
    data() {
        return {
            formData: {
                plan_code: "",
                product_order_code: "",
                prod_name: "",

                product_order_name: "",
                plan_name: "",
                process_name: "",

                work_start_date_from: "",
                work_start_date_to: "",
                work_end_date_from: "",
                work_end_date_to: "",
            },

            processList: [

            ],

            gridOptions: {
                domLayout: "autoHeight",            // 행을 보고 자동으로 hight부여
                singleClickEdit: true,              // 한번 클릭 했을 때 수정
                suppressRowClickSelection: true,    // 행 클릭할 때 체크박스 선택 방지
                paginationPageSize: 5,             // 페이지당 갯수
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
        this.getProcessData();
    },

    computed: {
        columnDefs() {
            return [
                { field: "product_order_code", headerName: "지시코드", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "product_order_name", headerName: "지시명", flex: 3, cellStyle: { textAlign: "center" } },
                { field: "process_name", headerName: "공정명", flex: 3, cellStyle: { textAlign: "center" } },
                { field: "process_start_date", headerName: "공정 시작 일자", flex: 4, cellStyle: { textAlign: "center" } },
                { field: "process_end_date", headerName: "공정 종료 일자", flex: 4, cellStyle: { textAlign: "center" } },
                { field: "prod_name", headerName: "제품명", flex: 4, cellStyle: { textAlign: "center" } },
                { field: "order_quantity", headerName: "지시량", flex: 1.5, cellStyle: { textAlign: "center" } },
                { field: "input_quantity", headerName: "투입량", flex: 1.5, cellStyle: { textAlign: "center" } },
                { field: "error_quantity", headerName: "불량량", flex: 1.5, cellStyle: { textAlign: "center" } },
                { field: "created_quantity", headerName: "생산량", flex: 1.5, cellStyle: { textAlign: "center" } },
                {
                    field: "process_progress", headerName: "공정 진행도", flex: 3, cellRenderer: 'ProgressCell'
                },
            ]
        }
    },

    methods: {
        async getProcessData() {
            await axios.get(`/api/work/process/data`).then(res => {
                const processDataList = res.data;
                for(let data of processDataList) {
                    let process_pct = Number(data.order_quantity) > 0 ? Number((Number(data.error_quantity) + Number(data.created_quantity)) / Number(data.order_quantity) * 100) : 0;
                    this.processList.push({
                        product_order_code: data.product_order_code,
                        product_order_name: data.product_order_name,
                        process_name: data.process_name,
                        process_start_date: data.process_start_date,
                        process_end_date: data.process_end_date,
                        prod_name: data.prod_name,
                        order_quantity: data.order_quantity,
                        input_quantity: data.input_quantity,
                        error_quantity: data.error_quantity,
                        created_quantity: data.created_quantity,
                        process_progress: process_pct,
                    });
                };

                this.processList = [...this.processList];
            }).catch((err) => {
                console.error(err);
                Swal.fire({
                    title: '실패',
                    text: '실적을 조회하던 중 오류가 발생했습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
            });
        },
        async searchProcessData() {
            await axios.get(`/api/work/process/data`, {
                params: {
                    searchKeywords: this.formData,
                }
            }).then(res => {
                const processDataList = res.data;
                this.processList = [];
                for(let data of processDataList) {
                    let process_pct = Number(data.order_quantity) > 0 ? Number((Number(data.error_quantity) + Number(data.created_quantity)) / Number(data.order_quantity) * 100) : 0;
                    this.processList.push({
                        product_order_code: data.product_order_code,
                        product_order_name: data.product_order_name,
                        process_name: data.process_name,
                        process_start_date: data.process_start_date,
                        process_end_date: data.process_end_date,
                        prod_name: data.prod_name,
                        order_quantity: data.order_quantity,
                        input_quantity: data.input_quantity,
                        error_quantity: data.error_quantity,
                        created_quantity: data.created_quantity,
                        process_progress: process_pct,
                    });
                };
                this.processList = [...this.processList];
            }).catch((err) => {
                console.error(err);
                Swal.fire({
                    title: '실패',
                    text: '실적을 조회하던 중 오류가 발생했습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
            });
        },
    },
};
</script>

<style>
.ag-theme-alpine .ag-header-cell-label {
    justify-content: center;
}
</style>