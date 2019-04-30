<template>
  <div>
    <div v-loading="listLoading" class="app-container" element-loading-text="数据载入中">
      <h4 v-if="!currentRole()">{{ $route.query.title || '' }}</h4>
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" style="width: 200px;" class="filter-item" placeholder="检索：学生姓名、学号" @keyup.enter.native="handleFilter" />
        <el-select v-model="listQuery.qd" clearable placeholder="检索：签到状态" style="width: 150px;" class="filter-item">
          <el-option v-for="item in qdData" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <TxSelete v-model="listQuery" />
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <ImportData v-if="authCheck(231)" :model="$route.name" :hid="$route.query.id" import_text="导入签到" />
      </div>
      <el-table :data="dataList" :max-height="clientHeight" highlight-current-row fit stripe @sort-change="handleSort">
        <el-table-column align="center" type="index" width="45" />
        <el-table-column min-width="110" prop="name" label="学生姓名" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="100" prop="account" label="学号" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="110" prop="cyjs" label="参与角色" show-overflow-tooltip sortable="custom">
          <template slot-scope="d">
            {{ d.row.cyjs ? d.row.cyjs==1 ? '组织者' : '参与者' : '--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="110" prop="qd_time" label="签到状态" show-overflow-tooltip sortable="custom">
          <template slot-scope="d">
            <span :class=" d.row.qd_time? 'text-success' : 'text-muted'">
              {{ d.row.qd_time ? '已签到' : '未签到' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column min-width="200" prop="cyqk" label="具体参与情况" show-overflow-tooltip />
        <el-table-column min-width="200" prop="shgw" label="收获与感悟" show-overflow-tooltip />
        <el-table-column min-width="200" prop="hdfk" label="活动反馈" show-overflow-tooltip />
        <el-table-column min-width="200" prop="smj" label="证明材料" show-overflow-tooltip>
          <template slot-scope="d">
            <a v-if="d.row.file && d.row.file.url" :href="d.row.file.url" class="text-primary" target="_blank">
              <i class="el-icon-document" />
              证明材料
            </a>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column align="right" label="操作" width="160" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(108)" type="primary" size="mini" plain icon="el-icon-document" @click="detail(scope.row.id)">详情</el-button>
            <el-button v-if="authCheck(229)" type="danger" size="mini" plain icon="el-icon-document" @click="deleteData(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
    <!-- 详情-->
    <Detail :dialog-status="dialogStatus" :hd-id="hdId" @CB-detail="CB_detail" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import { hdbmList, hdbmDel } from "@/api/dekt/txhdsj/cxhd";
import { publicMixin } from "@/api/mixins";
import Detail from "./detail";

const qdData = [{
  value: '1',
  label: '已签到'
}, {
  value: '2',
  label: '未签到'
}]

export default {
  name: "stuhdList",
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
        _order: "id",
        hid: "",
        tx: ""
      },
      qdData,
      //详情
      hdId: null,
      dialogStatus: false
    };
  },
  computed: {
    clientHeight() {
      return this.$store.state.clientHeight;
    }
  },
  activated() {
    this.listQuery.listRows = this.$store.state.pageSize;
    this.listQuery.hid = this.$route.query.id
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
    detail(id) {
      this.hdId = id;
      this.dialogStatus = true;
    },
    CB_detail() {
      this.hdId = null;
      this.dialogStatus = false;
    },
    //获取数据
    getData() {
      this.listLoading = true;
      hdbmList(this.listQuery)
        .then(rs => {
          this.listLoading = false;
          this.dataList = rs.data;
          this.total = rs.count;
        })
        .catch(() => {
          this.listLoading = false;
        });
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
          hdbmDel({ id: id })
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
    }
  }
};
</script>
