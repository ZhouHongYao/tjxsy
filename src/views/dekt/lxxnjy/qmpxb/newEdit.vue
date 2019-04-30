<template>
  <el-dialog v-el-drag-dialog :visible="dialogState" :fullscreen="isphone()" :close-on-click-modal="false" title="提交心得" width="700px" top="15vh" @close="handleClose" @open="openDialog">
    <div :style="{'height': isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
      <el-form v-loading="listloading" ref="form" :model="form" class="padding-right-5" label-suffix="：" label-width="120px" element-loading-text="数据载入中">
        <el-form-item label="心得/内容" prop="xd">
          <el-input :autosize="{ minRows: 6, maxRows: 10}" v-model="form.xd" type="textarea" maxlength="300" placeholder="请填写心得/内容" />
          还可填写
          <span class="text-danger">{{ 500 - (form.xd ? form.xd.length : 0) }}</span> 个字符
        </el-form-item>
        <el-form-item label="上传">
          <plupload v-show="!form.file.url" :filters="filters" button_size="small" button-id="file" plain button_text="照片或材料" @Callback-UploadProgress="CB_UploadProgress" @Callback-GetFileInfo="CB_GetFileInfo" />
          <el-row v-show="form.file.url">
            <el-col>
              <ul class="el-upload-list el-upload-list--text">
                <li class="el-upload-list__item is-success">
                  <a :href="form.file.url" class="el-upload-list__item-name blue" target="_blank">
                    <i class="el-icon-document" />
                    照片或材料
                  </a>
                  <i class="el-icon-close" @click="file_close('file')" />
                  <label class="el-upload-list__item-status-label">
                    <i class="el-icon-upload-success el-icon-circle-check" />
                  </label>
                </li>
              </ul>
            </el-col>
          </el-row>
          <el-progress v-if="percent>0" :text-inside="true" :stroke-width="15" :percentage="percent" :status="status" class="margin-top-5" />
          <div class="el-upload__tip" style="line-height: 25px;">
            支持上传图片（.png/.jpg/.gif）、PDF、压缩包（.rar/.zip）格式文件，大小不超过20MB。
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-waves :loading="loading" type="primary" icon="el-icon-success" @click="handleKeep()"> 提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import plupload from "@/components/plupload/index";
import waves from "@/directive/waves"; // 水波纹指令
import { qmpxbEdit, qmpxbRead } from "@/api/dekt/lxxnjy/qmpxb";
import { publicMixin } from "@/api/mixins";

const form = {
  xd: "",
  file: {
    url: "",
    path: "",
    name: ""
  }
};
export default {
  directives: { elDragDialog, waves },
  components: { plupload },
  mixins: [publicMixin],
  props: ["dialogState", "kid", "pid"],
  data() {
    return {
      listloading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      percent: 0,
      status: "success",
      //限制上传文件
      filters: {
        max_file_size: "100mb",
        mime_types: [
          { title: "Image files", extensions: "jpg,gif,png" },
          { title: "Zip files", extensions: "zip" },
          { title: "Rar files", extensions: "rar" },
          { title: "PDF", extensions: "pdf" }
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
      if (this.pid) {
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
        this.status = "success";
        this.$message({ message: "上传成功", type: "success" });
      } else {
        this.percent = 0;
        this.status = "exception";
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
      let api_type = this.pid ? "put" : "post";
      this.loading = true;
      this.$set(this.form, 'kid', this.kid)
      qmpxbEdit(this.form, api_type)
        .then(rs => {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.loading = false;
          this.clear();
          this.$emit("CB-kc", 1);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    //获取详情
    getRead() {
      this.listloading = true;
      qmpxbRead(this.pid)
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
      this.form = JSON.parse(JSON.stringify(form));
      this.$refs["form"].resetFields();
    },
    //关闭
    handleClose() {
      this.clear();
      this.$emit("CB-kc", false);
    }
  }
};
</script>
