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
        <el-form-item label="表达能力" prop="bdnl" class="form_item">
          <p class="no-margin">具有良好的写作能力与口头表达能力，文笔流畅、思维条理清晰</p>
          <el-slider v-model="form.bdnl" :step="0.5" :max="10" show-input @change="change" />
        </el-form-item>
        <el-form-item label="协作能力" prop="xznl" class="form_item">
          <p class="no-margin">具有较强的沟通能力、协调能力及出色的团队合作能力</p>
          <el-slider v-model="form.xznl" :step="0.5" :max="10" show-input @change="change" />
        </el-form-item>
        <el-form-item label="领袖意识" prop="lxys" class="form_item">
          <p class="no-margin">能够独立思考，敢于表达自己的观点，善于凝聚团队力量</p>
          <el-slider v-model="form.lxys" :step="0.5" :max="10" show-input @change="change" />
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
import Sticky from "@/components/Sticky"; // 粘性header组件
import RaddarChart from "@/views/grxx/nlcp/components/RaddarChart";
import stuInfo from "@/views/grxx/nlcp/components/stuInfo";
import goBack from "@/components/goBack";
import { ldnlEdit, ldnlRead } from "@/api/grxx/nlcp/ldnl";
import { publicMixin } from "@/api/mixins";

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
    change() {
      this.data[0].value = [this.form.bdnl, this.form.xznl, this.form.lxys]
      this.$forceUpdate()
    },
    //保存
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          let api_type = this.form.id ? "put" : "post";
          ldnlEdit(this.form, api_type)
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
