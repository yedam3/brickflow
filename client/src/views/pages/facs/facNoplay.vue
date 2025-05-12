<template>
  <div class="ag-theme-alpine p-4" style="background-color: white; min-height: 800px;">
    <div class="d-flex justify-content-start mb-3">
      <div class="input-group" style="width: 65%;">
        <select v-model="searchType" class="form-select">
          <option value="" selected style="color: gray;">전체</option>
          <option v-for="unFac in reasonFacAry" :key="unFac.unplay_reason_code" :value="unFac.unplay_reason_code">
            {{ unFac.sub_code_name }}
          </option>
        </select>
        <input type="text" v-model="searchText" placeholder="검색어 입력" class="form-control" @keydown.enter="unFacList" />
        <button @click="unFacList" class="btn btn-primary">
          <i class="pi pi-search"></i>
        </button>
      </div>
    </div>
    <ag-grid-vue
      class="ag-theme-alpine custom-grid-theme mb-4"
      style="width: 100%; height: 300px;"
      :columnDefs="columnDefs"
      :rowData="rowData2"
      :gridOptions="gridOptions"
      @rowClicked="clicked"
    />
    <div class="card shadow-sm p-4">
      <h5 class="mb-4">비가동 등록</h5>
      <div class="row g-3">
        <div class="col-md-3">
          <label class="form-label">비가동코드</label>
          <input type="text" class="form-control" v-model="rowData.unplay_code" readonly />
        </div>
        <div class="col-md-3">
          <label class="form-label">비가동사유</label>
          <select v-model="rowData.unplay_reason_code" class="form-select">
            <option disabled value="">비가동사유</option>
            <option v-for="reFac in reasonFacAry" :key="reFac.unplay_reason_code" :value="reFac.unplay_reason_code">
              {{ reFac.sub_code_name }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">설비코드</label>
          <input type="text" class="form-control" v-model="rowData.fac_code" @click="facModalList" readonly />
        </div>
        <div class="col-md-3">
          <label class="form-label">담당자</label>
          <input type="number" class="form-control" v-model="rowData.employee_code" />
        </div>
        <div class="col-md-3">
          <label class="form-label">시작일시</label>
          <input type="datetime-local" class="form-control" v-model="rowData.unplay_start_date" />
        </div>
        <div class="col-md-3">
          <label class="form-label">종료일시</label>
          <input type="datetime-local" class="form-control" v-model="rowData.unplay_end_date" />
        </div>
        <div class="col-md-6">
          <label class="form-label">비고</label>
          <textarea class="form-control" rows="3" v-model="rowData.note"></textarea>
        </div>
      </div>
      <div class="d-flex justify-content-end mt-4 gap-3">
        <Button label="등록" severity="info" @click="addUnFac" />
        <Button label="수정" severity="help" @click="modifyUnplay" />
        <Button label="가동처리" severity="danger" @click="updatePlay" />
      </div>
    </div>
    <FacListModal
      :visible="showFacModal"
      rowSelection="multiple"
      @close="showFacModal = false"
      @selectFac="facSelected"
    />
  </div>
</template>

<script>

import { AgGridVue } from "ag-grid-vue3";
import DatePickerEditor from "../../../components/DatePickerEditor.vue";
import axios from "axios";
import Swal from "sweetalert2";
import FacListModal from "@/components/modal/FacListModal.vue";
import moment from 'moment-timezone';
export default {
    components: {
        AgGridVue,
        datePicker: DatePickerEditor,
        FacListModal,
        Swal
    },
    data() {
        return {
            rowData: 
                {
                    unplay_code: "",
                    unplay_reason_code: "",
                    employee_code: "",
                    unplay_start_date: "",
                    unplay_end_date: "",
                    note: "",
                    fac_code: '',
                }
            ,
            rowData2:[
                {
                    unplay_code: "",
                    unplay_reason_code: "",
                    employee_code: "",
                    unplay_start_date: "",
                    unplay_end_date: "",
                    note: "",
                    fac_code: '',
                }
            ],
            columnDefs: [
                { field: "fac_code", headerName: "설비코드", flex: 3 },
                { field: "unplay_code", headerName: "비가동설비코드", flex: 3 },
                { field: "unplay_reason_code", headerName: "비가동사유코드", flex: 3 ,
                    valueFormatter: (params) => {
                        if (params.value == 'NR1') {
                            return params.value = '사출 성형기';
                        } else if (params.value == 'NR2') {
                            return params.value = '자동 조립 장비';
                        } else if (params.value == 'NR3') {
                            return params.value = '도장';
                        } else if (params.value == 'NR4') {
                            return params.value = '포장 설비';
                        } 
                    }
                },
                { field: "employee_code", headerName: "담당자", flex: 3 },
                {
                    field: "unplay_start_date",
                    headerName: "비가동시작일시",
                    flex: 3,
                    valueFormatter: this.dateFormatter
                },
                {
                    field: "unplay_end_date",
                    headerName: "비가동종료일시",
                    flex: 3,
                    valueFormatter: this.dateFormatter
                },
                { field: "note", headerName: "비고", flex: 3 },
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
            showFacModal: false,
            selectedRowIndexes: [],
            reasonFacAry: [],
        }
    },
    mounted() {
        this.autoUnCode();
        this.unFacList();
        this.reasonFac();

        this.columnDefs = [
        { field: "fac_code", headerName: "설비코드", flex: 3 },
        { field: "unplay_code", headerName: "비가동설비코드", flex: 3 },
        { field: "unplay_reason_code", headerName: "비가동사유코드", flex: 3 },
        { field: "employee_code", headerName: "담당자", flex: 3 },
        {
            field: "unplay_start_date",
            headerName: "비가동시작일시",
            flex: 3,
            valueFormatter: this.dateFormatter,
        },
        {
            field: "unplay_end_date",
            headerName: "비가동종료일시",
            flex: 3,
            valueFormatter: this.dateFormatter,
        },
        { field: "note", headerName: "비고", flex: 3 },
    ];
    },
    methods: {
        dateFormatter(params) {
            if (!params || !params.value) return '';
            return moment(params.value, moment.ISO_8601).isValid()
                ? moment(params.value).format("YYYY-MM-DD HH:mm")
                : '';
        },
        async autoUnCode(){
            const result = await axios.get("/api/fac/autoUnCode");
            this.rowData.unplay_code = result.data[0].unplay_code;
        },
        async addUnFac() {
            console.log(this.rowData);
            //등록
            axios.post('/api/fac/addUnFac', {
                unplayFac: {
                    ...this.rowData,
                    unplay_end_date: this.rowData.unplay_end_date || null,
                }
            })
            .then(async res => {
                if (res.data.affectedRows > 0) {
                    // 종료일자가 없으면 비가동 상태, 있으면 가동 상태로 업데이트
                    const facStatus = this.rowData.unplay_end_date ? 'FS1' : 'FS2';
                    await axios.put('/api/fac/updateList', {
                        facCode: this.rowData.fac_code,
                        facStatus: facStatus
                    });
                        Swal.fire({
                            title: '등록성공',
                            text: '정상적으로 등록이 완료되었습니다.',
                            icon: 'success',
                            confirmButtonText: '확인'
                        }).then(() =>{
                            this.unFacList();
                        });
                        this.rowData = {
                            unplay_reason_code: "",
                            employee_code: "",
                            unplay_start_date: "",
                            unplay_end_date: "",
                            note: "",
                            fac_code: '',
                        };
                    } else {
                        Swal.fire({
                            title: '등록 실패',
                            text: '등록이 실패하였습니다..',
                            icon: 'error',
                            confirmButtonText: '확인'
                        });
                    }
                })
                .catch(error => {
                    console.error(error);
                    Swal.fire({
                        title: '등록 실패',
                        text: '알수 없는 오류가 발생하였습니다..',
                        icon: 'error',
                        confirmButtonText: '확인'
                    });
                    return;
                });
            this.autoUnCode();
        },
        //수정
        async modifyUnplay() {
            const res = await axios.get('/api/fac/unFacCheck', {
                params: {
                    unplayCode: this.rowData2[0].unplay_code
                }
            }).catch((err) => console.log(err));

            if (res.data[0].checkCount < 1) {
                Swal.fire({
                    title: '수정 실패',
                    text: '아직 등록되지 않은 건입니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return;
            }

            // 설비 수정
            await axios.put('/api/fac/modifyUnplay', {
                unplayFac: this.rowData
            })
                .then(async res => {
                    if (res.data.affectedRows > 0) {
                        Swal.fire({
                            title: '수정 완료',
                            text: '수정이 완료되었습니다.',
                            icon: 'success',
                            confirmButtonText: '확인'
                        }).then(() => {
                            this.unFacList();
                        });

                        this.rowData = {
                            unplay_code: "",
                            unplay_reason_code: "",
                            employee_code: "",
                            unplay_start_date: "",
                            unplay_end_date: "",
                            note: "",
                            fac_code: '',
                        };
                    } else {
                        Swal.fire({
                            title: '수정 실패',
                            text: '수정을 실패하였습니다.',
                            icon: 'error',
                            confirmButtonText: '확인'
                        });
                    }
                })
                .catch(err => {
                    console.error(err);
                    Swal.fire({
                        title: '수정 실패',
                        text: '알 수 없는 에러.',
                        icon: 'error',
                        confirmButtonText: '확인'
                    });
                });

            this.autoUnCode();
        },
        // 가동처리
        updatePlay() {
            if (!this.rowData.unplay_end_date) {
                Swal.fire({
                    title: '오류',
                    text: '종료일시가 입력되지 않았습니다.',
                    icon: 'warning',
                    confirmButtonText: '확인'
                });
                return;
            }
            axios.put('/api/fac/updateList', {
                facCode: this.rowData.fac_code,
                facStatus: "FS1"
            })
                .then(res => {
                    if (res.data.affectedRows > 0) {
                        Swal.fire({
                            title: '가동처리 완료',
                            text: '가동처리가 완료되었습니다.',
                            icon: 'success',
                            confirmButtonText: '확인'
                        }).then(() => {
                            this.unFacList(); 
                     
                        });

                        this.rowData = {
                            unplay_reason_code: "",
                            employee_code: "",
                            unplay_start_date: "",
                            unplay_end_date: "",
                            note: "",
                            fac_code: '',
                        };
                    } else {
                        Swal.fire({
                            title: '가동처리 실패',
                            text: '가동처리를 실패하였습니다.',
                            icon: 'error',
                            confirmButtonText: '확인'
                        });
                    }
                })
                .catch(err => {
                    console.error(err);
                    Swal.fire({
                        title: '가동처리 실패',
                        text: '알 수 없는 에러.',
                        icon: 'error',
                        confirmButtonText: '확인'
                    });
                })
                .finally(() => {
                    this.autoUnCode();
                });
        },



        // //삭제
        // async deleteUnplay() {
        //     if (!this.rowData2 || this.rowData2.length === 0 || !this.rowData2[0].unplay_code) {
        //         Swal.fire({
        //             title: '삭제 실패',
        //             text: '삭제할 항목이 선택되지 않았습니다.',
        //             icon: 'warning',
        //             confirmButtonText: '확인'
        //         });
        //         return;
        //     }
        //     const unplayCode = this.rowData2[0].unplay_code;

        //     await axios.delete(`/api/fac/delUnplay/${unplayCode}`)
        //         .then((res) => {
        //             console.log("삭제 요청 코드:", unplayCode);
        //             if (res.data.affectedRows < 1) {
        //                 Swal.fire({
        //                     title: '삭제 실패',
        //                     text: '삭제 실패 하였습니다.',
        //                     icon: 'error',
        //                     confirmButtonText: '확인'
        //                 });
        //             } else {
        //                 Swal.fire({
        //                     title: '삭제 완료',
        //                     text: '정상적으로 삭제가 완료되었습니다.',
        //                     icon: 'success',
        //                     confirmButtonText: '확인'
        //                 })
        //                     .then(() => {
        //                         this.unFacList();
        //                     });
        //                 this.rowData = {
        //                     unplay_reason_code: "",
        //                     employee_code: "",
        //                     unplay_start_date: "",
        //                     unplay_end_date: "",
        //                     note: "",
        //                     fac_code: ''
        //                 };
        //                 this.rowData2 = [];
        //             }
        //         })
        //         .catch((err) => {
        //             console.log("삭제 중 오류:", err);
        //             Swal.fire({
        //                 title: '오류 발생',
        //                 text: '서버 요청 중 문제가 발생했습니다.',
        //                 icon: 'error',
        //                 confirmButtonText: '확인'
        //             });
        //         });
        //         //====================== 코드 갱신
        //     this.autoUnCode();
        //     //==========================
        // },
        //선택한 값 불러오기
       clicked(event) {
            const data = event.data;

            this.rowData = {
                unplay_code: data.unplay_code || '',
                unplay_reason_code: data.unplay_reason_code || '',
                employee_code: data.employee_code || '',
                // 날짜 유효성 체크
                unplay_start_date: data.unplay_start_date && moment(data.unplay_start_date).isValid()
                    ? moment(data.unplay_start_date).format("YYYY-MM-DD HH:mm")
                    : '',
                unplay_end_date: data.unplay_end_date && moment(data.unplay_end_date).isValid()
                    ? moment(data.unplay_end_date).format("YYYY-MM-DD HH:mm")
                    : '',
                fac_code: data.fac_code || '',
            };
        },
        //조회
        async unFacList() {
            await axios.get('/api/fac/unFacList', {
                params: {
                    searchType: this.searchType,
                    searchText: this.searchText
                }
            })
                .then(res => {
                    console.log(res.data)
                    this.rowData2 = res.data;
                })
                .catch(err => console.error(err));
        },
        //설비 모달창 띄우기
        facModalList(){
          this.showFacModal = true;
        },
        //설비 모달 리스트
        async facSelected(data) {
            this.rowData.fac_code =data.fac_code
        },
        //비가동 사유
        async reasonFac() {
            await axios.get('/api/fac/reasonFac')
                .then(res => {
                    console.log(res.data);
                    this.reasonFacAry = res.data;

                    this.reasonFacAry = [...res.data];
                })
                .catch(err => console.error(err));
        }
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