<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" :style="currentRole() ? 'width: 200px' : 'width: 280px'" :placeholder="currentRole() ? '检索：单位名称' :'检索：学生姓名、学号、单位名称'" class="filter-item" @keyup.enter.native="handleFilter" />
        <ReviewSelete v-model="listQuery" />
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves v-if="authCheck(70)" class="filter-item margin-right-10" type="primary" icon="el-icon-circle-plus-outline" @click="add()">添加</el-button>
        <Download v-if="authCheck(301)" v-model="listQuery" :model="$route.name"/>
        <el-button v-waves v-if="multipleSelection.length>0 && authCheck(61) " class="filter-item margin-right-10" type="warning" @click="batchReview()">
          <svg-icon icon-class="shield" class="margin-right-5" />批量审核
        </el-button>
        <el-button v-waves v-if="multipleSelection.length >0 && authCheck(218)" class="filter-item" type="danger" icon="el-icon-delete" @click="batchDel()">批量删除</el-button>
      </div>
      <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @selection-change="handleSelectionChange" @sort-change="handleSort">
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
        <el-table-column v-if="!currentRole()" min-width="110" prop="name" label="学生姓名" sortable="custom" fixed="left" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="account" label="学号" sortable="custom" />
        <el-table-column min-width="200" prop="dw" label="单位" show-overflow-tooltip sortable="custom"/>
        <el-table-column min-width="200" prop="zw" label="职务" show-overflow-tooltip />
        <el-table-column min-width="200" prop="start_time" label="任职时间" show-overflow-tooltip>
          <template slot-scope="d">
            {{ d.row.start_time || '' }} ~ {{ d.row.end_time || '' }}
          </template>
        </el-table-column>
        <el-table-column min-width="200" prop="zmr" label="证明人" show-overflow-tooltip />
        <!-- <el-table-column min-width="300" prop="gzgk" label="特色亮点工作概况" show-overflow-tooltip /> -->
        <el-table-column min-width="120" prop="file" label="证明材料" show-overflow-tooltip>
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
            <el-button v-if="authCheck(58)" type="info" size="mini" plain icon="el-icon-document" @click="detail(scope.row.id)">详情</el-button>
            <el-dropdown v-if="authCheck(61) || authCheck(60) || authCheck(218)" class="margin-left-10" trigger="click" @command="handleCommand">
              <el-button type="info" size="mini" plain>
                更多
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="authCheck(61)" :command="{type:'review',ID:scope.row.id}">
                  <span class="text-warning">审核</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="authCheck(60)" :command="{type:'edit',ID:scope.row.id}">
                  <span class="text-primary">编辑</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="authCheck(218)" :command="{type:'delete',ID:scope.row.id}">
                  <span class="text-danger">删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
    <NewEdit :dialog-state="dialogState" :gbll-id="gbllId" :type="type" @CB-gbll="CB_gbll" />
    <!-- 详情-->
    <Detail :dialog-status="dialogStatus" :gbll-id="gbllId" @CB-dialogDetail="CB_dialogDetail" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import ReviewSelete from "@/components/ReviewSelete";
import NewEdit from "./newEdit";
import Detail from "./detail";
import { xsgbllList, xsgbllSh, xsgbllDel } from "@/api/dekt/xsgbll";
import { publicMixin } from "@/api/mixins";

export default {
  name: "xsgbll",
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
        status: null,
        _order: "id"
      },
      multipleSelection: [],
      //新增、编辑Dialog
      dialogState: false,
      gbllId: null,
      type: null,
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
      this.gbllId = id;
      this.type = type;
    },
    // dialog 回调
    CB_gbll(val) {
      if (val === 1) {
        this.getData();
      }
      this.dialogState = false;
      this.gbllId = null;
      this.type = null;
    },
    //详情
    detail(id) {
      this.gbllId = id;
      this.dialogStatus = true;
    },
    CB_dialogDetail() {
      this.gbllId = null;
      this.dialogStatus = false;
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
          xsgbllSh({
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
          xsgbllDel({ id: id })
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
      xsgbllList(this.listQuery)
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

