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
          @cellClicked="testValueclicked"
        />
      </div>
    </div>
  </template>
  
  <script>
import { AgGridVue } from "ag-grid-vue3";
import axios from "axios";
import Swal from "sweetalert2";
import { toHandlers } from "vue";
  
  export default {
    components: {
      AgGridVue,
      Swal
    },
    data() {
      return {
        rowData: [],
        rowDataIndex : null,
        grid2Index: null,
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
              return params.value? `${params.value}개` : '';
              }, valueParser: params => {
                // 숫자로 변환, 숫자가 아니면 null
                const value = parseInt(params.newValue);
                return isNaN(value) ? null : value;
              },
},


        ],
        secondRowData: [],
        secondColumnDefs: [
          { field: "test_name", headerName: "검사명", flex: 1 },
          { field: "test_item", headerName: "검사항목", flex: 1, editable: true },
          { field: "input_quantity", headerName: "검사량", flex: 1},
          { field: "pass_standard", headerName: "합격기준", flex: 1 },
          { field: "test_value", headerName: "검사수치", flex: 1, editable: true,
            valueParser: params => {
              // 숫자로 변환, 숫자가 아니면 null
              const value = parseInt(params.newValue);
              return isNaN(value) ? null : value;
            },
          },
          { field: "pass_or_not", headerName: "합격여부", flex: 1 , 
          cellStyle: params => {
                        if (params.value == 'YN1') {
                            return { color: '#0284C7', textAlign: 'center', fontWeight: 'bold' }; 
                        } else if (params.value == 'YN2') {
                            return { color: '#E02D2D', textAlign: 'center', fontWeight: 'bold' }; 
                        } else if (params.value == 'YN3'){
                          return { color: '#6C757D', textAlign: 'center', fontWeight: 'bold' }; 
                        }
                        return null; 
                    },
            valueFormatter: (params) => {
              let result = '';
              if(params.value=='YN1'){
                result ='적합'
              }else if(params.value=='YN2'){
                result = '부적합'
              }else if(params.value=='YN3'){
                result = '검사항목제외'
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
          },
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
    methods: {
      //인풋값 그리드2에 전달
      inputRender(){
         this.rowData.forEach((item,idx) => {
          if(idx != this.rowDataIndex){
               this.rowData[idx].input_quantity = '';
               
            }
        })
        //값체크
        if(Number(this.rowData[this.rowDataIndex].not_test) < Number(this.rowData[this.rowDataIndex].input_quantity)){
          this.rowData[this.rowDataIndex].input_quantity=0;
          this.rowData = [...this.rowData]
          alert('미검사량 보다 더많은값을 기입할 수 없습니다.')
          return;
        }
          this.secondRowData[0].input_quantity = this.rowData[this.rowDataIndex].input_quantity;
        
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
                  addValue.input_quantity = '';
                  addValue.work_lot = this.rowData[this.rowDataIndex].work_lot;
                  addValue.product_order_detail_code = this.rowData[this.rowDataIndex].product_order_detail_code;
                  addValue.process_code = this.rowData[this.rowDataIndex].process_code;
                  addValue.prod_code = this.rowData[this.rowDataIndex].prod_code;
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

                      for(let item of this.rowData){
                        item.input_quantity = ''
                      }
                   })
                   .catch((err) => console.log(err))
      },
      testChange(event) {
        // 값체크
        if (event.data.input_quantity == 0 || event.data.input_quantity == '') {
          Swal.fire({
            title: '실패',
            text: '전 항목을 통과하지 못하였거나 기입을 안하여 해당 항목 기입이 불가능합니다.',
            icon: 'error',
            confirmButtonText: '확인'
          });
          event.data.test_value = '';
          return;
        }

        const row = event.data;
        const test = Number(row.test_value);
        const standard = Number(row.pass_standard);

        //검사판단
        row.pass_or_not = test >= standard ? 'YN1' : 'YN2';

        // 다음 항목에서 합격일떄만 검사량 전달 
        if (row.pass_or_not == 'YN1') {
          const targetRow = this.secondRowData[this.grid2Index + 1];
          if (targetRow) {
            this.secondRowData[this.grid2Index + 1].input_quantity = row.input_quantity;
          }
        }

        //검사 결과 전체 다시보고 이후 다시 정리
        let foundFail = false;
        for (let i = 0; i < this.secondRowData.length; i++) {
          const current = this.secondRowData[i];

          if (!foundFail) {
            // 불합격을 처음 발견하면 무조건 Yn2로 설정
            if (current.pass_or_not === 'YN2') {
              foundFail = true;
            }
          } else {
            // 불합격 이후 항목들은 무조건 YN3로 바꾸기
            current.pass_or_not = 'YN3';
          }
        }

        //  불합격에서 합격으로 바꾼 경우 이후 항목들 초기화
        if (!this.secondRowData.some(row => row.pass_or_not === 'YN2')) {
          for (let i = 0; i < this.secondRowData.length; i++) {
            if (this.secondRowData[i].pass_or_not === 'YN3') {
              this.secondRowData[i].pass_or_not = '';
            }
          }
        }

        // 반응성 갱신
        this.secondRowData = [...this.secondRowData];
      },

      //그리드2 클릭시 인덱스 값 가져오기
      testValueclicked(event){
       this.grid2Index = event.rowIndex;
      },
      async addTest(){
        //값체크
        if(this.secondRowData.length ==0){
          Swal.fire({
                    title: '실패',
                    text: '해당하는 공정을 선택해주세요.',
                    icon: 'error',
                    confirmButtonText: '확인'
                })
          return;
        }
        for(let value of this.secondRowData){
          if(!value.test_item||!value.pass_standard|!value.pass_or_not){
            Swal.fire({
                    title: '실패',
                    text: '해당하는 값을 입력해주십시오.',
                    icon: 'error',
                    confirmButtonText: '확인'
                })
            return;
          }
        }
        await axios.post('/api/test/addTest',this.secondRowData)
                      .then(res => {
                        console.log(res.data);
                        if(res.data[res.data.length-1][0].result =='success'){
                          Swal.fire({
                            title: '성공',
                            text: '등록에 성공하였습니다',
                            icon: 'success',
                            confirmButtonText: '확인'
                          })
                          this.testReady();
                          this.secondRowData = [];
                        }
                      })
                      .catch((err) =>  console.log(err));
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
  