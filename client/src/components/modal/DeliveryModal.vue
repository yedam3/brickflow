<template>
  <CModal :visible="visible" @close="close" backdrop="static" alignment="center" size="xl" style="min-width: 1000px">
    <CModalHeader>
      <slot name="header">주문 목록</slot>
    </CModalHeader>

    <CModalBody>
      <div class="ag-theme-alpine" style="height: 400px; width: 100%">
        <!-- 생산 지시 검색창 -->
        <div class="d-flex justify-content-center me-5">
          <div class="input-group mb-3 w-50">
            <select class="form-select" aria-label="Default select example">
              <option value="1" selected>제품명</option>
              <option value="2">주문명</option>
              <option value="2">주문번호</option>
            </select>
            <input type="text" v-model="searchText" placeholder="검색어 입력" @keydown.enter="searchOrders"
              class="form-control w-50" style="width: 30%" />
            <button @click="searchMaterials" class="btn btn-primary">
              <i class="pi pi-search"></i>
            </button>
          </div>
        </div>
        <AgGridVue style="width: 100%; height: 100%" class="ag-theme-alpine" :columnDefs="columnDefs" :rowData="rowData"
          :gridOptions="gridOptions" @rowClicked="onRowClicked" />
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
export default {
  name: "DeliveryModal",
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
        this.deliverytList();
      }
    }
  },
  data()
  {
    return {
      rowData: [],
      columnDefs: [
        { field: "delivery_code", headerName: "출고번호", flex: 1 },
        { field: "delivery_name", headerName: "출고명", flex: 1 },
        { field: "delivery_date", headerName: "출고일자", flex: 1 },
        { field: "company_name", headerName: "업체명", flex: 1 },
        { field: "prod_name", headerName: "제품명", flex: 2 },
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
    }
  },
  methods: { 
    close() {
      this.$emit("close");
    },
    async deliverytList() {
      await axios.get('/api/sales/deliveryModal')
        .then(res => { 
        this.rowData = res.data
      })
    },
    onRowClicked(event) {
      this.$emit('selectOrder', event.data)
      this.close();
    }
  }
}
</script>