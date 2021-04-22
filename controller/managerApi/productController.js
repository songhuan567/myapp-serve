// 引入数据库查询函数
const Query = require('./../../config/dbHelper');
const mySql = require('mysql');

function ResultTemp(status, msg, data) {
    return {
        status,
        msg,
        data
    }
}

/*
  新增一个商品
*/
function addProduct(params, callBack) {
    // 1. 获取数据
    const {productCategoryId, productCategoryName, name, subTitle, productSn, originalPrice, price, store, sort, giftScore, giftGrow, publishStatus, newsStatus, recommendStatus, serviceIds, netContent, storageCondition, quality, reductionType, reductionPrice, reductionStartTime, reductionEndTime, pic, albumPics, detailHtml, memberPriceList, productHomeKillList} = params;
    // 2. 容错处理
    if (!productCategoryId || !productCategoryName || !name || !subTitle) {
        callBack(ResultTemp(0, '上传的参数不完整!', {}));
        return;
    }
    // 3. 创建分类
    let sql = `INSERT INTO pm_product(productCategoryId, productCategoryName, name, subTitle, productSn, originalPrice, price, store, sort, giftScore, giftGrow, publishStatus, newsStatus, recommendStatus, serviceIds, netContent, storageCondition, quality, reductionType, reductionPrice, reductionStartTime, reductionEndTime, pic, albumPics, detailHtml) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); `;
    let value = [productCategoryId, productCategoryName, name, subTitle, productSn, originalPrice, price, store, sort, giftScore, giftGrow, publishStatus, newsStatus, recommendStatus, serviceIds, netContent, storageCondition, quality, reductionType, reductionPrice, reductionStartTime, reductionEndTime, pic, albumPics, detailHtml];
    Query(sql, value).then((result) => {
        if (result.code === 1) {
            let productId = result.data.insertId;
            if (reductionType === 2) { // 会员优惠
                // 3.1 把数据对象转出纯数组
                let memberValues = [];
                memberPriceList.forEach((item, index) => {
                    let _arr = [productId];
                    for (let m in item) {
                        if (m !== 'memberLevelId') {
                            _arr.push(item[m]);
                        }
                    }
                    memberValues.push(_arr);
                });
                // 3.2 插入数据表
                let sql1 = `INSERT INTO pm_member_price(productId, memberLevelName, memberLevelPrice) VALUES ?;`;
                Query(sql1, [memberValues]).then((result) => {
                    console.log(result);
                    if (result.code === 1) {
                        callBack(ResultTemp(1, '创建商品成功!', {}));
                    } else {
                        callBack(ResultTemp(0, '创建商品失败!', {}));
                    }
                }).catch((error) => {
                    callBack(ResultTemp(error.code, error.msg, error.data));
                })
            } else if (reductionType === 3) { // 首页秒杀
                // 3.1 把数据对象转出纯数组
                let killValues = [];
                productHomeKillList.forEach((item, index) => {
                    let _arr = [productId];
                    for (let m in item) {
                        _arr.push(item[m]);
                    }
                    killValues.push(_arr);
                });
                // 3.2 插入数据表
                let sql1 = `INSERT INTO pm_product_skill(productId, count, discount) VALUES ?;`;
                Query(sql1, [killValues]).then((result) => {
                    if (result.code === 1) {
                        callBack(ResultTemp(1, '创建商品成功!', {}));
                    } else {
                        callBack(ResultTemp(0, '创建商品失败!', {}));
                    }
                }).catch((error) => {
                    callBack(ResultTemp(error.code, error.msg, error.data));
                })
            } else {
                callBack(ResultTemp(1, '创建商品成功!', {}));
            }
            // callBack(ResultTemp(1, '新增分类成功!', {}));
        } else {
            callBack(ResultTemp(0, '新增分类失败!', {}));
        }
    }).catch((error) => {
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}

/*
  获取商品列表
*/

// SELECT * FROM pm_product WHERE productCategoryId = 7 AND productSn = 'LK000001' AND publishStatus = 1 AND name LIKE "%光明纯奶%" LIMIT 0, 2;
function getProductList(params, callBack) {
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
                if (k === 'name') {
                    str = `${k} like "%${params[k]}%"`;
                } else {
                    if (typeof params[k] === "string") {
                        str = `${k} = "${params[k]}"`;
                    } else {
                        str = `${k} = ${params[k]}`;
                    }
                }
                whereArr.push(str);
            }
        }
    }
    // 3. 把数组转出字符串
    let whereStr = (whereArr.length > 0 ? " WHERE " : "") + whereArr.join(" AND ");
    // 4. 查询数据库
    let sql1 = `SELECT COUNT(*) as product_count FROM pm_product ${whereStr};`;
    let sql2 = `SELECT * FROM pm_product ${whereStr} LIMIT ${(pageNum - 1) * pageSize}, ${pageSize}`;
    Query(sql1).then((result1) => {
        Query(sql2).then((result2) => {
            let data = {};
            data.product_count = result1.data[0].product_count;
            data.product_list = result2.data;
            callBack(ResultTemp(result2.code, '获取商品列表成功', data));
        }).catch((error) => {
            callBack(ResultTemp(error.code, error.msg, error.data));
        })
    });
}

/*
  列表局部更新
*/
function updateProductListLocal(params, callBack) {
    const {id} = params;
    // 2. 容错处理
    if (!id) {
        callBack(ResultTemp(0, '分类id不能为空!', {}));
        return;
    }

    // {id: 'xxx', name: 'xxx'}
    let updateStr = '';
    for (let k in params) {
        if (k !== 'id') {
            let str = `${k} = ${params[k]},`;
            if (typeof params[k] === 'string') {
                str = `${k} = "${params[k]}",`;
            }
            updateStr += str;
        }
    }
    updateStr = updateStr.substr(0, updateStr.length - 1);
    let sql = `UPDATE pm_product SET ${updateStr} WHERE id = ?;`;
    Query(sql, [id]).then((result) => {
        if (result.code === 1) {
            callBack(ResultTemp(1, '更新成功!', {}));
        } else {
            callBack(ResultTemp(0, '更新失败!', {}));
        }
    }).catch((error) => {
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}

/*
  删除一个商品
*/
function delOneProduct(params, callBack) {
    const {id} = params;
    // 2. 容错处理
    if (!id) {
        callBack(ResultTemp(0, 'id不能为空!', {}));
        return;
    }
    // 3. 删除一条分类以及子分类
    let sql = `DELETE FROM pm_product WHERE id=?`;
    let sql2 = `DELETE FROM pm_member_price WHERE productId=?`;
    let sql3 = `DELETE FROM pm_product_skill WHERE productId=?`;

    Promise.all([Query(sql, [id]), Query(sql2, [id]), Query(sql3, [id])]).then(([res1, res2, res3]) => {
        console.log(res1, res2, res3);
        if (res1.code === 1 && res2.code === 1 && res3.code === 1) {
            callBack(ResultTemp(1, '删除成功!', {}));
        } else {
            callBack(ResultTemp(0, '删除失败!', {}));
        }
    }).catch((error) => {
        callBack(ResultTemp(error.code, error.msg, error.data));
    });

}

/*
  列表局部批量更新
*/
function updateProductWithListMany(params, callBack) {
    // 1. 获取参数
    const {ids} = params;
    // 2. 判断
    if (ids.length <= 0) {
        callBack(ResultTemp(0, 'id不能为空!', {}));
        return;
    }
    // 3. 取出最后一个值
    //{ ids: [1,3,44,4], newsStatus:0}
    let lastVal = Object.values(params).pop();
    let lastKey = Object.keys(params).pop();

    // [[1, 1], [2, 1], [3, 1]]
    let valueArr = [];
    params.ids.forEach((id, index) => {
        let tArr = [];
        tArr.push(lastVal);
        tArr.push(id);
        valueArr.push(tArr);
    });

    // 4. 执行sql
    let mode_sql = `UPDATE pm_product SET ${lastKey} = ? WHERE id = ?;`;
    let sql = '';
    valueArr.forEach((item, index) => {
        sql += mySql.format(mode_sql, item);
    });
    Query(sql).then((result) => {
        if (result.code === 1) {
            callBack(ResultTemp(1, '更新成功!', {}));
        } else {
            callBack(ResultTemp(0, '更新失败!', {}));
        }
    }).catch((error) => {
        callBack(ResultTemp(error.code, error.msg, error.data));
    })

}

/*
  删除多个商品
*/
function delManyProduct(params, callBack) {
    const {ids} = params;
    // 2. 容错处理
    if (!ids) {
        callBack(ResultTemp(0, 'id不能为空!', {}));
        return;
    }
    // 3. 删除多条商品以及关联
    let sql = `DELETE FROM pm_product WHERE id in (${ids});`;
    let sql2 = `DELETE FROM pm_member_price WHERE productId in (${ids});`;
    let sql3 = `DELETE FROM pm_product_skill WHERE productId in (${ids});`;

    Promise.all([Query(sql), Query(sql2), Query(sql3)]).then(([res1, res2, res3]) => {
        if (res1.code === 1 && res2.code === 1 && res3.code === 1) {
            callBack(ResultTemp(1, '批量删除成功!', {}));
        } else {
            callBack(ResultTemp(0, '批量删除失败!', {}));
        }
    }).catch((error) => {
        callBack(ResultTemp(error.code, error.msg, error.data));
    });

}

/*
  根据id获取一条完整的商品信息
*/
function getProductById(params, callBack) {
    const {id} = params;
    // 2. 容错处理
    if (!id) {
        callBack(ResultTemp(0, '分类id不能为空!', {}));
        return;
    }

    // 3. 获取商品的信息
    let sql = `SELECT * FROM pm_product WHERE id = ?;`;
    let sql2 = `SELECT * FROM pm_member_price WHERE productId = ?;`;
    let sql3 = `SELECT *  FROM pm_product_skill WHERE productId = ?;`;

    Promise.all([Query(sql, [id]), Query(sql2, [id]), Query(sql3, [id])]).then(([res1, res2, res3]) => {
        if (res1.code === 1 && res2.code === 1 && res3.code === 1) {
            let product = res1.data[0];
            product.memberPriceList = res2.data;
            product.productHomeKillList = res3.data;
            // 4. 根据分类的id去查询该分类的父级id
            let cId = product.productCategoryId;
            let sql4 = `SELECT parent_id FROM pm_product_category WHERE id = ?`;
            // [{parent_id: 1}]
            Query(sql4, [cId]).then((result) => {
                if (result.code === 1) {
                    product.cateParentId = result.data[0].parent_id;
                    callBack(ResultTemp(1, '获取商品数据成功!', product));
                } else {
                    callBack(ResultTemp(1, '获取商品数据成功!', product));
                }
            }).catch((error) => {
                callBack(ResultTemp(error.code, error.msg, error.data));
            });
        } else {
            callBack(ResultTemp(0, '获取商品数据失败!', {}));
        }
    }).catch((error) => {
        callBack(ResultTemp(error.code, error.msg, error.data));
    });
}

/*
  根据id去修改一条记录(完整的)
*/
function editProductById(params, callBack){
    const {id} = params;
    console.log(params);
    // 2. 容错处理
    if (!id) {
        callBack(ResultTemp(0, '分类id不能为空!', {}));
        return;
    }

    // 3. 数据处理
    let reductionType = null; // 记录做的是什么优惠活动
    let saleArr = []; // 获取优惠活动的数组<只有一项>
    let updateStr = '';
    for (let k in params) {
        if (
            k !== 'id' &&
            k !== 'memberPriceList' &&
            k !== 'productHomeKillList' &&
            k !== 'cateParentId'
        ) {
            let str = `${k} = ${params[k]},`;
            if (typeof params[k] === 'string') {
                str = `${k} = '${params[k]}',`;
            }
            updateStr += str;
        }
        // 处理相关的优惠
        if(k === 'reductionType'){
             reductionType = params[k];
             // 两个额外情况
             if(reductionType === 2){ // 会员
                 saleArr = params['memberPriceList'];
             }else if(reductionType === 3){ // 首页秒杀
                 saleArr = params['productHomeKillList'];
             }
        }
    }
    updateStr = updateStr.substr(0, updateStr.length - 1);

    // 4. 更新数据库的表
    let sql = `UPDATE pm_product SET ${updateStr} WHERE id = ${id};`;
    console.log(sql);
    // 更新活动表(会员表 或 首页秒杀表)
    let sql2 = null;
    let saleValueArr = []; // 获取纯数据数组 --> sql
    if(reductionType === 2){  // 会员表
        saleArr.forEach((value, index)=>{
            let _tempArr = [id];
            for (let key in value){
                if(key !== 'memberLevelId' && key !== 'productId'){
                    _tempArr.push(value[key])
                }
            }
            saleValueArr.push(_tempArr);
        });
        sql2 = `DELETE FROM pm_member_price WHERE productId = ${id};INSERT INTO pm_member_price(productId, memberLevelName, memberLevelPrice) VALUES ?;`;
    }else if(reductionType === 3){ // 首页秒杀表
        saleArr.forEach((value, index)=>{
            let _tempArr = [id];
            for (let key in value){
                if(key !== 'id' && key !== 'productId'){
                    _tempArr.push(value[key])
                }
            }
            saleValueArr.push(_tempArr);
        });
        sql2 = `DELETE FROM pm_product_skill WHERE productId = ${id};INSERT INTO pm_product_skill(productId, count, discount) VALUES ?;`;
    }

    Query(sql).then((result) => {
        if (result.code === 1) {
            if(reductionType === 2 || reductionType === 3){
                Query(sql2, [saleValueArr]).then((result) => {
                    if (result.code === 1) {
                        callBack(ResultTemp(1, '更新成功!', {}));
                    } else {
                        callBack(ResultTemp(0, '更新失败!', {}));
                    }
                }).catch((error) => {
                    callBack(ResultTemp(error.code, error.msg, error.data));
                })
            }else {
                callBack(ResultTemp(1, '更新成功!', {}));
            }
        } else {
            callBack(ResultTemp(0, '更新失败!', {}));
        }
    }).catch((error) => {
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}

module.exports = {
    addProduct,
    getProductList,
    updateProductListLocal,
    delOneProduct,
    updateProductWithListMany,
    delManyProduct,
    getProductById,
    editProductById
};
