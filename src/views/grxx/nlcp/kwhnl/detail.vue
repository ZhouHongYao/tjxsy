<template>
  <div v-loading="listLoading" class="app-container" element-loading-text="数据载入中">
    <keep-alive>
      <stuInfo v-if="$route.query.sid" :sid="$route.query.sid" />
    </keep-alive>
    <div class="filter-container">
      <h3>{{ $route.meta.title }}</h3>
    </div>
    <el-row>
      <el-col :sm="24" :md="24" :lg="12">
        <el-form label-suffix="：" label-width="140px" class="padding-top-20">
          <el-form-item label="包容能力" class="form_item">
            <p class="no-margin">愿意接受不同文化，对存在差异的人和事保持一种开放的态度，能够包容和尊重他人</p>
            {{ form.brnl || '--' }} 分
          </el-form-item>
          <el-form-item label="语言能力" class="form_item">
            <p class="no-margin">能够用英语等语种及身体语言与不同国家的友人进行交流</p>
            {{ form.yynl || '--' }} 分
          </el-form-item>
          <el-form-item label="跨文化实施能力" class="form_item">
            <p class="no-margin">能够与不同文化背景的人合作共生，共同完成课业、项目等事项</p>
            {{ form.kwhssnl || '--' }} 分
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
import { kwhnlRead } from "@/api/grxx/nlcp/kwhnl";
import stuInfo from "@/views/grxx/nlcp/components/stuInfo";

const form = {
  brnl: 0,
  yynl: 0,
  kwhssnl: 0
}
const indicator = [
  { name: '包容能力', max: 10 },
  { name: '语言能力', max: 10 },
  { name: '跨文化实施能力', max: 10 }
]
const data = [
  {
    value: [0, 0, 0],
    name: '跨文化能力'
  }
]
export default {
  components: { RaddarChart, stuInfo },
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
      this.data[0].value = [this.form.brnl, this.form.yynl, this.form.kwhssnl]
      this.$forceUpdate()
    },
    //获取数据
    getRead() {
      this.listloading = true;
      kwhnlRead(this.$route.query.id)
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
