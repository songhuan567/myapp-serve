(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c467f"],{"3b60":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("el-card",{staticClass:"operate-top-card",attrs:{shadow:"never"}},[a("i",{staticClass:"el-icon-s-order",staticStyle:{"font-size":"18px","margin-right":"3px"}}),a("span",[t._v("左侧菜单列表")])]),a("div",{staticClass:"table-container"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.listLoading,expression:"listLoading"}],staticStyle:{width:"100%"},attrs:{data:t.listData,border:""}},[a("el-table-column",{attrs:{label:"编号",width:"120",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(e.$index+1+(t.listQuery.pageNum-1)*t.listQuery.pageSize))]}}])}),a("el-table-column",{attrs:{label:"菜单名称",width:"250",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(e.row.title))]}}])}),a("el-table-column",{attrs:{label:"菜单级别",width:"250",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(t._f("levelFilter")(e.row.parentId)))]}}])}),a("el-table-column",{attrs:{label:"菜单图标",width:"250",align:"center"},scopedSlots:t._u([{key:"default",fn:function(t){return[a("i",{class:t.row.icon})]}}])}),a("el-table-column",{attrs:{label:"操作",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{size:"mini",disabled:t._f("disableNextLevel")(e.row.parentId)},on:{click:function(a){return t.handleShowNextLevel(e.$index,e.row)}}},[t._v(" 查看下一级 ")])]}}])})],1)],1),a("div",{staticClass:"pagination-container"},[a("el-pagination",{attrs:{"current-page":t.listQuery.pageNum,"page-sizes":[5,10,15],"page-size":t.listQuery.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:t.total},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1)],1)},i=[],l=a("dfaf"),s={name:"index",data:function(){return{listData:null,total:null,listLoading:!1,listQuery:{pageNum:1,pageSize:5},parentId:0}},created:function(){this.resetParentId(),this.getList()},watch:{$route:function(t){this.resetParentId(),this.getList()}},methods:{resetParentId:function(){this.listQuery.pageNum=1,void 0!==this.$route.query.parentId?this.parentId=this.$route.query.parentId:this.parentId=0},getList:function(){var t=this;this.listLoading=!0,Object(l["l"])(this.listQuery.pageNum,this.listQuery.pageSize,this.parentId).then((function(e){t.listLoading=!1,t.listData=e.data.list,t.total=e.data.total}))},handleShowNextLevel:function(t,e){this.$router.push({path:"/um/menu",query:{parentId:e.id}})},handleSizeChange:function(t){console.log("每页 ".concat(t," 条")),this.pageNum=1,this.pageSize=t,this.getList()},handleCurrentChange:function(t){console.log("当前页: ".concat(t)),this.pageNum=t,this.getList()}},filters:{levelFilter:function(t){return 0===t?"一级":"二级"}},disableNextLevel:function(t){return 0!==t}},r=s,o=a("2877"),u=Object(o["a"])(r,n,i,!1,null,"33e1c2a1",null);e["default"]=u.exports}}]);
//# sourceMappingURL=chunk-2d0c467f.0c49a231.js.map