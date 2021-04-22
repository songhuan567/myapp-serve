const express = require('express');
const router = express.Router();

const {product_up} = require('./../controller/managerApi/uploadFile');
const productController = require('./../controller/managerApi/productController');

// 1. 商品图片上传
router.post('/upload_product', product_up.single('file'), (req, res, next)=>{
    res.send({
        status: 1,
        msg: '商品图片上传成功',
        data: {
            name: '/uploads/images/product/' + req.file.filename,
            originalName: req.file.originalname
        }
    });
});


// 2. 新增商品
router.post('/add_product', (req, res, next)=>{
    productController.addProduct(req.body, result=>{
        res.send(result);
    });
});

// 3. 获取商品列表
router.post('/get_product', (req, res, next)=>{
    productController.getProductList(req.body, result=>{
        res.send(result);
    });
});

// 4. 局部更新商品列表
router.post('/update_product_local', (req, res, next)=>{
    productController.updateProductListLocal(req.body, result=>{
        res.send(result);
    });
});

// 5. 删除一条商品
router.post('/del_one_product', (req, res, next)=>{
    productController.delOneProduct(req.body, result=>{
        res.send(result);
    });
});

// 6. 批量操作列表数据
router.post('/update_list_many', (req, res, next)=>{
    productController.updateProductWithListMany(req.body, result=>{
        res.send(result);
    });
});


// 7. 批量删除商品
router.post('/delete_list_many', (req, res, next)=>{
    productController.delManyProduct(req.body, result=>{
        res.send(result);
    });
});

// 8. 获取一个商品的完整信息
router.post('/get_product_by_id', (req, res, next)=>{
    productController.getProductById(req.body, result=>{
        res.send(result);
    });
});

// 9. 根据id去修改一个商品的完整信息
router.post('/edit_product_by_id', (req, res, next)=>{
    productController.editProductById(req.body, result=>{
        res.send(result);
    });
});

module.exports = router;
