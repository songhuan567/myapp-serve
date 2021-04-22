const express = require('express');
const router = express.Router();
const orderController = require('./../controller/managerApi/orderController');


// 1. 获取订单列表
router.post('/get_order_list', (req, res, next)=>{
    orderController.getOrderList(req.body, result=>{
        res.send(result);
    });
});

// 2. 订单发货(一个 + 多个)
router.post('/delivery_order', (req, res, next)=>{
    orderController.deliveryOrder(req.body, result=>{
        res.send(result);
    });
});

// 3. 订单关闭(一个 + 多个)
router.post('/close_order', (req, res, next)=>{
    orderController.closeOrder(req.body, result=>{
        res.send(result);
    });
});

// 4. 订单删除(一个 + 多个)
router.post('/delete_order', (req, res, next)=>{
    orderController.deleteOrder(req.body, result=>{
        res.send(result);
    });
});

// 5. 根据id获取一条订单
router.post('/get_order_by_id', (req, res, next)=>{
    orderController.getOrderDetailById(req.body, result=>{
        res.send(result);
    });
});

module.exports = router;
