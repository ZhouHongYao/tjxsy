<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" style="width: 200px;" class="filter-item" placeholder="检索：学生姓名、学号" @keyup.enter.native="handleFilter" />
        <ReviewSelete v-model="listQuery" />
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves v-if="authCheck(120)" class="filter-item margin-right-10" type="primary" icon="el-icon-circle-plus-outline" @click="add()">添加</el-button>
        <ImportData :model="$route.name" />
        <Download v-if="authCheck(301)" v-model="listQuery" :model="$route.name"/>
        <el-button v-waves v-if="multipleSelection.length>0 && authCheck(118) " class="filter-item margin-right-10" type="warning" @click="batchReview()">
          <svg-icon icon-class="shield" class="margin-right-5" />批量审核
        </el-button>
        <el-button v-waves v-if="multipleSelection.length >0 && authCheck(237)" class="filter-item" type="danger" icon="el-icon-delete" @click="batchDel()">批量删除</el-button>
      </div>
      <el-table v-loading="listLoading" :data="dataList" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="45" fixed="left" />
        <el-table-column min-width="110" prop="status" label="审核状态" sortable="custom" fixed="left">
          <template slot-scope="d">
            <span :class="d.row.status|logStatus|logColor">{{ d.row.status|logStatus|logTitle }}</span>
            <el-tooltip v-if="d.row.status==3 && d.row.shenhe" :content="d.row.shenhe" placement="right" effect="light">
              <i class="el-icon-question text-primary pointer" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column min-width="110" prop="name" label="学生姓名" sortable="custom" show-overflow-tooltip />
        <el-table-column min-width="110" prop="account" label="学号" sortable="custom" />
        <el-table-column min-width="110" prop="sex" label="性别" sortable="custom">
          <template slot-scope="d">
            {{ d.row.sex ? d.row.sex== 1 ? '男' : '女' : '--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="110" prop="szbj" label="所在班级" />
        <el-table-column min-width="180" prop="tjrd_time" label="提交入党申请书时间" show-overflow-tooltip />
        <el-table-column min-width="200" prop="cjpx_time" label="参加入党启蒙培训时间" show-overflow-tooltip>
          <template slot-scope="d">
            <span v-if="d.row.cjpx_time && d.row.cjpx_time[0]">{{ d.row.cjpx_time[0] }} ~ {{ d.row.cjpx_time[1] }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column min-width="180" prop="ty_time" label="推优时间" show-overflow-tooltip />
        <el-table-column min-width="200" prop="rdjj_time" label="确定为入党积极分子时间" show-overflow-tooltip />
        <el-table-column min-width="180" prop="tjsx_time1" label="提交思想汇报时间1" show-overflow-tooltip />
        <el-table-column min-width="180" prop="tjsx_time2" label="提交思想汇报时间2" show-overflow-tooltip />
        <el-table-column min-width="180" prop="tjsx_time3" label="提交思想汇报时间3" show-overflow-tooltip />
        <el-table-column min-width="180" prop="tjsx_time4" label="提交思想汇报时间4" show-overflow-tooltip />
        <el-table-column min-width="140" prop="beizhu" label="备注" show-overflow-tooltip />
        <el-table-column align="right" label="操作" width="160" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(116)" type="info" size="mini" plain icon="el-icon-document" @click="detail(scope.row.id, scope.row.sid)">详情</el-button>
            <el-dropdown v-if="authCheck(117) || authCheck(118) || authCheck(237)" class="margin-left-10" trigger="click" @command="handleCommand">
              <el-button type="info" size="mini" plain>
                更多
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="authCheck(117)" :command="{type:'edit',ID:scope.row.id}">
                  <span class="text-primary">编辑</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="authCheck(118)" :command="{type:'review',ID:scope.row.id}">
                  <span class="text-warning">审核</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="authCheck(237)" :command="{type:'delete',ID:scope.row.id}">
                  <span class="text-danger">删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
    <NewEdit :dialog-state="dialogState" :sqid="sqid" :type="type" @CB-ldxxdj="CB_ldxxdj" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import ReviewSelete from "@/components/ReviewSelete";
import NewEdit from "./newEdit";
import { ldxxdjList, ldxxdjSh, ldxxdjDel } from "@/api/dekt/lxxnjy/ldxxdj";

export default {
  name: "ldxxdj",
  directives: { waves },
  components: { NewEdit, ReviewSelete },
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
        status: null
      },
      multipleSelection: [],
      //添加、编辑Dialog
      dialogState: false,
      sqid: null,
      type: ""
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
        name: 'ldxxdjDetail',
        query: { id: id, sid: sid }
      })
    },
    //新增
    add() {
      this.sqid = null
      this.type = ""
      this.dialogState = true
    },
    //更多
    handleCommand(row) {
      switch (row.type) {
        case "edit":
          this.sqid = row.ID
          this.type = "edit"
          this.dialogState = true
          break;
        case "review":
          this.sqid = row.ID
          this.type = 'review'
          this.dialogState = true
          break;
        case "delete":
          this.deleteData(row.ID);
          break;
      }
    },
    CB_ldxxdj(val) {
      if (val == 1) {
        this.getData()
      }
      this.sqid = null
      this.type = ""
      this.dialogState = false
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
          ldxxdjSh({
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
          ldxxdjDel({ id: id })
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
      ldxxdjList(this.listQuery)
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

