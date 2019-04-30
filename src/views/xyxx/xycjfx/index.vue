<template>
  <div>
    <div class="app-container">
      <div v-if="!currentRole()" class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" style="width: 200px;" class="filter-item" placeholder="检索：学生姓名、学号" @keyup.enter.native="handleFilter" />
        <el-select v-if="!currentRole()&&szbjData && szbjData.length>0" v-model="listQuery.szbj" placeholder="检索：班级" style="width: 180px;" class="filter-item" clearable>
          <el-option v-for="item in szbjData" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves v-loading="loading" v-if="authCheck(177)" class="filter-item margin-right-10" type="primary" icon="el-icon-refresh" @click="cjfx">成绩分析</el-button>
        <Download v-if="authCheck(301)" v-model="listQuery" :model="$route.name"/>
      </div>
      <div v-else class="filter-container">
        <h3>成绩排名</h3>
      </div>
      <el-table v-loading="listLoading" :data="dataList" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort">
        <el-table-column type="index" align="center" width="45" fixed="left" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="name" label="学生姓名" show-overflow-tooltip sortable="custom" fixed="left" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="account" label="学号" sortable="custom" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="sex" label="性别" sortable="custom">
          <template slot-scope="d">
            {{ d.row.sex ? d.row.sex==1 ? '男' : '女' : '--' }}
          </template>
        </el-table-column>
        <el-table-column v-if="!currentRole()" min-width="110" prop="szbj" label="所在班级" sortable="custom" />
        <el-table-column min-width="110" prop="zxf" label="总学分" sortable="custom" />
        <el-table-column min-width="110" prop="jd" label="平均绩点" sortable="custom" />
        <el-table-column min-width="120" prop="bjmc" label="班级名次" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="120" prop="njmc" label="年级名次" show-overflow-tooltip sortable="custom" />
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import { xycjfxList, getPm } from "@/api/xyxx/xycjfx";
import { publicMixin } from "@/api/mixins";

export default {
  name: "xycjfx",
  directives: { waves },
  mixins: [publicMixin],
  data() {
    return {
      //table 参数
      listLoading: false,
      loading: false,
      total: 0,
      dataList: [],
      // 检索参数
      listQuery: {
        listRows: this.$store.state.pageSize,
        page: 1,
        keys: "",
        _sort: "desc",
        _order: "id",
        pm: '1',
        szbj: ''
      },
      szbjData: [],
      //编辑dialog
      dialogState: false,
      jzid: null
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
    //成绩分析
    cjfx() {
      this.loading = true;
      getPm(this.listQuery)
        .then(rs => {
          this.$message({
            message: "获取成功！",
            type: "success"
          });
          this.loading = false;
          this.getData()
        })
        .catch(() => {
          this.loading = false;
        });
    },
    //获取数据
    getData() {
      this.listLoading = true;
      xycjfxList(this.listQuery)
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
