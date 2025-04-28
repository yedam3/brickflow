<template>

  <div class="card border-0 h-100">
    <div class="font-semibold text-xl mb-4">주문 관리</div>
    <div class="text-end mt-3 mb-3 ">
      <button class="btn btn-info me-2">조회</button>
      <button class="btn btn-primary me-2">등록</button>
      <button class="btn btn-success me-2">수정</button>
      <button class="btn btn-danger me-2">삭제</button>
    </div>
    
    <ag-grid-vue 
    class="ag-theme-alpine" 
    style="width: 100%; 
    height: 150px;" 
    :columnDefs="columnDefs" 
    :rowData="rowData" 
    :gridOptions="gridOptions" 
    :defaultColDef="defaultColDef">
  </ag-grid-vue>
</div>

    <div class="card border-0 h-100">
    <div class="font-semibold text-xl mb-4">주문 요구 수량</div>
    <div class="text-start mt-5 mb-2 ms-5">
      <Button label="행추가" severity="success" class="me-3" />
      <Button label="행삭제" severity="danger" class="me-5" />
    </div>
    
    <ag-grid-vue 
    class="ag-theme-alpine" 
    style="width: 40%; 
    height: 100px;" 
    :columnDefs="seColumnDefs" 
    :rowData="rowData" 
    :gridOptions="gridOptions" 
    :defaultColDef="defaultColDef">
  </ag-grid-vue>
</div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';

export default {
  components: {
    AgGridVue
  },
  data() {
    return {
      rowData: [{
        name: '',
        gender: '',
        city: '',
        tel:'',
      }],
      columnDefs: [
        { field: 'name', headerName: '출고코드', flex: 3,  },
        { field: 'gender', headerName: '출고명', flex: 3, editable: true },
        { field: 'city', headerName: '주문코드', flex: 3, editable: true },
        { field: 'tel', headerName: '주문명', flex: 3, editable: true },
       { field: 'tel', headerName: '업체명', flex: 3},
      ],
      seColumnDefs: [
        // 체크박스 추가
        { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
        { field: "", headerName: "제품코드", flex: 2, cellStyle: { textAlign: "center" } },
        { field: "", headerName: "제품명", flex: 2, editable: true, cellStyle: { textAlign: "center" } },
        { field: "", headerName: "요구량", flex: 3, cellStyle: { textAlign: "center" } },
        { field: "", headerName: "기납기량", flex: 3, cellStyle: { textAlign: "center" } },
        { field: "", headerName: "미납기량", flex: 2, editable: true, cellStyle: { textAlign: "center" } },
        { field: "", headerName: "출고량", flex: 2, editable: true, cellStyle: { textAlign: "center" } },
      ],

      // gridOptions: {
      //   pagination: true,
      //   paginationPageSize: 5,
      //   paginationPageSizeSelector: [5, 10, 20, 50],
      //   overlayNoRowsTemplate: '표시할 값이 없습니다.',
       
      // }
    };
  },
  mounted() {
    
  },
  methods: {
   
  }
}
</script>

<style>
 :root .ag-theme-alpine .ag-header{
  background-color: #e0a72a;
 }
</style>