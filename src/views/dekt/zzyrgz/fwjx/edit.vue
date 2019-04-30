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
            <el-form-item label="在承担家庭责任方面做了哪些努力？" prop="jtzr">
              <el-input :autosize="{ minRows: 6, maxRows: 10}" v-model="form.jtzr" type="textarea" maxlength="200" placeholder="请填写详细内容" />
              还可填写
              <span class="text-danger">{{ 200- (form.jtzr ? form.jtzr.length : 0) }}</span> 个字符
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="对家乡的发展有哪些关注？" prop="jxgz">
              <el-input :autosize="{ minRows: 6, maxRows: 10}" v-model="form.jxgz" type="textarea" maxlength="200" placeholder="请填写详细内容" />
              还可填写
              <span class="text-danger">{{ 200- (form.jxgz ? form.jxgz.length : 0) }}</span> 个字符
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="在服务家乡发展方面做了哪些工作？" prop="fwjx">
              <el-input :autosize="{ minRows: 6, maxRows: 10}" v-model="form.fwjx" type="textarea" maxlength="200" placeholder="请填写详细内容" />
              还可填写
              <span class="text-danger">{{ 200- (form.fwjx ? form.fwjx.length :0 ) }}</span> 个字符
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
import { fwjxRead, fwjxEdit } from "@/api/dekt/zzyrgz/fwjx";
import Plupload from "@/components/plupload/index";
import goBack from "@/components/goBack";

const form = {
  jtzr: "",
  jxgz: "",
  fwjx: ""
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
      fwjxRead(id)
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
          fwjxEdit(this.form, method)
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

