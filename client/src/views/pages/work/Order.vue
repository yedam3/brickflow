<template>
    <div class="card border-0" style="height: 800px">
        <div class="font-semibold text-xl mb-4">생산 지시 관리</div>

        <div class="text-end mt-3 mb-3">
            <Button label="계획목록" severity="success" class="me-3" @click="planList" />
            <Button label="지시목록" severity="info" class="me-3" @click="planOrderList" />
            <Button label="등록" severity="help" class="me-3" @click="addPlanOrder" />
            <Button label="수정" severity="danger" class="me-3" @click="updateProductOrder" />
            <Button label="삭제" severity="danger" class="" @click="deleteProductOrder"/>
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
                                <InputText v-model="formData.product_order_code" size="large" placeholder="" readOnly />
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
                    <Button label="초기화" severity="danger" class="me-5" size="large" @click="clearForm" />
                </template>
            </Card>
        </div>

        <div class="row">
            <div class="col">
                <div class="d-flex justify-content-between mb-3">
                    <h4 class="text-start m-0">생산 제품 목록</h4>
                    <div class="row">
                        <div class="col">
                            <Button label="행추가" severity="success me-2" @click="addRow" />
                            <Button label="행삭제" severity="danger" @click="deleteRow" />
                        </div>
                    </div>
                </div>
                <div class="ag-wrapper" style="border: none;">
                    <ag-grid-vue ref="mainGrid" class="ag-theme-alpine custom-grid-theme" :columnDefs="prodListDefs" :rowData="rowData"
                        :gridOptions="gridOptions">
                    </ag-grid-vue>
                </div>
            </div>
            <div class="col">
                <h4 class="text-start">자재 홀드량</h4>
                <div class="ag-wrapper" style="border: none;">
                    <ag-grid-vue class="ag-theme-alpine custom-grid-theme" :columnDefs="matHoldListDefs"
                        :rowData="secondRowData" :gridOptions="gridOptions" @rowClicked="matRowClicked">
                    </ag-grid-vue>
                </div>
            </div>
        </div>
    </div>

    <!--생산 계획 목록 조회 모달창-->
    <PlanModal :visible="showPlanModal" @close="showPlanModal = false" @selectPlan="planSelected"></PlanModal>

    <!-- 생산 지시 조회 모달창 -->
    <PlanOrderModal :visible="showPlanOrderModal" @close="showPlanOrderModal = false"
        @selectPlanOrder="planOrderSelected">
    </PlanOrderModal>

    <!-- 자재 재고 조회 모달창 -->
    <MatStock :visible="showMatStockModal" @close="showMatStockModal = false" :mat_code="selectMat_code" :mat_list="selectMat_list" 
        @matHoldData="matData"></MatStock>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import axios from "axios";

import Swal from 'sweetalert2';

import PlanModal from "@/components/modal/PlanModal.vue";
import PlanOrderModal from "@/components/modal/PlanOrderModal.vue"
import MatStock from "@/components/modal/MatStock.vue";

export default {
    components: {
        AgGridVue,
        PlanModal,
        PlanOrderModal,
        MatStock,
    },
    data() {
        return {
            showPlanModal: false,
            showPlanOrderModal: false,
            showMatStockModal: false,

            // 선택된 자재 코드
            selectMat_code: null,
            // 선택된 자재 리스트
            selectMat_list: null,

            // 자재 홀드량 선택 행
            selectedSecondIndex: null,

            // 수정/삭제 모드
            editMode: false,

            // 자재 홀드 데이터 리스트 (LOT)
            matHoldDataList: [

            ],
            // FormData
            formData: {
                product_order_code: "",     // 생산지시_코드
                emp_name: "",               // 담당자명
                product_order_name: "",     // 생산지시명
                plan_code: "",              // 계획코드
                plan_name: "",              // 계획명
                start_date: "",             // 시작일자
                end_date: "",               // 종료일자
                note: "",                   // 비고
            },

            rowData: [
                // {
                //     prod_code: "",          // 제품코드
                //     prod_name: "",          // 제품명
                //     order_quantity: "",     // 지시수량
                //     priority: "",           // 우선순위
                //     quantity: "",           // 주문량
                // }
            ],

            secondRowData: [
                // {
                //     prod_code: "",                  // 제품코드
                //     mat_code: "",                   // 자재코드
                //     mat_name: "",                   // 자재명
                //     req_material_quantity: "",      // 요구량
                //     material_input_qunatity: "",    // 투입량
                // }
            ],
            prodListDefs: [
                { checkboxSelection: true, width: 50 },
                { field: "prod_code", headerName: "제품코드", flex: 1.5, cellStyle: { textAlign: "center" } },
                { field: "prod_name", headerName: "제품명", flex: 3, cellStyle: { textAlign: "center" } },
                { field: "order_quantity", headerName: "지시수량", flex: 1.5, cellStyle: { textAlign: "center" } },
                { field: "priority", headerName: "우선순위", flex: 1.5, cellStyle: { textAlign: "center" } },
                { field: "quantity", headerName: "주문량", flex: 1, cellStyle: { textAlign: "center" } },
            ],
            matHoldListDefs: [
                { field: "prod_code", headerName: "제품코드", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "mat_code", headerName: "자재코드", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "mat_name", headerName: "자재명", flex: 3, cellStyle: { textAlign: "center" } },
                { field: "req_material_quantity", headerName: "요구량", flex: 1, cellStyle: { textAlign: "center" } },
                { field: "material_input_qunatity", headerName: "투입량", flex: 1, cellStyle: { textAlign: "center" } },
            ],
            gridOptions: {
                domLayout: "autoHeight", //행을 보고 자동으로 hight부여
                singleClickEdit: true, //한 번 클릭 했을 때 수정
                suppressRowClickSelection: true, //	행 클릭할 때 체크박스 선택 방지
                defaultColDef: {
                    suppressMovable: true, //셀 이동 금지
                    resizable: false, // 열 크기 조정 가능
                    sortable: false, //정렬 금지
                },
            },
        };
    },
    mounted() {
        this.autoOrder_Code();
    },
    methods: {
        // FormData 초기화
        clearForm() {
            this.formData = {
                product_order_code: this.formData.product_order_code,     // 생산지시_코드
                emp_name: "",               // 담당자명
                product_order_name: "",     // 생산지시명
                plan_code: "",              // 계획코드
                plan_name: "",              // 계획명
                start_date: "",             // 시작일자
                end_date: "",               // 종료일자
            },
            this.rowData = [];
            this.secondRowData = [];
        },

        // 생산 계획 모달창
        planList() {
            this.showPlanModal = true;
        },

        // 생산 지시 모달창
        planOrderList() {
            this.showPlanOrderModal = true;
        },

        // 생산 상품 자재 재고 모달창
        matStockList() {
        },

        // 사이트 접속시 plan_code 자동증가
        async autoOrder_Code() {
            try {
                const result = await axios.get("/api/work/order/orderAutoCode");
                this.formData.product_order_code = result.data[0].product_order_code;
            } catch (err) {
                console.error(err);
            }
        },

        // 생산 계획 모달창 값 전달, 생산 계획 상세값 조회
        async planSelected(plan) {
            this.clearForm();
            this.formData.plan_code = plan.plan_code;
            this.formData.plan_name = plan.plan_name;
            this.formData.start_date = plan.start_date;
            this.formData.end_date = plan.end_date;
            await axios.get(`/api/work/plan/planDetailList/${plan.plan_code}`, {
            }).then(res => {
                this.rowData = [];
                const data = res.data;
                let cnt = 1;
                for (let obj of data) {
                    this.rowData.push({
                        prod_code: obj.prod_code,
                        prod_name: obj.prod_name,
                        order_quantity: obj.currentPlanQty,
                        priority: cnt,
                        quantity: obj.quantity,
                    });
                    cnt++;
                }
            }).catch((err) => console.error(err));

            await axios.get(`/api/work/order/matReqQty/${plan.plan_code}`, {
            }).then(res => {
                this.secondRowData = [];
                const data = res.data;
                let cnt = 1;
                for (let obj of data) {
                    this.secondRowData.push({
                        prod_code: obj.prod_code,
                        mat_code: obj.mat_code,
                        mat_name: obj.mat_name,
                        req_material_quantity: obj.req_material_quantity,
                        material_input_qunatity: obj.material_input_qunatity,
                    });
                    cnt++;
                }
            }).catch((err) => {
                console.error(err);
            });
        },

        // 생산 지시 모달창 값 전달
        async planOrderSelected(planOrder) {
            this.clearForm();
            let result = await axios.get(`/api/work/order/productOrder/${planOrder.product_order_code}`, {
            }).catch((err) => console.error(err));
            const product_order_data = result.data;
            this.formData.product_order_code = product_order_data.product_order_code;
            this.formData.product_order_name = product_order_data.product_order_name;
            this.formData.emp_name = product_order_data.employee_code;
            this.formData.plan_code = product_order_data.plan_code;
            this.formData.plan_name = product_order_data.plan_name;
            this.formData.start_date = product_order_data.start_date;
            this.formData.end_date = product_order_data.end_date;
            this.formData.note = product_order_data.note;

            result = await axios.get(`/api/work/order/workDetail/${planOrder.product_order_code}`).catch((err) => console.error(err));
            const work_detail_list = result.data;
            for (let detail of work_detail_list) {
                this.rowData.push({
                    product_order_detail_code: detail.product_order_detail_code,    // 생산 지시 상세 코드 
                    prod_code: detail.prod_code,            // 제품코드
                    prod_name: detail.prod_name,            // 제품명
                    order_quantity: detail.order_quantity,  // 지시수량
                    priority: detail.priority,              // 우선순위
                    quantity: detail.quantity,              // 주문량
                });
                result = await axios.get(`/api/work/order/loadMatQty/${detail.product_order_detail_code}`).catch((err) => console.error(err));
                const mat_qty_list = result.data;
                for (let matQty of mat_qty_list) {
                    this.secondRowData.push({
                        prod_code: matQty.prod_code,                                // 제품코드
                        mat_code: matQty.mat_code,                                  // 자재코드
                        mat_name: matQty.mat_name,                                  // 자재명
                        req_material_quantity: matQty.req_material_quantity,        // 요구량
                        material_input_qunatity: matQty.hold_quantity,              // 투입량
                    });
                    result = await axios.get(`/api/work/order/loadMat`, {
                        params: {
                            product_order_detail_code: detail.product_order_detail_code,// 생산 지시 상세 코드드
                            mat_code: matQty.mat_code,                                  // 자재 코드
                        }
                    }).catch((err) => console.error(err));
                    const mat_list = result.data;
                    for (let mat of mat_list) {
                        this.matHoldDataList.push({
                            prod_code: mat.prod_code,
                            mat_code: matQty.mat_code,
                            mat_LOT: mat.mat_LOT,
                            mat_hold_qty: mat.hold_quantity,
                        });
                    }
                }
            };

            this.secondRowData = [...this.secondRowData];
        },

        // 자재 선택 모달창
        matRowClicked(params) {
            // 자재 선택 모달창 값 전달 - mat_code
            this.selectMat_code = params.data.mat_code;

            // 자재 선택 모달창 값 전달 - mat_list
            let matHoldList = [];

            for (let data of this.matHoldDataList) {
                if (data.mat_code == params.data.mat_code) {
                    matHoldList.push({
                        mat_code: data.mat_code,
                        mat_LOT: data.mat_LOT,
                        hold_quantity: data.mat_hold_qty,
                    });
                }
            }

            this.selectMat_list = matHoldList;

            // 선택된 row 저장
            this.selectedSecondIndex = params.rowIndex;
            this.showMatStockModal = true;
        },

        // 자재 재고 모달창 값 전달
        async matData(mats) {
            let totalQty = 0;
            
            for (let mat of mats) {
                totalQty += parseInt(mat.mat_hold_qty);
                this.secondRowData[this.selectedSecondIndex].mat_LOTs = [];
                this.secondRowData[this.selectedSecondIndex].mat_LOTs.push({
                    mat_code: mat.mat_code,
                    mat_LOT: mat.mat_LOT,
                    mat_hold_qty: mat.mat_hold_qty,
                });
            }
            this.secondRowData[this.selectedSecondIndex].material_input_qunatity = totalQty;
            this.secondRowData = [...this.secondRowData];
        },

        //행추가
        addRow() {
            if(this.formData.plan_code != '') {
                Swal.fire({
                    title: '실패',
                    text: '생산 계획으로 가져온 데이터는 추가가 불가능합니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return;
            }
            this.rowData.push({
                orders_code: "",
                prod_name: "",
                order_quantity: "",
                priority: "",
                quantity: "",
            })
            // 새 배열로 설정하여 AG Grid가 반영하게 만듬
            this.rowData = [...this.rowData];
        },

        //행삭제
        deleteRow() {
            if (this.formData.plan_code != '') {
                Swal.fire({
                    title: '실패',
                    text: '생산 계획으로 가져온 데이터는 삭제가 불가능합니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return;
            }
            const selectedNodes = this.$refs.mainGrid.api.getSelectedNodes();
            const selectedData = selectedNodes.map(node => node.data);

            this.rowData = this.rowData.filter(row => !selectedData.includes(row));
        },

        // 생산 지시 등록
        async addPlanOrder() {
            let orderData = {
                product_order_code: this.formData.product_order_code,
                plan_code: this.formData.plan_code,
                product_order_name: this.formData.product_order_name,
                employee_code: this.formData.emp_name,
                start_date: this.formData.start_date,
                end_date: this.formData.end_date,
                note: this.formData.note,
            }

            let result = await axios.post(`/api/work/order/insert`, {
                orderData: orderData,
                orderDetailDataList: this.rowData,
                matHoldDataList: this.secondRowData,
            }).catch((err) => console.error(err));
            if (result.data.affectedRows > 0) {
                Swal.fire({
                    title: '성공',
                    text: '생산 지시가 정상적으로 등록되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인'
                });
            } else {
                Swal.fire({
                    title: '실패',
                    text: '생산 지시 등록 중 오류가 발생되었습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
            }
        },

        // 생산 지시 수정
        async updateProductOrder() {
            // 생산 계획을 가져왔는 지 확인
            if(this.editMode == false) {

            };
            for(let data of this.secondRowData) {
                if(!Array.isArray(data.mat_LOTs)) {
                    Swal.fire({
                        title: '실패',
                        text: '자재 확보를 먼저 하신 후 수정바랍니다.',
                        icon: 'error',
                        confirmButtonText: '확인'
                    });
                    return;
                }
            }
            let orderData = {
                product_order_code: this.formData.product_order_code,
                product_order_name: this.formData.product_order_name,
                start_date: this.formData.start_date,
                end_date: this.formData.end_date,
                note: this.formData.note,
            }
            let result = await axios.put(`/api/work/order/update`, {
                orderData: orderData,
                workDetailList: this.rowData,
                matHoldDataList: this.secondRowData,
            }).catch((err) => console.error(err));
            if(result.data.affectedRows > 0 ) {
                Swal.fire({
                    title: '성공',
                    text: '생산 지시가 정상적으로 수정되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인'
                });
            } else {
                Swal.fire({
                    title: '실패',
                    text: '생산 지시 수정 중 오류가 발생되었습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
            }
        },

        // 생산 지시 삭제
        async deleteProductOrder() {
            // 생산 계획을 가져왔는 지 확인
            if (this.editMode == false) {

            };
            let result = await axios.delete(`/api/work/order/delete/${this.formData.product_order_code}`).catch((err) => console.error(err));
            if(result.data.affectedRows > 0 ) {
                Swal.fire({
                    title: '성공',
                    text: '생산 지시가 정상적으로 삭제제되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인'
                });
            } else {
                Swal.fire({
                    title: '실패',
                    text: '생산 지시 삭제 중 오류가 발생되었습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
            }
        },
    },
};
</script>

<style>
.ag-theme-alpine .ag-header-cell-label {
    justify-content: center;
}
</style>