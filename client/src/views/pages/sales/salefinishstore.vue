<template>
  <div class="card border-0" style="height: calc(50vh - 5rem)">
    <h2>영업 관리</h2>

    <div class="heading-with-line">
      <h5 class="m-0 me-3">완제품 관리</h5>
    </div>

    <div class="text-end mt-3 mb-3">
      <Button label="입고 가능 재고조회" severity="success" class="me-3" @click="orderList" />
      <Button label="등록" severity="info" class="me-3" @click="addFunc" />
      <Button label="수정" severity="help" class="me-3" @click="modifyFunc" />
      <Button label="삭제" severity="danger" class="me-5" @click="deleteFunc" />
    </div>

    <Card style="overflow: hidden; ">
      <template #content>
        <div class="mb-5 row">
          <div class="col-4">
            <InputGroup>
              <InputGroupAddon>
                LOT 번호
              </InputGroupAddon>
              <InputText v-model="formData.prod_lot" size="large" placeholder="LOT" readonly />
            </InputGroup>
          </div>
          <div class="col-4">
            <InputGroup>
              <InputGroupAddon>
                담당자
              </InputGroupAddon>
              <InputText v-model="formData.emp_name" size="large" placeholder="" readonly />
            </InputGroup>
          </div>
          <div class="col-4">
            <InputGroup>
              <InputGroupAddon>
                입고일자
              </InputGroupAddon>
              <InputText v-model="formData.store_date" size="large" placeholder="" readonly />
            </InputGroup>
          </div>
        </div>

        <div class="mb-5 row">
          <div class="col-3">
            <InputGroup>
              <InputGroupAddon>
                제품명
              </InputGroupAddon>
              <InputText v-model="formData.prod_name" size="large" placeholder="" readonly />
            </InputGroup>
          </div>
          <div class="col-3">
            <InputGroup>
              <InputGroupAddon>
                제품코드
              </InputGroupAddon>
              <InputText v-model="formData.prod_code" size="large" placeholder="" readonly />
            </InputGroup>
          </div>
          <div class="col-3">
            <InputGroup>
              <InputGroupAddon>
                제품수량
              </InputGroupAddon>
              <InputText v-model="formData.quantity" size="large" placeholder="" readonly />
            </InputGroup>
          </div>
          <div class="col-3">
            <InputGroup>
              <InputGroupAddon>
                제품수량
              </InputGroupAddon>
              <select class="form-select col" aria-label="Default select example" v-model="formData.storage_code">
                <option disabled selected value="">창고(선택)</option>
                <option v-for="store in storeListAry" :key="store.storage_code" :value="store.storage_code">
                  {{ store.store_name }}
                </option>
              </select>
            </InputGroup>
          </div>
        </div>
        <div class="mb-5 row">

        </div>
        <!-- <div class="mb-5 row">
            <div class="col-auto">
              <select class="form-select col" aria-label="Default select example" v-model="formData.storage_code">
                <option disabled selected value="">창고</option>
                <option v-for="store in storeListAry" :key="store.storage_code" :value="store.storage_code">
                  {{ store.store_name   }}
                </option>
              </select>
            </div>
          </div> -->

      </template>
    </Card>
  </div>

  <div class="row">
    <div class="col">
      <div class="card border-0" style="height: calc(50vh - 5rem);">
        <div class="heading-with-line mb-5">
          <h5 class="m-0 me-3">완제품 입고 항목</h5>
        </div>
        <ag-grid-vue class="ag-theme-alpine" style="width: 100%; 
        height: 200px;" :columnDefs="columnDefs" :rowData="rowData" :gridOptions="gridOptions"
          :defaultColDef="defaultColDef" @rowClicked="clicked">
        </ag-grid-vue>
      </div>
    </div>
    <div class="col">
      <div class="card border-0" style="height: calc(50vh - 5rem);">
        <div class="heading-with-line mb-5">
          <h5 class="m-0 me-3">입고 가능 수량</h5>
        </div>
        <ag-grid-vue class="ag-theme-alpine" style="width: 100%; 
        height: 200px; " :columnDefs="thColumnDefs" :rowData="secondRowData" :gridOptions="gridOptions"
          :defaultColDef="defaultColDef" @cellValueChanged="inputRender">
        </ag-grid-vue>
      </div>
    </div>
  </div>

  <CheckSuccess :visible="showOrderModal" rowSelection="multiple" @close="showOrderModal = false"
    @selectOrder="orderSelected"></CheckSuccess>
</template>
<script>
import { AgGridVue } from "ag-grid-vue3";
import CheckSuccess from "@/components/modal/CheckSuccess.vue";
import { useUserStore } from '@/stores/user';
import axios from "axios";
import Swal from 'sweetalert2';
export default {
  components: {
    AgGridVue,
    CheckSuccess,
  },
  data() {
    return {
      formData: {
        prod_lot: "", // 제품 LOT
        work_lot: "", // 생산 LOT
        quantity: "", //입고 수량
        prod_name: "", //제품명
        prod_code: "", //제품 코드
        emp_name: useUserStore().empName,
        emp_code: useUserStore().id,
        store_date: this.getToday(),// 입고 일자
        storage_code: '',
        prod_check_code: ''
      },
      rowData: [],
      columnDefs: [
        { field: 'prod_lot', headerName: 'LOT', flex: 1, },
        { field: 'prod_code', headerName: '제품코드', flex: 1, },
        { field: 'prod_name', headerName: '제품명', flex: 1, },
        { field: 'quantity', headerName: '수량', flex: 1, },
        { field: 'store_date', headerName: '입고일자', hide: true },
        { field: 'prod_check_code', headerName: '검수코드', hide: true },
        { field: 'storage_code', headerName: '창고코드', hide: true }
      ],
      secondRowData: [],
      thColumnDefs: [
        { field: 'prod_check_code', headerName: '체크코드', flex: 3, },
        { field: 'prod_code', headerName: '제품코드', flex: 2, },
        { field: 'prod_name', headerName: '제품명', flex: 3, },
        { field: 'work_lot', headerName: '생산지시코드', flex: 3, },
        { field: 'pass_quantity', headerName: '입고가능량', flex: 2, },
        { field: 'quantity', headerName: '입고량', flex: 2, editable: true },
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
      storeListAry: [],
      showOrderModal: false,
      secondIndex: null,
    }
  },
  async mounted() {
    const raw = this.$route.query.data;
    if (raw) {
      // 디코딩된 JSON 문자열
      const decoded = decodeURIComponent(raw);
      // 객체로 파싱
      const parsed = JSON.parse(decoded);
      this.formData.work_lot = parsed.work_lot;
      this.formData.quantity = parsed.quantity;
      this.formData.prod_check_code = parsed.prod_check_code;
      this.formData.prod_name = parsed.prod_name;
      this.formData.prod_code = parsed.prod_code;
    }

    await this.storeList();
    await this.finishedList();
  },

  methods: {
    getToday() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); //월은 0부터 시작하니까 +1
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;  //"2025-04-27" 형식
    },
    // 주문 모달창
    orderList() {
      this.showOrderModal = true;
    },
    //모달창 값 메인그리드로 전달
    orderSelected(value) {
      this.formData.prod_name = value.prod_name;
      this.formData.prod_code = value.prod_code;
      this.formData.quantity = value.pass_quantity;
      this.formData.prod_check_code = value.prod_check_code;
    },
    //초기화
    async clearForm() {
      this.formData = {
        prod_lot: "", // 제품 LOT
        work_lot: "", // 생산 LOT
        quantity: "", //입고 수량
        prod_name: "", //제품명
        prod_code: "", //제품 코드
        emp_name: useUserStore().empName,
        emp_code: useUserStore().id,
        store_date: this.getToday(),// 입고 일자
        storage_code: '',
        prod_check_code: ''
      }
    },
    //창고조회
    async storeList() {
      await axios.get('/api/sales/storeList')
        .then(res => {
          this.storeListAry = res.data;
          console.log(this.storeList)
        })
        .catch((err) => console.log(err));
    },
    //완제품 항목조회
    async finishedList() {
      await axios.get('/api/sales/finishedList')
        .then(res => {
          this.rowData = res.data;
        })
    },

    async addFunc() {
      //등록건인지체크
      if (this.formData.prod_lot != '') {
        Swal.fire({
          title: '실패',
          text: '이미 등록이 진행된 계획코드입니다.',
          icon: 'error',
          confirmButtonText: '확인'
        });
        return;
      }
      //값을 다입력했는지 체크
      console.log('ㄱㄱㄱㄱ')
      console.log(this.formData.storage_code);
      if (this.formData.prod_code == '' || this.formData.storage_code == '' || this.formData.quantity == 0 || this.formData.quantity == '') {
        Swal.fire({
          title: '실패',
          text: '해당하는 값을 다입력해주세요',
          icon: 'error',
          confirmButtonText: '확인'
        });
        return;
      }
      let res = await axios.get('/api/sales/checkCount/' + this.formData.prod_check_code)
        .catch((err) => console.log(err));

      if (Number(res.data[0].COUNT) > 0) {
        Swal.fire({
          title: '정보',
          text: '이미 입고가 진행된 건입니다.',
          icon: 'info',
          confirmButtonText: '확인'
        });
        return
      }
      //등록 진행
      console.log(this.formData)
      await axios.post('/api/sales/addFinished', this.formData)
        .then(res => {
          if (res.data.affectedRows > 0) {
            Swal.fire({
              title: '성공',
              text: '제품 입고가 정상적으로 등록되었습니다.',
              icon: 'success',
              confirmButtonText: '확인'
            });
            this.clearForm();
            this.finishedList();
          } else {
            Swal.fire({
              title: '정보',
              text: '제품입고가 이 정상적 등록되지지 않았습니다.',
              icon: 'info',
              confirmButtonText: '확인'
            });
            return;
          }
        }).catch(err => {
          console.error(err);
          Swal.fire({
            title: '실패',
            text: '제품 입고 수정중 오류가 발생했습니다.',
            icon: 'error',
            confirmButtonText: '확인'
          });
        });
    },
    //값 체크시 조회
    async clicked(event) {
      this.formData.prod_check_code = event.data.prod_check_code;
      this.formData.prod_code = event.data.prod_code;
      this.formData.prod_name = event.data.prod_name;
      this.formData.store_date = event.data.store_date;
      this.formData.prod_lot = event.data.prod_lot;
      this.formData.storage_code = event.data.storage_code;
      this.formData.quantity = 0;
      await axios.get('/api/sales/possibleQuantity/' + event.data.prod_code + '/' + event.data.quantity)
        .then(res => {
          this.secondRowData = res.data;
        })
        .catch((err) => console.log(err));
    },
    //검수량 전달 
    async inputRender(event) {
      this.secondIndex = event.rowIndex;

      this.secondRowData[this.secondIndex].quantity = event.data.quantity;

      let totalQuantity = this.secondRowData.reduce((sum, info, idx) => {
        if (info.quantity > 0) {
          sum += Number(info.quantity)
        }
        return sum
      }, 0);

      this.formData.quantity = Number(totalQuantity);
    },
    //수정
    async modifyFunc() {
      if (this.formData.prod_lot == '') {
        Swal.fire({
          title: '실패',
          text: '입고가 진행된 계획코드가 아닙니다.',
          icon: 'error',
          confirmButtonText: '확인'
        });
        return;
      }
      //출고건이 있는 지확인
      let delCount = await axios.get(`/api/sales/deliveryCount/${this.formData.prod_lot}`)
        .catch((err) => console.log(err));

      if (delCount.data[0].count > 0) {
        Swal.fire({
          title: '정보',
          text: '이미 출고가 진행된 LOT입니다.',
          icon: 'info',
          confirmButtonText: '확인'
        });
        return;
      }
      //값을 다입력했는지 체크
      if (this.formData.prod_code == '' || this.formData.storage_code == '' || this.formData.quantity == 0 || this.formData.quantity == '') {
        Swal.fire({
          title: '실패',
          text: '해당하는 값을 다입력해주세요',
          icon: 'error',
          confirmButtonText: '확인'
        });
        return;
      }
      let res = await axios.get('/api/sales/checkCount/' + this.formData.prod_check_code)
        .catch((err) => console.log(err));

      if (Number(res.data[0].COUNT) < 1) {
        Swal.fire({
          title: '정보',
          text: '입고가 진행된 계획코드가 아닙니다.',
          icon: 'info',
          confirmButtonText: '확인'
        });
        return
      }
      //수정진행
      await axios.put('/api/sales/finishUpdate/', this.formData)
        .then(res => {
          if (res.data.affectedRows > 0) {
            Swal.fire({
              title: '성공',
              text: '제품 입고가 정상적으로 등록되었습니다.',
              icon: 'success',
              confirmButtonText: '확인'
            });
            this.clearForm();
            this.finishedList();
          } else {
            Swal.fire({
              title: '정보',
              text: '제품입고가 이 정상적 등록되지지 않았습니다.',
              icon: 'info',
              confirmButtonText: '확인'
            });
            return;
          }
        })
        .catch((err) => {
          Swal.fire({
            title: '실패',
            text: '제품 입고 수정중 오류가 발생했습니다.',
            icon: 'error',
            confirmButtonText: '확인'
          });
          console.log(err)
        });
    },
    //삭제
    async deleteFunc() {
      if (this.formData.prod_lot == '') {
        Swal.fire({
          title: '실패',
          text: '입고가 진행된 계획코드가 아닙니다.',
          icon: 'error',
          confirmButtonText: '확인'
        });
        return;
      }
      //출고건이 있는 지확인
      let delCount = await axios.get(`/api/sales/deliveryCount/${this.formData.prod_lot}`)
        .catch((err) => console.log(err));

      if (delCount.data[0].count > 0) {
        Swal.fire({
          title: '정보',
          text: '이미 출고가 진행된 LOT입니다.',
          icon: 'info',
          confirmButtonText: '확인'
        });
        return;
      }
      let res = await axios.get('/api/sales/checkCount/' + this.formData.prod_check_code)
        .catch((err) => console.log(err));

      if (Number(res.data[0].COUNT) < 1) {
        Swal.fire({
          title: '정보',
          text: '입고가 진행된 계획코드가 아닙니다.',
          icon: 'info',
          confirmButtonText: '확인'
        });
        return
      }
      await axios.delete(`/api/sales/finishDelete/${this.formData.prod_lot}`)
        .then(res => {
          if (res.data.affectedRows > 0) {
            Swal.fire({
              title: '성공',
              text: '제품 입고가 정상적으로 등록되었습니다.',
              icon: 'success',
              confirmButtonText: '확인'
            });
            this.clearForm();
            this.finishedList();
          } else {
            Swal.fire({
              title: '정보',
              text: '제품입고가 이 정상적 등록되지지 않았습니다.',
              icon: 'info',
              confirmButtonText: '확인'
            });
            return;
          }
        })
        .catch((err) => {
          Swal.fire({
            title: '실패',
            text: '제품 입고 수정중 오류가 발생했습니다.',
            icon: 'error',
            confirmButtonText: '확인'
          });
          console.log(err)
        });

    }
  }
}
</script>
<style scoped>
.input-group-text {
  background-color: #FFCC80;
  border-color: #FFCC80;
}
</style>