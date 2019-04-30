<template>
  <div>
    <p v-if="!currentRole() && info && !type" class="font-110">{{ info.name || '--' }} （ {{ info.account||'--' }} ）
      <el-button v-waves type="warning" size="mini" class="pull-right forright" @click="kaohe(info.id)">
        <svg-icon icon-class="shield" class="margin-right-5" />考核
      </el-button>
    </p>
    <p>
      <span>结业考核成绩：{{ info.jykhcj || '--' }} </span>
      <span class="margin-left-30">现实表现成绩：{{ info.xsbxcj || '--' }} </span>
      <span class="margin-left-30">考核结果：
        <span :class="info.khjg ? info.khjg==2 ? 'text-success' :'text-danger' :'' ">{{ info.khjg ? info.khjg==2 ? '通过' : '不通过' : '--' }} </span>
      </span>
    </p>
    <el-table v-loading="listLoading" :data="dataList" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort">
      <el-table-column align="center" type="index" width="45" fixed="left" />
      <el-table-column label="培训组号">
        <template slot="header" slot-scope="scope">
          <span>培训组号： {{ info && info.group_id ? info.group_id : '' }} {{ info && info.is_zz == 2 ? '（组长）' : '' }}</span>
        </template>
        <el-table-column min-width="110" prop="kcbh" label="课程编号" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="160" prop="title" label="课程名称" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="260" prop="times" label="课程时间" show-overflow-tooltip>
          <template slot-scope="d">
            <span v-if="d.row.times && d.row.times[0]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="80" prop="xs" label="学时" show-overflow-tooltip />
        <el-table-column min-width="180" prop="address" label="课程地点" show-overflow-tooltip />
        <el-table-column min-width="220" prop="info.xd" label="心得/内容" show-overflow-tooltip />
        <el-table-column min-width="130" prop="info.file.path" label="照片/材料" show-overflow-tooltip>
          <template slot-scope="d">
            <a v-if="d.row.info && d.row.info.file && d.row.info.file.url" :href="d.row.info.file.url" class="text-primary" target="_blank">
              <i class="el-icon-document" />
              照片/材料
            </a>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column v-if="currentRole()" align="right" label="操作" width="110" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="authCheck(120)" type="primary" size="mini" plain icon="el-icon-edit" @click="edit(scope.row.kid , scope.row.info)">提交心得</el-button>
        </template>
      </el-table-column>
    </el-table>
    <NewEdit :dialog-state="dialogState" :kid="kid" :pid="pid" @CB-kc="CB_kc" />
    <Assess :dialog-assess="dialogAssess" :assid="assid" @CB-assess="CB_assess" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import Assess from "../assess";
import NewEdit from "../newEdit";
import { kcList } from "@/api/dekt/lxxnjy/qmpxb";
import { publicMixin } from "@/api/mixins";

export default {
  name: "pxkc",
  directives: { waves },
  components: { Assess, NewEdit },
  mixins: [publicMixin],
  props: ["sid", "type"],
  data() {
    return {
      //table 参数
      listLoading: false,
      dataList: [],
      info: {},
      // 检索参数
      listQuery: {
        _sort: "desc",
        _order: "id"
      },
      multipleSelection: [],
      //新增、编辑Dialog
      dialogState: false,
      kid: null,
      pid: null,
      //考核
      dialogAssess: false,
      assid: null
    };
  },
  activated() {
    this.getData();
  },
  deactivated() {
    this.dataList = []
  },
  methods: {
    //排序
    handleSort(val) {
      this.listQuery._sort = val.order === "ascending" ? "asc" : "desc"
      this.listQuery._order = val.prop ? val.prop : "id"
      this.getData();
    },
    //编辑
    edit(kid, info) {
      this.dialogState = true;
      this.kid = kid;
      this.pid = info && info.id ? info.id : null
    },
    // dialog 回调
    CB_kc(val) {
      if (val === 1) {
        this.getData();
      }
      this.dialogState = false;
      this.kid = null;
      this.pid = null
    },
    //考核
    kaohe(id) {
      this.assid = id
      this.dialogAssess = true
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
      let id = this.sid || 's'
      kcList(id)
        .then(rs => {
          this.listLoading = false;
          if (rs.info) {
            this.dataList = rs.data || [];
            this.info = rs.info;
          }
        })
        .catch(() => {
          this.listLoading = false;
        });
    }
  }
};
</script>
<style scoped>
.forright {
  position: absolute;
  right: 56px;
  z-index: 999;
}
</style>

