<template>
    <div class="card border-0" style="height: 800px">
      <div class="font-semibold text-xl mb-4">공정검사</div>
  
      <h4 class="text-start">공정검사대기항목</h4>
      <div class="text-end mt-3 mb-3">
        <Button label="조회" severity="success" class="me-3" />
        <Button label="등록" severity="info" class="me-3" @click="addTest"/>
        <Button label="수정" severity="help" class="me-3" />
        <Button label="삭제" severity="danger" class="me-5" />
      </div>
  
      <div class="ag-wrapper d-flex justify-content-center">
        <ag-grid-vue
          class="ag-theme-alpine custom-grid-theme"
          style="width: 95%"
          :columnDefs="columnDefs"
          :rowData="rowData"
          :gridOptions="gridOptions"
          rowSelection="single"
          @cellClicked="onRowClicked"
          @cellValueChanged ="inputRender"
         
        />
      </div>
  
      <div class="text-end mt-5 ms-5 w-50">
        <h4 class="text-start">공정검사실행</h4>
      </div>
  
      <div class="ag-wrapper float-start ms-5">
        <ag-grid-vue
          ref="secondGrid"
          class="ag-theme-alpine custom-grid-theme"
          style="width: 100%; height: 150px"
          :columnDefs="secondColumnDefs"
          :rowData="secondRowData"
          :gridOptions="gridOptions2"
          rowSelection="multiple"
          @cellValueChanged="testChange"
        />
      </div>
    </div>
  </template>
  
  <script>
import { AgGridVue } from "ag-grid-vue3";
import axios from "axios";
import Swal from "sweetalert2";
  
  export default {
    components: {
      AgGridVue,
      Swal
    },
    data() {
      return {
        rowData: [],
        rowDataIndex : null,
        columnDefs: [
          { field: "product_order_name", headerName: "생산지시명", flex: 1 },
          { field: "prod_code", headerName: "제품코드", flex: 1 },
          { field: "prod_name", headerName: "제품명", flex: 1 },
          { field: "process_code", headerName: "공정코드", flex: 1 },
          { field: "order_quantity", headerName: "지시량", flex: 1 ,
        valueFormatter: (params) => {
              return params.value != null ? `${params.value}개` : '';
            }},
          { field: "already_test", headerName: "기검사량", flex: 1,
        valueFormatter: (params) => {
              return params.value != null ? `${params.value}개` : '';
            }},
          { field: "not_test", headerName: "미검사량", flex: 1 ,
        valueFormatter: (params) => {
              return params.value != null ? `${params.value}개` : '';
            }},
            { field: "input_quantity", headerName: "현검사량", flex: 1 , editable: true,
        valueFormatter: (params) => {
              return params.value != null ? `${params.value}개` : '';
            }},

        ],
        secondRowData: [],
        secondColumnDefs: [
          { field: "test_name", headerName: "검사명", flex: 1 },
          { field: "test_item", headerName: "검사항목", flex: 1, editable: true },
          { field: "input_quantity", headerName: "검사량", flex: 1},
          { field: "pass_standard", headerName: "합격기준", flex: 1 },
          { field: "test_value", headerName: "검사수치", flex: 1, editable: true },
          { field: "pass_or_not", headerName: "합격여부", flex: 1 , 
          cellStyle: params => {
                        if (params.value == 'YN1') {
                            return { color: '#0284C7', textAlign: 'center', fontWeight: 'bold' }; 
                        } else if (params.value == 'YN2') {
                            return { color: '#E02D2D', textAlign: 'center', fontWeight: 'bold' }; 
                        } 
                        return null; 
                    },
            valueFormatter: (params) => {
              let result = '';
              if(params.value=='YN1'){
                result ='적합'
              }else if(params.value=='YN2'){
                result = '부적합'
              }
              return result;
            }
          },
          { field: "emp_code", headerName: "담당자", flex: 1 }
        ],
        gridOptions: {
          domLayout: "autoHeight",
          singleClickEdit: true,
          pagination: true,
          paginationPageSize: 5,
          paginationPageSizeSelector: false,
          overlayNoRowsTemplate: "표시할 값이 없습니다.",
          defaultColDef: {
            suppressMovable: true,
            resizable: false,
            sortable: false,
            cellStyle: { textAlign: "center" },
          }
        },
        gridOptions2: {
          domLayout: "autoHeight",
          singleClickEdit: true,
          overlayNoRowsTemplate: "표시할 값이 없습니다.",
          defaultColDef: {
            suppressMovable: true,
            resizable: false,
            sortable: false,
            cellStyle: { textAlign: "center" },
          }
        }
      };
    },
    mounted () {
      this.testReady();
    },
    watch : {
    //  'rowDataIndex' : function(newVal){
    //   console.log(newVal)
    //   for(let data in this.rowData){
    //      if(data != newVal){
    //       this.rowData[data].input_quantity ='0';
    //      }
    //   }
    //  }
    },
    methods: {
      //인풋값 그리드2에 전달
      inputRender(){
        console.log(this.rowData[this.rowDataIndex])
        //값체크
        if(Number(this.rowData[this.rowDataIndex].not_test) < Number(this.rowData[this.rowDataIndex].input_quantity)){
          this.rowData[this.rowDataIndex].input_quantity=0;
          this.rowData = [...this.rowData]
          alert('미검사량 보다 더많은값을 기입할 수 없습니다.')
          return;
        }

        for(let inputQuantity of this.secondRowData ){
          inputQuantity.input_quantity = this.rowData[this.rowDataIndex].input_quantity;
        }
      },
      async onRowClicked(event) {
        //클릭 인덱스 값 담기
        this.rowDataIndex =event.rowIndex;
        // 클릭시 검사항목들 보여줌
        axios.get('/api/test/testMenu/'+event.data.process_code)
              //검사량 초기화
              .then(res => {
                for(let addValue of res.data){
                  addValue.pass_or_not='';
                  addValue.emp_code='';
                  addValue.test_value='';
                  addValue.process_code = this.rowData[0].process_code;
                }
                 this.secondRowData = res.data;
              })
              .catch((err) => console.log(err));
      },
      //겁사항목 출력
      async testReady(){
        await axios.get('/api/test/storeReadyList/')
                   .then(res => {
                      this.rowData = res.data;
                   })
                   .catch((err) => console.log(err))
      },
      testChange(event){
        const row = event.data;
        const test = Number(row.test_value);
        const standard = Number(row.pass_standard);

        row.pass_or_not = test > standard ? 'YN1' : 'YN2';

        // ag-grid에 변경 반영
        this.$refs.secondGrid.api.refreshCells({ rowNodes: [event.node], force: true });
      },
      async addTest(){
        //값체크
        if(this.secondRowData.length ==0){
          Swal.fire({
                    title: '실패',
                    text: '해당하는 값을 입력해주십시오.',
                    icon: 'error',
                    confirmButtonText: '확인'
                })
          return;
        }
        for(let value of this.secondRowData){
          if(!value.test_item||!value.pass_standard||!value.test_value){
            Swal.fire({
                    title: '실패',
                    text: '해당하는 값을 입력해주십시오.',
                    icon: 'error',
                    confirmButtonText: '확인'
                })
            return;
          }
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* 선택된 행 색상 스타일 */
  ::v-deep(.ag-row-selected) {
    background-color: #BADDF9 !important; 
  }
  /* 헤더 텍스트 가운데 정렬 */
  ::v-deep(.ag-theme-alpine .ag-header-cell-label) {
      justify-content: center;
  }
  .input-group-text{
      background-color: #FFCC80;
      border-color: #FFCC80;
  }
  </style>
  