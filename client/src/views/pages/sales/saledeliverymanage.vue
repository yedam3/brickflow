<template>
    <!--출고 관리 그리드-->
    <div class="card border-0 h-100">
        <div class="font-semibold text-xl mb-4">출고 관리</div>
        <div class="text-end mt-3 mb-3">
            <Button label="출고조회" severity="success" class="me-3" @click="" />
            <Button label="주문조회" severity="success" class="me-3" @click="orderList" />
            <Button label="등록" severity="info" class="me-3" @click="addDelivery" />
            <Button label="수정" severity="help" class="me-3" @click="modifyOrder" />
            <Button label="삭제" severity="danger" class="me-5" @click="deliveryDelete" />
        </div>
        <ag-grid-vue class="ag-theme-alpine" style="width: 100%; 
    height: 150px;" :columnDefs="columnDefs" :rowData="rowData" :gridOptions="gridOptions"
            :defaultColDef="defaultColDef" @cellClicked="comCellClicked">
        </ag-grid-vue>
    </div>


    <div class="row">
        <div class="col-6">
            <div class="row">
                <div class="col">
                    <div class="font-semibold text-xl mb-4">주문 요구 수량</div>
                </div>
                <div class="col text-end">
                </div>
            </div>
            <div class="ag-wrapper justify-content-center" style="border: none;">
                <ag-grid-vue class="ag-theme-alpine" style="width: 100%; 
        height: 200px;" :columnDefs="seColumnDefs" :rowData="serowData" :gridOptions="gridOptions"
                    :defaultColDef="defaultColDef" @rowClicked="selectedProd">
                </ag-grid-vue>
            </div>

        </div>

        <div class="col-6">
            <div class="font-semibold text-xl mb-4">출고 가능 수량</div>
            <div class="ag-wrapper justify-content-center" style="border: none;">
                <ag-grid-vue class="ag-theme-alpine" style="width: 100%; 
        height: 200px; " :columnDefs="thColumnDefs" :rowData="throwData" :gridOptions="gridOptions"
                    :defaultColDef="defaultColDef" @cellValueChanged="throwChange">
                </ag-grid-vue>
            </div>
        </div>

    </div>

    <!-- 주문 목록 조회 모달창 -->
    <OrderModal ref="orderModal" :visible="showOrderModal" @close="showOrderModal = false" @selectOrder="orderSelected">
    </OrderModal>


</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import OrderModal from '@/components/modal/OrderModal.vue';
import ProdComModal from "@/components/modal/ProdComModal.vue";
import Swal from 'sweetalert2';

export default {
    components: {
        AgGridVue,
        OrderModal,
        ProdComModal,
        Swal,

    },
    data() {
        return {
            // 메인 그리드
            rowData: [{
                delivery_code: '',
                delivery_name: '',
                orders_code: '',
                order_name: '',
                company_code: '',
            }],
            columnDefs: [
                { field: 'delivery_code', headerName: '출고코드', hide: true },
                { field: 'delivery_name', headerName: '출고명', flex: 3, editable: true },
                { field: 'orders_code', headerName: '주문코드', flex: 3, },
                { field: 'order_name', headerName: '주문명', flex: 3, editable: true },
                { field: 'company_name', headerName: '업체명', flex: 3 },
                { field: 'employee_code', headerName: '담당자', flex: 3 },
            ],

            //주문요구 수량 그리드
            serowData: [
                // {
                // prod_code: '',
                // prod_name: '',
                // delivery_demand: '',
                // alreadydelivery: '',
                // proyetdeliveryd_code: '',
                // delivery_quantity: '',
                // }
            ],

            // 주문 요구수량 선택 행 번호
            selectedSerowIndex: null,
            seColumnDefs: [
                { field: "prod_code", headerName: "제품코드", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "prod_name", headerName: "제품명", flex: 2, editable: true, cellStyle: { textAlign: "center" } },
                { field: "delivery_demand", headerName: "요구량", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "alreadydelivery", headerName: "기납기량", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "yetdelivery", headerName: "미납기량", flex: 2, editable: true, cellStyle: { textAlign: "center" } },
                { field: "delivery_quantity", headerName: "출고량", flex: 2, editable: true, cellStyle: { textAlign: "center" } },
            ],
            throwData: [],
            thColumnDefs: [
                { field: "prod_LOT", headerName: "제품LOT", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "prod_code", headerName: "제품코드", flex: 2, editable: true, cellStyle: { textAlign: "center" } },
                { field: "prod_name", headerName: "제품명", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "delivery_before_quantity", headerName: "출고 가능 수량", flex: 2, cellStyle: { textAlign: "center" } },
                { field: "delivery_quantity", headerName: "출고수량", flex: 2, editable: true, cellStyle: { textAlign: "center" } },
            ],
            showOrderModal: false,
            showComModal: false,
            selectedRowIndexes: [],
            //상세그리드 행 인덱스
            selectedSecondIndex: null,
        };
    },

    mounted() { },

    methods: {
        // 사이트 접속시  자동증가
        async autosalescode() {
            const result = await axios.get(`/api/sales/comList`);
            this.rowData[0].sales_order_code = result.data[0].sales_order_code;
            //this.secondRowData[0].sales_order_code = result.data[0].sales_order_code;
        },
        // 주문 모달창
        orderList() {
            this.showOrderModal = true;
        },
        //주문 목록 조회
        async orderSelected(order) {
            // await axios.get(`/api/sales/orders/:orders_code`, {
            await axios.get(`/api/sales/orders/${order.orders_code}`)
                .then(res => {
                    const serverRowData = res.data;
                    //this.rowData[0].orders_code = res.orders_code;
                    this.rowData = [...serverRowData];

                })
                .catch((err) => console.log(err));

            //상세 그리드로 전달
            await axios.get(`/api/sales/detail/${order.orders_code}`)
                .then(res => {
                    const serverRowData = res.data;
                    this.serowData = []; //  다른 주문건을 클릭했을때 기존에 있던 항목을 초기화
                    for (let data of serverRowData) {
                        this.serowData.push({
                            prod_code: data.prod_code,
                            prod_name: data.prod_name,
                            delivery_demand: data.quantity,
                        })
                    }
                    this.serowData = [...this.serowData]; // 그리드로 보내준다.
                });
        },
        fullCheck() {
            //메인그리드 값 다들어 갔는지 체크
            if (this.rowData[0].delivery_code == '' || this.rowData[0].orders_code == '', this.rowData[0].delivery_name == '') {
                Swal.fire({
                    title: '실패',
                    text: '해당하는 값을 입력해주십시오.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return 1;

            } if (this.rowData[0].delivery_date < this.rowData[0].request_date) {
                Swal.fire({
                    title: '실패',
                    text: '납기일자가 주문일자보다 빠릅니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
                return 2;
            }
            //상세그리드 값 다들어 갔는지 체크
            for (let rowInclude of this.serowData) {
                if (rowInclude.orders_code == '' || rowInclude.order_name, rowInclude.prod_code == 0) {
                    Swal.fire({
                        title: '실패',
                        text: '값을 다입력하십시오',
                        icon: 'error',
                        confirmButtonText: '확인'
                    });
                    return 1;
                }
            }
        },

        //출고 등록
        async addDelivery() {
            //   const res = await axios.post('/api/sales/deliveryCheck', {
            //     deliveryCode: this.rowData[0].delivery_code
            //   })
            //   .catch((err) => console.log(err));
            // console.log(res);
            // if (res.data[0].checkCount > 0) {
            //   Swal.fire({
            //     title: '등록 실패',
            //     text: '이미 등록이 진행중 입니다.',
            //     icon: 'error',
            //     confirmButtonText: '확인'
            //   });
            //   return;
            // }
            if (this.fullCheck() == 1) {
                return;
            } else if (this.fullCheck() == 2) {
                return;
            }
            //등록 
            axios.post('/api/sales/deliveryAdd', {
                delivery: this.rowData[0],
                deliveryDetail: this.serowData
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
                        Swal.lfire({
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
            this.rowData = [{
                delivery_code: '',
                delivery_name: '',
                orders_code: '',
                order_name: '',
                company_code: '',
            }];
            this.serowData = [];
        },

        // 삭제
        // async deliveryDelete() {
        //   // 출고 코드가 비어있으면 삭제를 진행하지 않도록 처리
        //   if (!this.rowData[0].delivery_code) {
        //     Swal.fire({
        //       title: '삭제 실패',
        //       text: '삭제할 출고를 선택해주세요.',
        //       icon: 'warning',
        //       confirmButtonText: '확인'
        //     });
        //     return;
        //   }

        //   try {
        //     const res = await axios.delete('/api/sales/deliveryDelete/:delivery_code' + this.rowData[0].delivery_code);

        //     if (res.data.affectedRows < 1) {
        //       Swal.fire({
        //         title: '삭제 실패',
        //         text: '삭제 실패 하였습니다.',
        //         icon: 'error',
        //         confirmButtonText: '확인'
        //       });
        //     } else {
        //       Swal.fire({
        //         title: '삭제 완료',
        //         text: '정상적으로 삭제가 완료되었습니다.',
        //         icon: 'success',
        //         confirmButtonText: '확인'
        //       });

        //       // 데이터 초기화
        //       this.rowData = [{
        //         delivery_code: '',
        //         delivery_name: '',
        //         orders_code: '',
        //         order_name: '',
        //         company_code: '',
        //       }];
        //       this.serowData = [{
        //         prod_code: '',
        //         prod_name: '',
        //         delivery_demand: '',
        //         alreadydelivery: '',
        //         proyetdeliveryd_code: '',
        //         delivery_quantity: '',
        //       }];
        //       this.throwData = []; // 세 번째 그리드 초기화
        //     }
        //   } catch (err) {
        //     console.error(err);
        //     Swal.fire({
        //       title: '삭제 실패',
        //       text: '삭제 중 오류가 발생했습니다.',
        //       icon: 'error',
        //       confirmButtonText: '확인'
        //     });
        //   }
        // },

        //제품선택
        async selectedProd(params) {
            this.selectedSecondIndex = params.rowIndex;
            console.log(params.data)
            if (params.data.lotList == undefined || params.data.lotList == null) { // lotList가 없으면 lotList를 만들고 있으면 else 뒤에있는 정보를 보여줘라
                const res = await axios.get(`/api/sales/deliveryCheck/${params.data.prod_code}`)
                const serowData = res.data;
                let detailList = [];
                for (let a of serowData)
                    detailList.push({
                        prod_LOT: a.prod_LOT,                        // 제품 LOT
                        prod_code: a.prod_code,                     // 제품 코드
                        prod_name: a.prod_name,                     // 제품명
                        delivery_before_quantity: a.delivery_before_quantity, // 출고 가능 수량
                        delivery_quantity: 0                        // 출고 수량 (사용자 입력용으로 비워둠)
                    })
                // 두번째 그리드의 선택한 제품에 정보를 추가
                params.data.lotList = detailList;
                // 세번째 그리드 출력
                this.throwData = detailList;
            } else {
                this.throwData = params.data.lotList;
            }
        },
        async throwChange(params) { // 그리드값이 바뀔때 작동
            let thorowIndex = params.rowIndex; // 인덱스 값을 저장
            this.throwData[thorowIndex].delivery_quantity = params.data.delivery_quantity; // 배열안에 값을 찾아서 넣는다.
            let sum = this.throwData.reduce((quantitySum, quantityInfo) => {  // 누적 합계 
                return quantitySum += quantityInfo.delivery_quantity;
            }, 0)
            if (sum > this.serowData[this.selectedSecondIndex].delivery_demand) {  // 출고량의 합계가 요구량을 넘으면 알람으로 알려줌
                this.$nextTick(() => {
                    Swal.fire({
                        title: '출고 수량 초과',
                        text: '요구 수량을 초과할 수 없습니다.',
                        icon: 'error',
                        confirmButtonText: '확인'
                    });
                });
                this.throwData[thorowIndex].delivery_quantity = 0; // 출고량이 넘으면 0으로 
                this.serowData[this.selectedSecondIndex].delivery_quantity = 0; // 두번째 그리드에 담는다.
                this.throwData = [...this.throwData] // 재배열
                return;
            }
            this.serowData[this.selectedSecondIndex].delivery_quantity = sum; // 합계를 두번째 그리드 출고량에 디스플레이
            this.serowData = [...this.serowData] // 재배열
        }


    },

    // watch: {
    //   throwData: {
    //     handler(serowData) {
    //       let quatityTotal = serowData.reduce((quantitySum, quantityInfo) => { // reduce(총합계, 현재값)=
    //         //총 출고 수량의 합계
    //         return quantitySum += quantityInfo.delivery_quantity;
    //       }, 0);
    //       //사용자에게 알림
    //       if (Number(quatityTotal) > Number(this.serowData[this.selectedSecondIndex].delivery_demand)) {

    //         this.$nextTick(() => {
    //           Swal.fire({
    //             title: '출고 수량 초과',
    //             text: '요구 수량을 초과할 수 없습니다.',
    //             icon: 'error',
    //             confirmButtonText: '확인'
    //           });
    //         });
    //       }
    //     },
    //     deep: true
    //   }
    // } 
}
</script>

<style>
:root .ag-theme-alpine .ag-header {
    background-color: #e0a72a;
}
</style>