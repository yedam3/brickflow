<template>
    <div class="card border-0" style="height: calc(100vh - 8rem)">
        <h3>생산 전표 관리</h3>
        <div class="heading-with-line mb-2">
            <h5 class="m-0 me-3">전표 출력</h5>
        </div>
        <div class="text-end mt-3 mb-3">
            <div class="row justify-content-between align-items-center">
                <div class="col-auto">
                    <div class="input-group">
                        <select class="form-select w-auto" v-model="searchType">
                            <option value="c.prod_check_code" selected>검사코드</option>
                            <option value="c.prod_code">제품코드</option>
                            <option value="prod_name">제품명</option>
                            <option value="work_lot">생산LOT</option>
                        </select>

                        <input type="text" v-model="searchText" placeholder="검색" @input="onSearch" class="form-control"
                            style="width: 50%;" @keydown.enter="searchList" />

                        <button @click="searchList" class="btn btn-primary">
                            <i class="pi pi-search"></i>
                        </button>
                    </div>
                </div>

                <div class="col-auto d-flex flex-wrap justify-content-end gap-2 text-end mt-3 mb-4">
                    <Button label="Excel 내보내기" severity="success" @click="excelExport" />
                    <Button label="SCV 내보내기" severity="danger" @click="scvExport" />
                    <Button label="전표출력" severity="warn" @click="labelView" />
                </div>
            </div>
        </div>
        <ag-grid-vue class="ag-theme-alpine custom-grid-theme" :columnDefs="columnDefs"
            :rowData="rowData" @cellValueChanged="inputRender" :gridOptions="gridOptions">
        </ag-grid-vue>
    </div>

    <LabelModal :visible="showModal" :datable="modalData" rowSelection="multiple" @close="showModal = false">
    </LabelModal>

</template>
<script>
import { AgGridVue } from "ag-grid-vue3";
import axios from "axios";
import LabelModal from "@/components/modal/LabelModal.vue";
import Swal from "sweetalert2";
export default {
    components: {
        AgGridVue,
        LabelModal,
        Swal
    },
    data() {
        return {
            searchType: "c.prod_code",  // 검색 조건 
            searchText: "",   // 검색어
            //메인그리드
            rowData: [],
            modalData: [],
            columnDefs: [
                { field: "prod_check_code", headerName: "검수코드", flex: 2,},
                { field: "prod_code", headerName: "제품코드", flex: 3,},
                { field: "prod_name", headerName: "제품명", flex: 2,},
                { field: "work_lot", headerName: "생산LOT", flex: 2,  },
                { field: "pass_quantity", headerName: "입고가능수량", flex: 3,},
                { field: "finish_quantity", headerName: "입고수량(직접기입)", flex: 3,editable:true},
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
            showModal: false,
        };
    },
    mounted() {
        this.finishedReady();
    },
    methods: {
        // 왼제품 대기 항목 조회
        async finishedReady() {
            await axios.get('/api/label/labelList')
                       .then(res => {
                        this.rowData = res.data;
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
                    for( let value of res.data){
                        value.finish_quantity = '';
                    }
                    this.rowData = res.data;
                })
                .catch((err) => console.log(err));
        },
        inputRender(event){
            //입고가능수량 보다 더많은값을 기입시
            if(Number(event.data.pass_quantity) < Number(event.data.finish_quantity)){
                Swal.fire({
                    title: '실패',
                    text: '입고가능수량보다 더 많은 값을 입력하엿습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                })
                event.data.finish_quantity='';
                event.api.refreshCells({ rowNodes: [event.node], columns: ['finish_quantity'] })
            }
        },
        labelView(){
            //입고수량 값 체크
            if (!this.rowData.some(row => row.finish_quantity && row.finish_quantity.trim() !== '')) {
                Swal.fire({
                    title: '실패',
                    text: '입고수량의 값을 입력해주십시오.',
                    icon: 'error',
                    confirmButtonText: '확인'
                })
                return;
            }
        
            let filterData = this.rowData.filter(info => info.finish_quantity>0)
            this.modalData = filterData;
            this.showModal = true;
        },

        // Excel 내보내기
        excelExport() {
            let tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
            tab_text += '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
            tab_text += '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
            tab_text += '<x:Name>Sheet1</x:Name>';
            tab_text += '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
            tab_text += '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
            tab_text += "<table border='1'><thead><tr>";

            // 컬럼명 추출
            const keys = Object.keys(this.rowData[0]);
            for (let key of keys) {
                tab_text += `<th>${key}</th>`;
            }
            tab_text += "</tr></thead><tbody>";

            // 데이터 삽입
            for (let row of this.rowData) {
                tab_text += "<tr>";
                for (let key of keys) {
                    tab_text += `<td>${row[key]}</td>`;
                }
                tab_text += "</tr>";
            }

            tab_text += "</tbody></table></body></html>";

            // Blob 및 다운로드
            const blob = new Blob([tab_text], {
                type: "application/vnd.ms-excel;charset=utf-8;",
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = 'brickflow' + this.nowDateTime() + ".xls";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        // csv 내보내기
        scvExport() {
            if (!this.rowData || !this.rowData.length) {
                Swal.fire({
                    title: '실패',
                    text: '데이터가 존재하지 않습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                })
                return;
            }

            const keys = Object.keys(this.rowData[0]);

            // CSV 헤더
            let csvContent = keys.join(",") + "\n";

            // CSV 데이터 행
            this.rowData.forEach(row => {
                const values = keys.map(k => `"${String(row[k]).replace(/"/g, '""')}"`);
                csvContent += values.join(",") + "\n";
            });

            // Blob 생성 및 다운로드
            const BOM = '\uFEFF';

            const blob = new Blob([BOM + csvContent], {
                type: "text/csv;charset=utf-8;",
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", 'brickflow' + this.nowDateTime());
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        
        // 현재 시간 날짜
        nowDateTime() {
            const now = new Date();
            const timestamp = now.toISOString()
                .replace(/T/, '_')
                .replace(/:/g, '-')
                .replace(/\..+/, '');
            return timestamp;
        }
    },
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