// 引入数据库查询函数
const Query = require('./../../config/dbHelper');

function ResultTemp(status, msg, data) {
    return {
        status,
        msg,
        data
    }
}

/*
  上传分类
*/
function addCategory(params, callBack){
    // 1. 获取数据
    const {parent_id, name, product_unit, nav_status, show_status, sort, icon, keywords, description} = params;
    // 2. 容错处理
    if(!name ){
        callBack(ResultTemp(0, '分类名称不能为空!', {}));
        return;
    }
    // 3. 创建分类
    let sql = `INSERT INTO pm_product_category(parent_id, name, product_unit, nav_status, show_status, sort, icon, keywords, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?); `;
    let value = [parent_id, name, product_unit, nav_status, show_status, sort, icon, keywords, description];
    Query(sql, value).then((result)=>{
        if(result.code === 1){
            callBack(ResultTemp(1, '新增分类成功!', {}));
        }else {
            callBack(ResultTemp(0, '新增分类失败!', {}));
        }
    }).catch((error)=>{
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}

/*
  获取分类
*/
function getCategory(params, callBack){
    const {page_num, page_size, parent_id} = params;
    console.log(params);
    // 1. 处理页码
    let pageNum =  page_num || 1;
    let pageSize =  page_size || 5;

    if(parent_id === undefined ){
        callBack(ResultTemp(0, '操作参数不完整!', {}));
        return;
    }

    let sql1 = `SELECT COUNT(*) as category_count FROM pm_product_category WHERE parent_id = ?;`;
    let sql2 = `SELECT * FROM pm_product_category WHERE parent_id = ? LIMIT ${(pageNum - 1) * pageSize}, ${pageSize}`;
    let value = [parent_id];
    Query(sql1, value).then((result1)=>{
        Query(sql2, value).then((result2)=>{
            let data = {};
            data.category_count = result1.data[0].category_count;
            data.category_list = result2.data;
            callBack(ResultTemp(result2.code, '获取成功', data));
        }).catch((error)=>{
            callBack(ResultTemp(error.code, error.msg, error.data));
        })
    });
}


/*
  删除分类
*/
function delCategory(params, callBack){
    const {id} = params;
    // 2. 容错处理
    if(!id ){
        callBack(ResultTemp(0, '分类id不能为空!', {}));
        return;
    }
    // 3. 删除一条分类以及子分类
    let sql = `DELETE FROM pm_product_category WHERE id=? OR parent_id = ?`;
    Query(sql, [id, id]).then((result)=>{
        if(result.code === 1){
            callBack(ResultTemp(1, '删除分类成功!', {}));
        }else {
            callBack(ResultTemp(0, '删除分类失败!', {}));
        }
    }).catch((error)=>{
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}


/*
  编辑分类
*/
function updateCategory(params, callBack){
    const {id} = params;
    // 2. 容错处理
    if(!id ){
        callBack(ResultTemp(0, '分类id不能为空!', {}));
        return;
    }
    // {id: 'xxx', name: 'xxx'}
    let updateStr = '';
    for(let k in params){
        if(k !== 'id'){
            let str = `${k} = ${params[k]},`;
            if(typeof params[k] === 'string'){
                str = `${k} = "${params[k]}",`;
            }
            updateStr += str;
        }
    }
    updateStr = updateStr.substr(0, updateStr.length-1);
    let sql = `UPDATE pm_product_category SET ${updateStr} WHERE id = ?;`;
    console.log(sql);
    Query(sql, [id]).then((result)=>{
        if(result.code === 1){
            callBack(ResultTemp(1, '更新分类成功!', {}));
        }else {
            callBack(ResultTemp(0, '更新分类失败!', {}));
        }
    }).catch((error)=>{
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}

/*
  根据id获取一条分类
*/
function getCategoryById(params, callBack){
    const {id} = params;
    if(id){
        let sql = `SELECT * FROM pm_product_category WHERE id = ?`;
        let value = [id];
        Query(sql, value).then((result)=>{
            callBack(ResultTemp(result.code, '获取成功', result.data));
        }).catch((error)=>{
            callBack(ResultTemp(error.code, error.msg, error.data));
        })
    }else {
        callBack(ResultTemp(0, '操作参数不完整!', {}));
    }
}


/*
  获取一级和二级分类
*/
function getCategoryWithChildren(callBack){
    let sql = `SELECT * FROM pm_product_category`;
    Query(sql).then((result)=>{
        // 1. 取出一级分类
        let cateArr = [];
        for(let i=0; i<result.data.length; i++){
            if(result.data[i].parent_id === 0){
                let cateObj = result.data[i];
                cateObj.children = [];
                cateArr.push(cateObj);
            }
        }
        // 2. 取出二级分类
        for(let i=0; i<result.data.length; i++){
            if(result.data[i].parent_id !== 0){
                for(j=0; j<cateArr.length; j++){
                    if(cateArr[j].id === result.data[i].parent_id){
                        cateArr[j].children.push(result.data[i]);
                    }
                }
            }
        }
        callBack(ResultTemp(1, '获取分类成功', cateArr));
    }).catch((error)=>{
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}



module.exports = {
    addCategory,
    getCategory,
    delCategory,
    updateCategory,
    getCategoryById,
    getCategoryWithChildren
};
