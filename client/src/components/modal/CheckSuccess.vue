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
        <slot name="header">검수 완료 항목</slot>
      </CModalHeader>
  
      <CModalBody>
        <div class="ag-theme-alpine" style="height: 400px; width: 100%">
           <!-- 검색창 -->
           <div class="d-flex justify-content-end me-5">
            <div class="input-group mb-3 w-50">
              <!-- 검색 조건 선택 -->
              <select v-model="searchType" class="form-select" aria-label="Default select example">
                <option value="c.prod_check_code" selected>검사코드</option>
                            <option value="c.prod_code">제품코드</option>
                            <option value="prod_name">제품명</option>
                            <option value="work_lot">생산LOT</option>
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
          <AgGridVue class="ag-theme-alpine custom-grid-theme" 
                     style="width: 100%" 
                    :columnDefs="columnDefs"
                    :rowData="rowData" 
                    :gridOptions="gridOptions"
                    @rowClicked = "clicked"/>
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
  components : {
    AgGridVue,
  },
  props: {
    visible: {
        type: Boolean,
        required: true,
      },
  },
  data(){
    return {
      rowData:[],
      searchType: "c.prod_code",  // 검색 조건 
            searchText: "",   // 검색어
      columnDefs: [
                { field: "prod_check_code", headerName: "검수코드", flex: 2,},
                { field: "prod_code", headerName: "제품코드", flex: 3,},
                { field: "prod_name", headerName: "제품명", flex: 2,},
                { field: "work_lot", headerName: "생산LOT", flex: 2,  },
                { field: "pass_quantity", headerName: "입고가능수량", flex: 3,}
            ],
      gridOptions: {
        domLayout: "autoHeight", //행을 보고 자동으로 hight부여
        singleClickEdit: true, //한번클릭했을때 수정
        suppressRowClickSelection: true, //	행 클릭할 때 체크박스 선택 방지
        overlayNoRowsTemplate: '표시할 값이 없습니다.',
        pagination: true,
        paginationPageSize: 8,
        paginationPageSizeSelector: false,
        defaultColDef: {
          suppressMovable: true, //셀 이동 금지
          resizable: false, // 열 크기 조정 가능
          sortable: false, //정렬 금지
          cellStyle: { textAlign: "center" },
        },
      },
      
    
    }
  },
  mounted() {
        this.finishedReady();
      },
      watch: {
      visible(newVal) {
        if (newVal) {
          this.finishedReady();  // visible이 true로 바뀌면 쿼리 실행
        }
      }
    },
    methods : {
        close() {
          this.$emit('close');
        },
        async finishedReady() {
            await axios.get('/api/label/labelList')
                       .then(res => {
                        this.rowData = res.data;
                        console.log(res.data)
                       })
                       .catch((err) => console.log(err));
        },
        //검색 조회
        async searchList(){
            await axios.get('/api/label/labelList',{
                params : {
                    type : this.searchType,
                    keyword: this.searchText
                }
            })
            .then(res => {
                    this.rowData = res.data;
                })
                .catch((err) => console.log(err));
          },
        clicked(event){
        
        this.$emit('selectOrder', event.data);
        this.close();
      },
      }
}

</script>