// 특정 서비스에 종속되지 않는 기능의 경우 별도 파일로 관리

// 데이터 타입 변환 : 객체 -> 배열
const convertObjToAry = (target, selected) => {
    // target   : 값을 들고 있는 객체
    // selected : 배열로 변환할 때 가져올 객체의 필드명들을 가짐
    let aray = [];
    for (let fieldName of selected) {
        // Object['필드명'] or Object[변수]: 대괄호표기법을 활용해 변수로 필드명을 전달
        let fieldVal = target[fieldName];
        aray.push(fieldVal);
    }
    return aray;
};
const convertObjToQuery = (target, selected = []) => {
    // target : 검색 정보를 가지고 있는 객체, { 컬럼명 : 검색값, 컬럼명 : 검색값 }
    // selected : 각 검색조건을 연결할 AND 와 OR 을 순서대로 가지고 있는 배열
    // 검색 조건으로 사용될 컬럼명(Object 의 key)를 배열로 가져옴
    let fields = Object.keys(target);
    // WHERE 1=1 다음에 추가할 검색 조건 시작, 1=1 참을 의미
    let queryWhere = "AND ";
    for (let i = 0; i < fields.length; i++) {
        let columnName = fields[i];
        let columnValue = target[columnName];
        // 컬럼명 = '조건값' AND(혹은 OR)
        queryWhere += `${columnName} = '${columnValue}' ${selected[i] ?? ""}`;
        // ?? : 변수의 값이 null 이거나 undefined 일 경우 기본값을 설정 }
        // SQL 문 사용된 문자열(searchKeyword)에 해당 결과를 매핑해서 전달
        return {
            serchKeyword: queryWhere,
        };
    }
};
const convertLikeToQuery = (target, selected = []) => {
    let fields = Object.keys(target);
    let queryWhere = "AND ";
    for (let i = 0; i < fields.length; i++) {
        let columnName = fields[i];
        let columnValue = target[columnName];
        queryWhere += `${columnName} LIKE '%${columnValue}%' ${
            selected[i] ?? ""
        } `;
    }
    return {
        serchKeyword: queryWhere,
    };
};
const queryFormat = function (query, values) {
    // query : SQL 문
    // values : 대체값
    // SQL 문에 :(콜론)으로 시작하는 문자열을 찾아 사용자가 선택한 값으로 대체
    let rewriteQuery = query.replace(/\:(\w+)/g, function (txt, key) {
        // 대체값 중 SQL 문에 사용된 :문자열에 해당 하는 값이 있을 경우 변경
        if (values.hasOwnProperty(key)) {
            let convertvalue = values[key];
            // 적용된 객체의 속성을 삭제
            delete values[key];
            return convertvalue;
        } else {
            // 없을 경우 :문자열을 ''(공백)으로 대체해서 완성된 SQL 문으로 반환
            return "";
        }
    });
    // 다시 작성된 SQL 문을 반환
    return rewriteQuery;
};

// 날짜 변환
const dateFormat = (isoString) => {
    const date = new Date(isoString);
    
    // UTC 기준에서 9시간 더해 한국 시간으로 변환
    date.setHours(date.getHours() + 9);

    const pad = n => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const dateFormat2 = (isoString) => {
    if (!isoString) return null;
    
    // ISO 문자열을 Date 객체로 변환
    const date = new Date(isoString);
    
    // YYYY-MM-DD 형식으로 변환
    return date.getFullYear() + '-' + 
           String(date.getMonth() + 1).padStart(2, '0') + '-' + 
           String(date.getDate()).padStart(2, '0');
}

module.exports = {
    convertObjToAry,
    convertObjToQuery,
    convertLikeToQuery,
    queryFormat,
    dateFormat,
    dateFormat2,
};
