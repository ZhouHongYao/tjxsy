<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" style="width: 280px;" class="filter-item" placeholder="检索：调研名称、学生姓名、学号" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves v-if="authCheck(286)" class="filter-item margin-right-10" type="primary" icon="el-icon-circle-plus-outline" @click="add()">添加</el-button>
      </div>
      <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort">
        <el-table-column align="center" type="index" width="45" fixed="left" />
        <el-table-column min-width="160" prop="title" label="调研名称" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="260" prop="times" label="调研开放时间" show-overflow-tooltip sortable="custom">
          <template slot-scope="d">
            <span v-if="d.row.times&&d.row.times[0]&&d.row.times[1]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column align="right" label="操作" width="160" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(287)" type="info" size="mini" plain icon="el-icon-document" @click="list(scope.row.id)">详情</el-button>
            <el-dropdown v-if="authCheck(287) || authCheck(288) || authCheck(289)" class="margin-left-10" trigger="click" @command="handleCommand">
              <el-button type="info" size="mini" plain>
                更多
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="authCheck(287)" :command="{type:'preview',ID:scope.row.id}">
                  <span class="text-success">预览</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="authCheck(288)" :command="{type:'edit',ID:scope.row.id}">
                  <span class="text-primary">编辑</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="authCheck(289)" :command="{type:'delete',ID:scope.row.id}">
                  <span class="text-danger">删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
    <Detail :dialog-detail="dialogDetail" :zid="zid" @CB-dialogDetail="CB_dialogDetail" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import Detail from "./detail";
import { ztdyList, ztdyDel } from "@/api/xgdy/ztdy";
import { publicMixin } from "@/api/mixins";

export default {
  name: "year",
  directives: { waves },
  components: { Detail },
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
        _order: "id"
      },
      //预览详情
      dialogDetail: false,
      zid: null,
      //新增、编辑Dialog
      dialogState: false,
      yid: null
    };
  },
  computed: {
    clientHeight() {
      return this.$store.state.clientHeight;
    }
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
    //添加
    add() {
      this.$router.push({
        name: 'ztdyAdd'
      })
    },
    //调研列表
    list(id) {
      this.$router.push({
        name: 'ztdyList',
        query: { id: id }
      })
    },
    //更多
    handleCommand(row) {
      switch (row.type) {
        case "preview":
          this.dialogDetail = true
          this.zid = row.ID
          break;
        case "review":
          this.$router.push({
            name: 'ztdySh',
            query: { id: row.ID, type: 'review' }
          })
          break;
        case "edit":
          this.$router.push({
            name: 'ztdyEdit',
            query: { id: row.ID }
          })
          break;
        case "delete":
          this.deleteData(row.ID);
          break;
      }
    },
    //预览回调
    CB_dialogDetail() {
      this.dialogDetail = false
      this.zid = null
    },
    //填写问卷
    dywj(id) {
      this.$router.push({
        name: 'dywj',
        query: { id: id }
      })
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
          ztdyDel({ id: id })
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
    //获取数据
    getData() {
      this.listLoading = true;
      ztdyList(this.listQuery)
        .then(rs => {
          this.listLoading = false;
          this.dataList = rs.data;
          this.total = rs.count;
        })
        .catch(() => {
          this.listLoading = false;
        });
    }
  }
};
</script>
