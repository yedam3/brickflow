<template>
  <div class="card border-0" style="height: 800px">
    <div class="font-semibold text-xl mb-4">자재발주관리</div>

    <div class="text-end mt-3 mb-3">
      <Button label="조회" severity="success" class="me-3" @click="matOrderList"/>
      <Button label="등록" severity="info" class="me-3" @click="addOrder"/>
      <Button label="수정" severity="help" class="me-3" @click="modifyOrder"/>
      <Button label="삭제" severity="danger" class="me-5" @click="deleteOrder"/>
    </div>

    <!-- 메인그리드 -->
    <div class="ag-wrapper d-flex justify-content-center">
      <ag-grid-vue
        class="ag-theme-alpine custom-grid-theme"
        style="width: 95%"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :gridOptions="gridOptions"
        @cellClicked="comCellClicked"
      >
      </ag-grid-vue>
    </div>
    <!-- 상세그리드-->
    <div class="text-end mt-5 ms-5 w-50">
      <h4 class="text-start">자재발주량</h4>
    </div>
    <div class="ag-wrapper float-start ms-5">
      <div class="text-end mb-3" style="width: 60%;">
      <Button label="행추가" severity="success" class="me-3" @click="addRow"/>
      <Button label="행삭제" severity="danger" class="me-5" @click="deleteRow"/>
    </div>
      <ag-grid-vue
        ref="secondGrid"
        class="ag-theme-alpine custom-grid-theme"
        style="width: 60%; height: 150px"
        :columnDefs="secondColumnDefs"
        :rowData="secondRowData"
        :gridOptions="gridOptions"
        rowSelection="multiple"
        @cellClicked="matCellClicked"
      >
      </ag-grid-vue>
    </div>
  </div>

<!--자재 모달창-->
  <MatModal
        :visible="showMatModal"
        rowSelection="multiple"
        @close="showMatModal = false"
        @selectMat="matSelected"
   ></MatModal>
   <!-- 업체 모달창-->
   <ComModal
        :visible="showComModal"
        rowSelection="multiple"
        @close="showComModal = false"
        @selectCom="comSelected"
   ></ComModal>
   <!-- 발주조회 모달창-->
   <MatOrderModal
        :visible="showOrderModal"
        rowSelection="multiple"
        @close="showOrderModal = false"
        @selectOrder="orderSelected"
   ></MatOrderModal>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import DatePickerEditor from "../../../components/DatePickerEditor.vue";
import axios from "axios";
import MatModal from "@/components/modal/MatModal.vue";
import ComModal from "@/components/modal/ComModal.vue";
import MatOrderModal from "@/components/modal/MatOrderModal.vue";
import Swal from 'sweetalert2';
export default {
  components: {
    AgGridVue,
    datePicker: DatePickerEditor,
    MatModal,
    ComModal,
    MatOrderModal,
    Swal
  },
  data() {
    return {
      //메인그리드
      rowData: [
        {
          mat_order_code: "",
          mat_order_name:"",
          company_code: "",
          company_name: "",
          request_date: this.getToday(),
          delivery_date: "",
          emp_code: "",
          note: "",
        },
      ],
      //메인그리드 필드
      columnDefs: [
      { field: "mat_order_code", headerName: "자재발주코드", flex: 2,},
      { field: "mat_order_name", headerName: "발주명", flex: 2,editable:true},
      { field: "company_code", headerName: "업체코드", flex: 2,},
      { field: "company_name", headerName: "업체명", flex: 2,},
      { field: "request_date", headerName: "발주일자", flex: 2 },
      { field: "delivery_date", headerName: "납기예정일", flex: 3, editable: true, cellEditor: "datePicker" },
      { field: "emp_code", headerName: "등록자", flex: 3 },
      { field: "note", headerName: "비고", flex: 3, editable: true},
      ],
      //상세그리드
      secondRowData: [
        {
          mat_order_detailcode: "",
          mat_code: "",
          mat_name: "",
          mat_order_code:'',
          request_quantity: 0,
        },
      ],
      //상세그리드 필드
      secondColumnDefs: [
        // 체크박스 추가
        { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
        { field: "mat_order_detailcode", headerName: "자재발주상세코드", flex: 2 },
        { field: "mat_order_code", headerName: "자재발주코드", flex: 2 },
        { field: "mat_code", headerName: "자재코드", flex: 3 },
        { field: "mat_name", headerName: "자재명", flex: 3 },
        { field: "request_quantity", headerName: "발주량", flex: 2, editable: true,
        valueFormatter: (params) => {
              return params.value != null ? `${params.value}개` : '';
            }
        },
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
        },
      },
      showMatModal: false,
      showComModal: false,
      showOrderModal:false,
      //메인그리드 행 인덱스 ary
      selectedRowIndexes: [],
      //상세그리드 행 인덱스
      selectedSecondIndex: null,
    };
  },
  mounted() {
    this.autoMatCode();
  },
  methods: {
    // 사이트 접속시 matCode 자동증가
    async autoMatCode() {
        const result = await axios.get("/api/mat/autoMatCode");
        this.rowData[0].mat_order_code = result.data[0].mat_order_code;
        this.secondRowData[0].mat_order_code = result.data[0].mat_order_code;
    },
    //자재코드를 클릭했을때 모달창 열기
    matCellClicked(params) {
      if (params.colDef.field == "mat_code" || params.colDef.field == "mat_name") {
        this.selectedSecondIndex = params.rowIndex;
        this.showMatModal = true;
      }
    },
    //업체코드를 클릭했을때 모달창 열기 comCellClicked
    comCellClicked(params) {
      if (params.colDef.field == "company_code"||params.colDef.field == "company_name") {
        this.selectedSecondIndex = params.rowIndex;
        this.showComModal = true;
      }
    },
    //자재 모달창 값 전달
    matSelected(mat) {
      for (let rowInclude of this.secondRowData) {
        if (rowInclude.mat_code == mat.mat_code) {
          Swal.fire({
            title: '실패',
            text: '같은 자재를 기입할 수 없습니다.',
            icon: 'error',
            confirmButtonText: '확인'
          });
          return;
        }
      }
      this.secondRowData[this.selectedSecondIndex].mat_code = mat.mat_code;
      this.secondRowData[this.selectedSecondIndex].mat_name = mat.mat_name;
      // 새 배열로 설정하여 AG Grid가 반영하게 만듬
      this.secondRowData = [...this.secondRowData];
    },
    //업체 모달창 값 전달
    comSelected(com) {
      this.rowData[0].company_code = com.company_code;
      this.rowData[0].company_name = com.company_name;
      //새 배열로 설정하여 AG Grid가 반영하게 만듬
      this.rowData = [...this.rowData];
    },
    //행추가
   addRow(){
    this.secondRowData.push({  mat_order_detailcode: "",
                               mat_code: "",
                               mat_name: "",
                               mat_order_code: this.rowData[0].mat_order_code,
                               request_quantity: 0,})
  //새 배열로 설정하여 AG Grid가 반영하게 만듬
     this.secondRowData = [...this.secondRowData];  
   },
   //행삭제
    deleteRow() {
      const selectedNodes = this.$refs.secondGrid.api.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);

      // secondRowData에서 선택된 행을 제외한 나머지만 남긴다
      this.secondRowData = this.secondRowData.filter(row => !selectedData.includes(row));
    },
    //현재날짜 가져오기
    getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); //월은 0부터 시작하니까 +1
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;  //"2025-04-27" 형식
  },
    //값이 다있는지 체크
    fullCheck(){
      //메인그리드 값 다들어 갔는지 체크
      if(this.rowData[0].company_code==''||this.rowData[0].company_name=='',
         this.rowData[0].delivery_date==''||this.rowData[0].request_date=='',
         this.rowData[0].mat_order_name=='')
      {
        Swal.fire({
          title: '실패',
          text: '해당하는 값을 입력해주십시오.',
          icon: 'error',
          confirmButtonText: '확인'
        });
        return 1;
      }else if(this.rowData[0].delivery_date<this.rowData[0].request_date){
        Swal.fire({
          title: '실패',
          text: '납기일자가 발주신청일자보다 빠릅니다.',
          icon: 'error',
          confirmButtonText: '확인'
        });
        return 2;
      }
      //상세그리드 값 다들어 갔는지 체크
      for (let rowInclude of this.secondRowData){
        if(rowInclude.mat_code==''||rowInclude.mat_name=='',rowInclude.request_quantity==0){
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
    //주문등록
    async addOrder(){
      const res = await axios.get('/api/mat/orderCheck', {
          params: {
            orderCode: this.rowData[0].mat_order_code
          }
        })
        .catch((err)=> console.log(err));
        if (res.data[0].checkCount > 0) {
          Swal.fire({
            title: '등록 실패',
            text: '이미 등록이 진행된 발주코드입니다.',
            icon: 'error',
            confirmButtonText: '확인'
          });
          return;
        }
      if(this.fullCheck()==1){
        return;
      }else if(this.fullCheck()==2){
        return;
      }
      //등록
       axios.post('/api/mat/matOrderAdd', {
        matOrder: this.rowData[0],
        matOrderDetail: this.secondRowData
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
          mat_order_code: "",
          mat_order_name: "",
          company_code: "",
          company_name: "",
          request_date: this.getToday(),
          delivery_date: "",
          emp_code: "",
          note: "",
        }];
        this.secondRowData = [{
          mat_order_detailcode: "",
          mat_code: "",
          mat_name: "",
          mat_order_code: '',
          request_quantity: 0,
        }];
        this.autoMatCode();
    },
    //주문 조회 모달창 띄우기
    matOrderList(){
      this.showOrderModal = true;
    },
    //발주그리드 값 전달
    async orderSelected(order) {
      //메인그리드로 전달 ajax
      await axios.get('/api/mat/render', {
        params: {
          orderCode: order.mat_order_code
        }
      })
        .then(res => {
          console.log('받아온 데이터:', res.data);
          const data = res.data;

          // 여기서 날짜 필드 가공
          data.forEach(item => {
            if (item.request_date) {
              // "YYYY-MM-DD"로
              item.request_date = item.request_date.substring(0, 10);
            }
            if (item.delivery_date) {
              // "YYYY-MM-DD"로
              item.delivery_date = item.delivery_date.substring(0, 10);
            }
          });

          this.rowData = data;
        })
        .catch((err) => console.log(err));
      //상세 그리드로 전달 ajax
      await axios.get('/api/mat/detailRender',{
        params: {
          orderCode: order.mat_order_code
        }
      })
      .then(res => {
        this.secondRowData = res.data;
      })
    },
    //수정
    async modifyOrder() {
      const res = await axios.get('/api/mat/orderCheck', {
        params: {
          orderCode: this.rowData[0].mat_order_code
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
      //값 다 들어가있는지 체크
      if (this.fullCheck() == 1) {
        return;
      } else if (this.fullCheck() == 2) {
        return;
      }
    //수정시작
     await axios.put('/api/mat/modify',{
       matOrder : this.rowData[0],
       matOrderDetail : this.secondRowData
     })
     .then(res => {
        if(res.data.affectedRows >0) {
          Swal.fire({
            title: '수정 완료',
            text: '수정이 완료되었습니다.',
            icon: 'success',
            confirmButtonText: '확인'
          });
          
        }else{
          Swal.fire({
            title: '수정 실패',
            text: '수정을 실패하였습니다.',
            icon: 'error',
            confirmButtonText: '확인'
          });
          return;
        }
     })
     .catch(err =>{
       console.error(err);
       Swal.fire({
         title: '수정 실패',
         text: '알수 없는 에러.',
         icon: 'error',
         confirmButtonText: '확인'
       });
       return
     });
     this.rowData = [{
          mat_order_code: "",
          mat_order_name: "",
          company_code: "",
          company_name: "",
          request_date: this.getToday(),
          delivery_date: "",
          emp_code: "",
          note: "",
        }];
        this.secondRowData = [{
          mat_order_detailcode: "",
          mat_code: "",
          mat_name: "",
          mat_order_code: '',
          request_quantity: 0,
        }];
        this.autoMatCode();
    },
    //삭제
    async deleteOrder(){
      await axios.delete('/api/mat/delete/'+this.rowData[0].mat_order_code)
      .then((res)=>{
        if(res.data.affectedRows <1){
          Swal.fire({
            title: '삭제 실패',
            text: '삭제 실패 하였습니다.',
            icon: 'error',
            confirmButtonText: '확인'
          });
        }else{
          Swal.fire({
            title: '삭제 완료',
            text: '정상적으로 삭제가 완료되었습니다.',
            icon: 'success',
            confirmButtonText: '확인'
          });
        }
      })
      .catch((err) => console.log(err));
      this.rowData = [{
          mat_order_code: "",
          mat_order_name: "",
          company_code: "",
          company_name: "",
          request_date: this.getToday(),
          delivery_date: "",
          emp_code: "",
          note: "",
        }];
        this.secondRowData = [{
          mat_order_detailcode: "",
          mat_code: "",
          mat_name: "",
          mat_order_code: '',
          request_quantity: 0,
        }];
        this.autoMatCode();
    }

  },        
};
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

