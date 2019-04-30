<template>
  <div v-loading="listLoading" element-loading-text="数据载入中">
    <sticky :z-index="10" class-name="sub-navbar">
      <el-button v-loading="loading" v-waves type="primary" icon="el-icon-success" @click="save">
        提交
      </el-button>
      <goBack v-if="!currentRole()" style="margin-left: 10px;" />
    </sticky>
    <div class="app-container">
      <keep-alive>
        <stuInfo v-if="$route.query.sid" :sid="$route.query.sid" type="edit" />
      </keep-alive>
      <el-form ref="form" :model="form" :rules="rules" label-suffix="：" label-width="130px" class="margin-top-20">
        <el-form-item label="逻辑思维能力" prop="ljsw" class="form_item">
          <p class="no-margin">思考、说话、做事均条理清晰，有条不紊，主次分明</p>
          <el-slider v-model="form.ljsw" :step="0.5" :max="10" show-input @change="change" />
        </el-form-item>
        <el-form-item label="辩证思维能力" prop="bzsw" class="form_item">
          <p class="no-margin">具有批判精神，敢于挑战权威，能多角度、辩证地分析问题</p>
          <el-slider v-model="form.bzsw" :step="0.5" :max="10" show-input @change="change" />
        </el-form-item>
        <el-form-item label="创新意识" prop="cxys" class="form_item">
          <p class="no-margin">不满于现状，具有好奇心和想象力，乐于尝试改变现状</p>
          <el-slider v-model="form.cxys" :step="0.5" :max="10" show-input @change="change" />
        </el-form-item>
        <el-form-item label="顽强的意志品质" prop="yzpz" class="form_item">
          <p class="no-margin">具有良好的心理素质和一定的抗压能力，能够坚持将艰苦的探索活动进行到底</p>
          <el-slider v-model="form.yzpz" :step="0.5" :max="10" show-input @change="change" />
        </el-form-item>
      </el-form>

      <div class="chart-wrapper">
        <raddar-chart :indicator="indicator" :data="data" />
      </div>
    </div>
  </div>
</template>
<script>
import waves from "@/directive/waves"; // 水波纹指令
import goBack from "@/components/goBack";
import RaddarChart from "@/views/grxx/nlcp/components/RaddarChart";
import stuInfo from "@/views/grxx/nlcp/components/stuInfo";
import { cxnlEdit, cxnlRead } from "@/api/grxx/nlcp/cxnl";
import { publicMixin } from "@/api/mixins";
import Sticky from "@/components/Sticky"; // 粘性header组件

const form = {
  ljsw: 0,
  bzsw: 0,
  cxys: 0,
  yzpz: 0
}
const indicator = [
  { name: '逻辑思维能力', max: 10 },
  { name: '辩证思维能力', max: 10 },
  { name: '创新意识', max: 10 },
  { name: '顽强的意志品质', max: 10 }
]
const data = [
  {
    value: [0, 0, 0],
    name: '创新能力'
  }
]
export default {
  directives: { waves },
  components: { RaddarChart, stuInfo, goBack, Sticky },
  mixins: [publicMixin],
  data() {
    return {
      listLoading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      indicator,
      data,
      rules: {}
    }
  },
  activated() {
    this.change()
    this.getRead()
  },
  deactivated() {
    this.form = JSON.parse(JSON.stringify(form))
  },
  methods: {
    //评分变化
    change(val) {
      this.data[0].value = [this.form.ljsw, this.form.bzsw, this.form.cxys, this.form.yzpz]
      this.$forceUpdate()
    },
    //保存
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          let api_type = this.form.id ? "put" : "post";
          cxnlEdit(this.form, api_type)
            .then(rs => {
              this.$message({
                message: "提交成功！",
                type: "success"
              });
              this.loading = false;
              if (this.currentRole()) {
                this.getRead()
              } else {
                this.backout()
              }
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    //获取数据
    getRead() {
      this.listloading = true;
      let id = this.$route.query.id || 's'
      cxnlRead(id)
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
