<template>
    <div class="card border-0" style="height: 800px">
        <div class="font-semibold text-xl mb-4">생산 지시 관리</div>

        <div class="text-end mt-3 mb-3">
            <Button label="계획목록" severity="success" class="me-3" @click="planList" />
            <Button label="지시목록" severity="info" class="me-3" />
            <Button label="등록" severity="help" class="me-3" />
            <Button label="수정" severity="danger" class="me-3" />
            <Button label="삭제" severity="danger" class="" />
        </div>
        <div class="mb-3">
            <Card style="overflow: hidden; background-color: #f8f9fa;">
                <template #content>
                    <div class="mb-5 row">
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    생산 지시 코드
                                </InputGroupAddon>
                                <InputText v-model="formData.product_order_code" size="large" placeholder="" />
                            </InputGroup>
                        </div>
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    생산 지시명
                                </InputGroupAddon>
                                <InputText v-model="formData.product_order_name" size="large" placeholder="(입력)" />
                            </InputGroup>
                        </div>
                    </div>
                    <div class="mb-5 row">
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    담당자
                                </InputGroupAddon>
                                <InputText v-model="formData.emp_name" size="large" placeholder="" />
                            </InputGroup>
                        </div>
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    계획 코드
                                </InputGroupAddon>
                                <InputText v-model="formData.plan_code" size="large" placeholder="" />
                            </InputGroup>
                        </div>
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    계획명
                                </InputGroupAddon>
                                <InputText v-model="formData.plan_name" size="large" placeholder="" />
                            </InputGroup>
                        </div>
                    </div>
                    <div class="mb-5 row">
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    시작일자
                                </InputGroupAddon>
                                <InputText v-model="formData.start_date" size="large" placeholder="" />
                            </InputGroup>
                        </div>
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    종료일자
                                </InputGroupAddon>
                                <InputText v-model="formData.end_date" size="large" placeholder="" />
                            </InputGroup>
                        </div>
                    </div>
                    <Button label="초기화" severity="danger" class="me-5" size="large" @click="clearForm" />
                </template>
            </Card>
        </div>

        <div class="row">
            <div class="col">
                <div class="d-flex justify-content-between mb-3">
                    <h4 class="text-start m-0">생산 제품 목록</h4>
                    <Button label="행추가" severity="success" @click="addRow" />
                </div>
                <div class="ag-wrapper" style="border: none;">
                    <ag-grid-vue class="ag-theme-alpine custom-grid-theme" :columnDefs="prodListDefs" :rowData="rowData"
                        :gridOptions="gridOptions">
                    </ag-grid-vue>
                </div>
            </div>
            <div class="col">
                <h4 class="text-start">자재 홀드량</h4>
                <div class="ag-wrapper" style="border: none;">
                    <ag-grid-vue class="ag-theme-alpine custom-grid-theme" :columnDefs="matHoldListDefs"
                        :rowData="rowData" :gridOptions="gridOptions">
                    </ag-grid-vue>
                </div>
            </div>
        </div>
    </div>

    <!--생산 계획 목록 조회 모달창-->
    <PlanModal :visible="showPlanModal" @close="showPlanModal = false" @selectPlan="planSelected"></PlanModal>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import axios from "axios";

import PlanModal from "@/components/modal/PlanModal.vue";

export default {
    components: {
        AgGridVue,
        PlanModal,
    },
    data() {
        return {
            // FormData
            formData: {
                product_order_code: "",     // 생산지시_코드
                emp_name: "",               // 담당자명
                product_order_name: "",     // 생산지시명
                plan_code: "",              // 계획코드
                plan_name: "",              // 계획명
                start_date: "",             // 시작일자
                end_date: "",               // 종료일자
            },

            rowData: [
                {
                    orders_code: "",        // 제품코드
                    prod_name: "",          // 제품명
                    order_quantity: "",     // 지시수량
                    priority: "",           // 우선순위
                    quantity: "",           // 주문량
                }
            ],

            secondRowData: [
                {
                    mat_code: "",           // 자재코드
                    mat_name: "",           // 자재명
                    product_order_name: "", // 요구량
                    prod_name: "",          // 투입량
                }
            ],
            prodListDefs: [
                { field: "orders_code", headerName: "제품코드", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "prod_name", headerName: "제품명", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "order_quantity", headerName: "지시수량", flex: 2, editable: true, cellStyle: { textAlign: "center" }, cellEditor: "datePicker" },
                { field: "priority", headerName: "우선순위", flex: 3, editable: true, cellStyle: { textAlign: "center" }, cellEditor: "datePicker" },
                { field: "quantity", headerName: "주문량", flex: 3, cellStyle: { textAlign: "center" } },
            ],
            matHoldListDefs: [
                { field: "mat_code", headerName: "자재코드", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "mat_name", headerName: "자재명", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "", headerName: "요구량", flex: 2, editable: true, cellStyle: { textAlign: "center" }, cellEditor: "datePicker" },
                { field: "prod_name", headerName: "투입량", flex: 3, editable: true, cellStyle: { textAlign: "center" }, cellEditor: "datePicker" },
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
            showPlanModal: false,

        };
    },
    mounted() {
    },
    methods: {
        // FormData 초기화
        clearForm() {
            this.formData = {
                product_order_code: "",     // 생산지시_코드
                emp_name: "",               // 담당자명
                product_order_name: "",     // 생산지시명
                plan_code: "",              // 계획코드
                plan_name: "",              // 계획명
                start_date: "",             // 시작일자
                end_date: "",               // 종료일자
            }
        },
        
        // 생산 계획 모달창
        planList() {
            this.showPlanModal = true;
        },

        // 생산 계획 모달창 값 전달, 생산 계획 상세값 조회
        async planSelected(plan) {
            this.formData.plan_code = plan.plan_code;
            this.formData.plan_name = plan.plan_name;

            await axios.get(`/api/work/planDetailList`, {
                params: {
                    plan_code: plan.plan_code
                }
            }).then(res => {
                const data = res.data;
                console.log(data);
                // this.rowData = [...data];
            }).catch((err) => console.error(err));
        },

        //행추가
        addRow() {
            this.secondRowData.push({
                orders_code: "",
                prod_name: "",
                order_quantity: "",
                priority: "",
                quantity: "",
            })
            // 새 배열로 설정하여 AG Grid가 반영하게 만듬
            this.secondRowData = [...this.secondRowData];
        },
    },
};
</script>

<style>
.ag-theme-alpine .ag-header-cell-label {
    justify-content: center;
}
</style>