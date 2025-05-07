<template>
  <div class="card border-0 h-100">
    <div class="font-semibold text-xl mb-4">완제품 관리</div>
    <div class="font-semibold text-l mb-4">완제품 입고</div>
    <div class="text-end mt-3 mb-3">
      <Button label="조회" severity="success" class="me-3" @click="orderList" />
      <Button label="등록" severity="info" class="me-3" @click="" />
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
                  완제품 입고코드
                </InputGroupAddon>
                <InputText v-model="formData.plan_name" size="large" placeholder="(입력)" />
              </InputGroup>
            </div>
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  담당자
                </InputGroupAddon>
                <InputText v-model="formData.orders_code" size="large" placeholder="" readonly />
              </InputGroup>
            </div>
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  입고일자
                </InputGroupAddon>
                <InputText v-model="formData.order_name" size="large" placeholder="" readonly />
              </InputGroup>
            </div>
          </div>

          <div class="mb-5 row">
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  제품명
                </InputGroupAddon>
                <InputText v-model="formData.plan_name" size="large" placeholder="(입력)" />
              </InputGroup>
            </div>
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  제품코드
                </InputGroupAddon>
                <InputText v-model="formData.orders_code" size="large" placeholder="" readonly />
              </InputGroup>
            </div>
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  제품수량
                </InputGroupAddon>
                <InputText v-model="formData.plan_name" size="large" placeholder="(입력)" />
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
          :defaultColDef="defaultColDef">
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
  <StoreList
        :visible="showModal"
        rowSelection="multiple"
        @close="showModal = false"
        @selectOrder="orderSelected"
   ></StoreList>

   <!-- 주문 목록 조회 모달창 -->
  <OrderModal ref="orderModal" :visible="showOrderModal" @close="showOrderModal = false" @selectOrder="orderSelected">
  </OrderModal>
</template>
<script>
import { AgGridVue } from "ag-grid-vue3";
import StoreList from '@/components/modal/StoreList.vue';
import OrderModal from '@/components/modal/OrderModal.vue';

export default{
    components:{
         AgGridVue,
          StoreList,
          OrderModal
    },
  data() {
    return {
      formData: {
        plan_code: "",      // 생산계획_코드
        orders_code: "",    // 주문_코드
        plan_name: "",      // 생산계획명
        employee_code: "",  // 담당자
        start_date: "",     // 시작_일자
        end_date: "",       // 종료_일자
        finish_status: "",  // 처리_상태
        note: "",           // 비고
      },
      showOrderModal: false,
    }
  },
  mounted() {
    //  this.autosalescode();
  },

  methods: {
    // 주문 모달창
    orderList() {
      this.showOrderModal = true;
    },
  }
}
</script>
<style>
.input-group-text {
  background-color: #FFCC80;
  border-color: #FFCC80;
}
</style>