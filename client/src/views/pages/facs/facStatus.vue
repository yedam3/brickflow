<template>
  <div class="card border-0" style="background-color: white; height: 800px; ">
    <div class="d-flex justify-content-start">
      <h3>설비상태</h3>
      <div class="input-group mb-5" style="width: 65%;">
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
  import { useUserStore } from '@/stores/user';
  export default {
    components: {
        AgGridVue,
        datePicker: DatePickerEditor,
  },
  data() {
    return{
      rowData:[
        {
          fac_code: "",
          model_name:"",
          fac_location:"",
          fac_pattern:"",
          employee_code: useUserStore().id,
          employee_name: useUserStore().empName,
          fac_status:"",
        }
      ],
      columnDefs:[
        { field:"fac_code", headerName: "설비코드", flex: 2,  },
        { field:"model_name", headerName: "설비이름", flex: 2 },
        { field:"fac_location", headerName: "설비위치", flex: 2 },
        { field:"fac_pattern", headerName: "설비유형", flex: 2 ,
        valueFormatter: (params) => {
                        if (params.value == 'FC1') {
                            return params.value = '사출 성형기';
                        } else if (params.value == 'FC2') {
                            return params.value = '자동 조립 장비';
                        } else if (params.value == 'FC3') {
                            return params.value = '도장';
                        } else if (params.value == 'FC4') {
                            return params.value = '포장 설비';
                        } else if (params.value == 'FC5') {
                            return params.value = '품질 검사 설비';
                        } else if (params.value == 'FC6') {
                            return params.value = '물류 운반 설비';
                        } else if (params.value == 'FC7') {
                            return params.value = '정밀 금형 관리';
                        }
                    }
        },
        { field:"employee_code", headerName: "담당자", flex: 2 ,
          valueFormatter: (params) => {
            return params.data?.employee_name || params.value;
          }
        },
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
        statusFacAry: [],
        facPatternAry: []
    }
  },
  mounted(){
    this.facStatus();
    this.updateList();
    this.statusFac();
    this.facPattern();

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
    async facPattern() {
            await axios.get('/api/fac/facPattern')
                .then(res => {
                    this.facPatternAry = res.data;
                    this.facPatternAry = [...res.data];
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