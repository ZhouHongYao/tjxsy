<template>
  <div v-loading="listLoading" element-loading-text="数据载入中">
    <sticky :z-index="10" class-name="sub-navbar">
      <el-button v-loading="loading" v-waves type="primary" icon="el-icon-success" @click="save">
        提交
      </el-button>
      <goBack style="margin-left: 10px;" />
    </sticky>
    <div class="app-container">
      <keep-alive>
        <stuInfo v-if="$route.query.sid && !currentRole()" :sid="$route.query.sid" type="edit" />
      </keep-alive>
      <el-form ref="form" :model="form" :rules="rules" label-suffix="：" label-width="100px" class="margin-top-20">
        <el-form-item label="学期" prop="xq" class="form_item">
          <el-select v-model="form.xq" placeholder="请选择学期" style="width:320px;">
            <el-option v-for=" item in xqData" :key="item.id" :label="item.value" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="包容能力" prop="brnl" class="form_item">
          <p class="no-margin">愿意接受不同文化，对存在差异的人和事保持一种开放的态度，能够包容和尊重他人</p>
          <el-slider v-model="form.brnl" :step="0.5" :max="10" show-input @change="change" />
        </el-form-item>
        <el-form-item label="语言能力" prop="yynl" class="form_item">
          <p class="no-margin">能够用英语等语种及身体语言与不同国家的友人进行交流</p>
          <el-slider v-model="form.yynl" :step="0.5" :max="10" show-input @change="change" />
        </el-form-item>
        <el-form-item label="跨文化实施能力" prop="kwhssnl" class="form_item">
          <p class="no-margin">能够与不同文化背景的人合作共生，共同完成课业、项目等事项</p>
          <el-slider v-model="form.kwhssnl" :step="0.5" :max="10" show-input @change="change" />
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
import { kwhnlzpEdit, kwhnlzpRead } from "@/api/ynzp/nlzp/kwhnlzp";
import { publicMixin } from "@/api/mixins";

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
const xqData = [{ id: 1, value: '第一学期' }, { id: 2, value: '第二学期' }]

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
      xqData,
      rules: {

      }
    }
  },
  activated() {
    this.change()
    if (this.$route.query.id) {
      this.getRead();
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
    //提交
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          let api_type = this.form.id ? "put" : "post";
          kwhnlzpEdit(this.form, api_type)
            .then(rs => {
              this.$message({
                message: "提交成功！",
                type: "success"
              });
              this.loading = false;
              this.backout()
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
      kwhnlzpRead(this.$route.query.id)
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
