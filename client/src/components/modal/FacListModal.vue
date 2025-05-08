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
      <slot name="header">설비 목록</slot>
    </CModalHeader>

    <CModalBody>
      <div class="ag-theme-alpine" style="height: 400px; width: 100%">
        <!-- 검색창 -->
        <div class="d-flex justify-content-end me-5">
          <div class="input-group mb-3 w-50">
            <!-- 검색 조건 선택 -->
            <select v-model="searchType" class="form-select" aria-label="Default select example">
              <option value="fac_code" selected>설비코드</option>
              <option value="model_name">설비이름</option>
              <option value="employee_code">담당자번호</option>
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
        rowData: [
          {
            fac_code:"",
            model_name:"",
            fac_location:"",
            employee_code:"",
            fac_status:"",
          },
        ],
        searchType: "fac_code",
        searchText: "",
        columnDefs: [
          { field: "fac_code", header: "설비코드", flex: 1},
          { field: "model_name", header: "설비이름", flex: 1},
          { field: "fac_location", header: "설비위치", flex: 1},
          { field: "employee_code", header: "담당자", flex: 1},
          { field: "fac_status", header: "설비상태", flex: 1,
          valueFormatter:(params) => {
          if(params.value == 'FS1'){
            return params.value = '가동';
          } 
        }, 
        cellStyle: params => {
              if(params.value == "FS1"){
                return { color: '#22C55E', textAlign:'center', fontWeight: 'bold' };
              }
              return null;
            }}
            ,
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
    mounted(){
      this.facList();
    },
    methods: {
      close(){
        this.$emit("close");
      },
      facList(){
        axios.get('/api/fac/facList')
          .then(res => {
            this.rowData = res.data;
          })
          .catch(error => {
            console.error(error);
          });
      },
      searchMaterials() {
        axios.get('/api/fac/facList', {
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
        this.$emit('selectFac', event.data);
        this.close();
      },
      watch: {
        visible(newVal) {
          if (newVal){
            this.facList();
          }
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