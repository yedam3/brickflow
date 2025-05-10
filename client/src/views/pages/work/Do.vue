<template>
    <div class="card border-0" style="height: 800px">
        <div class="font-semibold text-xl mb-2">공정 진행 관리</div>

        <h4>실적 등록</h4>
        <table class="table table-bordered text-center mt-3">
            <thead class="table-warning">
                <tr>
                    <th>공정명</th>
                    <th>설비명</th>
                    <th>제품명</th>
                    <th>작업자명</th>
                    <th>기작업량</th>
                    <th>미작업량</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ this.processInfo.process_name }}</td>
                    <td>{{ this.processInfo.model_name }}</td>
                    <td>{{ this.processInfo.prod_name }}</td>
                    <td>{{ this.processInfo.emp_name }}</td>
                    <td>{{ this.processInfo.processed_quantity }}</td>
                    <td>{{ this.processInfo.unprocessed_quantity }}</td>
                </tr>
            </tbody>
            
            <thead class="table-warning">
                <tr>
                    <th>투입량</th>
                    <th>불량량</th>
                    <th>생산량</th>
                    <th colspan="2">작업시작일시</th>
                    <th>작업종료일시</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ this.processInfo.input_quantity }}</td>
                    <td>{{ this.processInfo.error_quantity }}</td>
                    <td>{{ this.processInfo.created_quantity }}</td>
                    <td colspan="2">{{ this.processInfo.work_start_date }}</td>
                    <td>{{ this.processInfo.work_end_date }}</td>
                </tr>
            </tbody>
        </table>

        <div class="row text-center mt-4">
            <div class="col-4">
                <div class="border p-2 bg-warning text-white">투입량</div>
                <div class="border p-2 bg-white">{{ this.processInfo.input_quantity }}</div>
            </div>
            <div class="col-4">
                <div class="border p-2 bg-warning text-white">불량량</div>
                <div class="border p-2 bg-white">{{ this.processInfo.error_quantity }}</div>
            </div>
            <div class="col-4">
                <div class="border p-2 bg-warning text-white">입고량</div>
                <div class="border p-2 bg-white">{{ this.processInfo.created_quantity }}</div>
            </div>
        </div>

        <div class="container mt-4">
            <div class="row row-cols-3 g-2 text-center">
                <div class="col border py-3">1</div>
                <div class="col border py-3">2</div>
                <div class="col border py-3">3</div>

                <div class="col border py-3">4</div>
                <div class="col border py-3">5</div>
                <div class="col border py-3">6</div>

                <div class="col border py-3">7</div>
                <div class="col border py-3">8</div>
                <div class="col border py-3">9</div>

                <div class="col border py-3">&lt;</div>
                <div class="col border py-3 bg-dark text-white">0</div>
                <div class="col border py-3">✓</div>
            </div>
        </div>

        <div class="d-flex justify-content-center mt-4 gap-3">
            <Button label="작업 시작" severity="primary" class="" size="large" style="width: 20rem; height: 5rem;" @click=""/>
            <Button label="작업 종료" severity="info" class="" size="large" style="width: 20rem; height: 5rem;" @click=""/>
        </div>
    </div>

</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import DatePickerEditor from "../../../components/DatePickerEditor.vue";
import axios from "axios";

export default {
    components: {
    },
    data() {
        return {
            // 공정 LOT
            work_lot: null,
            // 사번 코드
            emp_code: null,
            // 설비 코드
            fac_code: null,

            // 공정 정보
            processInfo: {
                work_lot: "",               // 공정 LOT
                process_code: "",           // 공정 코드
                process_name: "",           // 공정명
                fac_code: "",               // 설비 코드
                model_name: "",             // 설비명
                prod_code: "",              // 제품 코드
                prod_name: "",              // 제품명
                emp_code: "",               // 사번
                emp_name: "",               // 사원명
                processed_quantity: "",     // 기작업량
                unprocessed_quantity: "",   // 미작업량
                order_quantity: "",         // 지시량
                input_quantity: "",         // 투입량
                error_quantity: "",         // 불량량
                created_quantity: "",       // 생산량
                process_sequence: "",       // 공정 순서
                work_start_date: "",        // 작업 시작 일시
                work_end_date: "",          // 작업 종료 일시
            }
        };
    },
    watch() {

    },
    mounted() {
        const processInfoData = this.$route.query;
        if(typeof processInfoData.work_lot !== 'undefined') {
            this.work_lot = processInfoData.work_lot;
            this.emp_code = processInfoData.emp_code;
            this.fac_code = processInfoData.fac_code;

            this.displayLoad();
        }
    },
    methods: {
        async displayLoad() {
            await axios.get(`/api/work/process/select`, {
                params: {
                    work_lot: this.work_lot,
                    emp_code: this.emp_code,
                    fac_code: this.fac_code,
                }
            }).then(res => {
                this.processInfo = res.data;
            }).catch((err) => console.error(err));
            // // 공정 정보 조회
            // await axios.get(`/api/work/process/workLot/${this.work_lot}`).then(res => {
            //     console.log(res.data);
            // }).catch((err) => console.error(err));

            // // 작업자 정보 조회
            // await axios.get(`/api/work/work/process/emp_code/${this.emp_code}`).then(res => {
            //     console.log(res.data);
            // }).catch((err) => console.error(err));

            // // 설비 정보 조회
            // await axios.get(`/api/work/process/fac_code/${this.fac_code}`).then(res => {
            //     console.log(res.data);
            // }).catch((err) => console.error(err));
        },
    },
};
</script>

<style>
.ag-theme-alpine .ag-header-cell-label {
    justify-content: center;
}
</style>