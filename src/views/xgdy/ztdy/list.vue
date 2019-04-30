<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" style="width: 280px;" class="filter-item" placeholder="检索：调研名称、学生姓名、学号" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves v-if="multipleSelection.length>0 && authCheck(292) " class="filter-item margin-right-10" type="warning" @click="batchReview()">
          <svg-icon icon-class="shield" class="margin-right-5" />批量审核
        </el-button>
      </div>
      <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="45" fixed="left" />
        <el-table-column min-width="110" prop="status" label="审核状态" sortable="custom" fixed="left">
          <template slot-scope="d">
            <span :class="d.row.status|logStatus|logColor">{{ d.row.status|logStatus|logTitle }}
            </span>
            <el-tooltip v-if="d.row.status==3 && d.row.shenhe" :content="d.row.shenhe" placement="right" effect="light">
              <i class="el-icon-question text-primary pointer" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column min-width="110" prop="name" label="学生姓名" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="110" prop="account" label="学号" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="110" prop="sex" label="性别" show-overflow-tooltip sortable="custom">
          <template slot-scope="d">
            {{ d.row.sex ? d.row.sex== 1 ? '男' : '女' : '--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="110" prop="phone" label="联系方式" show-overflow-tooltip />
        <el-table-column min-width="160" prop="title" label="调研名称" show-overflow-tooltip sortable="custom" />
        <el-table-column align="right" label="操作" width="160" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(287)" type="info" size="mini" plain icon="el-icon-document" @click="detail(scope.row.id)">详情</el-button>
            <el-dropdown v-if="authCheck(288) || authCheck(292)" class="margin-left-10" trigger="click" @command="handleCommand">
              <el-button type="info" size="mini" plain>
                更多
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="authCheck(292)" :command="{type:'review',ID:scope.row.id}">
                  <span class="text-warning">审核</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="authCheck(288)" :command="{type:'edit',ID:scope.row.id}">
                  <span class="text-primary">编辑</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
    <Detail :dialog-detail="dialogDetail" :zid="zid" type="edit" @CB-dialogDetail="CB_dialogDetail" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import Detail from "./detail";
import { dybmList, xsdySh } from "@/api/xgdy/ztdy";
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
        _order: "id",
        dyid: ""
      },
      multipleSelection: [],
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
    this.listQuery.dyid = this.$route.query.id
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
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //审核
    batchReview() {
      this.$confirm("确定全部审核通过吗?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {
          this.listLoading = true;
          xsdySh({
            id: this.multipleSelection.map(item => {
              return item.id;
            }),
            status: 2
          })
            .then(rs => {
              this.getData();
            })
            .catch(() => {
              this.listLoading = false;
            });
        })
        .catch(() => { });
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
            name: 'xsdySh',
            query: { id: row.ID, type: 'review' }
          })
          break;
        case "edit":
          this.$router.push({
            name: 'dywjEdit',
            query: { id: row.ID, type: 'edit' }
          })
          break;
      }
    },
    //详情
    detail(id) {
      this.dialogDetail = true
      this.zid = id
    },
    //预览回调
    CB_dialogDetail() {
      this.dialogDetail = false
      this.zid = null
    },
    //获取数据
    getData() {
      this.listLoading = true;
      dybmList(this.listQuery)
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
