(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-388f420a"],{"651a":function(t,e,a){"use strict";a.d(e,"a",(function(){return s})),a.d(e,"c",(function(){return i})),a.d(e,"b",(function(){return u})),a.d(e,"f",(function(){return l})),a.d(e,"d",(function(){return r})),a.d(e,"e",(function(){return o}));var n=a("365c"),s=function(t){return Object(n["a"])("/api/auth/category/add_category",t,"post")},i=function(t,e,a){return Object(n["a"])("/api/auth/category/get_category",{parent_id:t,page_num:e,page_size:a},"post")},u=function(t){return Object(n["a"])("/api/auth/category/del_category",{id:t},"post")},l=function(t){return Object(n["a"])("/api/auth/category/update_category",t,"post")},r=function(t){return Object(n["a"])("/api/auth/category/get_category_by_id",{id:t},"post")},o=function(){return Object(n["a"])("/api/auth/category/get_category_with_children")}},a27a:function(t,e,a){"use strict";a.d(e,"a",(function(){return s})),a.d(e,"f",(function(){return i})),a.d(e,"b",(function(){return u})),a.d(e,"g",(function(){return l})),a.d(e,"h",(function(){return r})),a.d(e,"c",(function(){return o})),a.d(e,"e",(function(){return c})),a.d(e,"d",(function(){return d}));var n=a("365c"),s=function(t){return Object(n["a"])("/api/auth/product/add_product",t,"post")},i=function(t){return Object(n["a"])("/api/auth/product/get_product",t,"post")},u=function(t){return Object(n["a"])("/api/auth/product/del_one_product",{id:t},"post")},l=function(t){return Object(n["a"])("/api/auth/product/update_product_local",t,"post")},r=function(t){return Object(n["a"])("/api/auth/product/update_list_many",t,"post")},o=function(t){return Object(n["a"])("/api/auth/product/delete_list_many",t,"post")},c=function(t){return Object(n["a"])("/api/auth/product/get_product_by_id",t,"post")},d=function(t){return Object(n["a"])("/api/auth/product/edit_product_by_id",t,"post")}},b0c0:function(t,e,a){var n=a("83ab"),s=a("9bf2").f,i=Function.prototype,u=i.toString,l=/^\s*function ([^ (]*)/,r="name";n&&!(r in i)&&s(i,r,{configurable:!0,get:function(){try{return u.call(this).match(l)[1]}catch(t){return""}}})},b59c:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"app-container"},[a("el-card",{staticClass:"operate-top-card",attrs:{shadow:"never"}},[a("div",[a("i",{staticClass:"el-icon-search",staticStyle:{"font-size":"18px","margin-right":"3px"}}),a("span",[t._v("筛选搜索")]),a("el-button",{staticClass:"btn-clear",staticStyle:{float:"right"},attrs:{size:"mini"},on:{click:t.handleResetSearch}},[t._v(" 清空 ")]),a("el-button",{staticClass:"btn-find",staticStyle:{float:"right","margin-right":"10px"},attrs:{size:"mini",type:"primary"},on:{click:t.handleSearchList}},[t._v(" 查询 ")])],1),a("div",{staticStyle:{"margin-top":"50px"}},[a("el-form",{ref:"productCateForm",attrs:{model:t.listQuery,"label-width":"150px",inline:!0}},[a("el-form-item",{attrs:{label:"商品货号:"}},[a("el-input",{model:{value:t.listQuery.productSn,callback:function(e){t.$set(t.listQuery,"productSn",e)},expression:"listQuery.productSn"}})],1),a("el-form-item",{attrs:{label:"商品所属分类:"}},[a("el-cascader",{attrs:{options:t.productCateOptions,props:{expandTrigger:"hover"}},model:{value:t.productCateValue,callback:function(e){t.productCateValue=e},expression:"productCateValue"}})],1),a("el-form-item",{attrs:{label:"上架状态:"}},[a("el-select",{attrs:{placeholder:"请选择商品是否上架"},model:{value:t.listQuery.publishStatus,callback:function(e){t.$set(t.listQuery,"publishStatus",e)},expression:"listQuery.publishStatus"}},t._l(t.publishStatusOptions,(function(t){return a("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})})),1)],1),a("el-form-item",{attrs:{label:"商品名称："}},[a("el-input",{staticStyle:{width:"400px"},attrs:{placeholder:"请输入商品的名称"},model:{value:t.listQuery.name,callback:function(e){t.$set(t.listQuery,"name",e)},expression:"listQuery.name"}})],1)],1)],1)]),a("div",[a("el-card",{staticClass:"operate-top-card",attrs:{shadow:"never"}},[a("i",{staticClass:"el-icon-s-order",staticStyle:{"font-size":"18px","margin-right":"3px"}}),a("span",[t._v("商品列表")]),a("el-button",{staticClass:"btn-add",attrs:{size:"mini"},on:{click:function(e){return t.$router.push("/pm/addProduct")}}},[t._v("添加")])],1),a("div",{staticClass:"table-container"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.listLoading,expression:"listLoading"}],ref:"multipleTable",staticStyle:{width:"100%"},attrs:{data:t.listData,border:""},on:{"selection-change":t.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"55"}}),a("el-table-column",{attrs:{label:"编号",width:"100",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(e.$index+1+(t.listQuery.pageNum-1)*t.listQuery.pageSize))]}}])}),a("el-table-column",{attrs:{label:"商品图片",width:"160",align:"center"},scopedSlots:t._u([{key:"default",fn:function(t){return[a("img",{staticStyle:{width:"120px"},attrs:{src:t.row.pic,alt:""}})]}}])}),a("el-table-column",{attrs:{label:"商品名称",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(e.row.name))]}}])}),a("el-table-column",{attrs:{label:"价格/货号",width:"150",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("p",[t._v("市场价: "+t._s(e.row.originalPrice))]),a("p",[t._v("商品售价: "+t._s(e.row.price))]),a("p",[t._v("货号: "+t._s(e.row.productSn))])]}}])}),a("el-table-column",{attrs:{label:"操作",width:"130",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("p",[t._v(" 上架: "),a("el-switch",{attrs:{"active-value":1,"inactive-value":0},on:{change:function(a){return t.handlePublishStatusChange(e.$index,e.row)}},model:{value:e.row.publishStatus,callback:function(a){t.$set(e.row,"publishStatus",a)},expression:"scope.row.publishStatus"}})],1),a("p",[t._v(" 新品: "),a("el-switch",{attrs:{"active-value":1,"inactive-value":0},on:{change:function(a){return t.handleNewStatusChange(e.$index,e.row)}},model:{value:e.row.newsStatus,callback:function(a){t.$set(e.row,"newsStatus",a)},expression:"scope.row.newsStatus"}})],1),a("p",[t._v(" 推荐: "),a("el-switch",{attrs:{"active-value":1,"inactive-value":0},on:{change:function(a){return t.handleRecommendStatusChange(e.$index,e.row)}},model:{value:e.row.recommendStatus,callback:function(a){t.$set(e.row,"recommendStatus",a)},expression:"scope.row.recommendStatus"}})],1)]}}])}),a("el-table-column",{attrs:{label:"销量",width:"100",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(e.row.sale?e.row.sale:"暂无统计"))]}}])}),a("el-table-column",{attrs:{label:"存量",align:"center",width:"100"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(e.row.store))]}}])}),a("el-table-column",{attrs:{label:"操作",align:"center",width:"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{size:"mini"},on:{click:function(a){return t.handleUpdate(e.$index,e.row)}}},[t._v(" 编辑 ")]),a("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(a){return t.handleDelete(e.$index,e.row)}}},[t._v("删除")])]}}])})],1)],1),a("div",{staticClass:"many-operate-container"},[a("el-select",{attrs:{size:"small",placeholder:"批量操作列表"},model:{value:t.operatesType,callback:function(e){t.operatesType=e},expression:"operatesType"}},t._l(t.operates,(function(t){return a("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})})),1),a("el-button",{staticStyle:{"margin-left":"10px"},attrs:{size:"mini",type:"danger"},on:{click:function(e){return t.handleManyOperate()}}},[t._v(" 确定 ")])],1),a("div",{staticClass:"pagination-container"},[a("el-pagination",{attrs:{"current-page":t.listQuery.pageNum,"page-sizes":[5,10,15],"page-size":t.listQuery.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:t.total},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1)],1)],1)},s=[],i=(a("b0c0"),a("a27a")),u=a("651a"),l={productSn:null,productCategoryId:null,publishStatus:null,name:null,pageNum:1,pageSize:5},r={name:"index",data:function(){return{listQuery:Object.assign({},l),productCateOptions:[],productCateValue:[],publishStatusOptions:[{value:1,label:"上架"},{value:0,label:"下架"}],listData:[],listLoading:!1,total:0,multipleSelection:[],operates:[{label:"批量上架",value:"publishOn"},{label:"批量下架",value:"publishOff"},{label:"批量推荐",value:"recommendOn"},{label:"批量取消推荐",value:"recommendOff"},{label:"批量上新",value:"newsOn"},{label:"批量下新",value:"newsOff"},{label:"批量删除",value:"manyDel"}],operatesType:null}},created:function(){this.getCategoryList(),this.getList()},watch:{productCateValue:function(t){1===t.length?this.listQuery.productCategoryId=t[0]:2===t.length?this.listQuery.productCategoryId=t[1]:this.listQuery.productCategoryId=null}},methods:{getCategoryList:function(){var t=this;Object(u["e"])().then((function(e){if(1===e.status){var a=e.data;t.productCateOptions=[];for(var n=0;n<a.length;n++){var s=[];if(null!=a[n].children&&a[n].children.length>0)for(var i=0;i<a[n].children.length;i++)s.push({value:a[n].children[i].id,label:a[n].children[i].name});s=s.length>0?s:null,t.productCateOptions.push({label:a[n].name,value:a[n].id,children:s})}}}))},getList:function(){var t=this;this.listLoading=!0,Object(i["f"])(this.listQuery).then((function(e){1===e.status&&(t.listLoading=!1,t.listData=e.data.product_list,t.total=e.data.product_count)}))},handleSizeChange:function(t){this.listQuery.pageNum=1,this.listQuery.pageSize=t,this.getList()},handleCurrentChange:function(t){this.listQuery.pageNum=t,this.getList()},handleDelete:function(t,e){var a=this;this.$confirm("确定要删除该商品及相关信息, 是否继续?","小撩温馨提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){Object(i["b"])(e.id).then((function(t){1===t.status?(a.$message({type:"success",message:"删除成功!"}),a.total<=a.listQuery.pageSize&&(a.listQuery.pageNum=1),a.getList()):a.$message({type:"error",message:"删除失败!"})}))}))},handleUpdate:function(t,e){this.$router.push({path:"/pm/updateProduct",query:{id:e.id}})},handlePublishStatusChange:function(t,e){this.localUpdateProduct({id:e.id,publishStatus:e.publishStatus})},handleNewStatusChange:function(t,e){this.localUpdateProduct({id:e.id,newsStatus:e.newsStatus})},handleRecommendStatusChange:function(t,e){this.localUpdateProduct({id:e.id,recommendStatus:e.recommendStatus})},localUpdateProduct:function(t){var e=this;Object(i["g"])(t).then((function(t){1===t.status?e.$message({type:"success",message:t.msg}):e.$message({type:"error",message:t.msg})}))},handleSearchList:function(){this.listQuery.pageNum=1,this.getList()},handleResetSearch:function(){this.productCateValue=[],this.listQuery=Object.assign({},l)},handleManyOperate:function(){var t=this;null!==this.operatesType?null===this.multipleSelection||this.multipleSelection.length<1?this.$message({message:"请选择要操作的商品",type:"warning",duration:1e3}):this.$confirm("是否进行批量操作","小撩温馨提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){for(var e=[],a=0;a<t.multipleSelection.length;a++)e.push(t.multipleSelection[a].id);switch(t.operatesType){case t.operates[0].value:t.updatePublishStatus(1,e);break;case t.operates[1].value:t.updatePublishStatus(0,e);break;case t.operates[2].value:t.updateRecommendStatus(1,e);break;case t.operates[3].value:t.updateRecommendStatus(0,e);break;case t.operates[4].value:t.updateNewsStatus(1,e);break;case t.operates[5].value:t.updateNewsStatus(0,e);break;case t.operates[6].value:t.updateDeleteStatus(e);break;default:break}})).catch((function(){t.$message({type:"info",message:"已取消"})})):this.$message({message:"请选择批量操作的选项",type:"warning",duration:1e3})},updatePublishStatus:function(t,e){var a=this,n={};n.ids=e,n.publishStatus=t,Object(i["h"])(n).then((function(t){1===t.status&&(a.$message({type:"success",message:"修改成功",duration:1e3}),a.getList())}))},updateRecommendStatus:function(t,e){var a=this,n={};n.ids=e,n.recommendStatus=t,Object(i["h"])(n).then((function(t){1===t.status&&(a.$message({type:"success",message:"修改成功",duration:1e3}),a.getList())}))},updateNewsStatus:function(t,e){var a=this,n={};n.ids=e,n.newsStatus=t,Object(i["h"])(n).then((function(t){1===t.status&&(a.$message({type:"success",message:"修改成功",duration:1e3}),a.getList())}))},updateDeleteStatus:function(t){var e=this,a={};a.ids=t,Object(i["c"])(a).then((function(t){1===t.status&&(e.$message({type:"success",message:"批量删除成功",duration:1e3}),e.getList())}))},handleSelectionChange:function(t){this.multipleSelection=t}}},o=r,c=a("2877"),d=Object(c["a"])(o,n,s,!1,null,"e9bdd84c",null);e["default"]=d.exports}}]);
//# sourceMappingURL=chunk-388f420a.1b56aa6e.js.map