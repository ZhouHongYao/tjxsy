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
      <el-form ref="form" :model="form" :rules="rules" label-suffix="：" label-width="120px" class="margin-top-20">
        <el-form-item label="执行能力" prop="zxnl" class="form_item">
          <p class="no-margin">具有时间观念，做事不拖延，能够按计划推进工作</p>
          <el-slider v-model="form.zxnl" :step="0.5" :max="10" show-input @change="change" />
        </el-form-item>
        <el-form-item label="资源运用能力" prop="zyyynl" class="form_item">
          <p class="no-margin">能将学到的东西，落实到行动上，能够综合运用所学知识、信息、技术分析并解决问题。</p>
          <el-slider v-model="form.zyyynl" :step="0.5" :max="10" show-input @change="change" />
        </el-form-item>
        <el-form-item label="工程实践能力" prop="gcsjnl" class="form_item">
          <p class="no-margin">能够保持学习热情，坚持学习新知识</p>
          <el-slider v-model="form.gcsjnl" :step="0.5" :max="10" show-input @change="change" />
        </el-form-item>
        <el-form-item label="工匠精神" prop="gjjs" class="form_item">
          <p class="no-margin">不满足问题的基本解决，力求精益求精</p>
          <el-slider v-model="form.gjjs" :step="0.5" :max="10" show-input @change="change" />
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
import { sjnlEdit, sjnlRead } from "@/api/grxx/nlcp/sjnl";
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
      this.data[0].value = [this.form.zxnl, this.form.zyyynl, this.form.gcsjnl, this.form.gjjs]
      this.$forceUpdate()
    },
    //保存
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          let api_type = this.form.id ? "put" : "post";
          sjnlEdit(this.form, api_type)
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
      sjnlRead(id)
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

