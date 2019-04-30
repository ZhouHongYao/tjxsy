<template>
  <div :style="{'height':clientHeight +'px', 'overflow-y': 'auto'}" class="dashboard-editor-container">
    <div class="margin-top-10">
      <pan-thumb :image="head" style="float: left" @changeImg="changeImg"> 修改头像 </pan-thumb>
      <div class="info-container">
        <div class="display_name">欢迎进入新生院学生综合素质评价系统</div>
        <div class="display_title">{{ name }}（{{ group_title }}），祝您开心每一天！</div>
      </div>
    </div>
    <keep-alive>
      <panel-group v-if="!currentRole()" />
    </keep-alive>
    <el-row :gutter="40">
      <el-col :lg="12">
        <div class="chart-wrapper">
          <span class="pull-left text-primary" style="line-height: 25px;">能力初评</span>
          <raddar-chart :indicator="indicator" :data="first" />
        </div>
      </el-col>
      <el-col :lg="12">
        <div class="chart-wrapper">
          <span class="pull-left text-primary" style="line-height: 25px;">一年总评/能力自评</span>
          <el-select v-model="xq" placeholder="请选择学期" style="width:180px;float:right" size="mini" @change="change">
            <el-option v-for=" item in xqData" :key="item.id" :label="item.value" :value="item.id" />
          </el-select>
          <raddar-chart :indicator="indicator" :data="second" />
        </div>
      </el-col>
    </el-row>

    <!-- 修改头像 -->
    <ImgUpload :dialog-visible="dialogVisible" @CB-ImgDialog="CB_ImgDialog" />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import PanelGroup from "@/views/dashboard/components/PanelGroup";
import ImgUpload from "@/views/layout/components/gaiInfoImg";
import PanThumb from "@/components/PanThumb";
import RaddarChart from "@/views/grxx/nlcp/components/RaddarChart";
import { nlzp } from "@/api/dashboard";
import { publicMixin } from "@/api/mixins";

const indicator = [
  { name: '学习能力', max: 10 },
  { name: '实践能力', max: 10 },
  { name: '创新能力', max: 10 },
  { name: '领导能力', max: 10 },
  { name: '跨文化能力', max: 10 }
]
const first = [
  {
    value: [0, 0, 0, 0, 0],
    name: '能力初评'
  }
]
const second = [
  {
    value: [0, 0, 0, 0, 0],
    name: '能力自评'
  }
]
const xqData = [{ id: 1, value: '第一学期' }, { id: 2, value: '第二学期' }]
export default {
  name: "DashboardAdmin",
  components: {
    PanelGroup, RaddarChart, ImgUpload, PanThumb
  },
  mixins: [publicMixin],
  data() {
    return {
      form: {},
      indicator,
      first,
      second,
      xq: 1,
      xqData,
      zp: [],
      dialogVisible: false,
      defaultImg: 'this.src="' + require("@/assets/images/photos/1.png") + '"',
      defaultImg2: 'this.src="' + require("@/assets/images/photos/6.png") + '"'
    };
  },
  computed: {
    ...mapGetters(["name", "head"]),
    ...mapState({
      sex: state => state.user.userinfo.sex,
      group_title: state => state.user.userinfo.group_title
    }),
    clientHeight() {
      return this.$store.state.clientHeight + 135
    }
  },
  activated() {
    this.getNlzp()
  },
  methods: {
    //修改头像回调
    CB_ImgDialog() {
      this.dialogVisible = false
    },
    changeImg(val) {
      if (val) {
        this.dialogVisible = true
      }
    },
    change(val) {
      this.second[0].value = this.zp[(val - 1)]
    },
    getNlzp() {
      this.loading = true
      nlzp()
        .then(rs => {
          this.zp = rs.zp;
          this.first[0].value = rs.cp || [0, 0, 0, 0, 0]
          this.second[0].value = rs.zp[0] || [0, 0, 0, 0, 0]
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
  .info-container {
    position: relative;
    margin-left: 150px;
    height: 150px;
    line-height: 160px;
    .display_name {
      font-size: 25px;
      line-height: 30px;
      color: #212121;
      position: absolute;
      top: 25px;
      overflow: hidden;
      white-space: nowrap;
    }
    .display_title {
      font-size: 18px;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      color: gray;
    }
  }
}
</style>
