<template>
  <div class="ag-theme-alpine p-4" style="background-color: white; min-height: 800px;">
    <div class="card shadow-sm mb-4 p-4">
      <h5 class="mb-4">제품 등록</h5>

      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">제품코드</label>
          <input type="text" class="form-control" v-model="rowData.prod_code" />
        </div>
        <div class="col-md-4">
          <label class="form-label">제품명</label>
          <input type="text" class="form-control" v-model="rowData.prod_name" />
        </div>
        <div class="col-md-4">
          <label class="form-label">단위</label>
          <input type="text" class="form-control" v-model="rowData.unit" />
        </div>
        <div class="col-md-4">
          <label class="form-label">무게</label>
          <input type="text" class="form-control" v-model="rowData.weight" />
        </div>
        <div class="col-md-4">
          <label class="form-label">크기</label>
          <input type="text" class="form-control" v-model="rowData.size" />
        </div>
        <div class="col-md-4">
          <label class="form-label">단위별 수량</label>
          <input type="text" class="form-control" v-model="rowData.by_unit_number" />
        </div>
        <div class="col-md-4">
          <label class="form-label">적정재고</label>
          <input type="number" class="form-control" min="0" v-model="rowData.proper_store" @keydown="allowOnlyNumber" />
        </div>
      </div>
      <div class="d-flex justify-content-end mt-4 gap-3">
        <Button label="초기화" severity="secondary" class="me-3" @click="Allrest" />
        <Button label="등록" severity="info" class="me-3" @click="addprod" />
        <Button label="수정" severity="warning" class="me-3" @click="" />
        <Button label="삭제" severity="danger" class="me-3" @click="" />
      </div>
    </div>

    <!-- 그리드 -->
    <ag-grid-vue class="ag-theme-alpine custom-grid-theme" style="width: 100%; height: 300px;" :columnDefs="columnDefs"
      :rowData="rowData2" :gridOptions="gridOptions" @rowClicked="clicked" />
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import axios from "axios";
import Swal from 'sweetalert2';



export default {
  components: {
    AgGridVue,
    Swal,
  },
  data() {
    return {
      rowData: {
        prod_code: ""
        , prod_name: ""
        , unit: ""
        , by_unit_number: ""
        , proper_store: ""
        , size: ""
        , weight: ""
      },
      rowData2: [{
        prod_code: "",
        prod_name: "",
        unit: "",
        by_unit_number: "",
        size: "",
        weight: "",
        proper_store: ""
      }],
      columnDefs: [
        { field: "prod_code", headerName: "제품코드", flex: 3, },
        { field: "prod_name", headerName: "제품명", flex: 3, },
        { field: "unit", headerName: "단위", flex: 3, },
        { field: "weight", headerName: "단위별 수량", flex: 3, },
        { field: "size", headerName: "크기", flex: 3, },
        { field: "weight", headerName: "무게", flex: 3, },
        { field: "proper_store", headerName: "적정 재고", flex: 3, }
      ],
      gridOptions: {
        domLayout: "autoHeight",
        singleClickEdit: true,
        suppressRowClickSelection: true,
        pagination: true,
        paginationPageSize: 5,
        paginationPageSizeSelector: false,
        overlayNoRowsTemplate: '표시할 값이 없습니다.',
        defaultColDef: {
          suppressMovable: true,
          resizable: false,
          sortable: false,
          cellStyle: { textAlign: "center" },
        }
      }
    }
  },
  mounted() {

  },
  methods: {
    //rowData 초기화
    Allrest() {
      this.formData = {
        prod_code: ""
        , prod_name: ""
        , unit: ""
        , by_unit_number: ""
        , proper_store: ""
        , size: ""
        , weight: ""
      }
    },
    allowOnlyNumber(event) {
      const allowedKeys = [
        'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'
      ];
      const isNumberKey = event.key >= '0' && event.key <= '9';

      if (!isNumberKey && !allowedKeys.includes(event.key)) {
        event.preventDefault();
      }
    },

    //등록
    async addprod() {
      const res = await axios.post('/api/admin/prodinput', this.rowData )
        .catch(error => {
        console.error("등록 실패:", error);
        Swal.fire("등록 실패", "제품 등록 중 오류가 발생했습니다.", "error");
        return null;
      });
      if (res && res.data && res.data.affectedRows > 0) {
        Swal.fire("등록성공", "정상적으로 등록되었습니다.", "success")
          .then(() => {
          });
      } else if (res) {
        Swal.fire("등록 실패", "등록이 실패하였습니다.", "error");
      }
    },
    //수정
  }
}
</script>