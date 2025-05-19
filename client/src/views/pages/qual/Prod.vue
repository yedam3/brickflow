<template>
  <div class="card border-0" style="height: calc(50vh - 5rem);">
    <h3>공통 관리</h3>
    <div class="heading-with-line mb-3">
      <h5 class="m-0 me-3">제품 등록</h5>
    </div>

    <div class="row g-3">
      <div class="col-md-4">
        <label class="form-label">제품코드</label>
        <input type="text" class="form-control" v-model="rowData.prod_code" />
      </div>
      <div class="col-md-4">
        <label class="form-label">제품명</label>
        <input type="text" class="form-control" v-model="rowData.prod_name" />
      </div>
      <div class="col-md-4">
        <label class="form-label">단위</label>
        <input type="text" class="form-control" v-model="rowData.unit" />
      </div>
      <div class="col-md-4">
        <label class="form-label">무게</label>
        <input type="text" class="form-control" v-model="rowData.weight" />
      </div>
      <div class="col-md-4">
        <label class="form-label">크기</label>
        <input type="text" class="form-control" v-model="rowData.size" />
      </div>
      <div class="col-md-4">
        <label class="form-label">단위별 수량</label>
        <input type="text" class="form-control" v-model="rowData.by_unit_number" />
      </div>
      <div class="col-md-4">
        <label class="form-label">적정재고</label>
        <input type="number" class="form-control" min="0" v-model="rowData.proper_store" @keydown="allowOnlyNumber" />
      </div>
    </div>
    <div class="d-flex justify-content-end mt-4 gap-3">
      <Button label="초기화" severity="secondary" class="me-3" @click="Allrest" />
      <Button label="등록" severity="info" class="me-3" @click="addprod" />
      <Button label="수정" severity="warning" class="me-3" @click="updateprod" />
      <Button label="삭제" severity="danger" class="me-3" @click="deleteProd" />
    </div>
  </div>
  <div class="card border-0" style="height: calc(50vh - 5rem);">
    <div class="heading-with-line mb-3">
      <h5 class="m-0 me-3">제품 목록</h5>
    </div>
    <ag-grid-vue class="ag-theme-alpine custom-grid-theme" style="width: 100%; 
    height: 300px;" :columnDefs="columnDefs" :rowData="rowData2" :gridOptions="gridOptions" @rowClicked="clicked" />
  </div>

  <!-- 그리드 -->


</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import axios from "axios";
import Swal from 'sweetalert2';

export default {
  components: {
    AgGridVue,
    Swal,
  },
  data() {
    return {
      rowData: {
        prod_code: ""
        , prod_name: ""
        , unit: ""
        , by_unit_number: ""
        , proper_store: ""
        , size: ""
        , weight: ""
      },
      rowData2: [{
        prod_code: "",
        prod_name: "",
        unit: "",
        by_unit_number: "",
        size: "",
        weight: "",
        proper_store: ""
      }],
      columnDefs: [
        { field: "prod_code", headerName: "제품코드", flex: 3, },
        { field: "prod_name", headerName: "제품명", flex: 3, },
        { field: "unit", headerName: "단위", flex: 3, },
        { field: "by_unit_number", headerName: "단위별 수량", flex: 3, },
        { field: "size", headerName: "크기", flex: 3, },
        { field: "weight", headerName: "무게", flex: 3, },
        { field: "proper_store", headerName: "적정 재고", flex: 3, }
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
      },
    }
  },
  mounted() {
    this.prodList();
    this.autoProdCode();

  },
  methods: {


    //rowData 초기화
    Allrest() {
      this.rowData = {
        prod_code: ""
        , prod_name: ""
        , unit: ""
        , by_unit_number: ""
        , proper_store: ""
        , size: ""
        , weight: ""
      }
    },
    //행클릭
    clicked(event) {
      console.log('클릭된 행 데이터:', event.data); // 클릭된 행 데이터 출력
      this.rowData = event.data; // 클릭된 행 데이터를 폼에 반영
    },
    //제품
    async autoProdCode() {
      axios.get("/api/admin/autoProdCode")
        .then(result => {
          const data = result.data;
          this.rowData = data;
        })
        .catch(error => {
          console.error("prod_code 요류 요청:", error);
        });
    },

    // allowOnlyNumber(event) {
    //   const allowedKeys = [
    //     'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'
    //   ];
    //   const isNumberKey = event.key >= '0' && event.key <= '9';

    //   if (!isNumberKey && !allowedKeys.includes(event.key)) {
    //     event.preventDefault();
    //   }
    // },
    //조회
    async prodList() {
      await axios.get('/api/admin/Prod')
        .then(res => {
          console.log(res.data)
          this.rowData2 = res.data;
        })
    },
    
    //등록
    async addprod() {
      const check = await axios.get(`/api/admin/prodCheck/${this.rowData.prod_code}`).catch((err) => console.log(err));
      if (check.data[0].inputCount > 0) {
        Swal.fire("등록 실패", "이미 등록된 제품 코드입니다.", "error");
        return;
      }
      if (this.rowData.prod_code == '' || !this.rowData.prod_name || !this.rowData.unit
        || !this.rowData.by_unit_number || !this.rowData.size || !this.rowData.weight
        || !this.rowData.proper_store
      ) {
        Swal.fire("등록 실패", "값을 입력해주세요.", "error");
        return;
      }
      console.log("등록 요청 데이터:", this.rowData); // 이걸 확인하세요.
      const res = await axios.post('/api/admin/prodinput', this.rowData)
        .catch(error => {
          console.error("등록 실패:", error);
          this.autoProdCode();
          Swal.fire("등록 실패", "제품 등록 중 오류가 발생했습니다.", "error");
          return null;
        });
      if (res && res.data && res.data.affectedRows > 0) {
        Swal.fire("등록성공", "정상적으로 등록되었습니다.", "success")
          .then(() => {
            this.prodList();
            this.Allrest();
            this.autoProdCode();
          });
      } else if (res) {
        Swal.fire("등록 실패", "값을 다 입력해주세요", "error");
      }
      this.rowData[{
          prod_code: ""
        , prod_name: ""
        , unit: ""
        , by_unit_number: ""
        , proper_store: ""
        , size: ""
        , weight: ""
      }]
    },
    //수정
    async updateprod() {
      axios.put('/api/admin/updateProd', {
        prod: this.rowData
      })
        .then(res => {
          if (res && res.data && res.data.affectedRows > 0) {
            Swal.fire("수정 완료", "제품정보가 수정되었습니다.", "success")
              .then(() => {
                this.prodList();
                this.Allrest();
                this.autoProdCode();
              });
          } else {
            Swal.fire("수정 실패", "제품정보 수정에 실패했습니다.", "error");
          }
        })
        .catch(error => {
          console.error("수정 실패:", error);
          Swal.fire("오류 발생", "제품정보 수정 중 오류가 발생했습니다.", "error");
        });
      this.rowData[{
          prod_code: ""
        , prod_name: ""
        , unit: ""
        , by_unit_number: ""
        , proper_store: ""
        , size: ""
        , weight: ""
      }]
    },
    // 삭제
    async deleteProd() {
      if (!this.rowData.prod_code) {
        Swal.fire("삭제불가", "삭제할 제품을 선택하세요", "warning");
        return;
      }
      Swal.fire({
        title: "정말 삭제하시겠습니까?",
        text: `제품 코드: ${this.rowData.prod_code}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "삭제",
        cancelButtonText: "취소"
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`/api/admin/resetProd/${this.rowData.prod_code}`)
            .then((res) => {
              if (res && res.data && res.data.affectedRows > 0) {
                Swal.fire("삭제 완료", "자재정보가 삭제되었습니다.", "success")
                  .then(() => {
                    this.Allrest();
                    this.prodList();
                  });
              } else {
                Swal.fire("삭제 실패", "자재 삭제에 실패했습니다.", "error");
              }
            })
            .catch((error) => {
              console.error("삭제 오류:", error);
              Swal.fire("오류 발생", "삭제 중 오류가 발생했습니다.", "error");
            });
        }
      })
      this.rowData[{
        prod_code: ""
        , prod_name: ""
        , unit: ""
        , by_unit_number: ""
        , proper_store: ""
        , size: ""
        , weight: ""
      }]
    },
  }
}
</script>
<style scoped>
/* 헤더 텍스트 가운데 정렬 */
::v-deep(.ag-theme-alpine .ag-header-cell-label) {
  justify-content: center;
}

/* headerClass로 설정한 header-center 클래스에 적용 */
::v-deep(.header-center .ag-header-cell-label) {
  justify-content: center;
}

.btn-primary {
  background-color: rgb(230, 171, 98);
  border-color: rgb(230, 171, 98);
}

::v-deep(.ag-theme-alpine .ag-header-cell-label) {
  justify-content: center;
}
</style>