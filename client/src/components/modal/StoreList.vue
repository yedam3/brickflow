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
        <slot name="header">입고가능 목록</slot>
      </CModalHeader>
  
      <CModalBody>
        <div class="ag-theme-alpine" style="height: 400px; width: 100%">
          <!-- 검색창 -->
          <div class="d-flex justify-content-end me-5">
            <div class="input-group mb-3 w-50">
              <!-- 검색 조건 선택 -->
              <select v-model="searchType" class="form-select" aria-label="Default select example">
                <option value=" m.mat_lot" selected>LOT</option>
                <option value="mat_name" >자재명</option>
                <option value="r.store_name">창고명</option>
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
  export default{
    components : {
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
        searchType: " m.mat_lot",  // 검색 조건 
        searchText: "",   // 검색어
        columnDefs: [
          { field: "mat_lot", headerName: "lot", flex: 1 },
          { field: "mat_code", headerName: "자재코드", flex: 1 },
          { field: "mat_name", headerName: "자재명", flex: 1 },
          { field: "storage_code", headerName: "창고코드", flex: 1, hide:true},
          { field: "store_name", headerName: "창고명", flex: 1 },
          { field: "mat_check_pass", headerName: "입고가능수량", flex: 1 },
          { field: "check_code", headerName: "검수코드", flex: 1,hide:true },
          { field: "store_quantity", headerName: "입고량", flex: 1 }
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
      this.matList(); 
    },
    methods : {
        close() {
        this.$emit("close");
      },
        matList() {
            axios.get('/api/mat/storeListModal')
                .then(res => {
                    this.rowData = res.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        searchMaterials() {
            axios.get('/api/mat/storeListModal', {
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
    
        async clicked(event){
          //자재사용여부 만약 있으면 수정 및 삭제 부락
           let result = await axios.get('/api/mat/matUseCheck/'+event.data.mat_lot)   
           console.log(result.data.useCheck)      
           if(result.data[0].useCheck >0){
            Swal.fire({
              title : '실패',
              text : '이미 자재가 소모된 건입니다.',
              icon : "error",
              confirmButtonText : "확인"
            })
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