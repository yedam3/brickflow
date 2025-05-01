<template>
    <div class="card border-0" style="height: 800px">
        <div class="font-semibold text-xl mb-4">생산 계획 관리</div>

        <div class="font-semibold text-l mb-4">생산 계획 등록</div>

        <div class="text-end mt-3 mb-3">
            <Button label="주문목록" severity="success" class="me-3" @click="orderList" />
            <Button label="계획목록" severity="info" class="me-3" @click="planList" />
            <Button label="등록" severity="help" class="me-3" @click="addPlan" />
            <Button label="수정" severity="danger" class="me-3" @click="updatePlan" />
            <Button label="삭제" severity="danger" class="" @click="deletePlan" />
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
                                <InputText v-model="formData.plan_code" size="large" placeholder="" readonly />
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
                                <InputText v-model="formData.orders_code" size="large" placeholder="" readonly />
                            </InputGroup>
                        </div>
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    주문명
                                </InputGroupAddon>
                                <InputText v-model="formData.order_name" size="large" placeholder="" readonly />
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
                                    placeholder="(입력)" showIcon iconDisplay="input" />
                            </InputGroup>
                        </div>
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    종료일자
                                </InputGroupAddon>
                                <DatePicker v-model="formData.end_date" size="large" dateFormat="yy/mm/dd"
                                    placeholder="(입력)" showIcon iconDisplay="input" />
                            </InputGroup>
                        </div>
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    비고
                                </InputGroupAddon>
                                <InputText v-model="formData.note" size="large" placeholder="" />
                            </InputGroup>
                        </div>
                    </div>
                    <Button label="초기화" severity="danger" class="me-5" @click="clearForm" />
                </template>
            </Card>
        </div>
        <div class="text-end mt-3 mb-3">
            <Button label="행추가" severity="success" class="me-3" @click="addRow" />
            <Button label="행삭제" severity="danger" class="me-5" @click="deleteRow" />
        </div>
        <!-- 메인그리드 -->
        <div class="ag-wrapper d-flex justify-content-center" style="border: none;">
            <ag-grid-vue ref="mainGrid" class="ag-theme-alpine custom-grid-theme" style="width: 100%; border: none;"
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
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            editMode: false,

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

            rowData: [
                {
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
                }
            ],

            // 그리드 수정 ON/OFF
            ag_grid_cols: {
                orders_code: false,         // 주문번호
                orders_date: false,         // 시작_일자
                del_date: false,            // 종료_일자
                prod_name: true,            // 제품명
                quantity: true,             // 수량(주문상세)
                unshippedQty: false,        // 미출고량
                prePlannedQty: false,       // 기계획량
                unplannedQty: false,        // 미계획량
                currentPlanQty: true,       // 현계획량
            },

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
    created() {
        this.clearForm();
    },
    mounted() {
        this.autoPlan_code();
    },
    computed: {
        columnDefs() {
            return [
                { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
                { field: "orders_code", headerName: "주문번호", flex: 2, editable: params => this.ag_grid_cols.orders_code, cellStyle: { textAlign: "center" } },
                { field: "orders_date", headerName: "주문일자", flex: 2, editable: params => this.ag_grid_cols.orders_date, cellEditor: 'agDateCellEditor', cellStyle: { textAlign: "center" } },
                { field: "del_date", headerName: "납기일자", flex: 2, editable: params => this.ag_grid_cols.del_date, cellEditor: 'agDateCellEditor', cellStyle: { textAlign: "center" } },
                { field: "prod_code", headerName: "제품코드", flex: 3, editable: params => this.ag_grid_cols.prod_name, cellStyle: { textAlign: "center" } },
                { field: "prod_name", headerName: "제품명", flex: 3, editable: params => this.ag_grid_cols.prod_name, cellStyle: { textAlign: "center" } },
                { field: "quantity", headerName: "주문량", flex: 3, editable: params => this.ag_grid_cols.quantity, cellStyle: { textAlign: "center" } },
                { field: "unshippedQty", headerName: "미출고량", flex: 2, editable: params => this.ag_grid_cols.unshippedQty, cellStyle: { textAlign: "center" } },
                { field: "prePlannedQty", headerName: "기계획량", flex: 2, editable: params => this.ag_grid_cols.prePlannedQty, cellStyle: { textAlign: "center" } },
                { field: "unplannedQty", headerName: "미계획량", flex: 2, editable: params => this.ag_grid_cols.unplannedQty, cellStyle: { textAlign: "center" } },
                { field: "currentPlanQty", headerName: "현계획량", flex: 2, editable: params => this.ag_grid_cols.currentPlanQty, cellStyle: { textAlign: "center" } },
            ]
        }
    },
    methods: {
        // 사이트 접속시 plan_code 자동증가
        async autoPlan_code() {
            try {
                const result = await axios.get("/api/work/plan/planAutoCode");
                this.formData.plan_code = result.data[0].plan_code;
            } catch (err) {
                console.error(err);
            }
        },

        // FormData 초기화
        clearForm() {
            this.formData = {
                plan_code: this.formData.plan_code, // 생산계획_코드
                orders_code: "",                    // 주문_코드
                plan_name: "",                      // 생산계획명
                employee_code: "",                  // 담당자
                start_date: "",                     // 시작_일자
                end_date: "",                       // 종료_일자
                finish_status: "",                  // 처리_상태
                note: "",                           // 비고
            }
            this.rowData = [];
            this.ag_grid_cols.prod_name = true;
            this.ag_grid_cols.quantity = true;
            this.editMode = false;
        },

        // 주문 모달창
        orderList() {
            this.showOrderModal = true;
        },

        // 생산 계획 모달창
        planList() {
            this.showPlanModal = true;
        },

        // input 유효성 검사
        inputCheck() {
            if (this.formData.plan_code == '' ||
                this.formData.plan_name == '' ||
                this.formData.employee_code == '' ||
                this.formData.start_date == '' ||
                this.formData.end_date == ''
                // || this.formData.finish_status == '' ||
                // this.formData.note == ''
            ) {
                Swal.fire({
                    title: '실패',
                    text: '값을 입력해주세요.',
                    icon: 'error',
                    confirmButtonText: '확인',
                });
                return 1;
            } else if (this.formData.start_date > this.formData.end_date) {
                Swal.fire({
                    title: '실패',
                    text: '종료일자가 시작일자보다 빠릅니다.',
                    icon: 'error',
                    confirmButtonText: '확인',
                });
                return 1;
            } else if (this.editMode == true) {
                Swal.fire({
                    title: '등록 실패',
                    text: '수정 중인 건은 등록이 불가능합니다. 초기화 후 다시 시도해주세요.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return;
            }
            for (let data of this.rowData) {
                if (data.currentPlanQty == '') {
                    Swal.fire({
                        title: '실패',
                        text: '현기획량을 입력하세요.',
                        icon: 'error',
                        confirmButtonText: '확인'
                    });
                    return 1;
                }
            }
        },

        // 행추가
        addRow() {
            if (this.formData.orders_code != '') {
                Swal.fire({
                    title: '실패',
                    text: '주문번호 존재 시 행추가를 할 수 없습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return;
            }
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
            // 새 배열로 설정하여 AG Grid가 반영하게 만듦
            this.rowData = [...this.rowData];
        },

        //행삭제
        deleteRow() {
            if (this.formData.orders_code != '') {
                Swal.fire({
                    title: '실패',
                    text: '주문번호 존재 시 행삭제를를 할 수 없습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return;
            }
            const selectedNodes = this.$refs.mainGrid.api.getSelectedNodes();
            const selectedData = selectedNodes.map(node => node.data);

            this.rowData = this.rowData.filter(row => !selectedData.includes(row));
        },

        // 주문 모달창 값 전달
        async orderSelected(order) {
            await axios.get('/api/work/plan/plan', {
                params: {
                    orders_code: order.orders_code
                }
            }).then(res => {
                const data = res.data;
                this.formData.orders_code = order.orders_code;
                this.formData.order_name = order.order_name;
                this.rowData = [...data];
                
                
                console.log(this.rowData);

                this.ag_grid_cols.prod_name = false;
                this.ag_grid_cols.quantity = false;
            }).catch((err) => console.error(err));
        },

        // 생산 계획 모달창 값 전달, 생산 계획 상세값 조회
        async planSelected(plan) {
            await axios.get(`/api/work/plan/planDetailList/${plan.plan_code}`
            ).then(res => {
                const data = res.data;
                this.formData.plan_code = plan.plan_code;
                this.formData.employee_code = plan.employee_code;
                this.formData.plan_name = plan.plan_name;
                this.formData.orders_code = plan.orders_code;
                this.formData.order_name = plan.order_name;
                this.formData.start_date = plan.start_date;
                this.formData.end_date = plan.end_date;
                this.formData.note = plan.note;
                this.rowData = [...data];

                this.ag_grid_cols.prod_name = false;
                this.ag_grid_cols.quantity = false;

                this.editMode = true;
            }).catch((err) => console.error(err));
        },

        // 생산 계획 등록
        async addPlan() {
            if (this.inputCheck() > 0) {
                return;
            }
            const plan_codeRes = await axios.get(`/api/work/plan/plan_codeCheck/${this.formData.plan_code}`).catch((err) => console.error(err));
            if (plan_codeRes.data.check > 0) {
                Swal.fire({
                    title: '실패',
                    text: '이미 등록이 진행된 계획코드입니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return;
            }
            const order_statusRes = await axios.get(`/api/work/plan/order_statusCheck/${this.formData.orders_code}`).catch((err) => console.error(err));
            if (order_statusRes.data.check > 0) {
                Swal.fire({
                    title: '실패',
                    text: '이미 출고가 완료된 건입니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return;
            }
            await axios.post("/api/work/plan/plan", {
                planData: this.formData,
                planDetailData: this.rowData,
            }).then(res => {
                console.log(res);
                Swal.fire({
                    title: '성공',
                    text: '생산 계획이 정상적으로 등록되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인'
                });
                this.clearForm();
            }).catch(err => {
                console.error(err);
                Swal.fire({
                    title: '실패',
                    text: '생산 계획 등록 중 오류가 발생했습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
            });
        },

        // 생산 계획 수정
        async updatePlan() {
            if (!this.planOrderStatusCheck(this.formData.plan_code)) {
                Swal.fire({
                    title: '실패',
                    text: '이미 생산이 진행되고 있는 계획코드입니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return;
            }
            await axios.put("/api/work/plan/plan", {
                planData: this.formData,
                planDetailData: this.rowData,
            }).then(res => {
                if(res.data.affectedRows > 0) {
                    Swal.fire({
                        title: '성공',
                        text: '생산 계획이 정상적으로 수정되었습니다.',
                        icon: 'success',
                        confirmButtonText: '확인'
                    });
                } else {
                    Swal.fire({
                        title: '정보',
                        text: '수정정하려는 값이 존재 하지 않습니다.',
                        icon: 'info',
                        confirmButtonText: '확인'
                    });
                }
                this.clearForm();
            }).catch(err => {
                console.error(err)
                Swal.fire({
                    title: '실패',
                    text: '생산 계획 수정 중 오류가 발생했습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
            });
        },

        // 생산 계획 삭제
        async deletePlan() {
            if (!this.planOrderStatusCheck(this.formData.plan_code)) {
                Swal.fire({
                    title: '실패',
                    text: '이미 생산이 진행되고 있는 계획코드입니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return;
            }
            await axios.delete(`/api/work/plan/plan`, {
                data: {
                    plan_code: this.formData.plan_code,
                    orders_code: this.formData.orders_code
                }
            }).then(res => {
                if(res.data.affectedRows > 0) {
                    Swal.fire({
                        title: '성공',
                        text: '생산 계획이 정상적으로 삭제되었습니다.',
                        icon: 'success',
                        confirmButtonText: '확인'
                    });
                } else {
                    Swal.fire({
                        title: '정보',
                        text: '삭제하려는 값이 존재 하지 않습니다.',
                        icon: 'info',
                        confirmButtonText: '확인'
                    });
                }
                this.clearForm();
            }).catch(err => {
                console.error(err)
                Swal.fire({
                    title: '실패',
                    text: '생산 계획 삭제 중 오류가 발생했습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
            });
        },

        // 생산계획 상태 확인
        async planOrderStatusCheck(plan_code) {
            let res = await axios.get(`/work/order/findStatusByPlan_code`, {
            }).catch((err) => {
                console.error(err);
            })

            if(res.data.finish_status === 'WS1') {
                return false;
            }
            return true;
        },
    },
};
</script>

<style>
.ag-theme-alpine .ag-header-cell-label {
    justify-content: center;
}
</style>