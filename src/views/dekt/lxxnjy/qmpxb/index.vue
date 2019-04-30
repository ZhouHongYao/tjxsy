<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" style="width: 200px;" class="filter-item" placeholder="检索：姓名、学号" @keyup.enter.native="handleFilter" />
        <el-select v-if="groupData && groupData.length>0" v-model="listQuery.group_id" placeholder="检索：分组" style="width: 180px;" class="filter-item" clearable>
          <el-option v-for="item in groupData" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <ImportData v-if="authCheck(101)" :model="$route.name" import_text="导入分组" />
        <Download v-if="authCheck(301)" v-model="listQuery" :model="$route.name"/>
        <el-button v-waves v-if="multipleSelection.length >0 && authCheck(237)" class="filter-item" type="danger" icon="el-icon-delete" @click="batchDel()">批量删除</el-button>
      </div>
      <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="45" fixed="left" />
        <el-table-column min-width="110" prop="name" label="姓名" show-overflow-tooltip sortable="custom" fixed="left" />
        <el-table-column min-width="110" prop="account" label="学号" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="110" prop="group_id" label="培训组号" show-overflow-tooltip />
        <el-table-column min-width="110" prop="is_zz" label="是否组长" sortable="custom">
          <template slot-scope="d">
            {{ d.row.is_zz && d.row.is_zz == 2 ? '组长' : '--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="110" prop="szbj" label="所在班级" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="110" prop="phone" label="联系电话" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="170" prop="tjrd_time" label="提交入党申请书时间" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="130" prop="jykhcj" label="结业考核成绩" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="130" prop="xsbxcj" label="现实表现成绩" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="110" prop="khjg" label="考核结果" show-overflow-tooltip sortable="custom">
          <template slot-scope="d">
            <span :class="d.row.khjg ? d.row.khjg==2 ? 'text-success' :'text-danger' :'' ">{{ d.row.khjg ? d.row.khjg==2 ? '通过' : '不通过' : '--' }} </span>
          </template>
        </el-table-column>
        <el-table-column align="right" label="操作" width="180" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-waves type="info" size="mini" plain icon="el-icon-document" @click="detail(scope.row.sid)">培训信息</el-button>
            <el-dropdown v-if="authCheck(124) || authCheck(237) " class="margin-left-10" trigger="click" @command="handleCommand">
              <el-button type="info" size="mini" plain>
                更多
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="authCheck(124)" :command="{type:'review',ID:scope.row.id}">
                  <span class="text-warning">考核</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="authCheck(237)" :command="{type:'edit',ID:scope.row.id}">
                  <span class="text-danger">删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
    <Assess :dialog-assess="dialogAssess" :assid="assid" @CB-assess="CB_assess" />
    <Detail :dialog-detail="dialogDetail" :sid="sid" @CB-detail="CB_detail" />

  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import { qmpxbList, qmpxbDel } from "@/api/dekt/lxxnjy/qmpxb";
import Assess from "./assess";
import Detail from "./detail";

export default {
  name: "cxhd",
  components: { Assess, Detail },
  directives: { waves },
  data() {
    return {
      //table 参数
      listLoading: false,
      total: 0,
      dataList: [],
      groupData: [],
      // 检索参数
      listQuery: {
        listRows: this.$store.state.pageSize,
        page: 1,
        keys: "",
        _sort: "desc",
        _order: "id",
        group_id: ""
      },
      multipleSelection: [],
      //组长Dialog
      dialogState: false,
      zid: null,
      //考核
      dialogAssess: false,
      assid: null,
      //培训详情
      dialogDetail: false,
      sid: null
    };
  },
  computed: {
    clientHeight() {
      return this.$store.state.clientHeight;
    }
  },
  activated() {
    this.listQuery.listRows = this.$store.state.pageSize;
    this.listQuery.group_id = this.$route.query.id
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
          qmpxbDel({ id: id })
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
    //详情
    detail(id) {
      this.sid = id
      this.dialogDetail = true
    },
    CB_detail(val) {
      if (val) {
        this.getData()
      }
      this.sid = null
      this.dialogDetail = false
    },
    //更多
    handleCommand(row) {
      switch (row.type) {
        case "review":
          this.assid = row.ID
          this.dialogAssess = true
          break;
        case "delete":
          this.deleteData(row.ID);
          break;
      }
    },
    //考核
    kaohe(id) {

    },
    CB_assess(val) {
      if (val == 1) {
        this.getData()
      }
      this.assid = null
      this.dialogAssess = false
    },
    //获取数据
    getData() {
      this.listLoading = true;
      qmpxbList(this.listQuery)
        .then(rs => {
          this.listLoading = false;
          this.dataList = rs.data || [];
          this.total = rs.count || 0;
          this.groupData = rs.info.group || [];
        })
        .catch(() => {
          this.listLoading = false;
        });
    }
  }
};
</script>
