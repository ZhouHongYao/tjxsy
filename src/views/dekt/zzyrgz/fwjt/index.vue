<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" style="width: 280px;" class="filter-item" placeholder="检索：学生姓名、学号" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <Download v-if="authCheck(301)" v-model="listQuery" :model="$route.name"/>
      </div>
      <el-table v-loading="listLoading" :data="dataList" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort">
        <el-table-column align="center" type="index" width="45" fixed="left" />
        <el-table-column min-width="110" prop="name" label="学生姓名" sortable="custom" fixed="left" />
        <el-table-column min-width="110" prop="account" label="学号" sortable="custom" />
        <el-table-column min-width="110" prop="sex" label="性别" sortable="custom">
          <template slot-scope="d">
            {{ d.row.sex ? d.row.sex==1 ? '男' : '女' : '--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="110" prop="szbj" label="所在班级" sortable="custom" />
        <el-table-column min-width="200" prop="content" label="服务集体" show-overflow-tooltip />
        <el-table-column align="right" label="操作" width="80" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(152) && scope.row.id" type="info" size="mini" plain icon="el-icon-document" @click="detail(scope.row.id,scope.row.sid)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import { fwjtList } from "@/api/dekt/zzyrgz/fwjt";

export default {
  name: "fwjt",
  directives: { waves },
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
      }
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
    //详情
    detail(id, sid) {
      this.$router.push({
        name: 'fwjtDetail',
        query: { id: id, sid: sid }
      })
    },
    //获取数据
    getData() {
      this.listLoading = true;
      fwjtList(this.listQuery)
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
