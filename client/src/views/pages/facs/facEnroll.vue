<template>
  <div class="ag-theme-alpine p-4" style="background-color: white; min-height: 800px;">
    <div class="card shadow-sm mb-4 p-4">
      <h5 class="mb-4">설비 등록</h5>
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">설비코드</label>
          <input type="text" class="form-control" v-model="rowData.fac_code" readonly />
        </div>
        <div class="col-md-4">
          <label class="form-label">설비이름</label>
          <input type="text" class="form-control" v-model="rowData.model_name" readonly />
        </div>
        <div class="col-md-4">
          <label class="form-label">설비위치</label>
          <input type="text" class="form-control" v-model="rowData.fac_location" />
        </div>

        <div class="col-md-4">
          <label class="form-label">담당자</label>
          <input type="text" class="form-control" v-model="rowData.employee_code" />
        </div>
        <div class="col-md-4">
          <label class="form-label">설치일자</label>
          <input type="text" class="form-control" v-model="rowData.install_date" />
        </div>
        <div class="col-md-4">
          <label class="form-label">점검주기</label>
          <input type="date" class="form-control" v-model="rowData.inspection_cycle" readonly />
        </div>
        <div class="col-md-4">
          <label class="form-label">설비유형</label>
          <select v-model="rowData.fac_pattern" class="form-select">
            <option disabled value="">설비유형</option>
            <option v-for="facPat in facPatternAry" :key="facPat.fac_pattern" :value="facPat.fac_pattern">
              {{ facPat.sub_code_name }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">설비상태</label>
          <select v-model="rowData.fac_status" class="form-select">
            <option disabled value="">설비상태</option>
            <option v-for="facSt in facStatusAry" :key="facSt.fac_status" :value="facSt.fac_status">
              {{ facSt.sub_code_name }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">설비 이미지 업로드</label>
          <input type="file" class="form-control" @change="onImageChange" accept="image/*" />
        </div>
        <div class="col-md-4" v-if="rowData.image">
          <label class="form-label d-block">미리보기</label>
          <img :src="rowData.image" alt="설비 이미지" class="img-thumbnail" style="max-height: 120px;" />
        </div>
      </div>
      <div class="d-flex justify-content-end mt-4 gap-3">
        <Button label="등록" severity="info" @click="addFac" />
        <Button label="수정" severity="warning" />
        <Button label="삭제" severity="danger" />
      </div>
    </div>
    <!-- 그리드 -->
    <ag-grid-vue
      class="ag-theme-alpine custom-grid-theme"
      style="width: 100%; height: 300px;"
      :columnDefs="columnDefs"
      :rowData="rowData2"
      :gridOptions="gridOptions"
      @rowClicked="clicked"
    />
  </div>
</template>

<script>
  import { AgGridVue } from "ag-grid-vue3";
  import DatePickerEditor from "../../../components/DatePickerEditor.vue";
  import axios from "axios";
  import Swal from "sweetalert2";
  export default {
    components:{
      AgGridVue,
      datePicker: DatePickerEditor,
    },
    data(){
      return {
        rowData:{
          fac_code: "",
          model_name:"",
          fac_location:"",
          employee_code:"",
          fac_pattern:"",
          install_date:"",
          inspection_cycle:"",
          image:"",
          fac_status:"",
        },
        //배열
        rowData2:[{
          fac_code: "",
          model_name:"",
          fac_location:"",
          employee_code:"",
          fac_pattern:"",
          install_date:"",
          inspection_cycle:"",
          image:"",
          fac_status:"",
        }],
        columnDefs: [
          { field: "fac_code", headerName: "설비코드", flex:3 ,},
          { field: "model_name", headerName: "설비이름", flex:3 ,},
          { field: "fac_location", headerName: "설비 위치", flex:3 ,},
          { field: "employee_code", headerName: "담당자", flex:3 ,},
          { field: "fac_pattern", headerName: "설비유형", flex:3 ,},
          { field: "install_date", headerName: "설치일자", flex:3 ,},
          { field: "inspection_cycle", headerName: "점검주기", flex:3 ,},
          { field: "image", headerName: "이미지", flex:3 ,},
          { field: "fac_status", headerName: "설비상태", flex:3 ,
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
            }}
        ],
        gridOptions: {
          domLayout: "autoHeight",
          singleClickEdit: true,
          suppressRowClickSelection: true,
          pagination: true,
          paginationPageSize: 5,
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
    mounted(){
      this.facList()
    },
    methods: {
      async facList(){
        await axios.get('/api/fac/facList')
        .then(res => {
          console.log(res.data)
          this.rowData2 = res.data;
        })
      },
      onImageChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
          this.rowData.image = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }
</script>

<style scoped>
.img-thumbnail {
  border-radius: 8px;
  object-fit: cover;
}
</style>
