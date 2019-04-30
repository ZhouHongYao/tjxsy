<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" :placeholder="!currentRole()? '检索：学生姓名、学号、教室名称' : '检索：教室名称'" :style="!currentRole() ? 'width: 280px' :'width: 200px'" class="filter-item" @keyup.enter.native="handleFilter" />
        <ReviewSelete v-model="listQuery" />
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves v-if="authCheck(279)" class="filter-item margin-right-10" type="primary" icon="el-icon-circle-plus-outline" @click="add()">添加</el-button>
        <Download v-if="authCheck(301)" v-model="listQuery" :model="$route.name"/>
        <el-button v-waves v-if="multipleSelection.length >0 && authCheck(282)" class="filter-item" type="danger" icon="el-icon-delete" @click="batchDel()">批量删除</el-button>
      </div>
      <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="45" fixed="left" />
        <el-table-column min-width="110" prop="status" label="审核状态" sortable="custom" fixed="left">
          <template slot-scope="d">
            <span :class="d.row.status|logStatus|logColor">{{ d.row.status|logStatus|logTitle }}
            </span>
            <el-tooltip v-if="d.row.status!=1 && d.row.shenhe" :content="d.row.shenhe" placement="right" effect="light">
              <i class="el-icon-question text-primary pointer" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="!currentRole()" min-width="110" prop="name" label="学生姓名" sortable="custom" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="account" label="学号" sortable="custom" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="sex" label="性别" sortable="custom">
          <template slot-scope="d">
            {{ d.row.sex ? d.row.sex==1 ? '男' : '女' : '--' }}
          </template>
        </el-table-column>
        <el-table-column v-if="!currentRole()" min-width="110" prop="szbj" label="所在班级" sortable="custom" />
        <el-table-column min-width="160" prop="title" label="教室名称" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="140" prop="address" label="教室地点" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="200" prop="times" label="申请时段" show-overflow-tooltip sortable="custom">
          <template slot-scope="d">
            {{ d.row.time }} {{ d.row.times[0] }} ~ {{ d.row.times[1] }}
          </template>
        </el-table-column>
        <el-table-column min-width="200" prop="yt" label="用途" show-overflow-tooltip sortable="custom" />
        <el-table-column align="right" label="操作" width="160" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(280)" type="info" size="mini" plain icon="el-icon-document" @click="detail(scope.row.id)">详情</el-button>
            <el-dropdown v-if="authCheck(283) || authCheck(281) || authCheck(282)" class="margin-left-10" trigger="click" @command="handleCommand">
              <el-button type="info" size="mini" plain>
                更多
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="authCheck(283)" :command="{type:'review',ID:scope.row.id}">
                  <span class="text-warning">审核</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="authCheck(281)" :command="{type:'edit',ID:scope.row.id}">
                  <span class="text-primary">编辑</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="authCheck(282)" :command="{type:'delete',ID:scope.row.id}">
                  <span class="text-danger">删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
    <NewEdit :dialog-state="dialogState" :jid="jid" :type="type" @CB-jssq="CB_jssq" />
    <!-- 详情-->
    <Detail :dialog-status="dialogStatus" :jid="jid" @CB-dialogDetail="CB_dialogDetail" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import Detail from "./detail";
import NewEdit from "./newEdit";
import { jssqList, jssqDel } from "@/api/rcgl/jssq";
import ReviewSelete from "@/components/ReviewSelete";
import { publicMixin } from "@/api/mixins";

export default {
  name: "jssq",
  directives: { waves },
  components: { NewEdit, Detail, ReviewSelete },
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
      multipleSelection: [],
      //新增、编辑Dialog
      dialogState: false,
      jid: null,
      type: "",
      //详情
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
      this.dialogState = true;
      this.type = ""
    },
    //更多
    handleCommand(row) {
      switch (row.type) {
        case "review":
          this.edit(row.ID, "review");
          break;
        case "edit":
          this.edit(row.ID, "edit");
          break;
        case "delete":
          this.deleteData(row.ID);
          break;
      }
    },
    //编辑
    edit(id, type) {
      this.dialogState = true;
      this.jid = id;
      this.type = type
    },
    // dialog 回调
    CB_jssq(val) {
      if (val === 1) {
        this.getData();
      }
      this.dialogState = false;
      this.jid = null;
      this.type = ""
    },
    //详情
    detail(id) {
      this.dialogStatus = true;
      this.jid = id;
    },
    CB_dialogDetail() {
      this.dialogStatus = false;
      this.jid = null;
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
          jssqDel({ id: id })
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
      jssqList(this.listQuery)
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
