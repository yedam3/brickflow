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
        <slot name="header">공정 목록</slot>
      </CModalHeader>
  
      <CModalBody>
        <div class="ag-theme-alpine" style="height: 400px; width: 100%">
          <!-- 공정명 검색창 -->
          <div class="d-flex justify-content-end me-5">
            <div class="input-group mb-3 w-50">
              <!-- 검색 조건 선택 -->
              <select v-model="searchType" class="form-select" aria-label="Default select example">
                <option value="process_code" selected>공정코드</option>
                <option value="process_name">공정명</option>
              </select>
              <!-- 검색어 입력 -->
              <input type="text" v-model="searchText" placeholder="검색어 입력" 
             class="form-control w-50" style="width: 30%" @keydown.enter="searchProcess" />
              <!-- 검색 버튼 -->
              <button @click="searchProcess" class="btn btn-primary">
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
  
  export default {
    components: {
      AgGridVue,
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
        searchType: "process_code",  // 검색 조건 
        searchText: "",   // 검색어
        columnDefs: [
          { field: "process_code", headerName: "공정코드", flex: 1 },
          { field: "process_name", headerName: "공정명", flex: 1 },
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
      this.procList(); 
    },
    methods: {
      close() {
        this.$emit("close");
      },
      async procList() {
        await axios.get('/api/admin/processAll')  
          .then(res => {
            console.log('결과',res.data)
            this.rowData = res.data;
          })
          .catch(error => {
            console.error(error);
          });
      },
      searchProcess() {
        axios.get('/api/admin/processflow/:prodno', {
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
        this.$emit('selectProc', event.data);
        this.close();
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
  