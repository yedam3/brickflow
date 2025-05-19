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
        <slot name="header">발주 목록</slot>
      </CModalHeader>
  
      <CModalBody>
        <div class="ag-theme-alpine" style="height: 400px; width: 100%">
          <!-- 검색창 -->
          <div class="d-flex justify-content-end me-5">
            <div class="input-group mb-3 w-50">
              <!-- 검색 조건 선택 -->
              <select v-model="searchType" class="form-select" aria-label="Default select example">
                <option value="m.mat_order_code" selected>발주코드</option>
                <option value="m.mat_order_name">발주명</option>
                <option value="company_name">업체명</option>
                <option value="mat_name">자재명</option>
              </select>
              <!-- 검색어 입력 -->
              <input type="text" v-model="searchText" placeholder="검색어 입력" 
             class="form-control w-50" style="width: 30%" @keydown.enter="searchMaterials" />
              <!-- 검색 버튼 -->
              <button @click="searchMaterials" class="btn btn-primary">
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
  import { AgGridVue } from "ag-grid-vue3";
  import axios from "axios";
  import Swal from 'sweetalert2';
  
  export default {
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
    data() {
      return {
        rowData: [],
        searchType: "m.mat_order_code",  // 검색 조건 
        searchText: "",   // 검색어
        columnDefs: [
          { field: "mat_order_code", headerName: "발주코드", flex: 1 },
          { field: "mat_order_name", headerName: "발주명", flex: 1 },
          { field: "company_name", headerName: "업체명", flex: 1 },
          { field: "request_date", headerName: "발주일자", flex: 1,
                valueFormatter: params => {
                    // 날짜 형식을 YYYY-MM-DD로 변환
                    if (params.value) {
                        const date = new Date(params.value);
                        return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
                    }
                    return params.value;
                } 
            },
          { field: "delivery_date", headerName: "입고예정일자", flex: 1,
                valueFormatter: params => {
                    // 날짜 형식을 YYYY-MM-DD로 변환
                    if (params.value) {
                        const date = new Date(params.value);
                        return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
                    }
                    return params.value;
                }
            },
          { field: "mat_name", headerName: "자재명", flex: 2 },
          {
            field: "total_quantity", headerName: "발주총갯수", flex: 1,
            valueFormatter: (params) => {
              return params.value != null ? `${params.value}개` : '';
            }
          },
          { field: "status_name", headerName: "발주상태", flex: 1 ,
          cellStyle: params => {
                  if (params.value == '검수대기') {
                      return { color: '#0284C7', textAlign:'center',fontWeight: 'bold'}; // 파란색
                  } else if (params.value == '검수완료') {
                      return { color: '#22C55E', textAlign:'center',fontWeight: 'bold'}; // 초록색
                  } else if (params.value == '반품처리') {
                      return { color: '#E02D2D', textAlign:'center',fontWeight: 'bold'}; // 빨간색
                  } else if (params.value == '검수중') {
                      return { color: '#FF7F00', textAlign:'center',fontWeight: 'bold'}; // 빨간색
                  }
              return null; // 기본 스타일
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
      };
    },
    mounted() {
      this.matList(); 
    },
    methods: {
      close() {
        this.$emit("close");
      },
      matList() {
        axios.get('/api/mat/orderList')  
          .then(res => {
            this.rowData = res.data;
          })
          .catch(error => {
            console.error(error);
          });
      },
      searchMaterials() {
        axios.get('/api/mat/orderList', {
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
      clicked(event){
        if(event.data.status_name=='검수완료'||event.data.status_name=='반품처리'||event.data.status_name=='검수중'){
          Swal.fire({
            title: '선택불가',
            text: '이미 검수가 진행된 항목에 대해선 선택이 불가합니다.',
            icon: 'error',
            confirmButtonText: '확인'
          });
          return;
        }
        this.$emit('selectOrder', event.data);
        this.close();
      }
    },
    watch: {
      visible(newVal) {
        if (newVal) {
          this.matList();  // visible이 true로 바뀌면 쿼리 실행
        }
      }
    }
  };
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
  