const express = require('express');
const router = express.Router();

const {category_up} = require('./../controller/managerApi/uploadFile');
const categoryController = require('./../controller/managerApi/categoryController');

// 1. 分类图标上传
router.post('/upload_category', category_up.single('file'), (req, res, next)=>{
    const file = req.file;
    console.log(file);
    res.send({
        status: 1,
        msg: '分类图标上传成功',
        data: {
            name: '/uploads/images/category/' + req.file.filename,
            originalName: req.file.originalname
        }
    });
});

// 2. 上传分类
router.post('/add_category', (req, res, next)=>{
    categoryController.addCategory(req.body, result=>{
        res.send(result);
    });
});

// 3. 获取分类列表
router.post('/get_category', (req, res, next)=>{
    categoryController.getCategory(req.body, result=>{
        res.send(result);
    });
});

// 4. 删除分类
router.post('/del_category', (req, res, next)=>{
    categoryController.delCategory(req.body, result=>{
        res.send(result);
    });
});


// 5. 编辑分类
router.post('/update_category', (req, res, next)=>{
    categoryController.updateCategory(req.body, result=>{
        res.send(result);
    });
});


// 6. 根据id获取一条分类
router.post('/get_category_by_id', (req, res, next)=>{
    categoryController.getCategoryById(req.body, result=>{
        res.send(result);
    });
});

// 7. 获取总分类
router.get('/get_category_with_children', (req, res, next)=>{
    categoryController.getCategoryWithChildren(result=>{
        res.send(result);
    });
});

module.exports = router;
