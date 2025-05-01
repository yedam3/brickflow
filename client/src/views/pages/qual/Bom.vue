<template>
   <div class="card border-0 h-100">
      <div class="font-semibold text-xl mb-4">BOM 관리</div>
      <div class="d-flex justify-content-start me-5">
     
            <div class="input-group mb-3 w-75">
              <!-- 검색 조건 선택 -->
              <select v-model="searchType" class="form-select" aria-label="Default select example">
                <option value="mat_code" selected>제품명</option>
                <option value="mat_name">제품코드</option>
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
 
      <div class="text-end mt-3 mb-3">
      <Button label="초기화" severity="success" class="me-3" @click="BomList"/>
      <Button label="등록" severity="info" class="me-3" @click="addBom"/>
      <Button label="수정" severity="help" class="me-3" @click="modifyBom"/>
      <Button label="삭제" severity="danger" class="me-5" @click="deleteBom"/>
    </div>

    <div class="text-end mt-3 mb-3">
      <Button label="+" severity="success" class="me-3" @click="addRow"/>
      <Button label="-" severity="danger" class="me-3" @click="deleteRow"/>  
    </div>
  <div class="par-grid">
    <div class="prod-grid">
      <ag-grid-vue style="width: 700px; height: 500px;"
        class="ag-theme-alpine"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :gridOptions="gridOptions"
        :defaultColDef="defaultColDef"
        @cellClicked="bomCellClicked">
    </ag-grid-vue>
   </div>
   <div class="bom-grid">
  <ag-grid-vue style="width: 700px; height: 500px;"
      ref="secondGrid"
      class="ag-theme-alpine"
      :columnDefs="columnDefs2"
      :rowData="rowData2"
      :gridOptions="gridOptions2"
      :defaultColDef="defaultColDef2">
    </ag-grid-vue>
    </div>
  </div>
  </div>
</template>

<script>
 import { AgGridVue } from 'ag-grid-vue3';
 import axios from 'axios';
 import Swal from 'sweetalert2';
 export default{
    components: {
    AgGridVue,
    Swal
  },
  data() {
    return {
      rowData: [
        {
          prod_code: "",
          prod_name: "",
        }
      ],
      columnDefs: [
        { field: 'prod_code', headerName: '제품코드',flex:1,editable:true},
        { field: 'prod_name', headerName: '제품명' ,flex:1},
      ],
      gridOptions:{
          pagination: true,
          paginationPageSize: 5,
          paginationPageSizeSelector: [5, 10, 20, 50],
          overlayNoRowsTemplate: '표시할 값이 없습니다.',
          defaultColDef: {
            suppressMovable: true, //컬럼 드래그로 순서바꾸기 못하게
            resizable: false, //컬럼 너비 마우스로 조절 못하게
            sortable: false, //정렬 기능 비활성화
          onGridReady: function (event) {
          event.api.sizeColumnsToFit();
        },  
      }
     },

     rowData2: [
     {
      mat_code: "",
      prod_name: "",
      mat_name: "",
      quantity: "",
     }
     ],
     columnDefs2: [
     { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
        { field: 'mat_code', headerName: '자재코드',flex:3,editable:true},
        { field: 'prod_name', headerName: '제품명' ,flex:4,editable:true},
        { field: 'mat_name', headerName: '자재명 ' ,flex:2,editable:true},
        { field: 'quantity', headerName: '수량 ' ,flex:2,editable:true},
      ],
      gridOptions2:{
        pagination: true,
         paginationPageSize: 5,
         paginationPageSizeSelector: [5, 10, 20, 50],
         overlayNoRowsTemplate: '표시할 값이 없습니다.',
         defaultColDef2: {
           suppressMovable: true, //컬럼 드래그로 순서바꾸기 못하게
           resizable: false, //컬럼 너비 마우스로 조절 못하게
           sortable: false, //정렬 기능 비활성화
         onGridReady: function (event) {
         event.api.sizeColumnsToFit();
        },
      }
     },
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('/api/admin/bom');
        this.rowData = response.data;
      } catch (err) {
        console.error('데이터 조회 실패:', err);
      }
    },
    bomCellClicked(event){
      let bom = event.data.prod_code;
      axios.get('/api/admin/bom/' + bom)
                 .then(res => {
                  console.log(res);
                       this.rowData2 = res.data;
                 }).catch(error => {
                  console.error(error);
                 });
                 console.log(event);
        },
    //행추가
    addRow(){
    this.rowData2.push({  mat_code: "",
                          prod_name: "",
                          mat_name: "",
                          quantity: "",
                          })
    
  // 새 배열로 설정하여 AG Grid가 반영하게 만듬
    this.rowData2 = [...this.rowData2];  
   },
   //행삭제
    deleteRow() {
      const selectedNodes = this.$refs.secondGrid.api.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
   
      // rowData2에서 선택된 행을 제외한 나머지만 남긴다
      this.rowData2 = this.rowData2.filter(row => !selectedData.includes(row));
    },
     // 등록
     async addBom(){
      const res = await axios.get('/api/admin/bominsert', {
        bominsert: this.rowData2,
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
        }
        
  
  }
  }
  

</script>
<style>
  .ag-theme-alpine .ag-header {
  background-color: #FF9900; 
  color: white;
  
  }
</style>
<style scoped>



.prod-grid {
  display: inline-block;
  margin-right: 30px;
  
}
.bom-grid {
  display: inline-block;
  
}

</style>




