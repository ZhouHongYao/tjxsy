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
        <el-form label-suffix="：" label-width="130px" class="padding-top-20">
          <el-form-item label="学习兴趣" class="form_item">
            <p class="no-margin">具有探索新知识或新学科的兴趣</p>
            {{ form.xxxq }} 分
          </el-form-item>
          <el-form-item label="自学能力" class="form_item">
            <p class="no-margin">具备基本的自学能力，能够通过书本、网络等途径掌握新知识和新技能，并且能将所学知识形成体系，掌握事物发展的规律</p>
            {{ form.zxnl }} 分
          </el-form-item>
          <el-form-item label="终身学习" class="form_item">
            <p class="no-margin">能够保持学习热情，坚持学习新知识</p>
            {{ form.zsxx }} 分
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
import { xxnlRead } from "@/api/grxx/nlcp/xxnl";

const form = {
  xxxq: 6,
  zxnl: 9,
  zsxx: 7
}
const indicator = [
  { name: '学习兴趣', max: 10 },
  { name: '自学能力', max: 10 },
  { name: '终身学习', max: 10 }
]
const data = [
  {
    value: [6, 9, 7],
    name: '学习能力'
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
      this.data[0].value = [this.form.xxxq, this.form.zxnl, this.form.zsxx]
      this.$forceUpdate()
    },
    //获取数据
    getRead() {
      this.listloading = true;
      xxnlRead(this.$route.query.id)
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

