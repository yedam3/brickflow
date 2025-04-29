<template>
    <div class="card border-0" style="height: 800px">
        <div class="font-semibold text-xl mb-4">생산 계획 관리</div>

        <div class="font-semibold text-l mb-4">생산 계획 등록</div>

        <div class="text-end mt-3 mb-3">
            <Button label="주문목록" severity="success" class="me-3" @click="orderList" />
            <Button label="계획목록" severity="info" class="me-3" @click="planList" />
            <Button label="등록" severity="help" class="me-3" @click="addPlan" />
            <Button label="수정" severity="danger" class="me-3" @click="updatePlan"/>
            <Button label="삭제" severity="danger" class="" @click="deletePlan"/>
        </div>
        <div class="mb-3">
            <Card style="overflow: hidden; background-color: #f8f9fa;">
                <template #content>
                    <div class="mb-5 row">
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    계획코드
                                </InputGroupAddon>
                                <InputText v-model="formData.plan_code" size="large" placeholder="" />
                            </InputGroup>
                        </div>
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    담당자
                                </InputGroupAddon>
                                <InputText v-model="formData.employee_code" size="large" placeholder="" />
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
                                    주문번호
                                </InputGroupAddon>
                                <InputText v-model="formData.orders_code" size="large" placeholder="" />
                            </InputGroup>
                        </div>
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    주문명
                                </InputGroupAddon>
                                <InputText v-model="formData.order_name" size="large" placeholder="" />
                            </InputGroup>
                        </div>
                    </div>
                    <div class="mb-2 row">
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    시작일자
                                </InputGroupAddon>
                                <DatePicker v-model="formData.start_date" size="large" dateFormat="yy/mm/dd"
                                    placeholder="(입력)" />
                            </InputGroup>
                        </div>
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    종료일자
                                </InputGroupAddon>
                                <DatePicker v-model="formData.end_date" size="large" dateFormat="yy/mm/dd"
                                    placeholder="(입력)" />
                            </InputGroup>
                        </div>
                    </div>
                    <Button label="초기화" severity="danger" class="me-5" @click="clearForm" />
                </template>
            </Card>
        </div>
        <div class="text-end mt-3 mb-3">
            <Button label="행추가" severity="success" class="me-3" @click="addRow" />
        </div>
        <!-- 메인그리드 -->
        <div class="ag-wrapper d-flex justify-content-center" style="border: none;">
            <ag-grid-vue class="ag-theme-alpine custom-grid-theme" style="width: 100%; border: none;"
                :columnDefs="columnDefs" :rowData="rowData" :gridOptions="gridOptions">
            </ag-grid-vue>
        </div>
    </div>

    <!-- 주문 목록 조회 모달창 -->
    <OrderModal :visible="showOrderModal" @close="showOrderModal = false" @selectOrder="orderSelected"></OrderModal>

    <!-- 생산 계획 조회 모달창 -->
    <PlanModal :visible="showPlanModal" @close="showPlanModal = false" @selectPlan="planSelected"></PlanModal>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import DatePickerEditor from "../../../components/DatePickerEditor.vue";
import axios from "axios";
import Swal from 'sweetalert2';

import OrderModal from "@/components/modal/OrderModal.vue";
import PlanModal from "@/components/modal/PlanModal.vue";

export default {
    components: {
        AgGridVue,
        datePicker: DatePickerEditor,
        OrderModal,
        PlanModal,
    },
    data() {
        return {
            // FormData
            formData: {
                plan_code: "",      // 생산계획_코드
                orders_code: "",    // 주문_코드
                plan_name: "",      // 생산계획명
                employee_code: "",  // 담당자
                start_date: "",     // 시작_일자
                end_date: "",       // 종료_일자
                finish_status: "",  // 처리_상태
                note: "",           // 비고
            },

            rowData: [{
                plan_detail_code: "",   // 생산계획_상세_코드
                orders_code: "",        // 주문번호
                orders_date: "",        // 시작_일자
                del_date: "",           // 종료_일자
                prod_name: "",          // 제품명
                quantity: "",           // 수량(주문상세)
                unshippedQty: "",       // 미출고량
                prePlannedQty: "",      // 기계획량
                unplannedQty: "",       // 미계획량
                currentPlanQty: "",     // 현계획량
            }],
            columnDefs: [
                { field: "orders_code", headerName: "주문번호", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "orders_date", headerName: "주문일자", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "del_date", headerName: "납기일자", flex: 2, cellStyle: { textAlign: "center" }},
                { field: "prod_name", headerName: "제품명", flex: 3, cellStyle: { textAlign: "center" }},
                { field: "quantity", headerName: "주문량", flex: 3, cellStyle: { textAlign: "center" } },
                { field: "unshippedQty", headerName: "미출고량", flex: 3, cellStyle: { textAlign: "center" } },
                { field: "prePlannedQty", headerName: "기계획량", flex: 3, cellStyle: { textAlign: "center" } },
                { field: "unplannedQty", headerName: "미계획량", flex: 3, cellStyle: { textAlign: "center" } },
                { field: "currentPlanQty", headerName: "현계획량", flex: 3, editable: true, cellStyle: { textAlign: "center" } },
            ],
            gridOptions: {
                domLayout: "autoHeight",            // 행을 보고 자동으로 hight부여
                singleClickEdit: true,              // 한번클릭했을때 수정
                suppressRowClickSelection: true,    // 행 클릭할 때 체크박스 선택 방지
                defaultColDef: {
                    suppressMovable: true,          // 셀 이동 금지
                    resizable: false,               // 열 크기 조정 가능
                    sortable: false,                // 정렬 금지
                },
            },
            showOrderModal: false,
            showPlanModal: false,
            //상세그리드 행 인덱스
            selectedSecondIndex: null,
        };
    },
    mounted() {
        this.autoPlan_code();
    },
    methods: {
        // 사이트 접속시 plan_code 자동증가
        async autoPlan_code() {
            try {
                const result = await axios.get("/api/work/autoCode");
                this.formData.plan_code = result.data[0].plan_code;
                console.log(this.formData.plan_code);
            } catch (err) {
                console.error(err);
            }
        },

        // FormData 초기화
        clearForm() {
            this.formData = {
                plan_code: this.formData.plan_code,      // 생산계획_코드
                orders_code: "",    // 주문_코드
                plan_name: "",      // 생산계획명
                employee_code: "",  // 담당자
                start_date: "",     // 시작_일자
                end_date: "",       // 종료_일자
                finish_status: "",  // 처리_상태
                note: "",           // 비고
            }
        },

        // 주문 모달창
        orderList() {
            this.showOrderModal = true;
        },

        // 생산 계획 모달창
        planList() {
            this.showPlanModal = true;
        },

        // 행추가
        addRow() {
            this.rowData.push({
                plan_detail_code: "",   // 생산계획_상세_코드
                orders_code: "",        // 주문번호
                orders_date: "",        // 시작_일자
                del_date: "",           // 종료_일자
                prod_name: "",          // 제품명
                quantity: "",           // 수량(주문상세)
                unshippedQty: "",       // 미출고량
                prePlannedQty: "",      // 기계획량
                unplannedQty: "",       // 미계획량
                currentPlanQty: "",     // 현계획량
            });
            // 새 배열로 설정하여 AG Grid가 반영하게 만듬
            this.rowData = [...this.rowData];
        },

        // 주문 모달창 값 전달
        async orderSelected(order) {
            await axios.get('/api/work/plan', {
                params: {
                    orders_code: order.orders_code
                }
            }).then(res => {
                const data = res.data;
                this.formData.orders_code = order.orders_code;
                this.formData.order_name = order.order_name;
                this.rowData = [...data];
            }).catch((err) => console.error(err));
        },

        // 생산 계획 모달창 값 전달, 생산 계획 상세값 조회
        async planSelected(plan) {
            await axios.get('/api/work/planDetailList', {
                params: {
                    plan_code: plan.plan_code
                }
            }).then(res => {
                const data = res.data;
                this.formData.plan_code = plan.plan_code;
                this.formData.employee_code = plan.employee_code;
                this.formData.plan_name = plan.plan_name;
                this.formData.orders_code = plan.orders_code;
                this.formData.order_name = plan.order_name;
                this.formData.start_date = plan.start_date;
                this.formData.end_date = plan.end_date;
                this.rowData = [...data];
            }).catch((err) => console.error(err));
        },

        // 생산 계획 등록
        async addPlan() {
            await axios.post("/api/work/plan", {
                planData: this.formData,
                planDetailData: this.rowData,
            }).then(res => {
                console.log(res);
            }).catch(err => {
                console.error(err);
            });
        },

        // 생산 계획 수정
        async updatePlan() {
            await axios.put("/api/work/plan", {
                planData: this.formData,
                planDetailData: this.rowData,
            }).then(res => {
                console.log(res);
            }).catch(err => console.error(err));
        },

        // 생산 계획 삭제
        async deletePlan() {
            await axios.delete(`/api/work/plan/${this.formData.plan_code}`).then(res => {
                console.log(res);
            }).catch(err => console.error(err));
        }
    },
};
</script>

<style>
.ag-theme-alpine .ag-header-cell-label {
    justify-content: center;
}
</style>