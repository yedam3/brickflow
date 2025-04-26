<template>
  <CModal
    :visible="visible"
    @close="close"
    backdrop="static"
    alignment="center"
    size="xl"
    style="min-width: 1000px"
  >
    <CModalHeader>
      <slot name="header">자재 목록</slot>
    </CModalHeader>

    <CModalBody>
      <div class="ag-theme-alpine" style="height: 400px; width: 100%">
        <!-- 자재명 검색창 -->
        <div class="d-flex justify-content-end me-5">
         <div class="input-group mb-3 w-50">
            <select class="form-select" aria-label="Default select example">
                 <option value="1" selected>자재코드</option>
                 <option value="2">자재명</option>
            </select>
            <input type="text" v-model="searchText" placeholder="자재명 검색" @input="onSearch" class="form-control w-50" style="width: 30%" />
            <button @click="searchMaterials" class="btn btn-primary">
                  <i class="pi pi-search"></i>
            </button>
         </div>
        </div>
        <AgGridVue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :columnDefs="columnDefs"
          :rowData="rowData"
          :gridOptions="gridOptions"
          @rowClicked="Clicked"
        />
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
  name: "MatModal",
  components: {
    AgGridVue,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      rowData: [],
      columnDefs: [
        { field: "mat_code", headerName: "자재코드", flex: 1 },
        { field: "mat_name", headerName: "자재명", flex: 1 },
        { field: "unit", headerName: "단위", flex: 1 },
        { field: "by_unit_number", headerName: "단위별 갯수", flex: 1 },
        { field: "size", headerName: "크기", flex: 1 },
        { field: "safe_inventory", headerName: "안전재고", flex: 1 },
      ],
      gridOptions: {
                domLayout: "autoHeight",
                singleClickEdit: true,
                suppressRowClickSelection: true,
                pagination: true,
                paginationPageSize: 5,
                paginationPageSizeSelector: false, //paseSize 선택란 삭제
     defaultColDef: {
            suppressMovable: true,
            resizable: false,
            sortable: false,
            cellStyle: { textAlign: "center" },
  },
},

    };
  },
  mounted(){
    this.matList();
  },
  methods: {
    close() {
      this.$emit("close");
    },
    matList() {
        axios.get('/api/mat/matList') 
          .then(res => {
            this.rowData = res.data
          })
          .catch(error => {console.error(error)})
      },
  },
 
};
</script>


<style scoped>
  .btn-primary{
    background-color: rgb(230, 171, 98);
    border-color: rgb(230, 171, 98);;
  }
</style>
