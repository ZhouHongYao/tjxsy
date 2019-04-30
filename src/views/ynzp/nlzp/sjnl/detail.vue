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
          <el-form-item label="执行能力" class="form_item">
            <p class="no-margin">具有时间观念，做事不拖延，能够按计划推进工作</p>
            {{ form.zxnl || '--' }} 分
          </el-form-item>
          <el-form-item label="资源运用能力" class="form_item">
            <p class="no-margin">能将学到的东西，落实到行动上，能够综合运用所学知识、信息、技术分析并解决问题</p>
            {{ form.zyyynl || '--' }} 分
          </el-form-item>
          <el-form-item label="工程实践能力" class="form_item">
            <p class="no-margin">具有较强的知识转化能力，能够运用专业知识及技能解决实际工程及生产中的问题</p>
            {{ form.gcsjnl || '--' }} 分
          </el-form-item>
          <el-form-item label="工匠精神" class="form_item">
            <p class="no-margin">不满足问题的基本解决，力求精益求精</p>
            {{ form.gjjs || '--' }} 分
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
import { sjnlzpRead } from "@/api/ynzp/nlzp/sjnlzp";
import { publicMixin } from "@/api/mixins";

const form = {
  zxnl: 0,
  zyyynl: 0,
  gcsjnl: 0,
  gjjs: 0
}
const indicator = [
  { name: '执行能力', max: 10 },
  { name: '资源运用能力', max: 10 },
  { name: '工程实践能力', max: 10 },
  { name: '工匠精神', max: 10 }
]
const data = [
  {
    value: [0, 0, 0, 0],
    name: '实践能力'
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
      this.data[0].value = [this.form.zxnl, this.form.zyyynl, this.form.gcsjnl, this.form.gjjs]
      this.$forceUpdate()
    },
    //获取数据
    getRead() {
      this.listloading = true;
      sjnlzpRead(this.$route.query.id)
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

