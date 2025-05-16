<template>
    <CModal :visible="visible" @close="close" backdrop="static" alignment="center" size="xl" style="min-width: 1000px">
        <CModalHeader>
            <slot name="header">생산계획 목록</slot>
        </CModalHeader>

        <CModalBody>
            <div class="ag-theme-alpine" style="height: 400px; width: 100%">
                <!-- 생산 계획 검색 -->
                <div class="d-flex justify-content-center me-5">
                    <div class="input-group mb-3 w-50">
                        <select class="form-select" v-model="searchType" aria-label="Default select example">
                            <option value="plan_name" selected>계획명</option>
                            <option value="order_name">주문명</option>
                            <option value="prod_name">제품명</option>
                            <option value="plan_code">계획코드</option>
                        </select>
                        <input type="text" v-model="searchText" placeholder="검색어 입력" @keydown.enter="searchPlan"
                            class="form-control w-50" style="width: 30%" />
                        <button @click="searchPlan" class="btn btn-primary">
                            <i class="pi pi-search"></i>
                        </button>
                    </div>
                </div>
                <AgGridVue style="width: 100%; height: 100%" class="ag-theme-alpine" :columnDefs="columnDefs"
                    :rowData="rowData" :gridOptions="gridOptions" @rowClicked="onRowClicked" />
            </div>
        </CModalBody>

        <CModalFooter>
            <slot name="footer">
                <CButton color="secondary" @click="close">닫기</CButton>
            </slot>
        </CModalFooter>
    </CModal>
</template>

<script>
import axios from "axios";

import { AgGridVue } from "ag-grid-vue3";
import Swal from 'sweetalert2';

export default {
    name: "PlanModal",
    components: {
        AgGridVue,
    },
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
    },
    watch: {
        visible(newVal) {
            if (newVal) {
                this.planList();
            }
        }
    },
    data() {
        return {
            rowData: [],
            searchType: "plan_name",
            searchText: "",

            columnDefs: [
                { field: "plan_code", headerName: "계획코드", flex: 1 },
                { field: "order_name", headerName: "주문명", flex: 1 },
                { field: "plan_name", headerName: "계획명", flex: 2 },
                { field: "start_date", headerName: "시작일", flex: 1 },
                { field: "end_date", headerName: "종료일", flex: 1 },
                { field: "prod_name", headerName: "제품명", flex: 2 },
                {
                    field: "finish_status", headerName: "상태값", flex: 1,
                    valueFormatter: params => {
                        if(params.value === 'OC1') {
                            return '계획 등록';
                        } else if(params.value === 'OC2') {
                            return '지시중';
                        } else if(params.value === 'OC3') {
                            return '지시 완료';
                        } else if(params.value === 'OC4') {
                            return '페기 처리';
                        }
                    },
                    cellStyle: params => {
                        if(params.value === 'OC1') {
                            return { textAlign: 'center', fontWeight: 'bold', color: '#6c757d' };
                        } else if(params.value == 'OC2') {
                            return { textAlign: 'center', fontWeight: 'bold', color: '#fd7e14' };
                        } else if(params.value == 'OC3') {
                            return { textAlign: 'center', fontWeight: 'bold', color: '#28a745' };
                        } else if(params.value == 'OC4') {
                            return { textAlign: 'center', fontWeight: 'bold', color: '#28a745' };
                        }
                    }
                },
            ],
            gridOptions: {
                domLayout: "autoHeight",
                // singleClickEdit: true,               // 셀 편집 ON
                // suppressRowClickSelection: true,     // 행 클릭 선택 OFF
                suppressCellFocus: true,                // 셀 포커스 OFF
                pagination: true,                       // 페이징 ON
                paginationPageSize: 5,                  // 한 페이지 보여질 행 수
                paginationPageSizeSelector: false,      //paseSize 선택란 삭제
                defaultColDef: {                        // 열(컬럼) 기본 설정
                    suppressMovable: true,              // 컬럼을 드래그하여 이동하지 못하게
                    resizable: false,                   // 컬럼 크기 조절 못하게
                    sortable: false,                    // 정렬 못하게
                    cellStyle: { textAlign: "center" }, // 텍스트를 가운데 정렬
                },
            },

        };
    },
    mounted() {
        // 주문 목록
        this.planList();
    },
    methods: {
        // 모달창 닫기 이벤트
        close() {
            this.$emit("close");
        },

        // 생산 계획 목록 조회 API
        planList() {
            axios.get('/api/work/plan/planList')
                .then(res => {
                    this.rowData = res.data
                })
                .catch(error => { console.error(error) })
        },

        // 생산 계획 목록 검색
        async searchPlan() {
            await axios.get(`/api/work/plan/planList`, {
                params: {
                    type: this.searchType,
                    keyword: this.searchText,
                }
            }).then(res => {
                this.rowData = res.data;
            }).catch((err) => console.error(err));
        },

        // 그리드 행 클릭 메소드
        onRowClicked(params) {
            if(params.data.finish_status === 'OC2') {
                Swal.fire({
                    title: '실패',
                    html: '이미 지시가 등록된 계획입니다.<br>지시목록을 통해 선택해주세요.</br>',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return;
            } else if(params.data.finish_status === 'OC3') {
                Swal.fire({
                    title: '실패',
                    text: '이미 지시가 완료된 계획입니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return;
            } else if (params.data.finish_status === 'OC4') {
                Swal.fire({
                    title: '실패',
                    text: '폐기된 계획입니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return;
            }
            this.$emit('selectPlan', params.data);
            this.close();
        },
    },
};
</script>


<style scoped>
.btn-primary {
    background-color: rgb(230, 171, 98);
    border-color: rgb(230, 171, 98);
    ;
}

.selected-row {
    background-color: #d0e7ff !important;
}
</style>