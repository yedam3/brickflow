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
                    <td>공정1</td>
                    <td>설비1</td>
                    <td>제품1</td>
                    <td>신현욱</td>
                    <td>20</td>
                    <td>20</td>
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
                    <td>20</td>
                    <td>0</td>
                    <td>20</td>
                    <td colspan="2">2024-04-04 17:00</td>
                    <td>2024. 4. 4 오전 5:10:23</td>
                </tr>
            </tbody>
        </table>

        <div class="row text-center mt-4">
            <div class="col-4">
                <div class="border p-2 bg-warning text-white">투입량</div>
                <div class="border p-2 bg-white">20</div>
            </div>
            <div class="col-4">
                <div class="border p-2 bg-warning text-white">불량량</div>
                <div class="border p-2 bg-white">0</div>
            </div>
            <div class="col-4">
                <div class="border p-2 bg-warning text-white">입고량</div>
                <div class="border p-2 bg-white">20</div>
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
        };
    },
    watch() {

    },
    mounted() {
    },
    methods: {
    },
};
</script>

<style>
.ag-theme-alpine .ag-header-cell-label {
    justify-content: center;
}
</style>