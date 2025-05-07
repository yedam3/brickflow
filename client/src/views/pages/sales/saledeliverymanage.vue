

<template>
  <!--출고 관리 그리드-->
  <div class="card border-0 h-100">
    <div class="font-semibold text-xl mb-4">출고 관리</div>
    <div class="text-end mt-3 mb-3">
      <Button label="주문조회" severity="success" class="me-3" @click="orderList" />
      <Button label="등록" severity="info" class="me-3" @click="addDelivery" />
      <Button label="수정" severity="help" class="me-3" @click="modifyOrder" />
      <Button label="삭제" severity="danger" class="me-5" @click="deliveryDelete" />
    </div>
    <ag-grid-vue class="ag-theme-alpine" style="width: 100%; 
    height: 150px;" :columnDefs="columnDefs" :rowData="rowData" :gridOptions="gridOptions"
      :defaultColDef="defaultColDef" @cellClicked="comCellClicked">
    </ag-grid-vue>
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

  <!-- 주문 목록 조회 모달창 -->
  <OrderModal ref="orderModal" :visible="showOrderModal" @close="showOrderModal = false" @selectOrder="orderSelected">
  </OrderModal>

  <!-- 업체 모달창-->
  <ProdComModal :visible="showComModal" rowSelection="multiple" @close="showComModal = false" @selectCom="comSelected">
  </ProdComModal>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import OrderModal from '@/components/modal/OrderModal.vue';
import ProdComModal from "@/components/modal/ProdComModal.vue";
import Swal from 'sweetalert2'; 

export default {
  components: {
    AgGridVue,
    OrderModal,
    ProdComModal,
    Swal,
   
  },
  data() {
    return {
      // 메인 그리드
      rowData: [{
        delivery_code: '',
        delivery_name: '',
        orders_code: '',
        order_name:'',
        company_code:'',
      }],
      columnDefs: [
        { field: 'delivery_code', headerName: '출고코드', flex: 3,  },
        { field: 'delivery_name', headerName: '출고명', flex: 3, editable: true },
        { field: 'orders_code', headerName: '주문코드', flex: 3, },
        { field: 'order_name', headerName: '주문명', flex: 3, editable: true },
        { field: 'company_name', headerName: '업체명', flex: 3},
      ],

      //주문요구 수량 그리드
      serowData: [{
        prod_code: '',
        prod_name: '',
        demand: '',
        alreadydelivery: '',
        proyetdeliveryd_code: '',
        delivery_quantity: '',
      }],
      seColumnDefs: [
        { field: "prod_code", headerName: "제품코드", flex: 2, cellStyle: { textAlign: "center" } },
        { field: "prod_name", headerName: "제품명", flex: 2, editable: true, cellStyle: { textAlign: "center" } },
        { field: "demand", headerName: "요구량", flex: 2, cellStyle: { textAlign: "center" } },
        { field: "alreadydelivery", headerName: "기납기량", flex: 2, cellStyle: { textAlign: "center" } },
        { field: "yetdelivery", headerName: "미납기량", flex: 2, editable: true, cellStyle: { textAlign: "center" } },
        { field: "delivery_quantity", headerName: "출고량", flex: 2, editable: true, cellStyle: { textAlign: "center" } },
      ],
      throwData: [{
        prod_prod_LOT: '',
        prod_code: '',
        prod_name: '',
        delivery_before_quantity: '',
        delivery_quantity: '',
      }],
      thColumnDefs: [
        { field: "prod_LOT", headerName: "제품LOT", flex: 2, cellStyle: { textAlign: "center" } },
        { field: "prod_code", headerName: "제품코드", flex: 2, editable: true, cellStyle: { textAlign: "center" } },
        { field: "prod_name", headerName: "제품명", flex: 2, cellStyle: { textAlign: "center" } },
        { field: "delivery_before_quantity", headerName: "출고 가능 수량", flex: 2, cellStyle: { textAlign: "center" } },
        { field: "delivery_quantity", headerName: "출고수량", flex: 2, editable: true, cellStyle: { textAlign: "center" } },
      ],
      showOrderModal: false,
      showComModal: false,
      selectedRowIndexes: [],
      //상세그리드 행 인덱스
      selectedSecondIndex: null,
    };
  },
   
  mounted() {
    
  },
  methods: {
    // 사이트 접속시  자동증가
    async autosalescode() {
      const result = await axios.get(`/api/sales/comList`);
      this.rowData[0].sales_order_code = result.data[0].sales_order_code;
      //this.secondRowData[0].sales_order_code = result.data[0].sales_order_code;
    },
    //업체명을 클릭했을때 모달창 열기 comCellClicked
    comCellClicked(params) {
      if (params.colDef.field == "company_name") {
        this.selectedSecondIndex = params.rowIndex;
        this.showComModal = true;
      }
    },
    //업체 모달창 값 전달
    comSelected(com) {
      this.rowData[0].company_code = com.company_code;
      this.rowData[0].company_name = com.company_name;
      // 새 배열로 설정하여 AG Grid가 반영하게 만듬
      this.rowData = [...this.rowData];
    },

    // 주문 모달창
    orderList() {
      this.showOrderModal = true;
    },
    //주문 목록 조회
    async orderSelected(order) {
      console.log(order)
      // await axios.get(`/api/sales/orders/:orders_code`, {
      await axios.get(`/api/sales/orders/${order.orders_code}`)
        .then(res => {
          console.log(res.data);
          const serverRowData = res.data;
          //this.rowData[0].orders_code = res.orders_code;
          this.rowData = [serverRowData];

        })
        .catch((err) => console.log(err));

      //상세 그리드로 전달
      await axios.get('/api/sales/detail', {
        params: {
          orders_code: order.orders_code
        }
      })
        .then(res => {
          this.serowData = res.data;
        })
    },
    fullCheck() {
      //메인그리드 값 다들어 갔는지 체크
      if (this.rowData[0].company_code == '' || this.rowData[0].company_name == '',
        this.rowData[0].delivery_date == '' || this.rowData[0].request_date == '',
        this.rowData[0].order_name == '') {
        Swal.fire({
          title: '실패',
          text: '해당하는 값을 입력해주십시오.',
          icon: 'error',
          confirmButtonText: '확인'
        });
        return 1;
      } else if (this.rowData[0].delivery_date < this.rowData[0].request_date) {
        Swal.fire({
          title: '실패',
          text: '납기일자가 주문일자보다 빠릅니다.',
          icon: 'error',
          confirmButtonText: '확인'
        });
        return 2;
      }
      //상세그리드 값 다들어 갔는지 체크
      for (let rowInclude of this.secondRowData) {
        if (rowInclude.orders_code == '' || rowInclude.order_name, rowInclude.prod_code == 0) {
          Swal.fire({
            title: '실패',
            text: '값을 다입력하십시오',
            icon: 'error',
            confirmButtonText: '확인'
          });
          return 1;
        }
      }
    },
    async addDelivery() {
  // 1. 출고 코드 자동 생성 요청 
  const deliveryCodeResponse = await axios.get('/api/sales/deliveryAdd')
    .catch((err) => {
      console.log(err);
      Swal.fire({
        title: '출고 코드 생성 실패',
        text: '출고 코드 생성에 실패했습니다.',
        icon: 'error',
        confirmButtonText: '확인'
      });
      return;
    });

  if (!deliveryCodeResponse || !deliveryCodeResponse.data) {
    return;
  }

  // 자동 생성된 출고 코드 받기
  const deliveryCode = deliveryCodeResponse.data.code;

  // 2. 주문 코드 중복 여부 체크
  try {
    const res = await axios.post('/api/sales/deliveryCheck', {
      deliveryCode: this.rowData[0].delivery_code
    });

    if (!res.data || !Array.isArray(res.data) || res.data.length === 0) {
      Swal.fire({
        title: '출고 코드 확인 실패',
        text: '응답 데이터가 잘못되었습니다.',
        icon: 'error',
        confirmButtonText: '확인'
      });
      return;
    }

    if (res.data[0].checkCount > 0) {
      Swal.fire({
        title: '등록 실패',
        text: '이미 등록이 진행중입니다.',
        icon: 'error',
        confirmButtonText: '확인'
      });
      return;
    }
  } catch (err) {
    console.error('Order Check Error:', err);
    Swal.fire({
      title: '출고 코드 확인 실패',
      text: '알 수 없는 오류가 발생했습니다.',
      icon: 'error',
      confirmButtonText: '확인'
    });
    return;
  }

    // //출고등록
    // async addDelivery() {
    //   const res = await axios.post('/api/sales/deliveryCheck', {
    //     deliveryCode: this.rowData[0].delivery_code

    //   })
    //     .catch(err) { console.error('Order Check Error:', err);
    //     Swal.fire({
    //       title: '출고 코드 확인 실패',
    //       text: '알 수 없는 오류가 발생.',
    //       icon: 'error',
    //       confirmButtonText: '확인'
    //     });
    //     return;
    //   }
      //출고 등록
      axios.post('/api/sales/deliveryAdd', {
        deliveryCode: this.rowData[0],
        salesOrderDetail: this.serowData
      })
        .then(res => {
          if (res.data.affectedRows > 0) {
            Swal.fire({
              title: '등록 성공',
              text: '정상적으로 등록이 완료되었습니다.',
              icon: 'success',
              confirmButtonText: '확인'
            });
            this.$refs.orderModal.orderList();
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
      this.rowData = [{
        delivery_code: '',
        delivery_code: '',
        orders_code: '',
        order_name: '',
        company_code: '',
      }],
        this.serowData = [];

    },
    //삭제
    async deliveryDelete() {
      await axios.delete('/api/sales/deliveryDelete/' + this.rowData[0].delivery_code)
        .then((res) => {
          if (res.data.affectedRows < 1) {
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
            this.rowData = [{
              orders_code: "",
              order_name: "",
              orders_date: this.getToday(),
              sdel_date: "",
              employee_code: "",
              company_code: "",
              note: "",
            }];
            this.secondRowData = [{
              orders_code: '',
              prod_code: '',
              prod_name: '',
              quantity: '',
              totalorderprice: '',
              note: '',
            }]
          }
        })
        .catch((err) => console.log(err));

    }
    
  }
}
</script>

<style>
 :root .ag-theme-alpine .ag-header{
  background-color: #e0a72a;
 }
 
</style>