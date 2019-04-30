<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" :placeholder="currentRole() ? '检索：工作总结' : '检索：学生姓名、学号'" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-select v-model="listQuery.xq" placeholder="检索：学期" class="filter-item" style="width: 150px;" clearable>
          <el-option v-for="item in xqData" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves v-if="authCheck(89)" class="filter-item margin-right-10" type="primary" icon="el-icon-circle-plus-outline" @click="add">添加</el-button>
        <ImportData v-if="authCheck(93)" :model="$route.name" import_text="导入班主任评语" />
        <Download v-if="authCheck(301)" v-model="listQuery" :model="$route.name"/>
        <el-button v-waves v-if="multipleSelection.length >0 && authCheck(92)" class="filter-item" type="danger" icon="el-icon-delete" @click="batchDel()">批量删除</el-button>
      </div>
      <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="45" fixed="left" />
        <el-table-column min-width="110" prop="xq" label="学期" sortable="custom">
          <template slot-scope="d">
            {{ d.row.xq ? d.row.xq == 1 ? '第一学期' : '第二学期' : '--' }}
          </template>
        </el-table-column>
        <el-table-column v-if="!currentRole()" min-width="110" prop="name" label="学生姓名" show-overflow-tooltip sortable="custom" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="account" label="学号" sortable="custom" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="phone" label="联系电话" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="szbj" label="所在班级" sortable="custom" />
        <el-table-column min-width="110" prop="bjzw" label="班级职务" show-overflow-tooltip />
        <el-table-column min-width="200" prop="gzzj" label="工作总结" show-overflow-tooltip/>
        <el-table-column min-width="200" prop="bzrpy" label="班主任评语" show-overflow-tooltip/>
        <el-table-column align="right" label="操作" width="160" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(91)" type="primary" size="mini" plain icon="el-icon-edit" @click="edit(scope.row.id)">编辑</el-button>
            <el-button v-if="authCheck(92)" type="danger" size="mini" plain icon="el-icon-delete" @click="deleteData(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
    <NewEdit :dialog-state="dialogState" :gzzj-id="gzzjId" @CB-gzzj="CB_gzzj" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import waves from "@/directive/waves"; // 水波纹指令
import NewEdit from "./newEdit";
import { gzzjList, gzzjDel } from "@/api/dekt/bjxsgz/gzzj";
import { publicMixin } from "@/api/mixins";

const xqData = [{ id: 1, value: '第一学期' }, { id: 2, value: '第二学期' }]

export default {
  name: "gzzj",
  components: { NewEdit },
	directives: { waves },
  mixins: [publicMixin],
  data() {
    return {
      //table 参数
      listLoading: false,
      total: 0,
      dataList: [],
      xqData,
      // 检索参数
      listQuery: {
        listRows: this.$store.state.pageSize,
        page: 1,
        keys: "",
        _sort: "desc",
        _order: "id",
        xq: ""
      },
      multipleSelection: [],
      //新增、编辑Dialog
      dialogState: false,
      gzzjId: null
    };
  },
  computed: {
    ...mapState({
      clientHeight: state => (state.clientHeight + 200) * 0.7 - 170
    })
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
    detail(id) {
      this.$router.push({
        name: 'gzzjDetail',
        query: { id: id }
      })
    },
    //添加
    add() {
      this.dialogState = true;
    },
    //编辑
    edit(id) {
      this.dialogState = true;
      this.gzzjId = id;
    },
    CB_gzzj(val) {
      if (val === 1) {
        this.getData();
      }
      this.dialogState = false;
      this.gzzjId = null;
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
          gzzjDel({ id: id })
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
      gzzjList(this.listQuery)
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

