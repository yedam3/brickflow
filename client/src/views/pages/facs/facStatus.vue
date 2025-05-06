<template>
  <div class="p-2 row" style="background-color: white; width: 220px; ">
    <h7>설비조회</h7>
    <div class="form-check form-check-inline col" style="font-size: 14px;">
      <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1">
      <label class="form-check-label" for="inlineRadio1">전체</label>
    </div>
    <div class="form-check form-check-inline col">
      <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">
      <label class="form-check-label" for="inlineRadio2">가동</label>
    </div>
    <div class="form-check form-check-inline col">
      <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option3">
      <label class="form-check-label" for="inlineRadio2">비가동</label>
    </div>
    <div class="col d-flex justify-content-end p-4" >
                    <Button label="조회" severity="success" class="" @click="facStatus"></Button>
                </div>
  </div>
  <br>
  <div class="col" style="margin-right: 50px; ">
            <div class="ag-wrapper d-flex justify-content-center">
                <ag-grid-vue class="ag-theme-alpine custom-grid-theme" style="width: 100%; height:  500px;"
                    :columnDefs="columnDefs" :rowData="rowData" :gridOptions="gridOptions"
                    @cellClicked="comCellClicked">
                </ag-grid-vue>
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
  mounted(){
    this.facStatus();
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
        cellStyle: params => {
              if(params.value == "가동"){
                return { color: '#22C55E', textAlign:'center', fontWeight: 'bold' };
              }else if(params.value == "비가동"){
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
    }
  },
  methods:{
    //조회
    async facStatus() {
      await axios.get('/api/fac/facStatus')
        .then(res => {
          console.log(res.data)
          this.rowData = res.data;
        })
    }
  },
}
</script>