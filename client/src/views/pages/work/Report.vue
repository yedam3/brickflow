<template>
    <div class="card border-0" style="height: 800px">
        <div class="font-semibold text-xl mb-4">생산 전표 관리</div>
    <div class="text-end mt-3 mb-3">
        <div class="input-group mb-3 w-50">
            <select class="form-select" aria-label="Default select example">
                <option value="1" selected>지시명</option>
                <option value="2">주문명</option>
                <option value="2">주문번호</option>
              </select>
              <input type="text" v-model="searchText" placeholder="검색" @input="onSearch" class="form-control w-50" style="width: 30%" />
              <button @click="searchMaterials" class="btn btn-primary">
                    <i class="pi pi-search"></i>
              </button>
           </div>
        </div>
        <div class="ag-wrapper d-flex justify-content-center" style="border: none;">
            <ag-grid-vue class="ag-theme-alpine custom-grid-theme" style="width: 95%" :columnDefs="columnDefs"
                :rowData="rowData" :gridOptions="gridOptions">
            </ag-grid-vue>
        </div>
        <Button label="인쇄" severity="danger" class="me-5" />
    </div>
</template>
<script>
import { AgGridVue } from "ag-grid-vue3";

export default {
    components: {
        AgGridVue,
    },
    data() {
        return {
            //메인그리드
            rowData: [
                {
                    mat_order_code: "",
                    company_code: "",
                    request_date: "",
                    delivery_date: "",
                    emp_code: "",
                    note: "",
                },
            ],
            columnDefs: [
                { field: "mat_order_code", headerName: "제품명", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "company_code", headerName: "제품LOT", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "request_date", headerName: "생산완료 재고", flex: 2, editable: true, cellStyle: { textAlign: "center" }, cellEditor: "datePicker" },
                { field: "delivery_date", headerName: "입고수량(직접기입)", flex: 3, editable: true, cellStyle: { textAlign: "center" }, cellEditor: "datePicker" },
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
            showModal: false,
        };
    },
    mounted() {
        this.autoMatCode();
    },
    methods: {
        // 사이트 접속시 matCode 자동증가
        async autoMatCode() {
            try {
                const result = await axios.get("/api/mat/autoMatCode");
                this.rowData[0].mat_order_code = result.data[0].mat_order_code;
            } catch (err) {
                console.log(err);
            }
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