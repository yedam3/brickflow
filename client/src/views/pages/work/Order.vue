<template>
    <div class="card border-0" style="height: calc(40vh - 4rem)">
        <h3>생산 지시 관리</h3>
        <div class="heading-with-line">
            <h5 class="m-0 me-3">등록 | 수정 | 삭제</h5>
        </div>

        <div class="d-flex flex-wrap justify-content-end gap-2 text-end mt-2 mb-3">
            <Button label="계획목록" severity="success" class="" @click="planList" />
            <Button label="지시목록" severity="info" class="" @click="planOrderList" />
            <Button label="등록" v-if="!editMode" severity="help" class="" @click="addPlanOrder" />
            <Button label="수정" v-if="editMode" severity="danger" class="" @click="updateProductOrder" />
            <Button label="삭제" v-if="editMode" severity="danger" class="" @click="deleteProductOrder" />
            <Button label="초기화" severity="danger" class="" @click="clearBtn" />
        </div>
        
        <div class="container-fluid">
            <div class="row mb-3">
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
                            계획 코드
                        </InputGroupAddon>
                        <InputText v-model="formData.plan_code" size="large" placeholder="" readOnly />
                    </InputGroup>
                </div>
                <div class="col-4">
                    <InputGroup>
                        <InputGroupAddon>
                            계획명
                        </InputGroupAddon>
                        <InputText v-model="formData.plan_name" size="large" placeholder="" readOnly />
                    </InputGroup>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-4">
                    <InputGroup>
                        <InputGroupAddon>
                            담당자
                        </InputGroupAddon>
                        <InputText v-model="formData.employee_name" size="large" placeholder="" />
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
            <div class="row mb-3">
                <div class="col-4">
                    <InputGroup>
                        <InputGroupAddon>
                            시작일자
                        </InputGroupAddon>
                        <DatePicker v-model="formData.start_date" size="large" dateFormat="yy/mm/dd" placeholder="(입력)"
                            showIcon iconDisplay="input" />
                    </InputGroup>
                </div>
                <div class="col-4">
                    <InputGroup>
                        <InputGroupAddon>
                            종료일자
                        </InputGroupAddon>
                        <DatePicker v-model="formData.end_date" size="large" dateFormat="yy/mm/dd" placeholder="(입력)"
                            showIcon iconDisplay="input" />
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
        </div>
    </div>
    <div class="row">
        <div class="col">
            <div class="card border-0" style="min-height: calc(60vh - 6rem)">
                <div class="heading-with-line mb-3">
                    <h5 class="m-0 me-3">생산 제품 목록</h5>
                </div>
                <div class="row justify-content-end">
                    <div class="col">
                        <!-- <Button label="행추가" severity="success me-2" @click="addRow" />
                        <Button label="행삭제" severity="danger" @click="deleteRow" /> -->
                    </div>
                </div>
                <div class="ag-wrapper">
                    <ag-grid-vue ref="mainGrid" class="ag-theme-alpine custom-grid-theme" :columnDefs="prodListDefs"
                        :rowData="rowData" :gridOptions="prodOptions" @cellClicked="prodCellClicked"
                        @cellValueChanged="onProdValueChanged" :context="{ componentParent: this }">
                    </ag-grid-vue>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card border-0" style="min-height: calc(60vh - 6rem)">
                <div class="heading-with-line mb-3">
                    <h5 class="m-0 me-3">자재 홀드</h5>
                </div>
                <div class="ag-wrapper">
                    <ag-grid-vue class="ag-theme-alpine custom-grid-theme" :columnDefs="matHoldListDefs"
                        :rowData="secondRowData" :gridOptions="gridOptions" @rowClicked="matRowClicked">
                    </ag-grid-vue>
                </div>
            </div>
        </div>
    </div>

    <!-- 프로그레스바바 오버레이 -->
    <div v-if="isLoading" class="loading-overlay">
        <div class="loading-content">
            <div class="loading-spinner">
                <div class="spinner"></div>
            </div>

            <!-- 프로그레스바 -->
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: loadingProgress + '%' }"></div>
                </div>
                <div class="progress-text">
                    {{ loadingProgress.toFixed(0) }}%
                </div>
            </div>

            <!-- 로딩 메시지 -->
            <div class="loading-message">
                {{ loadingMessage }}
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
    <MatStock :visible="showMatStockModal" @close="showMatStockModal = false" :prod_code="selectProd_code"
        :mat_code="selectMat_code" :mat_list="selectMat_list" :mat_req_qty="selectMat_req_qty"
        :mat_temp_data="matTempHoldDataList" @matHoldData="matData"></MatStock>

    <!-- 제품 조회 모달창 -->
    <ProdModal :visible="showProdModal" @close="showProdModal = false" @selectProd="prodSelected"></ProdModal>
</template>

<script>
import axios from "axios";

import { useUserStore } from '@/stores/user';

import { AgGridVue } from "ag-grid-vue3";
import HeaderButton from "@/components/HeaderButton.vue";
import Swal from 'sweetalert2';

import PlanModal from "@/components/modal/PlanModal.vue";
import PlanOrderModal from "@/components/modal/PlanOrderModal.vue"
import MatStock from "@/components/modal/MatStock.vue";
import ProdModal from "@/components/modal/ProdModal.vue";

export default {
    components: {
        AgGridVue,
        PlanModal,
        PlanOrderModal,
        MatStock,
        ProdModal,
    },
    data() {
        return {
            showPlanModal: false,
            showPlanOrderModal: false,
            showMatStockModal: false,
            showProdModal: false,

            // 선택된 제품 코드
            selectProd_code: null,
            // 선택된 자재 코드
            selectMat_code: null,
            // 선택된 자재 리스트
            selectMat_list: null,
            // 선택된 자재 요구량
            selectMat_req_qty: null,

            // 제품 선택 행
            selectedProdIndex: null,
            // 자재 홀드량 선택 행
            selectedSecondIndex: null,

            // 수정/삭제 모드
            editMode: false,

            // 임시 자재 홀드 데이터 리스트
            matTempHoldDataList: [

            ],

            // 자재 홀드 데이터 리스트 (LOT)
            matHoldDataList: [

            ],
            // FormData
            formData: {
                product_order_code: "",                 // 생산지시 코드
                employee_code: useUserStore().id,       // 담당자 코드
                employee_name: useUserStore().empName,  // 담당자명
                product_order_name: "",                 // 생산지시명
                plan_code: "",                          // 계획코드
                plan_name: "",                          // 계획명
                start_date: "",                         // 시작일자
                end_date: "",                           // 종료일자
                note: "",                               // 비고
            },

            rowData: [
                // {
                //     prod_code: "",          // 제품코드
                //     prod_name: "",          // 제품명
                //     plan_quantity: "",      // 계획수량
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
                {
                    field: "prod_code", headerName: "제품코드", flex: 2,
                    cellStyle: params => {
                        if (!params.data.prod_code) {
                            return { textAlign: "center", backgroundColor: '#d9f2ff !important' };
                        } else {
                            return { textAlign: "center" };
                        }
                    }
                },
                {
                    field: "prod_name", headerName: "제품명", flex: 2.5,
                    cellStyle: params => {
                        if (!params.data.prod_code) {
                            return { textAlign: "center", backgroundColor: '#d9f2ff !important' };
                        } else {
                            return { textAlign: "center" };
                        }
                    }
                },
                { field: "plan_quantity", headerName: "주문수량", flex: 1.5, cellStyle: { textAlign: "center" } },
                { field: "priority", headerName: "우선순위", flex: 1.5, cellStyle: { textAlign: "center" } },
                {
                    field: "order_quantity", headerName: "지시량", flex: 1.5, editable: true,
                    cellStyle: params => {
                        if ((params.data.prod_code)) {
                            return { textAlign: "center", backgroundColor: '#d9f2ff !important' };
                        } else {
                            return { textAlign: "center" };
                        }
                    }
                },
                {
                    field: "editRow", headerName: "", flex: 1, cellStyle: { textAlign: 'center' },
                    headerComponent: HeaderButton,
                    cellRenderer: params => {
                        return `<button class="btn btn-sm btn-danger text-white" @click="deleteRow">삭제</button>`;
                    },
                    onCellClicked: params => {
                        if(params.column.colId === "editRow") {
                            const target = params.event.target;
                            if(target.tagName === "BUTTON") {
                                if (this.formData.plan_code != '') {
                                    Swal.fire({
                                        title: '실패',
                                        text: '생산 계획으로 가져온 데이터는 삭제가 불가능합니다.',
                                        icon: 'error',
                                        confirmButtonText: '확인'
                                    });
                                    return;
                                }
                                const selectedData = params.data;
                                this.rowData = this.rowData.filter(row => row !== selectedData);
                                params.api.applyTransaction({
                                    remove: [params.data]
                                });
                                this.nonePlanOrder();
                            }
                        }
                    }
                },
            ],
            matHoldListDefs: [
                { field: "prod_code", headerName: "제품코드", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "mat_code", headerName: "자재코드", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "mat_name", headerName: "자재명", flex: 2.5, cellStyle: { textAlign: "center" } },
                { field: "req_material_quantity", headerName: "요구량", flex: 1.5, cellStyle: { textAlign: "center" } },
                // { field: "mat_LOTs", headerName: "자재명", flex: 1, cellStyle: { textAlign: "center" } },
                { field: "material_input_qunatity", headerName: "투입량", flex: 1, cellStyle: { textAlign: "center" } },
            ],
            prodOptions: {
                domLayout: "autoHeight",            //행을 보고 자동으로 hight부여
                singleClickEdit: true,              //한 번 클릭 했을 때 수정
                suppressRowClickSelection: true,    // 행 클릭할 때 체크박스 선택 방지
		        pagination: true,
                paginationPageSize: 7,              // 페이지당 갯수
                paginationPageSizeSelector: false,  // 
                defaultColDef: {
                    suppressMovable: true,          //셀 이동 금지
                    resizable: false,               // 열 크기 조정 가능
                    sortable: false,                //정렬 금지
                },
            },
            gridOptions: {
                domLayout: "autoHeight",            //행을 보고 자동으로 hight부여
                singleClickEdit: true,              //한 번 클릭 했을 때 수정
                suppressRowClickSelection: true,    // 행 클릭할 때 체크박스 선택 방지
		        pagination: true,
                paginationPageSize: 7,              // 페이지당 갯수
                paginationPageSizeSelector: false,  // 
                defaultColDef: {
                    suppressMovable: true,          //셀 이동 금지
                    resizable: false,               // 열 크기 조정 가능
                    sortable: false,                //정렬 금지
                },
            },

            // 지시 조회 프로그레스바
            isLoading: false,
            loadingProgress: 0,
            loadingMessage: '',
        };
    },
    watch() {

    },
    mounted() {
        this.clearForm();
        this.autoOrder_Code();
    },
    methods: {
        // 상품 컬럼 클릭
        prodColumnHeaderClicked(params) {
            if(params.column.colId === "editRow") {
                const target = params
            }
        },

        // FormData 초기화
        clearForm() {
            this.formData = {
                product_order_code: this.formData.product_order_code,       // 생산지시 코드
                employee_code: useUserStore().id,                           // 담당자 코드
                employee_name: useUserStore().empName,                      // 담당자명
                product_order_name: "",                                     // 생산지시명
                plan_code: "",                                              // 계획코드
                plan_name: "",                                              // 계획명
                start_date: "",                                             // 시작일자
                end_date: "",                                               // 종료일자
                note: "",                                                   // 비고
            },
            this.rowData = [
                {
                    prod_code: "",          // 제품코드
                    prod_name: "",          // 제품명
                    plan_quantity: "",      // 계획수량
                    priority: "",           // 우선순위
                    quantity: "",           // 주문량
                }
            ];
            this.rowData = [];
            this.secondRowData = [];
            this.matTempHoldDataList = [];
            this.matHoldDataList = [];
            this.editMode = false;
        },

        clearBtn() {
            this.clearForm();
            this.autoOrder_Code();
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

        // 사이트 접속시 product_order_code 자동증가
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
                        plan_quantity: obj.currentPlanQty,
                        priority: cnt,
                        order_quantity: obj.currentPlanQty,
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

            this.rowData = [...this.rowData];
            this.nonePlanOrder();
        },

        
        // 프로그레스바가 포함된 생산 지시 모달창 값 전달
        async planOrderSelected(planOrder) {
            try {
                this.clearForm();

                // 프로그레스바 초기화
                this.isLoading = true;
                this.loadingProgress = 0;
                this.loadingMessage = '생산 지시 정보를 불러오는 중...';

                // 1. 기본 정보 로드
                this.updateProgress(10, '기본 정보 조회 중...');
                const [productOrderResult, workDetailResult] = await axios.all([
                    axios.get(`/api/work/order/productOrder/${planOrder.product_order_code}`),
                    axios.get(`/api/work/order/workDetail/${planOrder.product_order_code}`)
                ]);

                const product_order_data = productOrderResult.data;
                const work_detail_list = workDetailResult.data;

                // 기본 폼 데이터 설정
                this.formData = {
                    product_order_code: product_order_data.product_order_code,
                    product_order_name: product_order_data.product_order_name,
                    employee_name: product_order_data.employee_name,
                    employee_code: product_order_data.employee_code,
                    plan_code: product_order_data.plan_code,
                    plan_name: product_order_data.plan_name,
                    start_date: product_order_data.start_date,
                    end_date: product_order_data.end_date,
                    note: product_order_data.note
                };

                this.updateProgress(20, '작업 상세 정보 처리 중...');

                // 2. 자재 요구량 정보 로드
                this.updateProgress(25, '자재 요구량 조회 중...');
                const matQtyAxios = work_detail_list.map((detail, index) =>
                    axios.get(`/api/work/order/loadMatQty/${detail.product_order_detail_code}`)
                        .then(result => {
                            // 개별 요청 완료 시 진행률 업데이트
                            const progressIncrement = 25 / work_detail_list.length;
                            this.updateProgress(25 + (progressIncrement * (index + 1)),
                                `자재 요구량 조회 중... (${index + 1}/${work_detail_list.length})`);
                            return { detail, matQtyList: result.data };
                        })
                        .catch(err => {
                            console.error(`자재 요구량 로드 실패 (${detail.product_order_detail_code}):`, err);
                            return { detail, matQtyList: [] };
                        })
                );

                const matQtyResults = await axios.all(matQtyAxios);

                // 3. 자재 투입량 정보 로드
                this.updateProgress(50, '자재 투입량 조회 중...');
                const matInputAxios = [];
                const matQtyMap = new Map();

                matQtyResults.forEach(({ detail, matQtyList }) => {
                    matQtyList.forEach(matQty => {
                        const key = `${detail.product_order_detail_code}_${matQty.mat_code}`;
                        matQtyMap.set(key, { detail, matQty });
                        matInputAxios.push({ key, detail, matQty });
                    });
                });

                // 자재 투입량 API 호출
                const matInputCalls = matInputAxios.map((item, index) =>
                    axios.get(`/api/work/order/loadMat`, {
                        params: {
                            product_order_detail_code: item.detail.product_order_detail_code,
                            mat_code: item.matQty.mat_code
                        }
                    })
                        .then(result => {
                            // 개별 요청 완료 시 진행률 업데이트
                            const progressIncrement = 30 / matInputAxios.length;
                            this.updateProgress(50 + (progressIncrement * (index + 1)),
                                `자재 투입량 조회 중... (${index + 1}/${matInputAxios.length})`);
                            return { key: item.key, matList: result.data };
                        })
                        .catch(err => {
                            console.error(`자재 투입량 로드 실패 (${item.key}):`, err);
                            return { key: item.key, matList: [] };
                        })
                );

                const matInputResults = await axios.all(matInputCalls);

                // 4. 데이터 조합
                this.updateProgress(80, '데이터 조합 중...');
                const newRowData = [];
                const newSecondRowData = [];
                const newMatHoldDataList = [];

                // 제품 정보 설정
                work_detail_list.forEach(detail => {
                    newRowData.push({
                        product_order_detail_code: detail.product_order_detail_code,
                        prod_code: detail.prod_code,
                        prod_name: detail.prod_name,
                        plan_quantity: detail.plan_quantity,
                        priority: detail.priority,
                        order_quantity: detail.order_quantity
                    });
                });

                this.updateProgress(85, '자재 정보 조합 중...');

                // 자재 정보 설정
                matInputResults.forEach(({ key, matList }) => {
                    const { detail, matQty } = matQtyMap.get(key);

                    let totalQty = 0;
                    const tempMatList = [];

                    matList.forEach(mat => {
                        const tempMat = {
                            prod_code: mat.prod_code,
                            mat_code: matQty.mat_code,
                            mat_LOT: mat.mat_LOT,
                            mat_hold_qty: mat.hold_quantity
                        };
                        newMatHoldDataList.push(tempMat);
                        tempMatList.push(tempMat);
                        totalQty += parseInt(mat.hold_quantity);
                    });

                    newSecondRowData.push({
                        prod_code: matQty.prod_code,
                        mat_code: matQty.mat_code,
                        mat_name: matQty.mat_name,
                        req_material_quantity: matQty.req_material_quantity,
                        material_input_qunatity: totalQty,
                        mat_LOTs: tempMatList
                    });
                });

                this.updateProgress(95, '최종 설정 중...');

                // 5. 상태 업데이트
                this.rowData = newRowData;
                this.secondRowData = newSecondRowData;
                this.matHoldDataList = newMatHoldDataList;
                this.editMode = true;

                this.updateProgress(100, '로드 완료!');

                // 완료 후 잠시 대기 후 프로그레스바 숨김
                setTimeout(() => {
                    this.isLoading = false;
                    this.loadingProgress = 0;
                    this.loadingMessage = '';
                }, 500);

            } catch (error) {
                console.error('생산 지시 로드 중 오류 발생:', error);
                this.loadingMessage = '로드 중 오류가 발생했습니다.';

                // 에러 발생 시 3초 후 프로그레스바 숨김
                setTimeout(() => {
                    this.isLoading = false;
                    this.loadingProgress = 0;
                    this.loadingMessage = '';
                }, 3000);
            }
        },

        // 프로그레스바 업데이트 헬퍼 함수
        updateProgress(progress, message) {
            this.loadingProgress = Math.min(progress, 100);
            this.loadingMessage = message;

            // Vue의 반응성을 위해 nextTick 사용
            this.$nextTick(() => {
                // 프로그레스바 UI 강제 업데이트
                this.$forceUpdate();
            });
        },

        // 더 부드러운 프로그레스바를 위한 애니메이션 버전
        async updateProgressSmooth(targetProgress, message, duration = 200) {
            const startProgress = this.loadingProgress;
            const progressDiff = targetProgress - startProgress;
            const steps = Math.max(1, Math.floor(duration / 16));
            const stepSize = progressDiff / steps;

            this.loadingMessage = message;

            for (let i = 0; i < steps; i++) {
                await new Promise(resolve => setTimeout(resolve, 16));
                this.loadingProgress = Math.min(startProgress + (stepSize * (i + 1)), 100);
            }

            this.loadingProgress = Math.min(targetProgress, 100);
        },

        // 자재 선택 모달창
        matRowClicked(params) {
            // 자재 선택 모달창 값 전달 - prod_code;
            this.selectProd_code = params.data.prod_code;

            // 자재 선택 모달창 값 전달 - mat_code
            this.selectMat_code = params.data.mat_code;

            // 자재 선택 모달창 값 전달 - mat_req_qty
            this.selectMat_req_qty = params.data.req_material_quantity;

            // 자재 선택 모달창 값 전달 - mat_list
            let matHoldList = [];

            // DB에 저장된 자재 홀드값 전달
            for (let data of this.matHoldDataList) {
                if (data.mat_code == params.data.mat_code && data.prod_code == params.data.prod_code) {
                    matHoldList.push({
                        prod_code: data.prod_code,
                        mat_code: data.mat_code,
                        mat_LOT: data.mat_LOT,
                        hold_quantity: data.mat_hold_qty,
                    });
                }
            };

            this.selectMat_list = matHoldList;

            // 선택된 row 저장
            this.selectedSecondIndex = params.rowIndex;
            this.showMatStockModal = true;
        },

        // 자재 재고 모달창 값 전달
        async matData(mats) {
            let totalQty = 0;
            let temp = [];
            this.secondRowData[this.selectedSecondIndex].mat_LOTs = [];
            for (let mat of mats) {
                totalQty += parseInt(mat.mat_hold_qty);
                this.secondRowData[this.selectedSecondIndex].mat_LOTs.push({
                    mat_code: mat.mat_code,
                    mat_LOT: mat.mat_LOT,
                    mat_hold_qty: mat.mat_hold_qty,
                });
                temp.push({
                    prod_code: this.secondRowData[this.selectedSecondIndex].prod_code,
                    mat_code: mat.mat_code,
                    mat_LOT: mat.mat_LOT,
                    hold_quantity: mat.mat_hold_qty,
                });
            };

            this.matTempHoldDataList.concat(temp);

            this.matTempHoldDataList = this.matTempHoldDataList.filter(item => {
                return !temp.some(t =>
                    t.prod_code === item.prod_code &&
                    t.mat_LOT === item.mat_LOT
                );
            });
            this.matTempHoldDataList = this.matTempHoldDataList.concat(temp);

            this.secondRowData[this.selectedSecondIndex].material_input_qunatity = totalQty;
            this.secondRowData = [...this.secondRowData];
        },
        // 생산 지시 등록
        async addPlanOrder() {
            let check = await axios.get(`/api/work/order/orderCheck/${this.formData.product_order_code}`)
                .catch((err) => {
                    console.error(err)
                    Swal.fire({
                        title: '실패',
                        text: '생산 계획 코드 조회 중 오류가 발생했습니다.',
                        icon: 'error',
                        confirmButtonText: '확인'
                    });
                    return 1;
                });
            if (check.data.check > 0) {
                Swal.fire({
                    title: '실패',
                    text: '이미 등록된 생산 계획 코드입니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return;
            }

            if (this.insertVaildation() > 0) {
                return;
            }
            let orderData = {
                product_order_code: this.formData.product_order_code,
                plan_code: this.formData.plan_code,
                product_order_name: this.formData.product_order_name,
                employee_code: this.formData.employee_code,
                start_date: this.formData.start_date,
                end_date: this.formData.end_date,
                note: this.formData.note,
            }

            let result = await axios.post(`/api/work/order/insert`, {
                orderData: orderData,
                orderDetailDataList: this.rowData,
                matHoldDataList: this.secondRowData,
            }).catch((err) => {
                console.error(err);
                Swal.fire({
                    title: '실패',
                    text: '생산 지시 등록 중 오류가 발생되었습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
            });
            if (result.data.affectedRows > 0) {
                Swal.fire({
                    title: '성공',
                    text: '생산 지시가 정상적으로 등록되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인'
                });

                this.clearForm();
                this.autoOrder_Code();
            } else {
                Swal.fire({
                    title: '경고',
                    text: '생산 지시 등록 과정에서 오류가 발생했습니다.',
                    icon: 'warning',
                    confirmButtonText: '확인'
                });
            }
        },

        // 생산 지시 수정
        async updateProductOrder() {
            // 생산 계획을 가져왔는 지 확인
            if (this.editMode == false) {

            };
            if (this.insertVaildation() > 0) {
                return;
            }
            for (let data of this.secondRowData) {
                if (!Array.isArray(data.mat_LOTs)) {
                    Swal.fire({
                        title: '실패',
                        text: '자재 확보를 먼저 하신 후 수정바랍니다.',
                        icon: 'error',
                        confirmButtonText: '확인'
                    });
                    return;
                }
            }
            let result = await axios.put(`/api/work/order/update`, {
                orderData: this.formData,
                workDetailList: this.rowData,
                matHoldDataList: this.secondRowData,
            }).catch((err) => console.error(err));
            if (result.data.affectedRows > 0) {
                Swal.fire({
                    title: '성공',
                    text: '생산 지시가 정상적으로 수정되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인'
                });

                this.clearForm();
                this.autoOrder_Code();
            } else if (result.data[0].check === 0) {
                Swal.fire({
                    title: '경고',
                    text: '등록되어 있지 않은 정보입니다.',
                    icon: 'warning',
                    confirmButtonText: '확인'
                });
            }
            else {
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
            if (this.formData == '') {
                Swal.fire({
                    title: '알림',
                    text: '생산 계획이 존재 하지 않습니다.',
                    icon: 'question',
                    confirmButtonText: '확인'
                });
            };
            if (this.anotherVaildation() > 0) {
                return;
            }
            const deleteCheck = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });

            const deleteCheckResult = await deleteCheck.fire({
                title: '알림',
                text: '정말 삭제하겠습니까?',
                icon: 'question',
                confirmButtonText: '확인',
                cancelButtonText: '취소',
                showCancelButton: true
            });

            if (!deleteCheckResult.isConfirmed) {
                return;
            }
            let result = await axios.delete(`/api/work/order/delete/${this.formData.product_order_code}`).catch((err) => console.error(err));
            if (result.data.affectedRows > 0) {
                Swal.fire({
                    title: '성공',
                    text: '생산 지시가 정상적으로 삭제되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인'
                });

                this.clearForm();
                this.autoOrder_Code();
            } else if (result.data[0].check === 0) {
                Swal.fire({
                    title: '경고',
                    text: '등록되어 있지 않은 정보입니다.',
                    icon: 'warning',
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

        // 제품 명 제품 코드 선택 시 모달창 열기
        prodCellClicked(params) {
            if(params.column.colId === 'editRow') {
                const target = params.event.target;
                if(target.tagName === 'BUTTON') {
                    const action = target.getAttribute('data-action');
                    if (action == 'delete') {
                        params.api.applyTransaction({
                            remove: [params.data]
                        });
                        this.rowData[params.rowIndex];
                    }
                }
            }
            if ((params.colDef.field == "prod_code" || params.colDef.field == "prod_name") && (this.formData.plan_code === "")) {
                this.selectedProdIndex = params.rowIndex;
                this.showProdModal = true;
            }
        },

        // 행추가
        addNewRow(newRow) {
            this.rowData.push(newRow);
            this.rowData = [...this.rowData];
        },

        // 행추가
        addRow() {
            if (this.formData.plan_code != '') {
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
                plan_quantity: "",
                priority: "",
                order_quantity: "",
            })
            // 새 배열로 설정하여 AG Grid가 반영하게 만듬
            this.rowData = [...this.rowData];
        },

        // 행삭제
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
            this.nonePlanOrder();
        },


        // 제품 모달창 값 전달
        prodSelected(prod) {
            this.rowData[this.selectedProdIndex].prod_code = prod.prod_code;
            this.rowData[this.selectedProdIndex].prod_name = prod.prod_name;
            this.rowData[this.selectedProdIndex].priority = this.selectedProdIndex + 1;
            this.rowData[this.selectedProdIndex].order_quantity = 0;

            this.matTempHoldDataList = [];
            this.rowData = [...this.rowData];
        },

        // 제품 Grid 값 변경 감지
        onProdValueChanged(params) {
            this.nonePlanOrder();
        },

        // 생산 제품 자재 요구량 조회 (prod_code)
        async nonePlanOrder() {
            this.secondRowData = [];
            for (let prodData of this.rowData) {
                let result = await axios.get(`/api/work/order/matReqQtyByProd_code`, {
                    params: {
                        prod_code: prodData.prod_code,
                        quantity: prodData.order_quantity,
                    }
                }).catch((err) => console.error(err));
                for (let matData of result.data) {
                    this.secondRowData.push({
                        prod_code: matData.prod_code,
                        mat_code: matData.mat_code,
                        mat_name: matData.mat_name,
                        req_material_quantity: matData.req_material_quantity,
                        mat_LOT: "",
                        material_input_qunatity: 0,
                    });
                }
            }
            this.secondRowData = [...this.secondRowData];
        },

        // Insert Vaildation
        insertVaildation() {
            if (this.formData.product_order_name == '' ||
                this.formData.start_date == '' ||
                this.formData.end_date == '') {
                Swal.fire({
                    title: '실패',
                    text: '모든 항목을 입력해주세요',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return 1;
            };
            if (new Date(this.formData.start_date) > new Date(this.formData.end_date)) {
                Swal.fire({
                    title: '실패',
                    text: '종료일자가 시작일자보다 이릅니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return 1;
            }
            if (this.rowData.length <= 0) {
                Swal.fire({
                    title: '실패',
                    text: '생산 제품이 없습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return 1;
            }
            for (let data of this.rowData) {
                if (data.plan_quantity > data.order_quantity) {
                    Swal.fire({
                        title: '실패',
                        text: '지시량 보다 주문량이 적습니다.',
                        icon: 'error',
                        confirmButtonText: '확인'
                    });
                    return 1;
                }
            };
            if (this.secondRowData.length > 0) {
                for (let data of this.secondRowData) {
                    if (!(Array.isArray(data.mat_LOTs))) {
                        Swal.fire({
                            title: '실패',
                            text: '자재 홀드 수량이 올바르지 않습니다.',
                            icon: 'error',
                            confirmButtonText: '확인'
                        });
                        return 1;
                    }
                };
            } else {
                Swal.fire({
                    title: '실패',
                    text: '자재 홀드 데이터가 올바르지 않습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return 1;
            };
        },

        // Vaildation
        async anotherVaildation() {
            // let result = await axios.get(`/api/work/order/productOrderStatus/${this.formData.product_order_code}`).catch((err) => console.error(err));
            // if(result.data.check != 'WS1') {
            //     Swal.fire({
            //         title: '실패',
            //         text: '이미 진행중이거나 생산이 완료된 지시입니다.',
            //         icon: 'error',
            //         confirmButtonText: '확인'
            //     });
            //     return 1;
            // }
        },
    },
};
</script>

<style>
.ag-theme-alpine .ag-header-cell-label {
    justify-content: center;
}

.heading-with-line {
    display: flex;
    align-items: center;
}

.heading-with-line h3 {
    margin-bottom: 0;
    margin-right: 1rem;
}

.heading-with-line::after {
    content: "";
    flex-grow: 1;
    height: 1px;
    background-color: #dee2e6;
    /* Bootstrap의 border 색상 */
}
</style>
<style scoped>
/* 로딩 오버레이 스타일 */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.loading-content {
    background-color: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    text-align: center;
    min-width: 300px;
}

/* 스피너 애니메이션 */
.loading-spinner {
    margin-bottom: 24px;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #2196F3;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* 프로그레스바 스타일 */
.progress-container {
    margin-bottom: 20px;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #2196F3, #21CBF3);
    border-radius: 4px;
    transition: width 0.3s ease;
    position: relative;
}

/* 프로그레스바 애니메이션 효과 */
.progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent);
    animation: progress-shine 1.5s infinite;
}

@keyframes progress-shine {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(100%);
    }
}

.progress-text {
    font-size: 14px;
    font-weight: 600;
    color: #2196F3;
}

/* 로딩 메시지 스타일 */
.loading-message {
    font-size: 16px;
    color: #666;
    margin-top: 8px;
    min-height: 20px;
}

/* 컨텐츠 블러 효과 */
.content-blurred {
    filter: blur(2px);
    pointer-events: none;
}

/* 모바일 반응형 */
@media (max-width: 480px) {
    .loading-content {
        margin: 20px;
        padding: 30px 20px;
        min-width: auto;
    }
}

/* 다크모드 지원 (선택사항) */
@media (prefers-color-scheme: dark) {
    .loading-content {
        background-color: #333;
        color: white;
    }

    .loading-message {
        color: #ccc;
    }

    .progress-bar {
        background-color: #555;
    }
}
</style>