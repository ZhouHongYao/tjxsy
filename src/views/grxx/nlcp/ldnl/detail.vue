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
        <el-form label-suffix="：" label-width="120px" class="padding-top-20">
          <el-form-item label="表达能力" class="form_item">
            <p class="no-margin">具有良好的写作能力与口头表达能力，文笔流畅、思维条理清晰</p>
            {{ form.bdnl || '--' }} 分
          </el-form-item>
          <el-form-item label="协作能力" class="form_item">
            <p class="no-margin">具有较强的沟通能力、协调能力及出色的团队合作能力</p>
            {{ form.xznl || '--' }} 分
          </el-form-item>
          <el-form-item label="领袖意识" class="form_item">
            <p class="no-margin">能够独立思考，敢于表达自己的观点，善于凝聚团队力量</p>
            {{ form.lxys || '--' }} 分
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
import { ldnlRead } from "@/api/grxx/nlcp/ldnl";

const form = {
  bdnl: 0,
  xznl: 0,
  lxys: 0
}
const indicator = [
  { name: '表达能力', max: 10 },
  { name: '协作能力', max: 10 },
  { name: '领袖意识', max: 10 }
]
const data = [
  {
    value: [0, 0, 0],
    name: '领导能力'
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
      this.data[0].value = [this.form.bdnl, this.form.xznl, this.form.lxys]
      this.$forceUpdate()
    },
    //获取数据
    getRead() {
      this.listloading = true;
      let id = this.$route.query.id || 's'
      ldnlRead(id)
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

