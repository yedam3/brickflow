<template>
  <div class="card border-0" style="height: calc(50vh - 5rem)">
    <h2>공통 관리</h2>

    <div class="heading-with-line mb-3">
      <h5 class="m-0 me-3">자재 등록</h5>
    </div>
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">자재코드</label>
          <input type="text" class="form-control" v-model="rowData.mat_code" readonly />
        </div>
        <div class="col-md-4">
          <label class="form-label">자재명</label>
          <input type="text" class="form-control" v-model="rowData.mat_name" />
        </div>
        <div class="col-md-4">
          <label class="form-label">단위</label>
          <input type="text" class="form-control" v-model="rowData.unit" />
        </div>
        <div class="col-md-4">
          <label class="form-label">크기</label>
          <input type="text" class="form-control" v-model="rowData.size" />
        </div>
        <div class="col-md-4">
          <label class="form-label">색상</label>
          <input type="text" class="form-control" v-model="rowData.color" />
        </div>
        <div class="col-md-4">
          <label class="form-label">재질</label>
          <input type="text" class="form-control" v-model="rowData.texture" />
        </div>
        <div class="col-md-4">
          <label class="form-label">모양</label>
          <input type="text" class="form-control" v-model="rowData.shape" />
        </div>
        <div class="col-md-4">
          <label class="form-label">안전재고</label>
          <input type="number" class="form-control" v-model="rowData.safe_inventory" min="0"  @keydown="allowOnlyNumber"/>
        </div>
        </div>
      <div class="d-flex justify-content-end mt-4 gap-3">
        <Button label="초기화" severity="secondary" @click="clearForm" />
        <Button label="등록" severity="info" @click="addMat" />
        <Button label="수정" severity="warning" @click="updateMat"/>
        <Button label="삭제" severity="danger" @click="deleteMat" />
      </div>
    </div>
    <div class="card border-0" style="height: calc(50vh - 5rem)">
      <div class="heading-with-line mb-3">
      <h5 class="m-0 me-3">자재 목록</h5>
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
      this.autoMatCode();
      this.matList();
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
      //행클릭
      clicked(event) {
        console.log('클릭된 행 데이터:', event.data); // 클릭된 행 데이터 출력
        this.rowData = event.data; // 클릭된 행 데이터를 폼에 반영
      },
      //자재 카운트
      async autoMatCode() {
        axios.get("/api/admin/autoMatCode")
          .then(result => {

            const data = result.data;
            // 응답이 배열이고, 그 안에 mat_code가 있으면 세팅
            this.rowData = data;
          })
          .catch(error => {
            console.error("mat_code 요청 오류:", error);
          });
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
        this.autoMatCode();
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

            if (!this.rowData.mat_name) {
                Swal.fire("입력 오류", "자재명을 선택해주세요.", "warning");
                return;
            }
            if (!this.rowData.unit) {
                Swal.fire("입력 오류", "단위을 선택해주세요.", "warning");
                return;
            }
            if (!this.rowData.size) {
                Swal.fire("입력 오류", "크기를 선택해주세요.", "warning");
                return;
            }

            if (!this.rowData.color) {
                Swal.fire("입력 오류", "색상을 입력해주세요.", "warning");
                return;
            }

            if (!this.rowData.texture) {
                Swal.fire("입력 오류", "재질을 입력해주세요.", "warning");
                return;
            }
            if (!this.rowData.shape) {
                Swal.fire("입력 오류", "모양을 입력해주세요.", "warning");
                return;
            }
            if (!this.rowData.safe_inventory) {
                Swal.fire("입력 오류", "안전재고를 입력해주세요.", "warning");
                return;
            }

        console.log('프론트에서 보내는 mat_code:', this.rowData.mat_code);
        const res = await axios.post('/api/admin/addMat', this.rowData)
        .catch(error => {
          console.error("등록 실패:", error);
          this.autoMatCode(); // 중복 에러 발생 시 새 코드 요청
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
        
        axios.put('/api/admin/updateMat', {
          mat: this.rowData

        })
          .then(res => {
            if (res && res.data && res.data.affectedRows > 0) {
              Swal.fire("수정 완료", "자재정보가 수정되었습니다.", "success")
                .then(() => {
                  this.matList();
                  this.autoMatCode();
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
      async deleteMat() {
        if (!this.rowData.mat_code) {
          Swal.fire("삭제 불가", "삭제할 자재를 선택하세요.", "warning");
          return;
        }
        Swal.fire({
          title: "정말 삭제하시겠습니까?",
          text: `자재 코드: ${this.rowData.mat_code}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "삭제",
          cancelButtonText: "취소"
        }).then((confirm) => {
          if (confirm.isConfirmed) {
            axios.delete(`/api/admin/delMat/${this.rowData.mat_code}`)
            .then((res) => {
              if (res && res.data && res.data.affectedRows > 0) {
                  Swal.fire("삭제 완료", "자재정보가 삭제되었습니다.", "success")
                    .then(() => {
                      this.clearForm();
                      this.matList();
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