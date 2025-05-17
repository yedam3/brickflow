<template>
    <CModal
          :visible="visible"
          @close="close"
          backdrop="static"
          alignment="center"
          size="xl"
          style="min-width: 1000px"
        >
          <CModalHeader>
            <slot name="header">검수 목록</slot>
          </CModalHeader>
      
          <CModalBody>
            <div class="ag-theme-alpine" style="height: 400px; width: 100%">
              <!-- 검색창 -->
              <div class="d-flex justify-content-end me-5">
                <div class="input-group mb-3 w-50">
                  <!-- 검색 조건 선택 -->
                  <select v-model="searchType" class="form-select" aria-label="Default select example">
                    <option value="c.check_code" selected>검수코드</option>
                    <option value="check_status">검사결과</option>
                    <option value="mat_name">자재명</option>
                    <option value="mat_error_name">불합격 항목</option>
                  </select>
                  <!-- 검색어 입력 -->
                  <input type="text" v-model="searchText" placeholder="검색어 입력" 
                 class="form-control w-50" style="width: 30%" @keydown.enter="searcCheckResultList" />
                  <!-- 검색 버튼 -->
                  <button @click="searcCheckResultList" class="btn btn-primary">
                    <i class="pi pi-search"></i>
                  </button>
                </div>
              </div>
              <!-- ag-Grid 테이블 -->
              <AgGridVue
                style="width: 100%; height: 100%"
                class="ag-theme-alpine"
                :columnDefs="columnDefs"
                :rowData="rowData"
                :gridOptions="gridOptions"
                @rowClicked="clicked"
              />
            </div>
          </CModalBody>
      
          <CModalFooter>
            <slot name="footer">
              <CButton color="secondary" @click="close">닫기</CButton>
            </slot>
          </CModalFooter>
        </CModal>
    </template>
    
    <script>
    import Swal from 'sweetalert2';
    import axios from "axios";
    import { AgGridVue } from "ag-grid-vue3";
    
    
    export default{
        components: {
          AgGridVue,
          Swal
        },
        props: {
          visible: {
            type: Boolean,
            required: true,
          },
        },
        data(){
            return{
                rowData: [],
               searchType: "c.check_code",  // 검색 조건 
               searchText: "",   // 검색어
               columnDefs:[
               { field: "check_code", headerName: "검사코드", flex: 1 },
               { field: "mat_name", headerName: "자재명", flex: 2 },
               { field: "mat_order_detailCode", headerName: "주문디테일", flex: 1 },
               { field: "check_quantity", headerName: "검수량", flex: 1 },
               { field: "check_history", headerName: "검수내역", flex: 2 },
               { field: "check_status", headerName: "합격여부", flex: 1 ,
                cellStyle: params => {
                    if(params.value =='합격'){
                        return { color: '#22C55E', textAlign:'center',fontWeight: 'bold'};
                    }else if (params.value == '불합격'){
                        return { color: '#E02D2D', textAlign:'center',fontWeight: 'bold'};
                    }
                }
               },
               { field: "mat_error_name", headerName: "불합격사유", flex: 3,
               cellStyle: params => {
                return { color: '#E02D2D', textAlign:'center',fontWeight: 'bold'};
               }
                },
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
            }
        },
        mounted() {
            this.checkResultList();
        },
        methods: {
            close() {
                this.$emit("close");
            },
            checkResultList() {
                axios.get('/api/mat/checkResultList')
                    .then(res => {
                        this.rowData = res.data;
                    })
                    .catch(error => {
                        console.error(error);
                    });
            },
            searcCheckResultList() {
                axios.get('/api/mat/checkResultList', {
                    params: {
                        type: this.searchType,
                        keyword: this.searchText,
                    }
                })
                    .then(res => {
                        this.rowData = res.data;
                    })
                    .catch(error => {
                        console.error(error);
                    });
            },
            async clicked(event) {
               let result = await axios.get('/api/mat/finExist/'+event.data.check_code)
               console.log(result)
               if(result.data[0].checkCount>0){
                Swal.fire({
                    title: '실패',
                    text: '이미 완제품 입고가 진행된 자재입니다..',
                    icon: 'error',
                    confirmButtonText: '확인'
                })
                return;
               }
               //만약 완제품입고가 완료된 항목에 대해선 validation 추가해야함
                this.$emit('checkResult', event.data);
                this.close();
            }
        },
      watch: {
        visible(newVal) {
          if (newVal) {
            this.checkResultList();  // visible이 true로 바뀌면 쿼리 실행
          }
        }
      }
    }
    
    </script>
    
    
    <style scoped>
    .btn-primary {
      background-color: rgb(230, 171, 98);
      border-color: rgb(230, 171, 98);
    }
    /* 헤더 텍스트 가운데 정렬 */
    ::v-deep(.ag-theme-alpine .ag-header-cell-label) {
       justify-content: center;
    }
    
    /* headerClass로 설정한 header-center 클래스에 적용 */
    ::v-deep(.header-center .ag-header-cell-label) {
      justify-content: center;
    }
    </style>