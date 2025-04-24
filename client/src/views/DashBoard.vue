<template>
    <div class="container">
        <table class="table table-hover">
            <!-- {{  }} (이중 중괄호) : text 속성에 사용, 해당 위치에 변수의 값을 출력 -->
            <caption> total : {{ count }}</caption>
            <thead>
                <tr>
                    <th>No.</th>
                    <th>도서명</th>
                    <th>저자</th>
                    <th>출판사</th>
                    <th>출판일수</th>
                </tr>
            </thead>
            <tbody>
                <!-- 데이터 바인딩 
                    1) View와 Model을 하나로 묶어 연결하는 것
                    2) Vue 객체가 가지고 있는 data 옵션과 computed 옵션의 프로퍼티(변수)가 변경될 경우 
                       Directive(디렉티브, v-bind/v-model/v-for/v-if 등)로 연결된 태그가 자동으로 변경됨
                    3) 따라서 화면을 구성하는 태그를 변경하고 싶은 경우 연결된 변수(프로퍼티)를 제어해야 함 -->
                
                <!-- v-bind:속성 or :속성 ) 가장 기본 디렉티브로 태그의 모든 속성에 연결 가능.
                             연결된 프로퍼티가 변경될 경우 태그의 속성이 가지는 값도 자동으로 변경 -->
                <!-- v-for ) 리스트 렌더링, 배열을 기준으로 반복적으로 생성될 태그 설정, 순환 for문의 성격을 가짐 -->
                <tr v-bind:key="book.no" v-for="book in bookList" 
                                    @click="goToDetail(book.no)">
                <!-- v-on:이벤트명 or @이벤트명 ) 이벤트 핸들링, 해당 이벤트가 발생할 경우 동작할 함수 설정 -->

                
                    <td>{{ book.no }}</td>
                    <td>{{ book.name }}</td>
                    <td>{{ book.writer }}</td>
                    <td>{{ book.publisher }}</td>
                    <td>{{ book.publication_date}}</td>                    
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
// AJAX를 실행할 모듈 가져옴
import axios from 'axios';

// 해당 컴포넌트를 관리할 Vue 객체 설정
export default {
    // data : Vue 객체가 가지는 데이터(프로퍼티, 변수)를 설정, CRUD(Create, Read, Update, Delete) 전부 가능
    data() {
        return {
            bookList: []
        };
    },
    // computed : Vue 객체 가지는 데이터(프로퍼티, 변수)를 설정
    //  1) data 옵션과 computed 옵션에 선언된 프로퍼티를 기준으로 계산한 값을 가짐
    //     연결된 프로퍼티가 변경될 경우 자동으로 다시 계산하고 새로운 값을 가짐
    //  2) Read Only : 임의로 값을 변경할 수 없음
    //  3) 각 프로퍼티를 함수형태로 선언하며 함수이름이 프로퍼티명으로 설정
    computed :{
        count(){
            // data 옵션에 선언된 프로퍼티 중 bookList의 length를 가지는 프로퍼티로
            // bookList의 길이가 변경될 경우 자동으로 값을 변경
            return this.bookList.length;
        },
    },
    // Vue 객체의 LifeCycle Hook 중 created Hook을 사용
    // created ) Vue 객체가 생성된 상태로 객체 내부의 각 옵션(data, computed, methods 등)에 접근 가능
    // mounted ) Vue 객체에 선언된 <template>을 V-DOM에 생성하고 Real-DOM에 연결된 상태, 이때 실제로 랜더링(출력)이 됨
    created() {
        // 주로 서버와 통신(=> axios), data 옵션의 프로퍼티를 초기화
        this.getBookList();
    },
    // Vue 객체의 기능(함수)을 등록, 해당 옵션에 등록되지 않은 함수들은 사용할 수 없음(Javascript 자체 함수 제외)
    methods: {
        async getBookList() {
            // axios 모듈을 기반으로 서버에서 AJAX 요청 : GET + http://localhost:3000/books
            //  => Vue의 Origin(http://localhost:8099)와 달라 proxy(vue.config.js 참고)를 적용 : GET + /api/books

            let result = await axios.get('/api/books')
                                    .catch(err => console.log(err));
            // Proxy 과정
            //  1) '/api'로 시작하는 경로  : http://localhost:8099/api/books 
            //  2) Origin 변경           : http://localhost:3000/api/books
            //  3) '/api'를 '/'로 변경    : http://localhost:3000/books => 최종 실행되는 경로

            // axios 모듈의 응답에서 data 속성이 실제 서버가 보낸 데이터를 의미
            this.bookList = result.data; 
        },
        goToDetail(bookNo) {
            // 선택한 게시글의 상세정보 페이지를 요청 => Vue Router에 등록된 라우팅을 활용 / router 폴더 밑에 검색
            // this.$router가 실제 Vue Router를 의미하고 push()는 라우팅을 요청하는 함수

            // router/index.js ) { path: '/info/:bno', name: 'bookInfo', component: BookInfo }
            // path 속성에 등록된 경로 안에 :(콜론)으로 선언된 문자열은 params 속성을 기반으로 전달된 값이 들어가야함
            this.$router.push({ name : 'bookInfo', params : { bno : bookNo }});
            

        },
    }
}
</script>
<style scoped>
table * {
    text-align: center;
}
</style>
