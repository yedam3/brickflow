<template>
  <div class="card border-0" style="height: calc(65vh - 6.5rem)">
    <h2>설비 관리</h2>

    <div class="heading-with-line mb-3">
      <h5 class="m-0 me-3">비가동 설비 목록</h5>
    </div>
    <ag-grid-vue
      class="ag-theme-alpine custom-grid-theme mb-4"
      style="width: 100%; height: auto;"
      :columnDefs="columnDefs"
      :rowData="rowData2"
      :gridOptions="gridOptions"
      @rowClicked="clicked"
    />
  </div>

  <div class="card border-0" style="height: calc(35vh - 3.5rem)">
    <div class="heading-with-line">
      <h5 class="m-0 me-3">비가동 등록</h5>
    </div>
      <div class="d-flex justify-content-end gap-3">
        <Button label="초기화" severity="secondary" @click="clearForm" />
        <Button label="등록" severity="info" @click="addUnFac" />
        <Button label="수정" severity="help" @click="modifyUnplay" />
        <Button label="가동처리" severity="danger" @click="updatePlay" />
    </div>
    <div class="row g-3">
        <div class="col-md-3">
          <label class="form-label">비가동코드</label>
          <input type="text" class="form-control" v-model="rowData.unplay_code" readonly />
        </div>
        <div class="col-md-3">
          <label class="form-label">비가동사유<small style="color: gray;">(필수)</small></label>
          <select v-model="rowData.unplay_reason_code" class="form-select">
            <option disabled value="" style="color: gray;">선택</option>
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
          <input type="text" class="form-control" v-model="rowData.employee_name" readonly/>
        </div>
        <div class="col-md-3">
          <label class="form-label">시작일시<small style="color: gray;">(필수)</small></label>
          <input type="datetime-local" class="form-control" v-model="rowData.unplay_start_date" />
        </div>
        <div class="col-md-6">
          <label class="form-label">비고<small style="color: gray;">(필수)</small></label>
          <textarea class="form-control" col="" v-model="rowData.note"></textarea>
        </div>
      </div>
  </div>

  <FacListModal
      :visible="showFacModal"
      rowSelection="multiple"
      @close="showFacModal = false"
      @selectFac="facSelected"
    />
</template>

<script>

import { AgGridVue } from "ag-grid-vue3";
import DatePickerEditor from "../../../components/DatePickerEditor.vue";
import axios from "axios";
import Swal from "sweetalert2";
import FacListModal from "@/components/modal/FacListModal.vue";
import moment from 'moment-timezone';
import { useUserStore } from '@/stores/user';
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
                    employee_code: useUserStore().id,
                    unplay_start_date: "",
                    unplay_end_date: "",
                    note: "",
                    fac_code: '',
                },
            rowData2:[
                {
                    unplay_code: "",
                    unplay_reason_code: "",
                    employee_code: useUserStore().id,
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
                        const reason = this.reasonFacAry.find(
                            item => item.unplay_reason_code === params.value
                        );
                        return reason ? reason.sub_code_name : params.value;
                }
                },
                { field: "employee_code", headerName: "담당자", flex: 3 ,
                    valueFormatter: (params) => {
                        return params.data?.employee_name || params.value;
                    }
                },
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
        this.resetRowData();
    },
    methods: {
        
        dateFormatter(params) {
            const value = params?.value;
            if (!value) return '';
            return moment(value).isValid()
                ? moment(value).format("YYYY-MM-DD HH:mm")
                : '';
        },
        resetRowData() {
            this.rowData = {
                unplay_code: "",
                unplay_reason_code: "",
                employee_code: useUserStore().id,
                employee_name: useUserStore().empName,
                unplay_start_date: "",
                unplay_end_date: "",
                note: "",
                fac_code: '',
            };
        },
        async autoUnCode(){
            const result = await axios.get("/api/fac/autoUnCode");
            this.rowData.unplay_code = result.data[0].unplay_code;
        },
        async addUnFac() {
            console.log(this.rowData);

            if (!this.rowData.unplay_reason_code && 
            !this.rowData.unplay_start_date && 
            !this.rowData.note) 
            {
                Swal.fire("입력 오류", "필수 항목을 모두 입력해주세요.", "warning");
                return;
            }
            if (!this.rowData.unplay_reason_code) {
                Swal.fire("입력오류", "설비사유를 선택해주세요", "warning");
                return;
            }
            if (!this.rowData.unplay_start_date) {
                Swal.fire("입력오류", "시작일시를 입력해주세요", "warning");
                return;
            }
            if (!this.rowData.note) {
                Swal.fire("입력오류", "비고란을 입력해주세요", "warning");
                return;
            }


            const dataToSend = {
                unplay_code: this.rowData.unplay_code,
                unplay_reason_code: this.rowData.unplay_reason_code,
                employee_code: useUserStore().id,
                unplay_start_date: this.rowData.unplay_start_date,
                unplay_end_date: this.rowData.unplay_end_date || null,
                note: this.rowData.note,
                fac_code: this.rowData.fac_code,
            };
            // 등록
            axios.post('/api/fac/addUnFac', {
                unplayFac: dataToSend
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
                        }).then(() => {
                            this.unFacList();
                            this.clearForm();
                            this.autoUnCode();
                        });
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
            if (!this.rowData.unplay_reason_code || 
            !this.rowData.unplay_start_date || 
            !this.rowData.note) 
            {
                Swal.fire("입력 오류", "필수 항목을 모두 입력해주세요.", "warning");
                return;
            }
            if (!this.rowData.unplay_reason_code) {
                Swal.fire("입력오류", "설비사유를 선택해주세요", "warning");
                return;
            }
            if (!this.rowData.unplay_start_date) {
                Swal.fire("입력오류", "시작일시를 입력해주세요", "warning");
                return;
            }
            if (!this.rowData.note) {
                Swal.fire("입력오류", "비고란을 입력해주세요", "warning");
                return;
            }
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
            const dataToSend = {
                unplay_code: this.rowData.unplay_code,
                unplay_reason_code: this.rowData.unplay_reason_code,
                employee_code: this.rowData.employee_code,
                unplay_start_date: this.rowData.unplay_start_date,
                unplay_end_date: this.rowData.unplay_end_date || null,
                note: this.rowData.note,
                fac_code: this.rowData.fac_code,
            };
            // 설비 수정
            await axios.put('/api/fac/modifyUnplay', {
                unplayFac: dataToSend
            })
                .then(async res => {
                    if (res && res.data) {
                        if (res.data.affectedRows > 0) {
                            Swal.fire({
                                title: '수정 완료',
                                text: '수정이 완료되었습니다.',
                                icon: 'success',
                                confirmButtonText: '확인'
                            }).then(() => {
                                this.unFacList();
                                this.clearForm();
                                this.autoUnCode();
                            });
                        } else {
                            Swal.fire({
                                title: '변경 없음',
                                text: '기존 값과 동일하여 변경되지 않았습니다.',
                                icon: 'info',
                                confirmButtonText: '확인'
                            });
                        }
                    } else {
                        Swal.fire({
                            title: '수정 실패',
                            text: '응답이 올바르지 않습니다.',
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
        async updatePlay() {
            const formatted = moment().format("YYYY-MM-DD HH:mm");
            const now = moment().format("YYYY-MM-DD HH:mm");
            this.rowData.unplay_end_date = now;

            const res = await axios.put('/api/fac/updateList', {
                facCode: this.rowData.fac_code,
                facStatus: "FS1"
            }).catch(err => {
                console.error(err);
                Swal.fire("가동처리 실패", "알 수 없는 오류가 발생했습니다.", "error");
                return null;
            });
            if (res && res.data.affectedRows > 0) {
                await axios.put('/api/fac/updateUnplayEndDate', {
                    unplay_code: this.rowData.unplay_code,
                    unplay_end_date: formatted
                });

                Swal.fire("가동처리 완료", "가동처리가 완료되었습니다.", "success")
                    .then(async () => {
                        this.unFacList();
                        this.clearForm();
                        this.autoUnCode();
                    });
            }
        },
        //선택한 값 불러오기
        clicked(event) {
            const data = event.data;
            console.log('선택된 행 데이터:', data); // 이걸로 값이 실제 있는지 확인!

            this.rowData.unplay_code = data.unplay_code || '';
            this.rowData.unplay_reason_code = data.unplay_reason_code || '';
            this.rowData.employee_code = data.employee_code || useUserStore().id;
            this.rowData.employee_name = data.employee_name || useUserStore().empName;
            this.rowData.unplay_start_date = data.unplay_start_date && moment(data.unplay_start_date).isValid()
                ? moment(data.unplay_start_date).format("YYYY-MM-DD HH:mm")
                : '';
            this.rowData.unplay_end_date = data.unplay_end_date && moment(data.unplay_end_date).isValid()
                ? moment(data.unplay_end_date).format("YYYY-MM-DD HH:mm")
                : '';
            this.rowData.fac_code = data.fac_code || '';
            this.rowData.note = data.note || '';
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
        },
        clearForm() {
            this.resetRowData();
            this.autoUnCode();
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