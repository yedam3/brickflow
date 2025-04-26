<template>
  <div class="card border-0" style="height: 800px">
    <div class="font-semibold text-xl mb-4">자재발주관리</div>

    <div class="text-end mt-3 mb-3">
      <Button label="조회" severity="success" class="me-3" />
      <Button label="등록" severity="info" class="me-3" />
      <Button label="수정" severity="help" class="me-3" />
      <Button label="삭제" severity="danger" class="me-5" />
    </div>

    <!-- 메인그리드 -->
    <div class="ag-wrapper d-flex justify-content-center">
      <ag-grid-vue
        class="ag-theme-alpine custom-grid-theme"
        style="width: 95%"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :gridOptions="gridOptions"
      >
      </ag-grid-vue>
    </div>
    <!-- 상세그리드-->
    <div class="text-start mt-5 mb-2 ms-5">
      <h4>자재발주량</h4>
      <Button label="행추가" severity="success" class="me-3" />
      <Button label="행삭제" severity="danger" class="me-5" />
    </div>
    <div class="ag-wrapper float-start ms-5">
      <ag-grid-vue
        class="ag-theme-alpine custom-grid-theme"
        style="width: 30%; height: 150px"
        :columnDefs="secondColumnDefs"
        :rowData="secondRowData"
        :gridOptions="gridOptions"
        rowSelection="multiple"
        @cellClicked="matCellClicked"
        @select-mat="matSelected"
      >
      </ag-grid-vue>
    </div>
  </div>

<!--자재 모달창-->
  <MatModal
        :visible="showModal"
        @close="showModal = false"
        @select-item="onItemSelected"
   ></MatModal>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import DatePickerEditor from "../../../components/DatePickerEditor.vue";
import axios from "axios";
import MatModal from "@/components/modal/MatModal.vue";

export default {
  components: {
    AgGridVue,
    datePicker: DatePickerEditor,
    MatModal,
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
      { field: "mat_order_code", headerName: "자재발주코드", flex: 2, cellStyle: { textAlign: "center" } },
      { field: "company_code", headerName: "업체코드", flex: 2, cellStyle: { textAlign: "center" } },
      { field: "request_date", headerName: "발주일자", flex: 2, editable: true, cellStyle: { textAlign: "center" }, cellEditor: "datePicker" },
      { field: "delivery_date", headerName: "납기예정일", flex: 3, editable: true, cellStyle: { textAlign: "center" }, cellEditor: "datePicker" },
      { field: "emp_code", headerName: "등록자", flex: 3, cellStyle: { textAlign: "center" } },
      { field: "note", headerName: "비고", flex: 3, editable: true, cellStyle: { textAlign: "center" } },
      ],
      //상세그리드
      secondRowData: [
        {
          mat_order_detailcode: "",
          mat_name: "",
          mat_order_code: "",
          request_quantity: 0,
        },
      ],
      secondColumnDefs: [
        // 체크박스 추가
        { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
        { field: "mat_order_detailcode", headerName: "자재발주상세코드", flex: 2, cellStyle: { textAlign: "center" } },
        { field: "mat_order_code", headerName: "자재발주코드", flex: 2, editable: true, cellStyle: { textAlign: "center" } },
        { field: "mat_code", headerName: "자재코드", flex: 3, cellStyle: { textAlign: "center" } },
        { field: "mat_name", headerName: "자재명", flex: 3, cellStyle: { textAlign: "center" } },
        { field: "request_quantity", headerName: "발주량", flex: 2, editable: true, cellStyle: { textAlign: "center" } },
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
      showModal:false,
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
/* 헤더 색상 */

/* 헤더 텍스트 가운데 정렬  */
.ag-theme-alpine .ag-header-cell-label {
  justify-content: center;
}
</style>
