<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" style="width: 340px;" class="filter-item" placeholder="检索：课程名称、课程编号、学生姓名、工号" @keyup.enter.native="handleFilter" />
        <ReviewSelete v-model="listQuery" />
        <el-select v-model="listQuery.kcbh" placeholder="检索：课程" class="filter-item" clearable>
          <el-option v-for="item in kcData" :key="item.id" :label="item.title+'（'+item.name+'）'+'（'+item.times+'）'" :value="item.kcbh" />
        </el-select>
        <TxSelete v-model="listQuery" />
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <kczy v-if="authCheck(99)" v-model="listQuery" caption="课程作业下载" />
        <Download v-if="authCheck(301)" v-model="listQuery" :model="$route.name" />
        <el-button v-waves v-if="multipleSelection.length>0 && authCheck(238) " class="filter-item margin-right-10" type="warning" @click="batchReview()">
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
        <el-table-column min-width="110" prop="s_name" label="学生姓名" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="110" prop="s_account" label="学号" sortable="custom" />
        <el-table-column min-width="110" prop="phone" label="联系电话" />
        <el-table-column min-width="110" prop="szbj" label="所在班级" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="110" prop="srzw" label="所任职务" show-overflow-tooltip />
        <el-table-column min-width="160" prop="title" label="课程名称" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="110" prop="kcbh" label="课程编号" sortable="custom" />
        <el-table-column min-width="130" prop="type" label="所属课程类型" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="80" prop="xf" label="学分" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="270" prop="times" label="课程时间" show-overflow-tooltip>
          <template slot-scope="d">
            <span v-if="d.row.times && d.row.times[0]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="110" prop="fz_name" label="负责老师" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="140" prop="pxdx_title" label="培训对象" show-overflow-tooltip />
        <el-table-column min-width="140" prop="zysc" label="作业上传方式" show-overflow-tooltip sortable="custom">
          <template slot-scope="d">
            {{ d.row.zysc ? d.row.zysc == 2 ? '组长' : '个人' : '--' }}
            <el-button v-if="d.row.zysc && d.row.zysc == 2" type="text" icon="el-icon-search" @click="getMembr(d.row.szzb,d.row.tbid)">成员</el-button>
          </template>
        </el-table-column>
        <el-table-column min-width="110" prop="is_zz" label="组长">
          <template slot-scope="d">
            {{ d.row.is_zz ? '是': '--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="250" prop="kcfk" label="课程反馈" show-overflow-tooltip>
          <template slot-scope="d">
            {{ d.row.kcfk || '--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="120" prop="file" label="课程作业" show-overflow-tooltip>
          <template slot-scope="d">
            <a v-if="d.row.file && d.row.file.url" :href="d.row.file.url" class="text-primary" target="_blank">
              <i class="el-icon-document" />
              课程作业
            </a>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column align="right" label="操作" width="160" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(72)" type="info" size="mini" plain icon="el-icon-document" @click="detail(scope.row)">详情</el-button>
            <el-button v-if="authCheck(238)" type="warning" size="mini" plain @click="review(scope.row.id)">
              <svg-icon icon-class="shield" class="margin-right-5" />审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
    <NewEdit :dialog-state="dialogState" :kc-id="kcId" :type="type" @CB-ggpyxx="CB_ggpyxx" />
    <Detail :dialog-detail="dialogDetail" :data="data" @CB-detail="CB_detail" />
    <Member :dialog-member="dialogMember" :szzb="szzb" :tbid="tbid" @CB-member="CB_member" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import { ggpyxxList, kcbm, ggpyxxDel, ggpyxxSh, tbkcinfo } from "@/api/dekt/bjxsgz/ggpyxx";
import { publicMixin } from "@/api/mixins";
import ReviewSelete from "@/components/ReviewSelete";
import NewEdit from "./newEdit";
import Detail from "./detail";
import Member from "./member";
import Kczy from "./component/download";

export default {
  name: "ggpyxx",
  directives: { waves },
  components: { NewEdit, Detail, Member, ReviewSelete, Kczy },
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
				kcbh: "",
				tx: ""
      },
      multipleSelection: [],
      //新增、编辑Dialog
      dialogState: false,
      kcId: null,
      type: '',
      //详情Dialog
      dialogDetail: false,
      data: {},
      //小组成员Dialog
      dialogMember: false,
      szzb: null,
      tbid: null,
      kcData: [] //课程检索
    };
  },
  computed: {
    clientHeight() {
      return this.$store.state.clientHeight;
    }
  },
  activated() {
    this.listQuery.listRows = this.$store.state.pageSize;
    this.listQuery.kcbh = this.$route.query.kcbh || ''
    if (this.$route.query.account) {
      this.listQuery.keys = this.$route.query.account;
    }
    this.getKc()
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
    //详情
    detail(row) {
      this.data = row;
      this.dialogDetail = true;
    },
    CB_detail() {
      this.dialogDetail = false;
      this.data = {};
    },
    //编辑
    edit(id) {
      this.dialogState = true;
      this.type = 'edit'
      this.kcId = id;
    },
    //审核
    review(id) {
      this.dialogState = true;
      this.type = 'review'
      this.kcId = id;
    },
    // dialog 回调
    CB_ggpyxx(val) {
      if (val === 1) {
        this.getData();
      }
      this.dialogState = false;
      this.type = ''
      this.kcId = null;
    },
    //获取成员
    getMembr(szzb, tbid) {
      this.dialogMember = true
      this.szzb = szzb
      this.tbid = tbid
    },
    CB_member() {
      this.dialogMember = false
      this.szzb = null
      this.tbid = null
    },
    //报名
    bm(id, is_bm) {
      let title = is_bm ? "确定要参加该课程吗？" : "确定要取消该课程的报名吗？"
      this.$confirm(title, "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (is_bm) {
            this.listLoading = true;
            kcbm({ tbid: id })
              .then(rs => {
                this.$message({
                  message: "报名成功！",
                  type: "success"
                });
                this.listLoading = false;
                this.getData();
              })
              .catch(() => {
                this.listLoading = false;
              });
          } else {
            this.listLoading = true;
            ggpyxxDel({ id: id })
              .then(rs => {
                this.$message({
                  message: "取消报名成功！",
                  type: "success"
                });
                this.listLoading = false;
                this.getData();
              })
              .catch(() => {
                this.listLoading = false;
              });
          }
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
          ggpyxxSh({
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
    //获取课程信息
    getKc() {
      tbkcinfo()
        .then(rs => {
          this.kcData = rs || [];
        })
        .catch(() => { });
    },
    //获取数据
    getData() {
      this.listLoading = true;
      ggpyxxList(this.listQuery)
        .then(rs => {
          this.listLoading = false;
          this.dataList = rs.data || [];
          this.total = rs.count;
        })
        .catch(() => {
          this.listLoading = false;
        });
    }
  }
};
</script>

