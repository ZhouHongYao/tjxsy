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
        <el-form-item label="学习兴趣" prop="xxxq" class="form_item">
          <p class="no-margin">具有探索新知识或新学科的兴趣</p>
          <el-slider v-model="form.xxxq" :step="0.5" :max="10" show-input @change="change" />
        </el-form-item>
        <el-form-item label="自学能力" prop="zxnl" class="form_item">
          <p class="no-margin">具备基本的自学能力，能够通过书本、网络等途径掌握新知识和新技能，并且能将所学知识形成体系，掌握事物发展的规律</p>
          <el-slider v-model="form.zxnl" :step="0.5" :max="10" show-input @change="change" />
        </el-form-item>
        <el-form-item label="终身学习" prop="zsxx" class="form_item">
          <p class="no-margin">能够保持学习热情，坚持学习新知识</p>
          <el-slider v-model="form.zsxx" :step="0.5" :max="10" show-input @change="change" />
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
import { xxnlzpEdit, xxnlzpRead } from "@/api/ynzp/nlzp/xxnlzp";
import { publicMixin } from "@/api/mixins";

const form = {
  xq: null,
  xxxq: 0,
  zxnl: 0,
  zsxx: 0
}
const indicator = [
  { name: '学习兴趣', max: 10 },
  { name: '自学能力', max: 10 },
  { name: '终身学习', max: 10 }
]
const data = [
  {
    value: [0, 0, 0],
    name: '学习能力'
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
      this.data[0].value = [this.form.xxxq, this.form.zxnl, this.form.zsxx]
      this.$forceUpdate()
    },
    //提交
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          let api_type = this.form.id ? "put" : "post";
          xxnlzpEdit(this.form, api_type)
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
      xxnlzpRead(this.$route.query.id)
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

