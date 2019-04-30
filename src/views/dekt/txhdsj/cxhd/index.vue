<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" style="width: 280px;" class="filter-item" placeholder="检索：活动名称、学生姓名、学号" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <Download v-if="authCheck(301)" v-model="listQuery" :model="$route.name"/>
      </div>
      <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort">
        <el-table-column align="center" type="index" width="45" fixed="left" />
        <el-table-column min-width="160" prop="title" label="活动名称" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="160" prop="bmjz_time" label="活动截止报名时间" />
        <el-table-column min-width="270" prop="times" label="活动时间" show-overflow-tooltip sortable="custom">
          <template slot-scope="d">
            <span v-if="d.row.times && d.row.times[0]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
            <span v-else>'--'</span>
          </template>
        </el-table-column>
        <el-table-column min-width="140" prop="num" label="活动人数" sortable="custom">
          <template slot-scope="d">
            {{ d.row.bmrs || 0 }} / {{ d.row.num || '--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="150" prop="address" label="活动地点" show-overflow-tooltip sortable="custom" />
        <el-table-column align="right" label="操作" width="110" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" plain icon="el-icon-document" @click="list(scope.row.id ,scope.row.title )">活动信息</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import { cxhdList } from "@/api/dekt/txhdsj/cxhd";
import { publicMixin } from "@/api/mixins";

export default {
  name: "cxhd",
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
		this.listQuery.type = this.$route.meta.type;
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
    //反馈列表
    list(id, title) {
      this.$router.push({
        name: 'stuhdList',
        query: { id: id, title: title }
      })
    },
    //获取数据
    getData() {
      this.listLoading = true;
      cxhdList(this.$route.name, this.listQuery)
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
