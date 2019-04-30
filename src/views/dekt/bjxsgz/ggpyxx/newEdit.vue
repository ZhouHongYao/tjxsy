<template>
  <el-dialog v-el-drag-dialog :title="title" :visible="dialogState" :fullscreen="isphone()" :close-on-click-modal="false" width="780px" top="15vh" @close="handleClose" @open="openDialog">
    <div :style="{'height':isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
      <el-form ref="form" :model="form" :rules="rules" label-suffix="：" label-width="120px" class="margin-top-20">
        <el-form-item v-if="!currentRole()" label="学生姓名" prop="title" >
          {{ form.s_name || '--' }}
        </el-form-item>
        <el-form-item label="课程反馈" prop="kcfk" class="form_item margin-top-30">
          <el-input v-model="form.kcfk" :autosize="{ minRows: 6, maxRows: 15 }" type="textarea" maxlength="400" placeholder="请填写课程反馈" />
          还可填写
          <span class="text-danger">{{ 400-(form.kcfk ? form.kcfk.length : 0) }}</span> 个字符
        </el-form-item>
        <el-form-item label="上传" required>
          <plupload v-show="!form.file.url" :filters="filters" button_size="small" button-id="file" plain button_text="课程作业" @Callback-UploadProgress="CB_UploadProgress" @Callback-GetFileInfo="CB_GetFileInfo" />
          <el-row v-show="form.file.url">
            <el-col>
              <ul class="el-upload-list el-upload-list--text">
                <li class="el-upload-list__item is-success">
                  <a :href="form.file.url" class="el-upload-list__item-name blue" target="_blank">
                    <i class="el-icon-document" />
                    课程作业
                  </a>
                  <i class="el-icon-close" @click="file_close('file')" />
                  <label class="el-upload-list__item-status-label">
                    <i class="el-icon-upload-success el-icon-circle-check" />
                  </label>
                </li>
              </ul>
            </el-col>
          </el-row>
          <el-progress v-if="percent>0" :text-inside="true" :stroke-width="15" :percentage="percent" class="margin-top-5" />
          <div class="el-upload__tip" style="line-height: 25px;">
            支持上传图片（.png/.jpg/.gif）、PDF、压缩包（.rar/.zip）格式文件，大小不超过20MB。
          </div>
        </el-form-item>
        <LogDetail v-if="form.id && form.shenhelog && form.shenhelog.length>0" v-model="form" class="margin-bottom-20 margin-left-50" />
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-waves :loading="loading" type="primary" icon="el-icon-success" @click="handleKeep()"> 提交</el-button>
      <el-button v-loading="loading" v-waves v-if="type=='review'" type="success" @click="handleKeep('review')">
        <svg-icon icon-class="shield" class="margin-right-10" />保存并审核通过
      </el-button>
      <el-button v-loading="loading" v-waves v-if="type=='review'" type="danger" icon="el-icon-edit" @click="back()">
        退回修改
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令
import plupload from "@/components/plupload/index";
import LogDetail from "@/components/LogDetail";
import { ggpyxxEdit, ggpyxxRead, ggpyxxSh } from "@/api/dekt/bjxsgz/ggpyxx";
import { publicMixin } from "@/api/mixins";

const form = {
  tbid: "",
  kcfk: '',
  file: {
    url: "",
    path: "",
    name: ""
  }
}
export default {
  directives: { elDragDialog, waves },
  components: { plupload, LogDetail },
  mixins: [publicMixin],
  props: ["dialogState", "kcId", "type"],
  data() {
    return {
      title: "课程作业",
      listloading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      percent: 0,
      //限制上传文件
      filters: {
        max_file_size: "100mb",
        mime_types: [
          { title: "Image files", extensions: "jpg,gif,png" },
          { title: "Zip files", extensions: "zip" },
          { title: "Rar files", extensions: "rar" },
          { title: "PDF", extensions: "pdf" }
        ]
      },
      rules: {
        kcfk: [
          {
            required: true,
            message: "请填写课程反馈！",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      clientHeight: state => (state.clientHeight + 200) * 0.7 - 170
    })
  },
  methods: {
    openDialog() {
      if (this.kcId) {
        this.title = this.type == 'review' ? '审核课程作业' : '编辑课程作业';
        this.getRead();
      }
    },
    //上传进度
    CB_UploadProgress(file) {
      this.percent = file.percent;
    },
    //上传成功后的回调
    CB_GetFileInfo(res, id) {
      if (res && res.url) {
        this.form.file = res;
        this.percent = 0;
        this.$forceUpdate();
        this.$message({ message: "上传成功", type: "success" });
      } else {
        this.percent = 0;
        this.$message({ message: "上传失败", type: "error" });
      }
    },
    //刪除图片
    file_close(type) {
      this.form.file.url = "";
      this.form.file.name = "";
      this.form.file.path = "";
      this.$forceUpdate();
    },
    //保存数据
    handleKeep(is_shenhe) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let api_type = this.kcId ? "put" : "post";
          this.loading = true;
          if (is_shenhe && is_shenhe == 'review') {
            this.form.status = 2
          }
          ggpyxxEdit(this.form, api_type)
            .then(rs => {
              this.$message({
                message: "提交成功！",
                type: "success"
              });
              this.loading = false;
              this.clear();
              this.$emit("CB-ggpyxx", 1);
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    // 退回
    back() {
      this.$prompt("请填写退回原因：", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            let beizhu = instance.inputValue;
            if (!beizhu) {
              instance.confirmButtonLoading = false;
              this.$message.error("请填写退回原因！");
              return;
            } else {
              ggpyxxSh(
                {
                  id: this.form.id,
                  status: 3,
                  beizhu: beizhu
                },
                "put"
              )
                .then(rs => {
                  instance.confirmButtonLoading = false;
                  done();
                  this.$emit("CB-ggpyxx", 1);
                })
                .catch(() => {
                  instance.confirmButtonLoading = false;
                });
            }
          } else {
            done();
          }
        }
      })
        .then(() => {
          this.clear();
          this.$emit("CB-ggpyxx", 1);
          this.$message({
            message: "操作成功！",
            type: "success"
          });
        })
        .catch(() => { });
    },
    //获取详情
    getRead() {
      this.listloading = true;
      ggpyxxRead(this.kcId)
        .then(rs => {
          this.form = rs;
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
        });
    },
    //清空数据
    clear() {
      this.title = "课程作业";
      this.form = JSON.parse(JSON.stringify(form));
      this.$refs["form"].resetFields();
    },
    //关闭
    handleClose() {
      this.clear();
      this.$emit("CB-ggpyxx", false);
    }
  }
};
</script>
