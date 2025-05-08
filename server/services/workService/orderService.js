const mariaDB = require("../../db/mapper.js");
const { convertObjToAry, dateFormat } = require("../../utils/converts.js");

// 생산지시코드 자동증가
const getOrder_code = async () => {
    let result = await mariaDB
        .query("getOrder_code")
        .catch((err) => console.error(err));
    return result;
};

// 자재 요구량 조회
const findMatReqByPlan_code = async (plan_code) => {
    let result = await mariaDB.query("findMatReqByPlan_code", plan_code).catch((err) => {
        console.err(err);
    });
    return result;
};

// 생산 지시 목록 조회
const findAllPlanOrder = async () => {
    let result = await mariaDB.query("findAllPlanOrder").catch((err) => {
        console.error(err);
    })
    return result;
};

// 생산 지시 조회
const findAllProductOrderByProduct_order_code = async (product_order_code) => {
    let result = await mariaDB.query("findAllProductOrderByProduct_order_code", product_order_code).catch((err) => {
        console.error(err);
    });
    return result[0];
};

// 생산 지시 상세 조회
const findAllWorkDetailByProduct_order_code = async (product_order_code) => {
    let result = await mariaDB.query("findAllWorkDetailByProduct_order_code", product_order_code).catch((err) => {
        console.err(err)
    });
    return result;
}

// 생산 상품 자재 재고 조회
const findAllProdMatQtyByMat_code = async (prod_code, mat_code) => {
    const prodMatData = [prod_code, mat_code];
    let result = await mariaDB.query("findAllProdMatQtyByMat_code", prodMatData).catch((err) => {
        console.error(err);
    });
    return result;
};

// 생산 상품 자재 홀드 조회
const findAllMatHoldByProduct_order_detail_code = async (product_order_detail_code) => {
    let result = await mariaDB.query("findAllMatHoldByProduct_order_detail_code", product_order_detail_code).catch((err) => {
        console.error(err);
    });
    return result;
};

// 생산 상품 자재 LOT 조회
const findAllMat_HoldByProduct_order_detail_codeAndMat_code = async (product_order_detail_code, mat_code) => {
    const data = [product_order_detail_code, mat_code];
    
    let result = await mariaDB.query("findAllMat_HoldByProduct_order_detail_codeAndMat_code", data).catch((err) => {
        console.error(err);
    });
    return result;
};

// 생산지시 상태 확인
const findStatusByPlan_code = async (plan_code) => {
    let result = await mariaDB.query("findStatusByPlan_code", plan_code).catch((err) => {
        console.err(err);
    });
    return result;
};

// 자재홀드량

// 생산계획 조회 (생산 지시)
const findPlanDetailByPlan_code = async () => {
    let planDetailList = await mariaDB
        .query("findPlanDetailByPlan_code")
        .catch((err) => console.error(err));
    return planDetailList;
};

// 생산지시 등록
const insertProduct_order = async (orderData, orderDetailDataList, matHoldDataList) => {
    let conn;
    let result;

    const orderDetail_fields = ["product_order_detail_code", "prod_code", "order_quantity", "priority", "process_flow_code", "product_order_code"];
    const matHold_fields = ["mat_hold_code", "product_order_detail_code", "mat_LOT", "hold_quantity", "mat_code"];
    
    try {
        conn = await mariaDB.getConnection();
        await conn.beginTransaction();

        // 생산 지시 등록
        orderData.start_date = dateFormat(orderData.start_date);
        orderData.end_date = dateFormat(orderData.end_date);
        let selectedQuery = mariaDB.selectedQuery("insertProduct_order", Object.values(orderData));
        result = await conn.query(selectedQuery, Object.values(orderData));

        // 공정 흐름도 
            console.log(orderDetailDataList);
        // 생산 지시 상세 등록 / 생산 지시 공정 초기 세팅 등록
        for (let orderDetailData of orderDetailDataList) {
            console.log(orderDetailData);
            // 생산 지시 상세 코드 조회
            selectedQuery = mariaDB.selectedQuery("findProduct_order_detail_codeLast", orderData.product_order_code);
            result = await conn.query(selectedQuery, orderData.product_order_code);

            orderDetailData.product_order_detail_code = result[0].product_order_detail_code;
    
            orderDetailData.product_order_code = orderData.product_order_code;
            orderDetailData.process_flow_code = "공정 흐름도 임시데이터";

            // 생산 지시 상세 등록
            selectedQuery = mariaDB.selectedQuery("insertProduct_order_detail", convertObjToAry(orderDetailData, orderDetail_fields));
            result = await conn.query(selectedQuery, convertObjToAry(orderDetailData, orderDetail_fields));

            // 공정 흐름도 조회 (prod_code)
            selectedQuery = mariaDB.selectedQuery("findAllProcess_flowByProd_code", orderDetailData.prod_code);
            result = await conn.query(selectedQuery, orderDetailData.prod_code);
                
            // 생산 지시 공정 초기 세팅 등록
            let cnt = 1;
            for(let processFlowData of result) {
                console.log(processFlowData);
                const workProcessData = [orderDetailData.product_order_detail_code, processFlowData.process_flow_code, orderDetailData.prod_code, orderDetailData.order_quantity, cnt];
                selectedQuery = mariaDB.selectedQuery("insertWork_process", workProcessData);
                result = await conn.query(selectedQuery, workProcessData);
                cnt++;
            }
        }

        // 생산 지시 자재 홀드량 등록
        for (let matHoldData of matHoldDataList) {
            let workDetailData = [orderData.product_order_code, matHoldData.prod_code];

            // 생산 지시 상세 조회 (product_order_code, prod_code)
            selectedQuery = mariaDB.selectedQuery("findWork_detailByProduct_order_codeAndProd_code", workDetailData);
            result = await conn.query(selectedQuery, workDetailData);

            let newMatData = {
                mat_hold_code: "",
                product_order_detail_code: result[0].product_order_detail_code,
                mat_LOT: "",
                hold_quantity: "",
                mat_code: "",
            }

            // 자재 홀드량 등록
            for(let matData of matHoldData.mat_LOTs) {
                // 자재 홀드 코드 조회
                selectedQuery = mariaDB.selectedQuery("findMat_hold_code");
                result = await conn.query(selectedQuery);

                newMatData.mat_hold_code = result[0].mat_hold_code;
                newMatData.mat_LOT = matData.mat_LOT;
                newMatData.hold_quantity = parseInt(matHoldData.material_input_qunatity);
                newMatData.mat_code = matData.mat_code;

                selectedQuery = mariaDB.selectedQuery("insertMat_hold", Object.values(newMatData));
                result = await conn.query(selectedQuery, Object.values(newMatData));
            }
        }

        // 생산 계획 상태 변경
        let planData = ["OC2", orderData.plan_code];
        selectedQuery = mariaDB.selectedQuery("updatePlanStatusByPlan_code", planData);
        result = await conn.query(selectedQuery, planData);
        await conn.rollback();
        await conn.commit();
    } catch (err) {
        if (conn) await conn.rollback();
        console.log(err);
    } finally {
        if (conn) conn.release();
    }
    return result;
};

// 생산 지시 수정
const updateProduct_order = async (orderData, workDetailList, matHoldDataList) => {
    let conn;
    let result;

    const product_order_fields = ["product_order_name", "start_date", "end_date", "note", "product_order_code"];
    const work_detail_fields = ["prod_code", "order_quantity", "priority", "product_order_detail_code"];
    const mat_hold_fields = ["mat_LOT", "mat_hold_qty", "product_order_detail_code", "mat_code"];

    try {
        conn = await mariaDB.getConnection();
        await conn.beginTransaction();

        // 생산 지시 상세 수정 / 생산 지시 자재 홀드량 수정
        for(let workDetailData of workDetailList) {
            // 생산 지시 자재 홀드량 수정
            for (let matHoldData of matHoldDataList) {
                for (let matData of matHoldData.mat_LOTs) {
                    matData.product_order_detail_code = workDetailData.product_order_detail_code
                        selectedQuery = mariaDB.selectedQuery("updateMat_holdByProduct_order_detail_codeAndMat_code", convertObjToAry(matData, mat_hold_fields));
                    result = await conn.query(selectedQuery, convertObjToAry(matData, mat_hold_fields));
                }
            }

            // 생산 지시 상세 수정
            selectedQuery = mariaDB.selectedQuery("updateWork_detailByProduct_order_detail_code", convertObjToAry(workDetailData, work_detail_fields));
            result = await conn.query(selectedQuery, convertObjToAry(workDetailData, work_detail_fields));
        }

        // 생산 지시 수정
        orderData.start_date = dateFormat(orderData.start_date);
        orderData.end_date = dateFormat(orderData.end_date);
        selectedQuery = mariaDB.selectedQuery("updateProduct_orderByProduct_order_code", convertObjToAry(orderData, product_order_fields));
        result = await conn.query(selectedQuery, convertObjToAry(orderData, product_order_fields));

        await conn.commit();
    } catch(err) {
        if(conn) await conn.rollback();
        console.log(err);
    } finally {
        if(conn) conn.release();
    }
    return result;
};

// 생산 지시 삭제
const deleteProduct_order = async (product_order_code) => {
    let conn;
    let result;
    try {
        conn = await mariaDB.getConnection();
        await conn.beginTransaction();

        // 생산 지시 상세 코드 조회 (생산 지시 코드 - product_order_code)
        let selectedQuery = mariaDB.selectedQuery("findProduct_order_detail_codeByProduct_order_code", product_order_code);
        result = await conn.query(selectedQuery, product_order_code);

        // 생산 지시 자재 요구량 / 공정 초기 세팅 값 삭제
        for(let work_detail of result) {
            // 생산 지시 자재 요구량 삭제
            selectedQuery = mariaDB.selectedQuery("deleteMat_holdByProduct_order_detail_code", work_detail.product_order_detail_code);
            result = await conn.query(selectedQuery, work_detail.product_order_detail_code);

            // 공정 초기 세팅 삭제
            selectedQuery = mariaDB.selectedQuery("deleteWork_processByProduct_order_Detail_code", work_detail.product_order_detail_code);
            result = await conn.query(selectedQuery, work_detail.product_order_detail_code);
        }

        // 생산 지시 상세 삭제
        selectedQuery = mariaDB.selectedQuery("deleteWork_detailByProduct_order_code", product_order_code);
        result = await conn.query(selectedQuery, product_order_code);

        // 생산 지시 조회 - product_order_code
        selectedQuery = mariaDB.selectedQuery("findAllProductOrderByProduct_order_code", product_order_code);
        result = await conn.query(selectedQuery, product_order_code);

        // 생산 계획 상태 변경
        const plan_status = ["OC1", result[0].plan_code];
        selectedQuery = mariaDB.selectedQuery("updatePlanStatusByPlan_code", plan_status);
        result = await conn.query(selectedQuery, plan_status);

        // 생산 지시 삭제
        selectedQuery = mariaDB.selectedQuery("deleteProduct_orderByProduct_order_code", product_order_code);
        result = await conn.query(selectedQuery, product_order_code);

        await conn.commit();
    } catch(err) {
        if(conn) await conn.rollback();
        console.log(err);
    } finally {
        if(conn) conn.release();
    }
    return result;
}


module.exports = {
    getOrder_code,
    findAllPlanOrder,
    findAllProductOrderByProduct_order_code,
    findAllWorkDetailByProduct_order_code,
    findAllProdMatQtyByMat_code,
    findAllMatHoldByProduct_order_detail_code,              // 생산 상품 자재 홀드 조회
    findAllMat_HoldByProduct_order_detail_codeAndMat_code,  // 생산 상품 자재 LOT 조회
    insertProduct_order,                                    // 생산 지시 등록
    updateProduct_order,                                    // 생산 지시 수정
    deleteProduct_order,                                    // 생산 지시 삭제
    
    findStatusByPlan_code,
    findPlanDetailByPlan_code,
    findMatReqByPlan_code,
};
