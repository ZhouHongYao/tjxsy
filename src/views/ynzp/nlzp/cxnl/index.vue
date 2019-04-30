<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input v-if="!currentRole()" :clearable="true" v-model="listQuery.keys" style="width: 280px;" class="filter-item" placeholder="检索：学生姓名、学号" @keyup.enter.native="handleFilter" />
        <el-select v-model="listQuery.xq" placeholder="检索：学期" class="filter-item" style="width: 150px;" clearable>
          <el-option v-for="item in xqData" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <span v-if="currentRole()">
          <span v-if="info.can_time && info.can_time.is_can">
            <el-button v-waves v-if="authCheck(266)" class="filter-item margin-right-10" type="primary" icon="el-icon-circle-plus-outline" @click="add()">添加</el-button>
          </span>
          <span v-if="!info.can_time || (!info.can_time.is_can && !info.can_time.time)" class="text-danger font-110">尚未开放填写</span>
          <span v-if="info.can_time && !info.can_time.is_can && info.can_time.time" class="text-danger font-110">填写时间: {{ info.can_time.time }}</span>
        </span>
      </div>
      <el-table v-loading="listLoading" :data="dataList" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort">
        <el-table-column align="center" type="index" width="45" fixed="left" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="name" label="学生姓名" sortable="custom" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="account" label="学号" sortable="custom" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="sex" label="性别" sortable="custom">
          <template slot-scope="d">
            {{ d.row.sex ? d.row.sex==1 ? '男' : '女' : '--' }}
          </template>
        </el-table-column>
        <el-table-column v-if="!currentRole()" min-width="110" prop="szbj" label="所在班级" sortable="custom" />
        <el-table-column min-width="110" prop="xq" label="学期" sortable="custom">
          <template slot-scope="d">
            {{ d.row.xq ? d.row.xq == 1 ? '第一学期' : '第二学期' : '--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="130" prop="ljsw" label="逻辑思维能力" sortable="custom" />
        <el-table-column min-width="130" prop="bzsw" label="辩证思维能力" sortable="custom" />
        <el-table-column min-width="110" prop="cxys" label="创新意识" sortable="custom" />
        <el-table-column min-width="150" prop="yzpz" label="顽强的意志品质" sortable="custom" />
        <el-table-column align="right" label="操作" width="155" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(267)" type="info" size="mini" plain icon="el-icon-document" @click="detail(scope.row.id,scope.row.sid)">详情</el-button>
            <el-dropdown v-if="authCheck(268) || authCheck(269)" class="margin-left-10" trigger="click" @command="handleCommand">
              <el-button type="info" size="mini" plain>
                更多
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="authCheck(268)" :command="{type:'edit',ID:scope.row.id,SID:scope.row.sid}">
                  <span class="text-primary">编辑</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="authCheck(269)" :command="{type:'delete',ID:scope.row.id}">
                  <span class="text-danger">删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import { cxnlzpList, cxnlzpDel } from "@/api/ynzp/nlzp/cxnlzp";
import { publicMixin } from "@/api/mixins";
const xqData = [{ id: 1, value: '第一学期' }, { id: 2, value: '第二学期' }]

export default {
  name: "cxnlzp",
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
        xq: null
      },
      xqData,
      info: {}
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
    //添加
    add() {
      this.$router.push({
        name: 'cxnlzpEdit'
      })
    },
    //详情
    detail(id, sid) {
      this.$router.push({
        name: 'cxnlzpDetail',
        query: { id: id, sid: sid }
      })
    },
    //更多
    handleCommand(row) {
      switch (row.type) {
        case "edit":
          this.$router.push({
            name: 'cxnlzpEdit',
            query: { id: row.ID, sid: row.SID }
          })
          break;
        case "delete":
          this.deleteData(row.ID);
          break;
      }
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
          cxnlzpDel({ id: id })
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
      cxnlzpList(this.listQuery)
        .then(rs => {
          this.listLoading = false;
          this.dataList = rs.data || [];
          this.total = rs.count || 0;
          this.info = rs.info || {}
        })
        .catch(() => {
          this.listLoading = false;
        });
    }
  }
};
</script>
