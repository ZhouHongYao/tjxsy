<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" :placeholder="currentRole() ? '检索：资助名称' : '检索：学生姓名、学号、资助名称'" :style="currentRole() ? 'width: 200px;' : 'width: 280px;'" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves v-if="authCheck(129)" class="filter-item margin-right-10" type="primary" icon="el-icon-circle-plus-outline" @click="add()">添加</el-button>
        <ImportData v-if="authCheck(141)" :model="$route.name" />
        <Download v-if="authCheck(301)" v-model="listQuery" :model="$route.name"/>
        <el-button v-waves v-if="multipleSelection.length >0 && authCheck(144)" class="filter-item" type="danger" icon="el-icon-delete" @click="batchDel()">批量删除</el-button>
      </div>
      <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort" @selection-change="handleSelectionChange">
        <el-table-column :type="currentRole() ? 'index' : 'selection'" align="center" width="45" fixed="left" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="name" label="学生姓名" sortable="custom" fixed="left" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="account" label="学号" sortable="custom" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="sex" label="性别" sortable="custom">
          <template slot-scope="d">
            {{ d.row.sex ? d.row.sex==1 ? '男' : '女' : '--' }}
          </template>
        </el-table-column>
        <el-table-column v-if="!currentRole()" min-width="110" prop="szbj" label="所在班级" sortable="custom" />
        <el-table-column min-width="130" prop="zzmc" label="资助名称" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="200" prop="zzdw" label="资助单位" show-overflow-tooltip />
        <el-table-column min-width="120" prop="zzje" label="资助金额（元）" show-overflow-tooltip />
        <el-table-column min-width="130" prop="type" label="校内/校外" show-overflow-tooltip sortable="custom">
          <template slot-scope="d">
            {{ d.row.type ? d.row.type==2 ? '校内' : '校外' :'--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="150" prop="beizhu" label="备注" show-overflow-tooltip />
        <el-table-column v-if="authCheck(143) || authCheck(144)" align="right" label="操作" width="160" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(143)" type="primary" size="mini" plain icon="el-icon-edit" @click="edit(scope.row.id)">编辑</el-button>
            <el-button v-if="authCheck(144)" type="danger" size="mini" plain icon="el-icon-delete" @click="deleteData(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
    <NewEdit :dialog-state="dialogState" :jzid="jzid" @CB-jz="CB_jz" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import { jszzList, jszzDel } from "@/api/dekt/zzyrgz/jszz";
import { publicMixin } from "@/api/mixins";
import NewEdit from "./newEdit";

export default {
  name: "jszz",
  components: { NewEdit },
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
      multipleSelection: [],
      //编辑dialog
      dialogState: false,
      jzid: null
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
      this.jzid = null;
    },
    //编辑
    edit(id) {
      this.dialogState = true;
      this.jzid = id;
    },
    // dialog 回调
    CB_jz(val) {
      if (val === 1) {
        this.getData();
      }
      this.dialogState = false;
      this.jzid = null;
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
          jszzDel({ id: id })
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
      jszzList(this.listQuery)
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
