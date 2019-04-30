<template>
  <div v-loading="listLoading" class="app-container" element-loading-text="数据载入中">
    <keep-alive>
      <stuInfo v-if="$route.query.sid && !currentRole()" :sid="$route.query.sid" />
    </keep-alive>
    <div class="filter-container">
      <h3>{{ $route.meta.title }}
        <goBack v-if="currentRole()" class="pull-right" />
      </h3>
    </div>
    <el-row>
      <el-col :sm="24" :md="24" :lg="12">
        <el-form label-suffix="：" label-width="130px" class="padding-top-20">
          <el-form-item label="学期" prop="xq" class="form_item">
            {{ form.xq ? form.xq == 1 ? '第一学期' : '第二学期' : '--' }}
          </el-form-item>
          <el-form-item label="逻辑思维能力" class="form_item">
            <p class="no-margin">思考、说话、做事均条理清晰，有条不紊，主次分明</p>
            {{ form.ljsw||'--' }} 分
          </el-form-item>
          <el-form-item label="辩证思维能力" class="form_item">
            <p class="no-margin">具有批判精神，敢于挑战权威，能多角度、辩证地分析问题</p>
            {{ form.bzsw||'--' }} 分
          </el-form-item>
          <el-form-item label="创新意识" class="form_item">
            <p class="no-margin">不满于现状，具有好奇心和想象力，乐于尝试改变现状</p>
            {{ form.cxys||'--' }} 分
          </el-form-item>
          <el-form-item label="顽强的意志品质" class="form_item">
            <p class="no-margin">具有良好的心理素质和一定的抗压能力，能够坚持将艰苦的探索活动进行到底</p>
            {{ form.yzpz||'--' }} 分
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :sm="24" :md="24" :lg="12">
        <div class="chart-wrapper">
          <raddar-chart :indicator="indicator" :data="data" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import RaddarChart from "@/views/grxx/nlcp/components/RaddarChart";
import stuInfo from "@/views/grxx/nlcp/components/stuInfo";
import goBack from "@/components/goBack";
import { cxnlzpRead } from "@/api/ynzp/nlzp/cxnlzp";
import { publicMixin } from "@/api/mixins";

const form = {
  ljsw: 8,
  bzsw: 7.5,
  cxys: 9,
  yzpz: 7
}
const indicator = [
  { name: '逻辑思维能力', max: 10 },
  { name: '辩证思维能力', max: 10 },
  { name: '创新意识', max: 10 },
  { name: '顽强的意志品质', max: 10 }
]
const data = [
  {
    value: [0, 0, 0, 0],
    name: '创新能力'
  }
]
export default {
  components: { RaddarChart, stuInfo, goBack },
  mixins: [publicMixin],
  data() {
    return {
      listLoading: false,
      form: JSON.parse(JSON.stringify(form)),
      indicator,
      data,
      rules: {}
    }
  },
  activated() {
    this.change()
    if (this.$route.query.id) {
      this.getRead()
    }
  },
  deactivated() {
    this.form = JSON.parse(JSON.stringify(form))
  },
  methods: {
    //评分变化
    change() {
      this.data[0].value = [this.form.ljsw, this.form.bzsw, this.form.cxys, this.form.yzpz]
      this.$forceUpdate()
    },
    //获取数据
    getRead() {
      this.listloading = true;
      cxnlzpRead(this.$route.query.id)
        .then(rs => {
          this.form = rs;
          this.change()
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
        });
    }
  }
}
</script>
