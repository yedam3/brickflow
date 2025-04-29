<template>
    <div >
        <div >
            <div class="p-4 row" style="width: 400px; height: auto; background-color: white;">
                <div class="col">
                    <h6 style="color: gray;">비가동 설비조회</h6>
                    <h7>비가동사유<select value="" class="form-select form-control"
                            style="width: 100px; height: 25px; border: 1px solid gray; font-size: 10px; color: gray;">
                            <option value="">선택</option>
                            <option value="">1</option>
                            <option value="">2</option>
                            <option value="">3</option>
                        </select></h7>
                </div>
                <div class="col d-flex justify-content-end p-4" >
                    <Button label="조회" severity="success" class="" @click="unFacList"></Button>
                </div>
            </div>

        </div>
        <div>
            <div class="ag-wrapper d-flex justify-content-center">
                <ag-grid-vue class="ag-theme-alpine custom-grid-theme" style="width: 100%; height: 400px;"
                    :columnDefs="columnDefs" :rowData="rowData2" :gridOptions="gridOptions"
                    @cellClicked="comCellClicked">
                </ag-grid-vue>
            </div>
        </div>
    </div>
    <br>
    <div class="ag-theme-alpine" style="width: 800px; height: 250px; background-color: white;">
        <div class="d-flex flex-wrap gap-4">
            <div class="p-4">
                <h6>비가동코드 <input type="text" v-model="rowData.unplay_code" class="form-control" style="border: 1px solid black; width: 100px;"></h6>
                <h6>비가동사유코드 <select v-model="rowData.unplay_reason_code" class="form-select form-control" style="height: 34px; border: 1px solid black ; font-size: 12px; color: gray; width: 100px;" >
                      <option value="">선택</option>
                      <option value="">1</option>
                    </select></h6>
                <h6>설비코드 <input type="text" v-model="rowData.fac_code" class="form-control" style="border: 1px solid black; width: 100px;"></h6>
            </div>
            <div class="p-4 ">
                <h6>시작일시<input type="date" v-model="rowData.unplay_start_date" class="form-control" style="border: 1px solid black; width: 150px;"></h6>
                <h6>종료일시 <input type="date" v-model="rowData.unplay_end_date" class="form-control" style="border: 1px solid black; width: 150px;"></h6>
            </div>
            <div class="p-4">
                <h6>비고<input type="text" v-model="rowData.note" class="form-control" style="border: 1px solid black; width: 100px;"></h6>
                <h6>담당자<input type="number" v-model="rowData.employee_code" class="form-control" style="border: 1px solid black; width: 100px;"></h6>
                <div class="d-flex justify-content-end p-4">
                    <Button label="등록" severity="info" class="me-3" @click="addUnFac" />
                    <Button label="수정" severity="help" class="me-3" @click="modifyUnplay" />
                    <Button label="삭제" severity="danger" class="me-5" @click="deleteUnplay" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import { AgGridVue } from "ag-grid-vue3";
import DatePickerEditor from "../../../components/DatePickerEditor.vue";
import axios from "axios";
import Swal from "sweetalert2";
export default {
    components: {
        AgGridVue,
        datePicker: DatePickerEditor,
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
                    fac_code: "",
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
                    fac_code: "",
                }
            ],
            columnDefs: [
                { field: "fac_code", headerName: "설비코드", flex: 3, },
                { field: "unplay_code", headerName: "비가동설비코드", flex: 3, },
                { field: "unplay_reason_code", headerName: "비가동사유코드", flex: 3, },
                { field: "employee_code", headerName: "당담자", flex: 3, },
                { field: "unplay_start_date", headerName: "비가동시작일시", flex: 3, },
                { field: "unplay_end_date", headerName: "비가동종료일시", flex: 3, },
                { field: "note", headerName: "비고", flex: 3,},
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
    mounted() {
        this.autoUnCode();
        this.unFacList();
    },
    methods: {
        //
        async autoUnCode(){
            const result = await axios.get("/api/fac/autoUnCode");
            this.rowData.unplay_code = result.data[0].unplay_code;
        },
        async addUnFac() {
            console.log(this.rowData.unplay_code);
            const res = await axios.get('/api/fac/unFacCheck', {
                params: {
                    unplayCode: this.rowData.unplay_code
                }
            })
                .catch((err) => console.log(err));
            if (res.data[0].checkCount > 0) {
                Swal.fire({
                    title: '등록 실패',
                    text: '이미 등록이 진행된 설비코드입니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return;
            }
            console.log(this.rowData);
            //등록
            axios.post('/api/fac/addUnFac', {
                unplayFac: this.rowData,
            })
            .then(res => {
                    if (res.data.affectedRows > 0) {
                        Swal.fire({
                            title: '등록성공',
                            text: '정상적으로 등록이 완료되었습니다.',
                            icon: 'success',
                            confirmButtonText: '확인'
                        }).then(() =>{
                            this.unFacList();
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
            const res = await axios.get('/api/fac/unFacCheck', {
                params: {
                    unplayCode: this.rowData2[0].unplay_code
                }
            })
                .catch((err) => console.log(err));
            if (res.data[0].checkCount < 1) {
                Swal.fire({
                    title: '수정 실패',
                    text: '아직 등록되지 않은 건입니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return;
            }
            //설비수정
            await axios.put('/api/fac/modifyUnplay', {
                unplayFac: this.rowData2[0]
            })
                .then(res => {
                    if (res.data.affectedRows > 0) {
                        Swal.fire({
                            title: '수정 완료',
                            text: '수정이 완료되었습니다.',
                            icon: 'success',
                            confirmButtonText: '확인'
                        });

                    } else {
                        Swal.fire({
                            title: '수정 실패',
                            text: '수정을 실패하였습니다.',
                            icon: 'error',
                            confirmButtonText: '확인'
                        });
                        return;
                    }
                })
                .catch(err => {
                    console.error(err);
                    Swal.fire({
                        title: '수정 실패',
                        text: '알수 없는 에러.',
                        icon: 'error',
                        confirmButtonText: '확인'
                    });
                    return
                });
            this.autoUnCode();
        },
        //삭제
        async deleteUnplay() {
            await axios.delete('/api/fac/delUnplay' + this.rowData2.unplay_code)
                .then((res) => {
                    if (res.data[0].affectedRows < 1) {
                        Swal.fire({
                            title: '삭제 실패',
                            text: '삭제 실패 하였습니다.',
                            icon: 'error',
                            confirmButtonText: '확인'
                        });
                    } else {
                        Swal.fire({
                            title: '삭제 완료',
                            text: '정상적으로 삭제가 완료되었습니다.',
                            icon: 'success',
                            confirmButtonText: '확인'
                        });
                    }
                })
                .catch((err) => console.log(err));
            this.autoUnCode();
        },
        //조회
        async unFacList() {
            await axios.get('/api/fac/unFacList')
                        .then(res => {
                            console.log(res.data)
                            this.rowData2 = res.data;
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
</style>