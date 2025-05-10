<template>
    <div class="card border-0" style="height: 800px">
        <div class="font-semibold text-xl mb-2">공정 진행 관리</div>

        <h4>생산 실적 조회</h4>
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