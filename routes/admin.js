const express = require('express');
const router = express.Router();
// 引入MD5
const md5 = require('blueimp-md5');
// 引入token生成器
const jwt = require('jsonwebtoken');

// 引入数据库查询函数
const Query = require('./../config/dbHelper');
const KEY = require('./../config/config').KEY;

const {admin_up} = require('../controller/managerApi/uploadFile');

const adminController = require('./../controller/managerApi/adminController');

// 1.注册主管理员的接口
/*
  admin
  admin
*/
router.post('/reg', (req, res, next)=>{
    adminController.regMainAdmin(req.body, result=>{
        res.send(result);
    });
});

// 2.管理员登录
router.post('/login', (req, res, next)=>{
   adminController.loginAdmin(req.body, result=>{
      // 往服务器端存储token
       if(result.status === 1){
           req.session.manager_token = result.data.token;
       }
       res.send(result);
   });
});

// 3. 退出登录
router.get('/logout', (req, res, next)=>{
    req.session.manager_token = null;
    res.json({
        status: 1,
        msg: '退出登录成功!',
        data: {}
    });
});

// 4.获取左侧菜单列表
router.post('/left_menu', (req, res, next)=>{
    adminController.getLeftMenu(req.body, result=>{
        res.send(result);
    });
});

router.post('/add_role', (req, res, next)=>{
    adminController.addRole(req.body, result=>{
        res.send(result);
    });
});

router.post('/role_list', (req, res, next)=>{
    adminController.getRoleList(req.body, result=>{
        res.send(result);
    });
});

router.post('/edit_role', (req, res, next)=>{
    adminController.editRole(req.body, result=>{
        res.send(result);
    });
});

router.post('/del_role', (req, res, next)=>{
    adminController.delRole(req.body, result=>{
        res.send(result);
    });
});

router.get('/all_menu_list', (req, res, next)=>{
    adminController.getLeftMenuWithChildren(result=>{
        res.send(result);
    });
});

router.post('/get_menu_with_role_id', (req, res, next)=>{
    adminController.getRoleMenusById(req.body, result=>{
        res.send(result);
    });
});

router.post('/edit_menu_with_role_id', (req, res, next)=>{
    adminController.editRoleMenusById(req.body, result=>{
        res.send(result);
    });
});

// 5. 管理员相关操作
// 5.1 获取管理员列表
router.post('/admin_list', (req, res, next)=>{
    adminController.getAdminList(req.body, result=>{
        res.send(result);
    });
});
// 5.2 添加管理员
router.post('/add_admin', (req, res, next)=>{
    adminController.addAdmin(req.body, result=>{
        res.send(result);
    });
});
// 5.3 更新管理员信息
router.post('/update_admin', (req, res, next)=>{
    adminController.updateAdmin(req.body, result=>{
        res.send(result);
    });
});
// 5.4 删除管理员
router.post('/del_admin', (req, res, next)=>{
    adminController.delAdmin(req.body, result=>{
        res.send(result);
    });
});
// 5.5 获取当前管理员拥有的角色
router.post('/get_admin_role', (req, res, next)=>{
    adminController.getAdminRole(req.body, result=>{
        res.send(result);
    });
});
// 5.6 修改当前管理员拥有的角色
router.post('/edit_admin_role', (req, res, next)=>{
    adminController.editAdminRole(req.body, result=>{
        res.send(result);
    });
});
// 5.7  根据当前管理员所拥有的角色 ---> 左侧菜单数据
router.post('/get_left_menu_with_role', (req, res, next)=>{
    adminController.getLeftMenuByRole(req.body, result=>{
        res.send(result);
    });
});

// -------------------------------------
// 18. 获取商品统计数据
router.get('/get_product_count', (req, res, next)=>{
    adminController.getProductCount(result => {
        res.send(result);
    });
});

// 19. 获取管理员数据统计
router.get('/get_admin_count', (req, res, next)=>{
    adminController.getAdminCount(result => {
        res.send(result);
    });
});

// 20. 获取订单数据统计
router.get('/get_order_count', (req, res, next)=>{
    adminController.getOrderCount(result => {
        res.send(result);
    });
});


module.exports = router;
