<template>
  <div class="card border-0 h-100">
    <div class="font-semibold text-xl mb-4">판매 이력</div>

    <div class="text-end mt-3 mb-3">
      <Button label="조회" severity="success" class="me-3" @click="deliverytList" />
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
                  업체명
                </InputGroupAddon>
                <InputText v-model="formData.company_name" size="large" placeholder="" />
              </InputGroup>
            </div>
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  제품명
                </InputGroupAddon>
                <InputText v-model="formData.prod_name" size="large" placeholder="" readonly />
              </InputGroup>
            </div>
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  주문번호
                </InputGroupAddon>
                <InputText v-model="formData.orders_code" size="large" placeholder="" readonly />
              </InputGroup>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!--메인 그리드-->
    <ag-grid-vue class="ag-theme-alpine custom-grid-theme" :columnDefs="columnDefs" :rowData="formData"
      :gridOptions="gridOptions">
    </ag-grid-vue>
  </div>

  <div class="card border-0 h-100">
    <div class="font-semibold text-xl mb-4">반품 관리</div>
    <div class="mb-3">
      <Card style="overflow: hidden; background-color: #f8f9fa;">
        <template #content>
          <div class="mb-5 row">
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  제품명
                </InputGroupAddon>
                <InputText v-model="formData.prod_name" size="large" placeholder="" />
              </InputGroup>
            </div>
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  업체명
                </InputGroupAddon>
                <InputText v-model="formData.company_name" size="large" placeholder="" readonly />
              </InputGroup>
            </div>
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  LOT번호
                </InputGroupAddon>
                <InputText v-model="formData.prod_LOT" size="large" placeholder="" readonly />
              </InputGroup>
            </div>
          </div>
          <div class="mb-5 row">
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  수량
                </InputGroupAddon>
                <InputText v-model="formData.delivery_quantity" size="large" placeholder="" readonly />
              </InputGroup>
            </div>
            <div class="col-4">
              <InputGroup>
                <InputGroupAddon>
                  판매일자
                </InputGroupAddon>
                <DatePicker v-model="formData.start_date" size="large" dateFormat="yy/mm/dd" placeholder="(입력)" showIcon
                  iconDisplay="input" />
              </InputGroup>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
  <!-- 출고 목록 조회 모달창 -->
  <DeliveryModal ref="deliveryModal" :visible="showDeliveryModal" @close="showDeliveryModal = false"
    @selectOrder="deliveryOrderSelected"></DeliveryModal>

</template>

<script>
import axios from "axios";
import { AgGridVue } from 'ag-grid-vue3';
import DeliveryModal from '@/components/modal/DeliveryModal.vue';
import Swal from 'sweetalert2';

export default {
  components: {
    AgGridVue,
    DeliveryModal, // 출고 모달
    Swal,
  },
  data() {
    return {
      // 메인 그리드
      formData: [
        // {
        // oreders_code: "",       // 주문 번호
        // prod_name: "",          // 제품명
        // company_name: "",       // 업체명
        // delivery_quantity: "",  // 수량
        // delivery_date: "",      // 판매일자  
        // prod_LOT: "",           // LOT번호
        // note: "",               // 비고
        // }
      ],
      columnDefs: [
        { field: "orders_code", headerName: "주문번호", flex: 1, cellStyle: { textAlign: "center" } },
        { field: "prod_name", headerName: "제품명", flex: 1, cellStyle: { textAlign: "center" } },
        { field: "company_name", headerName: "업체명", flex: 1, cellStyle: { textAlign: "center" } },
        { field: "delivery_quantity", headerName: "수량", flex: 1, cellStyle: { textAlign: "center" } },
        { field: "del_date", headerName: "판매일자", flex: 1, editable: true, cellStyle: { textAlign: "center" } },
        { field: "prod_LOT", headerName: "LOT번호", flex: 1, editable: true, cellStyle: { textAlign: "center" } },
        { field: "note", headerName: "비고", flex: 1, editable: true, cellStyle: { textAlign: "center" } },
      ],
      gridOptions: {
        domLayout: "autoHeight", //행을 보고 자동으로 hight부여
        singleClickEdit: true, //한 번 클릭 했을 때 수정
        suppressRowClickSelection: true, //	행 클릭할 때 체크박스 선택 방지
        defaultColDef: {
          suppressMovable: true, //셀 이동 금지
          resizable: false, // 열 크기 조정 가능
          sortable: false, //정렬 금지
        },
      },
      showDeliveryModal: false,
      selectedRowIndexes: [], //메인그리드 행 인덱스 ary
    };
  },
  mounted() { },

  methods: {


    // 출고 모달창
    deliverytList() {
      this.showDeliveryModal = true;
    },
    //출고 모달창 값 전달
    async deliveryOrderSelected(order) {
      await axios.get(`/api/sales/orders/${order.orders_code}`)
        .then(res => {
          for (let data of res.data) {
            this.formData.push({
              orders_code: data.orders_code,                                //주문 코드
              prod_name: data.prod_name,                                    //제품명
              company_name: data.company_name,                              //업체명  
              delivery_quantity: data.delivery_quantity,                    //수량
              del_date: data.del_date,                                      //출고 일자  
              prod_LOT: data.prod_LOT,                                      //LOT
              note: data.note,                                              //비고
            })
          }
          this.formData = [...this.formData];
          console.log(this.formData);
        })
        .catch((err) => console.log(err));
    },
  }
}

</script>