<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" style="width: 200px;" class="filter-item" placeholder="检索：学生姓名、学号" @keyup.enter.native="handleFilter" />
        <el-select v-if="!currentRole()&&szbjData && szbjData.length>0" v-model="listQuery.szbj" placeholder="检索：班级" style="width: 180px;" class="filter-item" clearable>
          <el-option v-for="item in szbjData" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves v-if="authCheck(170)" class="filter-item margin-right-10" type="primary" icon="el-icon-circle-plus-outline" @click="add()">添加</el-button>
        <ImportData v-if="authCheck(174)" :model="$route.name" import_text="导入总成绩" />
        <importCj v-if="authCheck(130)" import_text="导入各科成绩" />
        <el-button v-waves v-if="multipleSelection.length >0 && authCheck(218)" class="filter-item" type="danger" icon="el-icon-delete" @click="batchDel()">批量删除</el-button>
      </div>
      <el-table v-loading="listLoading" :data="dataList" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="45" fixed="left" />
        <el-table-column min-width="110" prop="name" label="学生姓名" show-overflow-tooltip sortable="custom" fixed="left" />
        <el-table-column min-width="110" prop="account" label="学号" sortable="custom" />
        <el-table-column min-width="110" prop="sex" label="性别" sortable="custom">
          <template slot-scope="d">
            {{ d.row.sex ? d.row.sex==1 ? '男' : '女' : '--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="110" prop="szbj" label="所在班级" sortable="custom" />
        <el-table-column min-width="110" prop="zxf" label="总学分" sortable="custom" />
        <el-table-column min-width="110" prop="jd" label="平均绩点" sortable="custom" />
        <el-table-column min-width="120" prop="tsbxk" label="通识必修课" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="120" prop="tsxxk" label="通识选修课" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="130" prop="dljck" label="大类基础课程" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="120" prop="zyjck" label="专业基础课" show-overflow-tooltip sortable="custom" />
        <el-table-column align="right" label="操作" width="160" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(171)" type="info" size="mini" plain icon="el-icon-document" @click="detail(scope.row.id, scope.row.sid)">详情</el-button>
            <el-dropdown v-if="authCheck(172) || authCheck(173) " class="margin-left-10" trigger="click" @command="handleCommand">
              <el-button type="info" size="mini" plain>
                更多
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="authCheck(172)" :command="{type:'edit',ID:scope.row.id}">
                  <span class="text-primary">编辑</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="authCheck(173)" :command="{type:'delete',ID:scope.row.id}">
                  <span class="text-danger">删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
    <NewEdit :dialog-state="dialogState" :cjid="cjid" @CB-cjjbqk="CB_cjjbqk" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import { cjjbqkList, cjjbqkDel } from "@/api/xyxx/cjjbqk";
import { publicMixin } from "@/api/mixins";
import NewEdit from "./newEdit";
import importCj from "@/components/importCj";

export default {
  name: "cjjbqk",
  components: { NewEdit, importCj },
  directives: { waves },
  mixins: [publicMixin],
  data() {
    return {
      //table 参数
      listLoading: false,
      total: 0,
      dataList: [],
      // 检索参数
      listQuery: {
        listRows: this.$store.state.pageSize,
        page: 1,
        keys: "",
        _sort: "desc",
        _order: "id",
        szbj: ""
      },
      szbjData: [],
      multipleSelection: [],
      //编辑dialog
      dialogState: false,
      cjid: null
    };
  },
  activated() {
    this.listQuery.listRows = this.$store.state.pageSize;
    if (this.$route.query.account) {
      this.listQuery.keys = this.$route.query.account;
    }
    this.getData();
  },
  methods: {
    //根据条件检索
    handleFilter() {
      this.listQuery.page = 1;
      this.getData();
    },
    //排序
    handleSort(val) {
      this.listQuery._sort = val.order === "ascending" ? "asc" : "desc"
      this.listQuery._order = val.prop ? val.prop : "id"
      this.getData();
    },
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //批量删除
    batchDel() {
      if (this.multipleSelection.length === 0) {
        return this.$message({
          type: "warning",
          message: "请选择需要删除的内容"
        });
      }
      this.deleteData(
        this.multipleSelection.map(item => {
          return item.id;
        })
      );
    },
    //删除
    deleteData(id) {
      this.$confirm("删除后不可恢复，确定要删除吗？", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          cjjbqkDel({ id: id })
            .then(rs => {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getData();
            })
            .catch(() => {
              this.listLoading = false;
            });
        })
        .catch(() => { });
    },
    //添加
    add() {
      this.dialogState = true;
      this.cjid = null;
    },
    //详情
    detail(id, sid) {
      this.$router.push({
        name: 'cjjbqkDetail',
        query: { id: id, sid: sid }
      })
    },
    //更多
    handleCommand(row) {
      switch (row.type) {
        case "edit":
          this.dialogState = true;
          this.cjid = row.ID;
          break;
        case "delete":
          this.deleteData(row.ID);
          break;
      }
    },
    // dialog 回调
    CB_cjjbqk(val) {
      if (val === 1) {
        this.getData();
      }
      this.dialogState = false;
      this.cjid = null;
    },
    //获取数据
    getData() {
      this.listLoading = true;
      cjjbqkList(this.listQuery)
        .then(rs => {
          this.listLoading = false;
          this.dataList = rs.data;
          this.total = rs.count;
          this.szbjData = rs.info.szbjs
        })
        .catch(() => {
          this.listLoading = false;
        });
    }
  }
};
</script>
