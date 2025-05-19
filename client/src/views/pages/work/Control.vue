<template>
    <div class="card border-0" style="min-height: calc(100vh - 8rem)">
        <h3>공정 진행 관리</h3>
        <div class="heading-with-line mb-2">
            <h5 class="m-0 me-3">제어</h5>
        </div>
        <div class="container">
            <div class="row g-3">
                <div class="col-md-4">
                    <div class="p-3 border rounded d-flex align-items-center card-mode">
                        <i class="bi bi-gear-fill fs-4 me-3 text-primary"></i>
                        <div>
                            <div class="fw-bold">공정명</div>
                            <div>{{ this.processInfo.process_name }}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="p-3 border rounded d-flex align-items-center card-mode">
                        <i class="bi bi-cpu fs-4 me-3 text-success"></i>
                        <div>
                            <div class="fw-bold">설비명</div>
                            <div>{{ this.processInfo.model_name }}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="p-3 border rounded d-flex align-items-center card-mode">
                        <i class="bi bi-box-seam fs-4 me-3 text-info"></i>
                        <div>
                            <div class="fw-bold">제품명</div>
                            <div>{{ this.processInfo.prod_name }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-3 mt-2">
                <div class="col-md-4">
                    <div class="p-3 border rounded d-flex align-items-center card-mode">
                        <i class="bi bi-person-circle fs-4 me-3 text-dark"></i>
                        <div>
                            <div class="fw-bold">작업자명</div>
                            <div>{{ this.processInfo.emp_name }}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="p-3 border rounded d-flex align-items-center card-mode">
                        <i class="bi bi-check2-all fs-4 me-3 text-success"></i>
                        <div>
                            <div class="fw-bold">기작업량</div>
                            <div>{{ this.processInfo.processed_quantity }}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="p-3 border rounded d-flex align-items-center card-mode">
                        <i class="bi bi-x-circle fs-4 me-3 text-danger"></i>
                        <div>
                            <div class="fw-bold">미작업량</div>
                            <div>{{ this.processInfo.unprocessed_quantity }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container mt-3">
            <div class="row g-5">
                <div class="col-md-2">
                    <div class="p-3 border rounded d-flex align-items-center card-mode">
                        <i class="bi bi-gear-fill fs-4 me-3 text-primary"></i>
                        <div>
                            <div class="fw-bold">투입량</div>
                            <div>{{ this.processInfo.input_quantity }}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="p-3 border rounded d-flex align-items-center card-mode">
                        <i class="bi bi-cpu fs-4 me-3 text-success"></i>
                        <div>
                            <div class="fw-bold">불량량</div>
                            <div>{{ this.processInfo.error_quantity }}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="p-3 border rounded d-flex align-items-center card-mode">
                        <i class="bi bi-box-seam fs-4 me-3 text-info"></i>
                        <div>
                            <div class="fw-bold">생산량</div>
                            <div>{{ this.processInfo.created_quantity }}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="p-3 border rounded d-flex align-items-center card-mode">
                        <i class="bi bi-person-circle fs-4 me-3 text-dark"></i>
                        <div>
                            <div class="fw-bold">작업시작일시</div>
                            <div>{{ this.processInfo.work_start_date === "" ? "X" : this.processInfo.work_start_date }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="p-3 border rounded d-flex align-items-center card-mode">
                        <i class="bi bi-x-circle fs-4 me-3 text-danger"></i>
                        <div>
                            <div class="fw-bold">작업종료일</div>
                            <div>{{ this.processInfo.work_end_date === "" ? "X" : this.processInfo.work_start_date }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container mt-4">
            <div class="row row-cols-1 row-cols-md-3 g-4">
                <div class="col">
                    <div class="card h-100 card-mode border-info" :class="{
                        '': focusedField !== 'input_quantity',
                        'bg-info text-white fw-bold border-3 border-info': focusedField === 'input_quantity'
                    }">
                        <div class="card-body" @click="setFocus('input_quantity')">
                            <h5 class="card-title">투입량</h5>
                            {{ focusedField === 'input_quantity' ? currentInput : processInfo.input_quantity }}
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100  card-mode border-warning" :class="{
                        '': focusedField !== 'error_quantity',
                        'bg-warning text-white fw-bold border-3 border-warning': focusedField === 'error_quantity'
                    }">
                        <div class="card-body" @click="setFocus('error_quantity')">
                            <h5 class="card-title">불량량</h5>
                            {{ focusedField === 'error_quantity' ? currentInput : processInfo.error_quantity }}
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100 border-success card-mode" :class="{
                        '': focusedField !== 'created_quantity',
                        'bg-success text-white fw-bold border-3 border-success': focusedField === 'created_quantity'
                    }">
                        <div class="card-body" @click="setFocus('created_quantity')">
                            <h5 class="card-title">생산량</h5>
                            {{ focusedField === 'created_quantity' ? currentInput : processInfo.created_quantity }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container d-flex justify-content-center mt-5">
            <div class="card p-3" style="width: 600px;">
                <div class="row row-cols-3 g-2 text-center">
                    <div class="col border py-3 keypad" v-for="key in ['1', '2', '3', '4', '5', '6', '7', '8', '9']"
                        :key="key" @click="handleKey(key)">{{ key }}

                    </div>
                    <div class="col border py-3 keypad-backspace" @click="handleKey('<')">
                        < </div>
                            <div class="col border py-3 keypad-zero" @click="handleKey('0')">
                                0
                            </div>
                            <div class="col border py-3 keypad-enter" @click="handleKey('✓')">
                                ✓
                            </div>
                    </div>
                </div>
            </div>

            <div class="d-flex justify-content-center mt-4 gap-3">
                <Button label="작업 시작" severity="primary" class="" size="large" style="width: 20rem; height: 5rem;"
                    @click="processStart" />
                <Button label="작업 종료" severity="info" class="" size="large" style="width: 20rem; height: 5rem;"
                    @click="processEnd" />
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
        if (typeof processInfoData.work_lot !== 'undefined') {
            this.processInfo.work_lot = processInfoData.work_lot;
            this.processInfo.emp_code = processInfoData.emp_code;
            this.processInfo.fac_code = processInfoData.fac_code;
            this.displayLoad();
        }
    },
    methods: {
        // 개체 선택
        setFocus(field) {
            if ((this.processInfo.work_start_date === null || this.processInfo.work_start_date === "") && field == "error_quantity") {
                Swal.fire({
                    title: '오류',
                    text: '작업 시작 이전에는 불량 수량을 입력할 수 없습니다.',
                    icon: 'error',
                    confirmButtonText: '확인',
                });
                return;
            };
            if ((this.processInfo.work_start_date === null || this.processInfo.work_start_date === "") && field == "created_quantity") {
                Swal.fire({
                    title: '오류',
                    text: '작업 시작 이전에는 생산 수량을 입력할 수 없습니다.',
                    icon: 'error',
                    confirmButtonText: '확인',
                });
                return;
            };
            if ((this.processInfo.work_start_date !== null && this.processInfo.work_start_date !== "") && field == "input_quantity") {
                Swal.fire({
                    title: '오류',
                    text: '작업 시작 이후에는 투입 수량을 입력할 수 없습니다.',
                    icon: 'error',
                    confirmButtonText: '확인',
                });
                return;
            };
            if (this.focusedField == field) {
                this.focusedField = null;
            } else {
                this.focusedField = field;
                this.currentInput = this.processInfo[field] === 0 ? "" : this.processInfo[field].toString();
            }
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
            if (this.focusedField) {
                this.currentInput += num;
            }
        },

        // 입력 위치 수정
        backspace() {
            if (this.focusedField) {
                this.currentInput = this.currentInput.slice(0, -1);
            }
        },

        // 입력 반영
        confirmInput() {
            if (this.focusedField) {
                const numValue = parseInt(this.currentInput) || 0;
                if(this.focusedField !== 'input_quantity' && this.processInfo['input_quantity'] < this.currentInput) {
                    Swal.fire({
                        title: '오류',
                        text: '입력값이 투입량을 초과할 수 없습니다.',
                        icon: 'error',
                        confirmButtonText: '확인',
                    });
                    this.focusedField = null;
                    this.currentInput = "";
                    return;
                }
                if(this.focusedField === 'error_quantity' && this.currentInput <= this.processInfo['input_quantity']) {
                    this.processInfo['created_quantity'] = this.processInfo['input_quantity'] - this.currentInput;
                }
                if(this.focusedField === 'created_quantity' && this.currentInput <= this.processInfo['input_quantity']) {
                    this.processInfo['error_quantity'] = this.processInfo['input_quantity'] - this.currentInput;
                }
                this.processInfo[this.focusedField] = numValue;
                this.focusedField = null;
                this.currentInput = "";
            }
        },

        // 키패드 클릭 효과
        getKeyStyle(key) {
            if (this.pressedKey === key.toString()) {
                return {
                    cursor: 'pointer',
                    backgroundColor: '#0d6efd',
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
                console.log(res.data);
                console.log(this.processInfo);
                this.processInfo = res.data;
                this.processInfo.work_lot = work_lot;
            }).catch((err) => console.error(err));

            // 미작업량 = 투입량
            // this.processInfo.input_quantity = this.processInfo.unprocessed_quantity;
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
            if (this.processInfo.input_quantity <= 0) {
                Swal.fire({
                    title: '오류',
                    text: '투입량은 0이 될 수 없습니다.',
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
            await axios.post(`/api/work/process/start`, {
                work_lot: this.processInfo.work_lot,
                fac_code: this.processInfo.fac_code,
                employee_code: this.processInfo.emp_code,
                input_quantity: this.processInfo.input_quantity,
            }).then(res => {
                const nowTime = new Date()
                this.processInfo.work_start_date = this.formatDate(nowTime);
                if (res.data[1][0].result_code === 0) {
                    Swal.fire({
                        title: '성공',
                        text: '작업이 문제 없이 시작되었습니다.',
                        icon: 'success',
                        confirmButtonText: '확인',
                    });
                    this.processInfo['created_quantity'] = this.processInfo['input_quantity'] - this.processInfo[['error_quantity']];
                } else {
                    Swal.fire({
                        title: '오류',
                        text: '작업 시작에 실패했습니다.',
                        icon: 'error',
                        confirmButtonText: '확인',
                    });
                }
            }).catch((err) => {
                console.error(err);
                Swal.fire({
                    title: '오류',
                    text: '작업 시작 과정에서 오류가 발생했습니다.',
                    icon: 'error',
                    confirmButtonText: '확인',
                });
            });
        },

        // 작업 종료
        async processEnd() {
            if (!this.processInfo.work_start_date) {
                Swal.fire({
                    title: '오류',
                    text: '작업이 시작되지 않은 상태에서는 종료가 불가능합니다.',
                    icon: 'error',
                    confirmButtonText: '확인',
                });
                return;
            }
            if (this.processInfo.input_quantity < (this.processInfo.error_quantity + this.processInfo.created_quantity)) {
                Swal.fire({
                    title: '오류',
                    text: '불량 수량과 생산 수량의 합계가 투입 수량보다 많습니다.',
                    icon: 'error',
                    confirmButtonText: '확인',
                });
                return;
            }

            if (this.processInfo.input_quantity > (this.processInfo.error_quantity + this.processInfo.created_quantity)) {
                Swal.fire({
                    title: '오류',
                    text: '불량 수량과 생산 수량의 합이 투입 수량보다 적습니다.',
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
                if (res.data[1][0].result_code === 0) {
                    Swal.fire({
                        title: '성공',
                        text: '작업이 문제 없이 종료되었습니다.',
                        icon: 'success',
                        confirmButtonText: '확인',
                    });
                    this.$router.push({ name: 'Process' });
                } else {
                    Swal.fire({
                        title: '오류',
                        text: '작업 종료에 실패했습니다.',
                        icon: 'error',
                        confirmButtonText: '확인',
                    });
                }
            }).catch((err) => {
                console.error(err);
                Swal.fire({
                    title: '오류',
                    text: '작업 종료 과정에서 오류가 발생했습니다.',
                    icon: 'error',
                    confirmButtonText: '확인',
                });
            });
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

.keypad {
    transition: background-color 0.2s ease;
}

.keypad:hover {
    cursor: pointer;
    background-color: #0d6efd;
    color: white;
    font-weight: bold;
    border: 3px solid #0d6efd;
    box-shadow: 0 0 10px rgba(13, 110, 253, 0.5);
    transition: all 0.1s ease-in-out;
}

.keypad-backspace {
    background-color: gray;
    color: white;
}

.keypad-backspace:hover {
    cursor: pointer;
    background-color: #0d6efd;
    color: white;
    font-weight: bold;
    border: 3px solid #0d6efd;
    box-shadow: 0 0 10px rgba(13, 110, 253, 0.5);
    transition: all 0.1s ease-in-out;
}

.keypad-zero {
    background-color: #212529;
    color: white;
}

.keypad-zero:hover {
    cursor: pointer;
    background-color: #0d6efd;
    color: white;
    font-weight: bold;
    border: 3px solid #0d6efd;
    box-shadow: 0 0 10px rgba(13, 110, 253, 0.5);
    transition: all 0.1s ease-in-out;
}

.keypad-enter {
    background-color: gray;
    color: white;
}

.keypad-enter:hover {
    cursor: pointer;
    background-color: #0d6efd;
    color: white;
    font-weight: bold;
    border: 3px solid #0d6efd;
    box-shadow: 0 0 10px rgba(13, 110, 253, 0.5);
    transition: all 0.1s ease-in-out;
}

.card-mode {
    background-color: #f8f9fa;
}

.card-body {
    background-color: #f8f9fa;
    color: black;
}

.card.bg-info .card-body {
    background-color: rgba(var(--cui-info-rgb),var(--cui-border-opacity)) !important;
    color: white !important;
}

.card.bg-warning .card-body {
    background-color: rgba(var(--cui-warning-rgb),var(--cui-border-opacity)) !important;
    color: white !important;
}

.card.bg-success .card-body {
    background-color: rgba(var(--cui-success-rgb),var(--cui-border-opacity)) !important;
    color: white !important;
}

:root[class='app-dark'] .card {
    color: #BDBDBD;
    background-color: #263238;
}

:root[class='app-dark'] .card-mode {
    color: #BDBDBD;
    background-color: #263238;
}

:root[class='app-dark'] .card-body {
    color: #BDBDBD;
    background-color: #263238;
}

:root[class='app-dark'] .bg-info {
    background-color: rgba(var(--cui-info-rgb),var(--cui-border-opacity)) !important;
}

:root[class='app-dark'] .bg-warning {
    background-color: rgba(var(--cui-warning-rgb),var(--cui-border-opacity)) !important;
}

:root[class='app-dark'] .bg-success {
    background-color: #198754 !important;
}

:root[class='app-dark'] .text-white {
    color: white !important;
}

:root[class='app-dark'] .card.bg-info .card-body {
    background-color: rgba(var(--cui-info-rgb),var(--cui-border-opacity)) !important;
    color: white !important;
}

:root[class='app-dark'] .card.bg-warning .card-body {
    background-color: rgba(var(--cui-warning-rgb),var(--cui-border-opacity)) !important;
    color: white !important;
}

:root[class='app-dark'] .card.bg-success .card-body {
    background-color: rgba(var(--cui-success-rgb),var(--cui-border-opacity)) !important;
    color: white !important;
}

</style>