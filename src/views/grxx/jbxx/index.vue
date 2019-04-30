<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" style="width: 220px;" class="filter-item" placeholder="检索：学生姓名、学号" @keyup.enter.native="handleFilter" />
        <ReviewSelete v-model="listQuery" />
        <el-select v-model="listQuery.is_sqrd" placeholder="是否申请入党" style="width: 180px;" class="filter-item" clearable>
          <el-option v-for="item in [{id:2,title:'是'},{id:1,title:'否'}]" :key="item.id" :label="item.title" :value="item.id" />
        </el-select>
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves v-if="authCheck(214)" class="filter-item margin-right-10" type="primary" icon="el-icon-circle-plus-outline" @click="add()">添加</el-button>
        <Download v-if="authCheck(301)" v-model="listQuery" :model="$route.name"/>
        <el-button v-waves v-if="multipleSelection.length>0 && authCheck(59) " class="filter-item margin-right-10" type="warning" @click="batchReview()">
          <svg-icon icon-class="shield" class="margin-right-5" />批量审核
        </el-button>
        <!-- <el-button v-waves v-if="multipleSelection.length >0 && authCheck(215)" class="filter-item" type="danger" icon="el-icon-delete" @click="batchDel()">批量删除</el-button> -->
      </div>
      <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @selection-change="handleSelectionChange" @sort-change="handleSort">
        <el-table-column v-if="authCheck(59)" align="center" type="selection" width="45" fixed="left" />
        <el-table-column min-width="110" prop="status" label="审核状态" sortable="custom" fixed="left">
          <template slot-scope="d">
            <span :class="d.row.status|logStatus|logColor">{{ d.row.status|logStatus|logTitle }}
            </span>
            <el-tooltip v-if="d.row.status==3 && d.row.shenhe" :content="d.row.shenhe" placement="right" effect="light">
              <i class="el-icon-question text-primary pointer" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column min-width="110" prop="name" label="学生姓名" show-overflow-tooltip sortable="custom" fixed="left" />
        <el-table-column min-width="110" prop="account" label="学号" sortable="custom" />
        <el-table-column min-width="90" prop="sex" label="性别" sortable="custom">
          <template slot-scope="d">
            {{ d.row.sex ? d.row.sex== 1 ? '男' : '女' : '--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="110" prop="phone" label="手机号" />
        <el-table-column min-width="110" prop="szbj" label="所在班级" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="110" prop="dsxm" label="导师" show-overflow-tooltip />
        <el-table-column min-width="140" prop="xueyuan" label="所在书院" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="110" prop="zzmm" label="政治面貌" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="120" prop="jiguan" label="生源地" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="90" prop="nation" label="民族" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="130" prop="gzbyxx" label="高中毕业学校" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="130" prop="is_sqrd" label="是否申请入党" show-overflow-tooltip>
          <template slot-scope="d">
            {{ d.row.is_sqrd ? d.row.is_sqrd== 2 ? '是' : '否' : '--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="160" prop="is_rdjjfz" label="是否入党积极分子" show-overflow-tooltip>
          <template slot-scope="d">
            {{ d.row.is_sqrd ? d.row.is_sqrd== 2 ? '是' : '否' : '--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="130" prop="qsdz" label="寝室地址" show-overflow-tooltip />
        <el-table-column min-width="160" prop="jtdz" label="家庭地址" show-overflow-tooltip />
        <el-table-column min-width="160" prop="yb" label="邮编" show-overflow-tooltip />
        <el-table-column min-width="140" prop="hkszd" label="户口所在地" show-overflow-tooltip />
        <el-table-column align="right" label="操作" width="240" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(300)" type="info" size="mini" plain icon="el-icon-document" @click="pool(scope.row.id)">汇总</el-button>
            <el-button v-if="authCheck(35)" type="info" size="mini" plain icon="el-icon-document" @click="detail(scope.row.id)">详情</el-button>
            <el-dropdown v-if="authCheck(36) || authCheck(59) " class="margin-left-10" trigger="click" @command="handleCommand">
              <el-button type="info" size="mini" plain>
                更多
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="authCheck(59)" :command="{type:'review',ID:scope.row.id}">
                  <span class="text-warning">审核</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="authCheck(36)" :command="{type:'edit',ID:scope.row.id}">
                  <span class="text-primary">编辑</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import { jbxxList, jbxxSh, jbxxDel } from "@/api/grxx/jbxx";
import ReviewSelete from "@/components/ReviewSelete";

export default {
  name: "jbxx",
  directives: { waves },
  components: { ReviewSelete },
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
        is_sqrd: null
      },
      multipleSelection: []
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
      this.$router.push({
        name: 'jbxxAdd'
      })
    },
    //详情
    detail(id) {
      this.$router.push({
        name: 'jbxxDetail',
        query: { id: id }
      })
    },
    //汇总信息
    pool(id) {
      this.$router.push({
        name: 'pool',
        query: { id: id }
      })
    },
    //更多
    handleCommand(row) {
      switch (row.type) {
        case "review":
          this.$router.push({
            name: 'jbxxSh',
            query: { id: row.ID, type: 'review' }
          })
          break;
        case "edit":
          this.$router.push({
            name: 'jbxxEdit',
            query: { id: row.ID, type: 'edit' }
          })
          break;
        case "delete":
          this.deleteData(row.ID);
          break;
      }
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
          jbxxSh({
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
          jbxxDel({ id: id })
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
      jbxxList(this.listQuery)
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

