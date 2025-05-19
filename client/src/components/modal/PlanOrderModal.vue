<template>
    <CModal :visible="visible" @close="close" backdrop="static" alignment="center" size="xl" style="min-width: 1000px">
        <CModalHeader>
            <slot name="header">생산지시 목록</slot>
        </CModalHeader>

        <CModalBody>
            <div class="ag-theme-alpine" style="height: 400px; width: 100%">
                <!-- 생산계획 검색 -->
                <div class="row">
                    <div class="col-3">

                    </div>
                    <div class="col-6">
                        <div class="d-flex justify-content-center">
                            <div class="input-group mb-3 w-100">
                                <select class="form-select" v-model="searchType" aria-label="Default select example">
                                    <option value="product_order_name" selected>지시명</option>
                                    <option value="product_order_code">지시 코드</option>
                                    <option value="prod_name">제품명</option>
                                </select>
                                <input type="text" v-model="searchText" placeholder="검색어 입력"
                                    @keydown.enter="searchProudctOrder" class="form-control w-50" style="width: 30%" />
                                <button @click="searchProudctOrder" class="btn btn-primary">
                                    <i class="pi pi-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-3 p-2">
                        <CFormCheck class="text-dark" v-model="isOnlyW1" @change="searchProudctOrder" label="지시등록 상태만 보기" />
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
    name: "PlanOrderModal",
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
                this.planOrderList();
            }
        }
    },
    data() {
        return {
            rowData: [

            ],
            searchType: "product_order_name",
            searchText: "",
            isOnlyW1: false,

            columnDefs: [
                { field: "product_order_code", headerName: "생산지시코드", flex: 1 },
                { field: "product_order_name", headerName: "생산지시명", flex: 2 },
                { field: "start_date", headerName: "시작일", flex: 1 },
                { field: "end_date", headerName: "종료일", flex: 1 },
                { field: "prod_name", headerName: "제품명", flex: 3 },
                {
                    field: "finish_status", headerName: "상태", flex: 1,
                    valueFormatter: params => {
                        if(params.value === 'WS1') {
                            return '지시 등록';
                        } else if(params.value === 'WS2') {
                            return '생산중';
                        } else if(params.value === 'WS3') {
                            return '생산 완료';
                        } else if(params.value == 'WS4') {
                            return '폐기 처분';
                        }
                    },
                    cellStyle: params => {
                        if(params.value === 'WS1') {
                            return { textAlign: 'center', fontWeight: 'bold', color: '#6c757d' };
                        } else if(params.value == 'WS2') {
                            return { textAlign: 'center', fontWeight: 'bold', color: '#fd7e14' };
                        } else if(params.value == 'WS3') {
                            return { textAlign: 'center', fontWeight: 'bold', color: '#28a745' };
                        } else if(params.value == 'WS4') {
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
        // 계획 지시 목록
        this.planOrderList();
        this.isOnlyW1 = false;
    },
    methods: {
        // 모달창 닫기 이벤트
        close() {
            this.$emit("close");
        },

        // 계획지시 목록 조회 API
        planOrderList() {
            axios.get('/api/work/order/list')
                .then(res => {
                    this.rowData = res.data
                })
                .catch(error => { console.error(error) })
        },

        // 계획 지시 목록 검색
        async searchProudctOrder() {
            await axios.get(`/api/work/order/list`, {
                params: {
                    type: this.searchType,
                    keyword: this.searchText,
                    onlyW1: this.isOnlyW1 === true ? false : true,
                }
            }).then(res => {
                this.rowData = res.data;
            }).catch((err) => console.error(err));
        },

        // 그리드 행 클릭 메소드
        onRowClicked(params) {
            if(params.data.finish_status === 'WS2') {
                Swal.fire({
                    title: '실패',
                    text: '이미 생산이 진행되고 있는 지시입니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return;
            }
            if(params.data.finish_status === 'WS3') {
                Swal.fire({
                    title: '실패',
                    text: '이미 생산이 완료된 지시입니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return;
            } else if (params.data.finish_status === 'WS4') {
                Swal.fire({
                    title: '실패',
                    text: '폐기된 지시입니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return;
            }
            this.$emit('selectPlanOrder', params.data);
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