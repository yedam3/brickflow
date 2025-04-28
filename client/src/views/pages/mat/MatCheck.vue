<template>
    <div class="card border-0" style="height: 800px">
        <div class="font-semibold text-xl mb-4">자재검수관리</div>
        <div class="text-end mt-3 mb-3">
            <Button label="조회" severity="success" class="me-3" @click="matOrderList" />
            <Button label="등록" severity="info" class="me-3" />
            <Button label="수정" severity="help" class="me-3" />
            <Button label="삭제" severity="danger" class="me-5" />
        </div>
        <div class="row">

            <div class="ag-theme-alpine col me-5" style="height: 400px; width: 50%">
                <!-- 검색창 -->
                <div class="d-flex justify-content-start">
                    <div class="input-group mb-5" style="width: 65%;">
                        <!-- 검색 조건 선택 -->
                        <select v-model="searchType" class="form-select" aria-label="Default select example">
                            <option value="m.mat_order_code" selected>발주코드</option>
                            <option value="m.mat_order_name">발주명</option>
                            <option value="company_name">업체명</option>
                            <option value="mat_name">자재명</option>
                        </select>
                        <!-- 검색어 입력 -->
                        <input type="text" v-model="searchText" placeholder="검색어 입력" class="form-control w-50"
                            style="width: 100%" @keydown.enter="searchMaterials" />
                        <!-- 검색 버튼 -->
                        <button @click="searchMaterials" class="btn btn-primary">
                            <i class="pi pi-search"></i>
                        </button>
                    </div>
                </div>
                <!-- ag-Grid 테이블 -->
                <AgGridVue style="width: 100%; height: 100%" class="ag-theme-alpine" :columnDefs="columnDefs"
                    :rowData="rowData" :gridOptions="gridOptions" @rowClicked="clicked" />
            </div>
            <div class="card border-0 col" style="height: 600px; background-color: #F5F5F5;">
                <h5>검수등록</h5>
                <div class="row">
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">자재코드</span>
                        <input type="text" class="form-control" placeholder="자재코드" aria-label="Username"
                            aria-describedby="basic-addon1" readonly>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">자재명</span>
                        <input type="text" class="form-control" placeholder="자재명" aria-label="Username"
                            aria-describedby="basic-addon1" readonly>
                    </div>
                </div>
                <div class="row">
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">기검수량</span>
                        <input type="text" class="form-control" placeholder="기검수량" aria-label="Username"
                            aria-describedby="basic-addon1" readonly>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">미검수량</span>
                        <input type="text" class="form-control" placeholder="미검수량" aria-label="Username"
                            aria-describedby="basic-addon1" readonly>
                    </div>
                </div>
                <div class="row">
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">발주량</span>
                        <input type="text" class="form-control" placeholder="발주량" aria-label="Username"
                            aria-describedby="basic-addon1" readonly>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">검수량</span>
                        <input type="text" class="form-control" placeholder="검수량" aria-label="Username"
                            aria-describedby="basic-addon1">
                    </div>
                </div>
                <div class="row">
                    <div class="input-group col">
                        <span class="input-group-text" id="basic-addon1">비고</span>
                        <textarea class="form-control" placeholder="비고" style="height: 100px; resize: none;"></textarea>
                    </div>
                </div>
                <h5>검사항목</h5>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" name="quantity">
                    <label class="form-check-label" for="flexCheckDefault" name="quantity">
                        수량불일치
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="">
                    <label class="form-check-label" for="flexCheckChecked">
                        규격불일치
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="">
                    <label class="form-check-label" for="flexCheckDefault">
                        색상
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="">
                    <label class="form-check-label" for="flexCheckChecked">
                        외관
                    </label>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
import axios from "axios";
import { AgGridVue } from "ag-grid-vue3";

export default {
    name: "MatOrderModal",
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
                { field: "mat_order_detailCode", headerName: "발주디테일", flex: 1 },
                { field: "company_name", headerName: "업체명", flex: 1 },
                { field: "mat_name", headerName: "자재명", flex: 2 },
                {
                    field: "status", headerName: "발주상태", flex: 1,
                    cellStyle: params => {
                        if (params.value == '검수대기') {
                            return { color: '#0284C7', textAlign: 'center', fontWeight: 'bold' }; // 파란색
                        } else if (params.value == '검수완료') {
                            return { color: '#22C55E', textAlign: 'center', fontWeight: 'bold' }; // 초록색
                        } else if (params.value == '반품처리') {
                            return { color: '#E02D2D', textAlign: 'center', fontWeight: 'bold' }; // 빨간색
                        } else if (params.value == '검수중') {
                            return { color: '#A855F7', textAlign: 'center', fontWeight: 'bold' }; // 빨간색
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
                paginationPageSize: 8,
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
        async matList() {
          
            await axios.get('/api/mat/checkList')
                .then(res => {
                    console.log(res.data)
                    this.rowData = res.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        async searchMaterials() {
            await axios.get('/api/mat/checkList', {
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
.input-group-text{
    background-color: #FFCC80;
    border-color: #FFCC80;
}
</style>