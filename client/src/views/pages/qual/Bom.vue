<template>
   <div class="card border-0 h-100">
      <div class="font-semibold text-xl mb-4">BOM 관리</div>
      <div class="d-flex justify-content-start me-5">
            <div class="input-group mb-3 w-75">
              <!-- 검색 조건 선택 -->
              <select v-model="searchType" class="form-select" aria-label="Default select example">
                <option value="mat_code" selected>자재코드</option>
                <option value="mat_name">자재명</option>
              </select>
              <!-- 검색어 입력 -->
              <input type="text" v-model="searchText" placeholder="검색어 입력" 
             class="form-control w-50" style="width: 30%" @keydown.enter="searchMaterials" />
              <!-- 검색 버튼 -->
              <button @click="searchMaterials" class="btn btn-primary">
                <i class="pi pi-search"></i>
              </button>
            </div>
          </div>
    <div class="prod-grid" >
     
      <ag-grid-vue style="width: 700px; height: 500px;"
        class="ag-theme-alpine"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :gridOptions="gridOptions"
        :defaultColDef="defaultColDef">
    </ag-grid-vue>
   </div>
   <div class="bom-grid">
  <ag-grid-vue style="width: 700px; height: 500px;"
    class="ag-theme-alpine"
      :columnDefs="columnDefs2"
      :rowData="rowData2"
      :gridOptions="gridOptions2"
      :defaultColDef="defaultColDef2"
    ></ag-grid-vue>
    </div>
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
        { field: 'prod_code ', headerName: '제품코드',flex:4,editable:true},
        { field: 'prod_name', headerName: '제품명' ,flex:1},
      ],
      gridOptions:{
        pagination: true,
          paginationPageSize: 5,
          paginationPageSizeSelector: [5, 10, 20, 50],
          overlayNoRowsTemplate: '표시할 값이 없습니다.',
          defaultColDef: {
          sortable: true, //정렬가능
          filter: true, //필터가능
          resizable: true, //마우스드래그
          onGridReady: function (event) {
          event.api.sizeColumnsToFit();
        },
        
      }
     },
     rowData2: [],
     columnDefs2: [
        { field: 'mat_code', headerName: '자재코드',flex:4,editable:true},
        { field: 'prod_name', headerName: '제품명' ,flex:1},
        { field: 'mat_name', headerName: '자재명 ' ,flex:1},
        { field: 'quantity', headerName: '수량 ' ,flex:1},
      ],
      gridOptions2:{
        pagination: true,
         paginationPageSize: 5,
         paginationPageSizeSelector: [5, 10, 20, 50],
         overlayNoRowsTemplate: '표시할 값이 없습니다.',
         defaultColDef2: {
         sortable: true, //정렬가능
         filter: true, //필터가능
         resizable: true, //마우스드래그
         onGridReady: function (event) {
         event.api.sizeColumnsToFit();
        },
      }
     },
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('/api/admin/bom');
        this.rowDat = response.data;
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
<style scoped>

.prod-grid {
  display: flex;
  justify-content:right; /* 가로 가운데 정렬 */
  align-items:center;      /* 세로 가운데 정렬 */
  gap: 50px;                /* 박스들 사이 간격 30px */
}
.bom-grid {
  display: flex;
  justify-content:left; /* 가로 가운데 정렬 */
  align-items:center;      /* 세로 가운데 정렬 */
  gap: 50px;                /* 박스들 사이 간격 30px */
}

</style>




