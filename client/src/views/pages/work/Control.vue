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
            <div class="col-4" @click="setFocus('input_quantity')">
                <div class="border p-2 bg-warning text-white">투입량</div>
                <div class="border p-2" :class="{
                    'bg-white': focusedField !== 'input_quantity',
                    'bg-primary text-white fw-bold border-3 border-primary': focusedField === 'input_quantity'
                }">
                    {{ focusedField === 'input_quantity' ? currentInput : processInfo.input_quantity }}
                </div>
            </div>
            <div class="col-4" @click="setFocus('error_quantity')">
                <div class="border p-2 bg-warning text-white">불량량</div>
                <div class="border p-2" :class="{
                    'bg-white': focusedField !== 'error_quantity',
                    'bg-danger text-white fw-bold border-3 border-danger': focusedField === 'error_quantity'
                }">
                    {{ focusedField === 'error_quantity' ? currentInput : processInfo.error_quantity }}
                </div>
            </div>
            <div class="col-4" @click="setFocus('created_quantity')">
                <div class="border p-2 bg-warning text-white">생산량</div>
                <div class="border p-2" :class="{
                    'bg-white': focusedField !== 'created_quantity',
                    'bg-success text-white fw-bold border-3 border-success': focusedField === 'created_quantity'
                }">
                    {{ focusedField === 'created_quantity' ? currentInput : processInfo.created_quantity }}
                </div>
            </div>
        </div>

        <div class="container d-flex justify-content-center mt-5">
            <div class="card p-3" style="width: 600px;">
                <div class="row row-cols-3 g-2 text-center">
                    <div class="col border py-3" v-for="key in ['1','2','3','4','5','6','7','8','9','<','0','✓']" :key="key" :style="getKeyStyle(key)" @click="handleKey(key)">{{ key }}
                    </div>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-center mt-4 gap-3">
            <Button label="작업 시작" severity="primary" class="" size="large" style="width: 20rem; height: 5rem;" @click="processStart" />
            <Button label="작업 종료" severity="info" class="" size="large" style="width: 20rem; height: 5rem;" @click="processEnd" />
        </div>
    </div>

</template>

<script>
import axios from "axios";

import Swal from 'sweetalert2';

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

            // 선택된 개체
            focusedField: null,
            // 현재 입력 값
            currentInput: null,

            // 키패드 강조
            pressedKey: null,

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
            this.processInfo.work_lot = processInfoData.work_lot;
            this.processInfo.emp_code = processInfoData.emp_code;
            this.processInfo.fac_code = processInfoData.fac_code;
            this.displayLoad();
        }
    },
    methods: {
        // 개체 선택
        setFocus(field) {
            this.focusedField = field;
            this.currentInput = this.processInfo[field].toString();
        },

        // 키 이벤트
        handleKey(key) {
            if (key === '<') {
                this.backspace();
            } else if (key === '✓') {
                this.confirmInput();
            } else {
                this.appendNumber(key);
            }

            this.pressedKey = key;
            setTimeout(() => {
                this.pressedKey = null;
            }, 300); // 500ms 후 초기화
        },

        // 숫자 추가
        appendNumber(num) {
            if(this.focusedField) {
                this.currentInput += num;
            }
        },

        // 입력 위치 수정
        backspace() {
            if(this.focusedField) {
                this.currentInput = this.currentInput.slice(0, -1);
            }
        },

        // 입력 반영
        confirmInput() {
            if(this.focusedField) {
                const numValue = parseInt(this.currentInput) || 0;
                this.processInfo[this.focusedField] = numValue;
                if(this.focusedField === 'input_quantity') {
                    this.processInfo['created_quantity'] = this.processInfo.input_quantity;
                }
                if(this.focusedField === 'error_quantity') {
                    this.processInfo['created_quantity'] = this.processInfo['input_quantity'] - this.processInfo[this.focusedField];
                }
                if(this.focusedField === 'created_quantity') {
                    this.processInfo['error_quantity'] = this.processInfo['input_quantity'] - this.processInfo[this.focusedField];
                }
                this.focusedField = null;
                this.currentInput = "";
            }
        },

        // 키패드 클릭 효과
        getKeyStyle(key) {
            if (this.pressedKey === key.toString()) {
                return {
                    backgroundColor: '#0d6efd', // Bootstrap primary
                    color: 'white',
                    fontWeight: 'bold',
                    border: '3px solid #0d6efd',
                    boxShadow: '0 0 10px rgba(13, 110, 253, 0.5)',
                    transition: 'all 0.1s ease-in-out',
                };
            }
            return {
                backgroundColor: key === '0' ? '#212529' : 'white',
                color: key === '0' ? 'white' : 'black',
            };
        },

        // 공정 정보 표시
        async displayLoad() {
            let work_lot = this.processInfo.work_lot;
                console.log(this.processInfo);
            await axios.get(`/api/work/process/select`, {
                params: {
                    work_lot: this.processInfo.work_lot,
                    emp_code: this.processInfo.emp_code,
                    fac_code: this.processInfo.fac_code,
                }
            }).then(res => {
                this.processInfo = res.data;
                this.processInfo.work_lot = work_lot;
                
                this.processInfo.input_quantity = 0;
                this.processInfo.error_quantity = 0;
                this.processInfo.created_quantity = 0;
            }).catch((err) => console.error(err));

            // 미작업량 = 투입량
            this.processInfo.input_quantity = this.processInfo.unprocessed_quantity;
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

        // 작업 시작
        async processStart() {
            // 투입량
            if (this.processInfo.input_quantity === 0) {
                Swal.fire({
                    title: '오류',
                    text: '투입량을 기입하세요.',
                    icon: 'error',
                    confirmButtonText: '확인',
                });
                return;
            }
            if (this.processInfo.input_quantity > this.processInfo.unprocessed_quantity) {
                Swal.fire({
                    title: '오류',
                    text: '투입량은 미작업량을 초과할 수 없습니다.',
                    icon: 'error',
                    confirmButtonText: '확인',
                });
                return;
            }
            if (this.processInfo.work_start_date) {
                Swal.fire({
                    title: '오류',
                    text: '해당 작업은 이미 시작된 상태입니다.',
                    icon: 'error',
                    confirmButtonText: '확인',
                });
                return;
            }
            if(this.processInfo.input_quantity != this.processInfo.error_quantity + this.process)
            await axios.post(`/api/work/process/start`, {
                work_lot: this.processInfo.work_lot,
                fac_code: this.processInfo.fac_code,
                employee_code: this.processInfo.emp_code,
                input_quantity: this.processInfo.input_quantity,
            }).then(res => {
                const nowTime = new Date()
                this.processInfo.work_start_date = this.formatDate(nowTime);
                if(res.data[1][0].result_code === 0) {
                    Swal.fire({
                        title: '성공',
                        text: '작업이 문제 없이 시작되었습니다.',
                        icon: 'success',
                        confirmButtonText: '확인',
                    });
                } else {
                    Swal.fire({
                        title: '오류',
                        text: '작업 시작에 실패했습니다.',
                        icon: 'error',
                        confirmButtonText: '확인',
                    });
                }
            }).catch((err) => console.error(err));
        },

        // 작업 종료
        async processEnd() {
            if (this.processInfo.input_quantity < this.processInfo.error_quantity + this.processInfo.created_quantity) {
                Swal.fire({
                    title: '오류',
                    text: '불량 수량과 생산 수량의 합이 투입 수량을 초과하였습니다.',
                    icon: 'error',
                    confirmButtonText: '확인',
                });
                return;
            }
            if (!this.processInfo.work_start_date) {
                Swal.fire({
                    title: '오류',
                    text: '작업이 시작되지 않은 상태에서는 종료가 불가능합니다.',
                    icon: 'error',
                    confirmButtonText: '확인',
                });
                return;
            }
            await axios.post(`/api/work/process/end`, {
                work_lot: this.processInfo.work_lot,
                fac_code: this.processInfo.fac_code,
                employee_code: this.processInfo.emp_code,
                error_quantity: this.processInfo.error_quantity,
                created_quantity: this.processInfo.created_quantity,
            }).then(res => {
                const nowTime = new Date()
                this.processInfo.work_end_date = this.formatDate(nowTime);
                if(res.data[1][0].result_code === 0) {
                    Swal.fire({
                        title: '성공',
                        text: '작업이 문제 없이 종료되었습니다.',
                        icon: 'success',
                        confirmButtonText: '확인',
                    });
                } else {
                    Swal.fire({
                        title: '오류',
                        text: '작업 종료에 실패했습니다.',
                        icon: 'error',
                        confirmButtonText: '확인',
                    });
                }
            }).catch((err) => console.error(err));
        },

        // 날짜 반영
        formatDate(dateTime) {
            const yyyy = dateTime.getFullYear()
            const MM = String(dateTime.getMonth() + 1).padStart(2, '0')
            const dd = String(dateTime.getDate()).padStart(2, '0')
            const hh = String(dateTime.getHours()).padStart(2, '0')
            const mm = String(dateTime.getMinutes()).padStart(2, '0')
            const ss = String(dateTime.getSeconds()).padStart(2, '0')
            return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`
        },

        //
    },
};
</script>

<style>
.ag-theme-alpine .ag-header-cell-label {
    justify-content: center;
}
</style>