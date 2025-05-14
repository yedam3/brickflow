<template>
    <CModal :visible="visible" @close="close" backdrop="static" alignment="center" size="xl" style="min-width: 1000px">
        <CModalHeader>
            <slot name="header">재고 품목</slot>
        </CModalHeader>

        <CModalBody>
            <div class="text-end mb-3">
                <Button label="자동계산" severity="success" size="large" @click="autoHold" />
            </div>
            <div class="ag-theme-alpine align-content-center">
                <AgGridVue style="width: 100%; height: 100%" class="ag-theme-alpine" :columnDefs="columnDefs"
                    :rowData="rowData" :gridOptions="gridOptions" />
            </div>
            <div class="text-center mt-3">
                <Button label="자재 확보" severity="success" size="large" @click="matSecure" />
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
import { AgGridVue } from "ag-grid-vue3";
import axios from "axios";

import Swal from 'sweetalert2';

export default {
    name: "MatStockModal",
    components: {
        AgGridVue,
    },
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        prod_code: {
            type: String,
            required: false
        },
        mat_code: {
            type: String,
            required: false,
        },
        mat_list: {
            type: Array,
            required: false,
        },
        mat_req_qty: {
            type: Number,
            required: false,
        },
        mat_temp_data: {
            type: Array,
            required: false,
        }
    },
    
    watch: {
        visible(newVal) {
            if (newVal) {
                this.matStockList();
            }
        },
        rowData : {
            handler(newVal) {

            },
            deep: true
        },
    },
    data() {
        return {
            rowData: [],

            original_rowData: [],

            mat_data: [],

            columnDefs: [
                { field: "mat_LOT", headerName: "LOT번호", flex: 1 },
                { field: "mat_code", headerName: "자재코드", flex: 1 },
                { field: "mat_name", headerName: "자재명", flex: 1 },
                { field: "store_date", headerName: "입고일자", flex: 1 },
                { field: "available_qty", headerName: "자재출고 가능 수량", flex: 2 },
                { field: "mat_hold_qty", headerName: "자재출고 수량", editable: true, flex: 2 },
            ],
            gridOptions: {
                domLayout: "autoHeight",
                // singleClickEdit: true,               // 셀 편집 ON
                // suppressRowClickSelection: true,     // 행 클릭 선택 OFF
                suppressCellFocus: true,                // 셀 포커스 OFF
                pagination: true,                       // 페이징 ON
                paginationPageSize: 5,                  // 한 페이지 보여질 행 수
                paginationPageSizeSelector: false,      // paseSize 선택란 삭제
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
        // 제품별 자재 재고 목록
        this.matStockList();
    },
    methods: {
        // 모달창 닫기 이벤트
        close() {
            this.$emit("close");
        },

        // 제품별 자재 재고 목록 조회 API
        async matStockList() {
            this.rowData = [];
            const result = await axios.get(`/api/work/order/matQty`, {
                params: {
                    prod_code: this.prod_code,
                    mat_code: this.mat_code,
                },
            }).catch(error => { console.error(error) });

            let matList = result.data;
            for(let data of matList) {
                this.rowData.push({
                    mat_LOT: data.mat_LOT,
                    mat_code: data.mat_code,
                    mat_name: data.mat_name,
                    store_date: data.store_date,
                    available_qty: parseInt(data.available_qty),
                    mat_hold_qty: 0,
                });
            }

            this.original_rowData = [...this.rowData];
                
            for(let temp of this.mat_temp_data) {
                let matchIndex = this.rowData.findIndex(item => {
                    return item.mat_code == temp.mat_code && item.mat_LOT == temp.mat_LOT
                });
                if(matchIndex !== -1) {
                    this.rowData[matchIndex].available_qty = parseInt(this.rowData[matchIndex].available_qty) - parseInt(temp.hold_quantity);
                }
            }

            let temp2 = [];
            for(let data of this.rowData) {
                if(data.available_qty >= 0) {
                    temp2.push(data);
                }
            }
            this.rowData = [...temp2];

            this.setMatHoldData(); 
        },

        updateAvailableQty(row) {
        },

        // 자동 확보
        autoHold() {
            let mat_list = [];
            // this.rowData.sort((a, b) => new Date(a.store_date) - new Date(b.store_date));

            let remainingQty = this.mat_req_qty;
            for (let row of this.rowData) {
                const availableQty = parseInt(row.available_qty);
                if (remainingQty <= 0) break;

                const holdQty = Math.min(availableQty, remainingQty);
                row.mat_hold_qty = holdQty;
                remainingQty -= holdQty;
            }
            
            this.rowData = [...this.rowData];
        },

        // 자재 확보 버튼
        matSecure() {
            this.mat_data = [];
            let totalQty = 0;
            for(let row of this.rowData) {
                totalQty += parseInt(row.mat_hold_qty);
                if(row.mat_hold_qty != '' && parseInt(row.mat_hold_qty) > 0) {
                    if (parseInt(row.available_qty) < parseInt(row.mat_hold_qty)) {
                        Swal.fire({
                            title: '실패',
                            text: '자재 출고 가능수량보다 자재출고 수량이 더 많습니다.',
                            icon: 'error',
                            confirmButtonText: '확인'
                        });
                        return;
                    }
                    if ((parseInt(row.available_qty) > parseInt(row.mat_hold_qty)) && (this.mat_req_qty != parseInt(row.mat_hold_qty))) {
                        Swal.fire({
                            title: '실패',
                            text: '자재출고 수량보다 자재출고 자재 출고 가능수량이 더 많습니다.',
                            icon: 'error',
                            confirmButtonText: '확인'
                        });
                        return;
                    }
                    this.mat_data.push({
                        prod_code: this.prod_code,
                        mat_code: row.mat_code,
                        mat_LOT: row.mat_LOT,
                        mat_hold_qty: row.mat_hold_qty
                    });
                }
            }
            if(this.mat_req_qty > totalQty) {
                Swal.fire({
                    title: '실패',
                    text: '자재 최소 요구량이 충족하지 않습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return;
            }
            this.$emit('matHoldData', this.mat_data);
            this.close();
        },

        // 그리드 행 클릭 메소드
        onRowClicked() {
        
        },

        // 자재 홀드량 반영
        setMatHoldData() {
            if (this.mat_list && this.mat_list.length > 0) {
                this.rowData = this.rowData.map(row => {
                    const match = this.mat_list.find(item => {
                        return (item.mat_LOT.toLowerCase() == row.mat_LOT.toLowerCase() && item.mat_code.toLowerCase() == row.mat_code.toLowerCase())
                    });
                    if (match) {
                        return { ...row, mat_hold_qty: match.hold_quantity };
                    }
                    return row;
                });
            }
            if (this.mat_temp_data && this.mat_temp_data.length > 0) {
                this.rowData = this.rowData.map(row => {
                    const match = this.mat_temp_data.find(item => {
                        return (item.mat_LOT.toLowerCase() == row.mat_LOT.toLowerCase() && item.mat_code.toLowerCase() == row.mat_code.toLowerCase())
                    });
                    if (match) {
                        return { ...row, mat_hold_qty: match.hold_quantity };
                    }
                    return row;
                });
            }
        }
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