const express = require('express');
const router = express.Router();


router.get('/', (req, res, next)=>{
    res.render('back/index.html');
});

module.exports = router;
