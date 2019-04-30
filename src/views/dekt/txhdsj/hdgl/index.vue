<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" style="width: 200px;" class="filter-item" placeholder="检索：活动名称" @keyup.enter.native="handleFilter" />
        <el-select v-model="listQuery.type" placeholder="请选择活动类型" class="filter-item" style="width: 150px;" clearable>
          <el-option v-for="item in typeData" :key="item.id" :label="item.title" :value="item.id" />
        </el-select>
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves v-if="authCheck(101)" class="filter-item margin-right-10" type="primary" icon="el-icon-circle-plus-outline" @click="add()">添加</el-button>
      </div>
      <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="index" width="45" />
        <el-table-column min-width="160" prop="title" label="活动名称" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="110" prop="type" label="活动类型" sortable="custom">
          <template slot-scope="d">
            {{ d.row.type | typeTitle }}
          </template>
        </el-table-column>
        <el-table-column min-width="200" prop="bmjz_time" label="活动截止报名时间" />
        <el-table-column min-width="270" prop="times" label="活动时间" show-overflow-tooltip>
          <template slot-scope="d">
            <span v-if="d.row.times && d.row.times[0]"> {{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column min-width="110" prop="num" label="活动人数" />
        <el-table-column min-width="160" prop="address" label="活动地点" show-overflow-tooltip />
        <el-table-column align="right" label="操作" width="160" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(102)" type="info" size="mini" plain icon="el-icon-document" @click="detail(scope.row.id)">详情</el-button>
            <el-dropdown v-if="authCheck(103) || authCheck(104)" class="margin-left-10" trigger="click" @command="handleCommand">
              <el-button type="info" size="mini" plain>
                更多
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="authCheck(103)" :command="{type:'edit',ID:scope.row.id}">
                  <span class="text-primary">编辑</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="authCheck(104)" :command="{type:'delete',ID:scope.row.id}">
                  <span class="text-danger">删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
    <NewEdit :dialog-state="dialogState" :hd-id="hdId" @CB-hdgl="CB_hdgl" />
    <!-- 详情-->
    <Detail :dialog-status="dialogStatus" :hd-id="hdId" @CB-detail="CB_detail" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import NewEdit from "./newEdit";
import Detail from "./detail";
import { hdglList, hdglDel } from "@/api/dekt/txhdsj/hdgl";

const typeData = [{ id: 1, title: '创新活动' }, { id: 2, title: '校园文化' }, { id: 3, title: '社会实践' }, { id: 4, title: '志愿服务' }]

export default {
  name: "hdgl",
  directives: { waves },
  components: { NewEdit, Detail },
  filters: {
    typeTitle: function(value) {
      if (!value) return '--'
      let item = typeData.find(v => v.id == value)
      return item ? item.title : '--'
    }
  },
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
        type: "",
        _sort: "desc",
        _order: "id"
      },
      typeData,
      multipleSelection: [],
      //新增、编辑Dialog
      dialogState: false,
      hdId: null,
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
    // dialog 回调
    CB_hdgl(val) {
      if (val === 1) {
        this.getData();
      }
      this.dialogState = false;
      this.hdId = null;
    },
    //更多
    handleCommand(row) {
      switch (row.type) {
        case "edit":
          this.dialogState = true;
          this.hdId = row.ID;
          break;
        case "delete":
          this.deleteData(row.ID);
          break;
      }
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
          hdglDel({ id: id })
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
      hdglList(this.listQuery)
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
