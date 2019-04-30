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
          <el-table :data="form.xxqk" border style="width: 100%" class="margin-bottom-30">
            <el-table-column label="担任班级或学生会干部">
              <template slot="header" slot-scope="scope">
                <span>担任班级或学生会干部</span>
              </template>
              <el-table-column prop="zw" label="职务" min-width="80" show-overflow-tooltip />
              <el-table-column prop="start_time" label="任职时间" min-width="200" show-overflow-tooltip>
                <template slot-scope="d">
                  <span v-if="d.row.start_time">{{ d.row.start_time }} ~ {{ d.row.end_time }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="dw" label="单位" min-width="150" show-overflow-tooltip />
              <el-table-column prop="zmr" label="证明人" />
            </el-table-column>
          </el-table>
          <el-col :span="24">
            <el-form-item label="大一学年在哪些方面获得了较大的能力提升" prop="nlts">
              <el-input :autosize="{ minRows: 6, maxRows: 10}" v-model="form.nlts" type="textarea" maxlength="200" placeholder="请填写详细内容" />
              还可填写
              <span class="text-danger">{{ 200- (form.nlts ? form.nlts.length : 0) }}</span> 个字符
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
import { zwczRead, zwczEdit } from "@/api/dekt/zzyrgz/zwcz";
import Plupload from "@/components/plupload/index";
import goBack from "@/components/goBack";

const form = {
  nlts: "",
  xxqk: []
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
      zwczRead(id)
        .then(rs => {
					this.form = rs;
					this.form.xxqk = rs.xsgbll && rs.xsgbs ? rs.xsgbll.concat(rs.xsgbs) : []
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
        });
    },
    // 保存
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          let method = this.form.id ? "put" : "post";
          zwczEdit(this.form, method)
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

