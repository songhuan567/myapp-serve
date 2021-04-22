// 引入数据库查询函数
const Query = require('./../../config/dbHelper');
const Moment = require('moment');
const mySql = require('mysql');

function ResultTemp(status, msg, data) {
    return {
        status,
        msg,
        data
    }
}

/*
  获取订单列表
*/
function getOrderList(params, callBack) {
    // 1. 获取页码和分页
    let {pageNum, pageSize} = params;
    pageNum = pageNum || 1;
    pageSize = pageSize || 5;

    // 2. 动态拼接
    // {pageNum: 1, pageSize: 5, productCategoryId: 7, productSn: 'LK000001'}
    let whereArr = [];
    for (let k in params) {
        if (k !== 'pageNum' && k !== 'pageSize') {
            if (params[k] !== null && params[k] !== undefined && params[k] !== '') {
                let str = '';
                if(k === 'receiverName' || k === 'orderTime'){
                    str = `${k} like '%${params[k]}%'`
                }else {
                    if (typeof params[k] === "string") {
                        str = `${k} = '${params[k]}'`;
                    } else {
                        str = `${k} = ${params[k]}`;
                    }
                }
                whereArr.push(str);
            }
        }
    }
    // 3. 把数组转出字符串
    whereArr.push('deleteStatus = 0');
    let whereStr = (whereArr.length > 0 ? " WHERE " : "") + whereArr.join(" AND ");
    console.log(whereStr);
    // 4. 查询数据库
    let sql1 = `SELECT COUNT(*) as order_total FROM om_order ${whereStr};`;
    let sql2 = `SELECT * FROM om_order ${whereStr} LIMIT ${(pageNum - 1) * pageSize}, ${pageSize}`;
    Query(sql1).then((result1) => {
        Query(sql2).then((result2) => {
            let data = {};
            data.total = result1.data[0].order_total;
            data.list = result2.data;
            callBack(ResultTemp(result2.code, '获取订单列表成功', data));
        }).catch((error) => {
            callBack(ResultTemp(error.code, error.msg, error.data));
        })
    });
}

/*
  根据id获取一条完整的订单信息
*/
function getOrderDetailById(params, callBack) {
    const {id} = params;
    // 2. 容错处理
    if (!id) {
        callBack(ResultTemp(0, '分类id不能为空!', {}));
        return;
    }

    // 3. 获取商品的信息
    let sql = `SELECT * FROM om_order WHERE id = ?;`;
    let sql2 = `SELECT * FROM om_order_operate WHERE orderId = ?;`;
    let sql3 = `SELECT *  FROM om_order_product WHERE orderId = ?;`;

    Promise.all([Query(sql, [id]), Query(sql2, [id]), Query(sql3, [id])]).then(([res1, res2, res3]) => {
        if (res1.code === 1 && res2.code === 1 && res3.code === 1) {
            let order = res1.data[0];
            order.orderProductList = res3.data;
            order.historyList = res2.data;
            callBack(ResultTemp(1, '获取订单详情成功!', order));
        } else {
            callBack(ResultTemp(0, '获取订单详情失败!', {}));
        }
    }).catch((error) => {
        callBack(ResultTemp(error.code, error.msg, error.data));
    });
}

/*
  订单发货(一个 + 多个)
*/
function deliveryOrder(params, callBack){
    // 1. 获取发货的订单列表
    const {orderList} = params;
    if(!orderList){
        callBack(ResultTemp(0, '发货的订单不能为空!', {}));
        return;
    }

    // 2. 拼接数据
    let valueArr = [];
    orderList.forEach((order, index)=>{
        let tArr = [];
        if(order.deliveryCompany && order.deliverySn){
            tArr.push(order.deliveryCompany, order.deliverySn, order.orderId);
            valueArr.push(tArr);
        }
    });

    // 3. 调用物流公司的接口, 成功回调
    if(valueArr.length <= 0){
        callBack(ResultTemp(0, '没有要发货的订单!', {}));
        return;
    }

    // 4. 拼接SQL
    let mode_sql = `UPDATE om_order SET deliveryCompany=?, deliverySn=?, status=2 WHERE id=?;`;
    let sql = '';
    valueArr.forEach((item, index) => {
        sql += mySql.format(mode_sql, item);
    });

    console.log(sql);

    // 5. 记录操作流程
    let valueArr2 = [];
    let create_time = Moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
    orderList.forEach((order, index)=>{
        let tArr = [order.orderId, '管理员', create_time, 2, '管理员进行了发货操作'];
        valueArr2.push(tArr);
    });
    // INSERT INTO `shop_db`.`om_order_operate` (`id`, `orderId`, `operateMan`, `createTime`, `orderStatus`, `note`) VALUES (NULL, NULL, NULL, NULL, NULL, NULL);
    let mode_sql2 = `INSERT INTO om_order_operate(orderId, operateMan, createTime, orderStatus, note) VALUES (?, ?, ?, ?, ?);`;
    let sql2 = '';
    valueArr2.forEach((item, index) => {
        sql2 += mySql.format(mode_sql2, item);
    });

    // 6. 执行SQL
    Promise.all([Query(sql), Query(sql2)]).then(([res1, res2])=>{
        if (res1.code === 1 && res2.code === 1){
            callBack(ResultTemp(1, '订单发货成功!', {}));
        }else {
            callBack(ResultTemp(0, '订单发货失败!', {}));
        }
    }).catch((error)=>{
        console.log(error);
        callBack(ResultTemp(error.code, error.msg, error.data));
    });

}


/*
  订单关闭(一个 + 多个)
*/
function closeOrder(params, callBack){
    // 1. 获取发货的订单列表
    const {ids} = params;
    if(!ids || ids.length <= 0){
        callBack(ResultTemp(0, '要操作的订单不能为空!', {}));
        return;
    }
    // 2. 关闭订单
    let mode_sql = `UPDATE om_order SET status = 4 WHERE id = ?;`;
    let sql = '';
    ids.forEach((id, index) => {
        sql += mySql.format(mode_sql, id);
    });
    // 3. 记录行为
    let valueArr = [];
    let create_time = Moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
    ids.forEach((id, index)=>{
        let tArr = [id, '管理员', create_time, 4, params.note];
        valueArr.push(tArr);
    });
    let mode_sql2 = `INSERT INTO om_order_operate(orderId, operateMan, createTime, orderStatus, note) VALUES (?, ?, ?, ?, ?);`;
    let sql2 = '';
    valueArr.forEach((item, index) => {
        sql2 += mySql.format(mode_sql2, item);
    });

    // 6. 执行SQL
    Promise.all([Query(sql), Query(sql2)]).then(([res1, res2])=>{
        if (res1.code === 1 && res2.code === 1){
            callBack(ResultTemp(1, '订单关闭成功!', {}));
        }else {
            callBack(ResultTemp(0, '订单关闭失败!', {}));
        }
    }).catch((error)=>{
        callBack(ResultTemp(error.code, error.msg, error.data));
    });
}


/*
  订单删除(一个 + 多个)
*/
function deleteOrder(params, callBack){
    // 1. 获取发货的订单列表
    const {ids} = params;
    if(!ids || ids.length <= 0){
        callBack(ResultTemp(0, '要操作的订单不能为空!', {}));
        return;
    }
    // 2. 删除订单
    let mode_sql = `UPDATE om_order SET status = 5, deleteStatus = 1 WHERE id = ?;`;
    let sql = '';
    ids.forEach((id, index) => {
        sql += mySql.format(mode_sql, id);
    });

    // 3. 记录行为
    let valueArr = [];
    let create_time = Moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
    ids.forEach((id, index)=>{
        let tArr = [id, '管理员', create_time, 5, '管理员进行了删除操作'];
        valueArr.push(tArr);
    });
    let mode_sql2 = `INSERT INTO om_order_operate(orderId, operateMan, createTime, orderStatus, note) VALUES (?, ?, ?, ?, ?);`;
    let sql2 = '';
    valueArr.forEach((item, index) => {
        sql2 += mySql.format(mode_sql2, item);
    });

    // 6. 执行SQL
    Promise.all([Query(sql), Query(sql2)]).then(([res1, res2])=>{
        if (res1.code === 1 && res2.code === 1){
            callBack(ResultTemp(1, '订单删除成功!', {}));
        }else {
            callBack(ResultTemp(0, '订单删除失败!', {}));
        }
    }).catch((error)=>{
        callBack(ResultTemp(error.code, error.msg, error.data));
    });
}


module.exports = {
    getOrderList,
    deliveryOrder,
    closeOrder,
    deleteOrder,
    getOrderDetailById
};
