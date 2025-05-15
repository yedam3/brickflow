<template>
  <div class="ag-theme-alpine p-4" style="background-color: white; min-height: 800px;">
    <div class="card shadow-sm mb-4 p-4">
      <h5 class="mb-4">자재 등록</h5>
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">자재코드</label>
          <input type="text" class="form-control" v-model="rowData.mat_code" readonly />
        </div>
        <div class="col-md-4">
          <label class="form-label">자재명</label>
          <input type="text" class="form-control"  v-model="rowData.mat_name" />
        </div>
        <div class="col-md-4">
          <label class="form-label">단위</label>
          <input type="text" class="form-control"  v-model="rowData.unit" />
        </div>
        <div class="col-md-4">
          <label class="form-label">크기</label>
          <input type="text" class="form-control"  v-model="rowData.size" />
        </div>
        <div class="col-md-4">
          <label class="form-label">색상</label>
          <input type="text" class="form-control"  v-model="rowData.color" />
        </div>
        <div class="col-md-4">
          <label class="form-label">재질</label>
          <input type="text" class="form-control"  v-model="rowData.texture" />
        </div>
        <div class="col-md-4">
          <label class="form-label">모양</label>
          <input type="text" class="form-control"  v-model="rowData.shape" />
        </div>
        <div class="col-md-4">
          <label class="form-label">안전재고</label>
          <input type="number" class="form-control"  v-model="rowData.safe_inventory" min="0"  @keydown="allowOnlyNumber"/>
        </div>
        </div>
      <div class="d-flex justify-content-end mt-4 gap-3">
        <Button label="초기화" severity="secondary" @click="clearForm" />
        <Button label="등록" severity="info" @click="addMat" />
        <Button label="수정" severity="warning" />
        <Button label="삭제" severity="danger"  />
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
  import axios from "axios";
  import Swal from "sweetalert2";
  export default {
    components:{
      AgGridVue,
    },
    data(){
      return {
        rowData:{
          mat_code:"",
          mat_name:"",
          unit: "",
          size: "",
          color: "",
          texture: "",
          shape: "",
          safe_inventory:""
        },
        rowData2:[{
          mat_code:"",
          mat_name:"",
          unit: "",
          size: "",
          color: "",
          texture: "",
          shape: "",
          safe_inventory:""
        }],
        columnDefs: [
          {field: "mat_code", headerName: "자재코드", flex:3,},
          {field: "mat_name", headerName: "자재명", flex:3,},
          {field: "unit", headerName: "단위", flex:3,},
          {field: "size", headerName: "크기", flex:3,},
          {field: "color", headerName: "색상", flex:3,},
          {field: "texture", headerName: "재질", flex:3,},
          {field: "shape", headerName: "모양", flex:3,},
          {field: "safe_inventory", headerName: "안전 재고", flex:3,}
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
          }
        }
      }
    },
    mounted(){
      this.matList();
      this.autoMatCode();
    },
    methods: {
      allowOnlyNumber(event) {
        const allowedKeys = [
          'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'
        ];
        const isNumberKey = event.key >= '0' && event.key <= '9';

        if (!isNumberKey && !allowedKeys.includes(event.key)) {
          event.preventDefault();
        }
      },
      //자재 카운트
      async autoMatCode(){
        const result = await axios.get("/api/admin/autoMatCode");
        this.rowData.mat_code = result.data[0].mat_code;
      },
      clearForm(){
        this.rowData = {
          mat_code:"",
          mat_name:"",
          unit: "",
          size: "",
          color: "",
          texture: "",
          shape: "",
          safe_inventory:""
        };
      },
      //조회
      async matList(){
        await axios.get('/api/admin/mat')
        .then(res => {
          console.log(res.data)
          this.rowData2 = res.data;
        })
      },
      //등록
      async addMat() {
        const res = await axios.post('/api/admin/mat', {
          matCode: {
            ...this.rowData
          }
        }).catch(error => {
          console.error("등록 실패:", error);
          Swal.fire("등록 실패", "자재 등록 중 오류가 발생했습니다.", "error");
          return null;
        });
        if (res && res.data && res.data.affectedRows > 0) {
          Swal.fire("등록성공", "정상적으로 등록되었습니다.", "success")
            .then(() => {
              this.matList();
              this.autoMatCode();
              this.clearForm();
            });
        } else if (res) {
          Swal.fire("등록 실패", "등록이 실패하였습니다.", "error");
        }
      },
      //수정
      async updateMat() {
        axios.put('/api/admin/updateMat', this.rowData)
          .then(res => {
            if (res && res.data && res.data.result == true) {
              Swal.fire("수정 완료", "자재정보가 수정되었습니다.", "success")
                .then(() => {
                  this.matList();
                  this.autoFacCode();
                  this.clearForm();
                });
            } else {
              Swal.fire("수정 실패", "자재정보 수정에 실패했습니다.", "error");
            }
        })
          .catch(error => {
            console.error("수정 실패:", error);
            Swal.fire("오류 발생", "자재정보 수정 중 오류가 발생했습니다.", "error");
          });
      },
      //삭제
    }
  }
</script>