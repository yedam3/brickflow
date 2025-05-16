<template>
    <div class="card border-0" style="height: calc(100vh - 8rem)">
        <h2>생산 전표 관리</h2>
        <div class="heading-with-line mb-2">
            <h5 class="m-0 me-3">전표 출력</h5>
        </div>
        <div class="text-end mt-3 mb-3">
            <div class="row justify-content-between align-items-center">
                <div class="col-auto">
                    <div class="input-group">
                        <select class="form-select w-auto" v-model="searchType">
                            <option value="c.prod_check_code" selected>검사코드</option>
                            <option value="c.prod_code">제품코드</option>
                            <option value="prod_name">제품명</option>
                            <option value="work_lot">생산LOT</option>
                        </select>

                        <input type="text" v-model="searchText" placeholder="검색" @input="onSearch" class="form-control"
                            style="width: 50%;" @keydown.enter="searchList" />

                        <button @click="searchList" class="btn btn-primary">
                            <i class="pi pi-search"></i>
                        </button>
                    </div>
                </div>

                <div class="col-auto" style="margin-right: 100px;">
                    <Button label="전표출력" severity="warn" @click="labelView" />
                </div>
            </div>
        </div>
        <ag-grid-vue class="ag-theme-alpine custom-grid-theme" style="width: 95%" :columnDefs="columnDefs"
            :rowData="rowData" @cellValueChanged="inputRender" :gridOptions="gridOptions">
        </ag-grid-vue>
    </div>

    <LabelModal :visible="showModal" :datable="modalData" rowSelection="multiple" @close="showModal = false">
    </LabelModal>

</template>
<script>
import { AgGridVue } from "ag-grid-vue3";
import axios from "axios";
import LabelModal from "@/components/modal/LabelModal.vue";
import Swal from "sweetalert2";
export default {
    components: {
        AgGridVue,
        LabelModal,
        Swal
    },
    data() {
        return {
            searchType: "c.prod_code",  // 검색 조건 
            searchText: "",   // 검색어
            //메인그리드
            rowData: [],
            modalData: [],
            columnDefs: [
                { field: "prod_check_code", headerName: "검수코드", flex: 2,},
                { field: "prod_code", headerName: "제품코드", flex: 3,},
                { field: "prod_name", headerName: "제품명", flex: 2,},
                { field: "work_lot", headerName: "생산LOT", flex: 2,  },
                { field: "pass_quantity", headerName: "입고가능수량", flex: 3,},
                { field: "finish_quantity", headerName: "입고수량(직접기입)", flex: 3,editable:true},
            ],
            gridOptions: {
                domLayout: "autoHeight", //행을 보고 자동으로 hight부여
                singleClickEdit: true, //한번클릭했을때 수정
                suppressRowClickSelection: true, //	행 클릭할 때 체크박스 선택 방지
                overlayNoRowsTemplate: '표시할 값이 없습니다.',
                pagination: true,
                paginationPageSize: 8,
                paginationPageSizeSelector: false,
                defaultColDef: {
                    suppressMovable: true, //셀 이동 금지
                    resizable: false, // 열 크기 조정 가능
                    sortable: false, //정렬 금지
                    cellStyle: { textAlign: "center" },
                },
            },
            showModal: false,
        };
    },
    mounted() {
        this.finishedReady();
    },
    methods: {
        // 왼제품 대기 항목 조회
        async finishedReady() {
            await axios.get('/api/label/labelList')
                       .then(res => {
                        this.rowData = res.data;
                       })
                       .catch((err) => console.log(err));
                 },
        //검색 조회
        async searchList(){
            await axios.get('/api/label/labelList',{
                params : {
                    type : this.searchType,
                    keyword: this.searchText
                }
            })
                .then(res => {
                    for( let value of res.data){
                        value.finish_quantity = '';
                    }
                    this.rowData = res.data;
                })
                .catch((err) => console.log(err));
        },
        inputRender(event){
            //입고가능수량 보다 더많은값을 기입시
            if(Number(event.data.pass_quantity) < Number(event.data.finish_quantity)){
                Swal.fire({
                    title: '실패',
                    text: '입고가능수량보다 더 많은 값을 입력하엿습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                })
                event.data.finish_quantity='';
                event.api.refreshCells({ rowNodes: [event.node], columns: ['finish_quantity'] })
            }
        },
        labelView(){
            //입고수량 값 체크
            if (!this.rowData.some(row => row.finish_quantity && row.finish_quantity.trim() !== '')) {
                Swal.fire({
                    title: '실패',
                    text: '입고수량의 값을 입력해주십시오.',
                    icon: 'error',
                    confirmButtonText: '확인'
                })
                return;
            }
        
            let filterData = this.rowData.filter(info => info.finish_quantity>0)
            this.modalData = filterData;
            this.showModal = true;
        }
      
    },
};
</script>

<style scoped>

.btn-primary {
      background-color: rgb(230, 171, 98);
      border-color: rgb(230, 171, 98);
    }
/* 헤더 텍스트 가운데 정렬 */
::v-deep(.ag-theme-alpine .ag-header-cell-label) {
  justify-content: center;
}

/* headerClass로 설정한 header-center 클래스에 적용 */
::v-deep(.header-center .ag-header-cell-label) {
  justify-content: center;
}
</style>