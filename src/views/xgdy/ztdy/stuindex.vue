<template>
  <div>
    <div class="app-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="主题调研" name="first">
          <div class="filter-container">
            <el-input :clearable="true" v-model="listQuery.keys" style="width: 200px;" class="filter-item" placeholder="检索：调研名称" @keyup.enter.native="handleFilter" />
            <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
          </div>
          <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort">
            <el-table-column align="center" type="index" width="45" fixed="left" />
            <el-table-column min-width="160" prop="title" label="调研名称" show-overflow-tooltip sortable="custom" />
            <el-table-column min-width="260" prop="title" label="调研开放时间" show-overflow-tooltip sortable="custom">
              <template slot-scope="d">
                <span v-if="d.row.times&&d.row.times[0]&&d.row.times[1]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
                <span v-else> -- </span>
              </template>
            </el-table-column>
            <el-table-column align="right" label="操作" width="160" fixed="right" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button v-if="authCheck(287)" type="info" size="mini" plain icon="el-icon-document" @click="detail(scope.row.id,'add')">详情</el-button>
                <el-button v-if="authCheck(291)" type="primary" size="mini" plain icon="el-icon-edit" @click="dywj(scope.row.id,'add')">填写</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="我参与的调研" name="second">
          <div class="filter-container">
            <el-input :clearable="true" v-model="listQuery.keys" style="width: 200px;" class="filter-item" placeholder="检索：调研名称" @keyup.enter.native="handleFilter" />
            <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
          </div>
          <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort">
            <el-table-column align="center" type="index" width="45" fixed="left" />
            <el-table-column min-width="110" prop="status" label="审核状态" sortable="custom" fixed="left">
              <template slot-scope="d">
                <span :class="d.row.status|logStatus|logColor">{{ d.row.status|logStatus|logTitle }}
                </span>
                <el-tooltip v-if="d.row.status==3 && d.row.shenhe" :content="d.row.shenhe" placement="right" effect="light">
                  <i class="el-icon-question text-primary pointer" />
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column min-width="160" prop="title" label="调研名称" show-overflow-tooltip sortable="custom" />
            <el-table-column align="right" label="操作" width="160" fixed="right" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button v-if="authCheck(287)" type="info" size="mini" plain icon="el-icon-document" @click="detail(scope.row.id,'edit')">详情</el-button>
                <el-button v-if="authCheck(291)&&(scope.row.status==3||!scope.row.status)" type="primary" size="mini" plain icon="el-icon-edit" @click="dywj(scope.row.id,'edit')">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

    </div>
    <Page v-model="listQuery" :total="total" />
    <Detail :dialog-detail="dialogDetail" :zid="zid" :type="type" @CB-dialogDetail="CB_dialogDetail" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import Detail from "./detail";
import { ztdyList, dybmList, ztdyDel } from "@/api/xgdy/ztdy";
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
      activeName: 'first',
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
      type: ""

    };
  },
  computed: {
    clientHeight() {
      return this.$store.state.clientHeight;
    }
  },
  activated() {
    this.listQuery.listRows = this.$store.state.pageSize;
    this.getData();
  },
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name
      this.listQuery = {
        listRows: this.$store.state.pageSize,
        page: 1,
        keys: "",
        _sort: "desc",
        _order: "id"
      }
      this.getData()
    },
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
    //详情
    detail(id, type) {
      this.dialogDetail = true
      this.zid = id
      this.type = type
    },
    CB_dialogDetail() {
      this.dialogDetail = false
      this.zid = null
      this.type = ""
    },
    //添加
    add() {
      this.$router.push({
        name: 'ztdyAdd'
      })
    },
    //更多
    handleCommand(row) {
      switch (row.type) {
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
    //填写问卷
    dywj(id, type) {
      this.$router.push({
        name: 'dywj',
        query: { id: id, type: type }
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
      if (this.activeName == "second") {
        //获取已参与数据
        dybmList(this.listQuery)
          .then(rs => {
            this.listLoading = false;
            this.dataList = rs.data;
            this.total = rs.count;
          })
          .catch(() => {
            this.listLoading = false;
          });
      } else {
        //获取未参与数据
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
  }
};
</script>
