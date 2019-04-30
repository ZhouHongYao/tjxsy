<template>
  <div v-loading="listloading" class="createPost-container" element-loading-text="数据载入中">
    <sticky :z-index="10" class-name="sub-navbar">
      <el-button-group>
        <el-button v-loading="loading" v-waves type="primary" icon="el-icon-success" @click="submitForm">
          提交
        </el-button>
      </el-button-group>
      <goBack v-if="!currentRole()" style="margin-left: 10px;" />
    </sticky>

    <div class="createPost-main-container">
      <el-form v-loading="listloading" ref="form" :model="form" :rules="rules" label-position="top" element-loading-text="数据载入中">
        <el-row>
          <el-col :span="24">
            <el-form-item label="学习方法和习惯发生哪些改变？" prop="ffxg">
              <el-input :autosize="{ minRows: 5, maxRows: 10}" v-model="form.ffxg" type="textarea" maxlength="150" placeholder="请填写详细内容" />
              还可填写
              <span class="text-danger">{{ 150 - (form.ffxg ? form.ffxg.length : 0) }}</span> 个字符
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="学习困难出现在哪里？" prop="xxkn">
              <el-input :autosize="{ minRows: 5, maxRows: 10}" v-model="form.xxkn" type="textarea" maxlength="150" placeholder="请填写详细内容" />
              还可填写
              <span class="text-danger">{{ 150 - (form.xxkn ? form.xxkn.length : 0) }}</span> 个字符
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="擅长哪些科目？感兴趣的科目？非常不擅长的科目？" prop="sckm">
              <el-input :autosize="{ minRows: 5, maxRows: 10}" v-model="form.sckm" type="textarea" maxlength="150" placeholder="请填写详细内容" />
              还可填写
              <span class="text-danger">{{ 150 - (form.sckm ? form.sckm.length : 0) }}</span> 个字符
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="大一学年学业成绩自我满意度评分" prop="sckm">
              <el-slider v-model="form.zwpf" :step="0.5" :max="10" show-stops show-input @change="checkPf" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import MDinput from "@/components/MDinput";
import Sticky from "@/components/Sticky"; // 粘性header组件
import waves from "@/directive/waves"; // 水波纹指令
import { publicMixin } from "@/api/mixins";
import { xyzpRead, xyzpEdit } from "@/api/dekt/zzyrgz/xyzp";
import Plupload from "@/components/plupload/index";
import goBack from "@/components/goBack";

const form = {
  ffxg: "", //学习方法和习惯发生哪些改变
  xxkn: "", //学习困难出现在哪里
  sckm: "", //擅长哪些科目？感兴趣的科目？非常不擅长的科目
  zwpf: 0 //大一学年学业成绩自我满意度评分
};

export default {
  directives: { waves },
  components: { MDinput, Sticky, Plupload, goBack },
  mixins: [publicMixin],
  data() {
    return {
      listloading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      rules: {

      }
    };
  },
  activated() {
    this.getInfo()
  },
  deactivated() {
    this.form = JSON.parse(JSON.stringify(form));
    this.$refs["form"].resetFields();
  },
  methods: {
    checkPf(val) {
      if (val) {
        let num = val * 10 % 5
        if (num != 0) {
          this.form.zwpf = 0;
          this.$message({
            message: "请填写正确评分！",
            type: "warning"
          });
        }
      }
    },
    // 获取详情
    getInfo() {
      this.listloading = true;
      let id = this.$route.query.id || 's'
      xyzpRead(id)
        .then(rs => {
          this.form = rs;
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
        });
    },
    // 提交
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          let method = this.form.id ? "put" : "post";
          xyzpEdit(this.form, method)
            .then(rs => {
              this.loading = false;
              let visitedViews = this.$store.state.tagsView.visitedViews;
              this.$store
                .dispatch(
                  "delView",
                  visitedViews.find(item => {
                    return item.name === this.$route.name;
                  })
                )
                .then(() => {
                  this.$router.go(-1);
                });
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .hr_balel {
      border: 0;
      background-color: #e4e4e4;
      height: 1px;
    }
    .form_item {
      margin-bottom: 40px !important;
      height: 36px;
    }
    .label_height {
      height: 36px !important;
    }
    .time {
      width: 100%;
    }
  }
}
</style>

