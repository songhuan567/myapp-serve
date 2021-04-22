// 引入MD5
const md5 = require('blueimp-md5');
// 引入token生成器
const jwt = require('jsonwebtoken');
// 引入moment
const Moment = require('moment');
// 引入mySQL
const mySql = require('mysql');

// 引入数据库查询函数
const Query = require('./../../config/dbHelper');
const KEY = require('./../../config/config').KEY;

function ResultTemp(status, msg, data) {
    return {
        status,
        msg,
        data
    }
}

/*
  注册主管理员
*/
function regMainAdmin(prams, callBack){
    // 1. 获取参数
    const {username, password} = prams;
    const md5_password = md5(password, KEY);
    // 2. 判断
    if(!username || !password){
        callBack(ResultTemp(0, '用户名或者密码不能为空!', {}));
        return;
    }
    // 3. 创建时间
    const createTime = Moment().format('YYYY-MM-DD hh:mm:sss');
    // 4. 插入数据库
    let sql = `INSERT INTO um_admin(username, password, nickname, roleid, createtime, status) VALUES (?, ?, ?, ?, ?, ?)`;
    let value = [username, md5_password, '主管理员', 1, createTime, 1];
    Query(sql, value).then((result)=>{
        callBack(ResultTemp(1, '注册主管理员账号成功!', {}));
    }).catch((error)=>{
        callBack(ResultTemp(0, '注册主管理员账号失败!', {}));
    });
}

/*
  管理员登录
*/
function loginAdmin(prams, callBack){
    // 1. 获取数据
    const {username, password} = prams;
    // 2. 判断
    if(!username || !password){
        callBack(ResultTemp(0, '用户名或密码不能为空!', {}));
        return;
    }

    // 3. 查询数据库
    let sql = `SELECT * FROM um_admin WHERE username = ? AND status = ?;`;
    let value = [username, 1];
    Query(sql, value).then((result)=>{
        if(result.data.length > 0){
            // 3.1 取出密码对比
            let pwd = result.data[0].password;
            if(password === pwd){ // 登录成功
                const {id, username, password, icon, email, nickname, roleid} = result.data[0];
                //  3.1 生成一个token
                const userData = {id, username, password};
                const token = jwt.sign(userData, KEY);
                callBack(ResultTemp(1, '登录成功!', {token, id, username, icon, email, nickname, roleid}));
            }else {
                callBack(ResultTemp(0, '输入密码不正确!', {}));
            }
        }else {
            callBack(ResultTemp(0, '当前管理员未被激活!', {}));
        }
    }).catch((error)=>{
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}

/*
  获取左侧的菜单
*/
function getLeftMenu(params, callBack){
    // 1. 获取页码和分页
    let {pageNum, pageSize, parentId} = params;
    pageNum = pageNum || 1;
    pageSize = pageSize || 5;

    // 2. 查询数据库
    let sql1 = `SELECT COUNT(*) as total FROM um_menu WHERE parentId = ?;`;
    let sql2 = `SELECT * FROM um_menu WHERE parentId = ? LIMIT ${(pageNum - 1) * pageSize}, ${pageSize}`;
    let value = [parentId];
    Query(sql1, value).then((result1) => {
        Query(sql2, value).then((result2) => {
            let data = {};
            data.total = result1.data[0].total;
            data.list = result2.data;
            callBack(ResultTemp(result2.code, '获取左侧菜单成功', data));
        }).catch((error) => {
            callBack(ResultTemp(error.code, error.msg, error.data));
        })
    });
}


/*
  添加角色
*/
function addRole(params, callBack){
    // 1. 获取参数
    const {name, description, status} = params;
    // 2. 判断
    if(!name || !description){
        callBack(ResultTemp(0, '上传的参数不完整!', {}));
        return;
    }

    // 3. 创建角色
    let createTime = Moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
    let sql = `INSERT INTO um_admin_role(name, description, createTime, status) VALUES (?, ?, ?, ?); `;
    let value = [name, description, createTime, status];
    Query(sql, value).then((result)=>{
        console.log(result);
        if(result.code === 1){
            callBack(ResultTemp(1, '新增角色成功!', {}));
        }else {
            callBack(ResultTemp(0, '新增角色失败!', {}));
        }
    }).catch((error)=>{
        console.log(error);
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}

/*
  获取角色列表
*/
function getRoleList(params, callBack){
    let {pageNum, pageSize} = params;
    // 1. 处理页码
    pageNum =  pageNum || 1;
    pageSize =  pageSize || 5;

    let sql1 = `SELECT COUNT(*) as total FROM um_admin_role;`;
    let sql2 = `SELECT * FROM um_admin_role LIMIT ${(pageNum - 1) * pageSize}, ${pageSize}`;

    // 2. 执行SQL
    Query(sql1).then((result1)=>{
        Query(sql2).then((result2)=>{
            let data = {};
            data.total = result1.data[0].total;
            data.list = result2.data;
            callBack(ResultTemp(result2.code, '获取成功', data));
        }).catch((error)=>{
            callBack(ResultTemp(error.code, error.msg, error.data));
        })
    });
}

/**
 * 根据id去修改角色
 */
function editRole(params, callBack){
    const {id} = params;
    // 2. 容错处理
    if(!id ){
        callBack(ResultTemp(0, '传递参数不能为空!', {}));
        return;
    }

    // 3. 拼接更新语句
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

    // 4. 执行SQL
    let sql = `UPDATE um_admin_role SET ${updateStr} WHERE id = ?;`;
    Query(sql, [id]).then((result)=>{
        if(result.code === 1){
            callBack(ResultTemp(1, '更新角色成功!', {}));
        }else {
            callBack(ResultTemp(0, '更新角色失败!', {}));
        }
    }).catch((error)=>{
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}

/*
  根据id删除角色
*/
function delRole(params, callBack){
    const {id} = params;
    // 2. 容错处理
    if(!id ){
        callBack(ResultTemp(0, '传递参数不能为空!', {}));
        return;
    }
    // 3. 删除一条角色
    let sql = `DELETE FROM um_admin_role WHERE id=?`;
    Query(sql, [id]).then((result)=>{
        if(result.code === 1){
            callBack(ResultTemp(1, '删除角色成功!', {}));
        }else {
            callBack(ResultTemp(0, '删除橘色失败!', {}));
        }
    }).catch((error)=>{
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}


/*
  获取一级和二级的菜单
*/
function getLeftMenuWithChildren(callBack){
    let sql = `SELECT * FROM um_menu`;
    Query(sql).then((result)=>{
        // 1. 取出一级分类
        let menuArr = [];
        for(let i=0; i<result.data.length; i++){
            if(result.data[i].parentId === 0){
                let menuObj = result.data[i];
                menuObj.children = [];
                menuArr.push(menuObj);
            }
        }
        // 2. 取出二级分类
        for(let i=0; i<result.data.length; i++){
            if(result.data[i].parentId !== 0){
                for(j=0; j<menuArr.length; j++){
                    if(menuArr[j].id === result.data[i].parentId){
                        menuArr[j].children.push(result.data[i]);
                    }
                }
            }
        }
        callBack(ResultTemp(1, '获取菜单成功', menuArr));
    }).catch((error)=>{
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}

/*
  根据id获取选中的菜单
*/
function getRoleMenusById(params, callBack){
    const {id} = params;
    if(id){
        let sql = `SELECT menus FROM um_admin_role WHERE id = ?`;
        let value = [id];
        Query(sql, value).then((result)=>{
            callBack(ResultTemp(result.code, '获取成功', result.data[0]));
        }).catch((error)=>{
            callBack(ResultTemp(error.code, error.msg, error.data));
        })
    }else {
        callBack(ResultTemp(0, '操作参数不完整!', {}));
    }
}


/*
  根据id去修改role中的menus中的id
*/
function editRoleMenusById(params, callBack){
    const {id, menus} = params;
    if(!id ){
        callBack(ResultTemp(0, '传递参数不正确!', {}));
        return;
    }

    let sql = `UPDATE um_admin_role SET menus = ? WHERE id = ?;`;
    Query(sql, [menus, id]).then((result)=>{
        if(result.code === 1){
            callBack(ResultTemp(1, '更新成功!', {}));
        }else {
            callBack(ResultTemp(0, '更新失败!', {}));
        }
    }).catch((error)=>{
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}

/*
  获取管理员列表
*/
function getAdminList(params, callBack){
    // 1. 获取页码和分页
    let {pageNum, pageSize} = params;
    pageNum = pageNum || 1;
    pageSize = pageSize || 5;

    // 2. 动态拼接
    let whereArr = [];
    for (let k in params) {
        if (k !== 'pageNum' && k !== 'pageSize') {
            if (params[k] !== null && params[k] !== undefined && params[k] !== '') {
                let str = '';
                if(k === 'username'){
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
    let whereStr = (whereArr.length > 0 ? " WHERE " : "") + whereArr.join(" AND ");

    // 4. 查询数据库
    let sql1 = `SELECT COUNT(*) as total FROM um_admin ${whereStr};`;
    let sql2 = `SELECT * FROM um_admin ${whereStr} LIMIT ${(pageNum - 1) * pageSize}, ${pageSize}`;
    Query(sql1).then((result1) => {
        Query(sql2).then((result2) => {
            let data = {};
            data.total = result1.data[0].total;
            data.list = result2.data;
            callBack(ResultTemp(result2.code, '获取管理员列表成功', data));
        }).catch((error) => {
            callBack(ResultTemp(error.code, error.msg, error.data));
        })
    });
}

/*
  添加管理员
*/
function addAdmin(params, callBack){
    // 1. 获取数据
    const {username, password, email, nickname, status, note} = params;
    // 2. 容错处理
    if (!username || !password) {
        callBack(ResultTemp(0, '上传的参数不完整!', {}));
        return;
    }
    // 3. 添加管理员
    let sql = `INSERT INTO um_admin(username, password, email, nickname, createtime, status, note) VALUES (?, ?, ?, ?, ?, ?, ?); `;
    let createTime = Moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
    let value = [username, password, email, nickname, createTime, status, note];
    Query(sql, value).then((result) => {
        if (result.code === 1) {
            callBack(ResultTemp(1, '创建管理员成功!', {}));
        } else {
            callBack(ResultTemp(0, '创建管理员失败!', {}));
        }
    }).catch((error) => {
        console.log(error);
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}

/*
  更新管理员信息
*/
function updateAdmin(params, callBack){
    const {id} = params;
    // 1. 容错处理
    if(!id ){
        callBack(ResultTemp(0, '查询id不能为空!', {}));
        return;
    }

    // 2. 拼接更新的语句
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

    let sql = `UPDATE um_admin SET ${updateStr} WHERE id = ?;`;
    Query(sql, [id]).then((result)=>{
        if(result.code === 1){
            callBack(ResultTemp(1, '更新管理员信息成功!', {}));
        }else {
            callBack(ResultTemp(0, '更新管理员信息失败!', {}));
        }
    }).catch((error)=>{
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}

/*
  删除管理员
*/
function delAdmin(params, callBack){
    const {id} = params;
    // 2. 容错处理
    if(!id ){
        callBack(ResultTemp(0, '查询id不能为空!', {}));
        return;
    }
    // 3. 删除一条分类以及子分类
    let sql = `DELETE FROM um_admin WHERE id=?;`;
    Query(sql, [id]).then((result)=>{
        if(result.code === 1){
            callBack(ResultTemp(1, '管理员删除成功!', {}));
        }else {
            callBack(ResultTemp(0, '管理员删除失败!', {}));
        }
    }).catch((error)=>{
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}

/*
  获取当前管理员拥有的角色
*/
function getAdminRole(params, callBack){
    const {id} = params;
    // 1. 容错处理
    if(!id ){
        callBack(ResultTemp(0, '查询id不能为空!', {}));
        return;
    }

    // 2. 删除一条分类以及子分类
    let sql = `SELECT roleid FROM um_admin WHERE id=?;`;
    Query(sql, [id]).then((result)=>{
        if(result.code === 1){
            callBack(ResultTemp(1, '获取管理员角色成功!', result.data[0]));
        }else {
            callBack(ResultTemp(0, '获取管理员角色失败!', {}));
        }
    }).catch((error)=>{
        callBack(ResultTemp(error.code, error.msg, error.data));
    })

}

/*
  修改当前管理员拥有的角色
*/
function editAdminRole(params, callBack){
    const {roleid, id} = params;
    // [1, 2, 3]
    // 2. 容错处理
    if(!id ){
        callBack(ResultTemp(0, '传递参数不能为空!', {}));
        return;
    }
    // 4. 执行SQL
    let sql = `UPDATE um_admin SET roleid = ? WHERE id = ?;`;
    Query(sql, [roleid, id]).then((result)=>{
        if(result.code === 1){
            callBack(ResultTemp(1, '更新管理员拥有的角色成功!', {}));
        }else {
            callBack(ResultTemp(0, '更新管理员拥有的角色失败!', {}));
        }
    }).catch((error)=>{
        callBack(ResultTemp(error.code, error.msg, error.data));
    })
}

/*
  根据当前管理员所拥有的角色 ---> 左侧菜单数据
 */
function getLeftMenuByRole(params, callBack){
    const {roleIdArr} = params;
    // 1. 判断
    if(!roleIdArr || roleIdArr.length < 0){
        callBack(ResultTemp(0, '该管理员没有分配角色!', {}));
        return;
    }

    // [1, 2, 7]
    // 2. 执行SQL --> 查询该管理员所拥有的所有菜单
    let mode_sql = `SELECT menus FROM um_admin_role WHERE id = ?;`;
    let sql = '';
    roleIdArr.forEach((item, index) => {
        sql += mySql.format(mode_sql, item);
    });
    Query(sql).then((result)=>{
        if(result.data && result.data.length > 0){
            let roleStr = '';
            if(result.data.length === 1){
                roleStr = result.data[0].menus;
            }else {
                result.data.forEach((item, index)=>{
                     let temp = item[0].menus;
                     roleStr += ',' + temp;
                });
                roleStr = roleStr.substr(1, roleStr.length);
            }
            let menuIdsArr = roleStr.split(',');
            menuIdsArr = Array.from(new Set(menuIdsArr));

            // 根据菜单的id去组合菜单数据
            let mode_sql2 = `SELECT * FROM um_menu WHERE id = ?;`;
            let sql2 = '';
            menuIdsArr.forEach((item, index) => {
                sql2 += mySql.format(mode_sql2, item);
            });

            // 执行SQL
            Query(sql2).then((result)=>{
                if(result.code === 1){
                    let leftMenuArr = [];
                    for(let i=0; i<result.data.length; i++){
                        leftMenuArr.push(result.data[i][0]);
                    }

                    // 1. 取出一级分类
                    let menuArr = [];
                    for(let i=0; i<leftMenuArr.length; i++){
                        if(leftMenuArr[i].parentId === 0){
                            let menuObj = leftMenuArr[i];
                            menuObj.children = [];
                            menuArr.push(menuObj);
                        }
                    }

                    // 2. 取出二级分类
                    for(let i=0; i<leftMenuArr.length; i++){
                        if(leftMenuArr[i].parentId !== 0){
                            for(j=0; j<menuArr.length; j++){
                                if(menuArr[j].id === leftMenuArr[i].parentId){
                                    menuArr[j].children.push(leftMenuArr[i]);
                                }
                            }
                        }
                    }
                    callBack(ResultTemp(1, '获取左侧菜单成功', menuArr));
                }else {
                    callBack(ResultTemp(0, '获取左侧菜单失败', {}));
                }
            }).catch((error)=>{
                callBack(ResultTemp(error.code, error.msg, error.data));
            });
        }else {
            callBack(ResultTemp(0, '获取左侧菜单失败', {}));
        }
    }).catch((error)=>{
        callBack(ResultTemp(error.code, error.msg, error.data));
    });
}

// ---------------------------

/*
  获取商品数据统计
*/
function getProductCount(callBack){

    let sql1  = `SELECT count(*) as allProduct FROM pm_product;`;
    let sql2  = `SELECT count(*) as newProduct FROM pm_product where newsStatus = 1;`;
    let sql3  = `SELECT count(*) as publishProduct FROM pm_product where publishStatus = 1;`;
    let sql4  = `SELECT count(*) as unPublishProduct FROM pm_product where publishStatus = 0;`;

    // 执行SQL
    Promise.all([Query(sql1), Query(sql2), Query(sql3), Query(sql4)]).then(([res1, res2, res3, res4]) => {
        console.log(res1);
        if (res1.code === 1 && res2.code === 1 && res3.code === 1 && res4.code === 1) {
            let productData = {};
            productData.allProduct = res1.data[0].allProduct;
            productData.newProduct = res2.data[0].newProduct;
            productData.publishProduct = res3.data[0].publishProduct;
            productData.unPublishProduct = res4.data[0].unPublishProduct;
            callBack(ResultTemp(1, '获取商品统计数据成功!', productData));
        }
    }).catch((error) => {
        callBack(ResultTemp(error.code, '获取商品统计数据失败!', error.data));
    });
}

/*
  获取管理员数据统计
*/
function getAdminCount(callBack){
    let sql  = `SELECT count(*) as adminCount FROM um_admin;`;
    // 执行SQL
    Promise.all([Query(sql)]).then(([res]) => {
        if (res.code === 1) {
            let otherData = {};
            otherData.adminCount = res.data[0].adminCount;
            callBack(ResultTemp(1, '获取其它统计数据成功!', otherData));
        }
    }).catch((error) => {
        callBack(ResultTemp(error.code, '获取其它统计数据失败!', error.data));
    });
}

/*
  获取订单数据统计
*/
function getOrderCount(callBack){
    let sql1  = `SELECT count(*) as willPayCount FROM om_order where status = 0;`;
    let sql2  = `SELECT count(*) as willTranCount FROM om_order where status = 1;`;
    let sql3  = `SELECT count(*) as onTranCount FROM om_order where status = 2;`;
    let sql4  = `SELECT count(*) as successOrderCount FROM om_order where status = 3;`;
    let sql5  = `SELECT count(*) as closeOrderCount FROM om_order where status = 4;`;
    let sql6  = `SELECT count(*) as failOrderCount FROM om_order where status = 5;`;
    // 执行SQL
    Promise.all([Query(sql1), Query(sql2), Query(sql3), Query(sql4), Query(sql5), Query(sql6)]).then(([res1, res2, res3, res4, res5, res6]) => {
        if (res1.code === 1 && res2.code === 1 && res3.code === 1 && res4.code === 1 && res5.code === 1 && res6.code === 1) {
            let orderData = {};
            orderData.willPayCount = res1.data[0].willPayCount;
            orderData.willTranCount = res2.data[0].willTranCount;
            orderData.onTranCount = res3.data[0].onTranCount;
            orderData.successOrderCount = res4.data[0].successOrderCount;
            orderData.closeOrderCount = res5.data[0].closeOrderCount;
            orderData.failOrderCount = res6.data[0].failOrderCount;
            callBack(ResultTemp(1, '获取订单统计数据成功!', orderData));
        }
    }).catch((error) => {
        callBack(ResultTemp(error.code, '获取订单统计数据失败!', error.data));
    });
}


module.exports = {
    regMainAdmin,
    loginAdmin,
    getLeftMenu,
    addRole,
    getRoleList,
    editRole,
    delRole,
    getLeftMenuWithChildren,
    getRoleMenusById,
    editRoleMenusById,
    getAdminList,
    addAdmin,
    updateAdmin,
    delAdmin,
    getAdminRole,
    editAdminRole,
    getLeftMenuByRole,
    getProductCount,
    getAdminCount,
    getOrderCount
};
