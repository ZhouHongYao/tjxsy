<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" style="width: 200px;" class="filter-item" placeholder="检索：学生姓名、学号" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </div>
      <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort">
        <el-table-column align="center" type="index" width="45" fixed="left" />
        <el-table-column min-width="120" prop="name" label="学生姓名" sortable="custom" show-overflow-tooltip fixed="left"/>
        <el-table-column min-width="110" prop="account" label="学号" sortable="custom" />
        <el-table-column min-width="110" prop="brnl" label="包容能力" sortable="custom" />
        <el-table-column min-width="110" prop="yynl" label="语言能力" sortable="custom" />
        <el-table-column min-width="150" prop="kwhssnl" label="跨文化实施能力" sortable="custom" />
        <el-table-column align="right" label="操作" width="155" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(51) && scope.row.id" type="info" size="mini" plain icon="el-icon-document" @click="detail(scope.row.id,scope.row.sid)">详情</el-button>
            <el-button v-if="authCheck(52) && scope.row.id" type="primary" size="mini" plain icon="el-icon-edit" @click="edit(scope.row.id,scope.row.sid)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import { kwhnlList } from "@/api/grxx/nlcp/kwhnl";

export default {
  name: "kwhnl",
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
        name: 'kwhnlDetail',
        query: {
          id: id,
          sid: sid
        }
      })
    },
    //编辑
    edit(id, sid) {
      this.$router.push({
        name: 'kwhnlEdit',
        query: {
          id: id,
          sid: sid
        }
      })
    },
    //获取数据
    getData() {
      this.listLoading = true;
      kwhnlList(this.listQuery)
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
