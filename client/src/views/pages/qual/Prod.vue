<template>
  <div class="ag-theme-alpine p-4" style="background-color: white; min-height: 800px;">
    <div class="card shadow-sm mb-4 p-4">
      <h5 class="mb-4">제품 등록</h5>
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">제품코드</label>
          <input type="text" class="form-control" readonly />
        </div>
        <div class="col-md-4">
          <label class="form-label">제품명</label>
          <input type="text" class="form-control"  />
        </div>
        <div class="col-md-4">
          <label class="form-label">단위</label>
          <input type="text" class="form-control"  />
        </div>
        <div class="col-md-4">
          <label class="form-label">크기</label>
          <input type="text" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">색상</label>
          <input type="text" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">재질</label>
          <input type="text" class="form-control"   />
        </div>
        <div class="col-md-4">
          <label class="form-label">모양</label>
          <input type="text" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">안전재고</label>
          <input type="number" class="form-control" min="0"  @keydown="allowOnlyNumber"/>
        </div>
        <label class="form-label">제품 이미지 업로드</label>
          <input type="file" name="image" class="form-control" @change="onImageChange" ref="fileInput" accept="image/png, image/jpeg"/>
        </div>
      <div class="d-flex justify-content-end mt-4 gap-3">
        <Button label="초기화" severity="secondary" />
        <Button label="등록" severity="info" />
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
  export default {
    components:{
      AgGridVue,
    },
    data(){
      return {
        rowData:{
          prod_code:"",
          prod_name:"",
          unit: "",
          size: "",
          color: "",
          texture: "",
          shape: "",
          safe_inventory:""
        },
        rowData2:[{
          prod_code:"",
          prod_name:"",
          unit: "",
          size: "",
          color: "",
          texture: "",
          shape: "",
          safe_inventory:""
        }],
        columnDefs: [
          {field: "prod_code", headerName: "제품코드", flex:3,},
          {field: "prod_name", headerName: "제품명", flex:3,},
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
      //조회
      //등록
      async addprod() {
        const res = await axios.post('/api/admin/addProd', {
          prodCode: {
            ...this.rowData
          }
        }).catch(error => {
          console.error("등록 실패:", error);
          Swal.fire("등록 실패", "제품 등록 중 오류가 발생했습니다.", "error");
          return null;
        });
        if (res && res.data && res.data.affectedRows > 0) {
          Swal.fire("등록성공", "정상적으로 등록되었습니다.", "success")
            .then(() => {
            });
        } else if (res) {
          Swal.fire("등록 실패", "등록이 실패하였습니다.", "error");
        }
      },
    }
  }
</script>