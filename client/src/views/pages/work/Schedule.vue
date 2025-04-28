<template>
    <div class="card border-0" style="height: 800px">
        <div class="font-semibold text-xl mb-4">생산 계획 관리</div>

        <div class="font-semibold text-l mb-4">생산 계획 등록</div>

        <div class="text-end mt-3 mb-3">
            <Button label="주문목록" severity="success" class="me-3" @click="orderList" />
            <Button label="계획목록" severity="info" class="me-3" />
            <Button label="등록" severity="help" class="me-3" />
            <Button label="수정" severity="danger" class="me-3" />
            <Button label="삭제" severity="danger" class="me-5" />
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
                                <InputText v-model="formData.start_date" size="large" placeholder="(입력)" />
                            </InputGroup>
                        </div>
                        <div class="col-4">
                            <InputGroup>
                                <InputGroupAddon>
                                    종료일자
                                </InputGroupAddon>
                                <InputText v-model="formData.end_date" size="large" placeholder="(입력)" />
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
            <ag-grid-vue class="ag-theme-alpine custom-grid-theme" style="width: 100%; border: none;" :columnDefs="columnDefs"
                :rowData="rowData" :gridOptions="gridOptions">
            </ag-grid-vue>
        </div>
    </div>

    <!--주문 목록 조회 모달창-->
    <OrderModal :visible="showOrderModal" @close="showOrderModal = false" @selectOrder="orderSelected"></OrderModal>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import DatePickerEditor from "../../../components/DatePickerEditor.vue";
import axios from "axios";
import OrderModal from "@/components/modal/OrderModal.vue";
import Swal from 'sweetalert2';

export default {
    components: {
        AgGridVue,
        datePicker: DatePickerEditor,
        OrderModal,
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

            //메인그리드
            rowData: [
                {
                    orders_code: "",    // 주문번호
                    start_date: "",     // 시작_일자
                    end_date: "",       // 종료_일자
                    prod_name: "",      // 제품명
                    quantity: "",       // 수량
                },
            ],

            secondRowData: [
                {
                    order_code: "",         // 주문번호
                    start_date: "",         // 시작_일자
                    end_date: "",           // 종료_일자
                    prod_name: "",          // 제품명
                    quantity: "",           // 수량(주문상세)
                    unshippedQty: "",       // 미출고량
                    prePlannedQty: "",      // 기계획량
                    unplannedQty: "",       // 미계획량
                    currentPlanQty: "",     // 현계획량
                }
            ],
            columnDefs: [
                { field: "orders_code", headerName: "주문번호", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "", headerName: "주문일자", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "", headerName: "납기일자", flex: 2, editable: true, cellStyle: { textAlign: "center" }, cellEditor: "datePicker" },
                { field: "prod_name", headerName: "제품명", flex: 3, editable: true, cellStyle: { textAlign: "center" }, cellEditor: "datePicker" },
                { field: "quantity", headerName: "주문량", flex: 3, cellStyle: { textAlign: "center" } },
                { field: "", headerName: "미출고량", flex: 3, editable: true, cellStyle: { textAlign: "center" } },
                { field: "", headerName: "기계획량", flex: 3, editable: true, cellStyle: { textAlign: "center" } },
                { field: "", headerName: "미계획량", flex: 3, editable: true, cellStyle: { textAlign: "center" } },
                { field: "", headerName: "현계획량", flex: 3, editable: true, cellStyle: { textAlign: "center" } },
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
            showOrderModal: false,
            //상세그리드 행 인덱스
            selectedSecondIndex: null,
        };
    },
    mounted() {
        this.autoMatCode();
    },
    methods: {
        // FormData 초기화
        clearForm() {
            this.formData = {
                plan_code: "", // 생산계획_코드
                orders_code: "", // 주문_코드
                plan_name: "", // 생산계획명
                employee_code: "", // 담당자
                start_date: "", // 시작_일자
                end_date: "", // 종료_일자
                finish_status: "", // 처리_상태
                note: "", // 비고
            }
        },

        // 주문 모달창
        orderList() {
            this.showOrderModal = true;
        },

        // 주문 모달창 값 전달
        async orderSelected(order) {
            await axios.get('/api/work/orderDetail', {
                params: {
                    orders_code: order.orders_code
                }
            }).then(res => {

            }).catch((err) => console.log(err));
            // for (let rowInclude of this.secondRowData) {
            //     if (rowInclude.orders_code == order.orders_code) {
            //         Swal.fire({
            //             title: '실패',
            //             text: '중복된 주문건을 기입할 수 없습니다.',
            //             icon: 'error',
            //             confirmButtonText: '확인'
            //         });
            //         return;
            //     }
            // }
            // this.secondRowData[this.selectedSecondIndex].orders_code = order.orders_code;
            // // 새 배열로 설정하여 AG Grid가 반영하게 만듬
            // this.secondRowData = [...this.secondRowData];
        },

        //행추가
        addRow() {
            this.secondRowData.push({
                mat_order_detailcode: "",
                mat_code: "",
                mat_name: "",
                mat_order_code: this.rowData[0].mat_order_code,
                request_quantity: 0,
            })
            // 새 배열로 설정하여 AG Grid가 반영하게 만듬
            this.secondRowData = [...this.secondRowData];
        },

        // 사이트 접속시 matCode 자동증가
        async autoMatCode() {
            // try {
            //     const result = await axios.get("");
            //     this.rowData[0].mat_order_code = result.data[0].mat_order_code;
            // } catch (err) {
            //     console.log(err);
            // }
        },
        matCellClicked(params) {
            if (params.colDef.field === "mat_code") {
                this.showModal = true;
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