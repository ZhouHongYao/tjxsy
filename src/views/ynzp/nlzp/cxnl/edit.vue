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
import Sticky from "@/components/Sticky"; // 粘性header组件
import RaddarChart from "@/views/grxx/nlcp/components/RaddarChart";
import stuInfo from "@/views/grxx/nlcp/components/stuInfo";
import goBack from "@/components/goBack";
import { cxnlzpEdit, cxnlzpRead } from "@/api/ynzp/nlzp/cxnlzp";
import { publicMixin } from "@/api/mixins";

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
    value: [0, 0, 0, 0],
    name: '创新能力'
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
      this.data[0].value = [this.form.ljsw, this.form.bzsw, this.form.cxys, this.form.yzpz]
      this.$forceUpdate()
    },
    //提交
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          let api_type = this.form.id ? "put" : "post";
          cxnlzpEdit(this.form, api_type)
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
