<template>
<h1>굿</h1>
<button class='btn btn-primary'>시작</button>
<div class="p-4">
    <h1 class="text-xl font-bold mb-4">AG Test 조회 페이지</h1>
    <ag-grid-vue
    class="ag-theme-alpine"
      style="width: 100%; height: 500px;"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :gridOptions="gridOptions"
      :defaultColDef="defaultColDef"
    ></ag-grid-vue>
  </div>
</template>

<script>
 import { AgGridVue } from 'ag-grid-vue3';
 import axios from 'axios';

 export default{
    components: {
    AgGridVue
  },
  data() {
    return {
      rowData: [],
      columnDefs: [
        { field: 'name', headerName: '이름',flex:4,editable:true},
        { field: 'gender', headerName: '성별' ,flex:1},
        { field: 'city', headerName: '도시' ,flex:3},
        { field: 'tel', headerName: '전화번호' ,flex:3}
      ],
      gridOptions:{
        pagination: true,
          paginationPageSize: 5,
          paginationPageSizeSelector: [5, 10, 20, 50],
          overlayNoRowsTemplate: '표시할 값이 없습니다.',
        defaultColDef: {
         sortable: true, //정렬가능
         filter: true, //필터가능
         resizable: true //마우스드래그
      }
     }
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('/api/agTest');
        this.rowData = response.data;
      } catch (err) {
        console.error('데이터 조회 실패:', err);
      }
    }
  }
}

</script>
<style>
  .ag-theme-alpine .ag-header {
  background-color: #FF9900; 
  color: white;
  }
</style>