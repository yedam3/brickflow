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
          <input type="text" class="form-control" v-model="rowData.employee_code" />
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
          <input type="file" name="image" class="form-control" @change="onImageChange" accept="image/*" />
        </div>
        <div class="col-md-4" v-if="rowData.imagePreview">
          <label class="form-label d-block">미리보기</label>
          <img :src="rowData.imagePreview || getImageUrl(rowData.image)" alt="설비 이미지" class="img-thumbnail" style="max-height: 120px;" />
        </div>
      </div>
      <div class="d-flex justify-content-end mt-4 gap-3">
        <Button label="등록" severity="info" @click="addFac" />
        <Button label="수정" severity="warning" @click="updateFac "/>
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
          imagePreview: "",
          fac_status:"",
        },
        imageFile: null,
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
              console.log(event.data);
              this.rowData = event.data;
          },
          //등록
          async addFac() {
    const submitFac = async () => {
      await axios.post('/api/fac/addFac', {
        facCode: this.rowData
      })
        .then(res => {
          if (res.data.affectedRows > 0) {
            Swal.fire({
              title: '등록성공',
              text: '정상적으로 등록이 완료되었습니다.',
              icon: 'success',
              confirmButtonText: '확인'
            }).then(() => {
              this.facList();
              this.autoFacCode();
            });
            this.rowData = {
              fac_code: "",
              model_name: "",
              fac_location: "",
              employee_code: "",
              fac_pattern: "",
              install_date: "",
              inspection_cycle: "",
              image: "",
              fac_status: ""
            };
            this.imageFile = null;
          } else {
            Swal.fire({
              title: '등록 실패',
              text: '등록이 실패하였습니다.',
              icon: 'error',
              confirmButtonText: '확인'
            });
          }
        })
        .catch(error => {
          console.error(error);
          Swal.fire({
            title: '등록 실패',
            text: '설비 등록 중 오류가 발생했습니다.',
            icon: 'error',
            confirmButtonText: '확인'
          });
        });
    };

    if (this.imageFile) {
      const formData = new FormData();
      formData.append("image", this.imageFile);

      axios.post("/api/fac/uploadImage", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(imgRes => {
          if (imgRes.data && imgRes.data.fileName) {
            this.rowData.image = imgRes.data.fileName; 
          }
          submitFac(); // 이미지 업로드 후 설비 등록
        })
        .catch(error => {
          console.error(error);
          Swal.fire({
            title: '업로드 실패',
            text: '이미지 업로드 중 오류가 발생했습니다.',
            icon: 'error',
            confirmButtonText: '확인'
          });
        });
    } else {
      submitFac(); // 이미지 없으면 바로 등록
    }
  },
      //수정
      updateFac() {
        // 이미지가 있는 경우 먼저 업로드
        if (this.imageFile) {
          const formData = new FormData();
          formData.append("image", this.imageFile);

          axios.post("/api/fac/uploadImage", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(imgRes => {
            if (imgRes.data && imgRes.data.filePath) {
                this.rowData.image = imgRes.data.filePath;
              }

              // 이미지 업로드 후 수정 요청
              return axios.put('/api/fac/updateFac', {
                facCode: this.rowData
              });
            })
            .then(res => {
              if (res.data.affectedRows > 0) {
                Swal.fire({
                  title: '수정 완료',
                  text: '수정이 완료되었습니다.',
                  icon: 'success',
                  confirmButtonText: '확인'
                }).then(() => {
                  this.facList();
                  this.autoFacCode();
                });

                // 초기화
                this.rowData = {
                  fac_code: "",
                  model_name: "",
                  fac_location: "",
                  employee_code: "",
                  fac_pattern: "",
                  install_date: "",
                  inspection_cycle: "",
                  image: "",
                  fac_status: "",
                };
                this.imageFile = null;
              } else {
                Swal.fire({
                  title: '수정 실패',
                  text: '수정이 실패하였습니다.',
                  icon: 'error',
                  confirmButtonText: '확인'
                });
              }
            })
            .catch(err => {
              console.error(err);
              Swal.fire({
                title: '오류 발생',
                text: '수정 중 오류가 발생했습니다.',
                icon: 'error',
                confirmButtonText: '확인'
              });
            });

        } else {
          // 이미지가 없는 경우 바로 수정 요청
          axios.put('/api/fac/updateFac', {
            facCode: this.rowData
          })
            .then(res => {
              if (res.data.affectedRows > 0) {
                Swal.fire({
                  title: '수정 완료',
                  text: '수정이 완료되었습니다.',
                  icon: 'success',
                  confirmButtonText: '확인'
                }).then(() => {
                  this.facList();
                  this.autoFacCode();
                });

                this.rowData = {
                  fac_code: "",
                  model_name: "",
                  fac_location: "",
                  employee_code: "",
                  fac_pattern: "",
                  install_date: "",
                  inspection_cycle: "",
                  image: "",
                  fac_status: "",
                };
                this.imageFile = null;
              } else {
                Swal.fire({
                  title: '수정 실패',
                  text: '수정이 실패하였습니다.',
                  icon: 'error',
                  confirmButtonText: '확인'
                });
              }
            })
            .catch(err => {
              console.error(err);
              Swal.fire({
                title: '오류 발생',
                text: '수정 중 오류가 발생했습니다.',
                icon: 'error',
                confirmButtonText: '확인'
              });
            });
        }
      },
      // 이미지
      getImageUrl(fileName) {
        if (!fileName) return '';
        if (fileName.startsWith("data:image")) return fileName;
          return `http://localhost:3000/uploads/facImages/${fileName}`; // 또는 환경 변수 사용
        }
      },
      onImageChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.imageFile = file;

        const reader = new FileReader();
        reader.onload = e => {
          this.rowData.imagePreview = e.target.result; // base64로 미리보기용 이미지 처리
        };
        reader.readAsDataURL(file);

        // 업로드된 이미지를 서버에 전송
        const formData = new FormData();
        formData.append("image", file);
        axios.post("/api/fac/uploadImage", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
          .then(res => {
            if (res.data && res.data.fileName) {
              this.rowData.image = res.data.fileName;  // 업로드된 이미지 파일명을 저장
            }
          })
          .catch(error => {
            console.error("이미지 업로드 실패:", error);
          });
      }
    }
  
</script>

<style scoped>
.img-thumbnail {
  border-radius: 8px;
  object-fit: cover;
}
</style>