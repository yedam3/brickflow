<template>
  <!-- 주문관리-->
  <div class="card border-0 h-100">
    <div class="font-semibold text-xl mb-4">주문 관리</div>

    <div class="text-end mt-3 mb-3">
      <Button label="조회" severity="success" class="me-3" @click="orderList" />
      <Button label="등록" severity="info" class="me-3" @click="addOrder" />
      <Button label="수정" severity="help" class="me-3" @click="modifyOrder" />
      <Button label="삭제" severity="danger" class="me-5" @click="deleteOrder" />
    </div>

    <!--메인 그리드-->
    <ag-grid-vue class="ag-theme-alpine" style="width: 100%; 
    height: 150px;" :columnDefs="columnDefs" :rowData="rowData" :gridOptions="gridOptions"
      :defaultColDef="defaultColDef" @cellClicked="comCellClicked">
    </ag-grid-vue>
  </div>


  <!-- 주문 상세 그리드-->
  <div class="card border-0 h-100">
    <div class="font-semibold text-xl mb-4">
      <h4 class="text-start">주문 상세</h4>
    </div>
    <div class="text-end mt-3 mb-3 ">
      <Button label="행추가" severity="success" class="me-3" @click="addRow" />
      <Button label="행삭제" severity="danger" class="me-5" @click="deleteRow" />
    </div>

    <ag-grid-vue ref="secondGrid" class="ag-theme-alpine" style="width: 100%; 
    height: 150px;" :columnDefs="columnDefss" :rowData="secondRowData" :gridOptions="gridOptions"
      :defaultColDef="defaultColDef">
    </ag-grid-vue>
  </div>


  <!-- 업체 모달창-->
  <ProdComModal :visible="showComModal" rowSelection="multiple" @close="showComModal = false" @selectCom="comSelected">
  </ProdComModal>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import DatePickerEditor from "../../../components/DatePickerEditor.vue";
import axios from 'axios';
import ProdComModal from "@/components/modal/ProdComModal.vue";
import Swal from 'sweetalert2';

export default {
  components: {
    AgGridVue,
    datePicker: DatePickerEditor,
    ProdComModal,
    Swal,
  },
  data() {
    return {
      rowData: [{
        orders_no: '',
        order_name: '',
        orders_date: this.getToday(),
        sdel_date: '',
        employee_code: '',
        company_name: '',
        note: '',
      }
      ],
      //메인그리드
      columnDefs: [
        { field: 'orders_no', headerName: '주문번호', flex: 3, },
        { field: 'order_name', headerName: '주문명', flex: 2, editable: true },
        { field: 'orders_date', headerName: '주문일자', flex: 3, editable: true },
        { field: 'del_date', headerName: '납기일자', flex: 3, editable: true },
        { field: 'employee_code', headerName: '등록자', flex: 2 },
        { field: 'company_name', headerName: '업체명', flex: 2 },
        { field: 'note', headerName: '비고', flex: 2, editable: true },
      ],
      //상세그리드
      secondRowData: [{
        orders_no: '',
        prod_code: '',
        prod_name: '',
        quantity: '',
        totalorderprice: '',
        note: '',
      }
      ],
      columnDefss: [
        //체크박스 
        { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
        { field: 'orders_no', headerName: '주문번호', flex: 2, },
        { field: 'prod_code', headerName: '제품코드', flex: 2, editable: true },
        { field: 'prod_name', headerName: '제품명', flex: 2, editable: true },
        {
          field: 'quantity', headerName: '수량', flex: 2, editable: true,
          valueFormatter: (params) => {
            return params.value != null ? `${params.value}개` : '';
          }
        },
        { field: 'totalorderprice', headerName: '총주문 금액', flex: 3 },
        { field: 'note', headerName: '비고', flex: 3 },
      ],
      gridOptions: {
        domLayout: "autoHeight", //행을 보고 자동으로 hight부여
        singleClickEdit: true, //한번클릭했을때 수정
        suppressRowClickSelection: true, //	행 클릭할 때 체크박스 선택 방지
        defaultColDef: {
          suppressMovable: true, //셀 이동 금지
          resizable: false, // 열 크기 조정 가능
          sortable: false, //정렬 금지
          cellStyle: { textAlign: "center" },
          headerClass: "header-center",
          // gridOptions: {
      //   pagination: true,
      //   paginationPageSize: 5,
      //   paginationPageSizeSelector: [5, 10, 20, 50],
      //   overlayNoRowsTemplate: '표시할 값이 없습니다.',
       
      // }
        },
      },

      showComModal: false,
      //메인그리드 행 인덱스 ary
      selectedRowIndexes: [],
      //상세그리드 행 인덱스
      selectedSecondIndex: null,
    };
  },

  mounted() {
    //  this.autosalescode();
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
    //현재날짜 가져오기
    getToday() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하니까 +1
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;  // "2025-04-27" 형식
    },
    //행추가
    addRow() {
      this.secondRowData.push({
        orders_no: "",
        prod_code: "",
        prod_name: "",
        quantity: 0,
        totalorderprice: "",
        note: "",
      })
      // 새 배열로 설정하여 AG Grid가 반영하게 만듬
      this.secondRowData = [...this.secondRowData];
    },
    //행삭제
    deleteRow() {
      const selectedNodes = this.$refs.secondGrid.api.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);

      // secondRowData에서 선택된 행을 제외한 나머지만 남긴다
      this.secondRowData = this.secondRowData.filter(row => !selectedData.includes(row));
    },
    //주문등록
    async addOrder() {
      const res = await axios.post('/api/sales/orderCheck', {
       
          orderCode: this.rowData[0].sales_order_code
       
      })
        .catch((err) => console.log(err));
      if (res.data[0].checkCount > 0) {
        Swal.fire({
          title: '등록 실패',
          text: '이미 등록이 진행중 입니다.',
          icon: 'error',
          confirmButtonText: '확인'
        });
        return;
      }
      if (this.fullCheck() == 1) {
        return;
      } else if (this.fullCheck() == 2) {
        return;
      }
      //등록
      axios.post('/api/sales/salesOrderAdd', {
        salesOrder: this.rowData[0],
        salesOrderDetail: this.secondRowData
      })
        .then(res => {
          if (res.data.affectedRows > 0) {
            Swal.fire({
              title: '등록 성공',
              text: '정상적으로 등록이 완료되었습니다.',
              icon: 'success',
              confirmButtonText: '확인'
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
      this.rowData = [{
        orders_no: '',
        order_name: '',
        orders_date: this.getToday(),
        sdel_date: '',
        employee_code: '',
        company_name: '',
        note: '',
      }];
      this.columnDefss = [{
        orders_no: '',
        prod_code: '',
        prod_name: '',
        quantity: '',
        totalorderprice: '',
        note: '',
      }];
    }
  }
  };
</script>

<style>
 :root .ag-theme-alpine .ag-header{
  background-color: #e0a72a;
 }
</style>