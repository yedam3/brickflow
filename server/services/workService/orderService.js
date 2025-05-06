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
const findAllPlanOrderByProduct_order_code = async (product_order_code) => {
    let result = await mariaDB.query("findAllPlanOrderByProduct_order_code", product_order_code).catch((err) => {
        console.error(err);
    });
    return result[0];
};

// 생산지시 상세 조회
const findAllWorkDetailByProduct_order_code = async (product_order_code) => {
    let result = await mariaDB.query("findAllWorkDetailByProduct_order_code", product_order_code).catch((err) => {
        console.err(err)
    });
    return result;
}

// 생산 상품 자재 재고 조회
const findAllProdMatQtyByMat_code = async (mat_code) => {
    let result = await mariaDB.query("findAllProdMatQtyByMat_code", mat_code).catch((err) => {
        console.error(err);
    });
    return result;
};

// 생산 상품 자재 홀드 조회
const findAllMatHoldByProdcut_order_detail_code = async (product_order_code) => {
    let result = await mariaDB.query("findAllMatHoldByProdcut_order_detail_code", product_order_code).catch((err) => {
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

        // 생산 지시 상세 등록
        for (let orderDetailData of orderDetailDataList) {

            // 생산 지시 코드 조회
            selectedQuery = mariaDB.selectedQuery("findProduct_order_detail_code");
            result = await conn.query(selectedQuery);

            orderDetailData.product_order_detail_code = result[0].product_order_detail_code;

            orderDetailData.product_order_code = orderData.product_order_code;
            orderDetailData.process_flow_code = "공정 흐름도 임시데이터";

            selectedQuery = mariaDB.selectedQuery("insertProduct_order_detail", convertObjToAry(orderDetailData, orderDetail_fields));
            result = await conn.query(selectedQuery, convertObjToAry(orderDetailData, orderDetail_fields));
        }

        // 생산 자재 홀드량 등록
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

            for(let matData of matHoldData.mat_LOTs) {
                // 자재 홀드 코드 조회
                selectedQuery = mariaDB.selectedQuery("findMat_hold_code");
                result = await conn.query(selectedQuery);

                newMatData.mat_hold_code = result[0].mat_hold_code;
                newMatData.mat_LOT = matData.mat_LOT;
                newMatData.hold_quantity = parseInt(matHoldData.material_input_qunatity);
                newMatData.mat_code = matData.mat_code;


                // 자재 홀드량 등록
                selectedQuery = mariaDB.selectedQuery("insertMat_hold", Object.values(newMatData));
                result = await conn.query(selectedQuery, Object.values(newMatData));
            }
        }

        // 생산 계획 상태 변경
        let planData = ["OC2", orderData.plan_code];
        selectedQuery = mariaDB.selectedQuery("updatePlanStatusByPlan_code", planData);
        result = await conn.query(selectedQuery, planData);

        await conn.commit();
    } catch (err) {
        if (conn) await conn.rollback();
        console.log(err);
    } finally {
        if (conn) conn.release();
    }
    return result;
};

module.exports = {
    getOrder_code,
    findAllPlanOrder,
    findAllPlanOrderByProduct_order_code,
    findAllWorkDetailByProduct_order_code,
    findAllProdMatQtyByMat_code,
    insertProduct_order,

    findAllMatHoldByProdcut_order_detail_code,
    
    findStatusByPlan_code,
    findPlanDetailByPlan_code,
    findMatReqByPlan_code,
};
