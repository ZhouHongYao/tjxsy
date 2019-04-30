<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" :placeholder="'检索：'+ mc +'名称、学生姓名、学号'" style="width: 280px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <Download v-if="authCheck(301)" v-model="listQuery" :model="$route.name"/>
      </div>
      <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort">
        <el-table-column align="center" type="index" width="45" />
        <el-table-column :label="mc+'名称'" min-width="160" prop="title" show-overflow-tooltip sortable="custom" />
        <el-table-column :label="mc+'截止报名时间'" min-width="160" prop="bmjz_time" />
        <el-table-column :label="mc+'时间'" min-width="270" prop="times" show-overflow-tooltip sortable="custom">
          <template slot-scope="d">
            <span v-if="d.row.times && d.row.times[0]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
            <span v-else>'--'</span>
          </template>
        </el-table-column>
        <el-table-column :label="mc+'人数'" min-width="140" prop="num" sortable="custom">
          <template slot-scope="d">
            {{ d.row.bmrs || 0 }} / {{ d.row.num || '--' }}
          </template>
        </el-table-column>
        <el-table-column :label="mc+'地点'" min-width="150" prop="address" show-overflow-tooltip sortable="custom" />
        <el-table-column align="right" label="操作" width="110" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" plain icon="el-icon-document" @click="list(scope.row.id ,scope.row.title )">{{ mc }}信息</el-button>
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
  name: "lxxnjz",
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
      },
      mc: '讲座'
    };
  },
  computed: {
    clientHeight() {
      return this.$store.state.clientHeight;
    }
  },
  activated() {
    this.listQuery.listRows = this.$store.state.pageSize;
		this.mc = this.$route.meta.mc || '讲座'
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
        query: { id: id, title: title, mc: this.mc }
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
