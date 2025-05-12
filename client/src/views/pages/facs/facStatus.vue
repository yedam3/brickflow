<template>
  <div class="card border-0" style="background-color: white; height: 800px; ">
    <div class="d-flex justify-content-start">
      <div class="input-group mb-5" style="width: 65%;">
        <!-- 검색 조건 선택 -->
        <select v-model="searchType" class="form-select" aria-label="Default select example">
          <option value="" style="color: gray;">전체</option>
          <option v-for="staFac in statusFacAry" :key="staFac.fac_status"
            :value="staFac.fac_status">{{ staFac.sub_code_name }}</option>
        </select>
        <!-- 검색어 입력 -->
        <input type="text" v-model="searchText" placeholder="검색어 입력" class="form-control w-50" style="width: 100%"
          @keydown.enter="facStatus" />
        <!-- 검색 버튼 -->
        <button @click="facStatus" class="btn btn-primary">
          <i class="pi pi-search"></i>
        </button>
      </div>
    </div>
    <div class="col" style="margin-right: 50px; ">
      <div class="ag-wrapper d-flex justify-content-center">
        <ag-grid-vue class="ag-theme-alpine custom-grid-theme" style="width: 100%; height:  500px;"
          :columnDefs="columnDefs" :rowData="rowData" :gridOptions="gridOptions" @cellClicked="comCellClicked">
        </ag-grid-vue>
      </div>
    </div>
    </div>
</template>

<script>
  import { AgGridVue } from "ag-grid-vue3";
  import DatePickerEditor from "../../../components/DatePickerEditor.vue";
  import axios from "axios";
  export default {
    components: {
        AgGridVue,
        datePicker: DatePickerEditor,
  },
  data() {
    return{
      rowData:[],
      columnDefs:[
        { field:"fac_code", headerName: "설비코드", flex: 2,  },
        { field:"model_name", headerName: "설비이름", flex: 2 },
        { field:"fac_location", headerName: "설비위치", flex: 2 },
        { field:"fac_pattern", headerName: "설비유형", flex: 2 },
        { field:"employee_code", headerName: "담당자", flex: 2 },
        { field:"fac_status", headerName: "설비상태", flex: 2,
        valueFormatter:(params) => {
          if(params.value == 'FS2'){
            return params.value = '비가동';
          } else  if(params.value == 'FS1'){
            return params.value = '가동';
          }
        }, 
        cellStyle: params => {
              if(params.value == "FS1"){
                return { color: '#22C55E', textAlign:'center', fontWeight: 'bold' };
              }else if(params.value == "FS2"){
                return { color: 'red', textAlign:'center', fontWeight: 'bold'};
              }
              return null;
            }},
    ],
      gridOptions: {
          domLayout: "autoHeight",
          singleClickEdit: true,
          suppressRowClickSelection: true,
          pagination: true,
          paginationPageSize: 10,
          paginationPageSizeSelector: false,
          overlayNoRowsTemplate: '표시할 값이 없습니다.',
          defaultColDef: {
            suppressMovable: true,
            resizable: false,
            sortable: false,
            cellStyle: { textAlign: "center" },
          },
        },
        statusFacAry: []
    }
  },
  async mounted(){
    await this.facStatus();
    await this.updateList();
    await this.statusFac();

  },
  methods:{
    //조회
    async facStatus() {
      await axios.get('/api/fac/facStatus')
        .then(res => {
          console.log(res.data)
          this.rowData = res.data;
        })
         .catch(err => {
            console.error("설비 상태 조회 실패", err);
        });
    },
    async updateList(){
      if (!this.rowData.length || !this.rowData[0]) {
        console.warn("설비 상태 정보가 없습니다.");
        return;
      }
      await axios.put('/api/fac/updateList', {
          facCode: this.rowData[0].fac_code,
          facStatus: this.rowData[0].fac_status
    });
       await this.facStatus(); 
    },
    async statusFac() {
      await axios.get('/api/fac/statusFac')
        .then(res => {
          console.log(res.data);
          this.statusFacAry = res.data;
          this.statusFacAry = [...res.data];
        })
        .catch(err => console.log(err));
    },

  }
}
</script>

<style scoped>
.btn-primary {
      background-color: rgb(230, 171, 98);
      border-color: rgb(230, 171, 98);
  }

::v-deep(.ag-theme-alpine .ag-header-cell-label) {
      justify-content: center;
  }
</style>