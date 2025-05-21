<template>
    <div class="card border-0" style="height: calc(38vh - 3.8rem)">
        <h3>공정 관리</h3>
        <div class="heading-with-line mb-3">
            <h5 class="m-0 me-3">생산 실적 조회</h5>
        </div>

        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-4">
                    <InputGroup>
                        <InputGroupAddon>
                            계획코드
                        </InputGroupAddon>
                        <InputText v-model="formData.plan_code" size="large" placeholder="(입력)"
                            @keydown.enter="searchProcessData" />
                    </InputGroup>
                </div>
                <div class="col-4">
                    <InputGroup>
                        <InputGroupAddon>
                            지시 코드
                        </InputGroupAddon>
                        <InputText v-model="formData.product_order_code" size="large" placeholder="(입력)"
                            @keydown.enter="searchProcessData" />
                    </InputGroup>
                </div>
                <div class="col-4">
                    <InputGroup>
                        <InputGroupAddon>
                            제품명
                        </InputGroupAddon>
                        <InputText v-model="formData.prod_name" size="large" placeholder="(입력)"
                            @keydown.enter="searchProcessData" />
                    </InputGroup>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-4">
                    <InputGroup>
                        <InputGroupAddon>
                            계획명
                        </InputGroupAddon>
                        <InputText v-model="formData.plan_name" size="large" placeholder="(입력)"
                            @keydown.enter="searchProcessData" />
                    </InputGroup>
                </div>
                <div class="col-4">
                    <InputGroup>
                        <InputGroupAddon>
                            지시명
                        </InputGroupAddon>
                        <InputText v-model="formData.product_order_name" size="large" placeholder="(입력)"
                            @keydown.enter="searchProcessData" />
                    </InputGroup>
                </div>
                <div class="col-4">
                    <InputGroup>
                        <InputGroupAddon>
                            공정명
                        </InputGroupAddon>
                        <InputText v-model="formData.process_name" size="large" placeholder="(입력)"
                            @keydown.enter="searchProcessData" />
                    </InputGroup>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-6">
                    <InputGroup>
                        <InputGroupAddon>
                            시작일자
                        </InputGroupAddon>
                        <DatePicker v-model="formData.work_start_date_from" size="large" dateFormat="yy/mm/dd"
                            placeholder="(입력)" @keydown.enter="searchProcessData" showIcon iconDisplay="input" />
                        <div class="align-content-center">
                            <div class="mx-2">~</div>
                        </div>
                        <DatePicker v-model="formData.work_start_date_to" size="large" dateFormat="yy/mm/dd"
                            placeholder="(입력)" @keydown.enter="searchProcessData" showIcon iconDisplay="input" />
                    </InputGroup>
                </div>
                <div class="col-6">
                    <InputGroup>
                        <InputGroupAddon>
                            종료일자
                        </InputGroupAddon>
                        <DatePicker v-model="formData.work_end_date_from" size="large" dateFormat="yy/mm/dd"
                            placeholder="(입력)" @keydown.enter="searchProcessData" showIcon iconDisplay="input" />
                        <div class="align-content-center">
                            <div class="mx-2">~</div>
                        </div>
                        <DatePicker v-model="formData.work_end_date_to" size="large" dateFormat="yy/mm/dd"
                            placeholder="(입력)" @keydown.enter="searchProcessData" showIcon iconDisplay="input" />
                    </InputGroup>
                </div>
            </div>
            <div class="row">
                <div class="col">

                </div>
                <div class="col">
                    <div class="d-flex justify-content-center">
                        <Button label="조회" severity="success" size="large" class="me-2" @click="searchProcessData" />
                        <Button label="초기화" severity="danger" size="large" class="" @click="clearForm" />
                    </div>
                </div>
                <div class="col">
                    <div class="d-flex justify-content-end">
                        <Button label="Excel 내보내기" severity="info" size="large" class="me-2" @click="exportExcel" />
                        <Button label="CSV 내보내기" severity="info" size="large" class="" @click="exportCSV" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="card border-0" style="min-height: calc(62vh - 6.2rem)">
        <div class="heading-with-line mb-3">
            <h5 class="m-0 me-3">생산 실적 목록</h5>
        </div>
        <div class="ag-wrapper d-flex justify-content-center" style="border: none;">
            <ag-grid-vue ref="mainGrid" class="ag-theme-alpine custom-grid-theme" style="width: 100%; border: none;"
                :columnDefs="columnDefs" :rowData="processList" :gridOptions="gridOptions" @cellClicked="">
            </ag-grid-vue>
        </div>
    </div>

    <!-- 프로그레스바바 오버레이 -->
    <div v-if="isLoading" class="loading-overlay">
        <div class="loading-content">
            <div class="loading-spinner">
                <div class="spinner"></div>
            </div>

            <!-- 프로그레스바 -->
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: loadingProgress + '%' }"></div>
                </div>
                <div class="progress-text">
                    {{ loadingProgress.toFixed(0) }}%
                </div>
            </div>

            <!-- 로딩 메시지 -->
            <div class="loading-message">
                {{ loadingMessage }}
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

import { AgGridVue } from "ag-grid-vue3";
import DatePickerEditor from "../../../components/DatePickerEditor.vue";
import Swal from 'sweetalert2';
import ProgressCell from "@/components/ProgressCell.vue";

export default {
    components: {
        AgGridVue,
        DatePicker: DatePickerEditor,
        ProgressCell,
    },
    data() {
        return {
            formData: {
                plan_code: "",
                product_order_code: "",
                prod_name: "",

                product_order_name: "",
                plan_name: "",
                process_name: "",

                work_start_date_from: "",
                work_start_date_to: "",
                work_end_date_from: "",
                work_end_date_to: "",
            },

            processList: [

            ],

            gridOptions: {
                domLayout: "autoHeight",            // 행을 보고 자동으로 hight부여
                pagination: true,                   // 페이지네이션 활성화
                paginationPageSize: 7,              // 페이지당 갯수
                paginationPageSizeSelector: false,  // 
                defaultColDef: {
                    suppressMovable: true,          // 셀 이동 금지
                    resizable: false,               // 열 크기 조정 불가능
                    sortable: false,                // 정렬 금지
                },
            },

            // 실적 조회 프로그레스바
            isLoading: false,
            loadingProgress: 0,
            loadingMessage: '',
        };
    },
    watch() {

    },

    mounted() {
        this.getProcessData();
    },

    computed: {
        columnDefs() {
            return [
                { field: "product_order_code", headerName: "지시코드", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "product_order_name", headerName: "지시명", flex: 3, cellStyle: { textAlign: "center" } },
                { field: "process_name", headerName: "공정명", flex: 3, cellStyle: { textAlign: "center" } },
                { field: "process_start_date", headerName: "공정 시작 일자", flex: 4, cellStyle: { textAlign: "center" } },
                { field: "process_end_date", headerName: "공정 종료 일자", flex: 4, cellStyle: { textAlign: "center" } },
                { field: "prod_name", headerName: "제품명", flex: 4, cellStyle: { textAlign: "center" } },
                { field: "order_quantity", headerName: "지시량", flex: 1.5, cellStyle: { textAlign: "center" } },
                { field: "input_quantity", headerName: "투입량", flex: 1.5, cellStyle: { textAlign: "center" } },
                { field: "error_quantity", headerName: "불량량", flex: 1.5, cellStyle: { textAlign: "center" } },
                { field: "created_quantity", headerName: "생산량", flex: 1.5, cellStyle: { textAlign: "center" } },
                {
                    field: "process_progress", headerName: "공정 진행도", flex: 3, cellRenderer: 'ProgressCell'
                },
            ]
        }
    },

    methods: {

        // 초기화
        clearForm() {
            this.formData = {};
            // this.processList = [];
        },

        // 실적 목록 조회 (프로그레스바 포함)
        async getProcessData() {
            try {
                // 프로그레스바 시작
                this.isLoading = true;
                this.loadingProgress = 0;
                this.loadingMessage = '실적 데이터를 조회하는 중...';

                // 1. API 호출 시작
                this.updateProgress(20, '서버에서 실적 데이터 요청 중...');

                const response = await axios.get(`/api/work/process/data`);

                // 2. 데이터 수신 완료
                this.updateProgress(50, '실적 데이터 수신 완료, 처리 중...');

                const processDataList = response.data;
                const totalItems = processDataList.length;

                // 3. 데이터 처리 시작
                this.updateProgress(60, `${totalItems}개의 실적 데이터 처리 중...`);

                // 기존 리스트 초기화
                this.processList = [];

                // UI 업데이트 최적화
                const batchSize = Math.max(1, Math.floor(totalItems / 10)); // 10단계
                const batches = [];

                for (let i = 0; i < processDataList.length; i += batchSize) {
                    batches.push(processDataList.slice(i, i + batchSize));
                }

                // 각 배치별로 처리하며 진행률 업데이트
                for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
                    const batch = batches[batchIndex];

                    // 배치 처리
                    for (let data of batch) {
                        let process_pct = Number(data.order_quantity) > 0
                            ? Number((Number(data.error_quantity) + Number(data.created_quantity)) / Number(data.order_quantity) * 100)
                            : 0;

                        this.processList.push({
                            product_order_code: data.product_order_code,
                            product_order_name: data.product_order_name,
                            process_name: data.process_name,
                            process_start_date: data.process_start_date,
                            process_end_date: data.process_end_date,
                            prod_name: data.prod_name,
                            order_quantity: data.order_quantity,
                            input_quantity: data.input_quantity,
                            error_quantity: data.error_quantity,
                            created_quantity: data.created_quantity,
                            process_progress: process_pct,
                        });
                    }

                    // 배치 처리 완료 후 진행 업데이트
                    const progressIncrement = 30 / batches.length;
                    const currentProgress = 60 + (progressIncrement * (batchIndex + 1));
                    this.updateProgress(
                        currentProgress,
                        `실적 데이터 처리 중... (${Math.min((batchIndex + 1) * batchSize, totalItems)}/${totalItems})`
                    );

                    // UI 업데이트 대기
                    await new Promise(resolve => setTimeout(resolve, 10));
                }

                // 4. 최종 처리
                this.updateProgress(95, '화면 업데이트 중...');
                this.processList = [...this.processList];

                this.updateProgress(100, `실적 조회 완료! (총 ${totalItems}건)`);

                // 완료 메시지 표시 후 프로그레스바 숨김
                setTimeout(() => {
                    this.isLoading = false;
                    this.loadingProgress = 0;
                    this.loadingMessage = '';
                }, 800);

            } catch (err) {
                console.error(err);
                this.loadingMessage = '실적 조회 중 오류가 발생했습니다.';

                // 에러 표시
                Swal.fire({
                    title: '실패',
                    text: '실적을 조회하던 중 오류가 발생했습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });

                // 3초 후 프로그레스바 숨김
                setTimeout(() => {
                    this.isLoading = false;
                    this.loadingProgress = 0;
                    this.loadingMessage = '';
                }, 3000);
            }
        },

        // 실적 목록 검색 (프로그레스바 포함)
        async searchProcessData() {
            try {
                // 프로그레스바 시작
                this.isLoading = true;
                this.loadingProgress = 0;
                this.loadingMessage = '실적 데이터를 검색하는 중...';

                // 1. 검색 조건 준비
                this.updateProgress(15, '검색 조건 준비 중...');

                // 2. API 호출 시작
                this.updateProgress(30, '서버에 검색 요청 중...');

                const response = await axios.get(`/api/work/process/data`, {
                    params: this.formData,
                });

                // 3. 검색 결과 수신
                this.updateProgress(60, '검색 결과 수신 완료, 처리 중...');

                const processDataList = response.data;
                const totalItems = processDataList.length;

                // 기존 리스트 초기화
                this.processList = [];

                if (totalItems === 0) {
                    this.updateProgress(100, '검색 결과가 없습니다.');
                    setTimeout(() => {
                        this.isLoading = false;
                        this.loadingProgress = 0;
                        this.loadingMessage = '';
                    }, 1000);
                    return;
                }

                // 4. 검색 결과 처리
                this.updateProgress(70, `${totalItems}개의 검색 결과 처리 중...`);

                // 배치 처리로 UI 업데이트 최적화
                const batchSize = Math.max(1, Math.floor(totalItems / 8)); // 8단계
                const batches = [];

                for (let i = 0; i < processDataList.length; i += batchSize) {
                    batches.push(processDataList.slice(i, i + batchSize));
                }

                // 각 배치별로 처리 후 진행률 업데이트
                for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
                    const batch = batches[batchIndex];

                    // 배치 처리
                    for (let data of batch) {
                        let process_pct = Number(data.order_quantity) > 0
                            ? Number((Number(data.error_quantity) + Number(data.created_quantity)) / Number(data.order_quantity) * 100)
                            : 0;

                        this.processList.push({
                            product_order_code: data.product_order_code,
                            product_order_name: data.product_order_name,
                            process_name: data.process_name,
                            process_start_date: data.process_start_date,
                            process_end_date: data.process_end_date,
                            prod_name: data.prod_name,
                            order_quantity: data.order_quantity,
                            input_quantity: data.input_quantity,
                            error_quantity: data.error_quantity,
                            created_quantity: data.created_quantity,
                            process_progress: process_pct,
                        });
                    }

                    // 배치 처리 완료 후 진행률 업데이트
                    const progressIncrement = 25 / batches.length;
                    const currentProgress = 70 + (progressIncrement * (batchIndex + 1));
                    this.updateProgress(
                        currentProgress,
                        `검색 결과 처리 중... (${Math.min((batchIndex + 1) * batchSize, totalItems)}/${totalItems})`
                    );

                    // UI 업데이트 대기
                    await new Promise(resolve => setTimeout(resolve, 8));
                }

                // 5. 최종 처리
                this.updateProgress(98, '검색 결과 정렬 중...');
                this.processList = [...this.processList];

                this.updateProgress(100, `검색 완료! (${totalItems}건 발견)`);

                // 완료 메시지 표시 후 프로그레스바 숨김
                setTimeout(() => {
                    this.isLoading = false;
                    this.loadingProgress = 0;
                    this.loadingMessage = '';
                }, 800);

            } catch (err) {
                console.error(err);
                this.loadingMessage = '검색 중 오류가 발생했습니다.';

                // 에러 표시
                Swal.fire({
                    title: '실패',
                    text: '실적을 조회하던 중 오류가 발생했습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });

                // 3초 후 프로그레스바 숨김
                setTimeout(() => {
                    this.isLoading = false;
                    this.loadingProgress = 0;
                    this.loadingMessage = '';
                }, 3000);
            }
        },

        // 프로그레스바 업데이트 헬퍼 함수 (공통 사용)
        updateProgress(progress, message) {
            this.loadingProgress = Math.min(progress, 100);
            this.loadingMessage = message;

            // Vue의 반응성을 위해 nextTick 사용
            this.$nextTick(() => {
                this.$forceUpdate();
            });
        },

        // 부드러운 프로그레스바 애니메이션 (선택사항)
        async updateProgressSmooth(targetProgress, message, duration = 150) {
            const startProgress = this.loadingProgress;
            const progressDiff = targetProgress - startProgress;
            const steps = Math.max(1, Math.floor(duration / 16));
            const stepSize = progressDiff / steps;

            this.loadingMessage = message;

            for (let i = 0; i < steps; i++) {
                await new Promise(resolve => setTimeout(resolve, 16));
                this.loadingProgress = Math.min(startProgress + (stepSize * (i + 1)), 100);
            }

            this.loadingProgress = Math.min(targetProgress, 100);
        },

        // Excel Export
        exportExcel() {
            let tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
            tab_text += '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
            tab_text += '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
            tab_text += '<x:Name>Sheet1</x:Name>';
            tab_text += '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
            tab_text += '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
            tab_text += "<table border='1'><thead><tr>";

            // 컬럼명 추출
            const keys = Object.keys(this.processList[0]);
            for (let key of keys) {
                tab_text += `<th>${key}</th>`;
            }
            tab_text += "</tr></thead><tbody>";

            // 데이터 삽입
            for (let row of this.processList) {
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
            link.download = 'brickflow-work-data' + this.nowDateTime() + ".xls";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        // CSV Export
        exportCSV() {
            if (!this.processList || !this.processList.length) {
                Swal.fire({
                    title: '실패',
                    text: '데이터가 존재하지 않습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                })
                return;
            }

            const keys = Object.keys(this.processList[0]);

            // CSV 헤더
            let csvContent = keys.join(",") + "\n";

            // CSV 데이터 행
            this.processList.forEach(row => {
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
            link.setAttribute("download", 'brickflow-work-data' + this.nowDateTime());
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

<style>
.ag-theme-alpine .ag-header-cell-label {
    justify-content: center;
}
</style>
<style scoped>
/* 로딩 오버레이 스타일 */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.loading-content {
    background-color: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    text-align: center;
    min-width: 300px;
}

/* 스피너 애니메이션 */
.loading-spinner {
    margin-bottom: 24px;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #2196F3;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* 프로그레스바 스타일 */
.progress-container {
    margin-bottom: 20px;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #2196F3, #21CBF3);
    border-radius: 4px;
    transition: width 0.3s ease;
    position: relative;
}

/* 프로그레스바 애니메이션 효과 */
.progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent);
    animation: progress-shine 1.5s infinite;
}

@keyframes progress-shine {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(100%);
    }
}

.progress-text {
    font-size: 14px;
    font-weight: 600;
    color: #2196F3;
}

/* 로딩 메시지 스타일 */
.loading-message {
    font-size: 16px;
    color: #666;
    margin-top: 8px;
    min-height: 20px;
}

/* 컨텐츠 블러 효과 */
.content-blurred {
    filter: blur(2px);
    pointer-events: none;
}

/* 모바일 반응형 */
@media (max-width: 480px) {
    .loading-content {
        margin: 20px;
        padding: 30px 20px;
        min-width: auto;
    }
}

/* 다크모드 지원 */
:root[class='app-dark'] .loading-content {
    background-color: #333;
    color: white;
}

:root[class='app-dark'] .loading-message {
    color: #ccc;
}

:root[class='app-dark'] .progress-bar {
    background-color: #555;
}
</style>