<template>
  <div class="card border-0" style="background-color: white; height: 800px; ">
    <div class="d-flex justify-content-start">
      <div class="input-group mb-5" style="width: 65%;">
        <!-- 검색 조건 선택 -->
        <select v-model="searchType" class="form-select" aria-label="Default select example">
          <option value="" disabled style="color: gray;">전체</option>
          <option v-for="reFac in resultFacAry" :key="reFac.fac_result"
            :value="reFac.fac_result">{{ reFac.sub_code_name }}</option>
        </select>
        <!-- 검색어 입력 -->
        <input type="text" v-model="searchText" placeholder="검색어 입력" class="form-control w-50" style="width: 100%"
          @keydown.enter="repaireFac" />
        <!-- 검색 버튼 -->
        <button @click="repaireFac" class="btn btn-primary">
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
    data(){
      return{ 
        rowData:[],
        columnDefs:[
        { field:"repaire_code", headerName: "설비수리코드", flex: 2,  },
        { field:"employee_code", headerName: "담당자", flex: 2,  },
        { field:"repaire_add_date", headerName: "수리등록일자", flex: 2,  },
        { field:"repaire_finish_date", headerName: "수리처리일자", flex: 2,  },
        { field:"fac_code", headerName: "설비코드", flex: 2,  },
        { field:"fac_result", headerName: "수리결과", flex: 2,  
          valueFormatter: (params) => {
            if (params.value === 'OH1') return '수리완료';
            if (params.value === 'OH2') return '수리불가';
            return params.value;
          }, 
          cellStyle: params => {
            if(params.value == "OH1"){
                return { color: '#22C55E', textAlign:'center', fontWeight: 'bold' };
              }else if(params.value == "OH2"){
                return { color: 'red', textAlign:'center', fontWeight: 'bold'};
              }
              return null;
          }},
        { field:"break_status", headerName: "고장증상", flex: 2,  },
        { field:"unplay_code", headerName: "비가동코드", flex: 2,  },
        { field:"note", headerName: "비고", flex: 2,  },
        { field:"fac_history", headerName: "수리내역", flex: 2,  },
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
        resultFacAry:[]
      }
    },
    mounted(){
      this.repaireFac();
      this.facResult();
    },
    methods: {
      //조회
      async repaireFac() {
        const params = {
          type: this.searchType,
          keyword: this.searchText
        };
        await axios.get('/api/fac/repList', { params })
          .then(res => {
            this.rowData = res.data;
          })
          .catch(err => console.error(err));
      },
    //수리결과
    async facResult() {
      await axios.get('/api/fac/facResult')
        .then(res => {
          this.resultFacAry = res.data;
        })
        .catch(err => console.error(err));
    }
  },
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
