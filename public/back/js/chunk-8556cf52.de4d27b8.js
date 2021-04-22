(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-8556cf52"],{"53ad":function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("el-card",{staticClass:"operate-top-card",attrs:{shadow:"never"}},[n("i",{staticClass:"el-icon-s-order",staticStyle:{"font-size":"18px","margin-right":"3px"}}),n("span",[t._v("商品分类列表")]),n("el-button",{staticClass:"btn-add",attrs:{size:"mini"},on:{click:function(e){return t.$router.push("/pm/productCateAdd")}}},[t._v("添加")])],1),n("div",{staticClass:"table-container"},[n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.listLoading,expression:"listLoading"}],staticStyle:{width:"100%"},attrs:{data:t.listData,border:""}},[n("el-table-column",{attrs:{label:"编号",width:"100",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(e.$index+1+(t.pageNum-1)*t.pageSize))]}}])}),n("el-table-column",{attrs:{label:"分类名称",width:"100",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(e.row.name))]}}])}),n("el-table-column",{attrs:{label:"级别",width:"100",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(t._f("levelFilter")(e.row.parent_id)))]}}])}),n("el-table-column",{attrs:{label:"数量单位",width:"100",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(e.row.product_unit))]}}])}),n("el-table-column",{attrs:{label:"移动端显示",width:"100",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-switch",{attrs:{"active-value":1,"inactive-value":0},on:{change:function(n){return t.handleNavStatusChange(e.$index,e.row)}},model:{value:e.row.nav_status,callback:function(n){t.$set(e.row,"nav_status",n)},expression:"scope.row.nav_status"}})]}}])}),n("el-table-column",{attrs:{label:"是否启用",width:"100",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-switch",{attrs:{"active-value":1,"inactive-value":0},on:{change:function(n){return t.handleShowStatusChange(e.$index,e.row)}},model:{value:e.row.show_status,callback:function(n){t.$set(e.row,"show_status",n)},expression:"scope.row.show_status"}})]}}])}),n("el-table-column",{attrs:{label:"排序",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(e.row.sort))]}}])}),n("el-table-column",{attrs:{label:"设置",align:"center",width:"200"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-button",{attrs:{size:"mini",disabled:t._f("disableNextLevel")(e.row.parent_id)},on:{click:function(n){return t.handleShowNextLevel(e.$index,e.row)}}},[t._v(" 查看下一级 ")])]}}])}),n("el-table-column",{attrs:{label:"操作",align:"center",width:"200"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-button",{attrs:{size:"mini"},on:{click:function(n){return t.handleUpdate(e.$index,e.row)}}},[t._v("编辑")]),n("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(n){return t.handleDelete(e.$index,e.row)}}},[t._v(" 删除 ")])]}}])})],1)],1),n("div",{staticClass:"pagination-container"},[n("el-pagination",{attrs:{"current-page":t.pageNum,"page-sizes":[5,10,15],"page-size":t.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:t.total},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1)],1)},s=[],i=n("651a"),r={name:"index",data:function(){return{listData:null,listLoading:!1,pageNum:1,pageSize:5,parentId:0,total:0}},created:function(){this.resetParentId(),console.log(this.parentId),this.getList()},watch:{$route:function(t){this.resetParentId(),this.getList()}},methods:{resetParentId:function(){this.pageNum=1,void 0!==this.$route.query.parentId?this.parentId=this.$route.query.parentId:this.parentId=0},handleSizeChange:function(t){console.log("每页 ".concat(t," 条")),this.pageNum=1,this.pageSize=t,this.getList()},handleCurrentChange:function(t){console.log("当前页: ".concat(t)),this.pageNum=t,this.getList()},getList:function(){var t=this;this.listLoading=!0,Object(i["c"])(this.parentId,this.pageNum,this.pageSize).then((function(e){console.log(e),1===e.status&&(t.listLoading=!1,t.listData=e.data.category_list,t.total=e.data.category_count)}))},handleNavStatusChange:function(t,e){var n=this;Object(i["f"])({id:e.id,nav_status:e.nav_status}).then((function(t){console.log(t),1===t.status?n.$message({message:t.msg,type:"success",duration:1e3}):n.$message({message:t.msg,type:"error",duration:1e3})}))},handleShowStatusChange:function(t,e){var n=this;Object(i["f"])({id:e.id,show_status:e.show_status}).then((function(t){console.log(t),1===t.status?n.$message({message:t.msg,type:"success",duration:1e3}):n.$message({message:t.msg,type:"error",duration:1e3})}))},handleShowNextLevel:function(t,e){this.$router.push({path:"/pm/productCategory",query:{parentId:e.id}})},handleDelete:function(t,e){var n=this;this.$confirm("确定要删除该分类及其子分类, 是否继续?","小撩温馨提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){Object(i["b"])(e.id).then((function(t){1===t.status?(n.$message({type:"success",message:"删除成功!"}),n.getList()):n.$message({type:"error",message:"删除失败!"})}))}))},handleUpdate:function(t,e){this.$router.push({path:"/pm/productCateUpdate",query:{id:e.id}})}},filters:{levelFilter:function(t){return 0===t?"一级":"二级"},disableNextLevel:function(t){return 0!==t}}},o=r,u=n("2877"),c=Object(u["a"])(o,a,s,!1,null,"743a5d12",null);e["default"]=c.exports},"651a":function(t,e,n){"use strict";n.d(e,"a",(function(){return s})),n.d(e,"c",(function(){return i})),n.d(e,"b",(function(){return r})),n.d(e,"f",(function(){return o})),n.d(e,"d",(function(){return u})),n.d(e,"e",(function(){return c}));var a=n("365c"),s=function(t){return Object(a["a"])("/api/auth/category/add_category",t,"post")},i=function(t,e,n){return Object(a["a"])("/api/auth/category/get_category",{parent_id:t,page_num:e,page_size:n},"post")},r=function(t){return Object(a["a"])("/api/auth/category/del_category",{id:t},"post")},o=function(t){return Object(a["a"])("/api/auth/category/update_category",t,"post")},u=function(t){return Object(a["a"])("/api/auth/category/get_category_by_id",{id:t},"post")},c=function(){return Object(a["a"])("/api/auth/category/get_category_with_children")}}}]);
//# sourceMappingURL=chunk-8556cf52.de4d27b8.js.map