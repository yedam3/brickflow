<template>
    <div class="card border-0" style="height: 800px">
        <div class="font-semibold text-xl mb-4">자재검수관리</div>
        <div class="text-end mt-3 mb-3">
            <Button label="조회" severity="success" class="me-3" @click="checkResultList" />
            <Button label="등록" severity="info" class="me-3" @click="checkAdd" />
            <Button label="수정" severity="help" class="me-3" @click="checkUpdate" />
            <Button label="삭제" severity="danger" class="me-5" @click="checkDelete" />
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
            <div class="card border-0 col" style="height: 650px; background-color: #F5F5F5;">
                <h5>검수등록</h5>
                <div class="row">
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">발주코드</span>
                        <input type="text" class="form-control" placeholder="발주코드" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.mat_order_code" readonly>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">발주상세코드</span>
                        <input type="text" class="form-control" placeholder="발주상세코드" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.mat_order_detailCode" readonly>
                    </div>
                </div>
                <div class="row">
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">자재코드</span>
                        <input type="text" class="form-control" placeholder="자재코드" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.mat_code" readonly>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">자재명</span>
                        <input type="text" class="form-control" placeholder="자재명" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.mat_name" readonly>
                    </div>
                </div>
                <div class="row">
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">기검수량</span>
                        <input type="text" class="form-control" placeholder="기검수량" aria-label="Username"
                            aria-describedby="basic-addon1" :value="formatAleady" readonly>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">미검수량</span>
                        <input type="text" class="form-control" placeholder="미검수량" aria-label="Username"
                            aria-describedby="basic-addon1" :value="formatNot" readonly>
                    </div>
                </div>
                <div class="row">
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">발주량</span>
                        <input type="text" class="form-control" placeholder="발주량" aria-label="Username"
                            aria-describedby="basic-addon1" :value="formatRequest" readonly>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">검수량</span>
                        <input type="number" class="form-control" placeholder="검수량" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.check_quantity">
                    </div>
                </div>
                <div class="row">
                    <div class="input-group col">
                        <span class="input-group-text" id="basic-addon1">검수내역</span>
                        <textarea class="form-control" v-model="info.check_history" placeholder="비고"
                            style="height: 100px; resize: none;"></textarea>
                    </div>
                    <div class="input-group mb-5 col">
                        <span class="input-group-text" id="basic-addon1">등록자</span>
                        <input type="text" class="form-control" placeholder="등록자" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="info.emp_name" readonly>
                    </div>
                </div>
                <div v-if="info.check_quantity > 0 " >
                    <h5>검사항목</h5>
                    <div class="row">
                        <div class="form-check col-6" v-for="errInfo in error_check_ary">
                            <input class="form-check-input" type="checkbox" v-model="errInfo.check" name="quantity"
                                onclick="return false;">
                            <label class="form-check-label" for="flexCheckDefault" name="quantity">
                                {{ errInfo.mat_error_name }}
                            </label>
                            <input type="number" class="form-control w-50 mt-2" v-model="errInfo.mat_check_error">
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    <MatResult :visible="showModal" rowSelection="multiple" @close="showModal = false" @checkResult="checkResult">
    </MatResult>
</template>

<script>
import Swal from 'sweetalert2';
import axios from "axios";
import { AgGridVue } from "ag-grid-vue3";
import MatResult from '@/components/modal/MatResult.vue';
import { useUserStore } from '@/stores/user';
export default {
    name: "MatOrderModal",
    components: {
        AgGridVue,
        Swal,
        MatResult
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
                { field: "mat_order_detailCode", headerName: "발주상세", flex: 1 },
                { field: "company_name", headerName: "업체명", flex: 1, hide: true },
                { field: "mat_name", headerName: "자재명", flex: 1},
                {
                    field: "status", headerName: "발주상태", flex: 1,
                    cellStyle: params => {
                        if (params.value == '검수대기') {
                            return { color: '#0284C7', textAlign: 'center', fontWeight: 'bold' }; 
                        } else if (params.value == '검수완료') {
                            return { color: '#22C55E', textAlign: 'center', fontWeight: 'bold' }; 
                        } else if (params.value == '반품처리') {
                            return { color: '#E02D2D', textAlign: 'center', fontWeight: 'bold' }; 
                        } else if (params.value == '검수중') {
                            return { color: '#A855F7', textAlign: 'center', fontWeight: 'bold' }; 
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
            info:{
                mat_order_detailCode : '',
                mat_code : '',
                already_check_quantity: '', //기검수량
                not_check_quantity : '',  //미검수량
                mat_name : '',
                request_quantity : '',
                check_quantity : 0,
                check_history : '',
                mat_order_code : '',
                emp_name: useUserStore().empName,
                emp_code:  useUserStore().id,
                check_code : '',
               
            },
            error_check_ary : [
                    { mat_error_code : 'E01', mat_error_name : '수량불일치', check : false, mat_check_error : 0 },
                    { mat_error_code : 'E02', mat_error_name : '규격', check : false, mat_check_error : 0 },
                    { mat_error_code : 'E03', mat_error_name : '색상', check : false, mat_check_error : 0 },
                    { mat_error_code : 'E04', mat_error_name : '외관', check : false, mat_check_error : 0 },
            ],
            showModal : false
           
        };
    },
    async mounted() {
        const raw = this.$route.query.data;
        if(raw){
            // 디코딩 (필요한 경우만)
            const decoded = decodeURIComponent(raw);

            // 객체로 파싱
            await this.clicked({ data: {mat_order_detailCode:decoded} })
        }
        await this.matList();
    },
    computed:{
        //박스갯수 체크
        formatRequest(){
            if(this.info.request_quantity==''){
                return this.info.request_quantity
            }else{
            return this.info.request_quantity +'개'
           }
        },
        formatAleady(){
            if(this.info.already_check_quantity==''){
                return this.info.already_check_quantity
            }else{
            return this.info.already_check_quantity +'개'
           }
        },
        formatNot(){
            if(this.info.not_check_quantity==''){
                return this.info.not_check_quantity
            }else{
            return this.info.not_check_quantity +'개'
           }
        },
    },
    methods: {
        
        close() {
            this.$emit("close");
        },
        async matList() {
          //검수대기 항목 조회
            await axios.get('/api/mat/checkList')
                .then(res => {
                    this.rowData = res.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        //검색 조회
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
        //클릭했을때 검수량 렌더링
        async clicked(event) {
            console.log(event)
            let detail = event.data.mat_order_detailCode;
            await axios.get('/api/mat/checkList/' + detail)
                          .then(res => {
                                res.data.check_quantity=0;
                                this.info = res.data;
                                this.info.emp_name = useUserStore().empName;
                                this.info.emp_code = useUserStore().id;
                          }).catch(error => {
                                console.error(error);
                         });
            //갯수 초기화
            for (let errorCheck of this.error_check_ary) {
                errorCheck.mat_check_error = 0;
            }
        },
        //값체크
        checkValue(){
            console.log(this.info.check_history)
            //값이 다들어있는지 체크
            if(this.info.mat_code==''||this.info.check_quantity==''||this.info.check_quantity==0 || !this.info.check_history){
                Swal.fire({
                    title: '실패',
                    text: '해당하는 값을 입력해주십시오.',
                    icon: 'error',
                    confirmButtonText: '확인'
                })
                return 1;
            }
            if(this.info.not_check_quantity < Number(this.info.check_quantity)){
                Swal.fire({
                    title: '실패',
                    text: '미검수량보다 더많은 검수량을 기입하였습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                })
                return 2;
            }
        },
        //등록인지 수정인지 체크
        async checkCount(param){
          let result = await axios.get('/api/mat/testCheck/'+param)
                                  .catch((err)=>console.log(err))
         return result.data[0].checkCount;
        },
        //등록
        async checkAdd(){
          //값체크
          let validation = this.checkValue();
          if(validation==1){
            return;
          }else if (validation==2){
            return;
          }
          //체크코드가 이미 있는지 값체크
          let count = await this.checkCount(this.info.check_code);
          if(count>0){
            Swal.fire({
                    title: '등록 실패',
                    text: '이미 등록이 진행된 건입닌다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                })
                return;
          }
          //검수통과인 항목 등록
            let result = await axios.post('/api/mat/successAdd',
                    {check :this.info , error: this.error_check_ary}
                )
            .catch(err => console.log(err))
            if(result.data.affectedRows>0){
                Swal.fire({
                    title: '성공',
                    text: '등록에 성공 하였습니다.',
                    icon: 'success',
                    confirmButtonText: '확인'
                })
                //등록 후 초기화 작업
             this.info =    {
                mat_order_detailCode : '',
                mat_code : '',
                already_check_quantity: '', 
                not_check_quantity : '',  
                mat_name : '',
                request_quantity : '',
                check_quantity : 0,
                check_history : '',
                mat_order_code : '',
                check_code : '',
                emp_name: useUserStore().empName,
                emp_code:  useUserStore().id,
            }
            for(let errorCheck of this.error_check_ary){
                errorCheck.mat_check_error = 0;
            }
            //그리드 다시 렌더링
            this.matList();
            //에러시
            }else{
                Swal.fire({
                    title: '실패',
                    text: '등록에 실패 하였습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                })
            }
        },
        //검수결과 조회 모달
        checkResultList(){
            this.showModal =true;
        },
        //렌더링해서 다시조회
        async checkResult(check){
            let detail = check.mat_order_detailCode;
            await axios.get('/api/mat/checkList/' + detail)
                          .then(res => {
                                this.info = res.data;
                                
                                //기검수량 이미한만큼은 제외하고 다시 렌더링
                                this.info.already_check_quantity=this.info.already_check_quantity-check.check_quantity;
                                //미검수량은 이미 검수한량 플러스하고 다시 렌더링
                                this.info.not_check_quantity=Number(this.info.not_check_quantity)+Number(check.check_quantity);
                                //검수량 렌더링
                                this.info.check_quantity = check.check_quantity;
                                //체크코드 가져오기
                                this.info.check_code = check.check_code
                                this.info.emp_name = useUserStore().empName;
                                this.info.emp_code = useUserStore().id;
                               
                                this.info = [...this.info];
                                console.log(this.info)
                          }).catch(error => {
                                console.error(error);
                         });
            //갯수 초기화
            for (let errorCheck of this.error_check_ary) {
                errorCheck.mat_check_error = 0;
            }
            //갯수 다시 렌더링
          let check_code = check.check_code;
          await axios.get('/api/mat/errorList/' + check_code)
                          .then(res => {
                            this.error_check_ary.forEach(errorInfo => {
                                let matched = res.data.find(info => info.mat_error_code==errorInfo.mat_error_code);
                                 if(matched){
                                errorInfo.mat_check_error = matched.mat_check_error
                                }
                            })
                                
                          }).catch(error => {
                                console.error(error);
                         });
        },
     //수정
        async checkUpdate() {
            let validation = this.checkValue();
            if (validation == 1) {
                return;
            } else if (validation == 2) {
                return;
            }
            //등록건인지 수정건인지 채크
            let count = await this.checkCount(this.info.check_code);
          if(count==0){
            Swal.fire({
                    title: '수정 실패',
                    text: '등록이 진행되지 않은 건입니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                })
                return;
          }
          //수정실행
            await axios.put('/api/mat/checkUpdate', {
                check: this.info, error: this.error_check_ary
            })
                .then(res => {
                    if (res.data.affectedRows > 0) {
                        Swal.fire({
                            title: '수정 완료',
                            text: '수정이 완료되었습니다.',
                            icon: 'success',
                            confirmButtonText: '확인'
                        });
                        //등록 후 초기화 작업
                        this.info = {
                            mat_order_detailCode: '',
                            mat_code: '',
                            already_check_quantity: '',
                            not_check_quantity: '',
                            mat_name: '',
                            request_quantity: '',
                            check_quantity: 0,
                            check_history: '',
                            mat_order_code: '',
                            check_code: '',
                            emp_code: '',
                            emp_name : '',
                        }
                        for (let errorCheck of this.error_check_ary) {
                            errorCheck.mat_check_error = 0;
                        }
                        //그리드 다시 렌더링
                        this.matList();
                    } else {
                        Swal.fire({
                            title: '수정 실패',
                            text: '수정을 실패하였습니다.',
                            icon: 'error',
                            confirmButtonText: '확인'
                        });
                        return;
                    }
                })
        },

        //삭제
        async checkDelete(){
              //등록건인지 수정건인지 채크
              let count = await this.checkCount(this.info.check_code);
          if(count==0){
            Swal.fire({
                    title: '삭제 실패',
                    text: '등록이 진행되지 않은 건입니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                })
                return;
          }
          console.log(this.info.mat_order_code)
          //삭제실행
          await axios.delete('/api/mat/checkDelete/'+this.info.check_code,{
              params : {
                matOrderCode : this.info.mat_order_code
            }
          })
                     .then(res => {
                         if (res.data.affectedRows > 0) {
                             Swal.fire({
                                 title: '삭제 성공',
                                 text: '삭제가 정상적으로 삭제되었습니다.',
                                 icon: 'success',
                                 confirmButtonText: '확인'
                             })
                             //등록 후 초기화 작업
                             this.info = {
                                 mat_order_detailCode: '',
                                 mat_code: '',
                                 already_check_quantity: '',
                                 not_check_quantity: '',
                                 mat_name: '',
                                 request_quantity: '',
                                 check_quantity: 0,
                                 check_history: '',
                                 mat_order_code: '',
                                 check_code: '',
                                 emp_code: '',
                                 emp_name : '',
                             }
                             for (let errorCheck of this.error_check_ary) {
                                 errorCheck.mat_check_error = 0;
                             }
                             //그리드 다시 렌더링
                             this.matList();
                        }else{
                            Swal.fire({
                                 title: '삭제 실패',
                                 text: '삭제가 진행되지않았습니다.',
                                 icon: 'error',
                                 confirmButtonText: '확인'
                             })  
                        }
                     })
        //값 다시 초기화
        this.info =    {
                mat_order_detailCode : '',
                mat_code : '',
                already_check_quantity: '', 
                not_check_quantity : '',  
                mat_name : '',
                request_quantity : '',
                check_quantity : 0,
                check_history : '',
                mat_order_code : '',
                check_code : '',
                emp_code : '',
                emp_name : '',
            }
            for(let errorCheck of this.error_check_ary){
                errorCheck.mat_check_error = 0;
            }
        }
    },
    watch : {
        error_check_ary : {
            handler(errAry) {
                let errTotal = errAry.reduce((errSum, errInfo, idx) => { 
                     //1) 체크여부
                     errInfo.check = (errInfo.mat_check_error > 0);

                    //2) 총 불량량의 합계
                    return errSum += errInfo.mat_check_error; }, 0);
                
                if(errTotal > this.info.check_quantity ){
                   alert('불량량의 합이 검수량을 넘어섰습니다.');
                   for(let check of this.error_check_ary){
                          check.mat_check_error = 0;
                   }
                }
            },
            deep: true
        },
        'info.check_quantity': function (newVal) {
            // check_quantity가 바뀔 때도 불량 총합과 비교
            let errTotal = this.error_check_ary.reduce((sum, item) => {
                return sum + item.mat_check_error;
            }, 0);

            if (errTotal > newVal) {
                // info.check_quantity 값을 수정하려면 this를 통해 접근해야 합니다.
                this.info.check_quantity = errTotal;  // 여기에서 check_quantity 수정
                alert('불량량의 합이 검수량을 넘어섰습니다.');
            }
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
.input-group-text{
    background-color: #FFCC80;
    border-color: #FFCC80;
}
</style>