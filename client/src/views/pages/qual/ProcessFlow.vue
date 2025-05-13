<template>
  <div class="card border-0 h-100">
    <div class="font-semibold text-xl mb-4">공정흐름도 관리</div>
    <div class="d-flex justify-content-start me-5">
    </div>

    <div class="text-end mt-3" style="padding-right: 4%;">
      <Button label="초기화" severity="help" class="me-3" @click="resetList"/>
      <Button label="저장" severity="info" class="me-3" @click="proSave"/>
    </div>

    <div class="row mt-3">
      <div class="col-6">
        <ag-grid-vue
          class="ag-theme-alpine"
          :columnDefs="columnDefs"
          :rowData="rowData"
          :gridOptions="gridOptions1"
          :defaultColDef="defaultColDef"
          @cellClicked="prodCellClicked">
        </ag-grid-vue>
      </div>
      <div class="col-6">
        <div class="flow-container">
          <VueFlow
            :nodes="nodes"
            :edges="edges"
            class="my-diagram-class"
            :fit-view="true"
          >
          </VueFlow>
        </div>
      </div>
    </div>
    <div class="row mt-1">
      <div class="col-6">
        <div class="text-end mt-1 mb-3" style="padding-right: 4%;">
          <Button label="행추가" severity="success" class="me-3" @click="addRow"/>
          <Button label="행삭제" severity="danger" class="me-3" @click="deleteRow"/>  
        </div>
        <ag-grid-vue 
          ref="secondGrid"
          class="ag-theme-alpine"
          :columnDefs="columnDefs2"
          :rowData="rowData2"
          :gridOptions="gridOptions2"
          rowSelection="multiple"
          :defaultColDef="defaultColDef"
          @cellClicked="procCellClicked"
          @rowDragEnd="onRowDragEnd">
        </ag-grid-vue>
      </div>
    </div>
  </div>
  <!-- 공정코드 모달창-->
  <ProcModal
    :visible="showProcModal"
    rowSelection="multiple"
    @close="showProcModal = false"
    @selectProc="procSelected"
  ></ProcModal>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import Swal from 'sweetalert2';
import ProcModal from '@/components/modal/ProcModal.vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { ControlButton, Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';

export default {
  components: {
    AgGridVue,
    ProcModal,
    Swal,
    VueFlow,
    Background,
    Controls,
    ControlButton,
    MiniMap
  },
  data() {
    return {
      // 다이어그램용
      nodes: [],
      edges: [],
      
      vueFlowInstance: null, // VueFlow 인스턴스 저장용

      rowData: [
        {
          prod_code: "",
          prod_name: "",
        }
      ],
      columnDefs: [
        { field: 'prod_code', headerName: '제품코드', flex: 1, editable: true },
        { field: 'prod_name', headerName: '제품명', flex: 1 },
      ],
      gridOptions1: {
        domLayout: "autoHeight", //행을 보고 자동으로 hight부여
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
          prod_code: "",
          prod_name: "",
          process_code: "",
          process_name: "",
        }
      ],
      columnDefs2: [
        { field: 'drag', headerName: '', flex: 1, rowDrag: true },
        { headerCheckboxSelection: true, checkboxSelection: true, width: 50, },
        { field: 'prod_code', headerName: '제품코드', flex: 3, editable: true },
        { field: 'prod_name', headerName: '제품명', flex: 4, editable: true },
        { field: 'process_code', headerName: '공정코드', flex: 3, editable: true },
        { field: 'process_name', headerName: '공정명', flex: 4, editable: true },
      ],
      gridOptions2: {
        rowDragManaged: true, //드래그 행 드롭을 자동으로 관리해주는 기능
        animateRows: true, // 행이 이동하거나 삭제될때 부드러운 애니메이션효과적용
        domLayout: "autoHeight", //행을 보고 자동으로 hight부여
        suppressRowClickSelection: true, //	행 클릭할 때 체크박스 선택 방지
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
      showProcModal: false,
      //상세그리드 행 인덱스
      selectedSecondIndex: null,
      prodIndex: null,
    };
  },
  mounted() {
    this.ProcData();
    // VueFlow 인스턴스 초기화
    this.vueFlowInstance = useVueFlow();
  },
  methods: {
    async ProcData() {
      try {
        const response = await axios.get('/api/admin/processflow');
        this.rowData = response.data;
      } catch (err) {
        console.error('데이터 조회 실패:', err);
      }
    },
    async prodCellClicked(event) {
      let proc = event.data.prod_code;
      this.prodIndex = event.rowIndex;
      await axios.get('/api/admin/processflow/' + proc)
        .then(res => {
          console.log(res);
          this.rowData2 = res.data;
          this.rowData2 = [...this.rowData2];  
        }).catch(error => {
          console.error(error);
        });
      console.log(event);
      //다이어그램실행
      this.generateFlowDiagram();
    },
    //행추가
    addRow() {
      if(this.prodIndex == null){
        Swal.fire({
          title: '실패',
          text: '제품을 클릭해주세요',
          icon: 'error',
          confirmButtonText: '확인'
        });
        return;
      }
      this.rowData2.push({
        prod_code: this.rowData[this.prodIndex].prod_code,
        prod_name: this.rowData[this.prodIndex].prod_name,
        process_code: "",
        process_name: "",
      });
   
      // 새 배열로 설정하여 AG Grid가 반영하게 만듬
      this.rowData2 = [...this.rowData2];
      // 다이어그램 업데이트
      this.generateFlowDiagram();
    },
    //행삭제
    deleteRow() {
      const selectedNodes = this.$refs.secondGrid.api.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
  
      // rowData2에서 선택된 행을 제외한 나머지만 남긴다
      this.rowData2 = this.rowData2.filter(row => !selectedData.includes(row));
      
      // 다이어그램 업데이트
      this.generateFlowDiagram();
    },
    //공정코드를 클릭했을때 모달창 열기
    procCellClicked(parmas) {
      if (parmas.colDef.field == "process_code" || parmas.colDef.field == "process_name") {
        this.selectedSecondIndex = parmas.rowIndex;
        this.showProcModal = true;
        console.log('모달값', parmas);
      }
    },
    //공정 모달창 값 전달
    procSelected(proc) {
      this.rowData2[this.selectedSecondIndex].process_code = proc.process_code;
      this.rowData2[this.selectedSecondIndex].process_name = proc.process_name;
      // 새 배열로 설정하여 AG Grid가 반영하게 만듬
      this.rowData2 = [...this.rowData2];
      
      // 다이어그램 업데이트
      this.generateFlowDiagram();
    },
    //저장
    async proSave() {
      //값체크 validation
      for(let data of this.rowData2) {
        console.log(data);
        if(data.prod_code == '' || data.prod_name == '' || data.process_code == '' || data.process_name ==''){
          Swal.fire({
            title: '실패',
            text: '값을 다 입력해주세요',
            icon: 'error',
            confirmButtonText: '확인'
          });
          return;
        }
      }
      const res = axios.post('/api/admin/procsave', {
        insertProc: this.rowData2,
        prodFlow: this.rowData[this.prodIndex].prod_code
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
      this.rowData2 = [{
        prod_code: "",
        prod_name: "",
        process_code: "",
        process_name: "",
      }];
      this.ProcData();
    },
    //순서이동
    onRowDragEnd(event) {
      const updatedData = [];
      event.api.forEachNodeAfterFilterAndSort(node => {
        updatedData.push(node.data);
      });
      this.rowData2 = [...updatedData];
      
      // 다이어그램 업데이트
      this.generateFlowDiagram();
    },
    //다이어그램 실행
    generateFlowDiagram() {
      //
      const newNodes = this.rowData2.map((item, index) => ({
        //다이어그램 ID
        id: item.process_code || `node-${index}`,
        //다이어그램이름
        data: { label: item.process_name?.slice(0, 10) || `공정 ${index + 1}` },
        //다이어그램 위치
        position: { x: 20+ 150 * index, y: 10 +100*index},

        type: index === 0 ? 'input' : (index === this.rowData2.length - 1 ? 'output' : 'default'),
        class: 'my-custom-node-class',
        //스타일
        style: {
          backgroundColor: '#DA942B',
          color: 'white',
          border: '1px solid #DA942B',
          borderRadius: '30px',
          width: '150px',
          height: '40px',
        },
      }));

      // 연결선 만들기: 앞 노드와 다음 노드를 연결
      const newEdges = this.rowData2.slice(1).map((item, index) => ({
        id: `edge-${index}`,
        source: this.rowData2[index].process_code || `node-${index}`,
        target: item.process_code || `node-${index + 1}`,
        //선타입
        type: 'step',
        //움직이는 선 적용
        animated: true,
        //선색깔
        style: { stroke: '#673AB7' },
        //라벨 이름
        label: `단계 ${index + 1} -> ${index + 2}`,
        //라벨 색깔
        labelBgStyle: { fill: '#f5f5f5' },
        labelStyle: { fill:   '#333' },
      }));

      this.nodes = [...newNodes];
      this.edges = [...newEdges];
    },
    // 초기화
    resetList() {
      this.rowData2 = [];
      this.nodes = [];
      this.edges = [];
    },
    
  }
};
</script>

<style>
/* Vue Flow CSS 임포트 */
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.43.1/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.43.1/dist/theme-default.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/controls@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/minimap@latest/dist/style.css';

.ag-theme-alpine .ag-header {
  background-color: #FF9900; 
  color: white;
}

.flow-container {
  height: 400px;
  border: 1px solid #ccc;
}

.my-diagram-class {
  height: 100%;
}
.my-diagram-class .vue-flow__controls .vue-flow__controls-button {
  border: none;
  border-right: 1px solid #eee;
}




</style>