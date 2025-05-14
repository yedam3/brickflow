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
          <input type="text" class="form-control" v-model="rowData.model_name" />
        </div>
        <div class="col-md-4">
          <label class="form-label">설비위치</label>
          <input type="text" class="form-control" v-model="rowData.fac_location" />
        </div>

        <div class="col-md-4">
          <label class="form-label">담당자</label>
          <input type="text" class="form-control" v-model="rowData.employee_name" readonly/>
        </div>
        <div class="col-md-4">
          <label class="form-label">설치일자</label>
          <input type="date" class="form-control" v-model="rowData.install_date" />
        </div>
        <div class="col-md-4">
          <label class="form-label">점검주기</label>
          <input type="number" class="form-control" v-model="rowData.inspection_cycle"  />
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
          <input type="file" name="image" class="form-control" @change="onImageChange" ref="fileInput" />
        </div>
        <div class="col-md-4" v-if="rowData.imagePreview">
          <label class="form-label d-block">미리보기</label>
          <img :src="rowData.imagePreview || getImageUrl(rowData.image)" alt="설비 이미지" class="img-thumbnail" style="width: 400px; height: 300px;" />
          <small class="text-muted d-block mt-2" style="font-size: small;">파일명: {{ rowData.image }}</small>
        </div>
      </div>
      <div class="d-flex justify-content-end mt-4 gap-3">
        <Button label="초기화" severity="secondary" @click="clearForm" />
        <Button label="등록" severity="info" @click="addFac" />
        <Button label="수정" severity="warning" @click="updateFac "/>
        <Button label="삭제" severity="danger" @click="deleteFac" />
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
  import { useUserStore } from '@/stores/user';
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
          employee_code: useUserStore().id,
          employee_name: useUserStore().empName,
          fac_pattern:"",
          install_date:"",
          inspection_cycle:"",
          image:"",
          imagePreview: "",
          fac_status:"",
        },
        imageFile: null,
        //배열
        rowData2:[{
          fac_code: "",
          model_name:"",
          fac_location:"",
          employee_code: useUserStore().id,
          employee_name: useUserStore().empName,
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
          { field: "employee_code", headerName: "담당자", flex:3 ,
            valueFormatter: (params) => {
            return params.data?.employee_name || params.value;
          }
          },
          { field: "fac_pattern", headerName: "설비유형", flex:3 , 
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
        facStatusAry: [],
        facPatternAry:[]
        
      }  
    },
    mounted(){
      this.autoFacCode();
      this.facList();
      this.facPattern();
      this.statusFac();
    },
    methods: {
      //설비 카운트
      async autoFacCode(){
        const result = await axios.get("/api/fac/autoFacCode");
        this.rowData.fac_code = result.data[0].fac_code;
      },
      //값 초기화
      clearForm() {
        this.rowData = {
          fac_code: "",
          model_name: "",
          fac_location: "",
          employee_code: useUserStore().id,
          employee_name: useUserStore().empName,
          fac_pattern: "",
          install_date: "",
          inspection_cycle: "",
          image: "",
          fac_status: "",
          imagePreview: ""
        };
        this.imageFile = null;
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = '';
        }
        this.autoFacCode();
      },
      //조회
      async facList(){
        await axios.get('/api/fac/facList')
        .then(res => {
          console.log(res.data)
          this.rowData2 = res.data;
        })
      },
      //설비유형
      async facPattern() {
        await axios.get('/api/fac/facPattern')
        .then(res => {
          this.facPatternAry = res.data;
          this.facPatternAry = [...res.data];
        })
        .catch(err => console.log(err));
      },
      //설비상태
      async statusFac() {
        await axios.get('/api/fac/statusFac')
          .then(res => {
            this.facStatusAry = res.data;
            this.facStatusAry = [...res.data];
          })
          .catch(err => console.log(err));
        },
        //선택
        clicked(event) {
          const selected = event.data;

          // 기본 정보 바인딩
          this.rowData = { ...selected };

          // 이미지 미리보기 URL 세팅
          if (selected.image) {
            this.rowData.imagePreview = this.getImageUrl(selected.image);
          } else {
            this.rowData.imagePreview = "";
          }

          // 이전에 선택된 파일 제거
          this.imageFile = null;
          },
      //등록
      async addFac() {
        const fileName = await this.uploadImage();
        if (fileName) {
          this.rowData.image = fileName;
        }

        const res = await axios.post('/api/fac/addFac', {
          facCode: {
            ...this.rowData,
            employee_code: useUserStore().id, // 코드로 DB에 저장
            
          }
          
        }).catch(error => {
          console.error("등록 실패:", error);
          Swal.fire("등록 실패", "설비 등록 중 오류가 발생했습니다.", "error");
          return null;
        });

        if (res && res.data && res.data.affectedRows > 0) {
          Swal.fire("등록성공", "정상적으로 등록되었습니다.", "success")
            .then(() => {
              this.facList();
              this.autoFacCode();
            });
          this.rowData = {
            fac_code: "",
            model_name: "",
            fac_location: "",
            employee_code: useUserStore().id,
            employee_name: useUserStore().empName,
            fac_pattern: "",
            install_date: "",
            inspection_cycle: "",
            image: "",
            fac_status: "",
            imagePreview: ""
          };
          this.imageFile = null;
          if (this.$refs.fileInput) {
            this.$refs.fileInput.value = ''; // 실제 input[type="file"]의 값을 비움
          }
        } else if (res) {
          Swal.fire("등록 실패", "등록이 실패하였습니다.", "error");
        }
      },
      //이미지 업로드 함수
      async uploadImage() {
        if (!this.imageFile) return null;

        const formData = new FormData();
        formData.append("image", this.imageFile);

        const res = await axios.post("http://localhost:8099/api/fac/uploadImage", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        }).catch(err => {
          console.error("이미지 업로드 실패:", err);
          Swal.fire("업로드 실패", "이미지 업로드 중 오류가 발생했습니다.", "error");
          return null;
        });

        if (res && res.data && res.data.fileName) {
          return res.data.fileName;
        }

        return null;
      },
      //수정
      async updateFac() {
        if (!this.rowData.fac_code) {
          Swal.fire("수정 불가", "수정할 설비를 선택하세요.", "warning");
          return;
        }

        if ( !this.rowData.fac_pattern || !this.rowData.fac_status) {
          Swal.fire("입력 오류", "필수 항목을 모두 입력해주세요.", "warning");
          return;
        }

        const fileName = await this.uploadImage();
        if (fileName) {
          this.rowData.image = fileName;
        }

        axios.put('/api/fac/updateFac', this.rowData)
          .then(res => {
          if (res && res.data && res.data.result == true ) {
              Swal.fire("수정 완료", "설비 정보가 수정되었습니다.", "success")
                .then(() => {
                  this.facList();
                  this.autoFacCode();
                  this.clearForm();
                });
            } else {
              Swal.fire("수정 실패", "설비 수정에 실패했습니다.", "error");
            }
          })
          .catch(error => {
            console.error("수정 실패:", error);
            Swal.fire("오류 발생", "설비 수정 중 오류가 발생했습니다.", "error");
          });
      },
      // 이미지
    getImageUrl(fileName) {
      if (!fileName) return '';
      if (fileName.startsWith("data:image")) return fileName;
      return `http://localhost:3000/uploads/facImages/${fileName}`; // 또는 환경 변수 사용
    },
    onImageChange(event) {
        const file = event.target.files[0];
        if (!file) return;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/jpg'];

        if (!allowedTypes.includes(file.type)) {
          Swal.fire("업로드 불가", "이미지 파일만 등록 가능합니다. (jpg, png, svg)", "warning");
          this.$refs.fileInput.value = ''; 
          return;
        }
        this.imageFile = file;
        const reader = new FileReader();
        reader.onload = e => {
          this.rowData.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      },
      //삭제
      async deleteFac() {
        if (!this.rowData.fac_code) {
          Swal.fire("삭제 불가", "삭제할 설비를 선택하세요.", "warning");
          return;
        }

        Swal.fire({
          title: "정말 삭제하시겠습니까?",
          text: `설비 코드: ${this.rowData.fac_code}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "삭제",
          cancelButtonText: "취소"
        }).then((confirm) => {
          if (confirm.isConfirmed) {
            axios.delete(`/api/fac/delFac/${this.rowData.fac_code}`)
              .then((res) => {
                if (res && res.data && res.data.affectedRows > 0) {
                  Swal.fire("삭제 완료", "설비 정보가 삭제되었습니다.", "success")
                    .then(() => {
                      this.facList();
                      this.clearForm();
                    });
                } else {
                  Swal.fire("삭제 실패", "설비 삭제에 실패했습니다.", "error");
                }
              })
              .catch((error) => {
                console.error("삭제 오류:", error);
                Swal.fire("오류 발생", "삭제 중 오류가 발생했습니다.", "error");
              });
          }
        });
      }
  },

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
.img-thumbnail {
  border-radius: 8px;
  object-fit: cover;
}
</style>