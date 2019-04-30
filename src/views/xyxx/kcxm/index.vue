<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" :style="currentRole() ? 'width: 200px' : 'width: 280px'" :placeholder="currentRole() ? '检索：项目名称' : '检索：学生姓名、学号、项目名称'" class="filter-item" @keyup.enter.native="handleFilter" />
        <ReviewSelete v-model="listQuery" />
        <el-select v-model="listQuery.hjdj" placeholder="检索：获奖等级" class="filter-item" style="width:180px" clearable>
          <el-option v-for="item in hjdjData" :key="item.id" :label="item.title" :value="item.id" />
        </el-select>
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves v-if="authCheck(179)" class="filter-item margin-right-10" type="primary" icon="el-icon-circle-plus-outline" @click="add()">添加</el-button>
        <Download v-if="authCheck(301)" v-model="listQuery" :model="$route.name"/>
        <el-button v-waves v-if="multipleSelection.length>0 && authCheck(183) " class="filter-item margin-right-10" type="warning" @click="batchReview()">
          <svg-icon icon-class="shield" class="margin-right-5" />批量审核
        </el-button>
        <el-button v-waves v-if="multipleSelection.length >0 && authCheck(182)" class="filter-item" type="danger" icon="el-icon-delete" @click="batchDel()">批量删除</el-button>

      </div>
      <el-table v-loading="listLoading" :data="dataList" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort" @selection-change="handleSelectionChange">
        <el-table-column :selectable="checkboxInit" align="center" type="selection" width="45" fixed="left" />
        <el-table-column min-width="110" prop="status" label="审核状态" sortable="custom" fixed="left">
          <template slot-scope="d">
            <span :class="d.row.status|logStatus|logColor">{{ d.row.status|logStatus|logTitle }}
            </span>
            <el-tooltip v-if="d.row.status==3 && d.row.shenhe" :content="d.row.shenhe" placement="right" effect="light">
              <i class="el-icon-question text-primary pointer" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="项目名称" min-width="150" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="type" label="项目类别" min-width="120" sortable="custom" show-overflow-tooltip>
          <template slot-scope="d">
            {{ d.row.type_title || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="hjdj" label="获奖等级" min-width="120" sortable="custom" show-overflow-tooltip>
          <template slot-scope="d">
            {{ d.row.hjdj_title || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="xmjs" label="项目介绍" min-width="200" show-overflow-tooltip />
        <el-table-column prop="zdjs" label="指导老师" min-width="120" show-overflow-tooltip />
        <el-table-column prop="member" label="项目成员" min-width="220" show-overflow-tooltip />
        <el-table-column prop="lx_time" label="立项年月" width="120" sortable="custom" />
        <el-table-column prop="sjbg_file" label="实践报告" width="120">
          <template slot-scope="d">
            <a v-if="d.row.sjbg_file && d.row.sjbg_file.url" :href="d.row.sjbg_file.url" class="text-primary" target="_blank">
              <i class="el-icon-document" />
              实践报告
            </a>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="hjzs_file" label="获奖证书" width="120">
          <template slot-scope="d">
            <a v-if="d.row.hjzs_file && d.row.hjzs_file.url" :href="d.row.hjzs_file.url" class="text-primary" target="_blank">
              <i class="el-icon-document" />
              获奖证书
            </a>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column width="160" align="right" label="操作" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(180)" type="info" size="mini" plain icon="el-icon-document" @click="detail(scope.row.id)">详情</el-button>
            <el-dropdown v-if="authCheck(183) || (authCheck(181)&& checkboxInit(scope.row)) || (authCheck(182) && checkboxInit(scope.row))" class="margin-left-10" trigger="click" @command="handleCommand">
              <el-button type="info" size="mini" plain>
                更多
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="authCheck(183)" :command="{type:'review',ID:scope.row.id}">
                  <span class="text-warning">审核</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="authCheck(181) && checkboxInit(scope.row)" :command="{type:'edit',ID:scope.row.id}">
                  <span class="text-primary">编辑</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="authCheck(182) && checkboxInit(scope.row)" :command="{type:'delete',ID:scope.row.id}">
                  <span class="text-danger">删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
    <NewEdit :dialog-state="dialogState" :xmid="xmid" :type="type" @CB-dialogState="CB_dialogState" />
    <Detail :dialog-status="dialogStatus" :xmid="xmid" @CB-dialogDetail="CB_dialogDetail" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import waves from "@/directive/waves"; // 水波纹指令
import { kcxmList, kcxmDel, kcxmSh } from "@/api/xyxx/kcxm";
import ReviewSelete from "@/components/ReviewSelete";
import Detail from "./detail";
import NewEdit from "./newEdit";
import { publicMixin } from "@/api/mixins";

export default {
  name: "kcxm",
  components: { ReviewSelete, NewEdit, Detail },
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
        status: null,
        hjdj: null
      },
      multipleSelection: [],
      //新增、编辑Dialog
      dialogState: false,
      xmid: null,
      type: "",
      uid: "",
      //详情
      dialogStatus: false
    };
  },
  computed: mapState({
    hjdjData: state => state.hjdjData
  }),
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
    //复选框禁用
    checkboxInit(row, index) {
      if (this.currentRole()) {
        if (row.sid == this.uid) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    //添加
    add() {
      this.dialogState = true;
    },
    //更多
    handleCommand(row) {
      switch (row.type) {
        case "review":
          this.dialogState = true;
          this.type = "review";
          this.xmid = row.ID;
          break;
        case "edit":
          this.dialogState = true;
          this.xmid = row.ID;
          break;
        case "delete":
          this.deleteData(row.ID);
          break;
      }
    },
    // dialog 回调
    CB_dialogState(val) {
      if (val == 1) {
        this.getData();
      }
      this.dialogState = false;
      this.xmid = null;
      this.type = "";
    },
    //详情
    detail(id) {
      this.dialogStatus = true;
      this.xmid = id;
    },
    CB_dialogDetail() {
      this.dialogStatus = false;
      this.xmid = null;
    },
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //批量删除
    batchDel() {
      if (this.multipleSelection.length === 0) {
        return this.$message({
          type: "warning",
          message: "请选择需要删除的内容"
        });
      }
      this.deleteData(
        this.multipleSelection.map(item => {
          return item.id;
        })
      );
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
          kcxmDel({ id: id })
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
    //审核
    batchReview() {
      this.$confirm("确定全部审核通过吗?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {
          this.listLoading = true;
          kcxmSh({
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
    //获取数据
    getData() {
      this.listLoading = true;
      kcxmList(this.listQuery)
        .then(rs => {
          this.listLoading = false;
          this.dataList = rs.data || [];
          this.total = rs.count || 0;
          this.uid = rs.info ? rs.info.uid : ''
        })
        .catch(() => {
          this.listLoading = false;
        });
    }
  }
};
</script>

