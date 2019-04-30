<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" style="width: 320px;" class="filter-item" placeholder="检索：学生姓名、学号、主题、关键词" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </div>
      <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort">
        <el-table-column align="center" type="index" width="45" fixed="left" />
        <el-table-column min-width="120" prop="name" label="学生姓名" sortable="custom" show-overflow-tooltip fixed="left"/>
        <el-table-column min-width="110" prop="account" label="学号" sortable="custom" />
        <el-table-column min-width="200" prop="title" label="主题" show-overflow-tooltip />
        <el-table-column min-width="140" prop="gjc_title" label="关键词" show-overflow-tooltip />
        <el-table-column align="right" label="操作" width="80" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(54)" type="info" size="mini" plain icon="el-icon-document" @click="detail(scope.row.id,scope.row.sid)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import { zynhList } from "@/api/grxx/zynh";

export default {
  name: "zynh",
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
    //详情
    detail(id, sid) {
      this.$router.push({
        name: 'zynhDetail',
        query: { id: id, sid: sid }
      })
    },
    //编辑
    edit(id) {
      this.$router.push({
        name: 'zynhEdit',
        query: { id: id }
      })
    },
    //获取数据
    getData() {
      this.listLoading = true;
      zynhList(this.listQuery)
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

