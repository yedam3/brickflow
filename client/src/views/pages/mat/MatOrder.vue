<template>
    <div class="card border-0 h-100">
      <div class="font-semibold text-xl mb-4">자재발주관리</div>
      
      <div class="text-end mt-3 mb-3">
        <Button label="조회" severity="success" class="me-3"/>
        <Button label="등록" severity="info" class="me-3"/>
        <Button label="수정" severity="help" class="me-3" />
        <Button label="삭제" severity="danger" class="me-5"/>
      </div>
      
      <!-- 그리드 wrapper -->
      <div class="ag-wrapper d-flex justify-content-center">
        <ag-grid-vue
          class="ag-theme-alpine custom-grid-theme"
          style="width: 95%; height: 93px;"
          :columnDefs="columnDefs"
          :rowData="rowData"
          :gridOptions="gridOptions">
        </ag-grid-vue>
      </div>
    </div>
  </template>
  
  <script>
  import { AgGridVue } from 'ag-grid-vue3';
  import DatePickerEditor from '../../../components/DatePickerEditor.vue';
  
  
  export default {
    components: {
      AgGridVue,
      datePicker: DatePickerEditor,
    },
    data() {
      return {
        rowData: [
          {
            name: 'ORD-20250426-001',
            gender: '',
            city: '',
            tel: '',
            registeredBy: '',
            remarks: ''
          },
        ],
        columnDefs: [
          { field: 'name', headerName: '자재발주관리', flex: 2, cellStyle: {textAlign: "center"} },
          { field: 'gender', headerName: '주문명', flex: 2, editable: true, cellStyle: {textAlign: "center"} },
          { field: 'city', headerName: '주문일자', flex: 2, editable: true, cellStyle: {textAlign: "center"}, cellEditor: 'datePicker', },
          { field: 'tel', headerName: '납기일자', flex: 3, editable: true, cellStyle: {textAlign: "center"} , cellEditor: 'datePicker',},
          { field: 'registeredBy', headerName: '등록자', flex: 3, cellStyle: {textAlign: "center"} },
          { field: 'supplier', headerName: '업체명', flex: 3, cellStyle: {textAlign: "center"} },
          { field: 'remarks', headerName: '비고', flex: 3, editable: true, cellStyle: {textAlign: "center"} }
        ],
        gridOptions: {
          singleClickEdit: true,  //한번클릭했을때 수정
            defaultColDef: {
             suppressMovable: true, //셀 이동 금지
             resizable: false, // 열 크기 조정 가능
             sortable :false //정렬 금지
           },
          frameworkComponents: {
             datePicker: DatePickerEditor
            }
        }
      };
    }
  };
  </script>
  
  <style>
  /* 헤더 색상 */

  
 /* 헤더 텍스트 가운데 정렬  */
  .ag-theme-alpine .ag-header-cell-label {
    justify-content: center;
  }
  </style>