<template>
  <div class="card border-0" style="height: calc(50vh - 5rem)">
    <h3>설비 관리</h3>
    <div class="heading-with-line">
      <h5 class="m-0 me-3">설비 목록</h5>
    </div>

    <ag-grid-vue class="ag-theme-alpine custom-grid-theme" style="width: 100%; height: 300px;"
        :columnDefs="columnDefs" :rowData="rowData" :gridOptions="gridOptions" @cellClicked="comCellClicked"
        @rowClicked="clicked">
      </ag-grid-vue>
  </div>

  <div class="card border-0" style="height: calc(50vh - 5rem)">

    <div class="heading-with-line mb-4">
      <h5 class="m-0 me-3">설비 수리 처리</h5>
    </div>

    <div class="row mb-4">
        <div class="input-group col">
          <span class="input-group-text" id="basic-addon1">설비수리코드</span>
          <input type="text" class="form-control" placeholder="" aria-label="Username"
            aria-describedby="basic-addon1" v-model="rowData2.repaire_code" readonly>
        </div>
        <div class="input-group col">
          <span class="input-group-text" id="basic-addon1">담당자</span>
          <input type="text" class="form-control" placeholder="담당자" aria-label="Username"
            aria-describedby="basic-addon1" v-model="rowData2.employee_name" readonly>
        </div>
      </div>
      <div class="row mb-4">
        <div class="input-group col">
          <span class="input-group-text" id="basic-addon1">수리등록일자<small style="color: gray;">(필수)</small></span>
          <input type="date" class="form-control" placeholder="연도-월-일" aria-label="Username"
            aria-describedby="basic-addon1" v-model="rowData2.repaire_add_date" >
        </div>
        <div class="input-group col">
          <span class="input-group-text" id="basic-addon1">수리처리일자<small style="color: gray;">(필수)</small></span>
          <input type="date" class="form-control" placeholder="연도-월-일" aria-label="Username"
            aria-describedby="basic-addon1" v-model="rowData2.repaire_finish_date" >
        </div>
        <div class="input-group col">
          <span class="input-group-text" id="basic-addon1">설비코드</span>
          <input type="text" class="form-control" placeholder="설비코드" aria-label="Username"
            aria-describedby="basic-addon1" v-model="rowData2.fac_code" readonly>
        </div>
      </div>
      <div class="row mb-4">
        <div class="input-group col">
          <span class="input-group-text" id="basic-addon1">수리결과<small style="color: gray;">(필수)</small></span>
          <select v-model="rowData2.fac_result" class="form-select col" aria-label="Default select example" >
            <option disabled value="" style="color: gray;">수리결과</option>
            <option v-for="repFac in facResultAry" :key="repFac.fac_result" :value="repFac.fac_result">
              {{ repFac.sub_code_name }}
            </option>
          </select>
         
        </div>
        <div class="input-group col">
          <span class="input-group-text" id="basic-addon1">고장증상<small style="color: gray;">(필수)</small></span>
          <input type="text" class="form-control" placeholder="고장증상" aria-label="Username"
            aria-describedby="basic-addon1"  v-model="rowData2.break_status" >
        </div>
        <div class="input-group col">
          <span class="input-group-text" id="basic-addon1">비가동코드</span>
          <input type="text" class="form-control" placeholder="비가동코드" aria-label="Username"
            aria-describedby="basic-addon1" v-model="rowData2.unplay_code" readonly>
        </div>
      </div>
      <div class="row mb-4">
        <div class="input-group col">
          <span class="input-group-text" id="basic-addon1">비고<small style="color: gray;">(필수)</small></span>
          <textarea class="form-control" placeholder="비고" v-model="rowData2.note"
            style="height: 100px; resize: none; "></textarea>
        </div>
        <div class="input-group col">
          <span class="input-group-text" id="basic-addon1">수리내역<small style="color: gray;">(필수)</small></span>
          <textarea class="form-control" placeholder="수리내역"  v-model="rowData2.fac_history"
            style="height: 100px; resize: none; "></textarea>
        </div>
      </div>

      <div class="input-group col" >
      <Button label="처리" severity="info" class="me-3" @click="addRepaire" />
    </div>
  </div>
</template>

<script>
import moment from 'moment';
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
      rowData:[
        {
          unplay_code: "",
          unplay_reason_code: "",
          employee_code: useUserStore().id,
          unplay_start_date: "",
          note: "",
          fac_code: '',
        }
      ],
      rowData2:
        {
          repaire_code:"",
          employee_code: useUserStore().id,
          repaire_add_date:"",
          repaire_finish_date:"",
          fac_code: '',
          fac_result:"",
          break_status:"",
          unplay_code: "",
          note: "",
          fac_history:"",
        },
      columnDefs: [
        { field: "fac_code", headerName: "설비코드", flex: 3, },
        { field: "unplay_code", headerName: "비가동설비코드", flex: 3, },
        { field: "unplay_reason_code", headerName: "비가동사유코드", flex: 3, 
          valueFormatter: (params) => {
            if (Array.isArray(this.reasonFacAry)) {
              const reason = this.reasonFacAry.find(
                item => item.unplay_reason_code === params.value
              );
              return reason ? reason.sub_code_name : params.value;
            }
            return params.value;
          }
        },
        { field: "employee_code", headerName: "당담자", flex: 3, 
          valueFormatter: (params) => {
            return params.data?.employee_name || params.value;
          }
        },
        { field: "unplay_start_date", headerName: "비가동시작일시", flex: 3, },
        { field: "note", headerName: "비고", flex: 3, },
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
            facResultAry:[
              {
                fac_result: '수리완료',         
                sub_code: 'OH1'
              }
            ],
    }
  },
  mounted() {
    this.autoReCode();
    this.repaireList();
    this.facResult();
    this.reasonFac();
    this.resetRowData2();
  },
  methods: {
    comCellClicked(event) {
      console.log("셀 클릭됨:", event);
    },
    resetRowData2() {
      this.rowData2 = {
        repaire_code: "",
        repaire_add_date: "",
        repaire_finish_date: "",
        employee_code: useUserStore().id,
        employee_name: useUserStore().empName,
        fac_code: '',
        break_status: "",
        fac_result: "",
        unplay_code: "",
        note: "",
        fac_history: "",
      };
    },
    //값 증가
    async autoReCode(){
      const result = await axios.get("/api/fac/autoReCode");
      if (Array.isArray(result.data) && result.data.length > 0) {
        this.rowData2.repaire_code = result.data[0].repaire_code;
      } else {
        console.warn("수리코드를 받아오지 못했습니다:", result.data);
        this.rowData2.repaire_code = "코드없음"; // 또는 예외 처리
  }
    },
    //수리처리
    async addRepaire() {
      const {
        employee_code,
        repaire_add_date,
        break_status,
        fac_code,
        fac_result,
        unplay_code,
        fac_history,
      } = this.rowData2;
      if (
        !employee_code ||
        !repaire_add_date ||
        !break_status ||
        !fac_code ||
        !fac_result ||
        !unplay_code ||
        !fac_history 
      ) {
        Swal.fire("입력 오류", "모든 필수 항목을 입력해주세요.", "warning");
        return;
      }
      if (!this.rowData2.employee_code) {
          Swal.fire("입력오류", "담당자를 입력해주세요", "warning");
      }
      if (!this.rowData2.repaire_add_date) {
          Swal.fire("입력오류", "종료일시를 입력해주세요", "warning");
      }
      if (!this.rowData2.break_status) {
          Swal.fire("입력오류", "고장증상을 입력해주세요", "warning");
      }
      if (!this.rowData2.fac_code) {
          Swal.fire("입력오류", "설비코드를 입력해주세요", "warning");
      }
      if (!this.rowData2.fac_result) {
          Swal.fire("입력오류", "수리결과를 선택해주세요", "warning");
      }
      if (!this.rowData2.unplay_code) {
          Swal.fire("입력오류", "비가동코드를 입력해주세요", "warning");
      }
      if (!this.rowData2.fac_history) {
          Swal.fire("입력오류", "수리내역을 입력해주세요", "warning");
      }
      
      if (!this.rowData2.repaire_add_date) {
        this.rowData2.repaire_add_date = moment().format("YYYY-MM-DD");
      }

      if (!this.rowData2.repaire_finish_date) {
        this.rowData2.repaire_finish_date = moment().format("YYYY-MM-DD");
      }

      this.rowData2.repaire_finish_date = moment().format("YYYY-MM-DD");
      const fullFinishDateTime = moment().format("YYYY-MM-DD HH:mm");

      await this.autoReCode();

      console.log("전송될 데이터:", this.rowData2);
      axios.post('/api/fac/repaireFac', {
        repaireFac: {
          repaire_code: this.rowData2.repaire_code,
          employee_code: useUserStore().id,
          repaire_add_date: this.rowData2.repaire_add_date,
          repaire_finish_date: this.rowData2.repaire_finish_date,
          fac_code: this.rowData2.fac_code,
          fac_result: this.rowData2.fac_result,
          break_status: this.rowData2.break_status,
          unplay_code: this.rowData2.unplay_code,
          note: this.rowData2.note,
          fac_history: this.rowData2.fac_history,
        } 
      }).then(async res => {
        if (res.data.affectedRows > 0) {

          // 수리결과에 따라 상태 분기 처리
          if (this.rowData2.fac_result === 'OH1') { // 수리완료
            await axios.put('/api/fac/updateList', {
              facStatus: 'FS1', // 가동
              facCode: this.rowData2.fac_code
            });

            await axios.put('/api/fac/updateUnplayEndDate', {
              unplay_code: this.rowData2.unplay_code,
              unplay_end_date: fullFinishDateTime
            });
          }
          // 수리불가면 아무것도 안함 (비가동 상태 유지)

          Swal.fire({
            title: '처리 완료',
            text: '수리 등록이 완료되었습니다.',
            icon: 'success',
            confirmButtonText: '확인'
          });

          this.repaireList();
          this.resetRowData2();
          await this.autoReCode();
        } else {
          Swal.fire("실패", "수리 등록 실패", "error");
        }
      });
    },
     //조회
    async repaireList() {
            await axios.get('/api/fac/repaireList', {
            })
                .then(res => {
                  console.log('API 응답 데이터:', res.data); 
                    console.log(res.data)
                    // 수리완료인 경우 제외하고 보여주기
                    this.rowData = res.data.filter(item => item.fac_result !== 'OH1');
                })
    },
    clicked(event) {
  const data = event.data;

  if (data) {
    this.rowData2 = {
      ...this.rowData2, // 기존 값 유지
      fac_code: data.fac_code || '',
      unplay_code: data.unplay_code || '',
      employee_name: data.employee_name || useUserStore().empName,
      // 필요한 경우 아래 값도 추가
      break_status: data.break_status || '',
      note: data.note || '',
      fac_result: data.fac_result || '',
      fac_history: data.fac_history || '',
    };
  }
},

    // 셀 클릭 시 호출되는 메서드 (옵션)
    comCellClicked(event) {
      console.log("셀 클릭됨:", event);
    },
    //수리결과
    async facResult() {
      await axios.get('/api/fac/facResult')
      .then(res => {
        this.facResultAry = res.data;
      })
      .catch(err => console.error(err));
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
</style>