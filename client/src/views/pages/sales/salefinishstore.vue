<template>
  <div class="card border-0 h-100">
    <div class="font-semibold text-xl mb-4">완제품 관리</div>
    <div class="font-semibold text-l mb-4">완제품 입고</div>
    <div class="text-end mt-3 mb-3">
      <Button label="조회" severity="success" class="me-3" @click="orderList" />
      <Button label="등록" severity="info" class="me-3" @click="addFunc" />
      <Button label="수정" severity="help" class="me-3" @click="" />
      <Button label="삭제" severity="danger" class="me-5" @click="" />
    </div>
    <div class="mb-3">
      <Card style="overflow: hidden; background-color: #f8f9fa;">
        <template #content>
          <div class="mb-5 row">
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  LOT 번호
                </InputGroupAddon>
                <InputText v-model="formData.prod_lot" size="large" placeholder="(입력)" />
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
                <InputText v-model="formData.prod_name" size="large" placeholder="(입력)" />
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
                <InputText v-model="formData.quantity" size="large" placeholder="(입력)" />
              </InputGroup>
            </div>
            <div class="col-3">
              <InputGroup>
                <InputGroupAddon>
                  제품수량
                </InputGroupAddon>
                <select class="form-select col" aria-label="Default select example" v-model="formData.storage_code">
                            <option disabled selected value="">창고</option>
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
  </div>
  <div class="row">
    <div class="col-6">
      <div class="row">
        <div class="col">
          <div class="font-semibold text-xl mb-4">주문 요구 수량</div>
        </div>
        <div class="col text-end">
        </div>
      </div>
      <div class="ag-wrapper justify-content-center" style="border: none;">

        <ag-grid-vue class="ag-theme-alpine" style="width: 100%; 
        height: 200px;" :columnDefs="seColumnDefs" :rowData="serowData" :gridOptions="gridOptions"
          :defaultColDef="defaultColDef" >
        </ag-grid-vue>
        
      </div>
    </div>
    <div class="col-6">
      <div class="font-semibold text-xl mb-4">출고 가능 수량</div>
      <div class="ag-wrapper justify-content-center" style="border: none;">

        <ag-grid-vue class="ag-theme-alpine" style="width: 100%; 
        height: 200px; " :columnDefs="thColumnDefs" :rowData="throwData" :gridOptions="gridOptions"
          :defaultColDef="defaultColDef">
        </ag-grid-vue>

      </div>
    </div>
  </div>
  <CheckSuccess
        :visible="showOrderModal"
        rowSelection="multiple"
        @close="showOrderModal = false"
        @selectOrder="orderSelected"
        
   ></CheckSuccess>

   <!-- 주문 목록 조회 모달창 -->
</template>
<script>
import { AgGridVue } from "ag-grid-vue3";
import CheckSuccess from "@/components/modal/CheckSuccess.vue";
import { useUserStore } from '@/stores/user';
import axios from "axios";
import Swal from 'sweetalert2';
export default{
    components:{
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
        emp_code:  useUserStore().id,
        store_date: this.getToday(),// 입고 일자
        storage_code : '',
        prod_check_code:''
      },
      storeListAry : [],
      showOrderModal: false,
    }
  },
   mounted(){
  const raw = this.$route.query.data;
  if(raw){
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
  this.storeList();
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
    orderSelected(value){
      this.formData.prod_name = value.prod_name;
      this.formData.prod_code = value.prod_code;
      this.formData.quantity = value.pass_quantity;
      this.formData.prod_check_code = value.prod_check_code;
    },
    //초기화
    async clearForm(){
      this.formData =  {
        prod_lot: "", // 제품 LOT
        work_lot: "", // 생산 LOT
        quantity: "", //입고 수량
        prod_name: "", //제품명
        prod_code: "", //제품 코드
        emp_name: useUserStore().empName,
        emp_code:  useUserStore().id,
        store_date: this.getToday(),// 입고 일자
        storage_code : '',
        prod_check_code:''
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
    async addFunc(){
      //등록건인지체크
      if(this.formData.prod_lot != ''){
        Swal.fire({
                    title: '실패',
                    text: '이미 등록이 진행된 계획코드입니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
          return;
      }
      //값을 다입력했는지 체크
      if(this.formData.prod_code=='',this.storage_code==''){
        Swal.fire({
                    title: '실패',
                    text: '해당하는 값을 다입력해주세요',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
          return;
      }
      //등록 진행
      axios.post('/api/sales/addFinished',this.formData)
           .then(res => {
            if(res.data.affectedRows > 0) {
                    Swal.fire({
                        title: '성공',
                        text: '제품 입고가 정상적으로 등록되었습니다.',
                        icon: 'success',
                        confirmButtonText: '확인'
                    });
                    this.clearForm();
                } else {
                    Swal.fire({
                    title: '정보',
                    text: '제품입고가 이 정상적 등록되지지 않았습니다.',
                    icon: 'info',
                    confirmButtonText: '확인'
                });
                }
           }).catch(err => {
                console.error(err);
                Swal.fire({
                    title: '실패',
                    text: '생산 계획 등록 중 오류가 발생했습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
            });
    }
  }
}
</script>
<style>
.input-group-text {
  background-color: #FFCC80;
  border-color: #FFCC80;
}
</style>