
  
  


<template>

  <div class="card border-0 h-100">
    <div class="font-semibold text-xl mb-4">주문 관리</div>
  </div>
  <div class="text-end mt-3 mb-3 ">
    <button class="btn btn-info me-2">조회</button>
    <button class="btn btn-primary me-2">등록</button>
    <button class="btn btn-success me-2">수정</button>
    <button class="btn btn-danger me-2">삭제</button>
  </div>

    <ag-grid-vue 
    class="ag-theme-alpine" 
    style="width: 100%; 
    height: 500px;" 
    :columnDefs="columnDefs" 
    :rowData="rowData" 
    :gridOptions="gridOptions" 
    :defaultColDef="defaultColDef">
    </ag-grid-vue>
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
        { field: 'name', headerName: '주문번호', flex: 2,  },
        { field: 'gender', headerName: '주문명', flex: 2, editable: true },
        { field: 'city', headerName: '주문일자', flex: 2, editable: true },
        { field: 'tel', headerName: '납기일자', flex: 3, editable: true },
        { field: 'tel', headerName: '등록자', flex: 3},
        { field: 'tel', headerName: '업체명', flex: 3},
        { field: 'tel', headerName: '비고', flex: 3, editable: true },
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

<style scoped>
 :root .ag-theme-alpine .ag-header{
  background-color: #e0a72a;
 }
</style>