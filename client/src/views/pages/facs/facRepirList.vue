<template>
  <div class="card border-0" style="background-color: white; height: 800px; ">
    <div class="d-flex justify-content-start">
      <h3>수리내역</h3>
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
  import { useUserStore } from '@/stores/user';
  export default {
    components: {
      AgGridVue,
      datePicker: DatePickerEditor,
    },
    data(){
      return{ 
        rowData:[
          {
            repaire_code: "",
            employee_code: useUserStore().empName,
            employee_name: useUserStore().id,
            repaire_add_date:"",
            repaire_finish_date:"",
            fac_code:"",
            fac_result:"",
            break_status:"",
            unplay_code:"",
            note:"",
            fac_history:""
          }
        ],
        columnDefs:[
        { field:"repaire_code", headerName: "설비수리코드", flex: 2,  },
        { field:"employee_code", headerName: "담당자", flex: 2, 
          valueFormatter: (params) => {
            return params.data?.employee_name || params.value;
          }
        },
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
        { field:"unplay_code", headerName: "비가동코드", flex: 2,  
        valueFormatter: (params) => {
    return params.value || '[없음]';
  }
        },
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
            console.log(res.data);
            this.rowData = Array.isArray(res.data) ? res.data : [res.data];
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
